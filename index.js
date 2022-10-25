//This requires the Mongoose package and models.js file as well as the Mongoose models defined in models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

//Variables to call the Models database
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//This connects Mongoose to connect to the database so it can perform CRUD operations on the documents it contains from within the REST API
mongoose.connect('mongodb://localhost:27017/SMDB',
{ useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
morgan = require('morgan'),
fs = require ('fs'),
path = require ('path'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//Morgan logs to the log.txt file, Static sends all static files, bodyParser to read HTTP requests
app.use(morgan('combined', {stream: accessLogStream}));
//access documentation.html using express.static
app.use('/documentation', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//
app.get('/', (req, res) => {
  res.send('Welcome to myFlix movie app!');
});

//
app.get('/documentation',(req,res) => {
  res.sendFile('public/documentation.html', {
    root:_dirname });
});


// CREATE, POST method - Allow new users to register
// tested in Postman successfully
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create ({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) //then handles the callback for the document that was created
      })
      .catch((error) => { //catch handles the error
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//READ, GET method - Return a list of all movies
//tested in Postman successfully
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ, GET method - Get all users
// tested in Postman successfully
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ, GET method - Get a user by username
// tested in Postman successfully
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ, GET method - Return data about a single movie by Title
// tested in Postman successfully
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//READ, GET method - Return data about a Genre
// tested in Postman successfully
app.get('/movies/genres/:Name', (req, res) => {
  Movies.findOne({ "Genre.Name" : req.params.Name })
  .then((movies) => {
    res.json(movies.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//READ, GET method - Return data about a Director
// tested in Postman successfully
app.get('/movies/directors/:Name', (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.Name })
  .then((movies) => {
    res.json(movies.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});



// UPDATE, PUT method - Allow a user to update their user info
// tested in Postman successfully
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set: // specifies which key values in the document to update
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This 3rd parameter makes sure that the updated document is returned
  (err, updatedUser) => { //Within that callback itself, the 4th parameter, you have two parameters
    if(err) {
      console.error(err); //logs error message to console
      res.status(500).send('Error: ' + err); //sends error message to the client as a response
    } else {
      res.json(updatedUser); //sends back updated document called updatedUser
    }
  });
});

// CREATE, POST method - Allow users to add a movie to a user's list of favorites
// tested in Postman successfully
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE, DELETE method - Allow users to remove a movie from a user's list of favorites
// tested in Postman successfully
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//DELETE, DELETE method - Allow existing users to deregister
//tested in Postman successfully
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove ({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//Error Handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There\'s an error!');
});

app.listen(8080, () => {
  console.log('Find a movie on SMDB today!');
});
