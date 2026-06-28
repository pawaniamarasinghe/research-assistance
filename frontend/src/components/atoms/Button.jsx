import React from 'react';

export const Button = ({ children, onClick, type = "button", disabled, variant = "primary" }) => {
  const baseStyles = "px-4 py-2.5 font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-xs uppercase tracking-wider flex items-center justify-center gap-2 border";
  
  const variants = {
    primary: "bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/40 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    secondary: "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};