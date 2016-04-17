function Action(id){
    Module.apply(this,arguments);
    this.result = 0;    
    
    this.Calc = function(){
        //here should be some manipulations with data of inputs (in children of the module)
    }
    this.Share = function(){        
        for (var o in this.outputs){
            console.log('shared to',this.outputs[o].id)
            this.outputs[o].changeTo(this.result,this.id);                
        }
    }
    this.Process = function(){
        this.Calc();
        this.Share();
        this.innerHTML = GenerateTitle(this.result);
    }
}