import { useCallback, useEffect, useRef } from "react";

const CLICK_SLOP = 6; // movement that turns a tap into a drag
const FRICTION = 0.93; // per-frame damping of a flick
const MIN_GLIDE = 0.4; // px per frame at which the glide stops

// lets a one-line strip be pushed sideways with the mouse, like a slider
export function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startLeft: 0,
    moved: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const glide = useRef(0);

  const stopGlide = useCallback(() => {
    if (glide.current) cancelAnimationFrame(glide.current);
    glide.current = 0;
  }, []);

  useEffect(() => stopGlide, [stopGlide]);

  const glideOn = useCallback(() => {
    const el = ref.current;
    let velocity = drag.current.velocity;
    if (!el || Math.abs(velocity) < MIN_GLIDE) return;

    const step = () => {
      const before = el.scrollLeft;
      velocity *= FRICTION;
      el.scrollLeft = before - velocity;
      // stop once the flick has faded out, or at either end of the strip
      if (Math.abs(velocity) < MIN_GLIDE || el.scrollLeft === before) {
        glide.current = 0;
        return;
      }
      glide.current = requestAnimationFrame(step);
    };

    glide.current = requestAnimationFrame(step);
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      // touch already pans natively, so only the mouse is handled here
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = ref.current;
      if (!el) return;
      stopGlide();
      drag.current = {
        active: true,
        startX: e.clientX,
        startLeft: el.scrollLeft,
        moved: 0,
        lastX: e.clientX,
        lastTime: performance.now(),
        velocity: 0,
      };
    },
    [stopGlide]
  );

  const onPointerMove = useCallback((e) => {
    const el = ref.current;
    const d = drag.current;
    if (!el || !d.active) return;

    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    el.scrollLeft = d.startLeft - dx;

    const now = performance.now();
    const dt = now - d.lastTime;
    if (dt > 0) {
      d.velocity = ((e.clientX - d.lastX) / dt) * 16;
      d.lastX = e.clientX;
      d.lastTime = now;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    glideOn();
    // the click that closes a drag lands before this timeout runs
    setTimeout(() => {
      d.moved = 0;
    }, 0);
  }, [glideOn]);

  // a drag should not also activate whatever it ended on
  const onClickCapture = useCallback((e) => {
    if (drag.current.moved > CLICK_SLOP) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave: onPointerUp,
      onClickCapture,
    },
  };
}