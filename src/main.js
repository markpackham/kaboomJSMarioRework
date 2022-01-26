// need to have parcel installed to run this
// other choices would have been the bundlers esbuild or webpack

import kaboom from "kaboom";

kaboom();

// Creating map & key variables
const block_size = 50;

const map = addLevel(
  [
    "==============",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "=            = ",
    "==============",
  ],
  {
    width: block_size,
    height: block_size,
    pos: vec2(0, 0),
    "=": () => [rect(block_size, block_size), color(255, 0, 0), area(), "wall"],
  }
);

const directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

let current_direction = directions.RIGHT;
let run_action = false;
let snake_length = 3;
let snake_body = [];

// Spawn Snake
function respawn_snake() {
  destroyAll("snake");

  snake_body = [];
  snake_length = 3;

  for (let i = 1; i <= snake_length; i++) {
    let segment = add([
      rect(block_size, block_size),
      pos(block_size, block_size * i),
      color(0, 0, 255),
      area(),
      "snake",
    ]);
    snake_body.push(segment);
  }
  current_direction = directions.RIGHT;
}

function respawn_all() {
  run_action = false;
  wait(0.5, function () {
    respawn_snake();
    respawn_food();
    run_action = true;
  });
}

respawn_all();

// Snake movement keys
// Click on the browser Window first for keys to be used
onKeyPress("up", () => {
  if (current_direction != directions.DOWN) {
    current_direction = directions.UP;
  }
});

onKeyPress("down", () => {
  if (current_direction != directions.UP) {
    current_direction = directions.DOWN;
  }
});

onKeyPress("left", () => {
  if (current_direction != directions.RIGHT) {
    current_direction = directions.LEFT;
  }
});

onKeyPress("right", () => {
  if (current_direction != directions.LEFT) {
    current_direction = directions.RIGHT;
  }
});

let move_delay = 0.2;
let timer = 0;
// Kaboom.js has a function onUpdate which can be used to update game objects on each frame
onUpdate(() => {
  if (!run_action) return;
  timer += dt();
  if (timer < move_delay) return;
  timer = 0;

  let move_x = 0;
  let move_y = 0;

  switch (current_direction) {
    case directions.DOWN:
      move_x = 0;
      move_y = block_size;
      break;
    case directions.UP:
      move_x = 0;
      move_y = -1 * block_size;
      break;
    case directions.LEFT:
      move_x = -1 * block_size;
      move_y = 0;
      break;
    case directions.RIGHT:
      move_x = block_size;
      move_y = 0;
      break;
  }

  // Get the last element (the snake head)
  let snake_head = snake_body[snake_body.length - 1];

  snake_body.push(
    add([
      rect(block_size, block_size),
      pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
      color(0, 0, 255),
      area(),
      "snake",
    ])
  );

  if (snake_body.length > snake_length) {
    let tail = snake_body.shift(); // Remove the last of the tail
    destroy(tail);
  }
});

// Spawn snake food

let food = null;

function respawn_food() {
  let new_pos = rand(vec2(1, 1), vec2(13, 13));
  new_pos.x = Math.floor(new_pos.x);
  new_pos.y = Math.floor(new_pos.y);
  new_pos = new_pos.scale(block_size);

  if (food) {
    destroy(food);
  }
  food = add([
    rect(block_size, block_size),
    color(0, 255, 0),
    pos(new_pos),
    area(),
    "food",
  ]);
}

// Collision detection
// onCollide. The function takes in 2 tags for different game object types,
// and calls a provided callback function if there is a collision of the objects.
onCollide("snake", "food", (s, f) => {
  snake_length++;
  respawn_food();
});
