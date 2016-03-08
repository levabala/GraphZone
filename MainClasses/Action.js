function Action(pos){
    Mussya.apply(this, arguments);      
    this.title = 'Action'
    this.calcWidth();
    this.objects = [];
    var inputs = this.inputs;
    this.methods.ConnectionFrom = function(obj){       
        inputs[inputs.length] = obj;
    };              
}
Action.__proto__ = Mussya;
Modules['Action'] = Action;