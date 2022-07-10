const service = require("./theaters.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");

async function list(req, res, next) {
  let data = await service.list()
  const foundMovies = []
  for (let i = 0; i < data.length; i++){
    const theater = data[i]
    const {theater_id } = theater
    const movies = await service.getMovies(theater_id)
    const movie = { ... theater, movies: movies }
    foundMovies.push(movie)
  }
  res.status(200).json({ data: foundMovies })
}

module.exports = {
  list: [asyncErrorBoundry(list)],
};
