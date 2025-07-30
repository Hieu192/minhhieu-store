'use client';

import { useState, useEffect } from 'react';

export function useLocalStorageList(key: string) {
  const [list, setList] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setList(JSON.parse(stored));
  }, [key]);

  const toggle = (id: number) => {
    const updated = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    setList(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const add = (id: number) => {
    if (!list.includes(id)) {
      const updated = [...list, id].slice(0, 3); // giới hạn 3
      setList(updated);
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  const remove = (id: number) => {
    const updated = list.filter((x) => x !== id);
    setList(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const has = (id: number) => list.includes(id);

  return { list, add, remove, toggle, has };
}
