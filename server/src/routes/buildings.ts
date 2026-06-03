import { Router, Request, Response } from 'express';
import { getBagIdMap, getAllProjects, getProjectById } from '../services/projectsService';
import { getBuildingsInBbox, getBuildingMetadata, getBuildingsByIds } from '../services/threeDBAGService';

const router = Router();

router.get('/bbox', async (req: Request, res: Response) => {
  const { minLng, minLat, maxLng, maxLat } = req.query as Record<string, string>;
  if (!minLng || !minLat || !maxLng || !maxLat) {
    res.status(400).json({ error: 'Missing bbox params', code: 400 });
    return;
  }
  const bagIdMap = getBagIdMap(); // NL.IMBAG.Pand.xxx → project id

  const geojson = await getBuildingsInBbox(
    parseFloat(minLng), parseFloat(minLat),
    parseFloat(maxLng), parseFloat(maxLat)
  ) as { type: string; features: Array<{ properties: Record<string, unknown> }> };

  // Tag atlas buildings in the bbox result
  const returnedIds = new Set<string>();
  if (geojson.features) {
    for (const f of geojson.features) {
      const id = String(f.properties['identificatie'] ?? '');
      returnedIds.add(id);
      const atlasId = bagIdMap[id];
      f.properties['is_atlas_project'] = atlasId !== undefined;
      f.properties['atlas_id'] = atlasId ?? null;
    }
  }

  // PDOK caps results — atlas buildings may be absent from wide-bbox queries.
  // Only force-fetch atlas buildings whose centroid is within the requested viewport.
  const [bMinLng, bMinLat, bMaxLng, bMaxLat] = [
    parseFloat(minLng), parseFloat(minLat), parseFloat(maxLng), parseFloat(maxLat),
  ];
  const inViewAtlasIds = getAllProjects()
    .filter(p =>
      p.bag_id &&
      !returnedIds.has(p.bag_id) &&
      p.lat !== null && p.lng !== null &&
      p.lat >= bMinLat && p.lat <= bMaxLat &&
      p.lng >= bMinLng && p.lng <= bMaxLng,
    );
  const missingItems = inViewAtlasIds.map(p => ({
    bareId: p.bag_id!.replace(/^NL\.IMBAG\.Pand\./, ''),
    lat: p.lat!,
    lng: p.lng!,
  }));
  const missingBareIds = missingItems.map(i => i.bareId);

  if (missingBareIds.length > 0) {
    // Fetch polygon footprints + 3DBAG heights in parallel
    const [extras, heightResults] = await Promise.all([
      getBuildingsByIds(missingItems),
      Promise.all(
        inViewAtlasIds.map(p => getBuildingMetadata(p.bag_id!).then(m => ({ bagId: p.bag_id!, m }))),
      ),
    ]);
    const heightMap = new Map(heightResults.map(({ bagId, m }) => [bagId, m]));

    const newFeatures = [...geojson.features];
    for (const f of extras) {
      const bareId = String(f.properties['identificatie'] ?? '');
      const fullId = `NL.IMBAG.Pand.${bareId}`;
      const atlasId = bagIdMap[fullId];
      const meta = heightMap.get(fullId);
      newFeatures.push({
        ...f,
        properties: {
          ...f.properties,
          identificatie: fullId,
          b3_h_dak_50p: meta?.b3_h_dak_50p ?? 8,
          b3_h_maaiveld: meta?.b3_h_maaiveld ?? 0,
          is_atlas_project: atlasId !== undefined,
          atlas_id: atlasId ?? null,
        },
      });
    }
    return res.json({ ...geojson, features: newFeatures });
  }

  res.json(geojson);
});

router.get('/:bagId/metadata', async (req: Request, res: Response) => {
  const { bagId } = req.params;
  const bagIdMap = getBagIdMap();
  const atlasId = bagIdMap[bagId];

  const threeDBAG = await getBuildingMetadata(bagId);
  const atlasProject = atlasId ? getProjectById(atlasId) ?? null : null;

  res.json({ threeDBAG, atlasProject });
});

export default router;
