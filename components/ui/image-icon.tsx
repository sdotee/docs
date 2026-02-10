"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ImageIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ImageIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SUN_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const LANDSCAPE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0, 1],
    opacity: [0.4, 1],
    transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: 0.1,
    },
  },
};

const FRAME_VARIANTS: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.04, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const ImageIcon = forwardRef<ImageIconHandle, ImageIconProps>(
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
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="7.5"
            cy="7.5"
            r="1.5"
            animate={controls}
            variants={SUN_VARIANTS}
          />
          <motion.path
            d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
            animate={controls}
            variants={FRAME_VARIANTS}
          />
          <motion.path
            d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424"
            animate={controls}
            variants={LANDSCAPE_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

ImageIcon.displayName = "ImageIcon";

export { ImageIcon };
