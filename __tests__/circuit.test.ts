import { Circuit } from "../src/Circuit";
import { HadamardGate } from "../src/gates/HadamardGate";
import { MeasurementGate } from "../src/gates/MeasurementGate";

describe("Circuit constructor", () => {
  it("validates number of qubits", () => {
    expect(() => new Circuit(0)).toThrow("positive integer");
    expect(() => new Circuit(-1)).toThrow("positive integer");
    expect(() => new Circuit(1.5)).toThrow("positive integer");
  });
});

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

  it("supports adding a measurement gate", () => {
    const circuit = new Circuit(1);
    const gate = new MeasurementGate(0);
    circuit.addGate(gate);
    expect(circuit.gates[0].name).toBe("M");
  });
});
