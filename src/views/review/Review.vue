<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.reviewResult" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getReviews">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="reviews" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="module" label="操作模块" width="120" :formatter="formatModuleType" sortable>
            </el-table-column>
            <el-table-column prop="operate" label="操作类型" width="100" :formatter="formatOperateType" sortable>
            </el-table-column>
            <el-table-column prop="operatorName" label="操作人" width="100" sortable>
            </el-table-column>
            <el-table-column prop="operateTime" label="操作时间" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="reviewResult" label="审核结果" min-width="180" :formatter="formatReviewResultType" sortable>
            </el-table-column>
            <el-table-column prop="reviewerName" label="审核人"  width="120" sortable>
            </el-table-column>
            <el-table-column prop="reviewTime" label="审核时间" min-width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="allow(scope.$index, scope.row)">审核通过</el-button>
                    <el-button type="danger" size="small" @click="refuse(scope.$index, scope.row)">审核不通过</el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getReviewListPage, commitReview} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    reviewResult: '',
                    options: [
                        {
                            label: '待审核',
                            value: '0',
                        },
                        {
                            label: '审核通过',
                            value: '1',
                        },
                        {
                            label: '审核未通过',
                            value: '2',
                        }
                    ],
                },
                reviews: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列
            }
        },
        methods: {
            formatModuleType: function (row, column) {
                return row.module == 'user' ? '用户' : row.module == 'unit' ? '单位' : '未知';
            },
            formatOperateType: function (row, column) {
                return row.operate == 'add' ? '新增' : row.operate == 'modify' ? '更新' : row.operate == 'delete' ? '删除' : '未知';
            },
            formatReviewResultType: function (row, column) {
                return row.reviewResult == 0 ? '待审核' : row.reviewResult == 1 ? '审核通过' : row.reviewResult == 2 ? '审核未通过' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getReviews();
            },
            //获取用户列表
            getReviews() {
                let para = {
                    page: this.page - 1,
                    reviewResult: this.filters.reviewResult
                };
                this.listLoading = true;
                //NProgress.start();
                getReviewListPage(para).then((res) => {
                    this.total = res.data.results.reviews.totalElements;
                    this.reviews = res.data.results.reviews.content;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            allow: function (index, row) {
                this.$confirm('确认审核通过吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    var para = row;
                    para.reviewResult = 1;
                    commitReview(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                        this.getReviews();
                    });
                }).catch(() => {

                });
            },

            refuse: function (index, row) {
                this.$confirm('确认审核通过吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    var para = row;
                    para.reviewResult = 2;
                    commitReview(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                        this.getReviews();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getReviews();
        }
    }

</script>

<style scoped>

</style>