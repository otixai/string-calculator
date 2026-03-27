const { add, getCalledCount, resetCallCount } = import('../src/index.js');

describe('String Calculator', () => {
    describe('1. Empty string → 0', () => {
        it('empty string returns 0', () => {
            expect(add("")).toBe(0);
        });

        it('non-empty string returns number sum', () => {
            expect(add("1")).toBe(1);
        });

        it('two numbers returns sum', () => {
            expect(add("1,2")).toBe(3);
        });
    });

    describe('3. Unknown amount of numbers', () => {
        it('adds three numbers', () => {
            expect(add("1,2,3")).toBe(6);
        });

        it('adds four numbers', () => {
            expect(add("1,2,3,4")).toBe(10);
        });

        it('adds five numbers', () => {
            expect(add("1,2,3,4,5")).toBe(15);
        });
    });

    describe('4. Newline delimiter', () => {
        it('uses newline as delimiter', () => {
            expect(add("1\n2,3")).toBe(6);
        });

        it('uses mix of delimiters', () => {
            expect(add("1\n2\n3")).toBe(6);
        });
    });

    describe('5. Custom delimiter', () => {
        it('uses semicolon as delimiter', () => {
            expect(add("//;\n1;2")).toBe(3);
        });

        it('uses comma as default delimiter', () => {
            expect(add("1,2")).toBe(3);
        });
    });

    describe('6. Negative → throws', () => {
        it('throws on single negative', () => {
            expect(() => add("-1,2")).toThrow(Error);
        });

        it('throws on one negative', () => {
            expect(() => add("-1,2,3")).toThrow(Error);
        });

        it('includes negative in error message', () => {
            try {
                add("-1,2,3");
            } catch (e) {
                expect(e.message.includes("-1")).toBe(true);
            }
        });
    });

    describe('7. Multiple negatives in message - throws', () => {
        it('throws on one negative', () => {
            expect(() => add("-1,2")).toThrow(Error);
        });

        it('throws on two negatives', () => {
            expect(() => add("-1,-2,3")).toThrow(Error);
        });

        it('includes all negatives in error message', () => {
            try {
                add("-1,-2,3");
            } catch (e) {
                expect(e.message.includes("-1,-2")).toBe(true);
            }
        });
    });

    describe('8. getCalledCount() tracks calls', () => {
        beforeEach(() => {
            resetCallCount();
        });

        it('tracks no calls initially', () => {
            expect(getCalledCount()).toBe(0);
        });

        it('tracks first call', () => {
            add("1,2");
            expect(getCalledCount()).toBe(1);
        });

        it('tracks third call', () => {
            add("1,2");
            add("3,4,5");
            add("6,7");
            expect(getCalledCount()).toBe(3);
        });

        it('resets after reset call', () => {
            add("1");
            getCalledCount();  // Should not increment count
            add("2");
            expect(getCalledCount()).toBe(2);
        });
    });

    describe('9. Ignore > 1000', () => {
        it('ignores single value > 1000', () => {
            expect(add("2,1001")).toBe(2);
        });

        it('ignores two values > 1000', () => {
            expect(add("1000,1001")).toBe(1000);
        });

        it('ignores multiple > 1000', () => {
            expect(add("1000,2001,3021")).toBe(1000);
        });

        it('includes value = 1000', () => {
            expect(add("1000,1001")).toBe(1000);
        });
    });

    describe('10. Arbitrary-length delimiter', () => {
        it('uses three asterisks delimiter', () => {
            expect(add("//[***]\n1***2***3")).toBe(6);
        });

        it('uses four plus signs delimiter', () => {
            expect(add("//[++++]\n1++++2++++3")).toBe(6);
        });

        it('uses multi-char delimiter with single numbers', () => {
            expect(add("//[***]\n10***20***30")).toBe(60);
        });
    });

    describe('11. Multiple delimiters', () => {
        it('uses two single-char delimiters', () => {
            expect(add("//[*][%]\n1*2%3")).toBe(6);
        });

        it('uses four single-char delimiters', () => {
            expect(add("//[*][,][;][-]\n1*2,3;4-5")).toBe(15);
        });

        it('prioritizes custom delimiters', () => {
            expect(add("//[*][,]\n1*2,3")).toBe(6);
        });
    });

    describe('12. Multiple multi-char delimiters', () => {
        it('uses two multi-char delimiters', () => {
            expect(add("//[**][%%]\n1**2%%3")).toBe(6);
        });

        it('uses three multi-char delimiters', () => {
            expect(add("//[**][%%][@@]\n1**2%%3@@4")).toBe(10);
        });
    });
});