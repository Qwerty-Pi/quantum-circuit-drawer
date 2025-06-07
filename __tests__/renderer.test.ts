import { Circuit } from "../src/Circuit";
import { HadamardGate } from "../src/gates/HadamardGate";
import { Renderer } from "../src/Renderer";

jest.mock("@svgdotjs/svg.js");

describe("Renderer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clears previous drawings before redrawing", () => {
    const circuit = new Circuit(1);
    circuit.addGate(new HadamardGate(0));
    const renderer = new Renderer(circuit, "container");
    renderer.draw();
    const firstChildCount = renderer.svg.children().length;
    renderer.draw();
    expect(renderer.svg.children().length).toBe(firstChildCount);
  });
});
