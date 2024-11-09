@include "lexer.ne"
@include "expressions.ne"
@include "common.ne"
@lexer lexer

PropertyBlock ->
    PropertyName _ %assignment _ Literal {% ([a,,,,b]) => ({ ...a, ...b }) %}
  | PropertyName _ %assignment %bang _ Expression {% ([a,,,,,b]) => ({ ...a, ...b }) %}


PropertyName -> %propertyName {% ([a]) => ({ slug: a.text.trim() }) %}
