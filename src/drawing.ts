import { Vector } from "./Vector";
import { colour } from "./config";

export type Ctx = CanvasRenderingContext2D;

export function drawLine(ctx: Ctx, from: Vector, to: Vector) {
  ctx.beginPath(); // Start a new path
  ctx.moveTo(from.x, from.y); // Move the pen to (30, 50)
  ctx.lineTo(to.x, to.y); // Draw a line to (150, 100)
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.stroke(); // Render the path
}

export function drawCircle(ctx: Ctx, point: Vector) {
  const { x, y } = point;

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = colour;
  ctx.fill();
}
