var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.drawElem = function(obj){
    this.beginPath();
    this.font="20px Arial";
    this.lineWidth = 1;    
    this.fillText(obj.title,obj.pos.x,obj.pos.y);
    this.strokeStyle = '#CFECD1';        
    this.moveTo(obj.pos.x, obj.pos.y);
    this.lineTo(obj.pos.x + obj.width, obj.pos.y);
    this.lineTo(obj.pos.x + obj.width, obj.pos.y - obj.height);
    this.lineTo(obj.pos.x, obj.pos.y - obj.height);
    this.lineTo(obj.pos.x, obj.pos.y);
    this.stroke();
    this.closePath();
}     

canvas.addEventListener('mousedown', function(event){        
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    
    var xC = 0;
    var yC = 0;       
    
    Mussyandriya.forEach(function(element) {        
        if (y < element.pos.y+5 && y > element.pos.y - element.height 
            && x > element.pos.x && x < element.pos.x + element.width + 5 ) {            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            xC = event.pageX-x;
            yC = event.pageY-y;            
            for (var m in Mussyandriya){
                ctx.drawElem(Mussyandriya[m]);
            }   
            document.onmousemove = function(e) {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                element.drag(e.pageX-x-xC,e.pageY-y-yC);
                for (var m in Mussyandriya)
                    ctx.drawElem(Mussyandriya[m]);            
            }
            canvas.onmouseup = function() {
                element.endDrag();
                document.onmousemove = null;
                canvas.onmouseup = null;
            }
        }        
    });
}) 

var num1 = new Num(new Pos(10,80), '12');
var num2 = new Num(new Pos(20,40), 52);
var num3 = new Num(new Pos(50,20), '1');
var plus = new Plus(new Pos(100,100));

plus.methods.ConnectionFrom(num1)
plus.methods.ConnectionFrom(num2)
plus.methods.ConnectionFrom(num3)

plus.methods.Calc('value');

for (var m in Mussyandriya){
    ctx.drawElem(Mussyandriya[m]);
}

window.addEventListener('resize', function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (var m in Mussyandriya){
        ctx.drawElem(Mussyandriya[m]);
    }        
});
