import { Article } from '../config/database.js';
import { OpenRouter } from '@openrouter/sdk';
import { GoogleGenAI } from '@google/genai';
import { handleError } from '../utils/errorHandler.js';

const openRouter = new OpenRouter({ apiKey: process.env.OPENROUTER });
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateArticleJob = async (job) => {
  const { topic } = job.data;
  try {
    const articleData = await generateArticleFromTopic(topic);
    const imagePrompt = articleData.image_prompt || 'A generic blog image';
    const image = await generateImageFromPrompt(imagePrompt);
    await Article.create({ ...articleData, image });
  } catch (error) {
    handleError(error, 'Article Generation Job');
  }
};

// Text generation with OpenRouter
const generateArticleFromTopic = async (topic = null) => {
  const prompt = `
        You must respond using this exact format:

        <json>
        {
          "title": "max 5 words",
          "summary": "max 30 words",
          "content": "max 450 words",
          "image_prompt": "max 20 words"
        }
        </json>

        Rules:
        - Output MUST be valid JSON
        - Do not include any other text
        - All strings must be plain text, no quotes inside quotes

        Generate article for topic: "${topic ?? "A random interesting topic"}"
        `;

  try {
    const response = await openRouter.chat.send({
      model: 'tngtech/deepseek-r1t2-chimera:free',
      messages: [
        { role: 'system', content: 'Output must be valid JSON only. No commentary.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content || '';

    // Extract JSON inside <json> tags
    const match = raw.match(/<json>([\s\S]*?)<\/json>/);
    if (!match) throw new Error('JSON tags missing');

    let jsonStr = match[1].trim();

    // Cleanup control characters
    jsonStr = jsonStr.replace(/\s+/g, ' ');

    try {
      return JSON.parse(jsonStr);
    } catch {
      // Try auto-repair
      const fixResponse = await openRouter.chat.send({
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [
          { role: 'system', content: 'Fix JSON formatting. Respond with ONLY valid JSON.' },
          { role: 'user', content: `Fix this JSON so it is valid:\n${jsonStr}` }
        ]
      });

      const fixedRaw = fixResponse.choices[0].message.content || '';
      return JSON.parse(fixedRaw.trim());
    }

  } catch (error) {
    handleError(error, 'Content Generation');
    throw new Error('Failed to generate valid JSON article.');
  }
};


const generateImageFromPrompt = async (prompt) => {
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      generationConfig: {
        imageConfig: {
          aspectRatio: '1:1'
        }
      }
    });
    if (!response.candidates?.[0]?.content?.parts) {
      return null;
    }

    const parts = response.candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart) {
      return null;
    }
    const base64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || 'image/png';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    handleError(error, 'Image Generation');
    return null;
  }
};

export { generateArticleJob };
