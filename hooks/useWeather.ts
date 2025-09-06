import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { WeatherData, WeatherDataResponse } from '@/types';

const weatherCodeDescriptions: { [key: number]: string } = {
  0:  "Clear sky",

  1:  "Mainly clear",
  2:  "Partly cloudy",
  3:  "Overcast",

  45: "Fog",
  48: "Depositing rime fog",

  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",

  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",

  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",

  66: "Light freezing rain",
  67: "Heavy freezing rain",

  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",

  77: "Snow grains",

  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",

  85: "Slight snow showers",
  86: "Heavy snow showers",

  95: "Thunderstorm (slight or moderate)",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
}

const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherData[]> => {
  const queryParameters = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    forecast_days: '7',
    timezone: 'auto',
    temperature_unit: 'fahrenheit'
  });

  const url = `https://api.open-meteo.com/v1/forecast?${queryParameters.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch weather');

  const data = await response.json() as WeatherDataResponse;

  // Adapt to WeatherData array
  const numberOfDays = data.daily.temperature_2m_max.length;

  return Array.from({ length: numberOfDays }, (_, index) => ({
    date: data.daily.time[index],
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    weatherCode: data.daily.weathercode[index],
    description: weatherCodeDescriptions[data.daily.weathercode[index]] || "Unknown",
  }));
};


export const useWeather = (latitude?: number, longitude?: number) => {
  const query = useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => {
      if (latitude == null || longitude == null || (latitude === 0 && longitude === 0)) throw new Error('Missing coordinates');
      return fetchWeather(latitude, longitude);
    },
    enabled: latitude != null && longitude != null,
    refetchOnWindowFocus: false,
  });

  // Refetch when coordinates change
  useEffect(() => {
    if (latitude != null && longitude != null && (latitude === 0 && longitude === 0)) {
      query.refetch();
    }
  }, [latitude, longitude]);

  return query;
};