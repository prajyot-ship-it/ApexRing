import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  viewportMargin?: string;
  viewportAmount?: number | 'some' | 'all';
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.45,
  yOffset = 20,
  viewportMargin = '100px 0px 100px 0px',
  viewportAmount = 0.01,
  id,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user requests reduced motion, bypass scroll animation and render statically
  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  id?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  id,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '100px 0px 100px 0px', amount: 0.01 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  id?: string;
}> = ({ children, className = '', yOffset = 18, id }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      variants={{
        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.2 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
