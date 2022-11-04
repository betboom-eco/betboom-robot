import { useState } from 'react';

type NFunc = () => void;
export function useToggle(defaultValue = false) {
  const [on, set] = useState(defaultValue);

  const toggle = () => set((v) => !v);
  const open = set.bind(null, true);
  const close = set.bind(null, false);
  return [on, { toggle, open, close }] as [
    boolean,
    { toggle: NFunc; open: NFunc; close: NFunc }
  ];
}
