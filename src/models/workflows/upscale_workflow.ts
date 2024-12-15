import type { SendPromptModelsInput } from '@/models/node_group_data/checkpoint_model_data';
import type { LatentImagePromptInput } from '@/models/node_group_data/image_input_data';
import type { SendPromptSamplerInput } from '@/models/node_group_data/prompt_sampler_data';
import type { SendPromptUpscaleInput } from '@/models/node_group_data/upscale_data';

import { isRecord } from '@/utils/type_guards';

export interface UpscaleImageGenWorkflow {
  // Part 1 - Models. Checkpoints & Loras
  modelInput: SendPromptModelsInput;

  // Part 2 - Image Source. Latent Image size or uploaded image
  imageInput: LatentImagePromptInput;

  // Part 3 - Initial Image Generation Settings
  promptInput: SendPromptSamplerInput;

  // Part 4 - Upscale Image Settings
  upscaleInput?: SendPromptUpscaleInput;
}
