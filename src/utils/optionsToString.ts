export const optionsToString = (params) => {
  const keys = Object.keys(params);
  const values = Object.values(params);
  return keys.map((k: string, i: number) => k[0] + "_" + values[i]).sort().join('_');
}