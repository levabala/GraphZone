function Module(pos, id, params, initConnection, giveMe, focusMe,deleteMe,wp) {
    //setup dom element
    this.dom = document.createElement('ElDOM');
    this.dom.moduleId = id;
    this.dom.className = 'module';
    this.dom.style.bordersWidth = '1px 3px 3px 1px';
    this.dom.style.borderLeftWidth = '1px';
    this.dom.style.borderRightWidth = '3px';
    this.dom.style.top = pos.y + 'px';
    this.dom.style.left = pos.x + 'px';
    this.dom.startPos = pos;
    this.dom.pos = pos;
    this.dom.focusMe = focusMe;

    //children
    this.children = document.createElement('div');
    this.children.className = 'children';        
    this.view = document.createElement('div');
    this.view.className = 'view';
    this.dom.appendChild(this.children);
    this.dom.appendChild(this.view);
    this.dom.view = this.view;
    this.dom.children = this.children;       

    //create links
    var elDom = this.dom;
    var module = this;

    //setup channels and other 
    this.type = 'Module';
    this.dom.type = this.type;
    this.wp = wp;
    this.outputs = [];    
    this.inputs = [];
    this.id = id;
    this.pos = pos;
    this.dom.resizable = false;
    this.dom.moving = false;
    this.dom.inputable = false;
    this.title = GenerateTitle(params);
    if (!this.title) this.title = 'Module';

    //setup content 
    this.dom.view.innerHTML = this.title;

    //setup events for the dom
    this.dom.ondblclick = function (e) {
        console.log('dblclick');
        initConnection(module.id);
    };

    this.dom.onmouseup = function () {
        giveMe(module.id);
        module.dom.style.backgroundColor = 'white';
        module.dom.moving = false;
    };

    this.addInput = function (wp) {
        if (!this.dom.inputable) return;
        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = wp.dom.type;
        title.addEventListener('click', function () {
            this.children.removeChild(title);
            this.inputs = this.inputs.splice(wp);
            if (this.lostInput) this.lostInput(wp.id);
        }, true);
        this.children.appendChild(title);
        this.view.style.height = $(this.dom).height() + 'px';
        this.view.style.lineHeight = $(this.dom).height() + 'px';
        this.inputs.push(wp);
        if (this.Process) this.Process();
    };

    this.dom.resizeEvent = function (event) {
        var dom = module.dom;
        var res = module.dom.checkResizeCapability(event.rect.width, event.rect.height);
        if (!res[0] && !res[1]) return;
        
        var x = (parseFloat(dom.getAttribute('data-x')) || 0),
            y = (parseFloat(dom.getAttribute('data-y')) || 0);

        // update the element's style
        if (res[0]) dom.style.width = event.rect.width + 'px';
        if (res[1]) dom.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges        
        if (res[0]) x += event.deltaRect.left;
        if (res[1]) y += event.deltaRect.top;
                
        var w = 0;
        var h = 0;
        
        if (res[0]) w = event.rect.width; 
        if (res[1]) h = event.rect.height;
        
        dom.style.webkitTransform = dom.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        dom.setAttribute('data-x', x);
        dom.setAttribute('data-y', y);

        module.dom.internalResizing(w,h,dom,event);
    };

    this.dom.internalResizing = function(w, h, target) {
        for (var c = 0; c < target.childNodes.length; c++) {
            var node = target.childNodes[c];
            if (node.resizeEvent)
                node.resizeEvent(w, h);
        }
    };

    this.dom.checkResizeCapability = function(w, h) {
        return [w > 50, h > 20];
    };

    /*
    this.dom.addEventListener('dblclick', function(e){            
        initConnection(module.id);               
    });        
    
    
    this.getPos = function(){
        return {x: this.pos.x + this.dom.getAttribute('data-x'),y: this.pos.y + this.dom.getAttribute('data-y')}
    }*/
}