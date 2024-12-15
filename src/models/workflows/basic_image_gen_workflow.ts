import {
  getModelAndLorasNodes,
  parseModelsAndLoras,
  parseModelsAndLorasFromHistory,
  SendPromptModelsInput,
} from '@/models/node_group_data/checkpoint_model_data';
import {
  getLatentImageInputNodes,
  LatentImagePromptInput,
  parseImageInput,
  parseImageInputFromHistory,
} from '@/models/node_group_data/image_input_data';
import {
  getPromptAndSamplerNodes,
  parsePromptSamplerInput,
  SendPromptSamplerInput,
} from '@/models/node_group_data/prompt_sampler_data';
import { isRecord } from '@/utils/type_guards';
import { PromptHistory } from '@/models/history';

export interface BasicImageGenWorkflow {
  // Part 1 - Models. Checkpoints & Loras
  modelInput: SendPromptModelsInput;

  // Part 2 - Image Source. Latent Image size or uploaded image
  imageInput: LatentImagePromptInput;

  // Part 3 - Initial Image Generation Settings
  promptInput: SendPromptSamplerInput;
}

export interface BasicImageGenWorkflowOutput {
  nodes: Record<string, unknown>;
  workflow: BasicImageGenWorkflow;
}

export function constructBasicImageGenWorkflow(
  request: unknown,
): BasicImageGenWorkflowOutput {
  if (!isRecord(request)) {
    throw new Error('Invalid request input');
  }

  // First step is to parse all of the request input
  // data to get all of the required information
  // Second step is to get the nodes for the workflow.
  const modelInput = parseModelsAndLoras(request.models);
  const modelNodes = getModelAndLorasNodes(modelInput);

  const imageInput = parseImageInput(request.imageInput);
  const imageNodes = getLatentImageInputNodes(imageInput);

  const promptSamplerInput = parsePromptSamplerInput(request.promptInput);
  const promptSamplerNodes = getPromptAndSamplerNodes({
    promptSamplerInput: promptSamplerInput,
    vaeNodeKey: modelNodes.vaeNodeKey,
    modelNodeKey: modelNodes.modelNodeKey,
    clipNodeKey: modelNodes.clipNodeKey,
    imageInputNodeKey: imageNodes.imageInputNodeKey,
  });

  const nodes = {
    ...modelNodes.modelsAndLoras,
    ...imageNodes.imageNodes,
    ...promptSamplerNodes.promptAndSamplerNodes,
  };

  return {
    nodes,
    workflow: {
      modelInput,
      imageInput,
      promptInput: promptSamplerInput,
    },
  };
}

export function constructBasicImageGenWorkflowFromHistory(
  input: PromptHistory,
): BasicImageGenWorkflow {
  const modelInput = parseModelsAndLorasFromHistory(input);
  const imageInput = parseImageInputFromHistory(input);
  const promptInput = parsePromptSamplerInput(input);

  return {
    modelInput,
    imageInput,
    promptInput,
  };
}
