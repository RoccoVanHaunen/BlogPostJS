const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes will be added here

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Home page
app.get('/', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, posts) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('index', { posts });
      }
    });
  });
  
  // Admin panel
  app.get('/admin', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, posts) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('admin', { posts });
      }
    });
  });
  
  // Create new post
  app.post('/admin/posts', (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/admin');
      }
    });
  });
  
  // Edit post
  app.post('/admin/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/admin');
      }
    });
  });
  
  // Delete post
  app.post('/admin/posts/:id/delete', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM posts WHERE id = ?', id, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/admin');
      }
    });
  });