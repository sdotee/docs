"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface LogInIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LogInIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const DOOR_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const ARROW_VARIANTS: Variants = {
  normal: { x: 0, opacity: 1 },
  animate: {
    x: ["-100%", "0%"],
    opacity: [0, 1],
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

const LogInIcon = forwardRef<LogInIconHandle, LogInIconProps>(
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
          <motion.path
            animate={controls}
            d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
            variants={DOOR_VARIANTS}
          />
          <motion.polyline
            animate={controls}
            points="10 17 15 12 10 7"
            variants={ARROW_VARIANTS}
          />
          <motion.line
            animate={controls}
            x1="15"
            y1="12"
            x2="3"
            y2="12"
            variants={ARROW_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

LogInIcon.displayName = "LogInIcon";

export { LogInIcon };
