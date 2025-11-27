import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({
    rating = 0,
    showNumber = true,
    reviewCount = null,
    size = "small",
    color = "#FFA726"
}) => {
    // Ensure rating is between 0 and 5
    const clampedRating = Math.min(Math.max(rating, 0), 5);

    // Calculate filled, half, and empty stars
    const filledStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    // Size mapping for icons
    const sizeMap = {
        small: "16px",
        medium: "20px",
        large: "24px"
    };

    const iconSize = sizeMap[size] || sizeMap.small;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {/* Filled stars */}
                {[...Array(filledStars)].map((_, i) => (
                    <StarIcon
                        key={`filled-${i}`}
                        sx={{ fontSize: iconSize, color: color }}
                    />
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <StarHalfIcon
                        sx={{ fontSize: iconSize, color: color }}
                    />
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <StarBorderIcon
                        key={`empty-${i}`}
                        sx={{ fontSize: iconSize, color: color }}
                    />
                ))}
            </div>

            {/* Rating number and review count */}
            {showNumber && (
                <span className="text-sm text-gray-600 ml-1">
                    {clampedRating.toFixed(1)}
                    {reviewCount !== null && reviewCount !== undefined && (
                        <span> ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default StarRating;
