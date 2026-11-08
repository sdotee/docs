"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SkillsIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SkillsIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// The big star turns and pops while the small sparkles twinkle
const STAR_VARIANTS: Variants = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 0.85, 1.08, 1],
    rotate: [0, 15, -5, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const TWINKLE_VARIANTS: Variants = {
  normal: { opacity: 1, scale: 1 },
  animate: (delay: number) => ({
    opacity: [1, 0, 1],
    scale: [1, 0.4, 1],
    transition: { duration: 0.4, ease: "easeInOut", delay },
  }),
};

const SkillsIcon = forwardRef<SkillsIconHandle, SkillsIconProps>(
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
          <motion.path
            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
            animate={controls}
            style={{ originX: "50%", originY: "50%" }}
            variants={STAR_VARIANTS}
          />
          <motion.g
            animate={controls}
            custom={0}
            style={{ originX: "50%", originY: "50%" }}
            variants={TWINKLE_VARIANTS}
          >
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
          </motion.g>
          <motion.g
            animate={controls}
            custom={0.15}
            style={{ originX: "50%", originY: "50%" }}
            variants={TWINKLE_VARIANTS}
          >
            <path d="M4 17v2" />
            <path d="M5 18H3" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

SkillsIcon.displayName = "SkillsIcon";

export { SkillsIcon };
