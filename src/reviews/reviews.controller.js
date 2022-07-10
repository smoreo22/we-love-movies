const service = require("./reviews.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundry");

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res, next) {
  const time = new Date().toISOString()
  const reviewId = res.locals.review.review_id
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview)
  const reviewData = await service.updateCritic(reviewId);
  const data = {...reviewData[0], created_at: time, updated_at: time}
  res.json({ data });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  delete: [asyncErrorBoundry(reviewExists), asyncErrorBoundry(destroy)],
  update: [asyncErrorBoundry(reviewExists), asyncErrorBoundry(update)],
};
