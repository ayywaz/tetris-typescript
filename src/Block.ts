class Block{
    x : number;
    y : number;
    color : p5.Color;
    constructor(x: number, y: number, color: p5.Color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
  
    check(yv: number, xv: number) {
      if(this.y + yv === tetris_h ||(this.x + xv < 0 ||  this.x + xv >= tetris_w))
        return false;
      for(let i = 0; i < grid.length; i++){
        if(this.x === grid[i].x - xv && this.y === grid[i].y - yv) return false;
      }return true;
    }
  }