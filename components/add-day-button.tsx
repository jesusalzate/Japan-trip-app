"use client";

import { useTransition } from "react";
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

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() => start(() => addItineraryDay(afterDayNumber))}
    >
      <Plus className="h-4 w-4" /> {pending ? "Añadiendo…" : label}
    </Button>
  );
}
