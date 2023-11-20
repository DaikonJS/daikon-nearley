@include "lexer.ne"
@lexer lexer

Literal ->
    Number {% id %}
  | String {% id %}
  | %boolean {% ([a]) => ({ value: a.value, type: "boolean" }) %}
  | %bang Literal {% ([, b]) => ({ value: !b, type: "boolean" }) %}
  | Array {% ([a]) => ({ value: a, type: "array" }) %}
  | RegExp {% ([a]) => ({ value: a, type: "regex" }) %}
  | %nullPrimitive {% () => ({ value: null, type: "null" }) %}
  | Color {% id %}
  | Function {% id %}

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
  | Literal %ws:* FunctionArgs {% ([a,,b]) => [a, ...b] %}


Color ->
    %rgb %parenOpen %ws:* ColorRGBArgs %ws:* %parenClose {% ([,,,a]) => a %}
  | %rgba %parenOpen %ws:* ColorRGBAArgs %ws:* %parenClose {% ([,,,a]) => a %}
  | ColorHex {% id %}

ColorRGBArgs ->
    %number %ws:* %comma %ws:* %number %ws:* %comma %ws:* %number {% ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value], type: "colorRGB" }) %}

ColorRGBAArgs ->
    %number %ws:* %comma %ws:* %number %ws:* %comma %ws:* %number %ws:* %comma %ws:* %number {% ([a,,,,b,,,,c,,,,d]) => ({ value: [a.value, b.value, c.value, d.value], type: "colorRGBA" }) %}

ColorHex ->
    %hex %parenOpen %ws:* %colorHex %ws:* %parenClose {% ([,,,a]) => ({ value: a.value, type: "colorHex" }) %}

Number -> %number {% ([a]) => ({ value: a.value, type: "number" }) %}
String ->
    %stringDouble {% ([a]) => ({ value: a.value, type: "string" }) %}
  | %stringSingle {% ([a]) => ({ value: a.value, type: "string" }) %}

Array ->
    %BrackOpen %ws:* %BrackClose {% () => ({ value: [], type: "array" }) %}
  | %BrackOpen %ws:* ArrayContents %ws:* %BrackClose {% ([,,a,,]) => ({ value: a, type: "array" }) %}

ArrayContents ->
    Literal {% ([a]) => [a] %}
  | Literal %ws:* %comma %ws:* ArrayContents {% ([a, , , , b]) => [a, ...b] %}


RegExp ->
    %regex {% ([a]) => {
      // get modifiers from the end of the regex
      const modifiers = a.value.slice(a.value.lastIndexOf("/") + 1);
      // remove the leading and trailing slashes
      const regex = a.value.slice(1, a.value.lastIndexOf("/"));
      return new RegExp(regex, modifiers);
    }%}

