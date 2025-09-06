import { useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function debouncedFn(...args: Parameters<T>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }

  return debouncedFn;
}
