"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SmartphoneIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SmartphoneIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PHONE_VARIANTS: Variants = {
  normal: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const ARROW_VARIANTS: Variants = {
  normal: {
    x: 0,
    opacity: 1,
  },
  animate: {
    x: [0, 3, 0],
    opacity: [1, 0.6, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const DOT_VARIANTS: Variants = {
  normal: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      delay: 0.1,
    },
  },
};

const SmartphoneIcon = forwardRef<SmartphoneIconHandle, SmartphoneIconProps>(
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
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
          animate={controls}
          variants={PHONE_VARIANTS}
        >
          <motion.path
            d="M10.5 19H10.51"
            animate={controls}
            variants={DOT_VARIANTS}
          />
          <motion.path
            d="M19 12.0337H12M17 9C17 9 19.0371 10.6469 19.8208 11.5533C19.9468 11.6991 20.0064 11.8627 19.9995 12.0253C19.9933 12.1711 19.9337 12.3162 19.8207 12.4468C19.0368 13.3531 17 15 17 15"
            animate={controls}
            variants={ARROW_VARIANTS}
          />
          <path d="M17 6C16.9855 4.29344 16.8908 3.35264 16.2702 2.73223C15.5378 2 14.3591 2 12.0016 2H9.001C6.64351 2 5.46476 2 4.73238 2.73223C4 3.46447 4 4.64298 4 7V17C4 19.357 4 20.5355 4.73238 21.2678C5.46476 22 6.64351 22 9.001 22H12.0016C14.3591 22 15.5378 22 16.2702 21.2678C16.8908 20.6473 16.9855 19.7065 17 17.9999" />
        </motion.svg>
      </div>
    );
  }
);

SmartphoneIcon.displayName = "SmartphoneIcon";

export { SmartphoneIcon };
