import type { IFloorConfig, IFloorLayer, IFloorTexture } from "./floor";

export interface IResolvedFloorLayer {
  id: string;

  texture: IFloorTexture;

  regionX: number;
  regionY: number;

  regionWidth: number;
  regionHeight: number;
}

export function resolveFloorLayers(
  floor: IFloorConfig,
  x: number,
  y: number,
  floorWidth: number,
  floorHeight: number,
): IResolvedFloorLayer[] {
  const resolvedLayers: IResolvedFloorLayer[] = [
    {
      id: "base",

      texture: floor.base,

      regionX: x,
      regionY: y,

      regionWidth: floorWidth,

      regionHeight: floorHeight,
    },
  ];

  floor.layers?.forEach((layer) => {
    const resolvedLayer = resolveLayer(layer, x, y, floorWidth, floorHeight);

    if (!resolvedLayer) {
      return;
    }

    resolvedLayers.push(resolvedLayer);
  });

  return resolvedLayers;
}

function resolveLayer(
  layer: IFloorLayer,
  x: number,
  y: number,
  floorWidth: number,
  floorHeight: number,
): IResolvedFloorLayer | null {
  const tileOverride = layer.tiles?.find(
    (tile) => tile.position.x === x && tile.position.y === y,
  );

  if (tileOverride) {
    return {
      id: layer.id,

      texture: tileOverride.texture,

      regionX: 0,
      regionY: 0,

      regionWidth: 1,
      regionHeight: 1,
    };
  }

  const regionOverride = layer.regions?.find(
    (region) =>
      x >= Math.min(region.from.x, region.to.x) &&
      x <= Math.max(region.from.x, region.to.x) &&
      y >= Math.min(region.from.y, region.to.y) &&
      y <= Math.max(region.from.y, region.to.y),
  );

  if (regionOverride) {
    const minX = Math.min(regionOverride.from.x, regionOverride.to.x);

    const maxX = Math.max(regionOverride.from.x, regionOverride.to.x);

    const minY = Math.min(regionOverride.from.y, regionOverride.to.y);

    const maxY = Math.max(regionOverride.from.y, regionOverride.to.y);

    return {
      id: layer.id,

      texture: regionOverride.texture,

      regionX: x - minX,

      regionY: y - minY,

      regionWidth: maxX - minX + 1,

      regionHeight: maxY - minY + 1,
    };
  }

  if (layer.texture) {
    return {
      id: layer.id,

      texture: layer.texture,

      regionX: x,
      regionY: y,

      regionWidth: floorWidth,

      regionHeight: floorHeight,
    };
  }

  return null;
}
