function Presenter(field, workplacesList) {
    var workplaces = [];
    var mainWP = {};
    var wpList = [];
    var createC = 0;
    var ParamsNeed = ['Data'];

    var pres = this;

    var wpl = $("#wpl");
    var mainW = $("#mainworkplace");

    this.createWP = function(toMain) {
        var wp = new Workplace(createC, $('#mainworkplace'), field[0]);
        wp.dom.className = 'workplace';
        if (toMain) changeMainWP(wp);
        addWPToList(wp);
        workplaces.push(wp);
        createC++;
        return wp;
    };

    this.updateView = function() {
        //resizing              
        var mwp = $('#mainworkplace');
        var bordersW = parseFloat(getComputedStyle(mwp[0], null).getPropertyValue('border-left-width').replace('px', '')) + parseFloat(getComputedStyle(mwp[0], null).getPropertyValue('border-right-width').replace('px', ''));
        mainWP.dom.style.height = field.height() + 'px';
        mainWP.dom.style.width = wpl[0].offsetLeft - mainW[0].offsetLeft - field.width() * 0.03 - 10 - bordersW + 'px';
        mainWP.dom.getElementsByTagName('canvas')[0].style.height = mwp.height() + 'px';
        mainWP.dom.getElementsByTagName('canvas')[0].style.width = mwp.width() + 'px';
        wpl[0].style.height = mainWP.dom.offsetHeight + 'px';
        workplacesList[0].style.height = wpl.height() - workplacesList[0].offsetTop + wpl[0].offsetTop + 'px';//mainW.height() - workplacesList[0].offsetTop + wpl[0].offsetTop + 'px';              
        workplacesList[0].realWidth = workplacesList.width() - getScrollbarWidth();
        mainWP.render();

        fitImges();
    };

    this.refreshImges = function() {
        for (var w in workplaces) workplaces[w].settingImage();
        setTimeout(function() {
            for (var l in wpList) {
                var wp = wpList[l];
                document.getElementById(wp.id).src = wp.view.src;
            }
        });
    };

    var refreshImgesInterval = setInterval(this.refreshImges, 5000);
    window.addEventListener('resize', pres.updateView);
    window.addEventListener('focus', pres.updateView);


    function changeMainWP(wp) {
        if (typeof mainWP.dom !== 'undefined') {
            field[0].removeChild(document.getElementById('mainworkplace'));
            mainWP.dom.className = 'workplace';
            mainWP.dom.id = mainWP.id;
            clearInterval(mainWP.updateInterval);
        }
        else field[0].removeChild(document.getElementById('mainworkplace'));
        wp.dom.className = 'mainworkplace';
        wp.dom.id = 'mainworkplace';
        wp.updateInterval = setInterval(wp.render, 2000);
        mainWP = wp;
        mainWP.render();
        field[0].appendChild(mainWP.dom);
        mainWP.render();
    }

    var timeout;
    function addWPToList(wp) {
        if (typeof wp.view === 'undefined') {
            clearTimeout(timeout);
            timeout = setTimeout(function() { addWPToList(wp); }, 100);
            return;
        }
        var view = wp.view;
        wpList.push(wp);
        var size = scaleSize(workplacesList[0].realWidth, view.height, view.width, view.height);
        view.width = size[0];
        view.height = size[1];
        workplacesList[0].appendChild(wp.view);
        wp.render();
    }

    function removeWPFromList(wp) {

    }

    function fitImges() {
        var w = workplacesList[0].realWidth;
        var imges = workplacesList[0].getElementsByTagName('img');
        for (var i = 0; i < imges.length; i++) {
            var img = imges[i];
            var lW = workplaces[img.id].size.width / w;
            img.width = w;
            img.height = workplaces[img.id].size.height / lW;
        }
    }

    document.addEventListener('mousemove', function(e) {
        mousePos = {
            x: e.pageX - mainWP.dom.offsetLeft,
            y: e.pageY - mainWP.dom.offsetTop,
        };
    });

    document.oncontextmenu = function(e) {
        var menu;
        if (typeof $('#contextmenu')[0] === 'undefined') {
            menu = document.createElement('contextMenu');
            menu.id = 'contextmenu';
            menu.style.textAlign = 'center';
            for (var m in mainWP.Modules) {
                var elem = document.createElement('div');
                elem.className = 'menuElem';
                elem.innerHTML = m;
                elem.moduleName = m;
                elem.onclick = function(e) {
                    var params;
                    if (ParamsNeed.indexOf(this.moduleName) != -1) {
                        var sucf = false;
                        while (sucf === false) {
                            params = prompt("Enter params(separated by comma):");
                            if (params === null) return;
                            try {
                                params = JSON.parse(params);
                                sucf = true;
                            }
                            catch (err) {
                                alert('Invalid params!', err);
                                sucf = false;
                            }
                        }
                    }
                    console.log({ x: e.pageX, y: e.pageY }, this.moduleName, params)
                    mainWP.createModule({ x: e.pageX, y: e.pageY }, this.moduleName, params);
                };
                menu.appendChild(elem);
            }
            document.body.appendChild(menu);
        }
        else menu = $('#contextmenu')[0];
        menu.style.top = e.pageY + 'px';
        menu.style.left = e.pageX + 'px';
        menu.style.visibility = 'visible';
        return false;
    };
    window.addEventListener('click', function() {
        if ($('#contextmenu')[0]) $('#contextmenu')[0].style.visibility = 'hidden';
    });
}


function scaleSize(maxW, maxH, currW, currH) {
    var ratio = currH / currW;
    if (currW >= maxW && ratio <= 1) {
        currW = maxW;
        currH = currW * ratio;
    }
    else if (currH >= maxH) {
        currH = maxH;
        currW = currH / ratio;
    }

    return [currW, currH];
}

function getPNG(elem) {
    if (!elem.toDataURL) return;
    return elem.toDataURL('image/png');
}