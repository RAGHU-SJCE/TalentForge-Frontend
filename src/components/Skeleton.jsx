import React from 'react';

const Skeleton = ({ width = "100%", height = "20px", borderRadius = "4px", marginBottom = "10px", variant = "text" }) => {
  const isCircle = variant === "circle";
  
  return (
    <div style={{
      width: isCircle ? height : width,
      height: height,
      borderRadius: isCircle ? "50%" : borderRadius,
      marginBottom: marginBottom,
      background: "#e2e8f0",
      animation: "pulse 1.5s infinite ease-in-out",
    }} />
  );
};

export default Skeleton;
