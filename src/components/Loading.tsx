interface LoadingProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

const Loading = ({ fullScreen = false, size = "md" }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-b-2 border-eco-600 ${sizeClasses[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading; 