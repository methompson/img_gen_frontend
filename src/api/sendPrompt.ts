import {
  isSendPromptResponse,
  type SendPromptResponse,
} from '@img_gen/models/inputs/prompt_models';
import type { Workflow } from '@img_gen/models/workflows/workflows';

export async function sendPrompt(
  promptType: string,
  prompt: Workflow,
): Promise<SendPromptResponse> {
  const body = JSON.stringify({
    workflow: promptType,
    ...prompt,
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  const response = await fetch(
    'http://localhost:3000/sendPrompt',
    requestOptions,
  );
  const json = await response.json();

  if (!isSendPromptResponse(json)) {
    throw new Error('Invalid response');
  }

  return {
    prompt_id: json.prompt_id,
    number: json.number,
  };
}
