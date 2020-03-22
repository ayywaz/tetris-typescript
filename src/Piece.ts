class Piece{
    arr : Block[];
    secondP : Block[];
    numb : number;
    lastnumb : number;
    counter : number;
    place : number;
    constructor() {
        this.arr = this.secondP = Array();
        this.numb, this.lastnumb;
        this.counter = -1;
    }
  
    setup(){
      if(this.secondP.length === 0) this.secondP = this.newPiece();
      this.arr = this.secondP;
      this.secondP = this.newPiece();
      if(!this.arr.every(elem => elem.check(0, 0))) pause = true;
      if(bot) this.find_place();
    }
    draw(){
      if(this.counter % (fall - level + 1) === (fall - level)){
        if(bot) this.bot();
        this.counter = -1;
        let c = Array();
        for(let elem of this.arr){
          if(!elem.check(size, 0)){
            this.arr.forEach(elem =>{
              grid.push(elem);
              if(grid.filter(x => x.y === elem.y).length === tetris_w / size)
                c.push(elem);
            });
            destroyed += c.length;
            for(let i = 0; i < c.length; i++){
              grid = grid.filter(x => x.y !== c[i].y);
              grid.forEach(x =>  x.y += (x.y < c[i].y) ? size : 0);
            }
            this.setup();
            break;
          }
        }
        this.arr.forEach(elem => elem.y += size);
      }
      fill(this.secondP[0].color);
      for(let elem of this.secondP)
        rect(elem.x + tetris_w/2 + extra_w/2 - size, elem.y + size, size, size);
      for(let elem of this.arr){
        fill(elem.color);
        rect(elem.x, elem.y, size, size);
      }
      this.counter ++;
    }
    newPiece(){
      let ayy = Array();
      let a = floor(random(0, 6.99));
      this.numb = this.lastnumb;
      this.lastnumb = a < 5 ? 3 : a < 6 ? 2 : 4;
      for(let i = 0; i < 4; i++)
        ayy.push(new Block(tetris_w / 2 + pieces[a][i][0], pieces[a][i][1],
                      color(pieces[a][4][0], pieces[a][4][1], pieces[a][4][2])));
      return ayy;
    }
    down(array = this.arr){
      let maxY = array.reduce((prev, cur) => cur.y > prev ? cur.y : prev, 0);
      for(let i = 1; i < tetris_h / size + size; i++){
        if(!array.every(elem =>
            elem.check(-maxY + elem.y + i * size - elem.y, 0))){
          array.forEach(elem => elem.y = -(maxY - elem.y - (i-1) * size));
          return;
        }
      }
    }
    rotate(array: Block[]){
      if(this.numb === 2) return;
      let a = Array();
      let c = array[0].color;
      if(this.numb === 4){
        for(let i = 2; i >= -1; i--){
          a.push(new Block(array[i * -1 + 2].x + size * i *
              ((array[0].y < array[1].y ||  array[0].x < array[1].x)
              ? 1 : -1), array[i * -1 + 2].y + size *
              (array[0].y < array[1].y ? i : array[0].y > array[1].y
              ? i * -1 : array[0].x < array[1].x ? i * -1 + 1 : i - 1), c));
        }
      }else if(this.numb === 3){
        a.push(array[0]);
        for(let i = 1; i < array.length; i++){
          if(array[i].x === array[0].x)
            a.push(new Block(array[i].x + array[i].y - array[0].y,
                  array[0].y,c));
          else if(array[i].y === array[0].y)
            a.push(new Block(array[0].x,
               array[i].y + array[0].x - array[i].x,c));
          else a.push(new Block(
              array[i].x > array[0].x && array[i].y < array[0].y
                ? array[0].x - size
                : array[i].x < array[0].x && array[i].y > array[0].y
                ? array[0].x + size : array[i].x,
              array[i].y > array[0].y && array[i].x > array[0].x
                ? array[0].y - size
                : array[i].y < array[0].y && array[i].x < array[0].x
                ? array[0].y + size : array[i].y,c));
        }
      }
      if(!a.every(elem => elem.check(0, 0))) return array;
      return a;
    }
    find_place(){
        let a = new Array();
        let maxY = 0;
        let allY = new Array();
        this.place = 0;
        let rotation = 0;
        for(let elem of this.arr){
           a.push(new Block(elem.x, elem.y, elem.color));
           allY.push(elem.y);
        }
        while(a.every(elem => elem.check(0, -size)))
          a.forEach(elem => elem.x -= size);
        while(a.every(elem => elem.check(0, 0))){
          for(let i = 0; i < 4; i ++){
            for(let k = 0; k < 4; k++) allY[k] = a[k].y;
            this.down(a);
            //console.log(a.reduce((prev,cur) => prev += cur.y, 0));
            //maxY = max(a.reduce((prev, cur) => prev += cur.y), maxY);
            //if(maxY < a.reduce((prev, cur) => prev += cur.y, 0)){
             //maxY = a.reduce((prev, cur) => prev += cur.y, 0);
  
            if(maxY < a.reduce((prev,cur) => prev += all_neighbours(cur), 0)){
              maxY = a.reduce((prev,cur) => prev += all_neighbours(cur), 0);
             this.place = a[3].x;
             rotation = i;
            }
            for(let p = 0; p < 4; p++) a[p].y = allY[p];
            if(this.numb === 2) break;
            a = this.rotate(a);
          }
          a.forEach(elem => elem.x += size);
        }
        for(let i = 0; i < rotation; i++) this.arr = this.rotate(this.arr);
    }
    bot(){
        //if(this.arr.every(elem => elem.check(0, -10)))
        //  this.arr.forEach(elem => elem.x -= size);
        if(this.place !== this.arr[3].x){
          if(this.arr.every(elem => elem.check(0, this.place > this.arr[3].x ? size : -size))){
             this.arr.forEach(elem => elem.x += this.place > this.arr[3].x ? size : -size);
             console.log(this.arr[0].x, this.place);
          }
        }else this.down();
    }
  }
  
  function keyPressed(){
    if(keyCode === 37 || keyCode === 39){
      if(piece.arr.every(elem => elem.check(0, keyCode != 37 ? size : -size)))
        piece.arr.forEach(elem => elem.x += keyCode != 37 ? size : -size);
  
    }else if(keyCode === 38) piece.arr = piece.rotate(piece.arr);
    else if(keyCode === 40) piece.down();
    else if(keyCode === 80) pause = pause ? false : true;
    else if(keyCode === 32) restart();
    else if(keyCode === 66){
      bot = bot ? false : true;
      piece.find_place();
    }
  }
  