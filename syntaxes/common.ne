@include "lexer.ne"
@lexer lexer

Literal ->
    Number {% id %}
  | String {% id %}
  | Boolean {% id %}
  | %bang Literal {% ([, b]) => ({ value: !b.value, type: "boolean" }) %}
  | Array {% ([a]) => ({ value: a, type: "array" }) %}
  | RegExp {% id %}
  | %nullPrimitive {% () => ({ value: null, type: "null" }) %}
  | Color {% id %}
  | Function {% id %}
  | URL {% id %}
  | Path {% id %}

Indexable ->
  Number {% id %}
  | String {% id %}

Iterable ->
    String {% id %}
  | Array {% id %}

Function ->
    %fn {% ([a]) => ({ value: a.text.trim(), args: [], type: "function" }) %}
  | %fn %ws FunctionArgs {% ([a,,b]) => ({ value: a.text.trim(), args: b, type: "function" }) %}
  
FunctionArgs ->
    Literal {% ([a]) => [a] %}
  | Literal _ FunctionArgs {% ([a,,b]) => [a, ...b] %}


Color ->
    %rgb %parenOpen _ ColorRGBArgs _ %parenClose {% ([,,,a]) => a %}
  | %rgba %parenOpen _ ColorRGBAArgs _ %parenClose {% ([,,,a]) => a %}
  | ColorHex {% id %}

ColorRGBArgs ->
    %number _ %comma _ %number _ %comma _ %number {% ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value], type: "colorRGB" }) %}

ColorRGBAArgs ->
    %number _ %comma _ %number _ %comma _ %number _ %comma _ %number {% ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value, d.value], type: "colorRGBA" }) %}

ColorHex ->
    %hex %parenOpen _ %colorHex _ %parenClose {% ([,,,a]) => ({ value: a.value, type: "colorHex" }) %}

URL ->
    %url %parenOpen _ String _ %parenClose {% ([,,,a]) => ({ value: a.value, type: "url" }) %}

Path ->
    %path %parenOpen _ String _ %parenClose {% ([,,,a]) => ({ value: a.value, type: "path" }) %}

Number ->
    %number {% ([a]) => ({ value: a.value, type: "number" }) %}
  | %castNumber %parenOpen _ Literal _ %parenClose {% ([,,,a]) => ({ value: Number(a.value), type: "number" }) %}

String ->
    %stringDouble {% ([a]) => ({ value: a.value, type: "string" }) %}
  | %stringSingle {% ([a]) => ({ value: a.value, type: "string" }) %}
  | %castString %parenOpen _ Literal _ %parenClose {% ([,,,a]) => ({ value: String(a.value), type: "string" }) %}

Boolean ->
    %boolean {% ([a]) => ({ value: a.value, type: "boolean" }) %}
  | %castBoolean %parenOpen _ Literal _ %parenClose {% ([,,,a]) => ({ value: Boolean(a.value), type: "boolean" }) %}

Array ->
    %BrackOpen _ %BrackClose {% () => ({ value: [], type: "array" }) %}
  | %BrackOpen _ ArrayContents _ %BrackClose {% ([,,a,,]) => ({ value: a, type: "array" }) %}

ArrayContents ->
    Literal {% ([a]) => [a] %}
  | Literal _ %comma _ ArrayContents {% ([a, , , , b]) => [a, ...b] %}


RegExp ->
    %regex {% ([a]) => {
      // get modifiers from the end of the regex
      const modifiers = a.value.slice(a.value.lastIndexOf("/") + 1);
      // remove the leading and trailing slashes
      const regex = a.value.slice(1, a.value.lastIndexOf("/"));
      return { value: new RegExp(regex, modifiers), type: "regex" }
    }%}


_ -> %ws:* {% () => null %}
