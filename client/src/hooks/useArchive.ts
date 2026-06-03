import { useState, useCallback } from 'react';
import type { RijksmuseumObject } from '../types';

export function useArchive() {
  const [data, setData] = useState<RijksmuseumObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}/archive`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch: fetch_ };
}
