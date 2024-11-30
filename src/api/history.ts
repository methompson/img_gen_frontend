import { isPromptAndImageData, type PromptAndImageData } from '@/models/history_data';
import { isArray } from '@/utils/type_guards';

export async function fetchHistory(): Promise<PromptAndImageData[]> {
  const response = await fetch('http://localhost:3000/images');
  const data = await response.json();

  // Parse Data into a class
  const output: PromptAndImageData[] = [];

  if (!isArray(data)) {
    throw new Error('Expected an array');
  }

  for (const dat of data) {
    if (!isPromptAndImageData(dat)) {
      throw new Error('Expected PromptAndImageData');
    }

    output.push(dat);
  }

  return output;
}
