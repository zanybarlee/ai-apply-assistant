import { useState } from "react";

export const useUIState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 400 : 0, 
    y: 100 
  });
  const [size, setSize] = useState({ width: 320, height: 500 });

  const handleClose = () => {
    if (isFloating) {
      setIsFloating(false);
      setIsEnlarged(false);
      setPosition({ 
        x: typeof window !== 'undefined' ? window.innerWidth - 400 : 0, 
        y: 100 
      });
    }
    setIsOpen(false);
  };

  return {
    isOpen,
    isEnlarged,
    isFloating,
    position,
    size,
    setIsOpen,
    setIsEnlarged,
    setIsFloating,
    setPosition,
    setSize,
    handleClose
  };
};