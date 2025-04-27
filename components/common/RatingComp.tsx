import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface RatingCompProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
}

const RatingComp: React.FC<RatingCompProps> = ({
  rating,
  size = "md",
  interactive = false,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Calculate star size based on the size prop
  const getStarSize = () => {
    switch(size) {
      case "sm": return 14;
      case "lg": return 24;
      default: return 18; // Medium is default
    }
  };

  // Star color
  const starColor = "text-yellow-400";
  const starSize = getStarSize();
  
  const renderStar = (position: number) => {
    const displayRating = hoverRating !== null && interactive ? hoverRating : rating;
    
    const isHalfStar = displayRating - position >= 0.25 && displayRating - position < 0.75;
    const isFullStar = displayRating - position >= 0.75;
    
    const handleMouseEnter = () => {
      if (interactive) setHoverRating(position);
    };
    
    const handleMouseLeave = () => {
      if (interactive) setHoverRating(null);
    };
    
    const handleClick = () => {
      if (interactive && onChange) onChange(position);
    };

    const starProps = {
      size: starSize,
      className: `${starColor} ${interactive ? "cursor-pointer" : ""}`,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick
    };

    if (isFullStar) {
      return <FaStar {...starProps} />;
    } else if (isHalfStar) {
      return <FaStarHalfAlt {...starProps} />;
    } else {
      return <FaRegStar {...starProps} className={`text-gray-300 ${interactive ? "cursor-pointer" : ""}`} />;
    }
  };

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((position) => (
        <div key={position}>
          {renderStar(position)}
        </div>
      ))}
    </div>
  );
};

export default RatingComp;
