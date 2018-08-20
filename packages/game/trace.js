import { STOP, LEFT, RIGHT, UP, DOWN, GRID_WIDTH, GRID_HEIGHT } from "./config";
import * as sim from "./simulation";

function trace(entity) {
  let path = [];
  let search = [];
  let map = hashmap();
  let visited = new Set();

  let position = entity.position;
  let direction = entity.move;

  for (let entity of sim.entities()) {
    map.set(entity.position, entity);
  }

  let origin = { position, direction };
  origin.from = origin;
  search.push(origin);

  while (search.length) {
    let node = search.pop();
    let entity = map.get(node.position);
    let { position, direction } = node;
    let { x, y } = position;

    if (x < 0 || y < 0 || x > GRID_WIDTH || y > GRID_HEIGHT) {
      continue;
    }

    path.push(node);

    if (visited.has(entity)) {
      continue;
    }

    if (entity) {
      if ("path" in entity) direction = entity.path;
      visited.add(entity);
    }

    if (direction === STOP) continue;
    if (direction & LEFT) search.push({ position: { x: x - 1, y }, direction: LEFT, from: node });
    if (direction & RIGHT) search.push({ position: { x: x + 1, y }, direction: RIGHT, from: node });
    if (direction & UP) search.push({ position: { x, y: y - 1 }, direction: UP, from: node });
    if (direction & DOWN) search.push({ position: { x, y: y + 1 }, direction: DOWN, from: node });
  }

  return {
    path,
    entities: visited.size
  }
}

function hash({ x, y }) {
  return x << 16 | y;
}

function hashmap() {
  let map = {};

  return {
    set: (pos, entity) => map[hash(pos)] = entity,
    get: pos => map[hash(pos)]
  }
}

export default trace
