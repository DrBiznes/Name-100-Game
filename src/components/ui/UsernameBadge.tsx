import { Badge } from "./badge"

interface UsernameBadgeProps {
  username: string;
  color?: string;
  className?: string;
}

export function UsernameBadge({ username, color, className = "" }: UsernameBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={`font-mono ${className}`}
      style={{ 
        borderColor: color,
        color: color
      }}
    >
      {username}
    </Badge>
  );
} 