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
    {"name": "Expression", "symbols": ["Exp"], "postprocess": id},
    {"name": "Expression", "symbols": ["Get"], "postprocess": id},
    {"name": "Expression", "symbols": ["Ternary"], "postprocess": id},
    {"name": "Expression", "symbols": ["Math"], "postprocess": id},
    {"name": "Get", "symbols": [(lexer.has("GetterGet") ? {type: "GetterGet"} : GetterGet), "_", "String", "_", (lexer.has("GetterIn") ? {type: "GetterIn"} : GetterIn), "_", "String"], "postprocess":  ([, , a, , , , b]) => {
          const allIndices = [];
          let index = b.value.indexOf(a.value);
          while (index !== -1) {
            allIndices.push(index);
            index = b.value.indexOf(a.value, index + 1);
          }
          return allIndices;
        } },
    {"name": "Get", "symbols": [(lexer.has("GetterGet") ? {type: "GetterGet"} : GetterGet), "_", "RegExp", "_", (lexer.has("GetterIn") ? {type: "GetterIn"} : GetterIn), "_", "String"], "postprocess":  ([, , a, , , , b]) => {
          const allIndices = [];
          const regex = a.value;
        
          if (!regex.global) {
            return [b.value.search(regex)]
          }
        
          let match;
          while ((match = regex.exec(b.value)) !== null) {
            allIndices.push(match.index);
          }
          return allIndices;
        } },
    {"name": "Ternary", "symbols": ["Exp", "_", (lexer.has("ternIf") ? {type: "ternIf"} : ternIf), "_", "Expression", "_", (lexer.has("ternElse") ? {type: "ternElse"} : ternElse), "_", "Expression"], "postprocess": ([a, , , , b, , , , c]) => a.value ? b : c},
    {"name": "Exp", "symbols": ["BinOp"], "postprocess": id},
    {"name": "BinOp", "symbols": ["ExpComparison"], "postprocess": id},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("eq") ? {type: "eq"} : eq), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value === b.value })},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("neq") ? {type: "neq"} : neq), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value !== b.value })},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("lt") ? {type: "lt"} : lt), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value < b.value })},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("lte") ? {type: "lte"} : lte), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value <= b.value })},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("gt") ? {type: "gt"} : gt), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value > b.value })},
    {"name": "ExpComparison", "symbols": ["ExpComparison", "_", (lexer.has("gte") ? {type: "gte"} : gte), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value >= b.value })},
    {"name": "ExpComparison", "symbols": ["ExpConcatenation"], "postprocess": id},
    {"name": "ExpConcatenation", "symbols": ["Math", "_", (lexer.has("OR") ? {type: "OR"} : OR), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: Boolean(a.value || b.value) })},
    {"name": "ExpConcatenation", "symbols": ["Math", "_", (lexer.has("AND") ? {type: "AND"} : AND), "_", "ExpConcatenation"], "postprocess": ([a, , , , b]) => ({ type: "boolean", value: a.value && b.value })},
    {"name": "ExpConcatenation", "symbols": ["Math"], "postprocess": id},
    {"name": "Math", "symbols": ["Math", "_", (lexer.has("plus") ? {type: "plus"} : plus), "_", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value + b.value })},
    {"name": "Math", "symbols": ["Math", "_", (lexer.has("minus") ? {type: "minus"} : minus), "_", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value - b.value })},
    {"name": "Math", "symbols": ["Math", "_", (lexer.has("times") ? {type: "times"} : times), "_", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value * b.value })},
    {"name": "Math", "symbols": ["Math", "_", (lexer.has("div") ? {type: "div"} : div), "_", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value / b.value })},
    {"name": "Math", "symbols": ["Math", "_", (lexer.has("mod") ? {type: "mod"} : mod), "_", "Term"], "postprocess": ([a, , , , b]) => ({ type: "number", value: a.value % b.value })},
    {"name": "Math", "symbols": ["Term"], "postprocess": id},
    {"name": "Term", "symbols": ["Literal"], "postprocess": id},
    {"name": "Term", "symbols": [(lexer.has("cont") ? {type: "cont"} : cont)], "postprocess": () => ({ type: "reserved", value: "continue" })},
    {"name": "Term", "symbols": [(lexer.has("length") ? {type: "length"} : length), "_", "String"], "postprocess": ([, , a]) => ({ type: "number", value: a.value.length })},
    {"name": "Term", "symbols": [(lexer.has("length") ? {type: "length"} : length), "_", "Array"], "postprocess": ([, , a]) => ({ type: "number", value: a.value.length })},
    {"name": "Term", "symbols": [(lexer.has("reverse") ? {type: "reverse"} : reverse), "_", "String"], "postprocess": ([, , a]) => ({ type: "string", value: a.value.split("").reverse().join("") })},
    {"name": "Term", "symbols": [(lexer.has("reverse") ? {type: "reverse"} : reverse), "_", "Array"], "postprocess": ([, , a]) => ({ type: "array", value: a.value.reverse() })},
    {"name": "Term", "symbols": [(lexer.has("sort") ? {type: "sort"} : sort), "_", "Array"], "postprocess": ([, , a]) => ({ type: "array", value: a.value.sort((x,y) => x.value < y.value ? -1 : 1) })},
    {"name": "Term", "symbols": [(lexer.has("join") ? {type: "join"} : join), "_", "Array", "_", "String"], "postprocess": ([, , a, , b]) => ({ type: "string", value: a.value.map(v => v.value).join(b.value) })},
    {"name": "Term", "symbols": [(lexer.has("atIndex") ? {type: "atIndex"} : atIndex), "_", (lexer.has("number") ? {type: "number"} : number), "_", "String"], "postprocess": ([, , a, , b]) => ({ type: "string", value: b.value[a.value] })},
    {"name": "Term", "symbols": [(lexer.has("atIndex") ? {type: "atIndex"} : atIndex), "_", (lexer.has("number") ? {type: "number"} : number), "_", "Array"], "postprocess": ([, , a, , b]) => ({ type: "string", value: b.value[a.value].value })},
    {"name": "Term", "symbols": [(lexer.has("indexOf") ? {type: "indexOf"} : indexOf), "_", "String", "_", "String"], "postprocess": ([, , a, , b]) => ({ type: "number", value: String(b.value).indexOf(a.value) })},
    {"name": "Term", "symbols": [(lexer.has("indexOf") ? {type: "indexOf"} : indexOf), "_", "String", "_", "Array"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.findIndex(v => v.value === a.value) })},
    {"name": "Term", "symbols": [(lexer.has("lastIndexOf") ? {type: "lastIndexOf"} : lastIndexOf), "_", "Indexable", "_", "String"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.lastIndexOf(a.value) })},
    {"name": "Term", "symbols": [(lexer.has("lastIndexOf") ? {type: "lastIndexOf"} : lastIndexOf), "_", "Indexable", "_", "Array"], "postprocess": ([, , a, , b]) => ({ type: "number", value: b.value.length - 1 - b.value.slice().reverse().findIndex(v => v.value === a.value) })},
    {"name": "Term", "symbols": [(lexer.has("split") ? {type: "split"} : split), "_", "Indexable", "_", "String"], "postprocess": ([, , a, , , b]) => ({ type: "array", value: b.value.split(a.value) })},
    {"name": "Term", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub), "_", "Indexable", "_", (lexer.has("number") ? {type: "number"} : number), "_", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([, , a, , b, , c]) => ({ type: "string", value: sub(a.value, b.value, c.value) })},
    {"name": "Term", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub), "_", "Indexable", "_", (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([, , a, , b]) =>  ({ type: "string", value: sub(a.value, b.value, a.length) })},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "_", "String", "_", "Term"], "postprocess": ([, , a, , b]) =>  ({ type: "string", value: `${a.value}${b.value}` })},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "_", "Array", "_", "String"], "postprocess": ([, , a, , b]) => ({ type: "array", value: [...a.value, b] })},
    {"name": "Term", "symbols": [(lexer.has("push") ? {type: "push"} : push), "_", "Array", "_", "Number"], "postprocess": ([, , a, , b]) => ({ type: "array", value: [...a.value, b] })},
    {"name": "Term", "symbols": [(lexer.has("pop") ? {type: "pop"} : pop), "_", "String"], "postprocess": ([, ,a]) => ({ type: "string", value: a.value.slice(0, -1) })},
    {"name": "Term", "symbols": [(lexer.has("pop") ? {type: "pop"} : pop), "_", "Array"], "postprocess": ([, ,a]) => ({ type: "array", value: a.value.slice(0, -1) })},
    {"name": "Term", "symbols": [(lexer.has("shift") ? {type: "shift"} : shift), "_", "String"], "postprocess": ([, ,a]) => ({ type: "string", value: sub(a.value, 1) })},
    {"name": "Term", "symbols": [(lexer.has("shift") ? {type: "shift"} : shift), "_", "Array"], "postprocess": ([, ,a]) => ({ type: "array", value: a.value.slice(1) })},
    {"name": "Term", "symbols": [(lexer.has("replace") ? {type: "replace"} : replace), "_", "Indexable", "_", "Indexable", "_", "Indexable"], "postprocess": ([, , a, , b, , c]) => ({ type: "string", value: a.value.replaceAll(b.value, c.value) })},
    {"name": "PropertyBlock", "symbols": ["PropertyName", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "Literal"], "postprocess": ([a,,,,b]) => ({ ...a, ...b })},
    {"name": "PropertyBlock", "symbols": ["PropertyName", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), (lexer.has("bang") ? {type: "bang"} : bang), "_", "Expression"], "postprocess": ([a,,,,,b]) => ({ ...a, ...b })},
    {"name": "PropertyName", "symbols": [(lexer.has("propertyName") ? {type: "propertyName"} : propertyName)], "postprocess": ([a]) => ({ slug: a.text.trim() })}
]
  , ParserStart: "PropertyBlock"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
