import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description: string;
  Icon: LucideIcon;
  onClick?: () => void;
}

export const StatisticsCard = ({ title, value, description, Icon, onClick }: StatisticsCardProps) => {
  return (
    <Card className="transition-colors hover:bg-muted/50 cursor-pointer" onClick={onClick}>
      <Button variant="ghost" className="w-full h-full p-0 hover:bg-transparent">
        <div className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </div>
      </Button>
    </Card>
  );
};