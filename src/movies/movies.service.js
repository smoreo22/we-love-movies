// const { listenerCount, groupBy } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
})

function findAllReviewsForMovie(movieId) {
  return knex("reviews as r")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .select("*")
  .where({"r.movie_id": movieId})
  .then(data => data.map(addCritic))
}

function read(movieId) {
  return knex("movies")
  .select("*")
  .where({ movie_id: movieId })
  .first();
}

function list() {
  return knex("movies").select("*");
}

function listCurrentlyShowingMovies() {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("*")
    .where({"mt.is_showing": true})
    .groupBy("m.movie_id")
}

function listTheatersMovieIsPlayingIn(movieId) {
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({"movie_id": movieId})
    .where({"is_showing": true})
}

module.exports = {
  list,
  listCurrentlyShowingMovies,
  read,
  listTheatersMovieIsPlayingIn,
  findAllReviewsForMovie,
};
