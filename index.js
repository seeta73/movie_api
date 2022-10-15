const express = require('express');
const app = express();

let topMovies = [
  {
    title: 'Titanic',
  },
  {
    title: 'The Lion King'
  }
];

app.get('/movies', (req, res)=> {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix movie app!');
})
