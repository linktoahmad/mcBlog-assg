import express from 'express';
import { getJobs } from '../services/jobService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await getJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
