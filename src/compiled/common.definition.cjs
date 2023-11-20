// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const types = {
  number: "number",
  string: "string",
  boolean: "boolean",
  array: "array",
  regex: "regex",
};

const typeOf = (primitive) => {
  if (typeof primitive === "number") {
    return types.number;
  } else if (typeof primitive === "string") {
    return types.string;
  } else if (typeof primitive === "boolean") {
    return types.boolean;
  } else if (Array.isArray(primitive)) {
    return types.array;
  } else if (primitive instanceof RegExp) {
    return types.regex;
  } else {
    throw new Error(`Unknown type: ${primitive}`);
  }
};

const isNegative = (number) => number < 0;

const sub = (primitive, start, end) => {
  if (isNegative(start)) {
    start = primitive.length + start;
  }
  if (isNegative(end)) {
    end = primitive.length + end;
  }
  return primitive.slice(start, end);
};

const replace = (primitive, search, replace) => {
  if (typeOf(search) === types.regex) {
    return primitive.replace(search, replace);
  } else {
    return primitive.split(search).join(replace);
  }
};

const stringToIntFloat = (str) => {
  if (str.includes(".")) {
    return parseFloat(str);
  } else {
    return parseInt(str);
  }
};

const lexer = moo.compile({
  // optional whitespace
  ws: /[ \t]+/,

  cont: /continue/,

  // primitive types
  number: {
    match: /-?(?:\d+\.?\d*|\.\d+)/,
    value: stringToIntFloat,
  },
  boolean: {
    match: /true|false/,
    value: (s) => s === "true",
  },
  // single quote, double quote, backtick strings are all valid
  stringDouble: {
    match: /"(?:\\["\\]|[^\n"\\])*"/,
    value: (s) => s.slice(1, -1),
  },
  stringSingle: {
    match: /'(?:\\['\\]|[^\n'\\])*'/,
    value: (s) => s.slice(1, -1),
  },
  regex: /\/(?:\\\/|[^\/\n])*\/[gimuy]*/,
  nullPrimitive: /null/,

  // logical operators
  eq: /==/,
  neq: /!=/,
  lte: /<=/,
  lt: /</,
  gte: />=/,
  gt: />/,
  ternIf: /\?/,
  ternElse: /:/,
  bang: /!/,
  AND: /&&/,
  OR: /\|\|/,

  // Hex color that starts with a `#` and is followed by 3 or 6 hex characters
  colorHex: {
    match: /#(?:[0-9a-fA-F]{3}){1,2}/,
    value: (s) => s.slice(1),
  },

  assignment: "=",
  hash: "#",

  parenOpen: /\(/,
  parenClose: /\)/,
  braceOpen: /\{/,
  braceClose: /\}/,

  comma: /,/,


  rgba: /rgba/,
  rgb: /rgb/,
  hex: /hex/,

  // functions look like `fn.hello` or `fn.add`
  fn: /fn\.[a-zA-Z]+/,

  // builtin methods
  length: /length/,
  reverse: /reverse/,
  sort: /sort/,
  join: /join/,
  atIndex: /atIndex/,
  indexOf: /indexOf/,
  lastIndexOf: /lastIndexOf/,
  split: /split/,
  replace: /replace/,

  sub: /sub/,
  push: /push/,
  pop: /pop/,
  shift: /shift/,

  // getters
  GetterGet: /get/,
  GetterIn: /in/,


  // punctuation
  ParenOpen: /\(/,
  ParenClose: /\)/,
  BrackOpen: /\[/,
  BrackClose: /\]/,
  comma: /,/,


  // math operators
  plus: /\+/,
  minus: /-/,
  times: /\*/,
  div: /\//,
  mod: /%/,

  argName: /[a-z]+/,

  // Property Names are everything from the start of the line until the first `=`
  // (excluding the `=`). They can contain most characters and whitespace, but not
  // periods, commas, or equals signs.
  propertyName: /[^.,=\n]+/,



});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Literal", "symbols": ["Number"], "postprocess": id},
    {"name": "Literal", "symbols": ["String"], "postprocess": id},
    {"name": "Literal", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([a]) => ({ value: a.value, type: "boolean" })},
    {"name": "Literal", "symbols": [(lexer.has("bang") ? {type: "bang"} : bang), "Literal"], "postprocess": ([, b]) => ({ value: !b, type: "boolean" })},
    {"name": "Literal", "symbols": ["Array"], "postprocess": ([a]) => ({ value: a, type: "array" })},
    {"name": "Literal", "symbols": ["RegExp"], "postprocess": ([a]) => ({ value: a, type: "regex" })},
    {"name": "Literal", "symbols": [(lexer.has("nullPrimitive") ? {type: "nullPrimitive"} : nullPrimitive)], "postprocess": () => ({ value: null, type: "null" })},
    {"name": "Literal", "symbols": ["Color"], "postprocess": id},
    {"name": "Literal", "symbols": ["Function"], "postprocess": id},
    {"name": "Indexable", "symbols": ["Number"], "postprocess": id},
    {"name": "Indexable", "symbols": ["String"], "postprocess": id},
    {"name": "Iterable", "symbols": ["String"], "postprocess": id},
    {"name": "Iterable", "symbols": ["Array"], "postprocess": id},
    {"name": "Function", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn)], "postprocess": ([a]) => ({ value: a.text.trim(), args: [], type: "function" })},
    {"name": "Function", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn), (lexer.has("ws") ? {type: "ws"} : ws), "FunctionArgs"], "postprocess": ([a,,b]) => ({ value: a.text.trim(), args: b, type: "function" })},
    {"name": "FunctionArgs", "symbols": ["Literal"], "postprocess": ([a]) => [a]},
    {"name": "FunctionArgs$ebnf$1", "symbols": []},
    {"name": "FunctionArgs$ebnf$1", "symbols": ["FunctionArgs$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FunctionArgs", "symbols": ["Literal", "FunctionArgs$ebnf$1", "FunctionArgs"], "postprocess": ([a,,b]) => [a, ...b]},
    {"name": "Color$ebnf$1", "symbols": []},
    {"name": "Color$ebnf$1", "symbols": ["Color$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Color$ebnf$2", "symbols": []},
    {"name": "Color$ebnf$2", "symbols": ["Color$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Color", "symbols": [(lexer.has("rgb") ? {type: "rgb"} : rgb), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "Color$ebnf$1", "ColorRGBArgs", "Color$ebnf$2", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => a},
    {"name": "Color$ebnf$3", "symbols": []},
    {"name": "Color$ebnf$3", "symbols": ["Color$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Color$ebnf$4", "symbols": []},
    {"name": "Color$ebnf$4", "symbols": ["Color$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Color", "symbols": [(lexer.has("rgba") ? {type: "rgba"} : rgba), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "Color$ebnf$3", "ColorRGBAArgs", "Color$ebnf$4", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => a},
    {"name": "Color", "symbols": ["ColorHex"], "postprocess": id},
    {"name": "ColorRGBArgs$ebnf$1", "symbols": []},
    {"name": "ColorRGBArgs$ebnf$1", "symbols": ["ColorRGBArgs$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBArgs$ebnf$2", "symbols": []},
    {"name": "ColorRGBArgs$ebnf$2", "symbols": ["ColorRGBArgs$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBArgs$ebnf$3", "symbols": []},
    {"name": "ColorRGBArgs$ebnf$3", "symbols": ["ColorRGBArgs$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBArgs$ebnf$4", "symbols": []},
    {"name": "ColorRGBArgs$ebnf$4", "symbols": ["ColorRGBArgs$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBArgs", "symbols": [(lexer.has("number") ? {type: "number"} : number), "ColorRGBArgs$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma), "ColorRGBArgs$ebnf$2", (lexer.has("number") ? {type: "number"} : number), "ColorRGBArgs$ebnf$3", (lexer.has("comma") ? {type: "comma"} : comma), "ColorRGBArgs$ebnf$4", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value], type: "colorRGB" })},
    {"name": "ColorRGBAArgs$ebnf$1", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$1", "symbols": ["ColorRGBAArgs$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs$ebnf$2", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$2", "symbols": ["ColorRGBAArgs$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs$ebnf$3", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$3", "symbols": ["ColorRGBAArgs$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs$ebnf$4", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$4", "symbols": ["ColorRGBAArgs$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs$ebnf$5", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$5", "symbols": ["ColorRGBAArgs$ebnf$5", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs$ebnf$6", "symbols": []},
    {"name": "ColorRGBAArgs$ebnf$6", "symbols": ["ColorRGBAArgs$ebnf$6", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorRGBAArgs", "symbols": [(lexer.has("number") ? {type: "number"} : number), "ColorRGBAArgs$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma), "ColorRGBAArgs$ebnf$2", (lexer.has("number") ? {type: "number"} : number), "ColorRGBAArgs$ebnf$3", (lexer.has("comma") ? {type: "comma"} : comma), "ColorRGBAArgs$ebnf$4", (lexer.has("number") ? {type: "number"} : number), "ColorRGBAArgs$ebnf$5", (lexer.has("comma") ? {type: "comma"} : comma), "ColorRGBAArgs$ebnf$6", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value, d.value], type: "colorRGBA" })},
    {"name": "ColorHex$ebnf$1", "symbols": []},
    {"name": "ColorHex$ebnf$1", "symbols": ["ColorHex$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorHex$ebnf$2", "symbols": []},
    {"name": "ColorHex$ebnf$2", "symbols": ["ColorHex$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ColorHex", "symbols": [(lexer.has("hex") ? {type: "hex"} : hex), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "ColorHex$ebnf$1", (lexer.has("colorHex") ? {type: "colorHex"} : colorHex), "ColorHex$ebnf$2", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: a.value, type: "colorHex" })},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a]) => ({ value: a.value, type: "number" })},
    {"name": "String", "symbols": [(lexer.has("stringDouble") ? {type: "stringDouble"} : stringDouble)], "postprocess": ([a]) => ({ value: a.value, type: "string" })},
    {"name": "String", "symbols": [(lexer.has("stringSingle") ? {type: "stringSingle"} : stringSingle)], "postprocess": ([a]) => ({ value: a.value, type: "string" })},
    {"name": "Array$ebnf$1", "symbols": []},
    {"name": "Array$ebnf$1", "symbols": ["Array$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Array", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), "Array$ebnf$1", (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": () => ({ value: [], type: "array" })},
    {"name": "Array$ebnf$2", "symbols": []},
    {"name": "Array$ebnf$2", "symbols": ["Array$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Array$ebnf$3", "symbols": []},
    {"name": "Array$ebnf$3", "symbols": ["Array$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Array", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), "Array$ebnf$2", "ArrayContents", "Array$ebnf$3", (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": ([,,a,,]) => ({ value: a, type: "array" })},
    {"name": "ArrayContents", "symbols": ["Literal"], "postprocess": ([a]) => [a]},
    {"name": "ArrayContents$ebnf$1", "symbols": []},
    {"name": "ArrayContents$ebnf$1", "symbols": ["ArrayContents$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ArrayContents$ebnf$2", "symbols": []},
    {"name": "ArrayContents$ebnf$2", "symbols": ["ArrayContents$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ArrayContents", "symbols": ["Literal", "ArrayContents$ebnf$1", (lexer.has("comma") ? {type: "comma"} : comma), "ArrayContents$ebnf$2", "ArrayContents"], "postprocess": ([a, , , , b]) => [a, ...b]},
    {"name": "RegExp", "symbols": [(lexer.has("regex") ? {type: "regex"} : regex)], "postprocess":  ([a]) => {
          // get modifiers from the end of the regex
          const modifiers = a.value.slice(a.value.lastIndexOf("/") + 1);
          // remove the leading and trailing slashes
          const regex = a.value.slice(1, a.value.lastIndexOf("/"));
          return new RegExp(regex, modifiers);
        }}
]
  , ParserStart: "Literal"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
