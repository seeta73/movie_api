const express = require('express');
const app = express();

let topMovies = [
  {
    1: 'Titanic',
  },
  {
    2: 'The Lion King'
  },
  {
    3: 'Inception',
  },
  {
    4: 'The Godfather'
  },
  {
    5: 'The Lord of the Rings: The Return of the King',
  },
  {
    6: 'The Batman'
  },
  {
    7: 'Source Code',
  },
  {
    8: 'Fantastc Beasts: The Secrets of Dumbledore'
  },
  {
    9: 'Thor: Love and Thunder',
  },
  {
    10: 'Sonic the Hedgehod 2'
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
