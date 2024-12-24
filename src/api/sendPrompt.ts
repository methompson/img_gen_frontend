import type { Workflow } from '@img_gen/models/workflows/workflows';

export async function sendPrompt(
  promptType: string,
  prompt: Workflow,
): Promise<void> {
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

  await fetch('http://localhost:3000/sendPrompt', requestOptions);
}
