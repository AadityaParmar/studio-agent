---
id: PAT-device-location-trail
kind: pattern
name: Device location trail
workaround: false
seenIn:
  - {build: NB-02, area: Location}
  - {build: NB-02, area: Attendance}
  - {build: NB-02, area: Client}
  - {build: NB-02, area: MasterData}
  - {build: NB-04, area: MasterData}
  - {build: NB-04, area: Location}
  - {build: NB-05, area: Orphans (maybe dead)}
  - {build: NB-05, area: Attendence}
---

# Device location trail

## Task

Store where field staff are through the day and show it on a map with distance.

## How

- eventUserLocation workflow inserts a point row (user, geo point, time, source).
- Clock in, clock out and visits also insert points.
- Source pickText with a colour formula and pin shape for the map.
- Daily job rolls points into one row per person; distance from the point chain by formula.
- User online and offline events update the person row.

## Workaround

No. Direct feature (user location event, geo fields).

## Limits

- Point sheets grow fast; daily rollup and partitions help.
- Device settings decide how often points come.

## Flowchart

```mermaid
flowchart TD
  A["Device sends location"]
  B["Point row added"]
  C["Daily job rolls up"]
  D["Map report shows trail and km"]
  A --> B
  B --> C
  C --> D
```
