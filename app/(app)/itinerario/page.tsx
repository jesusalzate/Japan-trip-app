import { getItineraryDays, getTripSettings, isConfigured } from "@/lib/data";
import { SetupNotice } from "@/components/setup-notice";
import { AddDayButton } from "@/components/add-day-button";
import { ItineraryDayRow } from "@/components/itinerary-day-row";
import { dayDate, formatShort } from "@/lib/trip";

export const dynamic = "force-dynamic";

export default async function ItinerarioPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Itinerario</h1>
        <SetupNotice />
      </div>
    );
  }

  const [days, settings] = await Promise.all([
    getItineraryDays(),
    getTripSettings(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Itinerario</h1>
        <p className="text-sm text-muted-foreground">
          {days.length} {days.length === 1 ? "día" : "días"} · toca uno para
          ver o editar los detalles
        </p>
      </div>

      <AddDayButton
        afterDayNumber={0}
        label={days.length === 0 ? "Añadir el primer día" : "Añadir día al principio"}
      />

      {days.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Todavía no hay días en el itinerario.
        </p>
      ) : (
        <ol className="space-y-2.5">
          {days.map((day) => {
            const date = dayDate(settings.start_date, day.day_number);
            return (
              <ItineraryDayRow
                key={day.id}
                day={day}
                dateLabel={formatShort(date)}
              />
            );
          })}
        </ol>
      )}
    </div>
  );
}
