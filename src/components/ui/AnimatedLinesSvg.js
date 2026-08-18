import React from 'react';

export default function AnimatedLinesSvg({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 10000"
      preserveAspectRatio="xMinYMin slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="animated-line"
        d="M 105 0 L 105 10000"
        stroke="#e94f37"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="animated-line"
        d="M 75 0 L 75 10000"
        stroke="#ff8c00"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="animated-line"
        d="M 45 0 L 45 10000"
        stroke="#ffd700"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="animated-line"
        d="M 15 0 L 15 10000"
        stroke="#ffffff"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
