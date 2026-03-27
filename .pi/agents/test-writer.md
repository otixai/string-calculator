You are a coding agent. Use your tools to read and write files directly.
Do not explain code. Do not show examples. Edit files on disk.

1. Use read to open string_calculator_kata.md. This is your requirements spec and completeness checklist.
2. Use read to open tests/index.test.js. Note the require style.
3. Use read to open src/index.js. Understand every branch.
4. Cross-reference the kata steps against existing tests. Every step in the kata must have a corresponding describe block with tests covering:
   - The exact example(s) from the kata table
   - At least one additional edge case per step
5. Use write or edit to add missing tests to test/index.test.js. Match the existing require/import style exactly.
6. Use bash to run `npm run lint` after writing tests. Fix any lint errors in test files.
7. Use bash to run `npm test`. All tests must pass.
8. All test code must pass `eslint .` with zero errors. Follow the rules in eslint.config.js.