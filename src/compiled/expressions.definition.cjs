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
        }},
    {"name": "Expression", "symbols": ["Exp"], "postprocess": id},
    {"name": "Expression", "symbols": ["Get"], "postprocess": id},
    {"name": "Expression", "symbols": ["Ternary"], "postprocess": id},
    {"name": "Expression", "symbols": ["Math"], "postprocess": id},
    {"name": "Get$ebnf$1", "symbols": []},
    {"name": "Get$ebnf$1", "symbols": ["Get$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get$ebnf$2", "symbols": []},
    {"name": "Get$ebnf$2", "symbols": ["Get$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get$ebnf$3", "symbols": []},
    {"name": "Get$ebnf$3", "symbols": ["Get$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get", "symbols": [(lexer.has("GetterGet") ? {type: "GetterGet"} : GetterGet), "Get$ebnf$1", "String", "Get$ebnf$2", (lexer.has("GetterIn") ? {type: "GetterIn"} : GetterIn), "Get$ebnf$3", "String"], "postprocess":  ([, , a, , , , b]) => {
          const allIndices = [];
          let index = b.value.indexOf(a);
          while (index !== -1) {
            allIndices.push(index);
            index = b.value.indexOf(a, index + 1);
          }
          return allIndices;
        } },
    {"name": "Get$ebnf$4", "symbols": []},
    {"name": "Get$ebnf$4", "symbols": ["Get$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get$ebnf$5", "symbols": []},
    {"name": "Get$ebnf$5", "symbols": ["Get$ebnf$5", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get$ebnf$6", "symbols": []},
    {"name": "Get$ebnf$6", "symbols": ["Get$ebnf$6", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Get", "symbols": [(lexer.has("GetterGet") ? {type: "GetterGet"} : GetterGet), "Get$ebnf$4", "RegExp", "Get$ebnf$5", (lexer.has("GetterIn") ? {type: "GetterIn"} : GetterIn), "Get$ebnf$6", "String"], "postprocess":  ([, , a, , , , b]) => {
          const allIndices = [];
          const regex = a;
          let match = regex.exec(b.value);
          while (match !== null) {
            allIndices.push(match.index);
            match = regex.exec(b.value);
          }
          return allIndices;
        } },
    {"name": "Ternary$ebnf$1", "symbols": []},
    {"name": "Ternary$ebnf$1", "symbols": ["Ternary$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Ternary$ebnf$2", "symbols": []},
    {"name": "Ternary$ebnf$2", "symbols": ["Ternary$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Ternary$ebnf$3", "symbols": []},
    {"name": "Ternary$ebnf$3", "symbols": ["Ternary$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Ternary$ebnf$4", "symbols": []},
    {"name": "Ternary$ebnf$4", "symbols": ["Ternary$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Ternary", "symbols": ["Exp", "Ternary$ebnf$1", (lexer.has("ternIf") ? {type: "ternIf"} : ternIf), "Ternary$ebnf$2", "Expression", "Ternary$ebnf$3", (lexer.has("ternElse") ? {type: "ternElse"} : ternElse), "Ternary$ebnf$4", "Expression"], "postprocess": ([a, , , , b, , , , c]) => a.value ? b : c},
    {"name": "Exp", "symbols": ["BinOp"], "postprocess": id},
    {"name": "BinOp", "symbols": ["ExpComparison"], "postprocess": id},
    {"name": "ExpComparison$ebnf$1", "symbols": []},
    {"name": "ExpComparison$ebnf$1", "symbols": ["ExpComparison$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$2", "symbols": []},
    {"name": "ExpComparison$ebnf$2", "symbols": ["ExpComparison$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$1", (lexer.has("eq") ? {type: "eq"} : eq), "ExpComparison$ebnf$2", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value === b.value })},
    {"name": "ExpComparison$ebnf$3", "symbols": []},
    {"name": "ExpComparison$ebnf$3", "symbols": ["ExpComparison$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$4", "symbols": []},
    {"name": "ExpComparison$ebnf$4", "symbols": ["ExpComparison$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$3", (lexer.has("neq") ? {type: "neq"} : neq), "ExpComparison$ebnf$4", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value !== b.value })},
    {"name": "ExpComparison$ebnf$5", "symbols": []},
    {"name": "ExpComparison$ebnf$5", "symbols": ["ExpComparison$ebnf$5", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$6", "symbols": []},
    {"name": "ExpComparison$ebnf$6", "symbols": ["ExpComparison$ebnf$6", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$5", (lexer.has("lt") ? {type: "lt"} : lt), "ExpComparison$ebnf$6", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value < b.value })},
    {"name": "ExpComparison$ebnf$7", "symbols": []},
    {"name": "ExpComparison$ebnf$7", "symbols": ["ExpComparison$ebnf$7", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$8", "symbols": []},
    {"name": "ExpComparison$ebnf$8", "symbols": ["ExpComparison$ebnf$8", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$7", (lexer.has("lte") ? {type: "lte"} : lte), "ExpComparison$ebnf$8", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value <= b.value })},
    {"name": "ExpComparison$ebnf$9", "symbols": []},
    {"name": "ExpComparison$ebnf$9", "symbols": ["ExpComparison$ebnf$9", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$10", "symbols": []},
    {"name": "ExpComparison$ebnf$10", "symbols": ["ExpComparison$ebnf$10", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$9", (lexer.has("gt") ? {type: "gt"} : gt), "ExpComparison$ebnf$10", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value > b.value })},
    {"name": "ExpComparison$ebnf$11", "symbols": []},
    {"name": "ExpComparison$ebnf$11", "symbols": ["ExpComparison$ebnf$11", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison$ebnf$12", "symbols": []},
    {"name": "ExpComparison$ebnf$12", "symbols": ["ExpComparison$ebnf$12", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "ExpComparison$ebnf$11", (lexer.has("gte") ? {type: "gte"} : gte), "ExpComparison$ebnf$12", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value >= b.value })},
    {"name": "ExpComparison", "symbols": ["ExpConcatenation"], "postprocess": id},
    {"name": "ExpConcatenation$ebnf$1", "symbols": []},
    {"name": "ExpConcatenation$ebnf$1", "symbols": ["ExpConcatenation$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpConcatenation$ebnf$2", "symbols": []},
    {"name": "ExpConcatenation$ebnf$2", "symbols": ["ExpConcatenation$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpConcatenation", "symbols": ["Math", "ExpConcatenation$ebnf$1", (lexer.has("OR") ? {type: "OR"} : OR), "ExpConcatenation$ebnf$2", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: Boolean(a.value || b.value) })},
    {"name": "ExpConcatenation$ebnf$3", "symbols": []},
    {"name": "ExpConcatenation$ebnf$3", "symbols": ["ExpConcatenation$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpConcatenation$ebnf$4", "symbols": []},
    {"name": "ExpConcatenation$ebnf$4", "symbols": ["ExpConcatenation$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ExpConcatenation", "symbols": ["Math", "ExpConcatenation$ebnf$3", (lexer.has("AND") ? {type: "AND"} : AND), "ExpConcatenation$ebnf$4", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value && b.value })},
    {"name": "ExpConcatenation", "symbols": ["Math"], "postprocess": id},
    {"name": "Math$ebnf$1", "symbols": []},
    {"name": "Math$ebnf$1", "symbols": ["Math$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math$ebnf$2", "symbols": []},
    {"name": "Math$ebnf$2", "symbols": ["Math$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math", "symbols": ["Math", "Math$ebnf$1", (lexer.has("plus") ? {type: "plus"} : plus), "Math$ebnf$2", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value + b.value })},
    {"name": "Math$ebnf$3", "symbols": []},
    {"name": "Math$ebnf$3", "symbols": ["Math$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math$ebnf$4", "symbols": []},
    {"name": "Math$ebnf$4", "symbols": ["Math$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math", "symbols": ["Math", "Math$ebnf$3", (lexer.has("minus") ? {type: "minus"} : minus), "Math$ebnf$4", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value - b.value })},
    {"name": "Math$ebnf$5", "symbols": []},
    {"name": "Math$ebnf$5", "symbols": ["Math$ebnf$5", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math$ebnf$6", "symbols": []},
    {"name": "Math$ebnf$6", "symbols": ["Math$ebnf$6", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math", "symbols": ["Math", "Math$ebnf$5", (lexer.has("times") ? {type: "times"} : times), "Math$ebnf$6", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value * b.value })},
    {"name": "Math$ebnf$7", "symbols": []},
    {"name": "Math$ebnf$7", "symbols": ["Math$ebnf$7", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math$ebnf$8", "symbols": []},
    {"name": "Math$ebnf$8", "symbols": ["Math$ebnf$8", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math", "symbols": ["Math", "Math$ebnf$7", (lexer.has("div") ? {type: "div"} : div), "Math$ebnf$8", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value / b.value })},
    {"name": "Math$ebnf$9", "symbols": []},
    {"name": "Math$ebnf$9", "symbols": ["Math$ebnf$9", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math$ebnf$10", "symbols": []},
    {"name": "Math$ebnf$10", "symbols": ["Math$ebnf$10", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Math", "symbols": ["Math", "Math$ebnf$9", (lexer.has("mod") ? {type: "mod"} : mod), "Math$ebnf$10", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value % b.value })},
    {"name": "Math", "symbols": ["Term"], "postprocess": id},
    {"name": "Term", "symbols": ["Literal"], "postprocess": id},
    {"name": "Term", "symbols": [(lexer.has("cont") ? {type: "cont"} : cont)], "postprocess": () => ({ type: "reserved", value: "continue" })},
    {"name": "Term$ebnf$1", "symbols": []},
    {"name": "Term$ebnf$1", "symbols": ["Term$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("length") ? {type: "length"} : length), "Term$ebnf$1", "String"], "postprocess": ([, , a]) => ({ type: "number", value: a.value.length })},
    {"name": "Term$ebnf$2", "symbols": []},
    {"name": "Term$ebnf$2", "symbols": ["Term$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("length") ? {type: "length"} : length), "Term$ebnf$2", "Array"], "postprocess": ([, , a]) => ({ type: "number", value: a.value.length })},
    {"name": "Term$ebnf$3", "symbols": []},
    {"name": "Term$ebnf$3", "symbols": ["Term$ebnf$3", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("reverse") ? {type: "reverse"} : reverse), "Term$ebnf$3", "String"], "postprocess": ([, , a]) => ({ type: "string", value: a.value.split("").reverse().join("") })},
    {"name": "Term$ebnf$4", "symbols": []},
    {"name": "Term$ebnf$4", "symbols": ["Term$ebnf$4", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("reverse") ? {type: "reverse"} : reverse), "Term$ebnf$4", "Array"], "postprocess": ([, , a]) => ({ type: "array", value: a.value.reverse() })},
    {"name": "Term$ebnf$5", "symbols": []},
    {"name": "Term$ebnf$5", "symbols": ["Term$ebnf$5", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("sort") ? {type: "sort"} : sort), "Term$ebnf$5", "Array"], "postprocess": ([, , a]) => ({ type: "array", value: a.value.sort((x,y) => x.value < y.value ? -1 : 1) })},
    {"name": "Term$ebnf$6", "symbols": []},
    {"name": "Term$ebnf$6", "symbols": ["Term$ebnf$6", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$7", "symbols": []},
    {"name": "Term$ebnf$7", "symbols": ["Term$ebnf$7", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("join") ? {type: "join"} : join), "Term$ebnf$6", "Array", "Term$ebnf$7", "String"], "postprocess": ([, , a, , b]) => ({ type: "string", value: a.value.map(v => v.value).join(b.value) })},
    {"name": "Term$ebnf$8", "symbols": []},
    {"name": "Term$ebnf$8", "symbols": ["Term$ebnf$8", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$9", "symbols": []},
    {"name": "Term$ebnf$9", "symbols": ["Term$ebnf$9", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("atIndex") ? {type: "atIndex"} : atIndex), "Term$ebnf$8", (lexer.has("number") ? {type: "number"} : number), "Term$ebnf$9", "String"], "postprocess": ([, , a, , b]) => ({ type: "string", value: b.value[a.value] })},
    {"name": "Term$ebnf$10", "symbols": []},
    {"name": "Term$ebnf$10", "symbols": ["Term$ebnf$10", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$11", "symbols": []},
    {"name": "Term$ebnf$11", "symbols": ["Term$ebnf$11", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("atIndex") ? {type: "atIndex"} : atIndex), "Term$ebnf$10", (lexer.has("number") ? {type: "number"} : number), "Term$ebnf$11", "Array"], "postprocess": ([, , a, , b]) => ({ type: "string", value: b.value[a.value].value })},
    {"name": "Term$ebnf$12", "symbols": []},
    {"name": "Term$ebnf$12", "symbols": ["Term$ebnf$12", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$13", "symbols": []},
    {"name": "Term$ebnf$13", "symbols": ["Term$ebnf$13", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("indexOf") ? {type: "indexOf"} : indexOf), "Term$ebnf$12", "String", "Term$ebnf$13", "String"], "postprocess": ([, , a, , b]) => ({ type: "number", value: String(b.value).indexOf(a.value) })},
    {"name": "Term$ebnf$14", "symbols": []},
    {"name": "Term$ebnf$14", "symbols": ["Term$ebnf$14", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$15", "symbols": []},
    {"name": "Term$ebnf$15", "symbols": ["Term$ebnf$15", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("indexOf") ? {type: "indexOf"} : indexOf), "Term$ebnf$14", "String", "Term$ebnf$15", "Array"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.findIndex(v => v.value === a.value) })},
    {"name": "Term$ebnf$16", "symbols": []},
    {"name": "Term$ebnf$16", "symbols": ["Term$ebnf$16", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$17", "symbols": []},
    {"name": "Term$ebnf$17", "symbols": ["Term$ebnf$17", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("lastIndexOf") ? {type: "lastIndexOf"} : lastIndexOf), "Term$ebnf$16", "Indexable", "Term$ebnf$17", "String"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.lastIndexOf(a.value) })},
    {"name": "Term$ebnf$18", "symbols": []},
    {"name": "Term$ebnf$18", "symbols": ["Term$ebnf$18", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$19", "symbols": []},
    {"name": "Term$ebnf$19", "symbols": ["Term$ebnf$19", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("lastIndexOf") ? {type: "lastIndexOf"} : lastIndexOf), "Term$ebnf$18", "Indexable", "Term$ebnf$19", "Array"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.length - 1 - b.value.slice().reverse().findIndex(v => v.value === a.value) })},
    {"name": "Term$ebnf$20", "symbols": []},
    {"name": "Term$ebnf$20", "symbols": ["Term$ebnf$20", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$21", "symbols": []},
    {"name": "Term$ebnf$21", "symbols": ["Term$ebnf$21", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("split") ? {type: "split"} : split), "Term$ebnf$20", "Indexable", "Term$ebnf$21", "String"], "postprocess": ([, , a, , , b]) => ({ type: "array", value: b.value.split(a.value) })},
    {"name": "Term$ebnf$22", "symbols": []},
    {"name": "Term$ebnf$22", "symbols": ["Term$ebnf$22", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$23", "symbols": []},
    {"name": "Term$ebnf$23", "symbols": ["Term$ebnf$23", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$24", "symbols": []},
    {"name": "Term$ebnf$24", "symbols": ["Term$ebnf$24", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub), "Term$ebnf$22", "Indexable", "Term$ebnf$23", (lexer.has("number") ? {type: "number"} : number), "Term$ebnf$24", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([, , a, , b, , c]) => ({ type: "string", value: sub(a.value, b.value, c.value) })},
    {"name": "Term$ebnf$25", "symbols": []},
    {"name": "Term$ebnf$25", "symbols": ["Term$ebnf$25", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$26", "symbols": []},
    {"name": "Term$ebnf$26", "symbols": ["Term$ebnf$26", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub), "Term$ebnf$25", "Indexable", "Term$ebnf$26", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([, , a, , b]) =>  ({ type: "string", value: sub(a.value, b.value, a.length) })},
    {"name": "Term$ebnf$27", "symbols": []},
    {"name": "Term$ebnf$27", "symbols": ["Term$ebnf$27", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$28", "symbols": []},
    {"name": "Term$ebnf$28", "symbols": ["Term$ebnf$28", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "Term$ebnf$27", "String", "Term$ebnf$28", "Term"], "postprocess": ([, , a, , b]) =>  ({ type: "string", value: `${a.value}${b.value}` })},
    {"name": "Term$ebnf$29", "symbols": []},
    {"name": "Term$ebnf$29", "symbols": ["Term$ebnf$29", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$30", "symbols": []},
    {"name": "Term$ebnf$30", "symbols": ["Term$ebnf$30", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "Term$ebnf$29", "Array", "Term$ebnf$30", "String"], "postprocess": ([, , a, , b]) => ({ type: "array", value: [...a.value, b] })},
    {"name": "Term$ebnf$31", "symbols": []},
    {"name": "Term$ebnf$31", "symbols": ["Term$ebnf$31", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$32", "symbols": []},
    {"name": "Term$ebnf$32", "symbols": ["Term$ebnf$32", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "Term$ebnf$31", "Array", "Term$ebnf$32", "Number"], "postprocess": ([, , a, , b]) => ({ type: "array", value: [...a.value, b] })},
    {"name": "Term$ebnf$33", "symbols": []},
    {"name": "Term$ebnf$33", "symbols": ["Term$ebnf$33", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("pop") ? {type: "pop"} : pop), "Term$ebnf$33", "String"], "postprocess": ([, ,a]) => ({ type: "string", value: a.value.slice(0, -1) })},
    {"name": "Term$ebnf$34", "symbols": []},
    {"name": "Term$ebnf$34", "symbols": ["Term$ebnf$34", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("pop") ? {type: "pop"} : pop), "Term$ebnf$34", "Array"], "postprocess": ([, ,a]) => ({ type: "array", value: a.value.slice(0, -1) })},
    {"name": "Term$ebnf$35", "symbols": []},
    {"name": "Term$ebnf$35", "symbols": ["Term$ebnf$35", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("shift") ? {type: "shift"} : shift), "Term$ebnf$35", "String"], "postprocess": ([, ,a]) => ({ type: "string", value: sub(a.value, 1) })},
    {"name": "Term$ebnf$36", "symbols": []},
    {"name": "Term$ebnf$36", "symbols": ["Term$ebnf$36", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("shift") ? {type: "shift"} : shift), "Term$ebnf$36", "Array"], "postprocess": ([, ,a]) => ({ type: "array", value: a.value.slice(1) })},
    {"name": "Term$ebnf$37", "symbols": []},
    {"name": "Term$ebnf$37", "symbols": ["Term$ebnf$37", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$38", "symbols": []},
    {"name": "Term$ebnf$38", "symbols": ["Term$ebnf$38", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term$ebnf$39", "symbols": []},
    {"name": "Term$ebnf$39", "symbols": ["Term$ebnf$39", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": [(lexer.has("replace") ? {type: "replace"} : replace), "Term$ebnf$37", "Indexable", "Term$ebnf$38", "Indexable", "Term$ebnf$39", "Indexable"], "postprocess": ([, , a, , b, , c]) => ({ type: "string", value: a.value.replaceAll(b.value, c.value) })}
]
  , ParserStart: "Expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
