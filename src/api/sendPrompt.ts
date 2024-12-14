// TODO change this to weight
export interface LoraInput {
  name: string;
  strength: number;
}

export interface SamplerDataInput {
  seed?: number;
  steps?: number;
  cfg?: number;
  samplerName?: string;
  scheduler?: string;
  denoise?: number;
}

export interface PromptInput {
  checkpointName: string;
  positivePrompt: string;
  negativePrompt: string;
  loras?: LoraInput[];
  latentWidth?: number;
  latentHeight?: number;
  upsizeMultiplier?: number;
  batchSize?: number;
  inputSamplerData?: SamplerDataInput;
  upscaleSamplerData: SamplerDataInput;
}

export async function sendPrompt(prompt: PromptInput): Promise<void> {}
