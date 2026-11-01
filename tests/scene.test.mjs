import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { focusedNodeIds, projectedEdgePoint, graphLabelScale, graphNodePresentation, cameraTravelDirection, cameraPositionFromTarget, cameraTargetFromPosition, cameraLookDelta, adjustMovementSpeed, movementSpeedFill, nodeOpacity, MIN_MOVEMENT_SPEED, MAX_MOVEMENT_SPEED, DEFAULT_MOVEMENT_SPEED, routeVisibility, relationshipLabelEdges, truncateLabel, placeNodeLabels } from '../src/lib/scene.js';

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
  assert.match(source, /const dx=e\.clientX-pointer\.lastX,dy=e\.clientY-pointer\.lastY/);
  assert.match(source, /const turn=cameraLookDelta\(target,yaw,pitch,dist,dx,dy\)/);
  assert.match(source, /if\(pointer\)pointer\.moved=true/);
});

test('WASD movement interleaved with mouse-look never teleports or resets the viewing angle', () => {
  const distance = 2300;
  let target = { x: -320, y: 150, z: 860 };
  let yaw = -.35, pitch = .22;
  let expectedCamera = cameraPositionFromTarget(target, yaw, pitch, distance);
  let expectedYaw = yaw, expectedPitch = pitch;
  const movements = [
    { mouse: [24, -12], travel: [0, 0, -95] },
    { mouse: [0, 0], travel: [75, 0, -45] },
    { mouse: [-10, 18], travel: [16, 12, -68] },
    { mouse: [8, -4], travel: [-25, 9, 0] },
    { mouse: [-13, 20], travel: [0, 0, 0] },
    { mouse: [0, 0], travel: [0, 0, -80] }
  ];
  for (const { mouse: [dx, dy], travel: [mx, my, mz] } of movements) {
    const turned = cameraLookDelta(target, yaw, pitch, distance, dx, dy);
    target = turned.target;
    yaw = turned.yaw;
    pitch = turned.pitch;
    expectedYaw -= dx * .005;
    expectedPitch = Math.max(-1.35, Math.min(1.35, expectedPitch + dy * .005));
    assert.ok(Math.abs(yaw - expectedYaw) < 1e-12, 'Mouse turn is incremental');
    assert.ok(Math.abs(pitch - expectedPitch) < 1e-12, 'Pitch is incremental');
    for (const axis of ['x', 'y', 'z']) {
      assert.ok(Math.abs(cameraPositionFromTarget(target, yaw, pitch, distance)[axis] - expectedCamera[axis]) < 1e-9, 'Mouse turn must not move the camera');
    }
    // WASD adds a world-space displacement without affecting the live look angles.
    target = { x: target.x + mx, y: target.y + my, z: target.z + mz };
    expectedCamera = { x: expectedCamera.x + mx, y: expectedCamera.y + my, z: expectedCamera.z + mz };
    for (const axis of ['x', 'y', 'z']) {
      assert.ok(Math.abs(cameraPositionFromTarget(target, yaw, pitch, distance)[axis] - expectedCamera[axis]) < 1e-9, 'Keyboard movement must be preserved after turning');
    }
  }

  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /pointer\.travel\+=Math\.hypot\(dx,dy\)/);
  assert.match(source, /space\.addEventListener\('pointercancel'/);
  assert.match(source, /space\.addEventListener\('lostpointercapture'/);
});

test('mouse-look pitch is clamped while moving the camera never changes its location', () => {
  const target = { x: 40, y: -300, z: 930 }, distance = 750;
  const initialCamera = cameraPositionFromTarget(target, 2.4, .3, distance);
  const turn = cameraLookDelta(target, 2.4, .3, distance, -60, 1000);
  assert.equal(turn.pitch, 1.35);
  for (const axis of ['x', 'y', 'z']) {
    assert.ok(Math.abs(cameraPositionFromTarget(turn.target, turn.yaw, turn.pitch, distance)[axis] - initialCamera[axis]) < 1e-9);
  }
});

test('wheel changes flight speed instead of zoom and the HUD shows metres per second', () => {
  assert.equal(MIN_MOVEMENT_SPEED, 300);
  assert.equal(adjustMovementSpeed(900, 100000), 300);
  assert.ok(adjustMovementSpeed(DEFAULT_MOVEMENT_SPEED, -100) > DEFAULT_MOVEMENT_SPEED);
  assert.ok(adjustMovementSpeed(DEFAULT_MOVEMENT_SPEED, 100) < DEFAULT_MOVEMENT_SPEED);
  assert.equal(adjustMovementSpeed(MIN_MOVEMENT_SPEED, 100000), MIN_MOVEMENT_SPEED);
  assert.equal(adjustMovementSpeed(MAX_MOVEMENT_SPEED, -100000), MAX_MOVEMENT_SPEED);
  assert.ok(adjustMovementSpeed(900, -3, 1) > 900, 'Wheel line deltas work');
  assert.ok(adjustMovementSpeed(900, 1, 2) < 900, 'Wheel page deltas work');
  assert.ok(movementSpeedFill(MAX_MOVEMENT_SPEED) > movementSpeedFill(DEFAULT_MOVEMENT_SPEED));
  assert.ok(movementSpeedFill(DEFAULT_MOVEMENT_SPEED) > movementSpeedFill(MIN_MOVEMENT_SPEED));
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(html, /id="flightSpeed" role="meter"/);
  assert.match(html, /id="speedValue"/);
  assert.match(html, /id="speedFill"/);
  assert.match(html, /Rulla: lentonopeus/);
  assert.ok(!html.includes('id="zoomIn"') && !html.includes('id="zoomOut"'));
  assert.match(main, /movementSpeed=adjustMovementSpeed\(movementSpeed,e\.deltaY,e\.deltaMode\)/);
  assert.match(main, /const speed=movementSpeed\*\(pressedTravelKeys\.has\('shift'\)\?2\.5:1\)/);
  assert.ok(!main.includes('dist*Math.exp(e.deltaY'));
  assert.match(css, /\.flight-speed-track/);
});

test('clearing a node selection returns every unfiltered node to full opacity', () => {
  for (const distanceFactor of [.12, .3, .5, 1, 4]) {
    assert.equal(nodeOpacity({distanceFactor}), 1, 'Unselected nodes never retain depth/focus dimming');
    assert.equal(nodeOpacity({selected:false,focused:false,onPath:false,routeActive:false,distanceFactor}), 1);
  }
  assert.ok(nodeOpacity({selected:true,distanceFactor:.8}) < 1, 'Selection still dims unrelated nodes');
  assert.equal(nodeOpacity({selected:true,focused:true,distanceFactor:.2}), 1, 'Focused nodes remain prominent');
  assert.ok(nodeOpacity({sectorDimmed:true,distanceFactor:.5}) < 1, 'Explicit skene filters still work');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /const alpha=nodeOpacity\(/);
  assert.match(main, /ctx\.globalAlpha=alpha/);
  assert.match(main, /ctx\.fillStyle=tint\(col,alpha\)/);
  assert.match(main, /selected=null;pathNodes=\[\];pathEdges=\[\]/);
});

test('Shift sprint combines with left-mouse look; middle drag alone pans', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(main, /pan:e\.button===1/);
  assert.ok(!main.includes('pan:e.shiftKey||e.button===1'));
  assert.match(main, /if\(dt&&!pointer\?\.pan&&pressedTravelKeys\.size\)/);
  assert.match(html, /Keskinappi\+vedä: siirrä/);
});

test('labels use either side of a node near screen edges', () => {
 const make=(id,x)=>({n:{id},p:{x,y:130,z:100},r:10,label:{w:120,h:40}});
 const a=placeNodeLabels([make('a',20)],600,320).get('a');
 const b=placeNodeLabels([make('b',580)],600,320).get('b');
 assert.ok(a.bx>20 && a.bx+120<=592);
 assert.ok(b.bx+120<580 && b.bx>=8);
});

test('selected labels get first choice of space and other labels avoid covering them', () => {
 const make=(id,x,isSel=false)=>({n:{id},p:{x,y:150,z:100},r:10,isSel,label:{w:120,h:40}});
 const placed=placeNodeLabels([make('selected',285,true),make('neighbor',315),make('other',245)],650,320);
 const boxes=[...placed.values()];
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
  const a=boxes[i],b=boxes[j];
  assert.ok(a.bx+120<=b.bx||b.bx+120<=a.bx||a.by+40<=b.by||b.by+40<=a.by);
 }
});

test('small camera motion keeps the same label anchor', () => {
 const make=x=>({n:{id:'node'},p:{x,y:150,z:100},r:10,label:{w:120,h:40}});
 const previous=new Map([['node','left']]);
 assert.equal(placeNodeLabels([make(200)],400,300,previous).get('node').anchor,'left');
 assert.equal(placeNodeLabels([make(201)],400,300,previous).get('node').anchor,'left');
});
