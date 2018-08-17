import * as sim from "./simulation";
import * as editor from "./editor";
import * as events from "./events";
import { STOP, LEFT, RIGHT, UP, DOWN } from "./config";

export const id = "runner";

export function enter() {
  sim.reset();
}

export function exit() {
  sim.reset();
}

export function update() {
  let map = {};

  for (let entity of sim.entities()) {
    let { x, y } = entity.position;
    map[x] = map[x] || {};
    map[x][y] = entity;
  }

  for (let packet of sim.packets()) {
    if (packet.move) move(packet);

    let { x, y } = packet.position;
    let entity = map[x] && map[x][y];
    if (entity) interact(entity, packet);
  }
}

export function interact(entity, packet) {
  if (entity.breakpoint) {
    sim.driver.stop();
  }

  if (!entity.behaviours) return;

  for (let behaviour of entity.behaviours) {
    switch (behaviour) {
      case "move": packet.move = entity.path; break;
      case "remove": packet.active = false; break;
      case "store": sim.write(entity.register, packet.value); break;
      case "increment": packet.value += 1; break;

      case "test": {
        let passed = cond(entity.condition, packet.value);
        packet.move = passed ? UP : DOWN;
        break;
      }
    }
  }
}

export function move(packet) {
  let { x, y } = packet.position;

  if (packet.move & LEFT) x -= 1;
  if (packet.move & RIGHT) x += 1;
  if (packet.move & UP) y -= 1;
  if (packet.move & DOWN) y += 1;

  packet.position = { x, y };
}

export function cond(condition, value) {
  let a = value;

  let b = "value" in condition
    ? condition.value
    : sim.read(condition.register);

  switch (condition.op) {
    case "=": return a === b;
    case "!=": return a != b;
    case ">": return a > b;
    case "<": return a < b;
    default: return false;
  }
}

export function edit() {
  sim.driver.stop();
  sim.mode(editor);
}

export function step() {
  update();
}

export function run() {
  sim.driver.start();
}

export function reset() {
  sim.reset();
  sim.driver.stop();
  // TODO: clear all breakpoints
}

export function test() {
  let hex = view.getTestInput();
  let value = parseInt(hex, 16) || 0;
  // TODO: How do we know where to start this packet?
}

export function click(event) {
  let cursor = events.toGrid(event);
  let entity = sim.entityAt(cursor);
  if (entity) entity.breakpoint = !entity.breakpoint;
}
