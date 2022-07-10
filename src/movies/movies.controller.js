const service = require("./movies.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found. ` });
}

function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

async function list(req, res, next) {
  if (req.query.is_showing) {
    let data = await service.listCurrentlyShowingMovies();
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

async function listTheatersMovieIsPlayingIn(req, res, next) {
  let data = await service.listTheatersMovieIsPlayingIn(req.params.movieId);
  res.json({ data });
}

async function findAllReviewsForMovie(req, res, next){
  let data = await service.findAllReviewsForMovie(req.params.movieId)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundry(list)],
  read: [asyncErrorBoundry(movieExists), read],
  listTheatersMovieIsPlayingIn: [
    asyncErrorBoundry(listTheatersMovieIsPlayingIn),
  ],
  findAllReviewsForMovie: [asyncErrorBoundry(findAllReviewsForMovie)]
};
