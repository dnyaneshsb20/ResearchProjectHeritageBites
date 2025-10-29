import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ReviewsSection = ({ reviews, recipeId, onSubmitReview }) => {
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    images: []
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const handleRatingClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = (e) => {
    e?.preventDefault();
    if (newReview?.rating > 0 && newReview?.comment?.trim()) {
      onSubmitReview({
        ...newReview,
        recipeId,
        date: new Date()?.toISOString(),
        author: {
          name: "You",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        }
      });
      setNewReview({ rating: 0, comment: '', images: [] });
      setShowReviewForm(false);
    }
  };

  const sortedReviews = [...reviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  const averageRating = reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length;
  const ratingDistribution = [5, 4, 3, 2, 1]?.map(rating => ({
    rating,
    count: reviews?.filter(review => review?.rating === rating)?.length,
    percentage: (reviews?.filter(review => review?.rating === rating)?.length / reviews?.length) * 100
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Reviews & Ratings
        </h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowReviewForm(!showReviewForm)}
          iconName="Plus"
          iconPosition="left"
        >
          Write Review
        </Button>
      </div>
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-heading font-bold text-foreground mb-2">
            {averageRating?.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5]?.map((star) => (
              <Icon
                key={star}
                name="Star"
                size={20}
                className={`${star <= Math.floor(averageRating)
                  ? 'text-warning fill-current' : 'text-muted-foreground'
                  }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews?.length} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution?.map((dist) => (
            <div key={dist?.rating} className="flex items-center space-x-3">
              <span className="text-sm font-body text-foreground w-8">
                {dist?.rating}★
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dist?.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {dist?.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Input */}
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Icon
                      name="Star"
                      size={24}
                      className={`${star <= newReview?.rating
                        ? 'text-warning fill-current' : 'text-muted-foreground hover:text-warning'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <Input
                label="Your Review"
                type="text"
                placeholder="Share your cooking experience, tips, or modifications..."
                value={newReview?.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e?.target?.value }))}
                required
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                variant="default"
                disabled={newReview?.rating === 0 || !newReview?.comment?.trim()}
              >
                Submit Review
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-foreground">
          All Reviews ({reviews?.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-body text-foreground"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>
      {/* Reviews List */}
      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews?.map((review, index) => (
          <div
            key={index}
            className="border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col space-y-2">
              {/* Reviewer Name and Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-body font-medium text-foreground">
                    {review?.users?.name || "Anonymous"}
                  </h4>


                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={14}
                          className={`${star <= review?.rating
                            ? "text-warning fill-current"
                            : "text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {new Date(review?.created_at || review?.date)?.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Helpful Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ThumbsUp"
                  iconPosition="left"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {review?.helpfulCount || 0}
                </Button>
              </div>

              {/* Comment */}
              <p className="text-sm font-body text-foreground mb-3">
                {review?.comment}
              </p>

              {/* Review Images (if any) */}
              {review?.images && review?.images?.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {review?.images?.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Recipe Modifications */}
              {review?.modifications && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Edit" size={14} className="text-primary mt-0.5" />
                    <div>
                      <h5 className="font-body font-medium text-foreground text-sm">
                        Recipe Modifications:
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {review?.modifications}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Reviews */}
      {reviews?.length > 5 && (
        <div className="text-center mt-6">
          <Button variant="outline" iconName="ChevronDown" iconPosition="right">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;