import { Vector } from "./Vector";
import { Node } from "./Node";

export class Edge {
  constructor(public a: Node, public b: Node) {}
}

const naturalLength = 50;

export function getElasticVector(edge: Edge) {
  const { a, b } = edge;

  const aToB = a.position.to(b.position);
  const aDifferenceFromNaturalLen = aToB.subtract(aToB.scaleTo(naturalLength));

  const bToA = b.position.to(a.position);
  const bDifferenceFromNaturalLen = bToA.subtract(bToA.scaleTo(naturalLength));

  return {
    forceA: aDifferenceFromNaturalLen,
    forceB: bDifferenceFromNaturalLen
  };
}

interface Repulsion {
  a: Vector;
  b: Vector;
}

function forceAwayFrom(
  subject: Vector,
  forceSource: Vector,
  forceLimit: number
): Vector {
  const oppositeVector = forceSource.to(subject);

  return oppositeVector
    .multiply(forceLimit / oppositeVector.length)
    .divide(100);
}

export function getRepulsion(
  a: Vector,
  b: Vector,
  forceLimit: number
): Repulsion {
  return {
    a: forceAwayFrom(a, b, forceLimit),
    b: forceAwayFrom(b, a, forceLimit)
  };
}
