type StringStringDict = { [key: string]: string };

export const reverseMapping = (o: StringStringDict): StringStringDict =>
  Object.keys(o).reduce(
    (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || ([] as string[])).concat(k) }),
    {} as StringStringDict,
  );
