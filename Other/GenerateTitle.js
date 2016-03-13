function GenerateTitle(params){
    switch (typeof params){
            case 'object': {
                if (params.value != null) return params.value;
                break;
            }
            case 'string':
            case 'number': {
                return params;                
            }
            
            default:{
                return false;
            }        
        }          
}