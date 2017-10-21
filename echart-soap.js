(function(global, echarts) {

    var util = echarts.util;

    global.echartsSoap = echartsSoap = {};

    var preprocessors = {

            bar: {
                series:[],
                data:[]
            },
            pie: {
                series:[],
                data:[]
            },
        },
        preprocessorsMap = {

            "innerPieLabelMinPercent": {
                level:"series",
                chartType: "pie",
                handle: function(value) {
                    return function(option) {

                        if (this.label.normal.position = "inner" || this.label.normal.position == "inside") {

                            amount = echarts.util.reduce(this.data, function(sum, item) {
                                return sum + item.value;
                            }, 0)

                            echarts.util.each(this.data, function(item) {

                                safeNestedObjectInspection(item, "label.normal.show", item.value / amount > parseFloat(value) / 100);

                            });
                        }

                    }
                }
            },
            "barShadow": { //官方示例会将阴影数据显示在tooltip里 http://echarts.baidu.com/demo.html#bar-gradient
                chartType: "bar",
                level:"series",
                handle: function(value) {
                    return function(option) {

                        var dataMax = this.data.sort(function(a, b) {
                            if (util.isObject(a)) {
                                return a.value - b.value;
                            } else {
                                return a - b;
                            }

                        })[this.data.length - 1];
                        var dataShadow = [];
                        for (var i = this.data.length - 1; i >= 0; i--) {
                            dataShadow.push(dataMax);
                        }
                        option.series.unshift({ // For shadow
                            type: 'bar',
                            silent: true,
                            itemStyle: {
                                normal: {
                                    color: value
                                }
                            },
                            barWidth: this.barWidth,
                            barGap: '-100%',
                            barCategoryGap: '50%',
                            data: dataShadow,
                            animation: false,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            legendHoverLink: false,
                            tooltip: {
                                show: false
                            }
                        })
                    }
                }
            }
        };
    echarts.registerPreprocessor(function(option) {

        echarts.util.each(option.series, function(seriesOne) {
            echarts.util.each(preprocessors[seriesOne.type].series, function(handle) {
                        handle().call(seriesOne, option);
            });
            echarts.util.each(option.series.data, function(dataOne) {
                     echarts.util.each(preprocessors[seriesOne.type].data,function(){
                            handle().call(dataOne, seriesOne.data);
                     });
            });
            // switch (seriesOne.type) {
            //     case "bar":
            //         echarts.util.each(preprocessors.bar.series, function(handle) {
            //             handle().call(seriesOne, option);
            //         });
            //         echarts.util.each(option.series.data, function(dataOne) {
            //              echarts.util.each(preprocessors.bar.data,function(){
            //                 handle().call(dataOne, seriesOne.data);
            //              });
            //         });
            //         break;
            //     case "pie":
            //         echarts.util.each(preprocessors.pie.series, function(handle) {
            //             handle().call(seriesOne, option);
            //         });
            //         echarts.util.each(option.series.data, function(dataOne) {
            //              echarts.util.each(preprocessors.bar.data,function(){
            //                 handle().call(dataOne, seriesOne.data);
            //              });
            //         });

            //         break;

            // }
        })
    });

    function _registerPreprocessor(key, value) {
        
        var isContextialKey = -1 !== key.indexOf(".") ? 1 : 0,preprocessor;
        if(isContextialKey){
            var args = key.split("."),level = args[1], chartType = args[0],prop = args[2];
            preprocessor = {
                chartType:chartType,
                level:level,
                handle: function(value) {
                    return function(option) {
                        this[prop] = value;
                    }
                }
            }
        }else{
            preprocessor = preprocessorsMap[key];
        }
        
        preprocessors[preprocessor.chartType][preprocessor.level].push(preprocessor.handle.bind(null, value));
    }
    util.extend(echartsSoap, {

        render: function(id, option) { //避免初始化多次 http://echarts.baidu.com/api.html#echarts.init 创建一个 ECharts 实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts 实例。
            var dom = document.getElementById(id),
                instance = echarts.getInstanceByDom(dom),
                args = Array.prototype.slice.apply(global, arguments, 1);
            args.unshift(dom);
            init = Function.prototype.bind.apply(echarts.init, args);;

            if (typeof instance == "undefined") {
                instance = init(dom);
                instance.setOption(option);
            } else {
                echarts.dispose(instance);

                instance = init(dom); //echarts "3.3.2" 地图instance.setOption(option, true);后指向地图某个区域左侧Visualmap还是初始时的这个区域的值，这里销毁instance重新init.
                instance.setOption(option);
            }
        },
        registerPreprocessor: function(key, value) {
            _registerPreprocessor(key, value);
        }
    })

    function safeNestedObjectInspection(obj, path, value) {

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
                        eval("obj" + currPath.join("") + "={};");
                    }
                } else {
                    if (typeof value == "string") {
                        eval("obj" + currPath.join("") + "='" + value + "';");
                    } else {
                        eval("obj" + currPath.join("") + "=" + value + ";");
                    }
                }
            }
        }
    }

})(window, echarts);