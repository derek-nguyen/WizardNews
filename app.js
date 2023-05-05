const express = require("express");
const morgan = require('morgan');
const path = require('path')
const { find, list } = require("./postBank");

// const postBank = require("./postBank");
const app = express();

app.use(morgan('dev'));

app.get("/posts", (req, res) => {
  const posts = list();
  // res.send(posts.map(post => post.id))
  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sigmar&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          ${posts.map(post => `
            <div class='news-item'>
              <p>
                <span class="news-position">${post.id}. ▲</span>
                <a href="/posts/${post.id}">${post.title}</a>
                <small>(by ${post.name})</small>
              </p>
              <small class="news-info">
                ${post.upvotes} upvotes | ${post.date}
              </small>
            </div>`
    ).join('')}
        </div>
      </body>
    </html>`
  )
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = find(id);

  if (!post.id) {
    throw new Error('Not Found')
  }

  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
            <div class='news-item'>
              <p>
                <span class="news-position">${post.id}. ▲</span>
                ${post.title}
                <small>(by ${post.name})</small>
              </p>
              <small class="news-info">
                ${post.upvotes} upvotes | ${post.date}
              </small>
            </div>
        </div>
      </body>
    </html>`
  )
})

app.use(express.static(path.join(__dirname, 'public')));

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});