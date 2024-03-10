import { ReactNode, createContext, useContext, useLayoutEffect, useState } from 'react';
import { createAtom } from './atomStore';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

interface Atom<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (callback: (value: T) => void) => () => void;
}

const shallowEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

export const createContextWithSelectors = <T,>(name?: string) => {
  const Context = createContext<Atom<T> | undefined>(undefined);

  const Provider = ({ value, children }: { children: ReactNode; value: T }): JSX.Element | null => {
    const [store] = useState(() => createAtom(value));

    useLayoutEffect(() => {
      store.set(value);
    }, [store, value]);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useSelector = <R,>(selector: (value: T) => R, isEqual?: (a: R, b: R) => boolean): R => {
    const store = useContext(Context);

    if (!store) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    return useSyncExternalStoreWithSelector(store.subscribe, store.get, null, selector, isEqual);
  };

  const useSelectorShallow = <R extends Record<string, any> | any[] | null | undefined>(
    selector: (value: T) => R
  ): R => {
    return useSelector(selector, shallowEqual);
  };

  return {
    Context,
    Provider,
    useSelector,
    useSelectorShallow,
  };
};
