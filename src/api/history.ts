import { PromptAndImageData } from '@/models/history';
import { isArray } from '@img_gen/utils/type_guards';

export async function fetchImages(): Promise<PromptAndImageData[]> {
  const response = await fetch('http://localhost:3000/images');
  const data = await response.json();

  // Parse Data into a class
  const output: PromptAndImageData[] = [];

  if (!isArray(data)) {
    throw new Error('Expected an array');
  }

  console.log('history', data);

  for (const dat of data) {
    if (PromptAndImageData.isPromptAndHistoryDataJSON(dat)) {
      output.push(new PromptAndImageData(dat));
    }
  }

  console.log({
    history: data,
    promptDat: output,
  });

  return output;
}
