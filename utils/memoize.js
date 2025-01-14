const memoizedContent = {};

export const memoize = (cellId, atomFactory) => {
  if (memoizedContent[cellId]) {
    return memoizedContent[cellId];
  }
  memoizedContent[cellId] = atomFactory();
  return memoizedContent[cellId];
};
