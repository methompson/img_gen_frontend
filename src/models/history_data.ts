import { isNumber, isRecord, isString } from '@/utils/type_guards';

export interface SamplerData {
  seed: number;
  steps: number;
  cfg: number;
  samplerName: string;
  scheduler: string;
  denoise: number;
}

function isSamplerData(input: unknown): input is SamplerData {
  if (!isRecord(input)) {
    return false;
  }

  return (
    isNumber(input.seed) &&
    isNumber(input.steps) &&
    isNumber(input.cfg) &&
    isString(input.samplerName) &&
    isString(input.scheduler) &&
    isNumber(input.denoise)
  );
}

interface ImageSet {
  image: string;
  thumb: string;
  small: string;
}

function isImageSet(input: unknown): input is ImageSet {
  if (!isRecord(input)) {
    return false;
  }

  return isString(input.image) && isString(input.thumb) && isString(input.small);
}

export interface PromptAndImageData {
  clientId: string;
  promptId: string;
  promptNumber: number;
  positiveClip: string;
  negativeClip: string;
  samplerData: SamplerData;
  images: Record<string, Record<string, Record<string, ImageSet>>>;
}

function promptAndImageDataTest(input: unknown): string[] {
  if (!isRecord(input)) {
    return ['root'];
  }

  const output: string[] = [];

  if (!isString(input.clientId)) output.push('clientId');
  if (!isString(input.promptId)) output.push('promptId');
  if (!isNumber(input.promptNumber)) output.push('promptNumber');
  if (!isString(input.positiveClip)) output.push('positiveClip');
  if (!isString(input.negativeClip)) output.push('negativeClip');
  if (!isSamplerData(input.samplerData)) output.push('samplerData');

  if (!isRecord(input.images)) {
    output.push('images');
  } else {
    // Each value is an object. THe key is the node name
    Object.values(input.images).forEach((val, idxA) => {
      if (!isRecord(val)) {
        output.push(`images[${idxA}]`);
        return;
      }

      // Each value is an imageset. The key is the image name
      Object.values(val).forEach((innerVal, idxB) => {
        if (!isRecord(innerVal)) {
          output.push(`images[${idxA}][${idxB}]`);
          return;
        }

        if (!isImageSet(innerVal)) {
          output.push(`images[${idxA}][${idxB}]`);
        }
      });
    });
  }

  return output;
}

export function isPromptAndImageData(input: unknown): input is PromptAndImageData {
  const test = promptAndImageDataTest(input);

  if (test.length > 0) {
    console.error(`PromptAndImageData failed: ${test.join(', ')}`);
    return false;
  }

  return true;
}
