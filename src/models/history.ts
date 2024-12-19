import type { BasicImageGenWorkflow } from '@img_gen/models/workflows/basic_image_gen_workflow';
import type { UpscaleImageGenWorkflow } from '@img_gen/models/workflows/upscale_workflow';
import {
  makeIndexedObjectTypeGuard,
  makeTypeGuard,
  makeTypeGuardTest,
} from '@img_gen/utils/type_guard_generator';
import { isNumber, isRecord, isString } from '@img_gen/utils/type_guards';

// Images are defined by the following structure:
// Root object keys are the node name. THe values are objects representing images generated
// The Keys of the nested object are the original image names
export interface ImageSet {
  cleanName: string;
  image: string;
  originalFilename: string;
  small: string;
  thumb: string;
}
export const isImageSet = makeTypeGuard<ImageSet>({
  cleanName: isString,
  image: isString,
  originalFilename: isString,
  small: isString,
  thumb: isString,
});

// The values are the ImageSet object below
export interface ImageCollection {
  // The Node Name
  [key: string]: {
    // The image name
    [key: string]: ImageSet;
  };
}

const isNodeImageSet = makeIndexedObjectTypeGuard<{
  [key: string]: ImageSet;
}>(isImageSet);

export const isImageCollection =
  makeIndexedObjectTypeGuard<ImageCollection>(isNodeImageSet);

// The workflow is a JSON object that represents the workflow
// of the prompt. Current implementation doesn't require any
// specific workflows, but eventually, we'll want to parse
// some prompt data.
export type Workflow = BasicImageGenWorkflow | UpscaleImageGenWorkflow;

export interface PromptAndHistoryDataJSON {
  clientId: string;
  promptId: string;
  promptNumber: number;
  executionStart: number;
  executationEnd: number;
  images: ImageCollection;
  workflowType: string;
  workflow: Workflow;
}

const promptAndHistoryDataJSONTest = makeTypeGuardTest({
  clientId: isString,
  promptId: isString,
  promptNumber: isNumber,
  executionStart: isNumber,
  executionEnd: isNumber,
  images: isImageCollection,
  workflowType: isString,
  workflow: isRecord,
});

// Parses potential PromptAndImageData interface and
// constructs a class around it.
export class PromptAndImageData {
  protected _clientId: string;
  protected _promptId: string;
  protected _promptNumber: number;
  protected _executionStart: number;
  protected _executionEnd: number;

  protected _images: ImageCollection;
  protected _workflowType: string;
  protected _workflow: Workflow;

  constructor(input: PromptAndHistoryDataJSON) {
    this._clientId = input.clientId;
    this._promptId = input.promptId;
    this._promptNumber = input.promptNumber;
    this._executionStart = input.executionStart;
    this._executionEnd = input.executationEnd;
    this._images = input.images;
    this._workflowType = input.workflowType;
    this._workflow = input.workflow;
  }

  get clientId(): string {
    return this._clientId;
  }
  get promptId(): string {
    return this._promptId;
  }
  get promptNumber(): number {
    return this._promptNumber;
  }
  get executionStart(): number {
    return this._executionStart;
  }
  get executionEnd(): number {
    return this._executionEnd;
  }
  get images(): ImageCollection {
    return this._images;
  }
  get workflowType(): string {
    return this._workflowType;
  }
  get workflow(): Workflow {
    return this._workflow;
  }
  get positivePrompt(): string {
    const result = this.workflow?.promptInput?.positivePrompt;

    return isString(result) ? result : '';
  }
  get negativePrompt(): string {
    const result = this.workflow?.promptInput?.negativePrompt;

    return isString(result) ? result : '';
  }

  static isPromptAndHistoryDataJSON(
    input: unknown,
  ): input is PromptAndHistoryDataJSON {
    return PromptAndImageData.promptAndHistoryDataJSONTest(input).length === 0;
  }

  static promptAndHistoryDataJSONTest(input: unknown): string[] {
    return promptAndHistoryDataJSONTest(input);
  }
}
