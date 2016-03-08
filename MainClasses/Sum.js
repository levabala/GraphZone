//this function is for summing several Data objects
function Sum(Data){        
    //Data should be array
    var result = JSON.parse(JSON.stringify(Data[0]));    
    var firstType = typeof result;    
    for (var d = 1; d < Data.length; d++){                      
        var data = Data[d];        
        var type = typeof data;        
        if (type != firstType){
            console.warn('Type mismatch');
            continue;
        }
        var cyclic = isCyclic(data);
        if (!cyclic){
            console.warn('Cyclic structure!');            
            continue;
        }        
        switch(type){
            case 'string':{
                result += data;                 
                break;
            }
            case 'number':{
                result += data;                 
                break;
            }            
            case 'object':{
                var resObj = {};
                for (var p in result){
                    var prop1 = result[p];
                    var prop2 = data[p];
                    if (prop2 == null){
                        console.warn('No such property:',p); //from array it will be an index
                        continue;
                    }                                        
                    prop1 = Sum([prop1,prop2]);                                      
                    result[p] = prop1;
                }
                break;
            }
            default:{
                console.warn('Unknow DataType:',type);
                return false;
            }            
        }         
    }
    return result;
}