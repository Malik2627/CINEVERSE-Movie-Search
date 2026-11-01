import React from 'react';

export default function SkeletonLoader({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card" />
      ))}
    </>
  );
}

