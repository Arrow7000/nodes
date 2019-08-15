import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";
import { Node } from "./Node";
import { Edge, getRepulsion } from "./Edge";
import { drawLine, Ctx, drawCircle } from "./drawing";
import { allCombinations, notNull } from "./helpers";

const { max } = Math;

// Constants
const connectedLength = 250;
const friction = 0.002;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as Ctx;

let nodes: Node[] = [];
const getCanvasEnd = () => new Vector(ctx.canvas.width, ctx.canvas.height);
let canvasArea = 0;

function cullOutsideNodes() {
  nodes = nodes.filter(
    node =>
      getRectanglePosition(node.position, [Vector.origin, getCanvasEnd()]) ===
      Pos.Inside
  );
}

function sizeCanvasToWindow() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  canvasArea = new Vector(
    max(connectedLength, width),
    max(connectedLength, height)
  ).area;

  // canvasArea = getCanvasEnd().area;

  cullOutsideNodes();
}

sizeCanvasToWindow();

ctx.imageSmoothingEnabled = true;

const range = <T>(length: number, mapper: (i: number) => T) =>
  Array.from({ length }).map((_, i) => mapper(i));

const rand = (max: number) => Math.random() * max;
const makeVector = () =>
  new Vector(rand(getCanvasEnd().x), rand(getCanvasEnd().y));

nodes = range(30, () => new Node(makeVector()));

window.onresize = sizeCanvasToWindow;

canvas.addEventListener("click", e => {
  const wiggle = 20;
  const wiggleRoom = () => Math.random() * wiggle - wiggle / 2;

  const location = new Vector(e.clientX, e.clientY);
  if (nodes.filter(n => n.position.isEqual(location)).length < 1) {
    const newLoc = location.add(new Vector(wiggleRoom(), wiggleRoom()));

    nodes.push(new Node(newLoc));
  }
});

canvas.addEventListener("contextmenu", e => {
  e.preventDefault();

  const location = new Vector(e.clientX, e.clientY);
  const localNodes = nodes.filter(
    node => node.position.distanceTo(location) < connectedLength
  );

  nodes = nodes.filter(node => !localNodes.includes(node));
});

function removeExcessNodes() {
  const allowedNodesCount =
    (canvasArea / (Math.PI * (connectedLength / 2) ** 2)) * 3;
  const excessNodes = nodes.length - allowedNodesCount;

  if (excessNodes > 0) {
    nodes = nodes.slice(1, nodes.length); // delete the first ones first, FIFO
  }
}

function onFrame(counter: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (counter % 60 === 0) {
    // only clear every second
    removeExcessNodes();
    cullOutsideNodes();
  }

  const edges = allCombinations(nodes, (a, b) => {
    const distance = a.position.distanceTo(b.position);
    return distance < connectedLength ? new Edge(a, b) : null;
  });

  edges.filter(notNull).forEach(({ a, b }) => {
    const repulsion = getRepulsion(a.position, b.position, connectedLength);

    a.accelerate(repulsion.a);
    b.accelerate(repulsion.b);

    drawLine(ctx, a.position, b.position);
  });

  nodes.forEach(node => {
    drawCircle(ctx, node.position);

    node.wallBounce([Vector.origin, getCanvasEnd()]);
    node.proportionalFriction(friction);
    node.momentumMove();
  });

  requestAnimationFrame(() => onFrame(counter + 1));
}

// Start it off
onFrame(0);
