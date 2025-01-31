import { cn } from "@/lib/utils";

interface ChatWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatWrapper = ({ children, className }: ChatWrapperProps) => {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-[9999]",
      className
    )}>
      {children}
    </div>
  );
};