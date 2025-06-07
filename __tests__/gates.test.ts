import { HadamardGate } from "../src/gates/HadamardGate";
import { PauliXGate } from "../src/gates/PauliXGate";
import { PauliYGate } from "../src/gates/PauliYGate";
import { PauliZGate } from "../src/gates/PauliZGate";
import { RotationGate } from "../src/gates/RotationGate";
import { CNOTGate } from "../src/gates/CNOTGate";

const singleQubitGates: Array<[new (qubit: number) => any, string]> = [
  [HadamardGate, "H"],
  [PauliXGate, "X"],
  [PauliYGate, "Y"],
  [PauliZGate, "Z"],
];

describe("Single qubit gates", () => {
  it.each(singleQubitGates)("%p validates qubit index", (Gate) => {
    expect(() => new Gate(-1)).toThrow("non-negative");
    expect(() => new Gate(0.5)).toThrow("non-negative");
  });

  it.each(singleQubitGates)("%p sets name and qubits", (Gate, name) => {
    const gate = new Gate(1);
    expect(gate.name).toBe(name);
    expect(gate.qubits).toEqual([1]);
  });
});

describe("RotationGate", () => {
  it("validates axis", () => {
    // @ts-expect-error testing runtime validation
    expect(() => new RotationGate("A", 0, Math.PI)).toThrow("Axis must");
  });
  it("validates qubit index", () => {
    expect(() => new RotationGate("X", -1, Math.PI)).toThrow("non-negative");
  });
  it("constructs correctly", () => {
    const gate = new RotationGate("X", 0, Math.PI / 2);
    expect(gate.name).toBe("RX(90.0°)");
    expect(gate.qubits).toEqual([0]);
    expect(gate.angle).toBeCloseTo(Math.PI / 2);
  });
});

describe("CNOTGate", () => {
  it("validates qubits", () => {
    expect(() => new CNOTGate(0, 0)).toThrow("must be different");
    expect(() => new CNOTGate(-1, 0)).toThrow("non-negative");
    expect(() => new CNOTGate(0.5, 1)).toThrow("non-negative");
  });
  it("constructs correctly", () => {
    const gate = new CNOTGate(0, 1);
    expect(gate.name).toBe("CNOT");
    expect(gate.qubits).toEqual([0, 1]);
  });
});
