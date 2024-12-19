import {
  isImageCollection,
  isImageSet,
  PromptAndImageData,
  type ImageSet,
} from '@/models/history';

describe('History', () => {
  describe('isImageSet', () => {
    test('returns true for an imageset', () => {
      const imgSet: ImageSet = {
        cleanName: 'clean.jpg',
        image: 'clean.jpg',
        originalFilename: 'clean.jpg',
        small: 'clean.jpg',
        thumb: 'clean.jpg',
      };

      expect(isImageSet(imgSet)).toBe(true);
    });

    test('returns false for an invalid imageset', () => {
      const imgSet: Record<string, unknown> = {};

      expect(isImageSet(imgSet)).toBe(false);

      imgSet.cleanName = 'clean.jpg';
      expect(isImageSet(imgSet)).toBe(false);

      imgSet.image = 'clean.jpg';
      expect(isImageSet(imgSet)).toBe(false);

      imgSet.originalFilename = 'clean.jpg';
      expect(isImageSet(imgSet)).toBe(false);

      imgSet.small = 'clean.jpg';
      expect(isImageSet(imgSet)).toBe(false);

      imgSet.thumb = 'clean.jpg';
      expect(isImageSet(imgSet)).toBe(true);
    });
  });

  describe('isImageCollection', () => {
    test('returns true for an image collection', () => {
      const imgCol: Record<string, unknown> = {
        node1: {
          img1: {
            cleanName: 'clean.jpg',
            image: 'clean.jpg',
            originalFilename: 'clean.jpg',
            small: 'clean.jpg',
            thumb: 'clean.jpg',
          },
        },
      };

      expect(isImageCollection(imgCol)).toBe(true);
    });

    test('returns false for an object that is not an image collection', () => {
      let imgCol: Record<string, unknown> = {
        node1: { key: 'abc' },
      };

      expect(isImageCollection(imgCol)).toBe(false);

      imgCol = {
        node1: {
          img1: {},
        },
      };
      expect(isImageCollection(imgCol)).toBe(false);
    });
  });

  describe('PromptAndImageData', () => {
    describe('promptAndHistoryDataJSONTest', () => {
      test('returns an empty array for a valid PromptAndHistoryDataJSON object', () => {
        const input = {
          clientId: 'client1',
          promptId: 'prompt1',
          promptNumber: 1,
          executionStart: 1,
          executionEnd: 2,
          images: {
            node1: {
              img1: {
                cleanName: 'clean.jpg',
                image: 'clean.jpg',
                originalFilename: 'clean.jpg',
                small: 'clean.jpg',
                thumb: 'clean.jpg',
              },
            },
          },
          workflowType: 'workflow',
          workflow: {},
        };

        expect(PromptAndImageData.promptAndHistoryDataJSONTest(input)).toEqual(
          [],
        );
      });

      test('returns an array of errors for an invalid PromptAndHistoryDataJSON object', () => {
        const input = {
          clientId: 'client1',
          promptId: 'prompt1',
          promptNumber: 1,
          executionStart: 1,
          executionEnd: 2,
          images: {
            node1: {
              img1: {
                cleanName: 'clean.jpg',
                image: 'clean.jpg',
                originalFilename: 'clean.jpg',
                small: 'clean.jpg',
                thumb: 'clean.jpg',
              },
            },
          },
          workflowType: 'workflow',
        };

        expect(PromptAndImageData.promptAndHistoryDataJSONTest(input)).toEqual([
          'workflow',
        ]);
      });
    });
  });
});
