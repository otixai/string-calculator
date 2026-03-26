let callCount = 0;

function add(numbers) {
    callCount++;
    
    if (numbers === "") {
        return 0;
    }
    
    let numStrings = numbers;
    let customDelimiters = [",", "\n"];
    
    // Check for custom delimiter syntax
    if (numbers.startsWith("//")) {
        const delimiterEndIndex = numbers.indexOf("\n");
        if (delimiterEndIndex === -1) {
            throw new Error("Invalid delimiter format");
        }
        const delimiterSection = numbers.substring(2, delimiterEndIndex);
        customDelimiters = [];
        
        // Handle cases like: ; , %,
        const splitDelimiters = delimiterSection.split("][");
        
        for (let delimiter of splitDelimiters) {
            if (delimiter.startsWith("[") && delimiter.endsWith("]")) {
                // Multi-char delimiter like [***]
                const inner = delimiter.substring(1, delimiter.length - 1);
                customDelimiters.push(inner);
            } else if (delimiter.startsWith("[") && !delimiter.endsWith("]")) {
                // Special case: could be a single char like [*] or incomplete
                const inner = delimiter.substring(1);
                customDelimiters.push(inner);
            } else if (!delimiter.startsWith("[") && delimiter.endsWith("]")) {
                // Special case: could be malformed
                const inner = delimiter.substring(0, delimiter.length - 1);
                customDelimiters.push(inner);
            } else {
                // Single char delimiters like ;,% or *?
                for (let char of delimiter) {
                    customDelimiters.push(char);
                }
            }
        }
        
        numStrings = numbers.substring(delimiterEndIndex + 1);
    }
    
    // Replace all custom delimiters with comma for parsing
    let processedNumbers = numStrings;
    for (let delimiter of customDelimiters) {
        const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedDelimiter, 'g');
        processedNumbers = processedNumbers.replace(regex, ",");
    }
    
    // Split and convert to numbers
    const splits = processedNumbers.split(",");
    const arr = [];
    let negatives = [];
    
    for (let i = 0; i < splits.length; i++) {
        const num = parseInt(splits[i]);
        if (isNaN(num)) {
            continue;
        }
        if (num < 0) {
            negatives.push(num);
        }
        if (num <= 1000) {
            arr.push(num);
        }
    }
    
    if (negatives.length > 0) {
        throw new Error(`negative numbers not allowed: ${negatives.join(",")}`);
    }
    
    return arr.reduce((sum, num) => sum + num, 0);
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