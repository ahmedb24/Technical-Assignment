/**
 * Entry file for all Algorithms
 * 
 */

const binarySearchAlgorithmContainer  = require('./main/binarySearchAlgorithm');
const rockPaperScissors = require('./main/rockPaperScissors');


let randNumArray = binarySearchAlgorithmContainer.randNumArrayGenerator();
let userInput = 52;
console.log(binarySearchAlgorithmContainer.findTargetRecursively(randNumArray, userInput));
