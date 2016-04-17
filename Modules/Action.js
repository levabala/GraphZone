function Action(pos, id, params, initConnection, giveMe, focusMe,deleteMe,wp){ 
    Module.apply(this,arguments);
    var act = this;
    this.result = 0;    
    this.type = 'Action';
    this.dom.type = this.type;
    this.dom.inputable = true;
    this.Calc = function(){
        //here should be some manipulations with data of inputs (in children of the module)
    };
    this.Share = function(){        
        for (var o in this.outputs){
            console.log('shared to',this.outputs[o].id)
            this.outputs[o].changeTo(this.result,this.id);                
        }
    };
    this.Process = function(){
        this.Calc();
        this.Share();
        this.dom.view.innerHTML = GenerateTitle(this.result);
    };
    
    this.addInput = function(wp){
        if (!wp.data[0].lastModifiedDate) return false;
        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = wp.dom.type;
        title.addEventListener('click',function(){
            console.log('CLICK')
            this.children.removeChild(title);
            this.inputs = this.inputs.splice(wp);
            if (this.lostInput) this.lostInput(wp.id);
        },true);        
        this.children.appendChild(title);        
        this.inputs.push(wp);                
        this.Process();
        return true;
    };
    
    this.lostInput = function(id){
        this.Process();  
    };
    
    this.dom.addEventListener("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        act.dom.style.backgroundColor = 'lightblue';
        wp.dom.style.backgroundColor = 'white';
    }, true);
    this.dom.addEventListener("dragleave", function(event) {
        event.preventDefault();
        event.stopPropagation();
        act.dom.style.backgroundColor = 'white';
    }, true);
    this.dom.addEventListener("drop", function(event) {
        event.preventDefault();
        event.stopPropagation();
        wp.dom.style.backgroundColor = 'white';
        act.dom.style.backgroundColor = 'white';                
        var files = event.dataTransfer.files;
        mousePos = { x: event.clientX, y: event.clientY };

        m = act.wp.createModule(mousePos, 'Data', files);
        focusMe(m.id);
        giveMe(act.id);                                
    }, true);    
}