import { IGate } from "./IGate";

export class CXGate implements IGate {
  name = "CX";
  qubits: number[];

  constructor(controlQubit: number, targetQubit: number) {
    if (controlQubit === targetQubit) {
      throw new Error("Control qubit and target qubit must be different.");
    }
    if (
      !Number.isInteger(controlQubit) ||
      !Number.isInteger(targetQubit) ||
      controlQubit < 0 ||
      targetQubit < 0
    ) {
      throw new Error("Qubit indices must be non-negative integers.");
    }
    this.qubits = [controlQubit, targetQubit];
  }
}
