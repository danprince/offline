let get = selector => document.querySelector(selector);
let html = (element, str) => element.innerHTML = str;

let attr = (element, attr, value) => {
  if (value == null) {
    return element.getAttribute(attr);
  } else {
    return element.setAttribute(attr, value);
  }
}

export let nodes = {
  body: document.body,
  root: get("#root"),
  canvas: get("#canvas"),
  showcase: get("#showcase"),
  testInput: get("#test-input")
}

export let setMode = mode => attr(nodes.body, "x-mode", mode);
export let setLevel = level => attr(nodes.body, "x-level", level);
export let setCursor = cursor => canvas.style.cursor = cursor;
export let getTestInput = () => nodes.testInput.value;

export function showcase(selector) {
  let element = get(selector);
  let { offsetLeft: l, offsetTop: t } = element;
  let { clientWidth: w, clientHeight: h } = element;
  let x = l + w / 2;
  let y = t + h / 2;

  nodes.showcase.style.display = "block";

  setTimeout(() =>
    nodes.showcase.style.transform = `translate(${x}px, ${y}px)`
  );
};

export function hideShowcase() {
  nodes.showcase.style.display = "none";
}

// Showcasing

window.onmouseover = event => {
  let selector = attr(event.target, "x-showcase");
  if (selector) showcase(selector);
};

window.onmouseout = event => {
  let selector = attr(event.target, "x-showcase");
  if (selector) hideShowcase(selector);
};

