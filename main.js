var div = $('#elements')[0];
var canvas = $('#canvas')[0];
var presenter = new Presenter(canvas,div);      

var d1 = presenter.createModule(new Pos(100,50),'Data',[1,2]);
var d2 = presenter.createModule(new Pos(300,50),'Data',[3,4]);
var output = presenter.createModule(new Pos(200,150),'Data','output');
var sum = presenter.createModule(new Pos(400,120),'Sum');

presenter.createConnection(sum,output);
presenter.createConnection(d1,sum);
presenter.createConnection(d2,sum);
