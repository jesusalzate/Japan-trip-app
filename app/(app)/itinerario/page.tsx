import Link from "next/link";
import { ChevronRight, MapPin, TrainFront } from "lucide-react";
import { getItineraryDays, getTripSettings, isConfigured } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { SetupNotice } from "@/components/setup-notice";
import { cityColor, dayDate, formatShort } from "@/lib/trip";
import { cn } from "@/lib/utils";

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
          15 días · Tokio → Hakone → Kioto → Osaka → Hiroshima
        </p>
      </div>

      <ol className="space-y-2.5">
        {days.map((day) => {
          const date = dayDate(settings.start_date, day.day_number);
          return (
            <li key={day.id}>
              <Link
                href={`/itinerario/${day.day_number}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                  <span className="text-[10px] font-medium uppercase">Día</span>
                  <span className="text-lg font-bold leading-none">
                    {day.day_number}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {day.city && (
                      <Badge className={cn("shrink-0", cityColor(day.city))}>
                        <MapPin className="mr-0.5 h-3 w-3" />
                        {day.city}
                      </Badge>
                    )}
                    <span className="truncate text-xs text-muted-foreground">
                      {formatShort(date)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">{day.title}</p>
                  {day.summary && (
                    <p className="truncate text-xs text-muted-foreground">
                      {day.summary}
                    </p>
                  )}
                  {day.transport && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <TrainFront className="h-3 w-3 shrink-0" />
                      {day.transport}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
