function WorkerM(pos,id,worker){
    console.log('worker m')
    Action.apply(this,arguments);
                
    var w = this;            
    worker.onmessage = function(e){
        w.dom.innerHTML = e.data;        
    }                        
    worker.postMessage('name');
    
    this.Calc = function(){
        var input = this.inputs[0];
        worker.onmessage = function(res){            
            w.result = res.data;
            
        }
        worker.postMessage(input.data);        
    }
}