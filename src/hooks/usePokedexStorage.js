import { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";

const OWNED_KEY = "pokedex-owned-local";
const NOTES_KEY = "pokedex-notes-local";
const SAVE_DELAY = 600; // quiet time before a change is pushed to the account

// one load at a time, so two mounts can never create two account records
let loading = false;

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable - keep in-memory state for this session
  }
}

function drop(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// everything this device knows that the account copy doesn't have yet
function merge(remote = {}, local = {}) {
  const out = { ...remote };
  Object.entries(local).forEach(([num, value]) => {
    if (out[num] === undefined) out[num] = value;
  });
  return out;
}

const grew = (merged, remote) => Object.keys(merged).length > Object.keys(remote).length;

export function usePokedexStorage() {
  const [owned, setOwned] = useState(() => read(OWNED_KEY, {}));
  const [notes, setNotes] = useState(() => read(NOTES_KEY, {}));

  // the live values, so an edit never has to wait for a re-render
  const ownedRef = useRef(owned);
  const notesRef = useRef(notes);
  const recordId = useRef(null);
  const pending = useRef(null);
  const timer = useRef(0);

  // the device keeps its own copy: the app opens instantly, online or not
  useEffect(() => {
    write(OWNED_KEY, owned);
  }, [owned]);

  useEffect(() => {
    write(NOTES_KEY, notes);
  }, [notes]);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = 0;
    const id = recordId.current;
    const data = pending.current;
    pending.current = null;
    if (!id || !data) return;
    base44.entities.PokedexCollection.update(id, data).catch(() => {
      // keep it for the next attempt rather than losing the edit
      pending.current = data;
    });
  }, []);

  const save = useCallback(
    (data) => {
      pending.current = data;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_DELAY);
    },
    [flush]
  );

  const sync = useCallback(async () => {
    if (loading) return;
    loading = true;
    try {
      let rows;
      try {
        rows = await base44.entities.PokedexCollection.list("-updated_date", 1);
      } catch {
        return; // offline - this device carries on with its own copy
      }

      const remote = rows && rows[0];
      const localOwned = ownedRef.current;
      const localNotes = notesRef.current;

      if (!remote) {
        // first time on this account: adopt what this device already holds
        try {
          const created = await base44.entities.PokedexCollection.create({
            owned: localOwned,
            notes: localNotes,
          });
          recordId.current = created?.id ?? null;
        } catch {
          // the next sync tries again
        }
        return;
      }

      recordId.current = remote.id;
      const remoteOwned = remote.owned || {};
      const remoteNotes = remote.notes || {};
      const nextOwned = merge(remoteOwned, localOwned);
      const nextNotes = merge(remoteNotes, localNotes);

      ownedRef.current = nextOwned;
      notesRef.current = nextNotes;
      setOwned(nextOwned);
      setNotes(nextNotes);

      // hand back anything only this device had
      if (grew(nextOwned, remoteOwned) || grew(nextNotes, remoteNotes)) {
        save({ owned: nextOwned, notes: nextNotes });
      }
    } finally {
      loading = false;
    }
  }, [save]);

  useEffect(() => {
    sync();
    return () => {
      if (pending.current) flush();
    };
  }, [sync, flush]);

  const setOwnedCount = useCallback(
    (num, count) => {
      const next = { ...ownedRef.current };
      if (count <= 0) delete next[num];
      else next[num] = count;
      ownedRef.current = next;
      setOwned(next);
      save({ owned: next, notes: notesRef.current });
    },
    [save]
  );

  const setNote = useCallback(
    (num, text) => {
      const next = { ...notesRef.current };
      if (!text) delete next[num];
      else next[num] = text;
      notesRef.current = next;
      setNotes(next);
      save({ owned: ownedRef.current, notes: next });
    },
    [save]
  );

  // pull-to-refresh: push what is pending, then re-read the account copy
  const reload = useCallback(async () => {
    flush();
    await sync();
  }, [flush, sync]);

  const clearAll = useCallback(async () => {
    window.clearTimeout(timer.current);
    timer.current = 0;
    pending.current = null;
    drop(OWNED_KEY);
    drop(NOTES_KEY);

    ownedRef.current = {};
    notesRef.current = {};
    setOwned({});
    setNotes({});

    const id = recordId.current;
    recordId.current = null;
    try {
      if (id) {
        await base44.entities.PokedexCollection.delete(id);
      } else {
        const rows = await base44.entities.PokedexCollection.list("-updated_date", 10);
        await Promise.all(
          rows.map((row) => base44.entities.PokedexCollection.delete(row.id))
        );
      }
    } catch {
      // the device copy is gone either way
    }
  }, []);

  return { owned, notes, setOwnedCount, setNote, reload, clearAll };
}