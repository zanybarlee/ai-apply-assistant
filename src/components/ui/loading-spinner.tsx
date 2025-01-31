import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingSpinner = ({ className, ...props }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    </div>
  );
};