//Comparing two Arrays
export const isEqualHeader = (arr1, arr2) => {
  let areEqual = true;
  for (const element of arr1) {
    if (!arr2.includes(element)) {
      areEqual = false;
      break;
    }
  }
  for (const element of arr2) {
    if (!arr1.includes(element)) {
      areEqual = false;
      break;
    }
  }
  return areEqual;
};
