import { isNumberOrUndefined } from '@/src/utils/type_guards';
import {
  parseSamplerInput,
  SamplerDataInput,
} from '@/src/dataModels/model_data';

export interface SendPromptUpscaleInput {
  upscaleWidth?: number;
  upscaleHeight?: number;

  upscaleSamplerInput?: SamplerDataInput;
}

// TODO add the upscaler model
export function parsePromptUpscaleInput(
  request: Record<string, unknown>,
): SendPromptUpscaleInput {
  const upscaleWidth = request.upscaleWidth;
  const upscaleHeight = request.upscaleHeight;
  const upscaleSamplerInput = parseSamplerInput(request.upscaleSamplerData);

  if (
    !isNumberOrUndefined(upscaleWidth) ||
    !isNumberOrUndefined(upscaleHeight)
  ) {
    throw new Error('Invalid Upscale Body');
  }

  const upscaleInput: SendPromptUpscaleInput = {
    upscaleWidth,
    upscaleHeight,
    upscaleSamplerInput,
  };

  return upscaleInput;
}
