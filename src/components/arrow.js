import React, { useState } from "react";

const ArrowLine = ({
  from,
  to,
  color = "black",
  strokeWidth = 4,
  handleClick,
  isErasing,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const arrowSize = 10;

  const arrowStartX = from.x + (length - arrowSize) * Math.cos(angle);
  const arrowStartY = from.y + (length - arrowSize) * Math.sin(angle);

  const arrowEndX = arrowStartX - arrowSize * Math.cos(angle);
  const arrowEndY = arrowStartY - arrowSize * Math.sin(angle);

  const arrowStartLeftX = arrowStartX - (arrowSize / 2) * Math.sin(angle);
  const arrowStartLeftY = arrowStartY + (arrowSize / 2) * Math.cos(angle);

  const arrowStartRightX = arrowStartX + (arrowSize / 2) * Math.sin(angle);
  const arrowStartRightY = arrowStartY - (arrowSize / 2) * Math.cos(angle);

  const pathData = `M${from.x},${from.y} L${to.x},${to.y} `;
  console.log("pathData", pathData);

  return (
    <>
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <path
        d={pathData}
        stroke={isErasing && isHovered ? "red" : "black"}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd="url(#arrowhead)"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

export default ArrowLine;
