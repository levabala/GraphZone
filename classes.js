var Mussyandriya = [];

var Modules = {
    'Musya': Musya,
    'Num': Num,
    'Action': Action,
    'Plus': Plus
};

function Musya(pos){
    this.title = 'Mussya';
    this.pos = pos;
    this.temppos = JSON.parse(JSON.stringify(pos));
    this.state = {};    
    this.data = {};
    this.methods = {};         
    this.outputs = [];
    this.inputs = [];
    this.dom = {};        
    this.height = 17;        
    this.style = {
        padding: '4px',
        font: '20px Arial',
        color: 'black',
        position: 'absolute',        
        border: 'solid black 1px',
        backgroundColor: 'white',
        '-webkit-user-select': 'none',    
        '-moz-user-select': 'none',    
        '-ms-user-select': 'none'          
    }                            
    this.drag = function(dx,dy){                        
        this.pos.x = this.temppos.x + dx;
        this.pos.y = this.temppos.y + dy;                                
    }            
    
    this.endDrag = function(){
        this.temppos = JSON.parse(JSON.stringify(this.pos));
    }
    
    this.calcWidth = function(){
        this.width = this.title.length * 11; //20px is font size
    }
    this.render = function(ctx){                
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.font = '20px Arial'
        ctx.fillText(this.title,0,this.height,ctx.width);         
        ctx.stroke();
        ctx.closePath();               
    };
    this.showState = function(){
        this.dom.innerHTML = this.title;
    }
    this.calcWidth();
    
    Mussyandriya[Mussyandriya.length] = this;   
}
    
function Num(pos,param){
    if (param == null) return false;
    Musya.apply(this, arguments);
    if (typeof param == 'string'){        
        num = JSON.parse('[' + param + ']')[0];        
    }    
    else var num = param[0];
    this.state = {written: (num != null)};
    this.data = {value: num};         
    if (num == null) num = 0;
    this.title = num.toString();
    this.calcWidth();
    var nu = this;
    this.info = function(data){
        if (data == null) return;
        this.data = {value: data}
        this.title = data.toString();
        this.dom.innerHTML=data.toString();
        console.log('info!')
        console.log(data)
    }    
    this.methods.setValue = function(val){
        if (typeof val != 'number') return false;
        nu.data.value = val;        
        nu.title = val;
    };       
}
Num.__proto__ = Musya;


function Action(pos){
    Musya.apply(this, arguments);  
    this.pos = pos;
    this.title = 'Action'
    this.calcWidth();
    this.objects = [];
    var inputs = this.inputs;
    this.methods.ConnectionFrom = function(obj){       
        inputs[inputs.length] = obj;
    };              
}
Action.__proto__ = Musya;



function Plus(pos){
    Action.apply(this, arguments);  //наследование свойств от родителя
    this.title = 'Plus';    
    this.calcWidth();
    var pl = this;                  //создание ссылки на this    
    this.methods.Calc = function(dataType){                 
        var result = pl.inputs[0].data[dataType];  //получаем первое значение списка подключенных, которых мы будем суммировать..
                                                   //.. оно определяет тип сложения
        for (var i = 1; i < pl.inputs.length; i++) {
            var value = pl.inputs[i].data[dataType];
            if (typeof value != typeof result) continue;  //проверяем на совпадение по типу             
            result += value;                              //суммируем                                                            
        }
        console.log(pl.outputs)
        for (var o in pl.outputs){   //рассылаем всем подключенным со стороны отдачи данных
            pl.outputs[o].info(result);
        }        
        console.log('res:',result)
        pl.data.result = result;     //записываем результат в качестве кэша
    }    
    this.methods.Share = function(){
        for (var o in pl.outputs){   //рассылаем всем подключенным со стороны отдачи данных
            pl.outputs[o].info(pl.data.result);
        }        
    }
};           
Plus.__proto__ = Action;


function Pos(x,y){
    this.x = x;
    this.y = y;
    this.sumWith = function(xx,yy){
        this.x += xx;
        this.y += yy;
    };
}

function Engine(can, div){
    this.createCount = 0;
    this.elements = [];
    this.connections = [];
    this.selectedItem = {};
    this.lastConn = {};;
    this.active = false;
    this.can = can;
    this.div = div;
    this.mousePos = {};
    this.ctx = can.getContext('2d');
    
    var engine = this;
    
    document.addEventListener('mousemove',function(e){        
        engine.mousePos = {x:e.pageX-engine.can.offsetLeft,y:e.pageY-engine.can.offsetTop};        
    });
    
    window.oncontextmenu = function () {
        engine.cancelConnection();        
        return false;
    }
    
    this.createModule = function(type,pos,param){
        //check existing of module
        if (Modules[type] == null) {
            console.warn('No such module')
            return false;
        }
        //creating instance of module        
        var module = new Modules[type](pos,param);
        var canChild = document.createElement('module');        
        //set style
        for (var s in module.style){
            canChild.style[s] = module.style[s];
        }                
        canChild.style.top = pos.y + 'px';
        canChild.style.left = pos.x + 'px';        
        canChild.style.cursor = 'pointer';
        console.log(module.width);
        //set additional attributes 
        canChild.selected = false;
        canChild.module = module;
        module.dom = canChild;
        //add DOM to the div-container
        div.appendChild(canChild);
        //showing a state of the module
        module.showState();
        
        //setting listeners
        canChild.addEventListener('click', function (event) {            
            if (engine.active == true){                          
                if (engine.selectedItem == this) {                    
                    module.endDrag();
                    canChild.style.cursor = 'pointer';
                    document.onmousemove = null;
                    canChild.selected = false;
                    engine.active = false;
                    return;
                }                    
                engine.active = false;
                engine.lastConn.to = module;
                module.inputs.push(engine.lastConn.from);
                engine.lastConn.from.outputs.push(module);
                
                if (module.methods.Calc != null) module.methods.Calc('value');
                if (engine.lastConn.from.methods.Share != null) engine.lastConn.from.methods.Share();                
                return;
            }
            if (canChild.selected == true) {                
                module.endDrag();
                canChild.style.cursor = 'pointer';
                document.onmousemove = null;
                canChild.selected = false;
                return;
            }            
            var x = event.pageX;
            var y = event.pageY;
            canChild.style.cursor = 'move';

            var dx, dy;
            document.onmousemove = function (e) {
                dx = e.pageX - x;
                dy = e.pageY - y;
                module.drag(dx, dy);
                canChild.style.top = module.pos.y + 'px';
                canChild.style.left = module.pos.x + 'px';
            }
            canChild.selected = true;
        });
        
        canChild.addEventListener('dblclick',function(e){            
            engine.active = true;
            engine.selectedItem = this; 
            engine.connections.push({from: module});
            engine.lastConn = engine.connections[engine.connections.length-1];                        
        });                
    }            
    
    this.cancelConnection = function(){
        this.active = false;
        this.connections.splice(this.connections.length-1,1);
    }    
    
    this.updateCtx = function(){
        this.ctx.clearRect(0, 0, can.width, can.height);        
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'darkgreen';
        for (var c in this.connections){            
            var conn = this.connections[c];
            var connV;
            var connVMain;        
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.pos.x, conn.from.pos.y);                        
            if (conn.to == null){                
                connV = new Vector(conn.from.pos,this.mousePos);     
                connVMain = new Vector(conn.from.pos,null,connV.angle,connV.length/2);                               
                this.ctx.lineWidth = 2;                                
                this.ctx.lineTo(this.mousePos.x, this.mousePos.y);                
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.lineWidth = 4;                   
                this.ctx.moveTo(conn.from.pos.x, conn.from.pos.y);                
                this.ctx.lineTo(connVMain.end.x,connVMain.end.y);
                this.ctx.stroke();                                               
            }
            else {
                connV = new Vector(conn.from.pos,conn.to.pos);     
                connVMain = new Vector(conn.from.pos,null,connV.angle,connV.length/2);
                this.ctx.lineWidth = 2;                
                this.ctx.lineTo(conn.to.pos.x, conn.to.pos.y);
                this.ctx.moveTo(conn.from.pos.x, conn.from.pos.y);
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.lineWidth = 4;                   
                this.ctx.moveTo(conn.from.pos.x, conn.from.pos.y);                
                this.ctx.lineTo(connVMain.end.x,connVMain.end.y);
                this.ctx.stroke();                               
            }            
        }        
    }
}

