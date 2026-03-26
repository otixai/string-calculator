# String Calculator

## Project Structure
- src/index.js - Simple entry point to the calculator, exposes all the functions in the summary bellow
- test/index.test.js - 


## Summary of All Behaviors

| # | Behavior | Key Test Case |
|---|----------|---------------|
| 1 | Empty string → 0 | `"" → 0` |
| 2 | Single / two numbers | `"1,2" → 3` |
| 3 | Unknown amount of numbers | `"1,2,3,4" → 10` |
| 4 | Newline delimiter | `"1\n2,3" → 6` |
| 5 | Custom delimiter | `"//;\n1;2" → 3` |
| 6 | Negative → throws | `"-1,2" → throws` |
| 7 | Multiple negatives in message | `"-1,-2,3" → throws` |
| 8 | `getCalledCount()` tracks calls | 3 calls → `3` |
| 9 | Ignore > 1000 | `"2,1001" → 2` |
| 10 | Arbitrary-length delimiter | `"//[***]\n1***2***3" → 6` |
| 11 | Multiple delimiters | `"//[*][%]\n1*2%3" → 6` |
| 12 | Multiple multi-char delimiters | `"//[**][%%]\n1**2%%3" → 6` |


## Constraints
- All changes must be verified by running `npm test`. 

## Tools
You have: read, write, edit, bash. Use them directly. Do not explain code in prose.