import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, TrainFront } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTripSettings, isConfigured } from "@/lib/data";
import { updateDayNotes, updateDayTransport } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetupNotice } from "@/components/setup-notice";
import { ActivityList } from "@/components/activity-list";
import { DayFieldEditor } from "@/components/day-field-editor";
import { EditDayDetailsForm } from "@/components/edit-day-details-form";
import { cityColor, dayDate, formatLong } from "@/lib/trip";
import { cn } from "@/lib/utils";
import type { ItineraryActivity, ItineraryDay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DiaPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dayNumber = Number(day);

  if (!isConfigured()) return <SetupNotice />;
  if (!Number.isInteger(dayNumber) || dayNumber < 1) notFound();

  const supabase = await createClient();
  const [{ data: dayRow }, settings] = await Promise.all([
    supabase
      .from("itinerary_days")
      .select("*")
      .eq("day_number", dayNumber)
      .single(),
    getTripSettings(),
  ]);

  if (!dayRow) notFound();
  const dayData = dayRow as ItineraryDay;

  const { data: acts } = await supabase
    .from("itinerary_activities")
    .select("*")
    .eq("day_id", dayData.id)
    .order("sort_order", { ascending: true });
  const activities = (acts ?? []) as ItineraryActivity[];

  const date = dayDate(settings.start_date, dayNumber);

  return (
    <div className="space-y-5">
      <Link
        href="/itinerario"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Itinerario
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            Día {dayNumber}
          </span>
          {dayData.city && (
            <Badge className={cn(cityColor(dayData.city))}>
              <MapPin className="mr-0.5 h-3 w-3" />
              {dayData.city}
            </Badge>
          )}
        </div>
        <h1 className="mt-1 text-xl font-bold">{dayData.title}</h1>
        <p className="text-sm capitalize text-muted-foreground">
          {formatLong(date)}
        </p>
        {dayData.summary && (
          <p className="mt-2 text-sm text-foreground/80">{dayData.summary}</p>
        )}
        <div className="mt-3">
          <EditDayDetailsForm
            id={dayData.id}
            title={dayData.title}
            city={dayData.city}
            summary={dayData.summary}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList dayId={dayData.id} activities={activities} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <TrainFront className="h-4 w-4 text-primary" />
          <CardTitle>Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <DayFieldEditor
            id={dayData.id}
            initial={dayData.transport}
            placeholder="Tren, pase o billete de este día (p. ej. Shinkansen Tokaido, asiento reservado 14A)…"
            saveLabel="Guardar transporte"
            action={updateDayTransport}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <DayFieldEditor
            id={dayData.id}
            initial={dayData.notes}
            placeholder="Notas del día: reservas, horarios, restaurantes, ideas…"
            saveLabel="Guardar notas"
            action={updateDayNotes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
