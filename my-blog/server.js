const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/posts', async (req, res) => {
  const result = await pool.query('SELECT id, content FROM posts ORDER BY id DESC');
  const posts = result.rows.map(post => ({
    id: post.id,
    content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content
  }));
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'post.html'));
});

app.get('/api/post/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Post not found');
      }
  
      const post = result.rows[0];
      const content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
  
      res.json({
        id: post.id,
        name: post.name,
        content
      });
    } catch (err) {
      console.error('Error fetching post:', err);
      res.status(500).send('Internal server error');
    }
  });
  

app.get('/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new.html'));
});

app.post('/api/new', async (req, res) => {
  const { title, subtitle, excerpt, content } = req.body;

  const sampleImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=800&q=80'
  ];

  const randomIndex = Math.floor(Math.random() * sampleImages.length);
  const image = sampleImages[randomIndex];

  const postJSON = {
    title,
    subtitle,
    excerpt,
    content,
    image
  };

  await pool.query('INSERT INTO posts (name, content) VALUES ($1, $2)', [title, postJSON]);
  res.redirect('/');
});

app.delete('/api/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error deleting post:', err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
