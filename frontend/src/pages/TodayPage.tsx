import { useState } from "react";
import { TodayTaskList } from "../features/tasks/components/TodayTaskList";
import {
  useTodaysPlan,
  useStartDay,
} from "../features/planning/hooks/useDailyPlan";
import { ReviewModal } from "../features/planning/components/ReviewModal";
import { BigThreeDisplay } from "../features/planning/components/BigThreeDisplay";

export function TodayPage() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const { data: todaysPlan, isLoading } = useTodaysPlan();
  const startDay = useStartDay();
  const [showReview, setShowReview] = useState(false);

  const handleStartDay = () => {
    setShowReview(true);
  };

  const handleReviewClose = () => {
    setShowReview(false);
  };

  const handleReviewContinue = async () => {
    try {
      await startDay.mutateAsync();
      setShowReview(false);
    } catch (error) {
      console.error("Failed to start day:", error);
      setShowReview(false);
    }
  };

  const hasPlan = todaysPlan !== null && todaysPlan !== undefined;

  if (isLoading) {
    return (
      <div className="today-page">
        <header className="today-header">
          <div className="greeting-section">
            <h1>{greeting}</h1>
            <p className="today-date">{dateString}</p>
          </div>
        </header>
        <div className="panel">Loading...</div>
      </div>
    );
  }

  return (
    <div className="today-page">
      <header className="today-header">
        <div className="greeting-section">
          <h1>{greeting}</h1>
          <p className="today-date">{dateString}</p>
        </div>
      </header>

      {!hasPlan && (
        <div className="start-day-prompt">
          <div className="panel">
            <h2>Ready to start your day?</h2>
            <p className="muted">
              Review yesterday's progress and plan what matters today.
            </p>
            <button onClick={handleStartDay} className="btn-start-day">
              Start Today
            </button>
          </div>
        </div>
      )}

      {hasPlan && (
        <div className="today-content">
          <BigThreeDisplay />

          <TodayTaskList />
        </div>
      )}

      {showReview && (
        <ReviewModal
          onClose={handleReviewClose}
          onContinue={handleReviewContinue}
        />
      )}
    </div>
  );
}
