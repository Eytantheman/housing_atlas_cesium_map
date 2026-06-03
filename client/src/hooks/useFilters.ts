import { useState, useMemo } from 'react';
import type { FilterState, ProjectFeatureCollection, HousingProject, Era } from '../types';

const DEFAULT_FILTERS: FilterState = {
  eras: [],
  cities: [],
  socialOrg: '',
  searchQuery: '',
};

export function useFilters(
  features: ProjectFeatureCollection | null,
  allProjects: HousingProject[]
) {
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFiltersState(f => ({ ...f, [key]: value }));
  }

  function clearFilters() {
    setFiltersState(DEFAULT_FILTERS);
  }

  function matchesProject(p: HousingProject): boolean {
    if (filters.eras.length && !filters.eras.includes(p.era as Era)) return false;
    if (filters.cities.length && !filters.cities.includes(p.city)) return false;
    if (filters.socialOrg && !(p.social_org ?? '').toLowerCase().includes(filters.socialOrg.toLowerCase())) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!`${p.name} ${p.architect} ${p.social_org ?? ''}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }

  const filteredFeatures = useMemo((): ProjectFeatureCollection => {
    if (!features) return { type: 'FeatureCollection', features: [] };
    return {
      ...features,
      features: features.features.filter(f => matchesProject(f.properties)),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, filters]);

  const filteredList = useMemo(() => allProjects.filter(matchesProject),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [allProjects, filters]);

  return { filters, setFilter, clearFilters, filteredFeatures, filteredList };
}
