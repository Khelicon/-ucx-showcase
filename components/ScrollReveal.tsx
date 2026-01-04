
import React from 'react';

export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: string }> = ({ children, delay = '0ms' }) => {
  return (
    <div style={{ animationDelay: delay }} className="animate-slide-up-fade">
      {children}
    </div>
  );
};
