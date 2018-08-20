import * as config from "./config";
import * as view from "./view";
import * as sim from "./simulation";
import * as editor from "./editor";
import trace from "./trace";
import createDriver from "./driver";

let canvas = view.nodes.canvas;
let ctx = canvas.getContext("2d");

// Initialize canvas and context

canvas.width = config.GRID_WIDTH * config.UNIT_WIDTH;
canvas.height = config.GRID_HEIGHT * config.UNIT_HEIGHT;

ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `${config.FONT_SIZE}px Monaco, Consolas, monospace`;

// Shortcut variables

let uw = config.UNIT_WIDTH;
let uh = config.UNIT_HEIGHT;
let gw = config.GRID_WIDTH;
let gh = config.GRID_HEIGHT;

export let driver = createDriver(render);

// Renderers

export function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderGrid();
  renderZones();
  renderWires();

  sim.packets().forEach(renderPacket);
  sim.entities().forEach(renderEntity);

  let grabbed = editor.grabbed();

  if (grabbed) {
    let clone = Object.assign({}, grabbed);
    clone.position = sim.cursor();
    renderEntity(clone);
  }
}

export function renderGrid() {
  ctx.beginPath();

  for (let x = 1; x < gw; x++) {
    ctx.moveTo(x * uw, 0);
    ctx.lineTo(x * uw, gh * uh);
  }

  for (let y = 1; y < gh; y++) {
    ctx.moveTo(0, y * uh);
    ctx.lineTo(gw * uw, y * uh);
  }

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function renderZones() {
  // Will eventually come from the simulation instead
  let zone = { x: 1, y: 1, w: 14, h: 8 };

  ctx.fillStyle = "rgba(100, 100, 100, .1)";
  ctx.strokeStyle = "rgba(100, 100, 100, .2)";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.rect(zone.x * uw, zone.y * uh, zone.w * uw, zone.h * uh);
  ctx.fill();
  ctx.stroke();
}

// TODO: Path is correct. Renderer is wrong, try drawing as multiple paths?
export function renderWires() {
  // TODO: Store stats on sim after editor changes rather than computing?
  let { path } = trace(sim.entities()[0]);

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -driver.ticks() / 4;
  ctx.lineWidth = 3;

  ctx.beginPath();

  for (let node of path) {
    let { x, y } = node.position;

    if (node.from) {
      let from = node.from;
      ctx.moveTo(from.position.x * uw, from.position.y * uh);
    }

    ctx.lineTo(node.position.x * uw, y * uh);
  }

  ctx.stroke();
  ctx.restore();
}

export function renderEntity(entity) {
  let grabbed = editor.grabbed() === entity;
  let hovered = editor.hovered() === entity;
  let selected = editor.selected() === entity;

  ctx.save();
  ctx.translate(entity.position.x * uw, entity.position.y * uh);

  if (grabbed) {
    ctx.globalAlpha = 0.3;
  }

  if (hovered || grabbed) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(-uw / 2, -uh / 2, uw, uh);
  }

  if (selected) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.strokeRect(-uw / 2, -uh / 2, uw, uh);
  }

  if (entity.color) {
    ctx.strokeStyle = ctx.fillStyle = entity.color;
    ctx.strokeRect(-20, -20, 40, 40);
    ctx.fillRect(-10, -10, 20, 20);
  }

  if (entity.label) {
    ctx.fillStyle = "white";
    ctx.fillText(entity.label, 0, 0);
  }

  if (entity.condition) {
    let { value, register } = entity.condition;
    let label = "";

    if (register) {
      ctx.fillStyle = "#f71f7e";
      label = register;
    } else {
      label = entity.condition.value.toString(16).toUpperCase();
      ctx.fillStyle = entity.color;
    }

    renderLabel(label, 0, 20);
  }

  if (entity.breakpoint) {
    ctx.strokeStyle = ctx.fillStyle = "blue";
    ctx.strokeRect(-uw / 2, -uh / 2, uw, uh);
    renderLabel("BRK", 0, -20);
  }

  if (entity.register) {
    ctx.fillStyle = entity.color;
    let value = sim.read(entity.register);
    let hex = value.toString(16).toUpperCase();
    renderLabel(hex, 0, 20);
  }

  ctx.restore();
}

export function renderPacket(packet) {
  let hex = packet.value.toString(16).toUpperCase();

  ctx.save();
  ctx.translate(packet.position.x * uw, packet.position.y * uh);

  ctx.fillStyle = "rgba(100, 100, 100, 0.2)";
  ctx.strokeStyle = "rgb(100, 100, 100)";
  ctx.fillRect(-15, -15, 30, 30);
  ctx.fillStyle = "white";
  ctx.fillText(hex, 0, 0);

  ctx.restore();
}

export function renderLabel(label, x, y) {
  let w = label.length * config.FONT_SIZE * 0.7;
  let h = config.FONT_SIZE + 4;

  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  ctx.lineTo(w / 2 + 8, 0);
  ctx.lineTo(w / 2, h / 2);
  ctx.lineTo(-w / 2, h / 2);
  ctx.lineTo(-w / 2 - 8, 0);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.fillText(label, 0, 0);

  ctx.restore();
}

