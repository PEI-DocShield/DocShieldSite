import React, { useRef } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps } from 'framer-motion';

interface ScrollScrubRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function ScrollScrubReveal({ children, style, ...props }: ScrollScrubRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track this element's position in the viewport
  // "start 90%" means entering from bottom
  // "end 10%" means leaving from top (bottom of the navbar area)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"]
  });

  // 0 -> 0.15: Element enters (fades in, scales up, unblurs)
  // 0.15 -> 0.65: Element stays fully visible
  // 0.65 -> 1: Element leaves (fades out early as it hits the bottom of the navbar)
  
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.65, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.65, 1], [0.95, 1, 1, 1.05]);
  
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.65, 1], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      ref={ref}
      style={{ 
        ...style, 
        opacity, 
        scale, 
        filter, 
        willChange: 'opacity, transform, filter' 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
