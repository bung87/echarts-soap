(function(global, echarts) {
    var util = echarts.util;
    global.echartsSoap = echartsSoap = {};
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
        }
    })

})(window, echarts);