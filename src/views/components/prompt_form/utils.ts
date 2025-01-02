import type { ImageCollection, ImageSet } from '@/models/history';

export function getImagesByNode(
  imageCollection: ImageCollection,
): Record<string, ImageSet[]> {
  const imagesByNode: Record<string, ImageSet[]> = {};

  Object.entries(imageCollection).forEach(([key, value]) => {
    const imageLinks = Object.values(value).map((v) => {
      return v;
    });

    imagesByNode[key] = imageLinks;
  });

  return imagesByNode;
}
