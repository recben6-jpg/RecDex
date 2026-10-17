import { Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "2", label: "2 per row" },
  { value: "3", label: "3 per row" },
  { value: "4", label: "4 per row" },
  { value: "5", label: "5 per row" },
];

export default function PerRowSheet({ open, onOpenChange, value, onSelect }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent
        style={{
          background: "var(--app-surface)",
          borderColor: "var(--app-border)",
        }}
      >
        <DrawerHeader>
          <DrawerTitle style={{ color: "var(--app-text)" }}>
            Pokémon per row
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4 flex flex-col gap-2 safe-bottom">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold"
              style={{
                background: "var(--app-row)",
                border: "1px solid var(--app-border)",
                color: "var(--app-text)",
              }}
            >
              {o.label}
              {value === o.value && (
                <Check size={22} style={{ color: "var(--app-accent)" }} />
              )}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}