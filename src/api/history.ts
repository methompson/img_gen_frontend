import { PromptAndImageData } from '@/models/history';
import { getBaseURL } from '@/utils/base_url';
import { isArray } from '@img_gen/utils/type_guards';

export async function fetchImages(): Promise<PromptAndImageData[]> {
  const response = await fetch('http://localhost:3000/images');
  const data = await response.json();

  // Parse Data into a class
  const output: PromptAndImageData[] = [];

  if (!isArray(data)) {
    throw new Error('Expected an array');
  }

  for (const dat of data) {
    if (PromptAndImageData.isPromptAndHistoryDataJSON(dat)) {
      output.push(new PromptAndImageData(dat));
    }
  }

  return output;
}

export async function deleteHistoryItems(id: string | string[]): Promise<void> {
  const deleteIds = isArray(id) ? id : [id];

  const body = JSON.stringify({ deleteIds });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const baseUrl = getBaseURL();

  await fetch(`${baseUrl}/deleteHistoryItems`, {
    method: 'POST',
    headers,
    body,
  });
}
