import React from 'react';

export const Button = ({ children, onClick, type = "button", disabled, variant = "primary" }) => {
  const baseStyles = "px-4 py-2 font-medium rounded-lg transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};