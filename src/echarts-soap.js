
/***! * echarts-soap
 * Author:bung
 * Summary: echarts-soap is a handy tool for echarts.
 * Version: beta
 * Github Homepage: https://github.com/bung87/echarts-soap
 ***/

import * as echarts from 'echarts';

const util = echarts.util;
function protoTypeOf(a) {
    var b = Object.prototype.toString.call(a);
    return b.split(" ")[1].slice(0, -1);
}
// function getAllChartType() {
//     let chartTypeCtx = require.context("echarts/src/chart/", false, /.js$/),
//         allChartTypes = chartTypeCtx.keys(),
//         pureAllChartTypes = allChartTypes.reduce(function (arr, value) {
//             return arr.concat(value.replace(/\.\//, "").replace(".js", ""));
//         }, []);
//     return pureAllChartTypes;
// }
const ALL_CHART_TYPE = ["bar", "boxplot", "candlestick", "chord", "custom", "effectScatter", "funnel", "gauge", "graph", "heatmap", "line", "lines", "map", "parallel", "pictorialBar", "pie", "radar", "sankey", "scatter", "themeRiver", "tree", "treemap"];

function processorFactor() {
    let result = {
        '*': {
            option: []
        }
    };
    ALL_CHART_TYPE.forEach((v, i) => result[v] = {
        series: [],
        data: []
    })
    return result;

}

function safeExtend(target, value) {
    if (!target) {
        let t = protoTypeOf(value);
        switch (t) {
            case "Object":
                target = {};
                break;
            case 'Array':
                target = [];
            default:
                break;

        }
    }
    util.extend(target, value, true);
};

var echartsSoap = {},
    preprocessors = processorFactor(),
    processors = processorFactor(),
    processorsMap = {
    },
    preprocessorsMap = {
        'innerPieLabelMinPercent': {
            level: 'series',
            chartType: 'pie',
            handle: function (value) {
                return function (option) {

                    if (this.label.normal.position = 'inner' || this.label.normal.position == 'inside') {

                        let amount = echarts.util.reduce(this.data, function (sum, item) {
                            return sum + item.value;
                        }, 0)

                        echarts.util.each(this.data, function (item) {

                            safeNestedObjectInspection(item, 'label.normal.show', item.value / amount > parseFloat(value) / 100);

                        });
                    }

                }
            }
        },
        'barShadow': { //官方示例会将阴影数据显示在tooltip里 http://echarts.baidu.com/demo.html#bar-gradient
            chartType: 'bar',
            level: 'series',
            handle: function (value) {
                return function (option) {

                    let dataMax = this.data.sort(function (a, b) {
                        if (util.isObject(a)) {
                            return a.value - b.value;
                        } else {
                            return a - b;
                        }

                    })[this.data.length - 1];
                    let dataShadow = [];
                    for (let i = this.data.length - 1; i >= 0; i--) {
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

echarts.registerPreprocessor(function (option) {
    echarts.util.each(option.series, function (seriesOne) {
        echarts.util.each(preprocessors[seriesOne.type].series, function (handle) {
            handle().call(seriesOne, option);
        });
        echarts.util.each(seriesOne.data, function (dataOne) {
            echarts.util.each(preprocessors[seriesOne.type].data, function (handle) {
                handle().call(dataOne, seriesOne.data);
            });
        });

    })
});

function getProcessorByKey(key, map) {
    var isContextialKey = -1 !== key.indexOf('.') ? 1 : 0,
        processor;
    if (isContextialKey) {
        var [chartType, level, prop, ...rest] = key.split('.'),
            processor = {
                chartType: chartType,
                level: level,
                handle: function (value) {
                    return function (option) {
                        if (util.isObject(value)) {
                            safeExtend(this[prop], value, true);
                        } else {
                            this[prop] = value;
                        }

                    }
                }
            }
    } else {
        processor = map[key];
    }
    return processor;
}

function _registerProcessor(key, value) {

    let processor = getProcessorByKey(key, processorsMap);

    processors[processor.chartType][processor.level].push(processor.handle.bind(null, value));
}

echarts.registerProcessor(function (ecModel, api) {
    var dom = api.getDom(), instance = echarts.getInstanceByDom(dom);
    echarts.util.each(processors['*']['option'], function (handle) {
        handle().call(instance, ecModel, api);
    });
    echarts.util.each(ecModel.option.series, function (seriesOne) {
        if (!!processors[seriesOne.type]) {
            echarts.util.each(processors[seriesOne.type].series, function (handle) {
                handle().call(seriesOne, ecModel.option);
            });
        }
        if (!!processors[seriesOne.type]) {
            echarts.util.each(seriesOne.data, function (dataOne) {
                echarts.util.each(processors[seriesOne.type].data, function (handle) {
                    handle().call(dataOne, seriesOne.data);
                });
            });
        }


    })
});

var postProcessors = [],
    postprocessorMap;

function _registerPostprocessor(key, value) {
    postProcessors.push(postprocessorMap[key].bind(null, value))
}
echarts.registerPostUpdate(function (model, api) {
    util.each(postProcessors, function (handle) {
        handle()(model, api);
    })

})

function _registerPreprocessor(key, value) {

    let preprocessor = getProcessorByKey(key, preprocessorsMap);
    preprocessors[preprocessor.chartType][preprocessor.level].push(preprocessor.handle.bind(null, value));
}
var renderAfterActionsMap = {
    dataZoomFitWidth: function (applyConditionFunc) {
        var userConditionTrue = typeof applyConditionFunc === 'undefined';
        return function (dom, orginalOption) {

            var ec_option = this.getOption(),
                option = {
                    dataZoom: util.extend([], ec_option.dataZoom)
                };

            if ((userConditionTrue || applyConditionFunc.call(this, dom, orginalOption)) && ec_option.series.length > 0 && ec_option.series[0].type == 'bar' && ec_option.series[0].data.length) {

                var seriesComponent = this.getModel().getSeriesByIndex(0),
                    strWidth = ec_option.xAxis[0].data.join('').length * ec_option.xAxis[0].axisLabel.fontSize,
                    width = seriesComponent.coordinateSystem.grid._rect.width,
                    start = 0,
                    end = 100;

                if (strWidth > width) {
                    end = width / strWidth * 100;

                }

                for (var dataZoomI = 0; dataZoomI < ec_option.dataZoom.length; dataZoomI++) {
                    option.dataZoom[dataZoomI].start = start;
                    option.dataZoom[dataZoomI].end = end;
                }
                this.setOption(option);
            }
        }
    }
},
renderAfterActions = [];
util.extend(echartsSoap, {

    render: function (id, option) { //避免初始化多次 http://echarts.baidu.com/api.html#echarts.init 创建一个 ECharts 实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts 实例。
        let dom = document.getElementById(id),
            instance = echarts.getInstanceByDom(dom),
            args = Array.prototype.slice.apply(global, arguments, 1).splice(0, 0, dom),
            init = Function.prototype.bind.apply(echarts.init, args);

        if (typeof instance == 'undefined') {
            instance = init(dom);
            instance.setOption(option);
        } else {
            echarts.dispose(instance);

            instance = init(dom); //echarts '3.3.2' 地图instance.setOption(option, true);后指向地图某个区域左侧Visualmap还是初始时的这个区域的值，这里销毁instance重新init.
            instance.setOption(option);
        }
        util.each(renderAfterActions, function (handle) {
            handle().call(instance, dom, option);
        })
    },
    registerRenderAfter: function (key, value) {
        renderAfterActions.push(renderAfterActionsMap[key].bind(null, value));
    },
    registerPreprocessor: function (key, value) {
        _registerPreprocessor(key, value);
    },
    registerProcessor: function (key, value) {
        _registerProcessor(key, value);
    },
    registerPostprocessor: function (key, value) {
        _registerPostprocessor(key, value);
    },
    extendPreprocessorsMap: function (obj) {
        util.extend(extendPreprocessorsMap, obj);
    },
    traverse: function (option, key, value) {
        let processor = getProcessorByKey(key, preprocessorsMap);
        if (processor.level === 'option') {
            processor.handle(value).call(option, option);
            return;
        }
        echarts.util.each(option.series, function (seriesOne) {
            if (!seriesOne.type === processor.processor) return;

            if (processor.level == 'series')
                processor.handle(value).call(seriesOne, option);

            echarts.util.each(seriesOne.data, function (dataOne) {

                if (processor.level == 'data')
                    processor.handle(value).call(dataOne, seriesOne.data);

            });

        })

    }
})

function safeNestedObjectInspection(obj, path, value) {

    let arr = path.split('.'),
        len = arr.length,
        last = len - 1;
    if (len == 1 && (typeof value == 'string' || typeof value == 'number')) {
        let key = arr[0];
        obj[key] = value;
    } else {
        let currPath = [],
            curr;
        for (let index = 0; index < len; index++) {
            let key = arr[index];
            currPath.push(`['{$key}']`);
            curr = obj[key];

            if (index < last) {
                if (typeof curr === 'undefined') {
                    eval('obj' + currPath.join('') + '={};');
                }
            } else {
                if (typeof value == 'string') {
                    eval('obj' + currPath.join('') + '=' + value + ';');
                } else {
                    eval('obj' + currPath.join('') + '=' + value + ';');
                }
            }
        }
    }
}
export default echartsSoap;