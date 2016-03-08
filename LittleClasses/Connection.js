function Connection(from){        
    this.from = from;
    this.to = {};
    this.completed = false;    
    this.finish = function(to){
        this.to = to;
        this.completed = true;        
    }         
}