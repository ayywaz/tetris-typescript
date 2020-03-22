let angle = 0;
let squares = 10;
let colors: p5.Color[];

const size = 20;     // size of the block
const extra_w = 130; // space to the side
const extra_h = 0;   // space to the bottom
const fall = 10;    // how much frames it takes for piece to fall in level 1
const increase = 6; // amount of lines destroyed to reach next level
let grid = Array();  // all fallen pieces
let piece : Piece; // main moving piece
let tetris_w : number, tetris_h : number;
let level = 1;
let destroyed = 0;
let pause = false;
let bot = false;

const pieces = [[[0, size], [0, 0], [0, size*2], [size, size*2], [239, 160, 0]],
              [[size, size], [size, 0], [size, size*2], [0, size*2], [1, 1, 240]],
            [[0, 0], [-size, 0], [size, 0], [0, size], [160, 0, 241]],
          [[0, size], [-size, 0], [0, 0], [size, size], [240, 1, 0]],
          [[0, size], [-size, size], [0, 0], [size, 0], [0, 240, 0]],
        [[0, 0],[size, 0], [0, size], [size, size], [240, 240, 1]],
      [[0,-size], [0, 0], [0, size], [0, size * 2], [1, 240, 241]]];


function setup() {
    piece = new Piece();
    createCanvas(330, 400);

    tetris_w = width - extra_w;
    tetris_h = height - extra_h;
    piece.setup();
    textAlign(CENTER,CENTER);
    textSize(size);
}

function draw() {
    if(pause) return;
    background(0);
    stroke(255);
    line(tetris_w + 1, 0, tetris_w + 1, height);
    stroke(0);
    piece.draw();
    fill(226, 214, 36);
    text("Destroyed: " + destroyed, tetris_w + extra_w/2, height - size/ 1.7);
    text("Level: " + level, tetris_w + extra_w/2, height - size * 1.7);
    grid.forEach(elem =>{
        fill(elem.color);
        rect(elem.x, elem.y, size, size)}
    );
    level = ceil((destroyed + 1) / increase);
}
const restart = () => {
    piece.setup();
    grid = Array();
    destroyed = 0;
    pause = false;
  }

function array_neighbours(array: Block[]){
  
}
function all_neighbours(block: Block){
  let sk = 0;
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      if(i !== 0 || j !== 0){
        for(let elem of grid){
          if((elem.x === block.x + i * size && elem.y === block.y + j * size) ||
            block.x + i * size === -size || block.x + i * size === width ||
            block.y + j * size === -size || block.y + j * size === height){
              sk++;
              break;
            }
        }
      }
    }
  }
  return sk;
}
  
  
  

