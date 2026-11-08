"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ShortshareIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ShortshareIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// The arrow lifts and its shaft shortens: a link being shortened and shared
const ARROW_VARIANTS: Variants = {
  normal: { y: 0 },
  animate: {
    y: [0, -2, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const SHAFT_VARIANTS: Variants = {
  normal: { scaleY: 1 },
  animate: {
    scaleY: [1, 0.55, 1],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const ShortshareIcon = forwardRef<ShortshareIconHandle, ShortshareIconProps>(
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
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
          <motion.g animate={controls} variants={ARROW_VARIANTS}>
            <path d="M8 7l4-4 4 4" />
            <motion.path
              d="M12 3v12"
              animate={controls}
              style={{ originX: "50%", originY: "0%" }}
              variants={SHAFT_VARIANTS}
            />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ShortshareIcon.displayName = "ShortshareIcon";

export { ShortshareIcon };
