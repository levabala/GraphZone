function Module(pos,id,params,initConnection){

    //setup dom element
    this.dom = document.createElement('ElDOM');
    this.dom.innerHTML = 'module';    
    this.dom.moduleId = id;    
    this.dom.className = 'module';
    this.dom.style.bordersWidth = '1px 3px 3px 1px';
    this.dom.style.borderLeftWidth = '1px';
    this.dom.style.borderRightWidth = '3px';
    this.dom.style.top = pos.y + 'px';
    this.dom.style.left = pos.x + 'px';    
    this.dom.startPos = pos;
    this.dom.pos = pos;        
    
    //children
    this.children = [];
    
    //create links
    var elDom = this.dom;
    var module = this;
    
    //setup channels and other 
    this.outputs = [];
    this.inputs = [];
    this.id = id;      
    this.pos = pos;   
    this.dom.resizable = false;
    this.title = GenerateTitle(params);    
    if (!this.title) this.title = 'Module';
    
    //setup content 
    this.dom.innerHTML = this.title;
    
    //setup events for the dom
    this.dom.ondblclick = function(e){
        console.log('dblclick')
        initConnection(module.id);
    }
    
    /*
    this.dom.addEventListener('dblclick', function(e){            
        initConnection(module.id);               
    });        
    
    
    this.getPos = function(){
        return {x: this.pos.x + this.dom.getAttribute('data-x'),y: this.pos.y + this.dom.getAttribute('data-y')}
    }*/
}