import { Circuit } from "../src/Circuit";
import { HadamardGate } from "../src/gates/HadamardGate";

describe("Circuit.addGate validation", () => {
  it("throws an error if qubit index is out of range", () => {
    const circuit = new Circuit(1);
    const gate = new HadamardGate(1);
    expect(() => circuit.addGate(gate)).toThrow("Invalid qubit index");
  });

  it("allows valid qubit indices", () => {
    const circuit = new Circuit(1);
    const gate = new HadamardGate(0);
    expect(() => circuit.addGate(gate)).not.toThrow();
    expect(circuit.gates.length).toBe(1);
  });
});
