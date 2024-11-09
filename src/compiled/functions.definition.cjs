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
  regex: /\/(?!\/)(?:\\\/|[^\/\n])*\/[gimuy]*/,
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


  rgba: /\brgba(?=\()/,
  rgb: /\brgb(?=\()/,
  hex: /\bhex(?=\()/,
  url: /\burl(?=\()/,
  path: /\bpath(?=\()/,

  castString: /\bstring(?=\()/,
  castNumber: /\bnumber(?=\()/,
  castBoolean: /\bboolean(?=\()/,
  castArray: /\barray(?=\()/,


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

  

  // Property Names are everything from the start of the line until the first `=`
  // (excluding the `=`). They can contain most characters and whitespace, but not
  // periods, commas, or equals signs.
  propertyName: /^[^=]+?(?=\s*=[^=])/,

  argName: /[a-z]+/,

});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Literal", "symbols": ["Number"], "postprocess": id},
    {"name": "Literal", "symbols": ["String"], "postprocess": id},
    {"name": "Literal", "symbols": ["Boolean"], "postprocess": id},
    {"name": "Literal", "symbols": [(lexer.has("bang") ? {type: "bang"} : bang), "Literal"], "postprocess": ([, b]) => ({ value: !b.value, type: "boolean" })},
    {"name": "Literal", "symbols": ["Array"], "postprocess": ([a]) => ({ value: a, type: "array" })},
    {"name": "Literal", "symbols": ["RegExp"], "postprocess": id},
    {"name": "Literal", "symbols": [(lexer.has("nullPrimitive") ? {type: "nullPrimitive"} : nullPrimitive)], "postprocess": () => ({ value: null, type: "null" })},
    {"name": "Literal", "symbols": ["Color"], "postprocess": id},
    {"name": "Literal", "symbols": ["Function"], "postprocess": id},
    {"name": "Literal", "symbols": ["URL"], "postprocess": id},
    {"name": "Literal", "symbols": ["Path"], "postprocess": id},
    {"name": "Indexable", "symbols": ["Number"], "postprocess": id},
    {"name": "Indexable", "symbols": ["String"], "postprocess": id},
    {"name": "Iterable", "symbols": ["String"], "postprocess": id},
    {"name": "Iterable", "symbols": ["Array"], "postprocess": id},
    {"name": "Function", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn)], "postprocess": ([a]) => ({ value: a.text.trim(), args: [], type: "function" })},
    {"name": "Function", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn), (lexer.has("ws") ? {type: "ws"} : ws), "FunctionArgs"], "postprocess": ([a,,b]) => ({ value: a.text.trim(), args: b, type: "function" })},
    {"name": "FunctionArgs", "symbols": ["Literal"], "postprocess": ([a]) => [a]},
    {"name": "FunctionArgs", "symbols": ["Literal", "_", "FunctionArgs"], "postprocess": ([a,,b]) => [a, ...b]},
    {"name": "Color", "symbols": [(lexer.has("rgb") ? {type: "rgb"} : rgb), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "ColorRGBArgs", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => a},
    {"name": "Color", "symbols": [(lexer.has("rgba") ? {type: "rgba"} : rgba), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "ColorRGBAArgs", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => a},
    {"name": "Color", "symbols": ["ColorHex"], "postprocess": id},
    {"name": "ColorRGBArgs", "symbols": [(lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value], type: "colorRGB" })},
    {"name": "ColorRGBAArgs", "symbols": [(lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value, d.value], type: "colorRGBA" })},
    {"name": "ColorHex", "symbols": [(lexer.has("hex") ? {type: "hex"} : hex), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", (lexer.has("colorHex") ? {type: "colorHex"} : colorHex), "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: a.value, type: "colorHex" })},
    {"name": "URL", "symbols": [(lexer.has("url") ? {type: "url"} : url), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "String", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: a.value, type: "url" })},
    {"name": "Path", "symbols": [(lexer.has("path") ? {type: "path"} : path), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "String", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: a.value, type: "path" })},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([a]) => ({ value: a.value, type: "number" })},
    {"name": "Number", "symbols": [(lexer.has("castNumber") ? {type: "castNumber"} : castNumber), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "Literal", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: Number(a.value), type: "number" })},
    {"name": "String", "symbols": [(lexer.has("stringDouble") ? {type: "stringDouble"} : stringDouble)], "postprocess": ([a]) => ({ value: a.value, type: "string" })},
    {"name": "String", "symbols": [(lexer.has("stringSingle") ? {type: "stringSingle"} : stringSingle)], "postprocess": ([a]) => ({ value: a.value, type: "string" })},
    {"name": "String", "symbols": [(lexer.has("castString") ? {type: "castString"} : castString), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "Literal", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: String(a.value), type: "string" })},
    {"name": "Boolean", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([a]) => ({ value: a.value, type: "boolean" })},
    {"name": "Boolean", "symbols": [(lexer.has("castBoolean") ? {type: "castBoolean"} : castBoolean), (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "Literal", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose)], "postprocess": ([,,,a]) => ({ value: Boolean(a.value), type: "boolean" })},
    {"name": "Array", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), "_", (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": () => ({ value: [], type: "array" })},
    {"name": "Array", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), "_", "ArrayContents", "_", (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": ([,,a,,]) => ({ value: a, type: "array" })},
    {"name": "ArrayContents", "symbols": ["Literal"], "postprocess": ([a]) => [a]},
    {"name": "ArrayContents", "symbols": ["Literal", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "ArrayContents"], "postprocess": ([a, , , , b]) => [a, ...b]},
    {"name": "RegExp", "symbols": [(lexer.has("regex") ? {type: "regex"} : regex)], "postprocess":  ([a]) => {
          // get modifiers from the end of the regex
          const modifiers = a.value.slice(a.value.lastIndexOf("/") + 1);
          // remove the leading and trailing slashes
          const regex = a.value.slice(1, a.value.lastIndexOf("/"));
          return { value: new RegExp(regex, modifiers), type: "regex" }
        }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "Block", "symbols": ["Function"], "postprocess": id},
    {"name": "Function", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), (lexer.has("fn") ? {type: "fn"} : fn), "_", (lexer.has("parenOpen") ? {type: "parenOpen"} : parenOpen), "_", "FunctionArgs", "_", (lexer.has("parenClose") ? {type: "parenClose"} : parenClose), (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": ([,a,,,,b]) => ({ slug: a.value, args: b })},
    {"name": "Function", "symbols": [(lexer.has("BrackOpen") ? {type: "BrackOpen"} : BrackOpen), (lexer.has("fn") ? {type: "fn"} : fn), "_", (lexer.has("BrackClose") ? {type: "BrackClose"} : BrackClose)], "postprocess": ([,a]) => ({ slug: a.value, args: {} })},
    {"name": "FunctionArgs", "symbols": ["RequiredArgs"], "postprocess": id},
    {"name": "FunctionArgs", "symbols": ["OptionalArgs"], "postprocess": id},
    {"name": "RequiredArgs", "symbols": [(lexer.has("argName") ? {type: "argName"} : argName)], "postprocess": ([a]) => ({ [a.text]: { required: true } })},
    {"name": "RequiredArgs", "symbols": [(lexer.has("argName") ? {type: "argName"} : argName), "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "FunctionArgs"], "postprocess": ([a,,,,b]) => ({ [a.text]: { required: true }, ...b })},
    {"name": "OptionalArgs", "symbols": [(lexer.has("argName") ? {type: "argName"} : argName), "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "Literal"], "postprocess": ([a,,,,b]) => ({ [a.text]: { required: false, default: b } })},
    {"name": "OptionalArgs", "symbols": [(lexer.has("argName") ? {type: "argName"} : argName), "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "Literal", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "OptionalArgs"], "postprocess": ([a,,,,b,,,,c]) => ({ [a.text]: { required: false, default: b }, ...c })}
]
  , ParserStart: "Block"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
