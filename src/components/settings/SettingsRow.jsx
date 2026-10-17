export default function SettingsRow({ label, children, stacked = false }) {
  return (
    <div
      className={
        "rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background " +
        (stacked
          ? "flex flex-col gap-3"
          : "flex items-center justify-between gap-3")
      }
      style={{
        background: "var(--app-row)",
        border: "1px solid var(--app-border)",
      }}
    >
      <span
        className="text-sm font-bold uppercase tracking-wide no-select"
        style={{ color: "var(--app-text)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}