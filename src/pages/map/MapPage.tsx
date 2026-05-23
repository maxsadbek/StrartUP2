import { PageTransition } from "@/components/shared/PageTransition";
import { StationCardSkeleton } from "@/components/shared/StationCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterPanel } from "@/features/filters/FilterPanel";
import { FuelMap } from "@/features/map/FuelMap";
import { MapFuelLegend } from "@/features/map/MapFuelLegend";
import { MapStationListItem } from "@/features/map/MapStationListItem";
import { RoutePanel } from "@/features/map/RoutePanel";
import { NearestStationsStrip } from "@/features/stations/NearestStationsStrip";
import { useNavigationAssistant } from "@/hooks/useNavigationAssistant";
import { useNearestStations } from "@/hooks/useNearestStations";
import { useRoute } from "@/hooks/useRoute";
import { AppHeader } from "@/layouts/AppHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { useLocationStore } from "@/store/locationStore";
import { useMapStore } from "@/store/mapStore";
import { AlertCircle, Loader2, MapPinned, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { search, setSearch } = useFiltersStore();
  const {
    allSorted,
    mapStations,
    nearestIds,
    totalCount,
    isLoading,
    isGps,
    isOutsideUzbekistan,
    nearestCityName,
    usingFallback,
    position,
  } = useNearestStations();
  const gpsLoading = useLocationStore((s) => s.loading);
  const recenter = useLocationStore((s) => s.recenter);
  const selectedStationId = useMapStore((s) => s.selectedStationId);
  const selectStation = useMapStore((s) => s.selectStation);
  const { announceStationSelected, resetAnnouncements } =
    useNavigationAssistant();
  const prevSelectedRef = useRef<string | null>(null);

  const selectedStation =
    mapStations.find((s) => s.id === selectedStationId) ??
    allSorted.find((s) => s.id === selectedStationId) ??
    null;

  const { data: route, isLoading: routeLoading } = useRoute(
    position,
    selectedStation
      ? { lat: selectedStation.lat, lng: selectedStation.lng }
      : null,
    !!selectedStation,
  );

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedStationId === id) {
        resetAnnouncements();
        selectStation(null);
        prevSelectedRef.current = null;
        return;
      }

      const station =
        mapStations.find((s) => s.id === id) ??
        allSorted.find((s) => s.id === id);
      if (station && prevSelectedRef.current !== id) {
        announceStationSelected(station);
        prevSelectedRef.current = id;
      }
      selectStation(id);
    },
    [
      selectStation,
      selectedStationId,
      mapStations,
      allSorted,
      announceStationSelected,
      resetAnnouncements,
    ],
  );

  return (
    <>
      <AppHeader title="Xarita" />
      <PageTransition className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-6">
        <aside className="order-2 flex max-h-[40vh] flex-col border-t border-border lg:order-1 lg:max-h-none lg:w-96 lg:shrink-0 lg:border-r lg:border-t-0">
          <div className="border-b border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-accent" />
                <h2 className="font-display text-sm font-semibold">
                  Zapravkalar ({totalCount})
                </h2>
              </div>
              {gpsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  {isGps ? "GPS" : "Demo"}
                </Badge>
              )}
            </div>

            {isOutsideUzbekistan && (
              <div className="mb-3 flex gap-2 rounded-lg border border-fuel-orange/30 bg-fuel-orange/10 p-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-fuel-orange" />
                <p>
                  Siz O‘zbekiston chegarasidan tashqaridasiz. Xaritada butun
                  mamlakat bo‘yicha demo zapravkalar ko‘rsatiladi.
                </p>
              </div>
            )}

            {nearestCityName && isGps && !isOutsideUzbekistan && (
              <p className="mb-2 text-xs text-muted-foreground">
                Eng yaqin shahar:{" "}
                <span className="font-medium text-foreground">
                  {nearestCityName}
                </span>
              </p>
            )}

            {usingFallback && !isOutsideUzbekistan && (
              <p className="mb-2 text-xs text-muted-foreground">
                Yaqin atrofda stansiya yo‘q — barcha zapravkalar ko‘rsatilmoqda
              </p>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zapravka qidirish..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-3 hidden lg:block">
              <FilterPanel collapsed />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <StationCardSkeleton key={i} />
                ))
              ) : allSorted.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Zapravka topilmadi. Filtrlarni tozalang.
                </p>
              ) : (
                allSorted.map((s, i) => (
                  <MapStationListItem
                    key={s.id}
                    station={s}
                    distanceKm={s.distanceKm}
                    selected={s.id === selectedStationId}
                    rank={i + 1}
                    onClick={() => handleSelect(s.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        <div className="relative order-1 flex min-h-[55vh] flex-1 flex-col lg:order-2 lg:min-h-0 lg:max-w-200">
          <NearestStationsStrip
            onSelect={handleSelect}
            selectedId={selectedStationId}
          />

          <div className="relative flex-1">
            {isLoading && (
              <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
                  <p className="mt-2 text-sm font-medium">
                    Zapravkalar yuklanmoqda...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    OSM + butun O‘zbekiston bazasi
                  </p>
                </div>
              </div>
            )}
            <FuelMap
              stations={mapStations}
              userPosition={position}
              selectedStationId={selectedStationId}
              nearestIds={nearestIds}
              route={route}
              onSelectStation={handleSelect}
              onRecenter={recenter}
              className="h-full min-h-[35vh] lg:min-h-0 lg:h-[calc(100vh-3.5rem-88px)]"
            />

            <MapFuelLegend />

            {!selectedStation && (
              <div className="pointer-events-none absolute right-4 top-4 z-[1000] max-w-[220px] lg:top-36">
                <div className="glass rounded-xl px-4 py-3 text-sm shadow-lg">
                  <p className="font-medium">{totalCount} ta zapravka</p>
                  <p className="text-muted-foreground text-xs">
                    Benzin · Metan · Propan · Dizel
                  </p>
                </div>
              </div>
            )}

            {selectedStation && (
              <RoutePanel
                station={selectedStation}
                route={route}
                routeLoading={routeLoading}
                distanceKm={selectedStation.distanceKm}
                onClose={() => selectStation(null)}
              />
            )}

            <button
              type="button"
              className="absolute bottom-4 left-4 z-[1000] rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtrlar
            </button>

            {showFilters && (
              <div className="absolute inset-x-0 bottom-0 z-[1001] max-h-[45vh] overflow-y-auto rounded-t-2xl border border-border bg-background p-4 lg:hidden">
                <FilterPanel />
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
