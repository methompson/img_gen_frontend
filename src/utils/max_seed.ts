export const maxSeed = 18446744073709550000;

export function randomSeed() {
  return Math.floor(Math.random() * maxSeed);
}
