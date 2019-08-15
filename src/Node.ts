import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";

const wiggle = 2;
const wiggleRoom = () => Math.random() * wiggle - wiggle / 2;

export class Node {
  public momentum = new Vector(wiggleRoom(), wiggleRoom());

  constructor(public position: Vector) {}

  private moveBy(v: Vector) {
    this.position = this.position.add(v);
  }

  accelerate(v: Vector) {
    this.momentum = this.momentum.add(v);
  }

  momentumMove() {
    this.moveBy(this.momentum);
  }

  constantFriction(friction: number) {
    if (this.momentum.length > friction) {
      this.momentum = this.momentum.subtractLen(friction);
    } else {
      this.momentum = Vector.origin;
    }
  }

  proportionalFriction(frictionFraction: number) {
    this.momentum = this.momentum.multiply(1 - frictionFraction);
  }

  wallBounce(rect: Rectangle) {
    const pos = getRectanglePosition(this.position, rect);

    switch (pos) {
      case Pos.TopLeft:
      case Pos.TopRight:
      case Pos.Top:
        if (this.momentum.y < 0) {
          this.momentum = this.momentum.flipY();
        }
        break;

      case Pos.BottomLeft:
      case Pos.Bottom:
      case Pos.BottomRight:
        if (this.momentum.y > 0) {
          this.momentum = this.momentum.flipY();
        }
        break;

      case Pos.Left:
        if (this.momentum.x < 0) {
          this.momentum = this.momentum.flipX();
        }
        break;

      case Pos.Right:
        if (this.momentum.x > 0) {
          this.momentum = this.momentum.flipX();
        }
        break;
    }
  }
}
