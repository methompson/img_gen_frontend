// Images are defined by the following structure:
// Root object keys are the node name. THe values are objects representing images generated
// The Keys of the nested object are the original image names

import { isNumber, isRecord, isString } from '@/utils/type_guards';

// The values are the ImageSet object below
export interface ImageCollection {
  // The Node Name
  [key: string]: {
    // The original image name
    [key: string]: ImageSet;
  };
}

export interface ImageSet {
  cleanName: string;
  image: string;
  originalFilename: string;
  small: string;
  thumb: string;
}

// The workflow is a JSON object that represents the workflow
// of the prompt. Current implementation doesn't require any
// specific workflows, but eventually, we'll want to parse
// some prompt data.
export interface Workflow {
  [key: string]: Record<string, unknown>;
}

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

  static isPromptAndHistoryDataJSON(input: unknown): input is PromptAndHistoryDataJSON {
    const errors = PromptAndImageData.promptAndHistoryDataJSONTest(input);
    return errors.length === 0;
  }

  static promptAndHistoryDataJSONTest(input: unknown): string[] {
    if (!isRecord(input)) {
      return ['root'];
    }

    const output: string[] = [];

    if (!isString(input.clientId)) {
      output.push('clientId');
    }
    if (!isString(input.promptId)) {
      output.push('promptId');
    }
    if (!isNumber(input.promptNumber)) {
      output.push('promptNumber');
    }
    if (!isNumber(input.executionStart)) {
      output.push('executionStart');
    }
    if (!isNumber(input.executionEnd)) {
      output.push('executionEnd');
    }

    if (!this.isImageCollection(input.images)) {
      output.push('images');
    }
    if (!isString(input.workflowType)) {
      output.push('workflowType');
    }
    if (!isRecord(input.workflow)) {
      output.push('workflow');
    }

    return output;
  }

  static isImageCollection(input: unknown): input is ImageCollection {
    if (!isRecord(input)) {
      return false;
    }

    for (const node of Object.values(input)) {
      if (!isRecord(node)) {
        return false;
      }

      for (const image of Object.values(node)) {
        if (!isRecord(image)) {
          return false;
        }
        if (!isString(image.cleanName)) {
          return false;
        }
        if (!isString(image.image)) {
          return false;
        }
        if (!isString(image.originalFilename)) {
          return false;
        }
        if (!isString(image.small)) {
          return false;
        }
        if (!isString(image.thumb)) {
          return false;
        }
      }
    }

    return true;
  }
}
