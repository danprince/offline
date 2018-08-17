import components from "./components";

export function build(configs) {
  let entities = [];

  for (let config of configs) {
    let template = components[config.id] || {};
    let entity = Object.assign({}, template);

    if (template == null) {
      console.warn(`Missing component: ${config.id}`);
      continue;
    }

    // TODO: Should we copy the whole config into entity?
    entity.position = { x: config.x, y: config.y };
    if (config.path) entity.path = config.path;

    entities.push(entity);
  }

  return entities;
}
