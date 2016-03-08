function Pos(x,y){
    this.x = x;
    this.y = y;
    this.sumWith = function(xx,yy){
        this.x += xx;
        this.y += yy;
    };
}