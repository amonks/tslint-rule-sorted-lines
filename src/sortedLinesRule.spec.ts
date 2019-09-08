import { getFixedResult, helper } from "./lintRunner";
import { Rule, BEGIN, END } from "./sortedLinesRule";

const rule = "sorted-lines";

const failureExample = `
${BEGIN}
c
b
a
${END}
`;

const successExample = `
${BEGIN}
a
b
c
${END}
`;

describe("sorted lines rule examples", () => {
  it(`testing passing example`, () => {
    const src = successExample;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(0);
  });

  it(`testing failing example`, () => {
    const src = failureExample;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
  });

  it(`testing passing example with two blocks`, () => {
    const src = successExample + "\n" + successExample;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(0);
  });

  it(`testing failing example with two blocks`, () => {
    const src = successExample + "\n" + failureExample;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
  });

  it(`testing failing example with two failing blocks`, () => {
    const src = failureExample + "\n" + failureExample;
    const result = helper({ src, rule });
    expect(result.errorCount).toBe(2);
  });

  it(`testing position example`, () => {
    const src = failureExample;
    const failure = helper({ src, rule }).failures[0];

    expect(failure.getStartPosition().getPosition()).toEqual(src.indexOf("c"));
    expect(failure.getEndPosition().getPosition()).toEqual(src.indexOf(END));
    expect(failure.getFailure()).toBe(Rule.FAILURE_STRING);
  });

  it(`testing failure message example`, () => {
    const src = failureExample;
    const failure = helper({ src, rule }).failures[0];

    expect(failure.getFailure()).toBe(Rule.FAILURE_STRING);
  });

  it("testing fixer example", () => {
    const src = failureExample;
    const output = successExample;

    const result = helper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(output);
  });
});
