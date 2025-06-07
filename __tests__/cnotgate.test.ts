import { CNOTGate } from "../src/gates/CNOTGate";

describe("CNOTGate validation", () => {
  it("throws an error when control and target qubit are the same", () => {
    expect(() => new CNOTGate(0, 0)).toThrow(
      "Control qubit and target qubit must be different."
    );
  });

  it("throws an error when qubit index is negative", () => {
    expect(() => new CNOTGate(-1, 0)).toThrow(
      "Qubit indices must be non-negative integers."
    );
  });
});
