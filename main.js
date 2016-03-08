//set connection to DOM elements
var can = $('#canvas')[0];
var ctx = can.getContext('2d');
var div = $('#children')[0];

//creating the Engine for controlling modules
var engine = new Engine(can,div);

//tested modules
var d1 = engine.createModule('Data', new Pos(150,200), {value:10});
var d2 = engine.createModule('Data', new Pos(150,100), {value:15});
engine.createModule('Data', new Pos(550,150), {value:0});
var plusWithNums = engine.createModule('Plus', new Pos(400,150));
engine.createModule('Data', new Pos(350,500), {value:'Hello '});
engine.createModule('Data', new Pos(350,400), {value:'Lev!'});
var output = engine.createModule('Data', new Pos(650,450), {value:'For result'});
var plus = engine.createModule('Plus', new Pos(500,450));
engine.connections.push({
    from: plus,
    to: output
})  
plus.outputs.push(output)

//update main canvas
engine.updateCtx();
setInterval(function(){engine.updateCtx()}, 16);