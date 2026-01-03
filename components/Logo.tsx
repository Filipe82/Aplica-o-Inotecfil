import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center font-black tracking-tighter select-none ${sizeClasses[size]} ${className}`} style={{ fontFamily: 'sans-serif' }}>
      <span className="text-[#050520]">INOTE</span>
      <div className="bg-[#006b00] text-white px-[0.15em] rounded-[18%] mx-[0.05em] flex items-center justify-center leading-none h-[1.1em]">
        C
      </div>
      <span className="text-[#006b00]">FIL</span>
    </div>
  );
};

export default Logo;