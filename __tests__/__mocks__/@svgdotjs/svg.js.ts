const chainable = () => ({
  move: jest.fn().mockReturnThis(),
  fill: jest.fn().mockReturnThis(),
  stroke: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  font: jest.fn().mockReturnThis(),
});

const mockSvg: any = {
  childrenArray: [] as any[],
  size: jest.fn().mockReturnThis(),
  clear: jest.fn(function () {
    mockSvg.childrenArray = [];
    return mockSvg;
  }),
  line: jest.fn(() => {
    mockSvg.childrenArray.push("line");
    return chainable();
  }),
  rect: jest.fn(() => {
    mockSvg.childrenArray.push("rect");
    return chainable();
  }),
  text: jest.fn(() => {
    mockSvg.childrenArray.push("text");
    return chainable();
  }),
  circle: jest.fn(() => {
    mockSvg.childrenArray.push("circle");
    return chainable();
  }),
  addTo: jest.fn(() => mockSvg),
  node: {
    get childElementCount() {
      return mockSvg.childrenArray.length;
    },
  },
  children: () => mockSvg.childrenArray,
};

export const SVG = jest.fn(() => mockSvg);
