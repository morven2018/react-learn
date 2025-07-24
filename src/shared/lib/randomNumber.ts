export default function getRandomInt(min: number, max: number): number {
  if (min >= max) throw new Error('Invalid range: min must be less than max');
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return min + (array[0] % (max - min + 1));
}
