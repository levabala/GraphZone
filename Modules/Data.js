function Data(pos, id, params) {
    Module.apply(this, arguments);

    var D = this;
    function setData(data) {
        //data processing 
        switch (typeof data) {
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

            default: {
                D.data = { value: 0 };
            }
        }
    }
    this.updateContent = function() {
        if (this.data.length != null) {
            var view = [];
            var max = 3;
            var little = (max > this.data.length);
            if (little) max = this.data.length;
            for (var i = 0; i < max; i++) {
                view.push(this.data[i]);
            }
            this.dom.innerHTML = 'Array ' + this.data.length;
            /*
            view = JSON.stringify(view);
            if (!little) {
                view.slice(0,-2);
                view += '...]';                
            }
            this.dom.innerHTML = view;*/
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
    this.Share = function() {        
        for (var o in this.outputs) {
            if (this.outputs[0].changeTo == null) continue;
            console.log('shared to', this.outputs[o].id)
            this.outputs[o].changeTo(this.data, this.id);
        }
    }
}