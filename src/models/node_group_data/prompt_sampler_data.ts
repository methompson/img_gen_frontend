import {
  isSamplerData,
  type SamplerData,
} from '@/models/node_group_data/sampler_types';
import { isRecord, isString } from '@/utils/type_guards';

export interface SendPromptSamplerInput {
  samplerInput: SamplerData;

  positivePrompt: string;
  negativePrompt: string;
}

export function isSendPromptSamplerInput(
  input: unknown,
): input is SendPromptSamplerInput {
  return (
    isRecord(input) &&
    isSamplerData(input.samplerInput) &&
    isString(input.positivePrompt) &&
    isString(input.negativePrompt)
  );
}
