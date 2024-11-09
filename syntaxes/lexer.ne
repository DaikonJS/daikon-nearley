@{%
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
%}
