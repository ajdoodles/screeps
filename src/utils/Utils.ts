export function getBodyCost(body: BodyPartConstant[]): number {
  return body.reduce(
    (totalCost, bodyPart) => totalCost + BODYPART_COST[bodyPart],
    0
  );
}
