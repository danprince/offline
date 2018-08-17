import { STOP, LEFT, RIGHT, UP, DOWN, GRID_WIDTH, GRID_HEIGHT } from "./config";
import * as sim from "./simulation";

function trace(entity) {
  let entities = sim.entities();
  let map = {};
  let path = [];
  let search = [];
  let visited = new Set();

  for (let entity of sim.entities()) {
    map[hash(entity.position)] = entity;
  }

  search.push({
    position: entity.position,
    direction: entity.path,
    split: false
  });

  while (search.length > 0) {
    let node = search.pop();
    let direction = node.direction;
    let position = node.position;
    let entity = map[hash(position)];
    let split = false;

    path.push(node);

    if (entity) {
      if (visited.has(entity)) {
        continue;
      } else {
        visited.add(entity);
        if (entity.path >= 0) {
          direction = entity.path;
        }
      }
    }

    if (direction !== node.direction) {
      split = true;
    }

    let { x, y } = position;

    if (direction === STOP || x < 0 || y < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT) {
      continue;
    }

    if (direction & LEFT) {
      search.push({ direction: LEFT, position: { x: x - 1, y }, split });
    }

    if (direction & RIGHT) {
      search.push({ direction: RIGHT, position: { x: x + 1, y }, split });
    }

    if (direction & UP) {
      search.push({ direction: UP, position: { x, y: y - 1 }, split });
    }

    if (direction & DOWN) {
      search.push({ direction: DOWN, position: { x, y: y + 1 }, split });
    }
  }

  return {
    path,
    entities: Array.from(visited)
  }
}

function hash({ x, y }) {
  return x << 16 | y;
}

export default trace
