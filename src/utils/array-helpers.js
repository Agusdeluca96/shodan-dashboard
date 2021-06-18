export const sortObjectsBy = (array, sortKey, order = "asc") => {
  if (order === "asc") {
    array.sort((a, b) => a - b);
  } else {
    array.sort((a, b) => {
      if (a[sortKey] > b[sortKey]) {
        return -1;
      }
      if (a[sortKey] < b[sortKey]) {
        return 1;
      }
      return 0;
    });
  }
  return array;
};
