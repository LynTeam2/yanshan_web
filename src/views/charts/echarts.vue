<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null
            }
        },

        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: '考试成绩' },
                  tooltip: {},
                  xAxis: {
                      data: ["考生1", "考生2", "考生3", "考生4", "考生5", "考生6"]
                  },
                  yAxis: {},
                  series: [{
                      name: '成绩',
                      type: 'bar',
                      data: [70, 80, 75, 50, 100, 80]
                    }]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: '年度考核情况',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2018年', '2019年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['单位1', '单位2', '单位3', '单位4', '单位5', '合格次数(次)']
                    },
                    series: [
                        {
                            name: '2018年',
                            type: 'bar',
                            data: [3, 6, 2, 5, 3, 19]
                        },
                        {
                            name: '2019年',
                            type: 'bar',
                            data: [4, 6, 10, 7, 9, 36]
                        }
                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '单位合格优秀率'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['合格率', '优秀率']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '合格率',
                            type: 'line',
                            stack: '总量1',
                            data: [75, 70, 85, 85, 90, 85, 65, 50, 100, 70, 80, 90]
                        },
                        {
                            name: '优秀率',
                            type: 'line',
                            stack: '总量2',
                            data: [40, 35, 20, 50, 60, 20, 15, 20, 60, 30, 10, 0]
                        }
                    ]
                });
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '错题分布图',
                        subtext: '安监类型',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['危险化学品', '建筑施工', '人员密集场所', '交通运输', '工业企业', '消防', '特种设备']
                    },
                    series: [
                        {
                            name: '错题类型',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: 335, name: '危险化学品' },
                                { value: 310, name: '建筑施工' },
                                { value: 234, name: '人员密集场所' },
                                { value: 135, name: '交通运输' },
                                { value: 1548, name: '工业企业' },
                                { value: 123, name: '消防' },
                                { value: 743, name: '特种设备' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
