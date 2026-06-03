import { useState, useEffect, useCallback } from 'react';
import type { ProjectFeatureCollection, HousingProject } from '../types';

export function useProjects() {
  const [features, setFeatures] = useState<ProjectFeatureCollection | null>(null);
  const [allProjects, setAllProjects] = useState<HousingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const [geoRes, listRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/projects/list'),
      ]);
      const geo = await geoRes.json();
      const list = await listRes.json();
      setFeatures(geo);
      setAllProjects(list);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const handler = () => fetchData(false);
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, [fetchData]);

  function getBagIds(): Record<number, string> {
    const result: Record<number, string> = {};
    for (const p of allProjects) {
      if (p.bag_id) result[p.id] = p.bag_id;
    }
    return result;
  }

  return { features, allProjects, loading, error, getBagIds };
}
