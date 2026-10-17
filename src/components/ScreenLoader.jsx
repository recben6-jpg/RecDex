export default function ScreenLoader({ className = "h-full" }) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ background: "var(--app-bg)" }}
    >
      <div
        className="w-8 h-8 rounded-full border-4 animate-spin"
        style={{
          borderColor: "var(--app-border)",
          borderTopColor: "var(--app-accent)",
        }}
      />
    </div>
  );
}