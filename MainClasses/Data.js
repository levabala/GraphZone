function Data(pos,params){
    Mussya.apply(this,arguments);    
    //check params for existing
    if (!params) params = {value:0};
    if (params.value == null)
        params = {value:params};                  
    //other
    this.data = params;
    this.letter = 'd';    
    //!! костыли     
    if (params.title == null)      
      this.title = params.value;
    else this.title = params.title;
    if (typeof this.title == 'undefined') this.title = 'NaN'; 
    this.calcWidth();
    //save itself for access in methods
    var nu = this;
    //display the title
    this.dom.innerHTML= '<sup><small>D</sup></small>'+this.title;
    //main function 
    this.info = function(data){
        console.log('info');
        if (data == null) return;
        if (data.value == null)
            data = {value:data};  
        this.title = data.value || data[0] || data;
        this.dom.innerHTML= this.title+'<sup><small>d</sup></small>';                
    };      
}
Data.__proto__ = Mussya;
Modules['Data'] = Data;