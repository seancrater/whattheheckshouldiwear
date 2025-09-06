import { useQuery } from '@tanstack/react-query';
import type { WeatherData, OutfitResponse } from '@/types';

export function useOutfits(weather: WeatherData[] | undefined) {
  const query = useQuery<OutfitResponse, Error>({
    queryKey: ['outfits', weather],
    queryFn: async () => {
      if (!weather || weather.length !== 7) {
        throw new Error('Weather data must be an array of 7 days');
      }
      
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherByDay: weather }),
      });

      return await response.json();
    },
    enabled: !!weather && weather.length === 7,
  });

  return {
    outfits: query.data?.outfits || undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error,
  };
}
