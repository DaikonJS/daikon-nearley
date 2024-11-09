@include "lexer.ne"
@include "common.ne"
@lexer lexer


Block -> Function {% id %}


Function ->
    %BrackOpen %fn _ %parenOpen _ FunctionArgs _ %parenClose %BrackClose {% ([,a,,,,b]) => ({ slug: a.value, args: b }) %}
  | %BrackOpen %fn _ %BrackClose {% ([,a]) => ({ slug: a.value, args: {} }) %}

FunctionArgs ->
    RequiredArgs {% id %}
  | OptionalArgs {% id %}

RequiredArgs ->
    %argName {% ([a]) => ({ [a.text]: { required: true } }) %}
  | %argName _ %comma _ FunctionArgs {% ([a,,,,b]) => ({ [a.text]: { required: true }, ...b }) %}

OptionalArgs ->
    %argName _ %assignment _ Literal {% ([a,,,,b]) => ({ [a.text]: { required: false, default: b } }) %}
  | %argName _ %assignment _ Literal _ %comma _ OptionalArgs {% ([a,,,,b,,,,c]) => ({ [a.text]: { required: false, default: b }, ...c }) %}
