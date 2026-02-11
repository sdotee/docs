"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface AwesomeFaceIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AwesomeFaceIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SMILE_VARIANTS: Variants = {
  normal: {
    d: "M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15",
  },
  animate: {
    d: [
      "M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15",
      "M8 14.5C8.91212 16.5 10.3643 17.5 12 17.5C13.6357 17.5 15.0879 16.5 16 14.5",
      "M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15",
    ],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

const LEFT_EYE_VARIANTS: Variants = {
  normal: {
    scaleY: 1,
  },
  animate: {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 2.5,
    },
  },
};

const RIGHT_EYE_VARIANTS: Variants = {
  normal: {
    scaleY: 1,
  },
  animate: {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 2.5,
    },
  },
};

const BOUNCE_VARIANTS: Variants = {
  normal: {
    y: 0,
    rotate: 0,
  },
  animate: {
    y: [0, -2, 0],
    rotate: [0, -3, 3, 0],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

const AwesomeFaceIcon = forwardRef<AwesomeFaceIconHandle, AwesomeFaceIconProps>(
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
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          variants={BOUNCE_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <motion.path
            animate={controls}
            d="M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15"
            variants={SMILE_VARIANTS}
          />
          <motion.g
            animate={controls}
            style={{ originX: "9px", originY: "9px" }}
            variants={LEFT_EYE_VARIANTS}
          >
            <path d="M9 8C9 8 10 9 10 10C9.25 9 7.75 9 7 10" />
          </motion.g>
          <motion.g
            animate={controls}
            style={{ originX: "15px", originY: "9px" }}
            variants={RIGHT_EYE_VARIANTS}
          >
            <path d="M15 8C15 8 14 9 14 10C14.75 9 16.25 9 17 10" />
          </motion.g>
        </motion.svg>
      </div>
    );
  }
);

AwesomeFaceIcon.displayName = "AwesomeFaceIcon";

export { AwesomeFaceIcon };
