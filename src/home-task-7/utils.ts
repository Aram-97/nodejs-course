export const isNil = (value: unknown) => {
  return value == null;
};

export const runIfNotNil = (value: unknown, callback: () => void) => {
  if (typeof callback === "function" && !isNil(value)) {
    callback();
  }
};
