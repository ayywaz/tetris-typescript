var Block = (function () {
    function Block(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    Block.prototype.check = function (yv, xv) {
        if (this.y + yv === tetris_h || (this.x + xv < 0 || this.x + xv >= tetris_w))
            return false;
        for (var i = 0; i < grid.length; i++) {
            if (this.x === grid[i].x - xv && this.y === grid[i].y - yv)
                return false;
        }
        return true;
    };
    return Block;
}());
var Piece = (function () {
    function Piece() {
        this.arr = this.secondP = Array();
        this.numb, this.lastnumb;
        this.counter = -1;
    }
    Piece.prototype.setup = function () {
        if (this.secondP.length === 0)
            this.secondP = this.newPiece();
        this.arr = this.secondP;
        this.secondP = this.newPiece();
        if (!this.arr.every(function (elem) { return elem.check(0, 0); }))
            pause = true;
        if (bot)
            this.find_place();
    };
    Piece.prototype.draw = function () {
        if (this.counter % (fall - level + 1) === (fall - level)) {
            if (bot)
                this.bot();
            this.counter = -1;
            var c_1 = Array();
            for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
                var elem = _a[_i];
                if (!elem.check(size, 0)) {
                    this.arr.forEach(function (elem) {
                        grid.push(elem);
                        if (grid.filter(function (x) { return x.y === elem.y; }).length === tetris_w / size)
                            c_1.push(elem);
                    });
                    destroyed += c_1.length;
                    var _loop_1 = function (i) {
                        grid = grid.filter(function (x) { return x.y !== c_1[i].y; });
                        grid.forEach(function (x) { return x.y += (x.y < c_1[i].y) ? size : 0; });
                    };
                    for (var i = 0; i < c_1.length; i++) {
                        _loop_1(i);
                    }
                    this.setup();
                    break;
                }
            }
            this.arr.forEach(function (elem) { return elem.y += size; });
        }
        fill(this.secondP[0].color);
        for (var _b = 0, _c = this.secondP; _b < _c.length; _b++) {
            var elem = _c[_b];
            rect(elem.x + tetris_w / 2 + extra_w / 2 - size, elem.y + size, size, size);
        }
        for (var _d = 0, _e = this.arr; _d < _e.length; _d++) {
            var elem = _e[_d];
            fill(elem.color);
            rect(elem.x, elem.y, size, size);
        }
        this.counter++;
    };
    Piece.prototype.newPiece = function () {
        var ayy = Array();
        var a = floor(random(0, 6.99));
        this.numb = this.lastnumb;
        this.lastnumb = a < 5 ? 3 : a < 6 ? 2 : 4;
        for (var i = 0; i < 4; i++)
            ayy.push(new Block(tetris_w / 2 + pieces[a][i][0], pieces[a][i][1], color(pieces[a][4][0], pieces[a][4][1], pieces[a][4][2])));
        return ayy;
    };
    Piece.prototype.down = function (array) {
        if (array === void 0) { array = this.arr; }
        var maxY = array.reduce(function (prev, cur) { return cur.y > prev ? cur.y : prev; }, 0);
        var _loop_2 = function (i) {
            if (!array.every(function (elem) {
                return elem.check(-maxY + elem.y + i * size - elem.y, 0);
            })) {
                array.forEach(function (elem) { return elem.y = -(maxY - elem.y - (i - 1) * size); });
                return { value: void 0 };
            }
        };
        for (var i = 1; i < tetris_h / size + size; i++) {
            var state_1 = _loop_2(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    Piece.prototype.rotate = function (array) {
        if (this.numb === 2)
            return;
        var a = Array();
        var c = array[0].color;
        if (this.numb === 4) {
            for (var i = 2; i >= -1; i--) {
                a.push(new Block(array[i * -1 + 2].x + size * i *
                    ((array[0].y < array[1].y || array[0].x < array[1].x)
                        ? 1 : -1), array[i * -1 + 2].y + size *
                    (array[0].y < array[1].y ? i : array[0].y > array[1].y
                        ? i * -1 : array[0].x < array[1].x ? i * -1 + 1 : i - 1), c));
            }
        }
        else if (this.numb === 3) {
            a.push(array[0]);
            for (var i = 1; i < array.length; i++) {
                if (array[i].x === array[0].x)
                    a.push(new Block(array[i].x + array[i].y - array[0].y, array[0].y, c));
                else if (array[i].y === array[0].y)
                    a.push(new Block(array[0].x, array[i].y + array[0].x - array[i].x, c));
                else
                    a.push(new Block(array[i].x > array[0].x && array[i].y < array[0].y
                        ? array[0].x - size
                        : array[i].x < array[0].x && array[i].y > array[0].y
                            ? array[0].x + size : array[i].x, array[i].y > array[0].y && array[i].x > array[0].x
                        ? array[0].y - size
                        : array[i].y < array[0].y && array[i].x < array[0].x
                            ? array[0].y + size : array[i].y, c));
            }
        }
        if (!a.every(function (elem) { return elem.check(0, 0); }))
            return array;
        return a;
    };
    Piece.prototype.find_place = function () {
        var a = new Array();
        var maxY = 0;
        var allY = new Array();
        this.place = 0;
        var rotation = 0;
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var elem = _a[_i];
            a.push(new Block(elem.x, elem.y, elem.color));
            allY.push(elem.y);
        }
        while (a.every(function (elem) { return elem.check(0, -size); }))
            a.forEach(function (elem) { return elem.x -= size; });
        while (a.every(function (elem) { return elem.check(0, 0); })) {
            for (var i = 0; i < 4; i++) {
                for (var k = 0; k < 4; k++)
                    allY[k] = a[k].y;
                this.down(a);
                if (maxY < a.reduce(function (prev, cur) { return prev += all_neighbours(cur); }, 0)) {
                    maxY = a.reduce(function (prev, cur) { return prev += all_neighbours(cur); }, 0);
                    this.place = a[3].x;
                    rotation = i;
                }
                for (var p = 0; p < 4; p++)
                    a[p].y = allY[p];
                if (this.numb === 2)
                    break;
                a = this.rotate(a);
            }
            a.forEach(function (elem) { return elem.x += size; });
        }
        for (var i = 0; i < rotation; i++)
            this.arr = this.rotate(this.arr);
    };
    Piece.prototype.bot = function () {
        var _this = this;
        if (this.place !== this.arr[3].x) {
            if (this.arr.every(function (elem) { return elem.check(0, _this.place > _this.arr[3].x ? size : -size); })) {
                this.arr.forEach(function (elem) { return elem.x += _this.place > _this.arr[3].x ? size : -size; });
                console.log(this.arr[0].x, this.place);
            }
        }
        else
            this.down();
    };
    return Piece;
}());
function keyPressed() {
    if (keyCode === 37 || keyCode === 39) {
        if (piece.arr.every(function (elem) { return elem.check(0, keyCode != 37 ? size : -size); }))
            piece.arr.forEach(function (elem) { return elem.x += keyCode != 37 ? size : -size; });
    }
    else if (keyCode === 38)
        piece.arr = piece.rotate(piece.arr);
    else if (keyCode === 40)
        piece.down();
    else if (keyCode === 80)
        pause = pause ? false : true;
    else if (keyCode === 32)
        restart();
    else if (keyCode === 66) {
        bot = bot ? false : true;
        piece.find_place();
    }
}
var angle = 0;
var squares = 10;
var colors;
var size = 20;
var extra_w = 130;
var extra_h = 0;
var fall = 10;
var increase = 6;
var grid = Array();
var piece;
var tetris_w, tetris_h;
var level = 1;
var destroyed = 0;
var pause = false;
var bot = false;
var pieces = [[[0, size], [0, 0], [0, size * 2], [size, size * 2], [239, 160, 0]],
    [[size, size], [size, 0], [size, size * 2], [0, size * 2], [1, 1, 240]],
    [[0, 0], [-size, 0], [size, 0], [0, size], [160, 0, 241]],
    [[0, size], [-size, 0], [0, 0], [size, size], [240, 1, 0]],
    [[0, size], [-size, size], [0, 0], [size, 0], [0, 240, 0]],
    [[0, 0], [size, 0], [0, size], [size, size], [240, 240, 1]],
    [[0, -size], [0, 0], [0, size], [0, size * 2], [1, 240, 241]]];
function setup() {
    piece = new Piece();
    createCanvas(330, 400);
    tetris_w = width - extra_w;
    tetris_h = height - extra_h;
    piece.setup();
    textAlign(CENTER, CENTER);
    textSize(size);
}
function draw() {
    if (pause)
        return;
    background(0);
    stroke(255);
    line(tetris_w + 1, 0, tetris_w + 1, height);
    stroke(0);
    piece.draw();
    fill(226, 214, 36);
    text("Destroyed: " + destroyed, tetris_w + extra_w / 2, height - size / 1.7);
    text("Level: " + level, tetris_w + extra_w / 2, height - size * 1.7);
    grid.forEach(function (elem) {
        fill(elem.color);
        rect(elem.x, elem.y, size, size);
    });
    level = ceil((destroyed + 1) / increase);
}
var restart = function () {
    piece.setup();
    grid = Array();
    destroyed = 0;
    pause = false;
};
function array_neighbours(array) {
}
function all_neighbours(block) {
    var sk = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (i !== 0 || j !== 0) {
                for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
                    var elem = grid_1[_i];
                    if ((elem.x === block.x + i * size && elem.y === block.y + j * size) ||
                        block.x + i * size === -size || block.x + i * size === width ||
                        block.y + j * size === -size || block.y + j * size === height) {
                        sk++;
                        break;
                    }
                }
            }
        }
    }
    return sk;
}
//# sourceMappingURL=build.js.map