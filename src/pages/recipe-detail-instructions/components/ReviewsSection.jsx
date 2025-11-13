import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from "../../../supabaseClient";

const ReviewsSection = ({ reviews = [], recipeId, onSubmitReview }) => {
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    images: []
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const { userProfile, setShowAuthPopup } = useAuth();

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

const handleWriteReview = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  const loggedIn = !!sessionData?.session?.user;

  if (!loggedIn || !userProfile) {
    setShowAuthPopup(true);
    return;
  }

  setIsWritingReview(prev => !prev);
};



  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.comment.trim()) {
      onSubmitReview({
        rating: newReview.rating,
        comment: newReview.comment,
        recipeId,
      });
      setNewReview({ rating: 0, comment: '', images: [] });
      setShowReviewForm(false);
      setIsWritingReview(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: reviews.length ? (count / reviews.length) * 100 : 0,
    };
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Reviews & Ratings
        </h2>
        <Button
          variant="default"
          size="sm"
          onClick={handleWriteReview}
          iconName="Plus"
          iconPosition="left"
        >
          {isWritingReview ? "Cancel Review" : "Write Review"}
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-heading font-bold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                size={20}
                className={`${star <= Math.floor(averageRating)
                  ? 'text-warning fill-current'
                  : 'text-muted-foreground'
                  }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.rating} className="flex items-center space-x-3">
              <span className="text-sm font-body text-foreground w-8">
                {dist.rating}★
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {isWritingReview && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Icon
                      name="Star"
                      size={24}
                      className={`${star <= newReview.rating
                        ? 'text-warning fill-current'
                        : 'text-muted-foreground hover:text-warning'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                label="Your Review"
                type="text"
                placeholder="Share your cooking experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                variant="default"
                disabled={
                  newReview.rating === 0 || !newReview.comment.trim()
                }
              >
                Submit Review
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsWritingReview(false)}
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
          All Reviews ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-body text-foreground"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div
              key={review.review_id}
              className="border-b border-border pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-body font-medium text-foreground">
                      {review?.users?.name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            size={14}
                            className={`${star <= review.rating
                              ? 'text-warning fill-current'
                              : 'text-muted-foreground'
                              }`}
                          />
                        ))}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(
                          'en-IN',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-body text-foreground mb-3">
                  {review.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
