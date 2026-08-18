"use client";

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function useBreezeAnimation(sectionRef) {
  useEffect(() => {
    if (!sectionRef || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const breezeElements = gsap.utils.toArray(".breeze-text");

      breezeElements.forEach((el, index) => {
        const rot = index % 2 === 0 ? 2 : -2; // Gentle alternating breeze
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, rotationZ: rot },
          {
            opacity: 1,
            y: 0,
            rotationZ: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // SVG lines animation
      const paths = gsap.utils.toArray(".animated-line");
      paths.forEach((path, i) => {
        // Force the layout length for our 100-unit path
        const length = path.getTotalLength() || 100;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          duration: 2.5,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}
