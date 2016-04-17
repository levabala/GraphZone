function Presenter(can,div){
    var ctx = can.getContext('2d');
    var createCount = 0;
    var elements = {};
    var connections = {};
    var activeId = null;
    var presenter = this;
    var offsetX = can.offsetLeft;
    var offsetY = can.offsetTop;
    var mousePos = {};
    var Modules = {
        'Data': Data,
        'Sum': Sum,
        'Graphic': Graphic,
        'DataList': DataList,
        'Container': Container,
        'Worker': WorkerM
    }
    var ParamsNeed = [
        'Data',
        'Graphic',
        'Worker'        
    ]
    
    this.getElem = function(id){
        return elements[id];
    }
    
    this.createModule = function(pos,type,data){                 
        if (Modules[type] == null) return;              
        var module = new Modules[type](pos,createCount,data,initConnection);
        elements[createCount] = module;        
        div.appendChild(module.dom);
        createCount++;
        
        return createCount-1;                 
    }
    
    this.createConnection = function(id1,id2){
        if (elements[id1] == null || elements[id2] == null) return; //checking for existing
        if (connections[id1] == null) connections[id1] = [];      
        if ((connections[id1].indexOf(id2) != -1) || (connections[id2] != null && connections[id2].indexOf(id1) != -1)) return;        
        connections[id1].push(id2);
        console.log('from',id1,'to',id2);        
        elements[id1].outputs.push(elements[id2]);
        elements[id2].inputs.push(elements[id1]);        
        if (elements[id2].Process != null) elements[id2].Process();
        if (elements[id1].Share != null) elements[id1].Share();
        activeId = null;        
        deleteEvents();        
    }
    
    function cancelConnection(){
        activeId = null;
        deleteEvents();
    }
    
    function initConnection(id){              
        if (activeId != null) return;        
        activeId = id;        
        hangEvents();
    }   
    
    function finishConnection(e){   
        console.log('finishing',e.target)   
        var id = e.target.moduleId; 
        if (typeof id == 'undefined'){
            console.log('checking...')
            var node = e.target;
            var name = node.tagName;                        
            while(name != 'ELDOM'){
                node = node.parentNode;
                name = node.tagName;                
                if (name == null) {                    
                    return;
                }
            }
            id = node.moduleId;            
        }                  
        presenter.createConnection(activeId,id);                
    }
    
    function posToCenter(elem,pos){
        var pp = {};
        pp.x = pos.x + (elem.offsetWidth || fromPxToNumber(elem.style.width))/3;
        pp.y = pos.y + (elem.offsetHeight || fromPxToNumber(elem.style.height))/3;
        return pp;        
    }
     
    function renderConnections(){
        ctx.clearRect(0, 0, can.width, can.height);                
        ctx.strokeStyle = 'darkgreen';
        var V;
        var VMain;
        for (var id1 in connections){            
            for (var i in connections[id1]){                
                var id2 = connections[id1][i];    
                var dom1 = elements[id1].dom;
                var dom2 = elements[id2].dom;                                            
                var pos1 = posToCenter(dom1,dom1.pos);
                var pos2 = posToCenter(dom2,dom2.pos);
                connV = new Vector(pos1,pos2);     
                connVMain = new Vector(pos1,null,connV.angle,connV.length/2);                                                                
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(pos1.x,pos1.y);
                ctx.lineTo(pos2.x,pos2.y);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.lineWidth = 4;                   
                ctx.moveTo(pos1.x, pos1.y);                
                ctx.lineTo(connVMain.end.x,connVMain.end.y);
                ctx.stroke();  
            }
        }
        if (activeId != null){
            var pos1 = posToCenter(elements[activeId].dom,elements[activeId].dom.pos);
            connV = new Vector(pos1,mousePos);     
            connVMain = new Vector(pos1,null,connV.angle,connV.length/2);            
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(pos1.x,pos1.y);
            ctx.lineTo(mousePos.x,mousePos.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = 4;                   
            ctx.moveTo(pos1.x, pos1.y);                
            ctx.lineTo(connVMain.end.x,connVMain.end.y);
            ctx.stroke(); 
        }
    }
    
    function hangEvents(){
        for (var e in elements){
            if (e == activeId) continue;
            var el = elements[e];            
            el.dom.addEventListener('click',finishConnection);
            for (var c in el.children){
                var elc = el.children[c];
                console.log(elc)           
                elc.dom.onclick = el.dom.onclick;
            }
        }
    }
    
    function deleteEvents(){
        for (var e in elements){
            var el = elements[e];
            el.dom.removeEventListener('click',finishConnection);
            for (var c in el.children){                
                var elc = el.children[c];                            
                elc.dom.onclick = null;
            }
        }
    }
    
    document.addEventListener('mousemove', function(e){
        mousePos = {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY,
        }
    });
    
    document.oncontextmenu = function(e) {        
        if (activeId != null) {
            cancelConnection();
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
                elem.innerHTML = m;             
                elem.moduleName = m;           
                elem.onclick = function(e){
                    var params;                                        
                    if (ParamsNeed.indexOf(this.moduleName) != -1){
                        if (this.moduleName == 'Worker'){
                            var str = prompt("Enter worker name(without .js):");
                            presenter.createModule({x:e.pageX,y:e.pageY},this.moduleName,new Worker(str+'.js'));
                            return;
                        }
                        params = prompt("Enter params(separated by comma):");   
                        try{                            
                            params = JSON.parse(params);                            
                        }                     
                        catch(e){
                            try{
                                params = JSON.parse('['+params+']');
                            }
                            catch(e){
                                alert('Bad params');                                
                                return;
                            }
                        }        
                        if (params.length == 1) params = params[0];                                            
                    }
                    presenter.createModule({x:e.pageX,y:e.pageY},this.moduleName,params);
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
    window.addEventListener('click', function(){
        if ($('#contextmenu')[0]) $('#contextmenu')[0].style.visibility = 'hidden';
    });
    
    setInterval(renderConnections,16);
}