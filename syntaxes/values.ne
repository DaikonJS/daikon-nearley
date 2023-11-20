@include "lexer.ne"
@include "expressions.ne"
@include "common.ne"
@lexer lexer

PropertyBlock ->
    PropertyName %ws:* %assignment %ws:* Literal {% ([a,,,,b]) => ({ ...a, ...b }) %}
  | PropertyName %ws:* %assignment %bang %ws:* Expression {% ([a,,,,,b]) => ({ ...a, ...b }) %}


PropertyName -> %propertyName {% ([a]) => ({ slug: a.text.trim() }) %}
