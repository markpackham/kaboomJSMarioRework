// need to have parcel installed to run this
// other choices would have been the bundlers esbuild or webpack

import kaboom from "kaboom";

kaboom();

const block_size = 20;

const map = addLevel([
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
  ], {
  width: block_size,
  height: block_size,
  pos: vec2(0, 0),
  "=": () => [
    rect(block_size, block_size),
    color(255,0,0),
    area(),
    "wall"
  ]
});


const directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right"
};

let current_direction = directions.RIGHT;
let run_action = false;
let snake_length = 3;
let snake_body = [];

function respawn_snake(){
  destroyAll("snake");

  snake_body = [];
  snake_length = 3;

  for (let i = 1; i <= snake_length; i++) {
      let segment = add([
          rect(block_size ,block_size),
          pos(block_size ,block_size *i),
          color(0,0,255),
          area(),
          "snake"
      ]);
      snake_body.push(segment);
  };
  current_direction = directions.RIGHT;
}

function respawn_all(){
  run_action = false;
    wait(0.5, function(){
        respawn_snake();
        run_action = true;
    });

}

respawn_all();