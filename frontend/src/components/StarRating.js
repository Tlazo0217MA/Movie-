import React from 'react';
const StarRating = ({ rating, onRating, size = 20, readOnly = false }) => {
    const totalStars = 5;

    const Star = ({ index }) => {
        
        let color = index <= rating ? '#FFC107' : '#E4E5E9'; 
        let cursorStyle = readOnly ? 'default' : 'pointer';

        const handleClick = () => {
            if (!readOnly && onRating) {
                onRating(index); 
            }
        };

        return (
            <span
                key={index}
                onClick={handleClick}
                style={{
                    cursor: cursorStyle,
                    color: color,
                    fontSize: `${size}px`, 
                    marginRight: '2px',
                    userSelect: 'none' 
                }}
            >
                ★
            </span>
        );
    };

    return (
        <div className="d-flex align-items-center">
            {[...Array(totalStars)].map((_, index) => (
                <Star key={index} index={index + 1} />
            ))}
        </div>
    );
};

export default StarRating;