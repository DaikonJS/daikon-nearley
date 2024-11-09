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
    %GetterGet _ String _ %GetterIn _ String {% ([, , a, , , , b]) => {
      const allIndices = [];
      let index = b.value.indexOf(a.value);
      while (index !== -1) {
        allIndices.push(index);
        index = b.value.indexOf(a.value, index + 1);
      }
      return allIndices;
    } %}
  | %GetterGet _ RegExp _ %GetterIn _ String {% ([, , a, , , , b]) => {
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
    } %}


Ternary ->
    Exp _ %ternIf _ Expression _ %ternElse _ Expression {% ([a, , , , b, , , , c]) => a.value ? b : c %}

Exp -> BinOp {% id %}


BinOp -> ExpComparison {% id %}


ExpComparison ->
    ExpComparison _ %eq _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value === b.value }) %}
  | ExpComparison _ %neq _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value !== b.value }) %}
  | ExpComparison _ %lt _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value < b.value }) %}
  | ExpComparison _ %lte _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value <= b.value }) %}
  | ExpComparison _ %gt _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value > b.value }) %}
  | ExpComparison _ %gte _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value >= b.value }) %}
  | ExpConcatenation {% id %}


ExpConcatenation ->
    Math _ %OR _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: Boolean(a.value || b.value) }) %}
  | Math _ %AND _ ExpConcatenation {% ([a, , , , b]) => ({ type: "boolean", value: a.value && b.value }) %}
	| Math {% id %}


Math ->
    Math _ %plus _ Term {% ([a, , , , b]) => ({ type: "number", value: a.value + b.value }) %}
  | Math _ %minus _ Term {% ([a, , , , b]) => ({ type: "number", value: a.value - b.value }) %}
  | Math _ %times _ Term {% ([a, , , , b]) => ({ type: "number", value: a.value * b.value }) %}
  | Math _ %div _ Term {% ([a, , , , b]) => ({ type: "number", value: a.value / b.value }) %}
  | Math _ %mod _ Term {% ([a, , , , b]) => ({ type: "number", value: a.value % b.value }) %}
  | Term {% id %}

Term ->
    Literal {% id %}
  | %cont {% () => ({ type: "reserved", value: "continue" }) %}
  | %length _ String {% ([, , a]) => ({ type: "number", value: a.value.length }) %}
  | %length _ Array {% ([, , a]) => ({ type: "number", value: a.value.length }) %}
  | %reverse _ String {% ([, , a]) => ({ type: "string", value: a.value.split("").reverse().join("") }) %}
  | %reverse _ Array {% ([, , a]) => ({ type: "array", value: a.value.reverse() }) %}
  | %sort _ Array {% ([, , a]) => ({ type: "array", value: a.value.sort((x,y) => x.value < y.value ? -1 : 1) }) %}
  | %join _ Array _ String {% ([, , a, , b]) => ({ type: "string", value: a.value.map(v => v.value).join(b.value) }) %}

  | %atIndex _ %number _ String {% ([, , a, , b]) => ({ type: "string", value: b.value[a.value] }) %}
  | %atIndex _ %number _ Array {% ([, , a, , b]) => ({ type: "string", value: b.value[a.value].value }) %}

  | %indexOf _ String _ String {% ([, , a, , b]) => ({ type: "number", value: String(b.value).indexOf(a.value) }) %}
  | %indexOf _ String _ Array {% ([, , a, , b]) => ({ type: "number", value: b.value.findIndex(v => v.value === a.value) }) %}
  | %lastIndexOf _ Indexable _ String {% ([, , a, , b]) => ({ type: "number", value: b.value.lastIndexOf(a.value) }) %}
  | %lastIndexOf _ Indexable _ Array {% ([, , a, , b]) => ({ type: "number", value: b.value.length - 1 - b.value.slice().reverse().findIndex(v => v.value === a.value) }) %}

  | %split _ Indexable _ String {% ([, , a, , , b]) => ({ type: "array", value: b.value.split(a.value) }) %}

  | %sub _ Indexable _ %number _ %number {% ([, , a, , b, , c]) => ({ type: "string", value: sub(a.value, b.value, c.value) }) %}
  | %sub _ Indexable _ %number {% ([, , a, , b]) =>  ({ type: "string", value: sub(a.value, b.value, a.length) }) %}

  | %push _ String _ Term {% ([, , a, , b]) =>  ({ type: "string", value: `${a.value}${b.value}` }) %}
  | %push _ Array _ String {% ([, , a, , b]) => ({ type: "array", value: [...a.value, b] }) %}
  | %push _ Array _ Number {% ([, , a, , b]) => ({ type: "array", value: [...a.value, b] }) %}

  | %pop _ String {% ([, ,a]) => ({ type: "string", value: a.value.slice(0, -1) }) %}
  | %pop _ Array {% ([, ,a]) => ({ type: "array", value: a.value.slice(0, -1) }) %}

  | %shift _ String {% ([, ,a]) => ({ type: "string", value: sub(a.value, 1) }) %}
  | %shift _ Array {% ([, ,a]) => ({ type: "array", value: a.value.slice(1) }) %}

  | %replace _ Indexable _ Indexable _ Indexable {% ([, , a, , b, , c]) => ({ type: "string", value: a.value.replaceAll(b.value, c.value) }) %}
  
