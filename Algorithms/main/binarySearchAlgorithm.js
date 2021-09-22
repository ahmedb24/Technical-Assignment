/**
 * File to find a numebr among a list of numbers using binary search recursively
 * 
 * 
 */

const helpers = require('../Utilities/helpers')

const container = {};

container.randNumArrayGenerator = () => {
  var arr = [];
  let prev = 0;
  
  //Return an array of size of 10 with a random first number between 1 and 100 that increases by 2 in ascending order
  while (arr.length<10) {
    if (arr.length === 0) {
      //First element in array, do something
      let randomNumber = helpers.randomNumberGenerator(100);
      arr.push(randomNumber);        
      prev = randomNumber;
    } else {
      prev = helpers.incrementANumberByTwo(prev);
      arr.push(prev);
    }
  }

  //Sort the array
  arr.sort((a,b) => a-b)
  console.log(arr);
  return arr;
};


container.findTargetRecursively= (arr, target) => {
  //Base case
  if (arr.length < 1 || typeof(target) !== 'number') {
    return 0
  }

  //Base case
  if (arr.length === 1 && arr[0] !== target) {
    return 0;
  } 

  let midValueIndex = Math.floor(arr.length/2);
  let midValue = arr[midValueIndex];
  let leftArr = arr.slice(0, midValueIndex);
  let rightArr = arr.slice(midValueIndex);
  let result = 0;

  if (midValue === target) {
    return midValue;
  }
  
  result = target < midValue ? container.findTargetRecursively(leftArr, target) : container.findTargetRecursively(rightArr, target);
  return result;
}

module.exports = container;