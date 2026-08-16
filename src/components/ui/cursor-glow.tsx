"use client"

import { useState, useEffect } from 'react';

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed -inset-px z-[9999] hidden transition duration-300 lg:block"
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.1), transparent 80%)`,
      }}
    />
  );
};

export default CursorGlow;
