@include "lexer.ne"
@include "common.ne"
@lexer lexer


Block -> Function {% id %}


Function ->
    %BrackOpen %fn %ws:* %parenOpen %ws:* FunctionArgs %ws:* %parenClose %BrackClose {% ([,a,,,,b]) => ({ slug: a.value, args: b }) %}
  | %BrackOpen %fn %ws:* %BrackClose {% ([,a]) => ({ slug: a.value, args: {} }) %}

FunctionArgs ->
    RequiredArgs {% id %}
  | OptionalArgs {% id %}

RequiredArgs ->
    %argName {% ([a]) => ({ [a.text]: { required: true } }) %}
  | %argName %ws:* %comma %ws:* FunctionArgs {% ([a,,,,b]) => ({ [a.text]: { required: true }, ...b }) %}

OptionalArgs ->
    %argName %ws:* %assignment %ws:* Literal {% ([a,,,,b]) => ({ [a.text]: { required: false, default: b } }) %}
  | %argName %ws:* %assignment %ws:* Literal %ws:* %comma %ws:* OptionalArgs {% ([a,,,,b,,,,c]) => ({ [a.text]: { required: false, default: b }, ...c }) %}
