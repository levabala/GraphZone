var Mussyandriya = [];
var Modules = {};
var ParamsNeed = ['Data'];

function Mussya(pos){
    this.title = 'Mussya';
    this.letter = "M";
    this.pos = pos;
    this.temppos = JSON.parse(JSON.stringify(pos));
    this.state = {};    
    this.data = {};
    this.methods = {};         
    this.outputs = [];
    this.inputs = [];
    this.dom = {};        
    this.needParams = false;
    this.height = 17;        
    this.style = {
        padding: '4px',
        font: '20px Arial',
        color: 'black',
        position: 'absolute',        
        border: 'solid black 1px',
        backgroundColor: 'white',
        '-webkit-user-select': 'none',    
        '-moz-user-select': 'none',    
        '-ms-user-select': 'none'          
    }                            
    this.drag = function(dx,dy){                        
        this.pos.x = this.temppos.x + dx;
        this.pos.y = this.temppos.y + dy;                                
    }            
    
    this.endDrag = function(){
        this.temppos = JSON.parse(JSON.stringify(this.pos));
    }
    
    this.calcWidth = function(){
        this.width = this.title.length * 11; //20px is font size
    }
    this.render = function(ctx){                
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.font = '20px Arial'
        ctx.fillText(this.title,0,this.height,ctx.width);         
        ctx.stroke();
        ctx.closePath();               
    };
    this.showState = function(){                
        this.dom.innerHTML = this.title+"<sup><small>"+this.letter+"</small></sup>";
    }
    this.calcWidth();
    
    Mussyandriya[Mussyandriya.length] = this;   
}
Modules['Mussya'] = Mussya;