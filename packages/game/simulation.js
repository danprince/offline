import * as config from "./config";
import * as view from "./view";
import * as factory from "./factory";
import createDriver from "./driver";

export let driver = createDriver(update, 100);

export let sim = {
  level: 0,
  system: {},
  entities: [],
  packets: [],
  inputs: [],
  outputs: [],
  registers: { a: 0, b: 0, c: 0, d: 1 },
  cursor: null,
};

export let entities = () => sim.entities;
export let packets = () => sim.packets;
export let read = id => sim.registers[id];
export let write = (id, val) => sim.registers[id] = val;
export let cursor = () => sim.cursor;

export function mode(system) {
  dispatch("exit");
  sim.system = system;
  view.setMode(system.id);
  dispatch("enter");
}

export function dispatch(type, event) {
  let { system } = sim;

  if (type in system) {
    system[type](event);
  }
}

export function update() {
  dispatch("update");
}

export function entityAt({ x, y }) {
  return sim.entities.find(entity =>
    entity.position.x === x &&
    entity.position.y === y
  );
}

export function add(entity) {
  sim.entities.push(entity);
}

export function remove(entity) {
  sim.entities = sim.entities.filter(e => e !== entity);
}

export function clear() {
  reset();
  sim.entities = [];
}

export function reset() {
  sim.packets = [];
  sim.inputs = [];
  sim.outputs = [];

  for (let k in sim.registers) {
    sim.registers[k] = 0;
  }
}

export function flush() {
  sim.packets = [];
}

export function clone(packet) {
  let clone = Object.assign({}, packet);
  sim.packets.push(clone);
  return clone;
}

export function spawn(packet) {
  sim.packets.push(packet);
}

export function setCursor(cursor) {
  sim.cursor = cursor;
}

export function level(index) {
  let level = config.LEVELS[index];
  clear();
  sim.inputs = level.inputs;
  sim.outputs = level.outputs;
  sim.entities = factory.build(level.components);
  view.setLevel(index);
}

