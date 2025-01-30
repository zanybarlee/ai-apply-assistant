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
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [resizeEdge, setResizeEdge] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFloating) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const edge = getResizeEdge(e.clientX - rect.left, e.clientY - rect.top, rect);
    
    if (edge) {
      setIsResizing(true);
      setResizeEdge(edge);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    } else if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const getResizeEdge = (x: number, y: number, rect: DOMRect) => {
    const edgeSize = 8;
    const isRight = x > rect.width - edgeSize;
    const isBottom = y > rect.height - edgeSize;
    
    if (isRight && isBottom) return 'bottom-right';
    if (isRight) return 'right';
    if (isBottom) return 'bottom';
    return null;
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
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      let newWidth = size.width;
      let newHeight = size.height;

      if (resizeEdge?.includes('right')) {
        newWidth = Math.max(280, Math.min(800, size.width + deltaX));
      }
      if (resizeEdge?.includes('bottom')) {
        newHeight = Math.max(400, Math.min(window.innerHeight * 0.9, size.height + deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
      onSizeChange(newWidth, newHeight);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
  };

  useEffect(() => {
    if (isFloating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isFloating, isDragging, isResizing]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed",
        isFloating ? "cursor-move" : "bottom-4 right-4"
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
        transition: isDragging || isResizing ? 'none' : 'all 0.3s ease-out',
        zIndex: 9999,
      } : undefined}
      onMouseDown={handleMouseDown}
    >
      {children}
      {isFloating && (
        <>
          <div className="absolute bottom-0 right-0 w-2 h-full cursor-e-resize" />
          <div className="absolute bottom-0 right-0 h-2 w-full cursor-s-resize" />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
        </>
      )}
    </div>
  );
};