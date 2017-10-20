(function(global, echarts) {
    var util = echarts.util;
    global.echartsSoap = echartsSoap = {};
    var preprocessors = {
        "bar":[],
        "pie":[]
    },
    preprocessorsMap = {
        "barMinHeight":{
            chartType:"bar",
            handle:function(value){
                return function(){
                    this.barMinHeight = value;
                    console.log("handle",this)
                }
            }
        },
        "innerPieLabelMinPercent":{
            chartType:"pie",
            handle:function(value){
                return function(){

                    if (this.label.normal.position = "inner" || this.label.normal.position == "inside") {

                        amount = echarts.util.reduce(this.data, function(sum, item) {
                            return sum + item.value;
                        }, 0)
                        console.log("amount:",amount);
                        echarts.util.each(this.data, function(item) {
                            console.log(percent = item.value / amount)
                            // safeNestedObjectInspection(item, "label.normal.show", item.value / amount > parseFloat(value) / 100);
                            item.label ={
                                normal:{
                                    show:item.value / amount > parseFloat(value) / 100
                                }
                            } 
                        });
                        console.log("pie", this)
                    }

                }
            }
        }
    };
    echarts.registerPreprocessor(function(option) {
            echarts.util.each(option.series, function(series) {
                switch (series.type) {
                    case "bar":
                        echarts.util.each(preprocessors.bar,function(handle){
                            handle().apply(series);
                        });
                        // series.barMinHeight = 10
                        break;
                    case "pie":
                        echarts.util.each(preprocessors.pie,function(handle){
                            handle().apply(series);
                        });
                       

                        break;

                }
            })
     });
    function _seriesAttr(key,value){
        this[key] = value;
    }
    function _registerPreprocessor(key,value){
        var preprocessor = preprocessorsMap[key];
        preprocessors[preprocessor.chartType].push(preprocessor.handle.bind(null,value));
    }
    util.extend(echartsSoap, {
        render: function(id, option) { //避免初始化多次 http://echarts.baidu.com/api.html#echarts.init 创建一个 ECharts 实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts 实例。
            var dom = document.getElementById(id),
                instance = echarts.getInstanceByDom(dom),
                args = Array.prototype.slice.apply(global, arguments, 1);
            args.unshift(dom);
            init = Function.prototype.bind.apply(echarts.init, args);;
            console.log(init)
            if (typeof instance == "undefined") {
                instance = init(dom);
                instance.setOption(option);
            } else {
                echarts.dispose(instance);

                instance = init(dom); //echarts "3.3.2" 地图instance.setOption(option, true);后指向地图某个区域左侧Visualmap还是初始时的这个区域的值，这里销毁instance重新init.
                instance.setOption(option);
            }
        },registerPreprocessor:function(key,value){
            _registerPreprocessor(key,value);
        }
    })

    function safeNestedObjectInspection(obj, path, value) {
            //arr title.textStyle.color
            var arr = path.split("."),
                len = arr.length,
                last = len - 1;
            if (len == 1 && (typeof value == "string" || typeof value == "number")) {
                var key = arr[0];
                obj[key] = value;
            } else {
                var currPath = [],
                    curr;
                for (var index = 0; index < len; index++) {
                    var key = arr[index];
                    currPath.push("['" + key + "']");
                    curr = obj[key];

                    if (index < last) {
                        if (typeof curr === "undefined") {
                            // curr = {};
                            // with(obj){

                            eval("obj" + currPath.join("") + "={};");
                            // }
                        }
                    } else {
                        // with(obj){
                        if (typeof value == "string") {
                            eval("obj" + currPath.join("") + "='" + value + "';");
                        } else {
                            eval("obj" + currPath.join("") + "=" + value + ";");
                        }

                        // }
                    }


                }

            }

            // console.log("safeNestedObjectInspection obj:", obj);
    }

})(window, echarts);