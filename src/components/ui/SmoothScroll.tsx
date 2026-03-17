import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  // Resize handler to update the invisible scrolling div height
  const resizePageHeight = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      setPageHeight(entry.contentRect.height);
    }
  }, []);

  // Set up resize observer
  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => resizePageHeight(entries));
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [scrollRef, resizePageHeight]);

  const { scrollY } = useScroll();
  
  // Create a spring physics simulation for the scroll position
  const transform = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    mass: 0.1,
  });

  // Transform the negative scroll value for the CSS transform
  const physics = useTransform(transform, (y) => -y);

  return (
    <>
      {/* Invisible div that forces the browser to have a native scrollbar of the correct height */}
      <div style={{ height: pageHeight }} />
      
      {/* The actual content that gets smoothly translated */}
      <motion.div
        ref={scrollRef}
        style={{ y: physics }}
        className="fixed top-0 left-0 w-full will-change-transform min-h-screen origin-top"
      >
        {children}
      </motion.div>
    </>
  );
};
