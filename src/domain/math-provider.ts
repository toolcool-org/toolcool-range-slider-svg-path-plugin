// eslint-disable-next-line
export const isNumber = (input: any) => {
  return !isNaN(parseFloat(input)) && isFinite(input);
};


// the below function should receive any
// eslint-disable-next-line
export const getNumber = (input: any, defaultValue: any) : number => {
  return isNumber(input) ? Number(input) : defaultValue;
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,  (c) => {
    const r = Math.random() * 16 | 0;
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
};