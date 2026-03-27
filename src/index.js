'use strict';

const MAX_NUMBER = 1000;

let callCount = 0;

function add(numbers) {
    callCount = callCount + 1;
    
    if (numbers === "") {
        return 0;
    }
    
    const { processedNumbers } = parseAndProcessNumbers(numbers);
    
    const result = processValidNumbers(processedNumbers);
    
    if (result.negatives.length > 0) {
        throw new Error(`negative numbers not allowed: ${result.negatives.join(",")}`);
    }
    
    return result.sum;
}

function parseAndProcessNumbers(numbers) {
    let numStrings = numbers;
    const customDelimiters = [",", "\n"];
    
    if (numbers.startsWith("//")) {
        const { numStrings: newNumStrings, delimiters } = parseCustomDelimiters(numbers);
        numStrings = newNumStrings;
        delimiters.forEach(d => customDelimiters.push(d));
    }
    
    const processedNumbers = replaceDelimiters(numStrings, customDelimiters);
    return { processedNumbers, customDelimiters };
}

function parseCustomDelimiters(numbers) {
    const delimiterEndIndex = numbers.indexOf("\n");
    if (delimiterEndIndex === -1) {
        throw new Error("Invalid delimiter format");
    }
    
    const delimiterSection = numbers.substring(2, delimiterEndIndex);
    const delimiters = [...parseDelimiters(delimiterSection)];
    
    return { delimiterEndIndex, numStrings: numbers.substring(delimiterEndIndex + 1), delimiters };
}

function parseDelimiters(delimiterSection) {
    const delimiters = [];
    const splitDelimiters = delimiterSection.split("][");
    
    splitDelimiters.forEach(delimiter => {
        if (delimiter.startsWith("[") && delimiter.endsWith("]")) {
            if (delimiter.length === 2) {
                delimiters.push(delimiter[1]);
            } else {
                delimiters.push(delimiter.substring(1, delimiter.length - 1));
            }
        } else {
            delimiter.split("").forEach(char => delimiters.push(char));
        }
    });
    
    return delimiters;
}

function replaceDelimiters(numStrings, customDelimiters) {
    return customDelimiters.reduce((text, delimiter) => {
        const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(escapedDelimiter, 'g'), ",");
    }, numStrings);
}

function processValidNumbers(numbers) {
    const splits = numbers.split(",");
    let sum = 0;
    const negatives = [];
    
    splits.forEach(numStr => {
        const num = parseInt(numStr, 10);
        
        if (isNaN(num)) return;
        
        if (num < 0) {
            negatives.push(num);
        } else if (num <= MAX_NUMBER) {
            sum += num;
        }
    });
    
    return { sum, negatives };
}

function getCalledCount() {
    return callCount;
}

function resetCallCount() {
    callCount = 0;
}

module.exports = {
    add,
    getCalledCount,
    resetCallCount
};