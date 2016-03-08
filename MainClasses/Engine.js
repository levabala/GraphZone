function Engine(can,div){
    this.elements = [];
    this.selectedItem = {};
    this.connections = [];
    this.activeConn = {};
    this.can = can;
    this.ctx = can.getContext('2d');
    this.div = div;
    var engine = this;
    
    //listeners
    document.addEventListener('mousemove',function(e){        
        engine.mousePos = {x:e.pageX-engine.can.offsetLeft,y:e.pageY-engine.can.offsetTop};        
    });
    document.oncontextmenu = function(e) {        
        if (engine.active == true) {
            engine.cancelConnection();
            return false;
        }
        var menu        
        if ($('#contextmenu')[0] == null) {
            menu = document.createElement('contextMenu');
            menu.id = 'contextmenu';
            menu.style.textAlign = 'center';                        
            for (var m in Modules){
                var elem = document.createElement('div');
                elem.className = 'menuElem';
                elem.innerText = m;             
                elem.moduleName = m;           
                elem.onclick = function(e){
                    var params;                                        
                    if (ParamsNeed.indexOf(this.moduleName) != -1){
                        params = prompt("Enter params(separated by comma):");                        
                        params = JSON.parse('['+params+']');        
                        if (params.length == 1) params = params[0];                    
                    }
                    engine.createModule(this.moduleName,{x:e.pageX,y:e.pageY},params);
                }
                menu.appendChild(elem);                                
            }
            document.body.appendChild(menu);
        }
        else menu = $('#contextmenu')[0];
        menu.style.top = e.pageY + 'px';
        menu.style.left = e.pageX + 'px';        
        menu.style.visibility = 'visible';                
        return false;
    }    
    window.onclick = function(){
        if ($('#contextmenu')[0]) $('#contextmenu')[0].style.visibility = 'hidden';
    }
    
    this.createModule = function(type,pos,params){
        //check existing of module
        if (Modules[type] == null) {
            console.warn('No such module')
            return false;
        }
        //creating instance of module        
        var module = new Modules[type](pos,params);        
        var canChild = document.createElement('module');
        this.elements.push(module);        
        //set style
        for (var s in module.style){
            canChild.style[s] = module.style[s];
        }                
        canChild.style.top = pos.y + 'px';
        canChild.style.left = pos.x + 'px';        
        canChild.style.cursor = 'pointer';        
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
            if (engine.activeConn.from != null){       
                console.log('Connection is active');                        
                if (engine.activeConn.from == this.module){
                    console.log('Connection to itself');
                    engine.cancelConn();
                    engine.selectedItem = null;
                    document.onmousemove = null;
                    return;
                }
                console.log('Finishing the connection');
                engine.activeConn.finish(this.module);
                this.module.inputs.push(engine.activeConn.from);
                engine.activeConn.from.outputs.push(this.module);
                if (this.module.methods.Calc != null) this.module.methods.Calc('value');
                if (engine.activeConn.from.methods.Share != null) engine.activeConn.from.methods.Share(); 
                engine.activeConn = {};
                engine.selectedItem = null;
                document.onmousemove = null;
                return;
            }            
            if (engine.selectedItem == this){
                module.endDrag();
                engine.selectedItem = null;
                document.onmousemove = null;
                canChild.style.cursor = 'pointer';
                return;
            }
            engine.selectedItem = this;            
            var x = event.pageX;
            var y = event.pageY;
            var dx, dy;
            canChild.style.cursor = 'move';            
            document.onmousemove = function (e) {
                dx = e.pageX - x;
                dy = e.pageY - y;
                module.drag(dx, dy);
                canChild.style.top = module.pos.y + 'px';
                canChild.style.left = module.pos.x + 'px';
            }
        });
        canChild.addEventListener('dblclick',function(e){                                    
            if (engine.activeConn == {}) return;
            console.log('dblclick')
            engine.activeConn = new Connection(this.module);
            engine.selectedItem = this; 
            engine.connections.push(engine.activeConn);                                 
        });  
        return module;
    };
    this.cancelConn = function(){
        console.log('cancel connection')
        if (this.activeConn.from == null) return;
        this.connections.splice(this.connections.indexOf(this.activeConn),1);
        this.activeConn = {};
    };
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
            if (conn.to.pos == null){                
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