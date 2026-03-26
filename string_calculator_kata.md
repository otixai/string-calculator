# String Calculator Kata

> Source: [osherove.com/kata](http://osherove.com/kata)

## Rules

- **Work incrementally.** Complete one step before reading the next.
- **Test first.** Write a failing test before writing any production code.
- **Only test valid inputs.** Do not write tests for invalid inputs unless a step explicitly requires it.
- **Refactor after every green test.** Each passing test is followed by a refactor pass before moving on.
- **Solve as simply as possible.** Resist the urge to anticipate future steps; the simplest solution forces better tests.

---

## Step 1 — Basic Addition (0, 1, or 2 numbers)

Create a module that exports an `add` function:

```js
// stringCalculator.js
export function add(numbers) { }
```

The function takes a string of comma-separated numbers and returns their sum. An empty string returns `0`.

| Input   | Expected |
|---------|----------|
| `""`    | `0`      |
| `"1"`   | `1`      |
| `"1,2"` | `3`      |

Start with the empty-string case, then one number, then two.

---

## Step 2 — Unknown Amount of Numbers

Allow `add` to handle any quantity of numbers, not just 0–2.

| Input       | Expected |
|-------------|----------|
| `"1,2,3"`   | `6`      |
| `"1,2,3,4"` | `10`     |

---

## Step 3 — Newline as Delimiter

Allow newlines (`\n`) between numbers in addition to commas.

| Input        | Expected |
|--------------|----------|
| `"1\n2,3"`   | `6`      |

Note: `"1,\n"` is **invalid** input — do not test for it.

---

## Step 4 — Custom Single-Character Delimiter

Support a custom delimiter declared on the first line of the input with the format:

```
//[delimiter]\n[numbers]
```

| Input         | Expected |
|---------------|----------|
| `"//;\n1;2"`  | `3`      |

All previous delimiter scenarios (commas, newlines) must still pass.

---

## Step 5 — Negative Number Error (single)

Calling `add` with a negative number must throw an error with the message:

```
negatives not allowed: <negative_number>
```

| Input    | Expected                                  |
|----------|-------------------------------------------|
| `"-1,2"` | Throws: `negatives not allowed: -1`       |

---

## Step 6 — Negative Number Error (multiple)

If multiple negatives are present, include **all** of them in the error message.

| Input        | Expected                                      |
|--------------|-----------------------------------------------|
| `"-1,-2,3"`  | Throws: `negatives not allowed: -1, -2`       |

---

## Step 7 — Call Count

Refactor into a class (or a factory function that returns an object) so you can track state:

```js
// Class approach
class StringCalculator {
  add(numbers) { }
  getCalledCount() { }
}

// — or factory approach —
function createStringCalculator() {
  return { add, getCalledCount };
}
```

`getCalledCount` returns how many times `add` has been invoked on that instance. Start with a failing test.

---

## Step 8 — Ignore Numbers Greater Than 1000

Numbers greater than 1000 are excluded from the sum. `1000` itself is still valid.

| Input        | Expected |
|--------------|----------|
| `"2,1001"`   | `2`      |
| `"2,1000"`   | `1002`   |

---

## Step 9 — Arbitrary-Length Delimiter

Delimiters can be longer than one character using the format:

```
//[delimiter]\n[numbers]
```

| Input                    | Expected |
|--------------------------|----------|
| `"//[***]\n1***2***3"`   | `6`      |

---

## Step 10 — Multiple Delimiters

Allow multiple delimiters declared in brackets:

```
//[delim1][delim2]\n[numbers]
```

| Input                  | Expected |
|------------------------|----------|
| `"//[*][%]\n1*2%3"`    | `6`      |

---

## Step 11 — Multiple Multi-Character Delimiters

Combine steps 9 and 10: support multiple delimiters each of arbitrary length.

| Input                      | Expected |
|----------------------------|----------|
| `"//[**][%%]\n1**2%%3"`    | `6`      |

---

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
