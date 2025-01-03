import { Badge } from "./badge"

interface UsernameBadgeProps {
  username: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function UsernameBadge({ username, color, className = "", style }: UsernameBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={`font-mono ${className}`}
      style={{ 
        borderColor: color,
        color: color,
        ...style
      }}
    >
      {username}
    </Badge>
  );
} 