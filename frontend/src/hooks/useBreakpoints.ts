import { useCallback } from 'react';
import { createBreakpoint } from 'react-use';

const BREAKPOINTS_NAMES = ['sm', 'md', 'lg', 'xl'];
const useBreakpoint = createBreakpoint({ sm: 0, md: 576, lg: 768, xl: 992 });

const useBreakpoints = (): {
  breakpoint: string;
  minBreakpoint: (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => boolean;
} => {
  const currentBreakpoint = useBreakpoint();

  const minBreakpoint = useCallback(
    (breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean => {
      return BREAKPOINTS_NAMES.indexOf(breakpoint) <= BREAKPOINTS_NAMES.indexOf(currentBreakpoint);
    },
    [currentBreakpoint],
  );

  return {
    breakpoint: currentBreakpoint,
    minBreakpoint,
  };
};

export default useBreakpoints;
