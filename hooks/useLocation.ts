import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import type { LocationResponse } from '@/types';

export function useLocation() {
  const [locationDescription, setLocationDescription] = useState('');
  const [location, setLocation] = useState<LocationResponse['location'] | undefined>(undefined);

  const mutation = useMutation<LocationResponse, Error, string>({
    mutationFn: async (locationDescription: string) => {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationDescription }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setLocation(data.location);
    },
  });

  const stableMutate = useCallback(mutation.mutate, [mutation]);
  const debouncedMutate = useDebounce(stableMutate, 500);

  const updateLocationDescription = (newLocationDescription: string) => {
    setLocationDescription(newLocationDescription);
    if (newLocationDescription.trim() !== "") {
      debouncedMutate(newLocationDescription);
    } else {
      setLocation(undefined);
    }
  };

  return {
    locationDescription,
    updateLocationDescription,
    location,
    error: mutation.data?.error,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
