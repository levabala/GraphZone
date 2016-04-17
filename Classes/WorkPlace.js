function Workplace(id, mWP, field) {
    //base settings
    var wp = this;
    this.Modules = {
        'Data': Data,
        'OneDWorker': WorkerOneD,
        'Graphic': Graphic
    };

    this.id = id;
    this.updateInterval = null;
    this.size = {
        width: mWP.width(),
        height: mWP.height()
    };
    var title = 'Workplace ' + id + '   ' + this.size.width.toFixed(0) + 'x' + this.size.height.toFixed(0);

    var canvas = document.createElement('canvas');
    canvas.height = mWP.height();
    canvas.width = mWP.width();
    this.dom = document.createElement('div');
    this.dom.style.height = mWP.height() + 'px';
    this.dom.style.width = mWP.width() + 'px';
    this.dom.appendChild(canvas);

    var activeId = null;


    //moduling
    var modules = {};
    var modulesC = 0;


    //functions
    this.createModule = function(pos, type, params) {
        if (!this.Modules[type]) return;
        var module = new this.Modules[type](pos, modulesC, params, initConnection, giveMe, focusMe,deleteMe,wp);                

        modules[modulesC] = module;
        this.dom.appendChild(module.dom);        
        modulesC++;

        return module;
    };

    function initConnection(id) {

    }

    //rendering
    this.render = function() {
        var h = 30;
        var ctx = canvas.getContext('2d');
        ctx.font = h + "px Arial";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(title, 10, h);

        /*
        ctx.rect(100, 100, 200, 200)
        ctx.arc(500, 500, 10, 0, Math.PI * 2);
        ctx.lineTo(100, 200);
        for (var i in path){
            var p = path[i];
            if (p[2]) ctx.moveTo(p[0],p[1]);
            else ctx.lineTo(p[0],p[1]);
        }
        ctx.stroke();
        */
    };
    this.render();

    /*
    //drawing
    canvas.onmousedown = function(){
        document.onmousemove = drawOn;
    }
    canvas.onmouseup = function(){
        document.onmousemove = null;
        lastPoint = [];
    }
    
    var lastPoint = [];
    var path = [];
    function drawOn(e){
        var ctx = canvas.getContext('2d');/*
        var styleW = parseFloat(wp.dom.style.width.replace('px',''));
        var styleH = parseFloat(wp.dom.style.height.replace('px',''));
        var CcoeffX = styleW / canvas.width;
        var CcoeffY = styleH / canvas.height; 
        console.log(e.screenX,wp.dom.offsetLeft,canvas.offsetLeft)
        var x = e.screenX - wp.dom.offsetLeft - canvas.offsetLeft;
        var y = e.screenY - wp.dom.offsetTop - canvas.offsetTop;        
        ctx.beginPath();
        if (lastPoint.length == 0) {
            lastPoint = [x,y,true];            
        }
        else {
            ctx.moveTo(lastPoint[0],lastPoint[1]);
            ctx.lineTo(x,y);
            lastPoint = [x,y];
        }
        path.push(lastPoint);
        ctx.stroke();  
    }*/

    this.settingImage = function() {
        /*var img = document.createElement('img');  //old making
        var pngcode = getPNG(canvas);                
        img.src = pngcode;*/
        domtoimage.toPng(wp.dom)
            .then(function(dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                img.id = wp.id;
                img.draggable = false;
                if (!img.width || !img.height) {
                    img.width = canvas.width;
                    img.height = canvas.height;
                }
                wp.view = img;
                wp.view.baseWidth = img.width;
                wp.view.baseHeight = img.height;
            })
            .catch(function(error) {
                console.error('oops, something went wrong!', error);
            });
    };
    this.settingImage();

    function giveMe(id) {
        if (activeId !== null && id != activeId) {
            var res = modules[id].addInput(modules[activeId]);            
            if (res !== false) {
                wp.dom.removeChild(modules[activeId].dom);
            }
            else if (modules[activeId].dom.moveStart){                
                startP = modules[activeId].dom.moveStart;
                modules[activeId].dom.setAttribute('data-x', startP.x);
                modules[activeId].dom.setAttribute('data-y', startP.y);
                modules[activeId].dom.style.webkitTransform =
                    modules[activeId].dom.style.transform =
                    'translate(' + startP.x + 'px, ' + startP.y + 'px)';                                                 
            }            
        }
        if (activeId)              
            modules[activeId].dom.style.backgroundColor = 'white';
        activeId = null;
    }

    function focusMe(id) {
        wp.dom.insertBefore(modules[id].dom, wp.dom.firstChild);
        modules[id].dom.style.backgroundColor = 'lightblue';
        activeId = id;
    }
    
    function deleteMe(m,id){
        if (m){
            wp.dom.removeChild(m.dom);
            delete modules[m.id];            
        }
        else {
            wp.dom.removeChild(modules[id].dom);
            delete modules[id];
        }
        modulesC--;
    }

    this.dom.addEventListener("dragover", dragover, false);
    this.dom.addEventListener("dragleave", dragleave, false);
    this.dom.addEventListener("drop", drop, false);
    
    function drop(event){
        event.preventDefault();
        wp.dom.style.backgroundColor = 'white';
        var files = event.dataTransfer.files;
        mousePos = { x: event.clientX, y: event.clientY };

        wp.createModule(mousePos, 'Data', files);
    }
    
    function dragleave(event){
        event.preventDefault();
        wp.dom.style.backgroundColor = 'white';
    }
    
    function dragover(event){
        event.preventDefault();
        wp.dom.style.backgroundColor = 'lightblue';
    }
    
    this.dropOff = function(){
        wp.dom.style.backgroundColor = 'white';
        this.dom.removeEventListener("dragover", dragover, false);
        this.dom.removeEventListener("dragleave", dragleave, false);
        this.dom.removeEventListener("drop", drop, false);
    };
    
    this.dropOn = function(){
        wp.dom.style.backgroundColor = 'white';
        this.dom.addEventListener("dragover", dragover, false);
        this.dom.addEventListener("dragleave", dragleave, false);
        this.dom.addEventListener("drop", drop, false);
    };


    //testing    
    this.createModule(new Pos(400, 300), 'Graphic');
}