"use client";

import DayCard from "@/components/DayCard";
import Textarea from "@/components/ui/Textarea";
import { useLocation } from "@/hooks/useLocation";
import { useOutfits } from "@/hooks/useOutfits";
import { useWeather } from "@/hooks/useWeather";

export default function LocationHandler() {
  const { location, error: locationError, isLoading: isLoadingLocation, isError: isLocationError, locationDescription, updateLocationDescription } = useLocation();

  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const { data: weather, isLoading: isLoadingWeather, isError: isWeatherError } = useWeather(latitude, longitude);

  const { outfits, isLoading: isLoadingOutfits, isError: isOutfitsError, error: outfitsError } = useOutfits(weather);

  const isError = isLocationError || isOutfitsError || isWeatherError;
  const isLoading = isLoadingLocation || isLoadingOutfits || isLoadingWeather;

  const isReadyToShowCards = !isLoading && !isError && !!weather && !!outfits;

  return (
    <>
      <section className="max-w-lg mb-8">
        <label htmlFor="location" className="block mb-2 text-lg font-medium">
          Tell us a bit about where you are going
        </label>

        <Textarea
          id="location"
          placeholder="e.g., a casual day at the beach midway up the east coast, Boston, a frozen tundra north of the US border, etc."
          spellCheck={false}
          onChange={event => updateLocationDescription(event.target.value)}
          value={locationDescription}
          className="w-full"
        />
      </section>
      
      <section className="flex justify-center flex-col w-full">
        {(isLoading) && (
          <div className="flex items-center justify-center gap-2 text-blue-500 animate-pulse my-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            <span>Loading...</span>
          </div>
        )}

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">
            {locationError || outfitsError ? (
              <span>{locationError || outfitsError}</span>
            ) : (
              <span>Something went wrong. Please try again.</span>
            )}
          </div>
        )}

        {locationDescription && latitude && longitude && !isError && !isLoading && (
          <>
            <div className="w-full text-center text-md font-semibold mb-4">
              Here is a forecast and outfit suggestions for {location?.title ? location.title : locationDescription}
            </div>
            
            <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
              {isReadyToShowCards && (
                weather.map((day, index) => (
                  <DayCard
                    key={day.temperatureMax + day.temperatureMin + day.weatherCode}
                    date={day.date}
                    description={day.description}
                    temperatureMax={day.temperatureMax}
                    temperatureMin={day.temperatureMin}
                    weatherCode={day.weatherCode}
                    outfitSuggestion={outfits.length > 0 ? outfits[index] : undefined}
                  />
                ))
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}