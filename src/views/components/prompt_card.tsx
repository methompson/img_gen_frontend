import { type PromptAndImageData } from '@/models/history_data';

interface PromptCardProps {
  prompt: PromptAndImageData;
}

export function PromptCard(props: PromptCardProps) {
  const toggleImageAddition = () => {};
  const { prompt } = props;
  const images = Object.entries(prompt.images).map(([key, value]) => {
    const imageLinks = Object.values(value).map((v) => {
      const thumbUrl = `http://localhost:3000/image/${v.thumb}`;
      const url = `http://localhost:3000/image/${v.image}`;

      console.log({
        imageInfo: v,
      });

      const imgKey = `${prompt.promptNumber}-${v.image}`;
      return (
        <div key={imgKey}>
          <span onClick={toggleImageAddition}>
            <img src={thumbUrl} />
          </span>
          {/* <a href={url} target="_blank">
            <img src={thumbUrl} />
          </a> */}
        </div>
      );
    });

    return (
      <div key={key}>
        <h3>{key}</h3>
        <div class="flex">{imageLinks}</div>
      </div>
    );
  });

  return (
    <div class="outline m-4 p-2" key={prompt.promptId}>
      <h2>{prompt.promptNumber}</h2>
      <p>Positive: {prompt.positiveClip}</p>
      <p>Negative: {prompt.negativeClip}</p>
      <div>{images}</div>
    </div>
  );
}
