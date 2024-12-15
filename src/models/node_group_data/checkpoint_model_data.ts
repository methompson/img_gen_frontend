import { isNumber, isRecord, isString, isArray } from '@/utils/type_guards';

// TODO change this to handle both strength model and strength clip
export interface LoraInput {
  name: string;
  weight: number;
}

export function isLoraInput(input: unknown): input is LoraInput {
  return isRecord(input) && isString(input.name) && isNumber(input.weight);
}

export interface SendPromptModelsInput {
  checkpointName: string;
  loras: LoraInput[];
}

export function isSendPromptModelsInput(
  input: unknown,
): input is SendPromptModelsInput {
  if (
    !isRecord(input) ||
    !isString(input.checkpointName) ||
    !isArray(input.loras)
  ) {
    return false;
  }

  return input.loras.every(isLoraInput);
}
