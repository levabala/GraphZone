var div = $('#elements')[0];
var canvas = $('#canvas')[0];
var presenter = new Presenter(canvas, div);
var mousePos = {};

/*var funs = [
    function(x) {
        return x * x;
    },
    function(x) {
        return Math.sin(x) * 10;
    },
    function(x) {
        return Math.cos(x) * 15;
    },
    function(x) {
        if (x == 0) return null;
        return 100 / x;
    }
]

for (var f in funs){
    var data = [];
    for (var i = 0; i < 100; i++){        
        var res = funs[f](i/10)      
        if (typeof res == 'undefined') console.log(i)  
        if (res != null)data.push(res);    
    }
    presenter.createModule(new Pos(100,50*f+50),'Data',data);
}

var sum1 = presenter.createModule(new Pos(300,100),'Sum');
var sum2 = presenter.createModule(new Pos(300,200),'Sum');*/


var worker = new Worker('OneDWorker.js');
var g1 = presenter.createModule(new Pos(400, 50), 'Graphic');
var w1 = presenter.createModule(new Pos(200, 150), 'Worker', worker);
var d1 = presenter.createModule(new Pos(200,50),'Data',[12313,322123,32,3,321,323,1,15,35,453,634,64,0,1,2,3,4]);

document.addEventListener("dragover", function(event) {
    event.preventDefault(); // отменяем действие по умолчанию
}, false);
document.addEventListener("drop", function(event) {
    event.preventDefault();    
    var files = event.dataTransfer.files;    
    mousePos = {x:event.clientX,y:event.clientY};
        
    presenter.createModule(mousePos,'DataList', files);       
}, false);