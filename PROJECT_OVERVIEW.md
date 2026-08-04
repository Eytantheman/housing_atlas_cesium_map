# Augmented Atlas — Project Overview

## What it is

**Augmented Atlas of Social Housing in the NL** is an interactive 3D web map
that documents Dutch collective and social housing projects. It's built from
research produced within a TU Delft course, in collaboration with **Het
Nieuwe Instituut**, and combines architectural documentation with the social
histories and lived experiences behind each building.

Rather than a static catalogue, the project treats the archive as an open,
evolving structure — a research tool as much as a public exhibition space.
Visitors fly across a real-world 3D globe (Google Photorealistic 3D Tiles)
and land on individual housing projects, where they can explore drawings,
photographs, and narrative descriptions layered directly onto — or
alongside — the buildings themselves.

## Core experience

- A full-screen 3D globe opens on an overview of the Netherlands.
- A persistent side list of housing projects (sorted geographically, with
  Amsterdam first) lets visitors fly to any project with a pre-set camera
  angle.
- Selecting a project opens a detail panel with:
  - Period, programme type, and unit count
  - A written history/description of the project
  - Photographs and archival images (lightbox view)
  - Axonometric drawings, each linking out to a full PDF
- Some drawings (plans and elevations/sections) can be **placed directly in
  the 3D scene** as geo-registered image planes — toggled on/off from the
  lightbox ("show in place on model") — so a floor plan or facade drawing
  overlays the real building at the correct location, orientation, and
  scale.
- Select locations have embedded **video hotspots**: draggable video
  overlays anchored to points on the map, used for oral histories or
  site footage.
- A toggle switches between photorealistic 3D tiles and a flat 2D satellite
  basemap.

## Content model

Each housing project record includes:

| Field | Description |
|---|---|
| `name`, `city`, `lat`/`lng` | Identity and location |
| `architect` | Designer(s) of record |
| `era` | Decade built (e.g. 1971–1980) |
| `social_org` | Social housing typology (e.g. co-housing, singles housing, elderly care) |
| `scale`, `bag_id`, `note` | Supplementary metadata |
| `description` | Long-form narrative history |
| `axos` | Student-produced axonometric drawings, each with a caption crediting the authors and a link to the source PDF |
| `thumbs` | Archival photos/images, some carrying a saved camera position so clicking one flies the viewer to that vantage point |

The drawings and photos are credited to their sources — student teams
(with course/year codes), Het Nieuwe Instituut's collection, Stadsarchief
Amsterdam, and other named contributors — preserving the archive's
provenance rather than presenting it as anonymous content.

## Technical stack

- **React 19 + TypeScript**, built with **Vite**
- **CesiumJS** (via `vite-plugin-cesium`) for the 3D globe, camera flights,
  and Google Photorealistic 3D Tiles integration
- Content is static/local: a JSON dataset of projects plus TypeScript config
  files for cameras, image-plane placements, and video hotspots — no backend
  or CMS; updates are made by editing these files and adding assets under
  `public/`

## Who it's for

- **Researchers and students** documenting Dutch social housing, who need a
  way to situate drawings and oral histories in real geographic and
  architectural context.
- **The public / exhibition visitors**, exploring the housing projects
  spatially rather than through a conventional list or gallery.
- **Institutional partners** (e.g. Het Nieuwe Instituut) using it as a living
  showcase that can keep absorbing new case studies over time.
