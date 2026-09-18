/** A small whole-question calculator, never executable user input. */
export function arithmeticReply(question: string) {
  const match = question.trim().match(/^(?:(?:what(?:['’]?s| is)|calculate|compute|solve)\s+)?([+-]?\d+(?:\.\d+)?)\s*(\+|-|\*|\/|×|÷|plus|minus|times|multiplied by|divided by)\s*([+-]?\d+(?:\.\d+)?)\s*(?:=\s*\??|[?!.])?$/i);
  if (!match) return undefined;
  const a = Number(match[1]), b = Number(match[3]);
  if (Math.abs(a) > 1e12 || Math.abs(b) > 1e12) return undefined;
  const op = match[2].toLowerCase();
  const divide = ["/", "÷", "divided by"].includes(op);
  const value = ["+", "plus"].includes(op) ? a + b
    : ["-", "minus"].includes(op) ? a - b
    : divide ? a / b : a * b;
  const text = divide && b === 0 ? "Division by zero is undefined."
    : Number.isFinite(value) ? `${Number(value.toPrecision(12))} 😄` : "That result is too large for this quick calculator.";
  return { paragraphs: [text], sources: [], suggestions: [], mode: "arithmetic" };
}
