import { isNumber, isRecord, isString } from '@/utils/type_guards';

export interface SamplerData {
  seed: number;
  steps: number;
  cfg: number;
  samplerName: string;
  scheduler: string;
  denoise: number;
}

export function isSamplerData(input: unknown): input is SamplerData {
  return (
    isRecord(input) &&
    isNumber(input.seed) &&
    isNumber(input.steps) &&
    isNumber(input.cfg) &&
    isString(input.samplerName) &&
    isString(input.scheduler) &&
    isNumber(input.denoise)
  );
}
