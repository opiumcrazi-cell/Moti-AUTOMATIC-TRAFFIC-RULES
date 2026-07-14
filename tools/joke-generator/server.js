const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Simple proxy endpoint: /api/joke?category=Any&safe=true
app.get('/api/joke', async (req, res) => {
  try {
    const category = encodeURIComponent(req.query.category || 'Any');
    const safe = req.query.safe === 'true' ? '&safe-mode' : '';
    const url = `https://v2.jokeapi.dev/joke/${category}?type=single,twopart${safe}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'proxy error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Joke proxy listening on http://localhost:${PORT}`));
