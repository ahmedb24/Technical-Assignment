/**
 * File for all Utility functions
 * 
 */

const container = {}

container.randomNumberGenerator = (maxValue=100) => {
    return Math.floor(Math.random() * maxValue) + 1;
  }
  
container.incrementANumberByTwo = (prev) => {
    prev = prev+2;
    return prev;
}

module.exports = container;