"use client";

import { useState, useTransition } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { updateYenRate } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CurrencyConverter({
  settingsId,
  rate,
}: {
  settingsId: string;
  rate: number;
}) {
  const [eur, setEur] = useState("100");
  const [jpy, setJpy] = useState(() => String(Math.round(100 * rate)));
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(String(rate));

  function onEurChange(value: string) {
    setEur(value);
    const n = Number(value);
    setJpy(value === "" || !Number.isFinite(n) ? "" : String(Math.round(n * rate)));
  }

  function onJpyChange(value: string) {
    setJpy(value);
    const n = Number(value);
    setEur(
      value === "" || !Number.isFinite(n) || rate <= 0
        ? ""
        : (n / rate).toFixed(2),
    );
  }

  function refreshRate() {
    setError(null);
    start(async () => {
      try {
        const res = await fetch("/api/exchange-rate");
        const data = await res.json();
        if (!res.ok || typeof data.rate !== "number") {
          setError(data.error ?? "No se pudo obtener el tipo de cambio.");
          return;
        }
        const result = await updateYenRate(settingsId, data.rate);
        if (!result.ok) setError(result.message);
      } catch {
        setError("No se pudo contactar con el servicio de cambio.");
      }
    });
  }

  function saveManualRate() {
    const n = Number(rateInput.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) {
      setError("Introduce un número válido.");
      return;
    }
    start(async () => {
      setError(null);
      const result = await updateYenRate(settingsId, n);
      if (!result.ok) setError(result.message);
      else setEditingRate(false);
    });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Conversor € / ¥</CardTitle>
        <button
          onClick={refreshRate}
          disabled={pending || !settingsId}
          className="text-muted-foreground hover:text-primary disabled:opacity-40"
          aria-label="Actualizar tipo de cambio"
          title="Actualizar tipo de cambio"
        >
          <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">
              Euros
            </label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={eur}
              onChange={(e) => onEurChange(e.target.value)}
            />
          </div>
          <ArrowLeftRight className="mb-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">
              Yenes
            </label>
            <Input
              type="number"
              inputMode="decimal"
              step="1"
              value={jpy}
              onChange={(e) => onJpyChange(e.target.value)}
            />
          </div>
        </div>

        {editingRate ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="h-8 text-xs"
              autoFocus
            />
            <Button size="sm" disabled={pending} onClick={saveManualRate}>
              Guardar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditingRate(false)}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <button
            onClick={() => {
              setRateInput(String(rate));
              setEditingRate(true);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            1 € = {rate.toLocaleString("es-ES", { maximumFractionDigits: 2 })} ¥
            · editar manualmente
          </button>
        )}

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
