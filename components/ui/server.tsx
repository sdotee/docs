"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ServerIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ServerIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RACK_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1, scale: 1 },
  animate: (custom: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    scale: [0.95, 1],
    transition: {
      duration: 0.3,
      delay: 0.15 * custom,
      ease: "easeOut",
    },
  }),
};

const DOT_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1 },
  animate: (custom: number) => ({
    scale: [0, 1.3, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.3,
      delay: 0.3 + 0.1 * custom,
      ease: "easeOut",
    },
  }),
};

const ServerIcon = forwardRef<ServerIconHandle, ServerIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            animate={controls}
            custom={0}
            x="2"
            y="2"
            width="20"
            height="8"
            rx="2"
            ry="2"
            variants={RACK_VARIANTS}
          />
          <motion.rect
            animate={controls}
            custom={1}
            x="2"
            y="14"
            width="20"
            height="8"
            rx="2"
            ry="2"
            variants={RACK_VARIANTS}
          />
          <motion.line
            animate={controls}
            custom={0}
            x1="6"
            y1="6"
            x2="6.01"
            y2="6"
            variants={DOT_VARIANTS}
          />
          <motion.line
            animate={controls}
            custom={1}
            x1="6"
            y1="18"
            x2="6.01"
            y2="18"
            variants={DOT_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

ServerIcon.displayName = "ServerIcon";

export { ServerIcon };
