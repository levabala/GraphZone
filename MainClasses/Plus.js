function Plus(pos){
    Action.apply(this, arguments);  //наследование свойств от родителя
    this.title = 'Plus';
    this.litter = 'p';    
    this.calcWidth();
    var pl = this;                  //создание ссылки на this
    this.methods.Calc = function(dataType){
        var result;
        var fetch = []; //выборка из массива                
        for (var i in pl.inputs){
            var prop;
            if (!dataType) prop = pl.inputs[i].data;
            else prop = pl.inputs[i].data[dataType];
            console.log(pl.inputs)
            if (prop != null) fetch.push(prop);
        }        
        console.log('Fetch:',fetch)        
        result = Sum(fetch);
        pl.data.result = result;        
        pl.methods.Share();        
    }           
    this.methods.Share = function(){
        console.log(pl.title,'shared');
        for (var o in pl.outputs){   //рассылаем всем подключенным со стороны отдачи данных
            pl.outputs[o].info(pl.data.result);
        }        
    }
    this.info = function(){        
        this.methods.Calc('value');
    }    
};           
Plus.__proto__ = Action;
Modules['Plus'] = Plus;

//старый Calc 
    /*this.methods.Calc = function(dataType){                 
        var result = pl.inputs[0].data[dataType];  //получаем первое значение списка подключенных, которых мы будем суммировать..
                                                   //.. оно определяет тип сложения
        for (var i = 1; i < pl.inputs.length; i++) {
            var value = pl.inputs[i].data[dataType];
            console.log(value)
            if (typeof value != typeof result) continue;  //проверяем на совпадение по типу             
            result += value;                              //суммируем                                                            
        }        
        for (var o in pl.outputs){   //рассылаем всем подключенным со стороны отдачи данных
            console.log('--result:');
            console.log(result)
            pl.outputs[o].info(result);
        }                
        pl.data.result = result;     //записываем результат в качестве кэша
    }*/