import { parseExpression } from "./expressions.js";

describe("Expression Parser", () => {
  it("debug", async () => {
    expect(await parseExpression("5")).toStrictEqual({
      type: "number",
      value: 5,
    });

    expect(await parseExpression("5 == 5")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("true")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("false")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('true == true ? "foo" : "bar"')).toStrictEqual(
      {
        type: "string",
        value: "foo",
      }
    );
    expect(
      await parseExpression('true == false ? "foo" : "bar"')
    ).toStrictEqual({
      type: "string",
      value: "bar",
    });
    expect(
      await parseExpression(
        'true==true ? "foo" == "bar" ? "baz" : "qux" : "quux"'
      )
    ).toStrictEqual({
      type: "string",
      value: "qux",
    });
    expect(await parseExpression('join [1,2,3] "-"')).toStrictEqual({
      type: "string",
      value: "1-2-3",
    });
    expect(await parseExpression('length "foo"')).toStrictEqual({
      type: "number",
      value: 3,
    });
    expect(await parseExpression('length ["foo", "bar", "baz"]')).toStrictEqual(
      {
        type: "number",
        value: 3,
      }
    );
    // expect(await parseExpression("[1,2,3]")).toStrictEqual({
    //   type: "array",
    //   value: [
    //     { type: "number", value: 1 },
    //     { type: "number", value: 2 },
    //     { type: "number", value: 3 },
    //   ],
    // });
    expect(await parseExpression("reverse [1,2,3]")).toStrictEqual({
      type: "array",
      value: [
        { type: "number", value: 3 },
        { type: "number", value: 2 },
        { type: "number", value: 1 },
      ],
    });
    expect(await parseExpression("sort [3,1,2]")).toStrictEqual({
      type: "array",
      value: [
        { type: "number", value: 1 },
        { type: "number", value: 2 },
        { type: "number", value: 3 },
      ],
    });
    expect(await parseExpression('push "foo" "bar"')).toStrictEqual({
      type: "string",
      value: "foobar",
    });
    expect(await parseExpression("push [1,2,3] 4")).toStrictEqual({
      type: "array",
      value: [
        { type: "number", value: 1 },
        { type: "number", value: 2 },
        { type: "number", value: 3 },
        { type: "number", value: 4 },
      ],
    });
    expect(await parseExpression("pop [1,2,3]")).toStrictEqual({
      type: "array",
      value: [
        { type: "number", value: 1 },
        { type: "number", value: 2 },
      ],
    });
    expect(await parseExpression("shift [1,2,3]")).toStrictEqual({
      type: "array",
      value: [
        { type: "number", value: 2 },
        { type: "number", value: 3 },
      ],
    });
    expect(await parseExpression("1 + 2")).toStrictEqual({
      type: "number",
      value: 3,
    });
    expect(await parseExpression("1 - 2")).toStrictEqual({
      type: "number",
      value: -1,
    });
    expect(await parseExpression("1 * 2")).toStrictEqual({
      type: "number",
      value: 2,
    });
    expect(await parseExpression("1 / 2")).toStrictEqual({
      type: "number",
      value: 0.5,
    });
    expect(await parseExpression("1 % 2")).toStrictEqual({
      type: "number",
      value: 1,
    });
    // expect(await parseExpression('get "a" in "rain"')).toStrictEqual([1]);
    // expect(await parseExpression('get /a/g in "rain"')).toStrictEqual([1]);
    expect(await parseExpression('indexOf "t" "this is a test"')).toStrictEqual(
      {
        type: "number",
        value: 0,
      }
    );
    expect(
      await parseExpression('lastIndexOf "t" "this is a test"')
    ).toStrictEqual({
      type: "number",
      value: 13,
    });
    expect(
      await parseExpression('indexOf "a" ["this", "is", "a", "test", "a"]')
    ).toStrictEqual({
      type: "number",
      value: 2,
    });
    expect(
      await parseExpression('lastIndexOf "a" ["this", "is", "a", "test", "a"]')
    ).toStrictEqual({
      type: "number",
      value: 4,
    });
    expect(await parseExpression('sub "this is a test" 2 4')).toStrictEqual({
      type: "string",
      value: "is",
    });
    expect(await parseExpression('sub "this is a test" 5')).toStrictEqual({
      type: "string",
      value: "is a test",
    });
    expect(await parseExpression('sub "this is a test" -4')).toStrictEqual({
      type: "string",
      value: "test",
    });
    expect(
      await parseExpression('replace "this is a test" "s" "z"')
    ).toStrictEqual({
      type: "string",
      value: "thiz iz a tezt",
    });
    expect(await parseExpression('atIndex 5 "this is a test"')).toStrictEqual({
      type: "string",
      value: "i",
    });
    expect(
      await parseExpression('atIndex 2 ["this", "is", "a", "test"]')
    ).toStrictEqual({
      type: "string",
      value: "a",
    });
  });
  it("should parse numerical expressions", async () => {
    // Equality
    expect(await parseExpression("11 == 10")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 != 11")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 != 10")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 == 11")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("49.5 == .6")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("0.99 == .99")).toStrictEqual({
      type: "boolean",
      value: true,
    });

    // Greater than / less than
    expect(await parseExpression("11 > 10")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 > 11")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 > 12")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 >= 10")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 >= 11")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 >= 12")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 < 10")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 < 11")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 < 12")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 <= 10")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("11 <= 11")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("11 <= 12")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("49.5 > .6")).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression("49.5 > 49.5")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression("0.5 > .6")).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression(".5 >= 24")).toStrictEqual({
      type: "boolean",
      value: false,
    });
  });

  it("should parse string expressions", async () => {
    // Equality
    expect(await parseExpression('"foo" == "bar"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" != "bar"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" == "foo"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" != "foo"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" == "FOO"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" != "FOO"')).toStrictEqual({
      type: "boolean",
      value: true,
    });

    // Greater than / less than
    expect(await parseExpression('"foo" > "bar"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" > "foo"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" > "FOO"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" >= "bar"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" >= "foo"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" >= "FOO"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" < "bar"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" < "foo"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" < "FOO"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" <= "bar"')).toStrictEqual({
      type: "boolean",
      value: false,
    });
    expect(await parseExpression('"foo" <= "foo"')).toStrictEqual({
      type: "boolean",
      value: true,
    });
    expect(await parseExpression('"foo" <= "FOO"')).toStrictEqual({
      type: "boolean",
      value: false,
    });

    expect(await parseExpression("1 + 2")).toStrictEqual({
      type: "number",
      value: 3,
    });
  });
});
