import React from "react";
import LoadingSkeleton from "../LoadingSkeleton";

interface TableLoadingProps {
  columns: number;
  rows?: number;
}

const TableLoading: React.FC<TableLoadingProps> = ({ columns, rows = 8 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton
            key={index}
            height={40}
            width={Math.random() * 100 + 100}
          />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              height={20}
              width={Math.random() * 100 + 100}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableLoading;
