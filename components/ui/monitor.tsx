"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface MonitorIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MonitorIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SCREEN_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    scale: 1,
  },
  animate: {
    opacity: [1, 0.8, 1],
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const GLOW_VARIANTS: Variants = {
  normal: {
    opacity: 0,
  },
  animate: {
    opacity: [0, 0.3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const MonitorIcon = forwardRef<MonitorIconHandle, MonitorIconProps>(
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
            height="14"
            rx="2"
            width="20"
            x="2"
            y="3"
            variants={SCREEN_VARIANTS}
          />
          <motion.rect
            animate={controls}
            fill="currentColor"
            height="14"
            rx="2"
            width="20"
            x="2"
            y="3"
            variants={GLOW_VARIANTS}
          />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </div>
    );
  }
);

MonitorIcon.displayName = "MonitorIcon";

export { MonitorIcon };
