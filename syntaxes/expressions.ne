@include "lexer.ne"
@include "common.ne"
@lexer lexer

# Pass your lexer object using the @lexer option:
@lexer lexer

Expression ->
    Exp {% id %}
  | Get {% id %}
  | Ternary {% id %}
  | Math {% id %}

Get ->
    %GetterGet %ws:* String %ws:* %GetterIn %ws:* String {% ([, , a, , , , b]) => {
      const allIndices = [];
      let index = b.value.indexOf(a);
      while (index !== -1) {
        allIndices.push(index);
        index = b.value.indexOf(a, index + 1);
      }
      return allIndices;
    } %}
  | %GetterGet %ws:* RegExp %ws:* %GetterIn %ws:* String {% ([, , a, , , , b]) => {
      const allIndices = [];
      const regex = a;
      let match = regex.exec(b.value);
      while (match !== null) {
        allIndices.push(match.index);
        match = regex.exec(b.value);
      }
      return allIndices;
    } %}


Ternary ->
    Exp %ws:* %ternIf %ws:* Expression %ws:* %ternElse %ws:* Expression {% ([a, , , , b, , , , c]) => a.value ? b : c %}

Exp -> BinOp {% id %}


BinOp -> ExpComparison {% id %}


ExpComparison ->
    ExpComparison %ws:* %eq %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value === b.value }) %}
  | ExpComparison %ws:* %neq %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value !== b.value }) %}
  | ExpComparison %ws:* %lt %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value < b.value }) %}
  | ExpComparison %ws:* %lte %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value <= b.value }) %}
  | ExpComparison %ws:* %gt %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value > b.value }) %}
  | ExpComparison %ws:* %gte %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value >= b.value }) %}
  | ExpConcatenation {% id %}


ExpConcatenation ->
    Math %ws:* %OR %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: Boolean(a.value || b.value) }) %}
  | Math %ws:* %AND %ws:* ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value && b.value }) %}
	| Math {% id %}


Math ->
    Math %ws:* %plus %ws:* Term {% ([a, , , , b]) => ({ type: "number", value: a.value + b.value }) %}
  | Math %ws:* %minus %ws:* Term {% ([a, , , , b]) => ({ type: "number", value: a.value - b.value }) %}
  | Math %ws:* %times %ws:* Term {% ([a, , , , b]) => ({ type: "number", value: a.value * b.value }) %}
  | Math %ws:* %div %ws:* Term {% ([a, , , , b]) => ({ type: "number", value: a.value / b.value }) %}
  | Math %ws:* %mod %ws:* Term {% ([a, , , , b]) => ({ type: "number", value: a.value % b.value }) %}
  | Term {% id %}

Term ->
    Literal {% id %}
  | %cont {% () => ({ type: "reserved", value: "continue" }) %}
  | %length %ws:* String {% ([, , a]) => ({ type: "number", value: a.value.length }) %}
  | %length %ws:* Array {% ([, , a]) => ({ type: "number", value: a.value.length }) %}
  | %reverse %ws:* String {% ([, , a]) => ({ type: "string", value: a.value.split("").reverse().join("") }) %}
  | %reverse %ws:* Array {% ([, , a]) => ({ type: "array", value: a.value.reverse() }) %}
  | %sort %ws:* Array {% ([, , a]) => ({ type: "array", value: a.value.sort((x,y) => x.value < y.value ? -1 : 1) }) %}
  | %join %ws:* Array %ws:* String {% ([, , a, , b]) => ({ type: "string", value: a.value.map(v => v.value).join(b.value) }) %}

  | %atIndex %ws:* %number %ws:* String {% ([, , a, , b]) => ({ type: "string", value: b.value[a.value] }) %}
  | %atIndex %ws:* %number %ws:* Array {% ([, , a, , b]) => ({ type: "string", value: b.value[a.value].value }) %}

  | %indexOf %ws:* String %ws:* String {% ([, , a, , b]) => ({ type: "number", value: String(b.value).indexOf(a.value) }) %}
  | %indexOf %ws:* String %ws:* Array {% ([, , a, , b]) => ({ type: "number", value: b.value.findIndex(v => v.value === a.value) }) %}
  | %lastIndexOf %ws:* Indexable %ws:* String {% ([, , a, , b]) => ({ type: "number", value: b.value.lastIndexOf(a.value) }) %}
  | %lastIndexOf %ws:* Indexable %ws:* Array {% ([, , a, , b]) => ({ type: "number", value: b.value.length - 1 - b.value.slice().reverse().findIndex(v => v.value === a.value) }) %}

  | %split %ws:* Indexable %ws:* String {% ([, , a, , , b]) => ({ type: "array", value: b.value.split(a.value) }) %}

  | %sub %ws:* Indexable %ws:* %number %ws:* %number {% ([, , a, , b, , c]) => ({ type: "string", value: sub(a.value, b.value, c.value) }) %}
  | %sub %ws:* Indexable %ws:* %number {% ([, , a, , b]) =>  ({ type: "string", value: sub(a.value, b.value, a.length) }) %}

  | %push %ws:* String %ws:* Term {% ([, , a, , b]) =>  ({ type: "string", value: `${a.value}${b.value}` }) %}
  | %push %ws:* Array %ws:* String {% ([, , a, , b]) => ({ type: "array", value: [...a.value, b] }) %}
  | %push %ws:* Array %ws:* Number {% ([, , a, , b]) => ({ type: "array", value: [...a.value, b] }) %}

  | %pop %ws:* String {% ([, ,a]) => ({ type: "string", value: a.value.slice(0, -1) }) %}
  | %pop %ws:* Array {% ([, ,a]) => ({ type: "array", value: a.value.slice(0, -1) }) %}

  | %shift %ws:* String {% ([, ,a]) => ({ type: "string", value: sub(a.value, 1) }) %}
  | %shift %ws:* Array {% ([, ,a]) => ({ type: "array", value: a.value.slice(1) }) %}

  | %replace %ws:* Indexable %ws:* Indexable %ws:* Indexable {% ([, , a, , b, , c]) => ({ type: "string", value: a.value.replaceAll(b.value, c.value) }) %}
  
