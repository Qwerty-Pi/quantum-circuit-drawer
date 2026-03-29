/**
 * @file CNOTGate.ts
 * @description Defines the CZGate class, representing a Controlled-Z (CZ) gate in a quantum circuit.
 */

import { IGate } from "./IGate";

/**
 * Represents a Controlled-Z (CZ) gate in a quantum circuit.
 * The CNOT gate phase flips the target qubit if the control qubit is in the |1⟩ state.
 *
 * @implements IGate
 *
 * @example
 * ```typescript
 * // Create a CZ gate with control qubit 0 and target qubit 1
 * const czGate = new CZGate(0, 1);
 * circuit.addGate(czGate);
 * ```
 */
export class CZGate implements IGate {
  /**
   * The name of the gate, used for display and identification.
   * @readonly
   */
  name = "CZ";

  /**
   * An array containing the indices of the control and target qubits.
   * The first element is the control qubit, and the second is the target qubit.
   */
  qubits: number[];

  /**
   * Creates an instance of the CNOTGate class.
   *
   * @param controlQubit - The index of the control qubit.
   * @param targetQubit - The index of the target qubit.
   *
   * @throws {Error} Will throw an error if the control and target qubits are the same.
   *
   * @example
   * ```typescript
   * const czGate = new CZGate(0, 1); // Control qubit: 0, Target qubit: 1
   * ```
   */
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
