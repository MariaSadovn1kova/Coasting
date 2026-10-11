import { Assets, MeshSimple, type Texture } from "pixi.js";

import { GAME_CONFIG } from "../core/game-config";

import type { IFloorTexture } from "./floor";

interface ICreateFloorTileViewOptions {
  textureConfig: IFloorTexture;

  x: number;
  y: number;

  floorWidth: number;
  floorHeight: number;
}

interface ICreateFloorUvsOptions {
  textureConfig: IFloorTexture;

  x: number;
  y: number;

  floorWidth: number;
  floorHeight: number;
}

interface ITextureUvTransformOptions {
  u: number;
  v: number;

  scale: number;

  rotation: number;

  offsetX: number;
  offsetY: number;

  repeatX: number;
  repeatY: number;
}

export async function createFloorTileView({
  textureConfig,

  x,
  y,

  floorWidth,
  floorHeight,
}: ICreateFloorTileViewOptions) {
  const texture = await Assets.load<Texture>(textureConfig.src);

  texture.source.wrapMode = "repeat";

  const halfWidth = GAME_CONFIG.tile.width / 2;

  const halfHeight = GAME_CONFIG.tile.height / 2;

  const vertices = new Float32Array([
    0,
    -halfHeight,

    halfWidth,
    0,

    0,
    halfHeight,

    -halfWidth,
    0,
  ]);

  const uvs = createFloorUvs({
    textureConfig,

    x,
    y,

    floorWidth,
    floorHeight,
  });

  const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

  const mesh = new MeshSimple({
    texture,
    vertices,
    uvs,
    indices,
  });

  mesh.alpha = textureConfig.alpha ?? 1;

  mesh.blendMode = textureConfig.blendMode ?? "normal";

  return mesh;
}

function createFloorUvs({
  textureConfig,

  x,
  y,

  floorWidth,
  floorHeight,
}: ICreateFloorUvsOptions) {
  const mode = textureConfig.mode ?? "tile";

  let baseUvs: number[];

  if (mode === "tile") {
    baseUvs = [0, 0, 1, 0, 1, 1, 0, 1];
  } else {
    const u0 = x / floorWidth;

    const u1 = (x + 1) / floorWidth;

    const v0 = y / floorHeight;

    const v1 = (y + 1) / floorHeight;

    baseUvs = [u0, v0, u1, v0, u1, v1, u0, v1];
  }

  const scale = Math.max(0.01, textureConfig.scale ?? 1);

  const rotation = textureConfig.rotation ?? 0;

  const offsetX = textureConfig.offsetX ?? 0;

  const offsetY = textureConfig.offsetY ?? 0;

  const repeatX = Math.max(0.01, textureConfig.repeatX ?? 1);

  const repeatY = Math.max(0.01, textureConfig.repeatY ?? 1);

  const transformedUvs: number[] = [];

  for (let index = 0; index < baseUvs.length; index += 2) {
    const transformed = transformTextureUv({
      u: baseUvs[index],

      v: baseUvs[index + 1],

      scale,

      rotation,

      offsetX,
      offsetY,

      repeatX,
      repeatY,
    });

    transformedUvs.push(transformed.u, transformed.v);
  }

  return new Float32Array(transformedUvs);
}

function transformTextureUv({
  u,
  v,

  scale,

  rotation,

  offsetX,
  offsetY,

  repeatX,
  repeatY,
}: ITextureUvTransformOptions) {
  let transformedU = u - 0.5;

  let transformedV = v - 0.5;

  transformedU /= scale;

  transformedV /= scale;

  const radians = rotation * (Math.PI / 180);

  const cos = Math.cos(radians);

  const sin = Math.sin(radians);

  const rotatedU = transformedU * cos - transformedV * sin;

  const rotatedV = transformedU * sin + transformedV * cos;

  const repeatedU = rotatedU * repeatX;

  const repeatedV = rotatedV * repeatY;

  return {
    u: repeatedU + 0.5 + offsetX,

    v: repeatedV + 0.5 + offsetY,
  };
}
