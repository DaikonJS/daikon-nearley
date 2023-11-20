import nearley from "nearley";
import grammar from "./compiled/values.definition.cjs";

// const grammar = require("");

// Define the grammar for your expressions

// Create a function to parse an expression string
function parseValues(expression: string) {
  // console.log("Parsing expression:", expression);
  // Create a parser instance using the grammar
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar as any)
  );

  try {
    // Feed the expression string to the parser
    parser.feed(expression);

    // Get the parsed result as an AST
    const ast = parser.results[0];
    return ast;
  } catch (err: any) {
    throw new Error(`Syntax error: ${err.message}`);
  }
}

// Export the parseValues function
export { parseValues };
