<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="考试名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getExams">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="zipLoading" @click="handleZip">更新数据包</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="examList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="examName" label="考试名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="examType" label="考试类型" width="100" sortable>
            </el-table-column>
            <!--<el-table-column prop="standard" label="及格要求" width="100" sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="examDuration" label="考试时长" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="startDate" label="开放时间" width="100" sortable>
            </el-table-column>
            <el-table-column prop="endDate" label="结束时间" width="100" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="60%">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="考试名称" prop="examName">
                    <el-input type="textarea" v-model="editForm.examName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试类别">
                    <el-radio-group v-model="editForm.examType">
                        <el-radio class="radio" label="综合测验"></el-radio>
                        <el-radio class="radio" label="默认"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考试简介">
                    <el-input type="textarea" v-model="editForm.introduction"></el-input>
                </el-form-item>
                <!--<el-form-item label="及格要求">-->
                    <!--<el-slider v-model="editForm.standard" show-input></el-slider>-->
                <!--</el-form-item>-->
                <el-form-item label="考试时长">
                    <el-slider v-model="editForm.examDuration" show-input></el-slider>
                </el-form-item>
                <el-form-item label="开放时间">
                    <el-date-picker
                            v-model="editForm.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="editForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="考试范围">
                    <el-transfer
                            filterable
                            :filter-method="filterMethod"
                            filter-placeholder="请输入课程名称"
                            :titles="['所有课程', '考试范围']"
                            v-model="editForm.courseList"
                            :data="courseData">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="60%">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="考试名称" prop="examName">
                    <el-input type="textarea" v-model="addForm.examName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试类别">
                    <el-radio-group v-model="addForm.examType">
                        <el-radio class="radio" label="综合测验"></el-radio>
                        <el-radio class="radio" label="默认"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考试简介">
                    <el-input type="textarea" v-model="addForm.introduction"></el-input>
                </el-form-item>
                <!--<el-form-item label="及格要求">-->
                    <!--<el-slider v-model="addForm.standard" show-input></el-slider>-->
                <!--</el-form-item>-->
                <el-form-item label="考试时长">
                    <el-slider v-model="addForm.examDuration" show-input></el-slider>
                </el-form-item>
                <el-form-item label="开放时间">
                    <el-date-picker
                            v-model="addForm.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="addForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="考试范围">
                    <el-transfer
                            filterable
                            :filter-method="filterMethod"
                            filter-placeholder="请输入课程名称"
                            :titles="['所有课程', '考试范围']"
                            v-model="addForm.courseList"
                            :data="courseData">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getExamListPage, removeExam, batchRemoveExam, editExam, addExam, getCourseList, sevenZip } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                examList: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列
                zipLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    examName: [
                        { required: true, message: '请输入考试名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    examName: '',
                    examType: '默认',
                    introduction: '',
//                    standard: 0,
                    examDuration: 30,
                    startDate: '',
                    endDate: '',
                    courseList: [],
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    examName: [
                        { required: true, message: '请输入考试名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    examName: '',
                    examType: '默认',
                    introduction: '',
//                    standard: 0,
                    examDuration: 30,
                    startDate: '',
                    endDate: '',
                    courseList: [],
                },
                courseData: [],
                courseAll: [],
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getExams();
            },
            //获取试题列表
            getExams() {
                let para = {
                    page: this.page - 1,
					query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getExamListPage(para).then((res) => {
                    this.total = res.data.results.exams.totalElements;
                    this.examList = res.data.results.exams.content;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id , questionType: 'tf'};
                    removeExam(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getExams();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.getCourses();
                let courses = [];
                if (this.editForm.courseList.length > 0) {
                    this.editForm.courseList.forEach((course, index) => {
                        courses.push(course.id)
                    })
                }
                this.editForm.courseList = courses;
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    examName: '',
                    examType: '默认',
                    introduction: '',
//                    standard: 0,
                    examDuration: 30,
                    startDate: '',
                    endDate: '',
                    courseList: [],
                };
                this.getCourses();
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);

                            let courses = [];
                            para.courseList.forEach((course, index) => {
                                for (var course2 of this.courseAll) {
                                    if (course2.id == course) {
                                        courses.push(course2);
                                    }
                                }
                            });
                            para.courseList = courses;

                            editExam(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getExams();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);

                            let courses = [];
                            para.courseList.forEach((course, index) => {
                                for (var course2 of this.courseAll) {
                                    if (course2.id == course) {
                                        courses.push(course2);
                                    }
                                }
                            });
                            para.courseList = courses;

                            addExam(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getExams();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: ids, questionType: 'tf' };
                    batchRemoveExam(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getExams();
                    });
                }).catch(() => {

                });
            },
            filterMethod: function(query, item) {
                return item.label.indexOf(query) > -1;
            },
            getCourses: function () {
                let para = {};
                let result = [];
                getCourseList(para).then((res) => {
                    let courses = res.data.results.courses;
                    this.courseAll = courses;
                    courses.forEach((course, index) => {
                        result.push({
                            label: course.courseName,
                            key: course.id,
                        })
                    })
                });
                this.courseData = result
            },
            handleZip: function () {
                this.zipLoading = true;
                let para = {

                };
                sevenZip(para).then((res) => {
                    this.zipLoading = false;
                    //NProgress.done();
                    this.$message({
                        message: '更新数据包成功',
                        type: 'success'
                    });
                })
            },
        },
        mounted() {
            this.getExams();
        }
    }

</script>

<style scoped>

</style>