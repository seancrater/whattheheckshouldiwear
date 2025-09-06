import React from "react";
import { format, parseISO } from "date-fns";

interface DayCardProps {
  date: string;
  description: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  outfitSuggestion: string | undefined;
}

export default function DayCard({ date, description, temperatureMax, temperatureMin, weatherCode, outfitSuggestion }: DayCardProps) {
  const dayOfWeek = format(parseISO(date), "EEEE");

  return (
    <div className="flex flex-col gap-2 sm:flex-row items-start justify-between bg-gradient-to-r from-blue-100 to-blue-300 p-3 mb-2 rounded-lg shadow border border-blue-400 relative">
      <div className="h-full w-6 absolute bottom-0 left-0 flex items-center justify-center rounded-bl-lg rounded-tl-lg bg-blue-400">
        <div className="-rotate-90 text-xs text-white text-nowrap font-bold uppercase">{dayOfWeek}</div>
      </div>

      <div className="flex flex-col items-center sm:items-start sm:w-1/3 ml-6">
        <div className="text-base font-semibold text-blue-900 mb-1 text-left truncate w-full">
          {description}
        </div>

        <div className="flex gap-4 mb-1">
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-600">High</span>
            <span className="text-base font-bold text-red-500">{temperatureMax}°F</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-600">Low</span>
            <span className="text-base font-bold text-blue-500">{temperatureMin}°F</span>
          </div>
        </div>
      </div>

      {outfitSuggestion && (
        <div className="sm:ml-6 flex flex-col justify-start items-start mt-2 sm:mt-0 w-2/3">
          <span className="text-md font-medium text-gray-800 mb-2">What to wear</span>
          <span className="text-sm text-gray-700">{outfitSuggestion}</span>
        </div>
      )}
    </div>
  );
}
