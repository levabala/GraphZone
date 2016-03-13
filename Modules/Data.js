function Data(pos,id,params){
    Module.apply(this,arguments);
    
    var D = this;
    function setData(data){
        //data processing 
        switch (typeof data){
            case 'object': {
                D.data = data;
                break;
            }
            case 'string':
            case 'number': {
                D.data = {
                    value: data
                }
                break;
            }
            
            default:{
                D.data = {value:0};
            }        
        }                
    }
    this.updateContent = function(){                
        if (this.data.length != null){
            this.dom.innerHTML = JSON.stringify(this.data)                        
        }   
        else this.dom.innerHTML = this.data.value;             
    } 
    setData(params);
    this.updateContent();    
    this.changeTo = function(data) {
        setData(data);
        this.updateContent();        
        console.log('Data\'s value changed');
    }
}