# Stitch lines

This document describes the computed geometry behind a `StitchLineSchema`.
The schema is editor-facing; the computed output is a set of SVG routes, each
with its own path and stitch-hole list.

The schema has boolean flags for each component side and corner. In this
document, an **enabled side** means one of `StitchLineSchema.top`, `.right`,
`.bottom`, or `.left` is `true`. An **enabled corner** means the corresponding
`topLeftCorner`, `topRightCorner`, `bottomRightCorner`, or `bottomLeftCorner`
field is `true`. These terms do not refer to UI selection.

## Route paths

A stitch line targets one component. Its outer boundary is taken from the
computed component bounding rect. The stitch route is inset by
`stitchMargin` on every side.

Corner radii are resolved with `getNormalizedCornerRadius(component)`. The
effective radius of a stitch-route corner is:

```text
max(0, component corner radius - stitchMargin)
```

So a 5 mm component radius with a 5 mm margin becomes a sharp stitch-route
corner. A sharp corner does not emit an SVG arc; adjacent enabled fragments
meet at the same point.

The perimeter is built in this canonical order:

```text
top → top-right → right → bottom-right → bottom → bottom-left → left → top-left
```

Enabled sides produce straight fragments. Enabled corners produce arc
fragments only when their effective radius is positive. A corner by itself is
ignored: it must have at least one enabled neighbouring side.

An explicitly enabled corner is the only thing that connects its two sides.
Two sides that merely meet at a zero-radius point remain separate routes when
that corner is not enabled.

The `StitchLineSchema` `...StartOffset` and `...EndOffset` fields control the
two ends of a side when that end is not attached to an enabled corner. A
positive offset extends the side at that end; a negative offset shortens it.
At an end attached to an enabled corner the offset is ignored, so the side and
corner meet exactly.

Consecutive enabled fragments become one SVG route. A route is considered
closed when its final point is also its first point; otherwise it is an open
route. A standalone side is an open route containing exactly one enabled side
and no enabled corner.

## Stitch holes

Holes are computed separately for every SVG route, but use the route's source
fragments as well as its rendered path. This matters because an enabled sharp
corner has no SVG command but still changes the punching behaviour.

A standalone side uses its configured `topStitchDirection`,
`rightStitchDirection`, `bottomStitchDirection`, or `leftStitchDirection`.
Any route involving an enabled corner follows the canonical perimeter
direction: top left-to-right, right top-to-bottom, bottom right-to-left, and
left bottom-to-top.

The first hole is placed at the start of a punching traversal. Its rotation
comes from the tangent of the first line or arc. Every later hole is exactly
`stitchHoleDistance` away from the previous hole:

1. Draw a circle centred on the previous hole with that radius.
2. Find the first intersection with the remaining route in the travel
   direction.
3. Place the next hole at that intersection.
4. Stop when there is no forward intersection.

This keeps the centre-to-centre distance exact through rounded corners. After
the first hole, rotation comes from the direction from the previous hole centre
to the new hole centre:

```text
normalizeTo0To180(atan2(current.y - previous.y, current.x - previous.x) - 90°)
```

`[0, 180)` is sufficient because a stitch-hole line is symmetric after 180
degrees.

### Sharp corners and route ends

A configured corner with an effective radius of zero ends the current punching
traversal. Before the next side starts, the last hole before that corner is
removed when it is at most:

```text
stitchHoleDistance * MINIMUM_STITCH_HOLE_ENDPOINT_DISTANCE_FACTOR
```

away from the corner point. The current factor is `0.5`. The following side
then starts a fresh traversal at the corner point.

For an open route, the final hole is simply the last one for which a complete
forward `stitchHoleDistance` intersection exists. There is no endpoint fill or
end-spacing adjustment.

For a closed route without sharp corners, the final hole is also checked against
the route start using the same minimum-distance factor. Too-close final holes
are removed so the closing point does not create a duplicate or nearly
overlapping hole.
