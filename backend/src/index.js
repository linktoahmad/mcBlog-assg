const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



app.get('/api/test', async (req, res) => {
    try {
        res.json({ message: "HELLO WORLD" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3001, () => {
    console.log('node running on port 3001');
});
