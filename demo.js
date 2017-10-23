import echarts from 'echarts';
import echartsSoap from 'echarts-soap';
    var option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                type: 'value'
            }],
                dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    // start: 1,
                    // end: 35
                }
            ],
            series: [{
                name: '直接访问',
                type: 'bar',
                // barWidth: '60%',
                itemStyle:{
                    normal: {
                    barBorderRadius:[13, 13, 0, 0], //[5, 5, 0, 0] //（顺时针左上，右上，右下，左下）
                  
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2757f1'},
                              
                                {offset: 1, color: '#c1ff94'}
                            ]
                        )
                    }
                },
                data: [1, 52, 200, 334, 200, 330, 220]
            }]
        },
        data = genData(50),
        option2 = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                x: 'left'
                // data: data.seriesData.map(v => v.name)
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],

                label: {
                    normal: {

                        position: 'inner'
                    }
                },

                data: data.seriesData
            }]
        };


        echartsSoap.registerPreprocessor('innerPieLabelMinPercent','5%');
        
        // echartsSoap.registerPreprocessor('barShadow','#3f4b78');
        echartsSoap.traverse(option ,'barShadow','#3f4b78');
        echartsSoap.registerRenderAfter('dataZoomFitWidth',function(dom,orginalOption){
            return orginalOption.series[0].data.length > 4
        });
        echartsSoap.registerPreprocessor('bar.series.barMinHeight',10);
        echartsSoap.registerPreprocessor('pie.data.tooltip',{
            formatter: function (params) {
                var html = "";
            
                var element = params, resultValue = "";
      
                  resultValue = isNaN(element.value) ? 0 : String(element.value);
                
              
                html += '<div style="background:' + element.color + ';width:8px;height:8px;border-radius:8px;display:inline-block;margin-right:3px;"></div>' +
                  element.name + '：' + ( resultValue + ' ' + element.percent + '%' );
                return html;
              }
        });
        echartsSoap.render('bar_min_height', option);

        function genData(count) {
            let nameList = [
                '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
            ],
            legendData = [],
            seriesData = [];

            for (let i = 0; i < 20; i++) {
                name = Math.random() > 0.65 ? makeWord(4, 1) + '·' + makeWord(3, 0) : makeWord(2, 1);
                legendData.push(name);
                seriesData.push({
                    name: name,
                    value: Math.round(Math.random() * 100000)
                });
            }

            return {
                legendData: legendData,
                seriesData: seriesData
            };

            function makeWord(max, min) {
                let nameLen = Math.ceil(Math.random() * max + min),
                name = [];
                for (let i = 0; i < nameLen; i++) {
                    name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
                }
                return name.join('');
            }
        }
        // dom2 = document.getElementById('pie_min_percent_label')
        //    , instance2 = echarts.getInstanceByDom(dom2);
        //    instance2 = echarts.init(dom2);
        //    instance2.setOption(option2);
        echartsSoap.render('pie_min_percent_label', option2)
            //   if (typeof instance == 'undefined') {
            //   instance = echarts.init(dom);
            //   instance.setOption(option);
            // } else {
            //   echarts.dispose(instance);

        //   instance = echarts.init(dom);//echarts '3.3.2' 地图instance.setOption(option, true);后指向地图某个区域左侧Visualmap还是初始时的这个区域的值，这里销毁instance重新init.
        //   instance.setOption(option);
        // }