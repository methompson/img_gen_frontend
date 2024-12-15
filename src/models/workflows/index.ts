import { isRecord, isString, isUndefined } from '@/utils/type_guards';
import {
  BasicImageGenWorkflow,
  constructBasicImageGenWorkflow,
} from './basic_image_gen_workflow';
import {
  constructUpscaleImageWorkflow,
  UpscaleImageGenWorkflow,
} from './upscale_workflow';
import { sendPrompt } from '@/api/prompt';

import { Workflow } from '@/models/workflows/types';

export function getWorkflow(input: unknown) {
  if (!isString(input)) {
    return undefined;
  }

  switch (input.toLowerCase()) {
    case Workflow.basicImageGen.toLowerCase():
      return Workflow.basicImageGen;
    case Workflow.upscaleImageGen.toLowerCase():
      return Workflow.upscaleImageGen;
    // case Workflow.img2img.toLowerCase():
    //   return Workflow.img2img;
    // case Workflow.realToAnime.toLowerCase():
    //   return Workflow.realToAnime;
    // case Workflow.animeToReal.toLowerCase():
    //   return Workflow.animeToReal;
    default:
      return undefined;
  }
}

/**
 * Parses the request input and attempts to extract required data from
 * it to construct a workflow. Exports a collection of nodes to be fed
 * into ComfyUI.
 */
export function parseAndConstructWorkflow(request: unknown) {
  if (!isRecord(request)) {
    throw new Error('Invalid request input');
  }

  const workflow = getWorkflow(request.workflow);

  if (isUndefined(workflow)) {
    throw new Error('Invalid workflow name provided');
  }

  switch (workflow) {
    case Workflow.basicImageGen:
      return constructBasicImageGenWorkflow(request);
    case Workflow.upscaleImageGen:
      return constructUpscaleImageWorkflow(request);
  }

  throw new Error('Invalid workflow name provided');
}

export async function parseAndRunWorkflow(request: Record<string, unknown>) {
  // Step 1: Determine the workflow type
  const workflow = getWorkflow(request.workflow);

  if (isUndefined(workflow)) {
    throw new Error('Invalid workflow name provided');
  }

  // Step 2: Parse the request input
  // Step 3: Get the nodes for the workflow
  switch (workflow) {
    case Workflow.basicImageGen: {
      const promptNodes = constructBasicImageGenWorkflow(request);
      const extraData = makeExtraData(
        Workflow.basicImageGen,
        promptNodes.workflow,
      );

      await sendPrompt({
        promptNodes: promptNodes.nodes,
        extraData,
      });
      break;
    }
    case Workflow.upscaleImageGen: {
      const promptNodes = constructUpscaleImageWorkflow(request);
      const extraData = makeExtraData(
        Workflow.upscaleImageGen,
        promptNodes.workflow,
      );

      await sendPrompt({
        promptNodes: promptNodes.nodes,
        extraData,
      });
      break;
    }
    default:
      throw new Error('Invalid workflow name provided');
  }

  // Step 4: Run the workflow
  // await sendPrompt({ promptNodes: promptNodes });
}

function makeExtraData(
  workflowType: Workflow,
  workflow: BasicImageGenWorkflow | UpscaleImageGenWorkflow,
) {
  return {
    extra_pnginfo: {
      workflow: {
        id: 'note_metatdata',
        type: 'Note',
        widgets_values: [
          JSON.stringify({
            workflowType,
            workflow,
          }),
        ],
      },
    },
  };
}
