const { sqrt } = Math;

type V = Vector;

export class Vector {
  constructor(public x: number, public y: number) {}

  static origin = new Vector(0, 0);

  public add(p: Vector) {
    const { x, y } = this;
    return new Vector(x + p.x, y + p.y);
  }

  public subtract(p: Vector) {
    const { x, y } = this;
    return new Vector(x - p.x, y - p.y);
  }

  public subtractLen(subtractor: number) {
    return this.scaleTo(this.length - subtractor);
  }

  public multiply(factor: number) {
    const { x, y } = this;
    return new Vector(x * factor, y * factor);
  }

  public divide(div: number) {
    const { x, y } = this;
    return new Vector(x / div, y / div);
  }

  public to(p: Vector) {
    return p.subtract(this);
  }

  public get unit() {
    return this.divide(this.length);
  }

  public scaleTo(length: number) {
    return this.unit.multiply(length);
  }

  public distanceTo(p: V) {
    return this.to(p).length;
  }

  public flipX() {
    const { x, y } = this;
    return new Vector(-x, y);
  }

  public flipY() {
    const { x, y } = this;
    return new Vector(x, -y);
  }

  public scaleX(scalar: number) {
    const { x, y } = this;
    return new Vector(x * scalar, y);
  }

  public scaleY(scalar: number) {
    const { x, y } = this;
    return new Vector(x, y * scalar);
  }

  public reverse() {
    return this.multiply(-1);
  }

  public isEqual(v: Vector) {
    const { x, y } = this;
    return x === v.x && y === v.y;
  }

  public get length() {
    const { x, y } = this;

    return sqrt(x ** 2 + y ** 2);
  }

  get area() {
    const { x, y } = this;
    return x * y;
  }
}

export type Rectangle = [Vector, Vector];

export enum Pos {
  Inside,

  Top,
  TopRight,
  Right,
  BottomRight,
  Bottom,
  BottomLeft,
  Left,
  TopLeft
}

export function getRectanglePosition({ x, y }: Vector, [a, b]: Rectangle): Pos {
  if (x < a.x) {
    if (y < a.y) {
      return Pos.TopLeft;
    } else if (y > b.y) {
      return Pos.BottomLeft;
    } else {
      return Pos.Left;
    }
  } else if (x > b.x) {
    if (y < a.y) {
      return Pos.TopRight;
    } else if (y > b.y) {
      return Pos.BottomRight;
    } else {
      return Pos.Right;
    }
  } else {
    if (y < a.y) {
      return Pos.Top;
    } else if (y > b.y) {
      return Pos.Bottom;
    } else {
      return Pos.Inside;
    }
  }
}
