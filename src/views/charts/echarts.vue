<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24">
                <el-select v-model="unit1" filterable placeholder="请选择">
                    <el-option
                            v-for="item in units"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="exam1" filterable placeholder="请选择">
                    <el-option
                            v-for="item in exams"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="drawColumnChart">搜索</el-button>
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <el-select v-model="exam2" filterable placeholder="请选择">
                    <el-option
                            v-for="item in exams"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="drawBarChart">搜索</el-button>
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <el-select v-model="unit2" filterable placeholder="请选择">
                    <el-option
                            v-for="item in units"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="drawLineChart">搜索</el-button>
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <el-select v-model="unit3" filterable placeholder="请选择">
                    <el-option
                            v-for="item in units"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="exam3" filterable placeholder="请选择">
                    <el-option
                            v-for="item in exams"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="drawPieChart">搜索</el-button>
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
    import {getSuperiority, getScore, getRate, getRank, getUnitList, getExamList} from '../../api/api'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                units:[],
                exams:[],
                unit1: null,
                unit2: null,
                unit3: null,
                exam1: null,
                exam2: null,
                exam3: null,
            }
        },

        methods: {
            drawColumnChart() {
                var params = {
                    'examId' : this.exam1,
                    'unitId' : this.unit1
                }

                getScore(params).then((res) => {
                    this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                    this.chartColumn.setOption({
                        title: { text: '考试成绩' },
                        tooltip: {},
                        xAxis: {
                            data: res.data.results.users,
                        },
                        yAxis: {},
                        series: [{
                            name: '成绩',
                            type: 'bar',
                            data: res.data.results.scores,
                        }]
                    });
                });
            },
            drawBarChart() {
                var params = {
                    'examId' : this.exam2,
                }
                getRank(params).then((res) => {
                    this.chartBar = echarts.init(document.getElementById('chartBar'));
                    this.chartBar.setOption({
                        title: {
                            text: '单位考试排名',
                            subtext: '数据来自网络'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
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
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: res.data.results.units,
                        },
                        series: [
                            {
                                name: '合格率',
                                type: 'bar',
                                data: res.data.results.pass,
                            },
                            {
                                name: '优秀率',
                                type: 'bar',
                                data: res.data.results.good,
                            }
                        ]
                    });
                })
            },
            drawLineChart() {
                var params = {
                    'unitId' : this.unit2,
                }

                getRate(params).then((res) => {
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
                            data: res.data.results.exams,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '合格率',
                                type: 'line',
                                stack: '总量1',
                                data: res.data.results.pass,
                            },
                            {
                                name: '优秀率',
                                type: 'line',
                                stack: '总量2',
                                data: res.data.results.good,
                            }
                        ]
                    });
                })
            },
            drawPieChart() {
                var params = {
                    "examId": this.exam3,
                    "unitId": this.unit3,
                };

                getSuperiority(params).then((res) => {
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
                                data: res.data.results.superiority,
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
                });

            },
            drawCharts() {
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
            },

            getUnits() {
                let para = {};
                let result = [];
                getUnitList(para).then((res) => {
                    let units = res.data.results.units;
                    units.forEach((unit, index) => {
                        result.push({
                            label: unit.unitName,
                            value: unit.id + "",
                        })
                    });
                    this.units = result;
                })
            },

            getExams() {
                let para = {};
                let result = [];
                getExamList(para).then((res) => {
                    let exams = res.data.results.exams;
                    exams.forEach((exam, index) => {
                        result.push({
                            label: exam.examName,
                            value: exam.id + "",
                        })
                    });
                    this.exams = result;
                })
            }
        },

        mounted: function () {
            this.drawCharts();
            this.getUnits();
            this.getExams();
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
