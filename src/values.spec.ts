// @ts-ignore
import { parseValues } from "./values";

describe("Value Parser", () => {
  it("debug", () => {
    expect(
      parseValues('urls[]=url("https://pastebin.com/raw/Na2Hmfm8")')
    ).toStrictEqual({
      slug: "urls[]",
      type: "url",
      value: "https://pastebin.com/raw/Na2Hmfm8",
    });

    expect(parseValues('hello="world"')).toStrictEqual({
      slug: "hello",
      type: "string",
      value: "world",
    });
    expect(parseValues("What the frick is this=true")).toStrictEqual({
      type: "boolean",
      slug: "What the frick is this",
      value: true,
    });
    expect(parseValues("test=2")).toStrictEqual({
      type: "number",
      slug: "test",
      value: 2,
    });
    expect(parseValues("test[]=2")).toStrictEqual({
      type: "number",
      slug: "test[]",
      value: 2,
    });
    expect(parseValues("test ='world'")).toStrictEqual({
      type: "string",
      slug: "test",
      value: "world",
    });
    expect(parseValues("test=rgb(255,0,0)")).toStrictEqual({
      type: "colorRGB",
      slug: "test",
      value: [255, 0, 0],
    });
    expect(parseValues("test=rgba(255,0,0,1)")).toStrictEqual({
      type: "colorRGBA",
      slug: "test",
      value: [255, 0, 0, 1],
    });
    expect(parseValues("test=hex(#f0cecf)")).toStrictEqual({
      type: "colorHex",
      slug: "test",
      value: "f0cecf",
    });
    expect(parseValues('test=url("https://elk.wtf")')).toStrictEqual({
      type: "url",
      slug: "test",
      value: "https://elk.wtf",
    });
    expect(parseValues('test=path("./config.daikon")')).toStrictEqual({
      type: "path",
      slug: "test",
      value: "./config.daikon",
    });
    expect(parseValues("test=string(2)")).toStrictEqual({
      type: "string",
      slug: "test",
      value: "2",
    });
    expect(parseValues("test=boolean(1)")).toStrictEqual({
      type: "boolean",
      slug: "test",
      value: true,
    });
    expect(parseValues("test=boolean(0)")).toStrictEqual({
      type: "boolean",
      slug: "test",
      value: false,
    });
    expect(parseValues('test=number("2")')).toStrictEqual({
      type: "number",
      slug: "test",
      value: 2,
    });
    expect(parseValues("test=fn.add 1 2")).toStrictEqual({
      type: "function",
      slug: "test",
      value: "fn.add",
      args: [
        {
          type: "number",
          value: 1,
        },
        {
          type: "number",
          value: 2,
        },
      ],
    });
    expect(parseValues("test=fn.hello")).toStrictEqual({
      type: "function",
      slug: "test",
      value: "fn.hello",
      args: [],
    });

    expect(parseValues("test=fn.hello")).toStrictEqual({
      type: "function",
      slug: "test",
      value: "fn.hello",
      args: [],
    });

    expect(parseValues("test=!1 + 1")).toStrictEqual({
      type: "number",
      slug: "test",
      value: 2,
    });

    expect(parseValues("test=!1 < 3 ? true : false")).toStrictEqual({
      type: "boolean",
      slug: "test",
      value: true,
    });
  });
});
