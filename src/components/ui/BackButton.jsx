import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  className = "", 
  text = "Back", 
  onClick, 
  showIcon = true,
  variant = "default" 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      type="button"
    >
      {showIcon && <ArrowLeft className="h-4 w-4" />}
      {text}
    </button>
  );
};

export default BackButton;
