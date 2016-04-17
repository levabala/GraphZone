function Sum(id){
    Action.apply(this,arguments);
    this.dom.innerHTML = 'S U M'
    this.Calc = function(){                
        //to determine a type of calculations 
        var res = JSON.parse(JSON.stringify(this.inputs[0].data));
        var mainType = typeof res;      
        console.log('inputs:',this.inputs);
        console.log('outputs:',this.outputs);          
        switch (mainType){
            case 'object': {                                
                for (var i = 1; i < this.inputs.length;i++){                    
                    var data = this.inputs[i].data;                    
                    var array = res;
                    if (data.length > res.length || Object.keys(data).length > Object.keys(res).length) array = data;
                    for (var f in array){                        
                        if (array[f] == null) continue;
                        res[f] = determineAndCalc(res[f],data[f]);                        
                    }                    
                }
                break;
            }
            case 'string':
            case 'number': {                
                for (var i = 1; i < this.inputs.length;i++){
                    res = determineAndCalc(res,this.inputs[i].data);
                }
                break;
            }
            
            default:{
                res = 'Unknow datatype';                                
            }        
        }              
        this.result = res;              
    }        
    
    function determineAndCalc(var1,var2){
        var res = null;
        if (typeof var1 != typeof var2) {
            if (var1 == null) return var2;
            return var1;    
        }
        switch (typeof var1){
            case 'object': {
                //var keys = Object.keys(var1).concat(Object.keys(var2));
                if (var2.length > var1.length || Object.keys(var2).length > Object.keys(var1).length){ //???
                    console.log('------------')
                    console.log(var1,var2);
                    var c = var1;
                    var1 = var2;
                    var2 = c;
                    console.log(var1,var2);
                }
                for (var p in var1){
                    if (var2[p] != null) var1[p] = determineAndCalc(var1[p],var2[p]);
                    else var2[p] = var1[p];                                                            
                }
                break;
            }
            case 'string':
            case 'number': {
                res = var1 + var2;
                break;
            }            
        }
        
        return res;
    }
}