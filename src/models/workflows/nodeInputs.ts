import { isNumber, isRecord, isString } from '@/utils/type_guards';

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
