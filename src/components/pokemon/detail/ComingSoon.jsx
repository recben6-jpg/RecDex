export default function ComingSoon({ label }) {
  return (
    <p className="text-sm py-10 text-center" style={{ color: "var(--app-muted)" }}>
      {label} — coming soon for this Pokémon.
    </p>
  );
}