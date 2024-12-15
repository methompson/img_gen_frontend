import { isNumber, isRecord } from '@/utils/type_guards';

export interface LatentImagePromptInput {
  latentWidth: number;
  latentHeight: number;
  batchSize: number;
}

export function isLatentImagePromptInput(
  input: unknown,
): input is LatentImagePromptInput {
  return (
    isRecord(input) &&
    isNumber(input.latentWidth) &&
    isNumber(input.latentHeight) &&
    isNumber(input.batchSize)
  );
}
