const express = require('express');
const app = express();

let topMovies = [
  {
    title: 'Titanic',
  },
  {
    title: 'The Lion King'
  },
  {
    title: 'Inception',
  },
  {
    title: 'The Godfather'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
  },
  {
    title: 'The Batman'
  },
  {
    title: 'Source Code',
  },
  {
    title: 'Fantastc Beasts: The Secrets of Dumbledore'
  },
  {
    title: 'Thor: Love and Thunder',
  },
  {
    title: 'Sonic the Hedgehod 2'
  }
];

app.get('/movies', (req, res)=> {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix movie app!');
})

app.listen(8080, () => {
  console.log('Welcome to the best myFlix movie app!');
});
