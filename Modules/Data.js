function Data(pos, id, params, initConnection, giveMe, focusMe,deleteMe,wp) {
    Module.apply(this, arguments);

    var D = this;
    this.type = 'Data';
    this.dom.type = this.type;
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
                };
                break;
            }

            default: {
                D.data = { value: 0 };
            }
        }
    }
    this.updateContent = function() {
        var view;
        var max = 3;
        var little;
        if (typeof this.data.length !== 'undefined')
            if (this.data[0].lastModifiedDate) {
                this.dom.type = 'Files';
                view = '';
                count = max;
                little = count > this.data.length; 
                if (little) count = this.data.length;                
                for (var d = 0; d < count; d++) 
                    view += getFileInfo(d+1,this.data[d]);
                if (!little){
                    if (count*2 < this.data.length) view += '...<br>';
                    if (this.data.length - count < count) count = this.data.length - count;                    
                    for (d = this.data.length-count; d < this.data.length; d++) 
                        view += getFileInfo(d+1,this.data[d]);
                }                
            }
            else {
                view = [];
                little = (max > this.data.length);
                if (little) max = this.data.length;
                for (var i = 0; i < max; i++) {
                    view.push(this.data[i]);
                }

                view = JSON.stringify(view);
                if (!little) {
                    view = view.slice(0, -1);
                    view += '... ' + (this.data.length - 3) + ' more]';
                }
            }
        else view = this.data.value;
        this.dom.view.innerHTML = view;
    };
    setData(params);
    this.updateContent();
    this.changeTo = function(data) {
        setData(data);
        this.updateContent();
        console.log('Data\'s value changed');
    };
    this.Share = function() {
        for (var o in this.outputs) {
            if (this.outputs[0].changeTo === null) continue;
            console.log('shared to', this.outputs[o].id);
            this.outputs[o].changeTo(this.data, this.id);
        }
    };

    function getFileInfo(num, file) {
        view = '';        
        size = '' + file.size;
        postfix = ['B', 'KB', 'MB', 'GB'];
        pfC = 0;
        while (size.length >= 4) {
            size = parseFloat(size);
            size /= 2014;
            pfC++;
        }
        size = size.toFixed(2);
        size += postfix[pfC];
        view = num + '. ' + file.name + '&nbsp&nbsp|&nbsp&nbsp' + size + '<br>';
        return view;
    }
}