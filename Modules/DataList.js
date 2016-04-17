function DataList(pos, id, params) { //params is an array of arrays
    Module.apply(this, arguments);    
    
    this.data = params;
    this.dom.innerHTML = params.length + ' Arrays';    
    this.sumThemAll = function(){        
        console.log(sumThemAll)
        var littleArray = [];
        for (var d = 1; d < this.data.length; d++){                                    
            for (var dd in this.data[d]) {               
                if (littleArray[dd] == null) littleArray[dd] = this.data[d][dd];                           
                else littleArray[dd] += this.data[d][dd];                
            }                                    
        }
        this.data = [littleArray];
    }
    this.Share = function() {
        for (var o in this.outputs) {
            if (this.outputs[0].changeTo == null) continue;
            console.log('shared to', this.outputs[o].id)
            for (var d in this.data) {                
                this.outputs[o].changeTo(this.data[d], this.id, true);
            }
        }
    }
}