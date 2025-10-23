import React from "react";
import Skeleton from "react-loading-skeleton";

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  width?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 20,
  width,
  className = "",
}) => {
  return (
    <Skeleton
      count={count}
      height={height}
      width={width}
      className={className}
    />
  );
};

export default LoadingSkeleton;
