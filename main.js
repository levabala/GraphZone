//set connection to DOM elements
var can = $('#canvas')[0];
var ctx = can.getContext('2d');
var div = $('#children')[0];

//creating the Engine for controlling modules
var engine = new Engine(can,div);

//tested modules
engine.createModule('Num', new Pos(20,200), [10]);
engine.createModule('Num', new Pos(50,60), [15]);
engine.createModule('Plus', new Pos(400,90));

//update main canvas
engine.updateCtx();
setInterval(function(){engine.updateCtx()}, 16);