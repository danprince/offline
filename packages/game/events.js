import * as config from "./config";

export function register(dispatch) {
  let call = attr => event => {
    let name = event.target.getAttribute(attr);
    if (name) dispatch(name, event);
  };

  window.onclick = call("x-click");
  window.onmousedown = call("x-mousedown");
  window.onmouseup = call("x-mouseup");
  window.onkeydown = call("x-keydown");
  window.onmousemove = call("x-mousemove");
}

export function toScreen(event) {
  let rect = event.target.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

export function toGrid(event) {
  let { x, y } = toScreen(event);

  return {
    x: Math.round(x / config.UNIT_WIDTH),
    y: Math.round(y / config.UNIT_HEIGHT)
  };
}
