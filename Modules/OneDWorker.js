function WorkerOneD(pos, id, params, initConnection, giveMe, focusMe,deleteMe,wp){
    console.log('worker m');
    Action.apply(this,arguments);
                
    var w = this;        
    this.type = 'OneDW';
    this.dom.type = this.type;
    var worker = WORKERS.OneDWorker;    
    worker.onmessage = function(e){
        w.dom.view.innerHTML = e.data;        
    };                        
    worker.postMessage('name');
    
    this.Calc = function(){              
        var dataArr = [];
        for (var i in this.inputs) dataArr.push(this.inputs[i].data);          
        worker.onmessage = function(res){                        
            w.result = res.data;            
            filesC = 0;            
            for (var i in w.inputs) filesC += w.inputs[i].data.length;            
            title = '<div style=\'font-size: 20px; font-style: Georgia;text-decoration: underline;\'>WorkerOneD</div>'+filesC+' files';                                         
            w.dom.view.innerHTML = title;                        
        };
        worker.onerror = function(err) {
            
        };
        worker.postMessage(dataArr);        
    };
    
    this.Process = function(){
        this.Calc();
        this.Share();        
    }; 
}