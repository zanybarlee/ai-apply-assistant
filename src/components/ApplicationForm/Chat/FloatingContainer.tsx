import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface FloatingContainerProps {
  isFloating: boolean;
  children: React.ReactNode;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
}

export const FloatingContainer = ({
  isFloating,
  children,
  onPositionChange,
  onSizeChange,
  initialPosition,
  initialSize,
}: FloatingContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFloating && e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const padding = 20;
      const maxX = window.innerWidth - size.width - padding;
      const maxY = window.innerHeight - size.height - padding;
      
      const newX = Math.max(padding, Math.min(e.clientX - dragStart.x, maxX));
      const newY = Math.max(padding, Math.min(e.clientY - dragStart.y, maxY));
      
      setPosition({ x: newX, y: newY });
      onPositionChange(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = () => {
    if (!isFloating || !containerRef.current) return;
    
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    resizeHandle.style.cursor = 'se-resize';
    
    const startResize = (e: MouseEvent) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;
      
      const doResize = (e: MouseEvent) => {
        const newWidth = Math.max(280, Math.min(800, startWidth + (e.clientX - startX)));
        const newHeight = Math.max(400, Math.min(window.innerHeight * 0.9, startHeight + (e.clientY - startY)));
        setSize({ width: newWidth, height: newHeight });
        onSizeChange(newWidth, newHeight);
      };
      
      const stopResize = () => {
        window.removeEventListener('mousemove', doResize);
        window.removeEventListener('mouseup', stopResize);
      };
      
      window.addEventListener('mousemove', doResize);
      window.addEventListener('mouseup', stopResize);
    };
    
    resizeHandle.addEventListener('mousedown', startResize as any);
    containerRef.current.appendChild(resizeHandle);
  };

  useEffect(() => {
    if (isFloating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      if (containerRef.current) {
        containerRef.current.style.resize = 'both';
        containerRef.current.style.overflow = 'auto';
        handleResize();
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (containerRef.current) {
          containerRef.current.style.resize = 'none';
          const resizeHandle = containerRef.current.querySelector('.resize-handle');
          if (resizeHandle) {
            resizeHandle.remove();
          }
        }
      };
    }
  }, [isFloating, isDragging]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed",
        isFloating ? "cursor-move resize-handle" : "bottom-4 right-4"
      )}
      style={isFloating ? {
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: '280px',
        minHeight: '400px',
        maxWidth: '800px',
        maxHeight: '90vh',
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
        zIndex: 9999,
        resize: 'both',
        overflow: 'auto'
      } : undefined}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};