import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { usePokedex } from "@/contexts/PokedexProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { clearAll, clearTheme } = usePokedex();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setBusy(true);
    await clearAll();
    clearTheme();
    try {
      // only signs out if this device actually has a session
      await base44.auth.me();
      await base44.auth.logout();
    } catch {
      // no signed-in session on this device
    }
    setBusy(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl py-4 text-base font-bold border"
        style={{
          borderColor: "hsl(var(--destructive))",
          color: "hsl(var(--destructive))",
        }}
      >
        DELETE ACCOUNT
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              This erases every Pokémon count, note and appearance setting saved to
              your account and this device, and signs you out. It can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}