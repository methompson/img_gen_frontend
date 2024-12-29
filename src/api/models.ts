import { getBaseURL } from '@/utils/base_url';
import { isRecord, isStringArray } from '@img_gen/utils/type_guards';

export interface GetModelsOutput {
  models: string[];
  loras: string[];
  upscaleModels: string[];
}

export async function fetchModels(): Promise<GetModelsOutput> {
  const baseUrl = getBaseURL();
  const response = await fetch(`${baseUrl}/models`);
  const data = await response.json();

  if (!isRecord(data)) {
    throw new Error('Expected an object');
  }

  const models = isStringArray(data.models) ? data.models : [];
  const loras = isStringArray(data.loras) ? data.loras : [];
  const upscaleModels = isStringArray(data.upscaleModels)
    ? data.upscaleModels
    : [];

  return { models, loras, upscaleModels };
}
