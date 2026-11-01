
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Country = {
  name: string;
  iso3: string;
  region: string;
  survey: string;
  focus: string;
  coordinates: [number, number];
};

const researchCountries: Country[] = [
  {
    name: "Bangladesh",
    iso3: "BGD",
    region: "South Asia",
    survey: "Bangladesh DHS 2022",
    focus: "Maternal health, reproductive health, and mental health",
    coordinates: [90.36, 23.68],
  },
  {
    name: "Nepal",
    iso3: "NPL",
    region: "South Asia",
    survey: "Nepal DHS 2022",
    focus: "Child health, early childhood education, and health equity",
    coordinates: [84.12, 28.39],
  },
  {
    name: "Zambia",
    iso3: "ZMB",
    region: "Sub-Saharan Africa",
    survey: "Zambia DHS 2018",
    focus: "Women's mental health and intimate partner violence",
    coordinates: [27.85, -13.13],
  },
  {
    name: "Mozambique",
    iso3: "MOZ",
    region: "Sub-Saharan Africa",
    survey: "Mozambique DHS 2022–2023",
    focus: "Mental health and geographic inequalities",
    coordinates: [35.53, -18.67],
  },
  {
    name: "Lesotho",
    iso3: "LSO",
    region: "Sub-Saharan Africa",
    survey: "Lesotho DHS 2014",
    focus: "Decision-making autonomy and depressive symptoms",
    coordinates: [28.23, -29.61],
  },
];

type Props = {
  countries?: string[];
};

export default function ResearchWorldMap({
  countries = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [selected, setSelected] = useState<Country | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const activeCountries = useMemo(() => {
    if (!countries.length) return researchCountries;

    return researchCountries.filter((country) =>
      countries.some(
        (value) =>
          value.trim().toLowerCase() === country.name.toLowerCase()
      )
    );
  }, [countries]);

  const activeRef = useRef(activeCountries);
  activeRef.current = activeCountries;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Load the MapLibre worker as a same-origin file to avoid Next.js dev worker URL issues.
    // Copy maplibre-gl-csp-worker.js into public/ before running the app.
    maplibregl.setWorkerUrl("/maplibre-gl-csp-worker.js");

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [42, 8],
      zoom: 1.3,
      minZoom: 1,
      maxZoom: 9,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          countries: {
            type: "geojson",
            data:
              "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
          },
        },
        layers: [
          {
            id: "ocean",
            type: "background",
            paint: { "background-color": "#eaf3f7" },
          },
          {
            id: "land",
            type: "fill",
            source: "countries",
            paint: {
              "fill-color": "#cbdbe4",
              "fill-opacity": 0.95,
            },
          },
          {
            id: "boundaries",
            type: "line",
            source: "countries",
            paint: {
              "line-color": "#ffffff",
              "line-width": 0.65,
            },
          },
          {
            id: "coverage",
            type: "fill",
            source: "countries",
            filter: ["==", ["coalesce", ["get", "name"], ["get", "ADMIN"], ""], "__none__"],
            paint: {
              "fill-color": "#087f8c",
              "fill-opacity": 0.88,
            },
          },
          {
            id: "coverage-outline",
            type: "line",
            source: "countries",
            filter: ["==", ["coalesce", ["get", "name"], ["get", "ADMIN"], ""], "__none__"],
            paint: {
              "line-color": "#075766",
              "line-width": 1.7,
            },
          },
        ],
      },
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "top-right"
    );

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("load", () => {
      const names = activeRef.current.map((c) => c.name);

      const filter: maplibregl.FilterSpecification = [
        "in",
        ["coalesce", ["get", "name"], ["get", "ADMIN"], ""],
        ["literal", names],
      ];

      map.setFilter("coverage", filter);
      map.setFilter("coverage-outline", filter);

      setStatus("ready");
    });

    map.on("click", "coverage", (event) => {
      const name = event.features?.[0]?.properties?.name ?? event.features?.[0]?.properties?.ADMIN;

      const country = activeRef.current.find(
        (item) => item.name === name
      );

      if (!country) return;

      setSelected(country);

      map.flyTo({
        center: country.coordinates,
        zoom: 4,
        essential: true,
      });
    });

    map.on("mouseenter", "coverage", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "coverage", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("error", (event) => {
      console.error("Research atlas error:", event.error);
      setStatus("error");
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const names = activeCountries.map((c) => c.name);

    const filter: maplibregl.FilterSpecification = [
      "in",
      ["coalesce", ["get", "name"], ["get", "ADMIN"], ""],
      ["literal", names],
    ];

    map.setFilter("coverage", filter);
    map.setFilter("coverage-outline", filter);
  }, [activeCountries]);

  function focusCountry(country: Country) {
    setSelected(country);

    mapRef.current?.flyTo({
      center: country.coordinates,
      zoom: 4,
      essential: true,
    });
  }

  function resetMap() {
    setSelected(null);

    mapRef.current?.flyTo({
      center: [42, 8],
      zoom: 1.3,
      essential: true,
    });
  }

  return (
    <section className="mt-12 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Spatial Epidemiology / Research Geography
        </p>

        <h2 className="mt-2 font-serif text-3xl font-semibold">
          Global Health Research Atlas
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          An interactive geographic overview of population
          health research conducted using Demographic and
          Health Survey datasets.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat
          value={String(activeCountries.length)}
          label="Research Countries"
        />
        <Stat
          value={String(
            new Set(activeCountries.map((c) => c.region)).size
          )}
          label="Geographic Regions"
        />
        <Stat value="DHS" label="Survey Data Source" />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-900">
              Geographic Research Coverage
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Click a highlighted country to explore research.
            </p>
          </div>

          <button
            type="button"
            onClick={resetMap}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset Map
          </button>
        </div>

        <div className="relative">
          <div
            ref={containerRef}
            className="h-[360px] w-full md:h-[500px]"
            aria-label="Interactive geographic research coverage map"
          />

          {status === "loading" && (
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-xs text-slate-700 shadow">
              Loading geographic boundaries...
            </div>
          )}

          {status === "error" && (
            <div className="absolute bottom-4 left-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 shadow">
              Map data could not be loaded. Please refresh.
            </div>
          )}
        </div>

        <div className="border-t bg-slate-50 p-4">
          <div className="flex flex-wrap gap-5 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-teal-700" />
              Research coverage
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#cbdbe4]" />
              Other countries
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Shading indicates research coverage only, not
            disease prevalence, incidence, or risk.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeCountries.map((country) => (
          <button
            key={country.iso3}
            type="button"
            onClick={() => focusCountry(country)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selected?.iso3 === country.iso3
                ? "border-teal-700 bg-teal-700 text-white"
                : "hover:border-teal-600 hover:text-teal-700"
            }`}
          >
            {country.name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-2xl border p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
            Country Research Profile
          </p>

          <h3 className="mt-2 font-serif text-2xl font-semibold">
            {selected.name}
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Info label="Region" value={selected.region} />
            <Info label="Survey Dataset" value={selected.survey} />
          </div>

          <div className="mt-4">
            <Info label="Research Focus" value={selected.focus} />
          </div>

          <Link
            href={`/publications?country=${encodeURIComponent(
              selected.name
            )}`}
            className="mt-5 inline-flex rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Explore Publications →
          </Link>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        Geographic boundaries: geo-countries dataset.
        Research coverage is illustrative of study locations,
        not a spatial estimate of health outcomes.
      </p>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="font-serif text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
