function Graphic(pos, id, params, initConnection, giveMe, focusMe,deleteMe,wp) {
    Action.apply(this, arguments);        

    this.graphicObj = new GraphEngine(this.dom.view,this.dom);
    var gr = this;        
    
    //adding Save Button
    var buttonS = document.createElement('div');
    buttonS.className = 'button';
    buttonS.innerHTML = 'Save as PNG';
    buttonS.onclick = function(){
        domtoimage.toPng(gr.dom.view)
            .then(function(dataUrl){
                //blob = new Blob(dataUrl,{type: 'image/png'});
                var blob = dataURLtoBlob(dataUrl)
                console.log(blob)
                saveAs(blob,'Graphic.png'); 
            })
            .catch(function(err){
                alert('Some error...');
                console.error(err);
            });
    }; 
    this.dom.appendChild(buttonS);        
    
    //this.dom.resizable = true;
    
    //changing processing new inputs 
    this.addInput = function(wp){        
        if (!this.graphicObj.addGraph(wp.id,wp.data || wp.result)) return false;
        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = wp.dom.type;  
        title.addEventListener('click',function(){            
            gr.children.removeChild(title);
            gr.inputs = gr.inputs.splice(wp);
            if (gr.lostInput) gr.lostInput(wp.id);
        },true);      
        this.children.appendChild(title);        
        this.inputs.push(wp.dom);                        
        //here we disable Process()        
        
        return true;
    };    
    
    this.lostInput = function(id){
        this.graphicObj.removeGraph(id);
    };
}