export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 10;
export const UNIT_WIDTH = 48;
export const UNIT_HEIGHT = 48;
export const FONT_SIZE = 12;

// Movement Directions
export const STOP = 0;
export const LEFT = 1;
export const RIGHT = 2;
export const UP = 4;
export const DOWN = 8;

export const LEVELS = [
  {
    title: "Hello, World",
    message: `
      Press <a x-showcase="#run">run</a> to see what this program does.
    `,
    components: [
      { id: "input", x: 1, y: 3, path: RIGHT },
      { id: "output", x: 10, y: 7, path: STOP },
      { id: "eq", x: 6, y: 6 },
      { id: "down", x: 4, y: 3 },
      { id: "right", x: 4, y: 6 },
    ],
    test: {
      inputs: [1, 2, 3],
      outputs: [1, 2, 3]
    }
  }
];
