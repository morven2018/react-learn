export default function getRandomInt(min: number, max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return min + (array[0] % (max - min + 1));
}
