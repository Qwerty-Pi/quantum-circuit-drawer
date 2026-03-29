/**
 * @file Renderer.ts
 * @description Handles the rendering of quantum circuits onto an SVG canvas using svg.js.
 */

import { Circuit } from "./Circuit";
import { IGate } from "./gates/IGate";
import { SVG, Svg } from "@svgdotjs/svg.js";
import { StyleConfig, DefaultStyleConfig } from "./styles";

/**
 * The Renderer class is responsible for visualizing a quantum circuit on an SVG canvas.
 * It takes a Circuit object and renders the qubits, gates, and connections according to the specified styles.
 */
export class Renderer {
  /**
   * The quantum circuit to be rendered.
   */
  circuit: Circuit;

  /**
   * The SVG canvas where the circuit will be drawn.
   */
  svg: Svg;

  /**
   * The styling configuration for rendering the circuit.
   */
  styles: StyleConfig;

  /**
   * Status of the lines.
   */
  lineStatus: number[];

  /**
   * Creates a new Renderer instance.
   * @param circuit - The Circuit object representing the quantum circuit to render.
   * @param containerId - The ID of the HTML element where the SVG canvas will be added.
   * @param styles - (Optional) Custom styles to override the default rendering styles.
   *
   * @example
   * ```typescript
   * const circuit = new Circuit(2);
   * const renderer = new Renderer(circuit, 'circuit-container', { gateFill: '#e0f7fa' });
   * renderer.draw();
   * ```
   */
  constructor(
    circuit: Circuit,
    containerId: string,
    styles?: Partial<StyleConfig>
  ) {
    this.circuit = circuit;
    this.svg = SVG().addTo(`#${containerId}`).size("100%", "100%");
    this.styles = { ...DefaultStyleConfig, ...styles };
    this.lineStatus = Array()
    this.resetLineStatus();
  }

  /**
   * Reset line status.
   */
  resetLineStatus() {
    this.lineStatus = Array(this.circuit.numQubits)
    this.lineStatus.fill(1)
  }

  /**
   * Draw a normal single line.
   */
  drawSingleLine(x1: number, y1: number, x2: number, y2: number) {
    const { lineWidth, lineColor } = this.styles;
    this.svg
      .line(x1, y1, x2, y2)
      .stroke({ width: lineWidth, color: lineColor });
  }

  /**
   * Draw a double line with style.
     Require either x1 == x2 or y1 == y2 for double to look good.
   */
  drawDoubleLine(x1: number, y1: number, x2: number, y2: number) {
    const { lineWidth } = this.styles;
    const gap = lineWidth;
    if (x1 == x2) {
      this.drawSingleLine(x1 - gap, y1, x2 - gap, y2);
      this.drawSingleLine(x1 + gap, y1, x2 + gap, y2);
    } else {
      this.drawSingleLine(x1, y1 - gap, x2, y2 - gap);
      this.drawSingleLine(x1, y1 + gap, x2, y2 + gap);
    }
  }

  /**
   * Draw a line. Change to enum?
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, type: number) {
    if (type == 1) {
      this.drawSingleLine(x1, y1, x2, y2);
    } else if (type == 2) {
      this.drawDoubleLine(x1, y1, x2, y2);
    }
  }

  /**
   * Draw a dot at the conjunction.
   */
  drawDot(x: number, y: number) {
    const { lineColor } = this.styles;
    this.svg
      .circle(12)
      .center(x, y)
      .fill(lineColor);
  }

  /**
   * Draw a rectangle for the gate.
   */
  drawGateRect(x: number, y: number) {
    const { gateWidth, gateHeight, gateFill, gateStroke, gateStrokeWidth } = this.styles;
    this.svg
      .rect(gateWidth, gateHeight)
      .fill(gateFill)
      .stroke({ width: gateStrokeWidth, color: gateStroke })
      .center(x, y);
  }

  drawGateLabel(x: number, y: number, label: string) {
    const { fontSize, fontFamily, fontColor, gateHeight } = this.styles
    this.svg
      .text(label)
      .font({ size: fontSize, family: fontFamily, fill: fontColor })
      .attr({ "text-anchor": "middle", "dominant-baseline": "middle" })
      .center(x, y)
  }

  /**
   * Renders the quantum circuit onto the SVG canvas.
   * This method iterates over the qubits and gates in the circuit and draws them using SVG elements.
   */
  draw(): void {
    const { numQubits, gates } = this.circuit;
    const {
      qubitSpacing,
      gateSpacing,
      gateHeight,
    } = this.styles;

    const totalHeight = qubitSpacing * (numQubits + 1);
    const totalWidth = gateSpacing * (gates.length + 1);

    this.svg.size(totalWidth, totalHeight);
    this.svg.clear();

    for (let gateIndex = 0; gateIndex < gates.length + 1; gateIndex++) {
      // horizontal lines for qubits.
      for (let i = 0; i < numQubits; i++) {
        const y = qubitSpacing * (i + 1);
        this.drawLine(gateSpacing * gateIndex, y, gateSpacing * (gateIndex + 1), y, this.lineStatus[i]);
      }

      if (gateIndex == gates.length) {
        break;
      }

      // process the gate t.
      const gate = gates[gateIndex];
      if (gate.name === "M") {
        gate.qubits.forEach((qubit) => {
          this.lineStatus[qubit] = 2; // becomes classical
        })
      }
    }

    this.resetLineStatus()
    for (let gateIndex = 0; gateIndex < gates.length; gateIndex++) {
      const gate = gates[gateIndex];
      const x = gateSpacing * (gateIndex + 1);
      if (gate.name === "CNOT") {
        this.drawCNOTGate(gate, x);
      } else if (gate.name == "CX") {
        this.drawCXGate(gate, x);
      } else if (gate.name == "CZ") {
        this.drawCZGate(gate, x);
      } else if (gate.name.startsWith("R")) {
        this.drawRotationGate(gate, x);
      } else if (gate.name === "M") {
        this.drawMeasurementGate(gate, x);
        gate.qubits.forEach((qubit) => {
          this.lineStatus[qubit] = 2; // becomes classical
        })
      } else {
        gate.qubits.forEach((qubit) => {
          const y = qubitSpacing * (qubit + 1);
          this.drawGateRect(x, y);
          this.drawGateLabel(x, y, gate.name);
        });
      }
    }
  }

  private drawCNOTGate(gate: IGate, x: number): void {
    const { qubitSpacing, gateStroke, gateStrokeWidth, lineColor, lineWidth, backgroundColor } =
      this.styles;
    const controlQubit = gate.qubits[0];
    const targetQubit = gate.qubits[1];
    const y1 = qubitSpacing * (controlQubit + 1);
    const y2 = qubitSpacing * (targetQubit + 1);

    // Draw the vertical line connecting the control and target qubits.
    this.drawLine(x, y1, x, y2, this.lineStatus[controlQubit]);

    // Draw the control dot
    this.drawDot(x, y1);

    // Draw the target qubit symbol (a circle with a plus sign inside).
    const gateSize = 20;
    this.svg
      .circle(gateSize)
      .move(x - gateSize / 2, y2 - gateSize / 2)
      .fill(backgroundColor)
      .stroke({ width: gateStrokeWidth, color: lineColor });

    // Draw the horizontal line of the plus sign.
    this.svg
      .line(x - gateSize / 2, y2, x + gateSize / 2, y2)
      .stroke({ width: gateStrokeWidth, color: lineColor });

    // Draw the vertical line of the plus sign.
    this.svg
      .line(x, y2 - gateSize / 2, x, y2 + gateSize / 2)
      .stroke({ width: gateStrokeWidth, color: lineColor });
  }
  
  private drawCZGate(gate: IGate, x: number): void {
    const { qubitSpacing } = this.styles;
    const controlQubit = gate.qubits[0];
    const targetQubit = gate.qubits[1];
    const y1 = qubitSpacing * (controlQubit + 1);
    const y2 = qubitSpacing * (targetQubit + 1);

    // Vertical line connecting the control and target qubits
    this.drawLine(x, y1, x, y2, this.lineStatus[controlQubit]);

    // Control dot
    this.drawDot(x, y1);

    // Draw Gate Z
    this.drawGateRect(x, y2);
    this.drawGateLabel(x, y2, "Z");
  }
  
  private drawCXGate(gate: IGate, x: number): void {
    const { qubitSpacing } = this.styles;
    const controlQubit = gate.qubits[0];
    const targetQubit = gate.qubits[1];
    const y1 = qubitSpacing * (controlQubit + 1);
    const y2 = qubitSpacing * (targetQubit + 1);

    // Vertical line connecting the control and target qubits
    this.drawLine(x, y1, x, y2, this.lineStatus[controlQubit]);

    // Control dot
    this.drawDot(x, y1);

    // Draw Gate X
    this.drawGateRect(x, y2);
    this.drawGateLabel(x, y2, "X");
  }

  /**
   * Draws a rotation gate (Rx, Ry, Rz) on the circuit.
   * @param gate - The IGate object representing the rotation gate.
   * @param x - The x-coordinate where the gate should be drawn.
   *
   * @remarks
   * Rotation gates are drawn as rectangles with the rotation axis and angle displayed as the label.
   */
  private drawRotationGate(gate: IGate, x: number): void {
    const {
      qubitSpacing,
      gateWidth,
      gateHeight,
      gateFill,
      gateStroke,
      gateStrokeWidth,
      fontSize,
      fontFamily,
      fontColor,
    } = this.styles;
    gate.qubits.forEach((qubit) => {
      const y = qubitSpacing * (qubit + 1) - gateHeight / 2;
      // Draw the gate rectangle.
      this.svg
        .rect(gateWidth, gateHeight)
        .move(x - gateWidth / 2, y)
        .fill(gateFill)
        .stroke({ width: gateStrokeWidth, color: gateStroke });
      // Draw the gate label with rotation information (e.g., Rx(90°)).
      this.svg
        .text(gate.name)
        .font({ size: fontSize - 2, family: fontFamily, fill: fontColor })
        .attr({ "text-anchor": "middle", "dominant-baseline": "middle" })
        .center(x, y + gateHeight / 2);
    });
  }

  /**
   * Draws a measurement gate on the circuit.
   * @param gate - The IGate object representing the measurement gate.
   * @param x - The x-coordinate where the gate should be drawn.
   */
  private drawMeasurementGate(gate: IGate, x: number): void {
    const {
      qubitSpacing,
      gateWidth,
      gateHeight,
      gateFill,
      gateStroke,
      gateStrokeWidth,
      fontSize,
      fontFamily,
      fontColor,
    } = this.styles;
    gate.qubits.forEach((qubit) => {
      const y = qubitSpacing * (qubit + 1) - gateHeight / 2;
      this.svg
        .rect(gateWidth, gateHeight)
        .move(x - gateWidth / 2, y)
        .fill(gateFill)
        .stroke({ width: gateStrokeWidth, color: gateStroke });
      this.svg
        .text("M")
        .font({ size: fontSize, family: fontFamily, fill: fontColor })
        .attr({ "text-anchor": "middle", "dominant-baseline": "middle" })
        .center(x, y + gateHeight / 2);
    });
  }
}
