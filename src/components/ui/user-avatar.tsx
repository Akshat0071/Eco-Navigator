import * as React from "react"
import { cn } from "@/lib/utils"

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [error, setError] = React.useState(false)

    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            {fallback}
          </div>
        )}
      </div>
    )
  }
)
UserAvatar.displayName = "UserAvatar"

export { UserAvatar } 