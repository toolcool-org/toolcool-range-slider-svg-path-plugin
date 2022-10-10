// eslint-disable-next-line
export const isNumber = (input: any) => {
  return !isNaN(parseFloat(input)) && isFinite(input);
};


// the below function should receive any
// eslint-disable-next-line
export const getNumber = (input: any, defaultValue: any) : number => {
  return isNumber(input) ? Number(input) : defaultValue;
};