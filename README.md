# echarts-soap
![before preview](echarts-soap1.jpg)  

use echarts-soap after

![after preview](echarts-soap2.jpg)  

this demo just use 4 method

```
echartsSoap.registerPreprocessor("innerPieLabelMinPercent","5%");
echartsSoap.registerPreprocessor("barShadow",'#3f4b78');
echartsSoap.registerRenderAfter("dataZoomFitWidth",function(dom,orginalOption){
            return orginalOption.series[0].data.length > 4
});
echartsSoap.registerPreprocessor("bar.series.barMinHeight",10);
```

## echarts-soap 是什么？