// src/hooks/useHorizontalScroll.js
"use client";


import { useState, useRef, useEffect } from "react";


export function useHorizontalScroll(scrollAmount = 200) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);


  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // Add a 2px buffer to avoid rounding precision issues
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 2); 
    }
  };


  useEffect(() => {
    handleScroll(); // Check initially
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);


  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };


  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    handleScroll,
    scrollLeft,
    scrollRight
  };
}
