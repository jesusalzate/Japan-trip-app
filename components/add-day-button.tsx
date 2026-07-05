"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addItineraryDay } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function AddDayButton({
  afterDayNumber,
  label,
}: {
  afterDayNumber: number;
  label: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const result = await addItineraryDay(afterDayNumber);
            if (!result.ok) setError(result.message);
          })
        }
      >
        <Plus className="h-4 w-4" /> {pending ? "Añadiendo…" : label}
      </Button>
      {error && (
        <p className="mt-1.5 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
