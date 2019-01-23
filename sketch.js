// Daniel Shiffman
// Matter.js + p5.js Examples
// This example is based on examples from: http://brm.io/matter-js/
// whith help from chloe desaulles && kearnie lin

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Composites = Matter.Composites;
var Constraint = Matter.Constraint;

var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var bodies;

var canvas;
var constraint;

var mouseConstraint;

function setup() {
  canvas = createCanvas(800, 400);


  // create an engine
  engine = Engine.create();
  world = engine.world;

  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
    }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(world, mouseConstraint);


  var group = Body.nextGroup(true);

  var closeness = 1;

  // Make a single rectangle
  function makeRect(x, y) {
    var params = {
      collisionFilter: {
        group: group
      }
    }
    var body = Bodies.rectangle(x, y, closeness, 20, params);
    // adding properties that I can pick up later
    body.w = closeness;
    body.h = 20;
    return body;
  }

  // Create a stack of rectangles
  // x, y, columns, rows, column gap, row gap
  var numSegs = 20
  var ropeA = Composites.stack(width / 2, 100, 1, numSegs, 0, 25, makeRect);
  bodies = ropeA.bodies;

  // Connect them as a chain
  var params = {
    stiffness: 0.8,
    length: 2
  }
  Composites.chain(ropeA, 0.5, 0, -0.5, 0, params);

  var params = {
    bodyB: ropeA.bodies[0],
    pointB: {
      x: -25,
      y: 0
    },
    pointA: {
      x: width / 2,
      y: 100
    },
    stiffness: 0.5
  };

  constraint = Constraint.create(params);
  Composite.add(ropeA, constraint);

  // add all of the bodies to the world
  World.add(world, ropeA);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(90,200,23);
  stroke(255);
  strokeWeight(1);
  fill(255, 50);

  var segWidth = 40;
  var segWidths = [12,12,15,24,34,52,50,30,20,1,1,1,1,1]

  for (var i = 0; i < bodies.length; i++) {
      noStroke();
    fill (255, 244, 216);
    var circle = bodies[i];
    var pos = circle.position;
    var r = circle.circleRadius;
    var angle = circle.angle;
    push();
    translate(pos.x, pos.y);
    rectMode(CENTER);
    rotate(angle);
    //rect(0, 0, 50, 20);


    ellipse(0,0,20, segWidths[i]);
    segWidth -= 3;
    pop();
  }

  var a = constraint.pointA;
  var b = constraint.pointB;
  var pos = constraint.bodyB.position;
  

  //face
  stroke(255);
  fill(255, 244, 216);
    var offsetY = 40;

  ellipse(a.x, a.y + offsetY, 50, 46);
  fill(0);


  ellipse(pos.x + b.x, a.y - 7 + offsetY, 5, 5);
  ellipse(pos.x + b.x + 15, a.y - 7 + offsetY, 5, 5);

  noStroke()
  fill(255,200,12);


  triangle(a.x, a.y + offsetY , a.x, a.y + 10 + offsetY, 380, 100 + offsetY);
  triangle(a.x, a.y + offsetY , a.x, a.y + 10 + offsetY, 380, 120 + offsetY);

  strokeWeight(1);

fill(255,0,0);
beginShape();
vertex(400, 112);
vertex(395, 104);
vertex(416, 111);
vertex(424, 107);
vertex(426, 121);
vertex(433, 130);
vertex(426, 137);
vertex(420, 129);
vertex(411, 124);
vertex(400, 112);



endShape(CLOSE);

  var a = mouseConstraint.constraint.pointA;
  var b = mouseConstraint.constraint.pointB;
  var bodyB = mouseConstraint.constraint.bodyB;
  if (bodyB) {
    stroke(255);
    line(a.x, a.y, b.x + bodyB.position.x, b.y + bodyB.position.y);
  }
}