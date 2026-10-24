"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { useCallback, useMemo } from "react";

import { paths } from "@/components/ui/material-icon-paths";

// Material paths are one compound path in a 960-unit viewBox (60 units ≈ 1px at 16px).
// Animated parts are picked by subpath index; an outer shape and its hole must stay in the same part.
// Origins are fractions of the part's own box; `pivot: "icon"` turns the part around the icon center.
interface Origin {
  originX?: number;
  originY?: number;
}

interface Part extends Origin {
  at: number[];
  variants: Variants;
  pivot?: "icon";
}

interface IconAnimation {
  parts?: Part[];
  // Whole-icon animation, in CSS pixels
  whole?: Variants;
  wholeOrigin?: Origin;
}

const ease = (duration = 0.5) => ({ duration, ease: "easeInOut" as const });

const shift = (x: number, y: number): Variants => ({
  normal: { x: 0, y: 0 },
  animate: { x: [0, x, 0], y: [0, y, 0], transition: ease() },
});

// Shapes that look the same after the turn snap back instantly
const spin = (deg: number, duration = 0.6): Variants => ({
  normal: { rotate: 0, transition: { duration: 0 } },
  animate: { rotate: deg, transition: ease(duration) },
});

const plusSpin: Variants = {
  normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
  animate: { rotate: 90, scale: [1, 1.25, 1], transition: ease(0.4) },
};

const wiggle = (deg: number): Variants => ({
  normal: { rotate: 0 },
  animate: { rotate: [0, -deg, deg, -deg / 2, 0], transition: ease() },
});

const pop: Variants = {
  normal: { scale: 1 },
  animate: { scale: [1, 0.6, 1.2, 1], transition: ease() },
};

const grow = (axis: "x" | "y", delay: number): Variants =>
  axis === "x"
    ? {
        normal: { scaleX: 1 },
        animate: { scaleX: [1, 0.3, 1], transition: { ...ease(), delay } },
      }
    : {
        normal: { scaleY: 1 },
        animate: { scaleY: [1, 0.3, 1], transition: { ...ease(), delay } },
      };

const animations: Record<string, IconAnimation> = {
  add_link: { parts: [{ at: [0], variants: plusSpin }] },
  analytics: {
    parts: [
      { at: [0], variants: grow("y", 0), originY: 1 },
      { at: [2, 3], variants: grow("y", 0.1), originY: 1 },
      { at: [1], variants: grow("y", 0.2), originY: 1 },
    ],
  },
  bolt: {
    whole: {
      normal: { opacity: 1, scale: 1 },
      animate: { opacity: [1, 0.3, 1, 0.3, 1], scale: [1, 1.1, 1], transition: ease(0.6) },
    },
  },
  cancel: { parts: [{ at: [0], variants: spin(180) }] },
  cloud_done: { parts: [{ at: [0], variants: pop }] },
  cloud_off: {
    whole: {
      normal: { x: 0 },
      animate: { x: [0, -1.5, 1.5, -1, 1, 0], transition: ease() },
    },
  },
  cloud_upload: {
    whole: {
      normal: { y: 0 },
      animate: { y: [0, -2, 0], transition: ease() },
    },
  },
  code: {
    parts: [
      { at: [0], variants: shift(-80, 0) },
      { at: [1], variants: shift(80, 0) },
    ],
  },
  data_object: {
    parts: [
      { at: [1], variants: shift(-80, 0) },
      { at: [0], variants: shift(80, 0) },
    ],
  },
  data_usage: { parts: [{ at: [1], variants: spin(360, 0.8), pivot: "icon" }] },
  delete: { whole: wiggle(10), wholeOrigin: { originY: 1 } },
  download: { parts: [{ at: [0], variants: shift(0, 80) }] },
  edit_note: {
    parts: [
      { at: [2], variants: grow("x", 0), originX: 0 },
      { at: [1], variants: grow("x", 0.1), originX: 0 },
      { at: [0], variants: grow("x", 0.2), originX: 0 },
    ],
  },
  edit: { whole: wiggle(12), wholeOrigin: { originX: 0, originY: 1 } },
  history: { parts: [{ at: [1], variants: spin(360, 0.8), pivot: "icon" }] },
  key: { whole: wiggle(15), wholeOrigin: { originX: 0.25 } },
  label: { whole: wiggle(10), wholeOrigin: { originX: 0 } },
  language: {
    whole: {
      normal: { rotateY: 0, transition: { duration: 0 } },
      animate: { rotateY: 360, transition: ease(0.7) },
    },
  },
  link_off: {
    parts: [
      { at: [0, 1], variants: shift(60, 0) },
      { at: [3, 4], variants: shift(-60, 0) },
    ],
  },
  manage_accounts: { parts: [{ at: [2, 3], variants: spin(180, 0.8) }] },
  note_add: { parts: [{ at: [0], variants: plusSpin }] },
  person_add: { parts: [{ at: [0], variants: plusSpin }] },
  person_remove: { parts: [{ at: [0], variants: grow("x", 0) }] },
  progress_activity: { whole: spin(360, 0.8) },
  qr_code_2_add: { parts: [{ at: [14], variants: plusSpin }] },
  resume: { parts: [{ at: [1, 2], variants: shift(60, 0) }] },
  swap_horiz: {
    parts: [
      { at: [0], variants: shift(-80, 0) },
      { at: [1], variants: shift(80, 0) },
    ],
  },
  upload_file: { parts: [{ at: [0], variants: shift(0, -80) }] },
  upload: { parts: [{ at: [0], variants: shift(0, -80) }] },
};

// Split a compound path into subpaths with absolute start points
function splitPath(d: string): string[] {
  let start = [0, 0];
  return d.split(/(?<=[Zz])(?=[Mm])/).map((sub, i) => {
    const m = sub.match(/^([Mm])\s*(-?[\d.]+)[\s,]?(-?[\d.]+)/);
    if (!m) return sub;
    let x = Number(m[2]);
    let y = Number(m[3]);
    if (m[1] === "m" && i > 0) {
      x += start[0];
      y += start[1];
    }
    start = [x, y];
    const rest = sub.slice(m[0].length);
    // Coordinates after a relative moveto are implicit relative linetos
    const implicit = m[1] === "m" && /^[\s,]*[-\d.]/.test(rest) ? "l" : "";
    return `M${x} ${y}${implicit}${rest}`;
  });
}

export function MaterialIcon({ name, size = 16 }: { name: string; size?: number }) {
  const controls = useAnimation();
  const animation = animations[name];

  const { base, parts } = useMemo(() => {
    if (!animation?.parts) return { base: paths[name], parts: [] };
    const subpaths = splitPath(paths[name]);
    const moving = new Set(animation.parts.flatMap((p) => p.at));
    return {
      base: subpaths.filter((_, i) => !moving.has(i)).join(""),
      parts: animation.parts.map((p) => ({ ...p, d: p.at.map((i) => subpaths[i]).join("") })),
    };
  }, [name, animation]);

  const handleMouseEnter = useCallback(() => controls.start("animate"), [controls]);
  const handleMouseLeave = useCallback(() => controls.start("normal"), [controls]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <motion.svg
        animate={controls}
        fill="currentColor"
        height={size}
        style={{
          originX: animation?.wholeOrigin?.originX ?? 0.5,
          originY: animation?.wholeOrigin?.originY ?? 0.5,
        }}
        variants={animation?.whole}
        viewBox="0 -960 960 960"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={base} />
        {parts.map((part) =>
          part.pivot === "icon" ? (
            // The transparent rect makes the group's box the whole icon, so it turns around the center
            <motion.g animate={controls} key={part.at.join("-")} variants={part.variants}>
              <rect fill="none" height="960" width="960" y="-960" />
              <path d={part.d} />
            </motion.g>
          ) : (
            <motion.path
              animate={controls}
              d={part.d}
              key={part.at.join("-")}
              style={{ originX: part.originX ?? 0.5, originY: part.originY ?? 0.5 }}
              variants={part.variants}
            />
          ),
        )}
      </motion.svg>
    </div>
  );
}
