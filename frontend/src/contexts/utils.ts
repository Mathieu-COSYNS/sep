// @see https://www.carlrippon.com/react-context-with-typescript-p4/

import { createContext, Provider, useContext } from 'react';

export const createCtx = <ContextType>(): readonly [() => ContextType, Provider<ContextType | undefined>] => {
  const ctx = createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  }
  return [useCtx, ctx.Provider] as const;
};
