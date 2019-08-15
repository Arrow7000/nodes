import { Vector, Rectangle } from "./Vector";
import { Node } from "./Node";
import { Edge, getRepulsion } from "./Edge";
import { drawLine, Ctx, drawCircle } from "./drawing";
import { allCombinations, notNull } from "./helpers";

// Constants
const connectedLength = 100;
const friction = 0.01;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function sizeCanvasToWindow() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
}

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const getCanvasRect = (): Rectangle => [
  new Vector(0, 0),
  new Vector(ctx.canvas.width, ctx.canvas.height)
];

ctx.imageSmoothingEnabled = true;

const range = <T>(length: number, mapper: (i: number) => T) =>
  Array.from({ length }).map((_, i) => mapper(i));

const rand = (max: number) => Math.random() * max;
const makeVector = () =>
  new Vector(rand(ctx.canvas.width), rand(ctx.canvas.height));

let nodes: Node[] = range(10, () => new Node(makeVector()));

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
    node => node.position.distanceTo(location) < connectedLength * 2
  );

  nodes = nodes.filter(node => !localNodes.includes(node));
});

function onFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    node.wallBounce(getCanvasRect());
    node.proportionalFriction(friction);
    node.momentumMove();
  });

  requestAnimationFrame(onFrame);
}

sizeCanvasToWindow();
onFrame();
