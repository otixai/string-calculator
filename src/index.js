'use strict';

const MAX_NUMBER = 1000;

let callCount = 0;

const add = (numbers) => {
    callCount += 1;

    if (numbers === '') {
        return 0;
    }

    const { processedNumbers, delimiters } = parseAndProcessNumbers(numbers);
    const numbersArray = splitByDelimiters(processedNumbers, delimiters);
    const { sum, negatives } = processNumbers(numbersArray);

    if (negatives.length > 0) {
        throw new Error(`negative numbers not allowed: ${negatives.join(',')}`);
    }

    return sum;
};

const parseAndProcessNumbers = (numbers) => {
    const defaultDelimiters = [',', '\n'];

    if (!numbers.startsWith('//')) {
        return { processedNumbers: numbers, delimiters: defaultDelimiters };
    }

    const { delimiterSection, numStrings } = extractDelimiterSection(numbers);
    const customDelimiters = parseDelimiters(delimiterSection);

    return {
        processedNumbers: numStrings,
        delimiters: [...defaultDelimiters, ...customDelimiters]
    };
};

const extractDelimiterSection = (numbers) => {
    const delimiterEndIndex = numbers.indexOf('\n');

    if (delimiterEndIndex === -1) {
        throw new Error('Invalid delimiter format');
    }

    return {
        delimiterSection: numbers.substring(2, delimiterEndIndex),
        numStrings: numbers.substring(delimiterEndIndex + 1)
    };
};

const parseDelimiters = (delimiterSection) => {
    const bracketDelimiters = delimiterSection.split('][').filter(s => s.length > 0);
    const singleCharDelimiters = delimiterSection
        .replace(/\[[^\]]+\]/g, '')
        .split('')
        .filter(c => c !== '');

    return [
        ...bracketDelimiters.map(d => d.replace(/^\[|\]$/g, '')),
        ...singleCharDelimiters
    ];
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const splitByDelimiters = (numStrings, delimiters) => {
    const regex = new RegExp(delimiters.map(escapeRegExp).join('|'), 'g');
    return numStrings.split(regex).filter(s => s.trim() !== '');
};

const processNumbers = (numbersArray) => {
    const parsed = numbersArray.map(n => parseInt(n, 10)).filter(n => !isNaN(n));

    const negatives = parsed.filter(n => n < 0);
    const valid = parsed.filter(n => n >= 0 && n <= MAX_NUMBER);
    const sum = valid.reduce((acc, n) => acc + n, 0);

    return { sum, negatives };
};

const getCalledCount = () => callCount;

const resetCallCount = () => {
    callCount = 0;
};

module.exports = {
    add,
    getCalledCount,
    resetCallCount
};