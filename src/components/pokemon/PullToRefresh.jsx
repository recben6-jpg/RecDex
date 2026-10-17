import { useRef, useState } from "react";
import { Loader2, ArrowDown } from "lucide-react";

const THRESHOLD = 64;
const MAX_PULL = 96;

export default function PullToRefresh({
  onRefresh,
  containerRef,
  onScroll,
  className = "",
  style,
  children,
}) {
  const innerRef = useRef(null);
  const scrollRef = containerRef || innerRef;
  const startY = useRef(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const atTop = () => (scrollRef.current?.scrollTop ?? 0) <= 0;

  const handleTouchStart = (e) => {
    if (refreshing || !atTop()) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0 || !atTop()) {
      startY.current = dy <= 0 ? startY.current : null;
      if (pull !== 0) setPull(0);
      return;
    }
    setPull(Math.min(dy * 0.45, MAX_PULL));
  };

  const handleTouchEnd = async () => {
    if (startY.current === null) return;
    startY.current = null;
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(THRESHOLD);
    await onRefresh?.();
    window.setTimeout(() => {
      setRefreshing(false);
      setPull(0);
    }, 450);
  };

  const indicatorHeight = refreshing ? 56 : pull;

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`app-scroll overflow-y-auto ${className}`}
      style={style}
    >
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{
          height: indicatorHeight,
          transition: pull === 0 || refreshing ? "height 220ms ease-out" : "none",
        }}
      >
        {(pull > 4 || refreshing) && (
          <div
            className="mb-3 flex items-center justify-center"
            style={{ color: "var(--app-accent)" }}
          >
            {refreshing ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <ArrowDown
                size={24}
                style={{
                  transform: `rotate(${pull >= THRESHOLD ? 180 : 0}deg)`,
                  transition: "transform 160ms ease-out",
                }}
              />
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}