/**
 * @file MeasurementGate.ts
 * @description Defines the MeasurementGate class, representing a measurement operation in a quantum circuit.
 */

import { IGate } from "./IGate";

/**
 * Represents a measurement operation on a qubit.
 *
 * @implements {IGate}
 *
 * @example
 * ```typescript
 * const mGate = new MeasurementGate(0); // Measure qubit 0
 * circuit.addGate(mGate);
 * ```
 */
export class MeasurementGate implements IGate {
  /**
   * The name of the gate used for display.
   * @readonly
   */
  name = "M";

  /**
   * Array containing the index of the qubit being measured.
   */
  qubits: number[];

  /**
   * Creates a new MeasurementGate instance.
   *
   * @param qubit - The index of the qubit to measure.
   *
   * @throws {Error} If the qubit index is negative.
   */
  constructor(qubit: number | number[]) {
    if (typeof qubit === "number") {
      if (qubit < 0) {
        throw new Error("Qubit index must be a non-negative integer.");
      }
      this.qubits = [qubit];
    } else {
      this.qubits = qubit;
    }
  }
}
