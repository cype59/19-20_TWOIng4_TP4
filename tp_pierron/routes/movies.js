const express = require('express');
// Lodash utils library
const _ = require('lodash');

const router = express.Router();

const axios = require('axios');

const api_url = "http://www.omdbapi.com/";
const api_key = "76b17f68";





// Create RAW data array
/**
let movies = [{
  id: String,
  movie: String,
  yearOfRelease: Number,
  duration: Number,
  actors: [String, String],
  poster: String,
  boxOffice: Number,
  rottenTomatoesScore: Number
}];
*/

let movies = [];


/* GET movies listing. */
router.get('/', (req, res) => {
  res.status(200).json({ movies });
});

/* GET one movie. */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const movie = _.find(movies, ["id", id]);
  if (movie != null) {
    res.status(200).json({
      message: "Movie found",
      movie
    });
  }
  else {
    return res.status(200).json({
      message: "Movie not found",
    });
  }
});

/* PUT new movie. */
router.put('/:title', (req, res) => {
  axios.get(`http://www.omdbapi.com/?t=${req.params.title}&apikey=${api_key}`).then(function (response) {
    const movie = {
      id: response.data.imdbID,
      movie: response.data.Title,
      yearOfRelease: response.data.Year,
      duration: response.data.Runtime,
      poster: response.data.Poster,
      actors: response.data.Actors,
      boxOffice: response.data.BoxOffice,
      rottenTomatoesScore: response.data.imdbRating
    };
    if (movie.movie != null) {
      movies.push(movie);
      res.status(200).json({
        message: `Just added ${movie.id}`,
        movies
      });
    }
    else {
      res.status(200).json({
        message: 'Movie not found!',
      })
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
});


/* DELETE movie. */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  _.remove(movies, ["id", id]);

  res.json({
    message: `Just removed ${id}`
  });
});

/* UPDATE movie. */
router.post('/:id', (req, res) => {
  const { id } = req.params;
  const { movie } = req.body;

  const movieToUpdate = _.find(movies, ["id", id]);
  movieToUpdate.movie = movie;

  // Return message
  res.json({
    message: `Just updated ${id} with ${movie}`
  });
});


module.exports = router;
