// @ts-ignore
import { parseFunction } from "./functions";

describe("Functions Syntax", () => {
  it("Can define functions with no args", () => {
    expect(parseFunction("[fn.test]")).toStrictEqual({
      slug: "fn.test",
      args: {},
    });
  });

  it("Can define functions with args", () => {
    expect(parseFunction("[fn.test(n, x)]")).toStrictEqual({
      slug: "fn.test",
      args: { n: { required: true }, x: { required: true } },
    });
  });

  it("Can define functions with optional args", () => {
    expect(parseFunction("[fn.test(n, x=2, v=1)]")).toStrictEqual({
      slug: "fn.test",
      args: {
        n: { required: true },
        x: { required: false, default: { type: "number", value: 2 } },
        v: { required: false, default: { type: "number", value: 1 } },
      },
    });
  });
});
