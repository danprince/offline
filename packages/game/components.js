import { PASS, STOP, LEFT, RIGHT, UP, DOWN } from "./config";

export default {
  left: {
    label: "←",
    behaviours: ["move"],
    interactive: true,
    color: "grey",
    path: LEFT
  },

  right: {
    label: "→",
    behaviours: ["move"],
    interactive: true,
    color: "grey",
    path: RIGHT
  },

  down: {
    label: "↓",
    behaviours: ["move"],
    interactive: true,
    color: "grey",
    path: DOWN
  },

  up: {
    label: "↑",
    behaviours: ["move"],
    interactive: true,
    color: "grey",
    path: UP
  },

  stop: {
    label: "X",
    behaviours: ["move"],
    interactive: true,
    color: "grey",
    path: STOP
  },

  input: {
    label: "IN",
    color: "grey",
    behaviours: ["move"]
  },

  output: {
    label: "OUT",
    color: "green",
    behaviours: ["remove"],
    path: STOP
  },

  register_a: {
    label: "A",
    color: "#f71f7e",
    register: "a",
    behaviours: ["store"],
    interactive: true,
  },

  register_b: {
    label: "B",
    color: "#f71f7e",
    register: "b",
    behaviours: ["store"],
    interactive: true,
  },

  register_c: {
    label: "C",
    color: "#f71f7e",
    register: "c",
    behaviours: ["store"],
    interactive: true,
  },

  register_d: {
    label: "D",
    color: "#f71f7e",
    register: "d",
    behaviours: ["store"],
    interactive: true,
  },

  lt: {
    label: "<",
    color: "blue",
    behaviours: ["test"],
    interactive: true,
    path: UP | DOWN,
    condition: { op: "<", value: 0 },
  },

  gt: {
    label: ">",
    color: "blue",
    behaviours: ["test"],
    interactive: true,
    path: UP | DOWN,
    condition: { op: ">", value: 0 },
  },

  eq: {
    label: "=",
    color: "blue",
    behaviours: ["test"],
    interactive: true,
    path: UP | DOWN,
    condition: { op: "=", value: 0 },
  },

  neq: {
    label: "!=",
    color: "blue",
    behaviours: ["test"],
    interactive: true,
    path: UP | DOWN,
    condition: { op: "!=", register: "A" },
  },

  inc: {
    label: "+",
    color: "orange",
    behaviours: ["increment"],
    interactive: true,
  },
}
