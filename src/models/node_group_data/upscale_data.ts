import {
  isSamplerData,
  type SamplerData,
} from '@/models/node_group_data/sampler_types';
import { isNumber, isRecord, isString } from '@/utils/type_guards';

export interface SendPromptUpscaleInput {
  upscaleWidth: number;
  upscaleHeight: number;
  upscaleModelName: string;

  samplerInput: SamplerData;
}

export function isSendPromptUpscaleInput(
  input: unknown,
): input is SendPromptUpscaleInput {
  return (
    isRecord(input) &&
    isNumber(input.upscaleWidth) &&
    isNumber(input.upscaleHeight) &&
    isString(input.upscaleModelName) &&
    isSamplerData(input.samplerInput)
  );
}
