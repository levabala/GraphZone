function Module(pos,id,params,initConnection){        
    //setup dom element
    this.dom = document.createElement('ElDOM');
    this.dom.style.padding = '10px';    
    this.dom.style.font = '20px Arial';
    this.dom.style.color =  'black';
    this.dom.style.position = 'absolute';        
    this.dom.style.border = 'solid black 1px';
    this.dom.style.backgroundColor = 'white';
    this.dom.style.position = 'absolute';
    this.dom.style['-webkit-user-select'] = 'none';    
    this.dom.style['-moz-user-select'] = 'none';    
    this.dom.style['-ms-user-select'] = 'none';
    this.dom.pos = pos;
    this.dom.dx = 0;
    this.dom.dy = 0;
    this.dom.moduleId = id;
    this.dom.syncPosition = function(){
        this.style.position = 'absolute';
        this.style.top = this.pos.y+'px';
        this.style.left = this.pos.x+'px';
    }     
    this.dom.syncPosition();
    
    //create links
    var elDom = this.dom;
    var module = this;
    
    //setup channels and other 
    this.outputs = [];
    this.inputs = [];
    this.id = id;     
    this.title = GenerateTitle(params);
    if (!this.title) this.title = 'Module';
    
    //setup content 
    this.dom.innerHTML = this.title;
    
    //setup events for the dom
    this.dom.addEventListener('mousedown', function(e){   
                              
        elDom.selected = true;
        //save pos        
        elDom.temppos = JSON.parse(JSON.stringify(elDom.pos));
        //save moving start point
        elDom.startP = new Pos(e.pageX,e.pageY);
        
        document.onmousemove = function(e){                                    
            if (elDom.selected == true){                         
                //console.log(elDom.temppos.x,elDom.temppos.y);   
                elDom.dx = e.pageX - elDom.startP.x;
                elDom.dy = e.pageY - elDom.startP.y;
                elDom.pos.x = elDom.temppos.x + elDom.dx;
                elDom.pos.y = elDom.temppos.y + elDom.dy;                
                elDom.syncPosition();
            }
        };
        document.onmouseup = function(){            
            elDom.selected = false;        
            elDom.pos = {
                x: elDom.temppos.x + elDom.dx,
                y: elDom.temppos.y + elDom.dy
            }        
            elDom.dx = 0;
            elDom.dy = 0;
            
            document.onmousemove = null;
            document.onmouseup = null;            
        };       
    });       
    this.dom.addEventListener('dblclick', function(e){            
        initConnection(module.id);               
    });
}