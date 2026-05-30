import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Viaje a Japón",
    short_name: "Japón",
    description:
      "Planificador del viaje a Japón: tareas, itinerario, presupuesto y documentos.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#b91c1c",
    lang: "es",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
