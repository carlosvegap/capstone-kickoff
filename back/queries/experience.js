const { Parse } = require('./../parse');

// Get all existing feedback that is available for Experience
// Used by routes/experience/preferences/all
async function AllFeedbackInfoQuery() {
  return (
    await new Parse.Query('Preference').equalTo('forExperience', true).find()
  ).map((preference) => preference.toJSON());
}

// Get all records of an experience
// Used by
// -> routes/experience/info
// -> routes/experience/preferences/status
// -> routes/experience/preferences/update
// -> routes/experience/preferences/submit
async function ExperienceInfoQuery(username) {
  return (
    await new Parse.Query('Experience').equalTo('username', username).first()
  ).toJSON();
}

// Update active preferences of an experience
// Used by routes/experience/preferences/update
async function UpdatePreferencesQuery(objectID, activeIDs) {
  const updateQuery = new Parse.Object('Experience');
  updateQuery.set('objectId', objectID);
  updateQuery.set('activeFeedback', activeIDs);
  try {
    await updateQuery.save();
    return true;
  } catch (error) {
    return false;
  }
}

// Submit Experience Information
// Used by routes/experience/preferences/submit
async function SubmitExperienceQuery(objectID, formValues) {
  const Experience = new Parse.Object('Experience');
  // overwrite existing experience values
  Experience.set('objectId', objectID);
  Object.keys(formValues).map((key) => {
    Experience.set(key, formValues[key]);
  });
  try {
    await Experience.save();
    return true;
  } catch (error) {
    return false;
  }
}

// Format:
// [ { preferenceId,
//    reviewSection: [
//       { score: 1, count: 5, comment: ['my comment']},
//       { score: 2, count: 4, comment: []}, ...
//     ]
// } ]
function initializeReviewSection(score, comment) {
  const minScore = 1;
  const maxScore = 5;
  const reviewSection = [];
  for (let i = minScore; i <= maxScore; i++) {
    reviewSection.push({
      score: i,
      // count only on 1 for the review on the score that initialized the object
      count: score === i ? 1 : 0,
      // add only a comment on the corresponding score section if existing
      comment: comment !== '' && score === i ? [comment] : [],
    });
  }
  return reviewSection;
}

// Get all reviews for an experience
// Used by routes/experience/performance
async function ReviewsQuery(experienceID) {
  const allFeedbackInfo = await AllFeedbackInfoQuery();
  const reviews = [];
  const allReviews = await new Parse.Query('Review')
    .equalTo('experienceId', experienceID)
    .find();
  allReviews.map((reviewParse) => {
    const review = reviewParse.toJSON();
    // If that preference has been initialized
    const foundReview = reviews.find(
      (savedReview) => savedReview.preferenceId === review.feedbackId,
    );
    if (foundReview) {
      const indexReview = reviews.findIndex(
        (savedReview) => savedReview === foundReview,
      );
      const indexReviewSection = foundReview.reviewSection.findIndex(
        (reviewValue) => reviewValue.score === review.score,
      );
      // Update reviews according to index
      reviews[indexReview].reviewSection[indexReviewSection].count++;
      if (review.comment !== '') {
        reviews[indexReview].reviewSection[indexReviewSection].comment.push(
          review.comment,
        );
      }
    } else {
      reviews.push({
        preferenceId: review.feedbackId,
        displayText: allFeedbackInfo.find(
          (feedback) => feedback.objectId === review.feedbackId,
        ).displayText,
        reviewSection: initializeReviewSection(review.score, review.comment),
      });
    }
  });
  return reviews;
}

exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.ExperienceInfoQuery = ExperienceInfoQuery;
exports.UpdatePreferencesQuery = UpdatePreferencesQuery;
exports.SubmitExperienceQuery = SubmitExperienceQuery;
exports.ReviewsQuery = ReviewsQuery;
