import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const GAP = 12; // matches the gap between cards
const OVERSCAN = 3; // rows kept rendered beyond the viewport
const MIN_COL = 120;
const MAX_COL = 190;
const SEED_ROWS = 12; // covers the first paint, replaced as soon as we measure

// Uniform cards mean one measured row height plus the scroll offset is enough
// to know exactly which slice of the grid belongs on screen.
export default function useGridWindow({
  count,
  perRow,
  scrollRef,
  initialScrollTop = 0,
}) {
  const wrapRef = useRef(null);
  const probeRef = useRef(null);
  const restoredRef = useRef(false);
  const [width, setWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [range, setRange] = useState(() => ({ start: 0, end: SEED_ROWS }));

  // same rule as an auto-fill grid: how many 120-190px columns fit
  const minCol =
    typeof window === "undefined"
      ? MAX_COL
      : Math.min(MAX_COL, Math.max(MIN_COL, window.innerWidth * 0.19));
  const cols =
    perRow === "auto"
      ? Math.max(1, Math.floor((width + GAP) / (minCol + GAP)))
      : Math.max(1, Number(perRow) || 1);

  const totalRows = Math.ceil(count / cols);
  const stride = rowHeight + GAP;
  const totalHeight =
    rowHeight > 0 && totalRows > 0
      ? totalRows * rowHeight + (totalRows - 1) * GAP
      : 0;

  // real column width and real card height, taken from the probe row
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measuredWidth = wrap.clientWidth;
    setWidth((prev) => (prev === measuredWidth ? prev : measuredWidth));
    // the probe only tells us the truth once the real column width is known
    if (!measuredWidth) return;
    const probe = probeRef.current;
    if (probe) {
      const measuredHeight = probe.offsetHeight;
      setRowHeight((prev) => (prev === measuredHeight ? prev : measuredHeight));
    }
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, cols, count]);

  // catches viewport, font and column-count changes that no render caused
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const targets = [wrapRef.current, probeRef.current].filter(Boolean);
    if (!targets.length) return;
    const ro = new ResizeObserver(() => measure());
    targets.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [measure, cols, count]);

  // the remembered position has to be back before the first window is computed,
  // otherwise the rendered rows would be the top of the list
  useLayoutEffect(() => {
    const el = scrollRef?.current;
    if (!el || restoredRef.current || totalHeight <= 0) return;
    restoredRef.current = true;
    if (initialScrollTop > 0) el.scrollTop = initialScrollTop;
  }, [scrollRef, initialScrollTop, totalHeight]);

  // which rows are on screen, measured against the scrolling container
  useLayoutEffect(() => {
    const el = scrollRef?.current;
    if (!el || !wrapRef.current || rowHeight <= 0) return;

    const update = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const view = el.getBoundingClientRect();
      const grid = wrap.getBoundingClientRect();
      const above = view.top - grid.top;
      const start = Math.max(0, Math.floor(above / stride) - OVERSCAN);
      const end = Math.min(
        totalRows,
        Math.max(start + 1, Math.ceil((above + view.height) / stride) + OVERSCAN)
      );
      setRange((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end }
      );
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [scrollRef, rowHeight, stride, totalRows]);

  return {
    wrapRef,
    probeRef,
    cols,
    gap: GAP,
    stride,
    totalHeight,
    start: Math.min(range.start, Math.max(0, totalRows - 1)),
    end: Math.min(range.end, totalRows),
  };
}