export interface LocationResponse {
  location?: {
    title: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
  error?: string;
}

export type OutfitResponse = {
  outfits?: string[];
  error?: string;
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export interface WeatherData {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  description: string;
}

export interface WeatherDataResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}