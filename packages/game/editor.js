import * as sim from "./simulation";
import * as runner from "./runner";
import * as events from "./events";
import * as view from "./view";
import components from "./components";

export const id = "editor";

let editor = {
  grabbed: null,
  selected: null,
  hovered: null
};

export let grabbed = () => editor.grabbed;
export let selected = () => editor.selected;
export let hovered = () => editor.hovered;

export function exit() {
  editor.grabbed = null;
  editor.selected = null;
  editor.hovered = null;
}

export function shortcut(event) {
  switch (event.which) {
    case 8: remove(); break;
  }
}

export function click() {
  let cursor = events.toGrid(event);
  let entity = sim.entityAt(cursor);

  if (entity && entity.interactive) {
    editor.selected = entity;
  } else {
    editor.selected = null;
  }
}

export function hover(event) {
  let cursor = events.toGrid(event);
  let entity = sim.entityAt(cursor);

  sim.setCursor(cursor);

  if (entity) {
    if (entity.interactive) {
      editor.hovered = entity;
      view.setCursor("pointer");
    } else {
      view.setCursor("not-allowed");
    }
  } else {
    editor.hovered = null
    view.setCursor("");
  }
}

export function mousedown(event) {
  let cursor = events.toGrid(event);
  let entity = sim.entityAt(cursor);
  if (entity) grab(entity);
}

export function mouseup(event) {
  let cursor = events.toGrid(event);
  let entity = grabbed();
  if (entity) drop(entity, cursor);
}

export function grab(entity) {
  if (entity.interactive) {
    editor.grabbed = entity;
  }
}

export function drop(entity, at) {
  entity.position = at;
  editor.grabbed = null;
}

export function run() {
  sim.mode(runner);
}

export function add(event) {
  let id = event.target.getAttribute("x-id");
  let template = components[id];

  let entity = Object.assign({}, template);
  entity.position = { x: -1, y: -1 };

  sim.add(entity);
  editor.grabbed = entity;
}

export function remove() {
  let entity = editor.selected;
  if (entity) sim.remove(entity);
}

