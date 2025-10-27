import React from 'react';
import { DotLoader } from 'react-spinners';

const LoadingSpinner = ({
    size = 50,
    color = "#36d7b7",
    text = "Loading...",
    fullScreen = false,
    className = ""
}) => {
    const containerClass = fullScreen
        ? "fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center z-50"
        : "flex flex-col items-center justify-center p-8";

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="flex flex-col items-center space-y-4">
                <DotLoader color={color} size={size} />
                {text && (
                    <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;
