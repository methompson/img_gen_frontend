import type { SamplerData } from '@img_gen/models/inputs/sampler';
import { getSeed } from '@img_gen/utils/get_seed';

export interface PromptLoraInput {
  id: string;
  name: string;
  strengthModel: number;
  strengthClip: number;
  position: number;
}

export function getDefaultUpscaleSamplerData(): SamplerData {
  return {
    seed: getSeed(),
    steps: 5,
    cfg: 1,
    samplerName: 'euler',
    scheduler: 'normal',
    denoise: 0.3,
  };
}

export function getDefaultImageSamplerData(): SamplerData {
  return {
    seed: getSeed(),
    steps: 25,
    cfg: 5,
    samplerName: 'euler',
    scheduler: 'normal',
    denoise: 1,
  };
}
