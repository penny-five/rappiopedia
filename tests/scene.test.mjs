import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { focusedNodeIds, projectedEdgePoint, graphLabelScale, graphNodePresentation, cameraTravelDirection, cameraPositionFromTarget, cameraTargetFromPosition, routeVisibility, relationshipLabelEdges, truncateLabel } from '../src/lib/scene.js';

test('focused neighborhood contains all enabled direct relations, including incoming edges', () => {
  const edges = [
    { a: 'jethro', b: 'talks', level: 'reported' },
    { a: 'pact', b: 'jethro', level: 'verified' },
    { a: 'jethro', b: 'other', level: 'lead' },
    { a: 'pact', b: 'other', level: 'reported' }
  ];
  assert.deepEqual([...focusedNodeIds('jethro', edges, new Set(['reported', 'verified']))].sort(), ['jethro','pact','talks']);
  assert.deepEqual([...focusedNodeIds(null, edges, new Set(['reported']))], []);
});

test('route view shows only path nodes and edges and restores the full graph when cleared', () => {
  const route = routeVisibility(['a', 'b', 'c'], [1, 3]);
  assert.equal(route.active, true);
  assert.equal(route.showsNode('b'), true);
  assert.equal(route.showsNode('other'), false);
  assert.equal(route.showsEdge(3), true);
  assert.equal(route.showsEdge(2), false);

  const normal = routeVisibility([], []);
  assert.equal(normal.active, false);
  assert.equal(normal.showsNode('other'), true);
  assert.equal(normal.showsEdge(2), true);
});

test('route relationship labels use only traversed edges and correct direction', () => {
  const edges = [
    { a: 'a', b: 'b' },
    { a: 'a', b: 'other' },
    { a: 'c', b: 'b' },
    { a: 'other', b: 'c' }
  ];
  assert.deepEqual(relationshipLabelEdges(edges, 'a', ['a', 'b', 'c'], [0, 2]), [
    { edge: edges[0], from: 'a' },
    { edge: edges[2], from: 'b' }
  ]);
  assert.deepEqual(relationshipLabelEdges(edges, 'a', [], []), [
    { edge: edges[0], from: 'a' },
    { edge: edges[1], from: 'a' }
  ]);
});

test('node name display has only automatic and all-names choices', () => {
  assert.deepEqual(graphNodePresentation({ nameDensity: 'auto' }), { dot: true, showLabel: false });
  assert.deepEqual(graphNodePresentation({ nameDensity: 'all' }), { dot: false, showLabel: true });
  for (const property of ['selected', 'hovered', 'focused', 'onPath', 'featured', 'inSelectedSector']) {
    assert.deepEqual(graphNodePresentation({ nameDensity: 'auto', [property]: true }), { dot: false, showLabel: true }, property);
  }
  assert.deepEqual(graphNodePresentation({ nameDensity: 'auto', isHub: true }), { dot: false, showLabel: false });
  assert.deepEqual(graphNodePresentation({ nameDensity: 'auto', wholeSpace: false }), { dot: false, showLabel: false });
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('SOLMUJEN NIMET'));
  assert.equal((html.match(/data-name-density=/g) || []).length, 2);
  assert.ok(html.includes('data-name-density="auto"') && html.includes('>Automaattinen</button>'));
  assert.ok(html.includes('data-name-density="all"') && html.includes('>Kaikki nimet</button>'));
  assert.ok(!html.includes('data-mode="links"'));
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.ok(main.includes("nameDensity='auto'"));
  assert.ok(main.includes("nameDensity==='all'||p.sc>"));
  assert.ok(!main.includes("mode==='links'"));
});

test('focused labels have fixed size, ordinary labels shrink/grow with perspective', () => {
  assert.equal(graphLabelScale(.25, true), 1);
  assert.equal(graphLabelScale(3, true), 1);
  assert.ok(graphLabelScale(.3, false) < graphLabelScale(.6, false));
  assert.equal(graphLabelScale(.01, false), .6);
  assert.equal(graphLabelScale(3, false), 1);
});

test('projected edge points retain 3D depth ordering', () => {
  const a = { x: 0, y: 10, z: 1000 }, b = { x: 300, y: 50, z: 2000 };
  assert.deepEqual(projectedEdgePoint(a, b, 0), a);
  assert.deepEqual(projectedEdgePoint(a, b, 1), b);
  const p = projectedEdgePoint(a, b, .5);
  assert.ok(p.z > a.z && p.z < b.z);
  assert.ok(p.x > a.x && p.x < b.x);
});

test('labels never grow beyond the focused node label scale', () => {
  for (const perspective of [.1, .4, 1, 5, 50]) {
    assert.ok(graphLabelScale(perspective, false) <= graphLabelScale(perspective, true));
  }
});

test('camera travel follows view direction and strafes without changing speed diagonally', () => {
  const camera = { forward: { x: 0, y: 0, z: -1 }, right: { x: 1, y: 0, z: 0 } };
  assert.deepEqual(cameraTravelDirection(new Set(['w']), camera), { x: 0, y: 0, z: -1 });
  assert.deepEqual(cameraTravelDirection(new Set(['a']), camera), { x: -1, y: 0, z: 0 });
  assert.deepEqual(cameraTravelDirection(new Set(['q']), camera), { x: 0, y: -1, z: 0 });
  assert.deepEqual(cameraTravelDirection(new Set(['w', 's']), camera), { x: 0, y: 0, z: 0 });
  const diagonal = cameraTravelDirection(new Set(['w', 'd']), camera);
  assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.y, diagonal.z) - 1) < 1e-12);
  assert.ok(diagonal.x > 0 && diagonal.z < 0);
});

test('forward travel respects camera pitch', () => {
  const camera = { forward: { x: 0, y: -.6, z: -.8 }, right: { x: 1, y: 0, z: 0 } };
  assert.deepEqual(cameraTravelDirection(new Set(['w']), camera), { x: 0, y: -.6, z: -.8 });
});

test('canvas labels truncate long types without distorting text size', () => {
  const measure = value => Array.from(value).length * 10;
  assert.equal(truncateLabel('STRIIMAAJA · SOMEVAIKUTTAJA', 110, measure), 'STRIIMAAJA…');
  assert.equal(truncateLabel('PALVELU', 110, measure), 'PALVELU');
  assert.equal(truncateLabel('ABC', 10, measure), '…');
  assert.equal(truncateLabel('ABC', 5, measure), '');
});

test('selected label is painted last and receives hit-testing priority', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const painter = source.indexOf('for(const item of scene)item.draw();');
  const overlay = source.indexOf('if(selectedItem)nodeLabelDisplay(selectedItem);');
  assert.ok(painter >= 0 && overlay > painter);
  assert.match(source, /if\(label&&!isSel\)nodeLabelDisplay\(item\)/);
  assert.match(source, /if\(active&&x>=active\.x-3/);
});

test('node labels are wider and the selected label has a dedicated halo', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /const w=\(enlarged\?186:158\)\*labelScale/);
  assert.match(source, /RR\(bx-2\*ls,by-2\*ls,w\+4\*ls,h\+4\*ls,6\*ls\)/);
});

test('skene wireframes are clearer and the movement crosshair does not intercept clicks', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(source, /drawWireVolume\(c, bounds, col, active \? \.35 : \.085/);
  assert.match(html, /class="crosshair" aria-hidden="true"/);
  assert.match(css, /\.crosshair\{[^}]*pointer-events:none/);
});

test('left-drag mouse look turns the camera in place instead of orbiting the target', () => {
  const originalTarget = { x: -320, y: 150, z: 860 };
  const initialYaw = -.35, initialPitch = .22, distance = 2300;
  const camera = cameraPositionFromTarget(originalTarget, initialYaw, initialPitch, distance);
  // Moving through the world changes the target and camera together; rotation still must not move us.
  for (const [yaw, pitch] of [[-.8, .4], [1.2, -.65], [0, 0], [2.4, 1.35]]) {
    const newTarget = cameraTargetFromPosition(camera, yaw, pitch, distance);
    const rotatedCamera = cameraPositionFromTarget(newTarget, yaw, pitch, distance);
    for (const axis of ['x', 'y', 'z']) {
      assert.ok(Math.abs(rotatedCamera[axis] - camera[axis]) < 1e-9, axis);
    }
    assert.notDeepEqual(newTarget, originalTarget);
  }

  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /cam:projection\(\)\.cam/);
  assert.match(source, /target=cameraTargetFromPosition\(pointer\.cam,yaw,pitch,dist\)/);
});
