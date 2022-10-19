//
const express = require('express'),
morgan = require('morgan'),
fs = require ('fs'),
path = require ('path'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//Users database code stored in memory
let users = [
  {
    id: 1,
    name: "Brianna",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Priya",
    favoriteMovies: []
  },
  {
    id: 3,
    name: "Jayden",
    favoriteMovies: ["The Lion King"]
  }
]

// Movies database code stored in memory
let movies = [
  {
    "Title": "Titanic",
    "Description":"101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
    "Genre":{
      "Name":"Romance",
      "Description":"Category that places its primary focus on relationship and romantic love between two people."
    },
    "Director": {
      "Name":"James Cameron",
      "Bio":"He drove a truck to support his screenwriting ambition. He landed his first professional film job as art director, miniature-set builder, and process-projection supervisor on Roger Corman's Battle Beyond the Stars (1980) and had his first experience as a director with a two week stint on Piranha II: The Spawning (1981) before being fired.  He then wrote and directed The Terminator (1984), a futuristic action-thriller starring Arnold Schwarzenegger, Michael Biehn and Linda Hamilton. It was a low budget independent film, but Cameron's superb, dynamic direction made it a surprise mainstream success and it is now regarded as one of the most iconic pictures of the 1980s. After this came a string of successful, bigger budget science-fiction action films such as Aliens (1986), The Abyss (1989) and Terminator 2: Judgment Day (1991). In 1990, Cameron formed his own production company, Lightstorm Entertainment. In 1997, he wrote and directed Titanic (1997), a romance epic about two young lovers from different social classes who meet on board the famous ship. The movie went on to break all box office records and earned eleven Academy Awards. It became the highest grossing movie of all time until 12 years later, Avatar (2009), which invented and pioneered 3D film technology, and it went on to beat Titanic movie, and became the first film to cost two billion dollars until 2019 when Marvel took the record.",
      "Birth Year": 1954
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "Featured":true
  },

  {
    "Title": "The Lion King",
    "Description":"A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows up beyond the Savannah, living by a philosophy: No worries for the rest of your days. But when his past comes to haunt him, the young prince must decide his fate: Will he remain an outcast or face his demons and become what he needs to be?",
    "Genre":{
      "Name":"Family",
      "Description":"Category of film appropriate for young viewers."
    },
    "Director": {
      "Name":"Rob Minkoff",
      "Bio":"Rob Minkoff was born on August 11, 1962 in Palo Alto, California, USA. He is a producer and director, known for The Lion King (1994), Stuart Little 2 (2002) and The Haunted Mansion (2003). He has been married to Crystal Kung Minkoff since September 29, 2007.",
      "Birth Year": 1962
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    "Featured":false
  },

  {
    "Title": "Inception",
    "Description":"Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    "Genre":{
      "Name":"Science Fiction",
      "Description":"Category of speculative fiction which typically deals with imaginative and futuristic concepts such as advanced science and technology."
    },
    "Director": {
      "Name":"Christopher Nolan",
      "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. At 7 years old, Nolan began making short movies with his father's Super-8 camera. While studying English Literature at University College London, he shot 16-millimeter films at U.C.L.'s film society, where he learned the guerrilla techniques he would later use to make his first feature, Following (1998), on a budget of around $6,000. The noir thriller was recognized at a number of international film festivals prior to its theatrical release and gained Nolan enough credibility that he was able to gather substantial financing for his next film. One of the best-reviewed and highest-grossing movies of 2012, The Dark Knight Rises (2012) concluded Nolan's Batman trilogy. Due to his success rebooting the Batman character, Warner Bros. enlisted Nolan to produce their revamped Superman movie Man of Steel (2013), which opened in the summer of 2013. In 2014, Nolan directed, wrote, and produced the science-fiction epic Interstellar (2014), starring Matthew McConaughey, Anne Hathaway and Jessica Chastain. Paramount Pictures and Warner Bros. released the film on November 5, 2014, to positive reviews and strong box-office results, grossing over $670 million dollars worldwide.",
      "Birth Year": 1970
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
    "Featured":false
  },

  {
    "Title": "The Godfather",
    "Description":"Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    "Genre":{
      "Name":"Drama",
      "Description":"Category of movies with high stakes and many conflicts."
    },
    "Director": {
      "Name":"Francis Ford Coppola",
      "Bio":"Francis Ford Coppola graduated with a degree in drama from Hofstra University, and did graduate work at UCLA in filmmaking. He was training as assistant with filmmaker Roger Corman, working in such capacities as sound-man, dialogue director, associate producer and, eventually, director of Dementia 13 (1963), Coppola's first feature film. ",
      "Birth Year": 1939
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "Featured":false
  },

  {
    "Title": "The Lord of the Rings: The Return of the King",
    "Description":"Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord's realm.",
    "Genre":{
      "Name":"Fantasy",
      "Description":"Category of film with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fastasy worlds."
    },
    "Director": {
      "Name":"Peter Jackson",
      "Bio":"Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously. The Fellowship of the Ring, The Two Towers and The Return of the King were nominated for and collected a slew of awards from around the globe, with The Return of the King receiving his most impressive collection of awards. This included three Academy Awards® (Best Adapted Screenplay, Best Director and Best Picture), two Golden Globes (Best Director and Best Motion Picture-Drama), three BAFTAs (Best Adapted Screenplay, Best Film and Viewers' Choice), a Directors Guild Award, a Producers Guild Award and a New York Film Critics Circle Award.",
      "Birth Year": 1961
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    "Featured":false
  },
  {
    "Title": "The Batman",
    "Description":"In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    "Genre":{
      "Name":"Action",
      "Description":"Category of which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    "Director": {
      "Name":"Matt Reeves",
      "Bio":"Matthew George Matt Reeves was born April 27, 1966 in Rockville Center, New York, USA and is a writer, director and producer. Reeves began making movies at age eight, directing friends and using a wind-up camera.",
      "Birth Year": 1966
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "Featured":false
  },
  {
    "Title": "Source Code",
    "Description":"When decorated soldier Captain Colter Stevens wakes up in the body of an unknown man, he discovers he's part of a mission to find the bomber of a Chicago commuter train.",
    "Genre":{
      "Name":"Science Fiction",
      "Description":"Category of speculative fiction which typically deals with imaginative and futuristic concepts such as advanced science and technology."
    },
    "Director": {
      "Name":"Duncan Jones",
      "Bio":"Duncan Jones was born on May 30, 1971 in Bromley, Kent, England, UK. He is a director and writer, known for Moon (2009), Source Code (2011) and Mute (2018). He has been married to Rodene Ronquillo since November 6, 2012. They have two children.",
      "Birth Year": 1971
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/AtQDTlj3MFOXJd5C9OopaRo3rRo.jpg",
    "Featured":false
  },
  {
    "Title": "Fantastic Beasts: The Secrets of Dumbledore",
    "Description":"Professor Albus Dumbledore knows the powerful, dark wizard Gellert Grindelwald is moving to seize control of the wizarding world. Unable to stop him alone, he entrusts magizoologist Newt Scamander to lead an intrepid team of wizards and witches. They soon encounter an array of old and new beasts as they clash with Grindelwald's growing legion of followers.",
    "Genre":{
      "Name":"Fantasy",
      "Description":"Category of film with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fastasy worlds."
    },
    "Director": {
      "Name":"David Yates",
      "Bio":"Yates was born and raised in St. Helens, Merseyside in England and studied Politics at the University of Essex and at Georgetown University in Washington, DC.",
      "Birth Year": 1963
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/3c5GNLB4yRSLBby0trHoA1DSQxQ.jpg",
    "Featured":false
  },
  {
    "Title": "The Dark Knight Rises",
    "Description":"Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
    "Genre":{
      "Name":"Action",
      "Description":"Category of which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    "Director": {
      "Name":"Christopher Nolan",
      "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. At 7 years old, Nolan began making short movies with his father's Super-8 camera. While studying English Literature at University College London, he shot 16-millimeter films at U.C.L.'s film society, where he learned the guerrilla techniques he would later use to make his first feature, Following (1998), on a budget of around $6,000. The noir thriller was recognized at a number of international film festivals prior to its theatrical release and gained Nolan enough credibility that he was able to gather substantial financing for his next film. One of the best-reviewed and highest-grossing movies of 2012, The Dark Knight Rises (2012) concluded Nolan's Batman trilogy. Due to his success rebooting the Batman character, Warner Bros. enlisted Nolan to produce their revamped Superman movie Man of Steel (2013), which opened in the summer of 2013. In 2014, Nolan directed, wrote, and produced the science-fiction epic Interstellar (2014), starring Matthew McConaughey, Anne Hathaway and Jessica Chastain. Paramount Pictures and Warner Bros. released the film on November 5, 2014, to positive reviews and strong box-office results, grossing over $670 million dollars worldwide.",
      "Birth Year": 1970
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/hrJUZ5Jo2G3Czy391evhlxgbEdJ.jpg",
    "Featured":false
  },
  {
    "Title": "Sonic the Hedgehog 2",
    "Description":"After settling in Green Hills, Sonic is eager to prove he has what it takes to be a true hero. His test comes when Dr. Robotnik returns, this time with a new partner, Knuckles, in search for an emerald that has the power to destroy civilizations. Sonic teams up with his own sidekick, Tails, and together they embark on a globe-trotting journey to find the emerald before it falls into the wrong hands.",
    "Genre":{
      "Name":"Family",
      "Description":"Category of film appropriate for young viewers."
    },
    "Director": {
      "Name":"Jeff Fowler",
      "Bio":"Jeff Fowler was born on July 27, 1978 in Normal, Illinois, USA. He is a director and writer, known for Sonic the Hedgehog (2020), Sonic the Hedgehog 2 (2022) and Gopher Broke (2004).",
      "Birth Year": 1978
    },
    "ImageURL":"https://www.themoviedb.org/t/p/original/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg",
    "Featured":false
  }
];

//Morgan logs to the log.txt file, Static sends all static files, bodyParser to read HTTP requests
app.use(morgan('combined', {stream: accessLogStream}));
app.use('/', express.static('public'));
app.use(bodyParser.json());

//
app.get('/', (req, res) => {
  res.send('Welcome to myFlix movie app!');
});

//
app.get('/documentation',(req,res) => {
  res.sendFile('public/documentation.html', {
    root:_dirname });
});

//CREATE
//POST allow new users to register - tested in Postman successful
app.post('/users', (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
});

//UPDATE
//PUT allow users to update username - tested in Postman successful
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  let user = users.find(user => user.id == id );
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
});

//CREATE
//POST allow users to add a movie to favorites - tested in Postman successful
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id );
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE
//DELETE allow users to remove a movie from favorites - tested in Postman successful
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id );
  if (user) {
    user.favoriteMovies.pop(movieTitle);
// can also use user.favoriteMovies = user.favoriteMovies.filter(title !-- movieTitle);
    res.status(200).json(`${movieTitle} has been removed from user ${id}'s array`);;
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE
//DELETE allow users to deregister - tested in Postman successful
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find(user => user.id == id );
  if (user) {
    users = users.filter(user => user.id != id);
  //  res.json(users);
    res.status(200).send (`user ${id} has been deregistered`);
  } else {
    res.status(400).send('no such user')
  }
});

// READ
// GET the list of all movies - tested in Postman successful
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ
// GET data about a single movie by Title - tested in Postman successful
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.Title === title );
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

// READ
// GET data about a genre by genre name - tested in Postman successful
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

// READ
// GET data about a director by name - tested in Postman successful
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
});

//Error Handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There\'s an error!');
});

app.listen(8080, () => {
  console.log('Find a movie on SMDB today!');
});
