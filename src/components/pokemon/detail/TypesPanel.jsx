import { useMemo, useState } from "react";
import ComingSoon from "@/components/pokemon/detail/ComingSoon";
import TypeChip from "@/components/pokemon/detail/TypeChip";
import {
  SUMMARY_GROUPS,
  TYPES,
  defenseMultiplier,
  multiplierFor,
  multiplierLabel,
  multiplierTone,
  weaknessOf,
} from "@/data/typeChart";

const VERDICT = {
  weak: "takes extra damage",
  resist: "takes reduced damage",
  immune: "takes no damage",
  neutral: "takes normal damage",
};

export default function TypesPanel({ types = [] }) {
  const [selected, setSelected] = useState(null);

  const rows = useMemo(
    () =>
      TYPES.map((attack) => ({
        attack,
        multiplier: defenseMultiplier(attack, types),
      })),
    [types]
  );

  if (types.length === 0) return <ComingSoon label="TYPES" />;

  const selectedRow = rows.find((row) => row.attack === selected) || null;

  const groups = SUMMARY_GROUPS.map((group) => ({
    ...group,
    attacks: rows
      .filter((row) => row.multiplier === group.multiplier)
      .map((row) => row.attack),
  })).filter((group) => group.attacks.length > 0);

  return (
    <div className="flex flex-col gap-4 pt-1">
      <section>
        <div
          className="text-sm uppercase tracking-wide mb-2"
          style={{ color: "var(--app-muted)" }}
        >
          Damage taken · tap a type
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {rows.map(({ attack, multiplier }) => (
            <TypeChip
              key={attack}
              type={attack}
              multiplier={multiplier}
              active={selected === attack}
              onClick={() => setSelected(selected === attack ? null : attack)}
            />
          ))}
        </div>
      </section>

      {selectedRow && (
        <section
          className="rounded-xl p-3 flex flex-col gap-2"
          style={{
            background: "var(--app-card)",
            border: "1px solid var(--app-border)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <TypeChip type={selectedRow.attack} />
            <span
              className="text-sm font-bold no-select"
              style={{ color: "var(--app-muted)" }}
            >
              =
            </span>
            <span
              className="text-xs font-bold rounded-md px-1.5 py-1 no-select"
              style={{
                background: multiplierTone(selectedRow.multiplier),
                color: "#1a1a1a",
              }}
            >
              {multiplierLabel(selectedRow.multiplier)}
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--app-text)" }}>
              {VERDICT[weaknessOf(selectedRow.multiplier)]}
            </span>
          </div>
          <div className="text-sm" style={{ color: "var(--app-muted)" }}>
            {types
              .map(
                (type) =>
                  `${type} ${multiplierLabel(
                    multiplierFor(selectedRow.attack, type)
                  )}`
              )
              .join(" × ")}{" "}
            = {multiplierLabel(selectedRow.multiplier)}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        {groups.map((group) => (
          <div
            key={group.key}
            className="rounded-xl p-3"
            style={{
              background: "var(--app-card)",
              border: "1px solid var(--app-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-sm font-bold"
                style={{ color: "var(--app-text)" }}
              >
                {group.label}
              </span>
              <span
                className="text-xs font-bold rounded-md px-1.5 py-1 no-select"
                style={{
                  background: multiplierTone(group.multiplier),
                  color: "#1a1a1a",
                }}
              >
                {multiplierLabel(group.multiplier)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.attacks.map((attack) => (
                <TypeChip key={attack} type={attack} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}