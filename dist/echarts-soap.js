(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["echartsSoap"] = factory(require("echarts"));
	else
		root["echartsSoap"] = factory(root["echarts"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _echarts = __webpack_require__(2);

var echarts = _interopRequireWildcard(_echarts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
/***! * echarts-soap
 * Author:bung
 * Summary: echarts-soap is a handy tool for echarts.
 * Version: beta
 * Github Homepage: https://github.com/bung87/echarts-soap
 ***/

var util = echarts.util;
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
var ALL_CHART_TYPE = ["bar", "boxplot", "candlestick", "chord", "custom", "effectScatter", "funnel", "gauge", "graph", "heatmap", "line", "lines", "map", "parallel", "pictorialBar", "pie", "radar", "sankey", "scatter", "themeRiver", "tree", "treemap"];

function processorFactor() {
    var result = {
        '*': {
            option: []
        }
    };
    ALL_CHART_TYPE.forEach(function (v, i) {
        return result[v] = {
            series: [],
            data: []
        };
    });
    return result;
}

function safeExtend(target, value) {
    if (!target) {
        var t = protoTypeOf(value);
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
    processorsMap = {},
    preprocessorsMap = {
    'innerPieLabelMinPercent': {
        level: 'series',
        chartType: 'pie',
        handle: function handle(value) {
            return function (option) {

                if (this.label.normal.position = 'inner' || this.label.normal.position == 'inside') {

                    var amount = echarts.util.reduce(this.data, function (sum, item) {
                        return sum + item.value;
                    }, 0);

                    echarts.util.each(this.data, function (item) {

                        safeNestedObjectInspection(item, 'label.normal.show', item.value / amount > parseFloat(value) / 100);
                    });
                }
            };
        }
    },
    'barShadow': { //官方示例会将阴影数据显示在tooltip里 http://echarts.baidu.com/demo.html#bar-gradient
        chartType: 'bar',
        level: 'series',
        handle: function handle(value) {
            return function (option) {

                var dataMax = this.data.sort(function (a, b) {
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
                });
            };
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
    });
});

function getProcessorByKey(key, map) {
    var isContextialKey = -1 !== key.indexOf('.') ? 1 : 0,
        processor;
    if (isContextialKey) {
        var _key$split = key.split('.'),
            _key$split2 = _toArray(_key$split),
            chartType = _key$split2[0],
            level = _key$split2[1],
            prop = _key$split2[2],
            rest = _key$split2.slice(3),
            processor = {
            chartType: chartType,
            level: level,
            handle: function handle(value) {
                return function (option) {
                    if (util.isObject(value)) {
                        safeExtend(this[prop], value, true);
                    } else {
                        this[prop] = value;
                    }
                };
            }
        };
    } else {
        processor = map[key];
    }
    return processor;
}

function _registerProcessor(key, value) {

    var processor = getProcessorByKey(key, processorsMap);

    processors[processor.chartType][processor.level].push(processor.handle.bind(null, value));
}

echarts.registerProcessor(function (ecModel, api) {
    var dom = api.getDom(),
        instance = echarts.getInstanceByDom(dom);
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
    });
});

var postProcessors = [],
    postprocessorMap;

function _registerPostprocessor(key, value) {
    postProcessors.push(postprocessorMap[key].bind(null, value));
}
echarts.registerPostUpdate(function (model, api) {
    util.each(postProcessors, function (handle) {
        handle()(model, api);
    });
});

function _registerPreprocessor(key, value) {

    var preprocessor = getProcessorByKey(key, preprocessorsMap);
    preprocessors[preprocessor.chartType][preprocessor.level].push(preprocessor.handle.bind(null, value));
}
var renderAfterActionsMap = {
    dataZoomFitWidth: function dataZoomFitWidth(applyConditionFunc) {
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
        };
    }
},
    renderAfterActions = [];
util.extend(echartsSoap, {

    render: function render(id, option) {
        //避免初始化多次 http://echarts.baidu.com/api.html#echarts.init 创建一个 ECharts 实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts 实例。
        var dom = document.getElementById(id),
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
        });
    },
    registerRenderAfter: function registerRenderAfter(key, value) {
        renderAfterActions.push(renderAfterActionsMap[key].bind(null, value));
    },
    registerPreprocessor: function registerPreprocessor(key, value) {
        _registerPreprocessor(key, value);
    },
    registerProcessor: function registerProcessor(key, value) {
        _registerProcessor(key, value);
    },
    registerPostprocessor: function registerPostprocessor(key, value) {
        _registerPostprocessor(key, value);
    },
    extendPreprocessorsMap: function (_extendPreprocessorsMap) {
        function extendPreprocessorsMap(_x) {
            return _extendPreprocessorsMap.apply(this, arguments);
        }

        extendPreprocessorsMap.toString = function () {
            return _extendPreprocessorsMap.toString();
        };

        return extendPreprocessorsMap;
    }(function (obj) {
        util.extend(extendPreprocessorsMap, obj);
    }),
    traverse: function traverse(option, key, value) {
        var processor = getProcessorByKey(key, preprocessorsMap);
        if (processor.level === 'option') {
            processor.handle(value).call(option, option);
            return;
        }
        echarts.util.each(option.series, function (seriesOne) {
            if (!seriesOne.type === processor.processor) return;

            if (processor.level == 'series') processor.handle(value).call(seriesOne, option);

            echarts.util.each(seriesOne.data, function (dataOne) {

                if (processor.level == 'data') processor.handle(value).call(dataOne, seriesOne.data);
            });
        });
    }
});

function safeNestedObjectInspection(obj, path, value) {

    var arr = path.split('.'),
        len = arr.length,
        last = len - 1;
    if (len == 1 && (typeof value == 'string' || typeof value == 'number')) {
        var key = arr[0];
        obj[key] = value;
    } else {
        var currPath = [],
            curr = void 0;
        for (var index = 0; index < len; index++) {
            var _key = arr[index];
            currPath.push("['{$key}']");
            curr = obj[_key];

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
exports.default = echartsSoap;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});