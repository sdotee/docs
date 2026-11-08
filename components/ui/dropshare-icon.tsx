"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DropshareIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface DropshareIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// The drop squashes on landing and springs back, pivoting at its base
const DROP_VARIANTS: Variants = {
  normal: { scaleX: 1, scaleY: 1 },
  animate: {
    scaleX: [1, 1.12, 0.94, 1],
    scaleY: [1, 0.86, 1.06, 1],
    transition: { duration: 0.55, ease: "easeInOut" },
  },
};

const DropshareIcon = forwardRef<DropshareIconHandle, DropshareIconProps>(
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
          <motion.g
            animate={controls}
            style={{ originX: "50%", originY: "100%" }}
            variants={DROP_VARIANTS}
          >
            <path d="M12 3c-3.5 4.2-6 7.6-6 11a6 6 0 0 0 12 0c0-3.4-2.5-6.8-6-11Z" />
            <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

DropshareIcon.displayName = "DropshareIcon";

export { DropshareIcon };
