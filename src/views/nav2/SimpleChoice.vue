<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="试题编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQuestions">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="questionList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="uid" label="试题编号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="question" label="试题内容" width="180" sortable>
            </el-table-column>
            <el-table-column prop="ajType" label="安监类型" width="120" sortable>
            </el-table-column>
            <el-table-column prop="answer" label="答案" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" sortable>
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
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="试题内容" prop="question">
                    <el-input type="textarea" v-model="editForm.question" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="试题类别">
                    <el-select v-model="editForm.questionType" placeholder="请选择" disable>
                        <el-option
                                v-for="item in questionType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安监类别">
                    <el-select v-model="editForm.ajType" clearable placeholder="请选择">
                        <el-option
                                v-for="item in ajType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="试题图片">
                    <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="3"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="选项A" prop="choiceA">
                    <el-input v-model="editForm.choiceA"></el-input>
                </el-form-item>
                <el-form-item label="选项B" prop="choiceB">
                    <el-input v-model="editForm.choiceB"></el-input>
                </el-form-item>
                <el-form-item label="选项C" prop="choiceC">
                    <el-input v-model="editForm.choiceC"></el-input>
                </el-form-item>
                <el-form-item label="选项D" prop="choiceD">
                    <el-input v-model="editForm.choiceD"></el-input>
                </el-form-item>
                <el-form-item label="答案">
                    <el-radio-group v-model="editForm.answer">
                        <el-radio label="choiceA">选项A</el-radio>
                        <el-radio label="choiceB">选项B</el-radio>
                        <el-radio label="choiceC">选项C</el-radio>
                        <el-radio label="choiceD">选项D</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="试题解析">
                    <el-input type="textarea" v-model="editForm.analysis"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="试题内容" prop="question">
                    <el-input type="textarea" v-model="addForm.question" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="试题类别">
                    <el-select v-model="addForm.questionType" placeholder="请选择" disable>
                        <el-option
                                v-for="item in questionType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安监类别">
                    <el-select v-model="addForm.ajType" clearable placeholder="请选择">
                        <el-option
                                v-for="item in ajType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="试题图片">
                    <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="3"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="选项A" prop="choiceA">
                    <el-input v-model="addForm.choiceA"></el-input>
                </el-form-item>
                <el-form-item label="选项B" prop="choiceB">
                    <el-input v-model="addForm.choiceB"></el-input>
                </el-form-item>
                <el-form-item label="选项C" prop="choiceC">
                    <el-input v-model="addForm.choiceC"></el-input>
                </el-form-item>
                <el-form-item label="选项D" prop="choiceD">
                    <el-input v-model="addForm.choiceD"></el-input>
                </el-form-item>
                <el-form-item label="答案">
                    <el-radio-group v-model="addForm.answer">
                        <el-radio label="choiceA">选项A</el-radio>
                        <el-radio label="choiceB">选项B</el-radio>
                        <el-radio label="choiceC">选项C</el-radio>
                        <el-radio label="choiceD">选项D</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="试题解析">
                    <el-input type="textarea" v-model="addForm.analysis"></el-input>
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
    import { getQuestionListPage, removeQuestion, batchRemoveQuestion, editSimpleChoice, addSimpleChoice } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                questionList: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    question: [
                        { required: true, message: '请输入试题内容', trigger: 'blur' }
                    ],
                    choiceA: [
                        { required: true, message: '请输入选项A内容', trigger: 'blur' }
                    ],
                    choiceB: [
                        { required: true, message: '请输入选项B内容', trigger: 'blur' }
                    ],
                    choiceC: [
                        { required: true, message: '请输入选项C内容', trigger: 'blur' }
                    ],
                    choiceD: [
                        { required: true, message: '请输入选项D内容', trigger: 'blur' }
                    ],
                },
                //编辑界面数据
                editForm: {
                    question: '',
                    answer: 'choiceA',
                    questionType: 'sc',
                    ajType: '',
                    analysis: '',
                    choiceA: '',
                    choiceB: '',
                    choiceC: '',
                    choiceD: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    question: [
                        { required: true, message: '请输入试题内容', trigger: 'blur' }
                    ],
                    choiceA: [
                        { required: true, message: '请输入选项A内容', trigger: 'blur' }
                    ],
                    choiceB: [
                        { required: true, message: '请输入选项B内容', trigger: 'blur' }
                    ],
                    choiceC: [
                        { required: true, message: '请输入选项C内容', trigger: 'blur' }
                    ],
                    choiceD: [
                        { required: true, message: '请输入选项D内容', trigger: 'blur' }
                    ],
                },
                //新增界面数据
                addForm: {
                    question: '',
                    answer: 'choiceA',
                    questionType: 'sc',
                    ajType: '',
                    analysis: '',
                    choiceA: '',
                    choiceB: '',
                    choiceC: '',
                    choiceD: ''
                },
                questionType: [
                    {
                        value: 'sc',
                        label: '单选题'
                    }
                ],
                ajType: [
                    {
                        value: '危险化学品',
                        label: '危险化学品'
                    },
                    {
                        value: '建筑施工',
                        label: '建筑施工'
                    },
                    {
                        value: '人员密集场所',
                        label: '人员密集场所'
                    },
                    {
                        value: '交通运输',
                        label: '交通运输'
                    },
                    {
                        value: '工业企业',
                        label: '工业企业'
                    },
                    {
                        value: '消防',
                        label: '消防'
                    },
                    {
                        value: '特种设备',
                        label: '特种设备'
                    },
                ],
                fileList: []
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getQuestions();
            },
            //获取试题列表
            getQuestions() {
                let para = {
                    page: this.page - 1,
                    questionType: 'sc',
					query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getQuestionListPage(para).then((res) => {
                    this.total = res.data.results.questions.totalElements;
                    this.questionList = res.data.results.questions.content;
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
                    let para = { id: row.id , questionType: 'sc'};
                    removeQuestion(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getQuestions();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    question: '',
                    answer: 'choiceA',
                    questionType: 'sc',
                    ajType: '',
                    analysis: '',
                    choiceA: '',
                    choiceB: '',
                    choiceC: '',
                    choiceD: '',
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editSimpleChoice(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getQuestions();
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
//                            let para = {
//                                question: this.addForm.question,
//                                answer: this.addForm.answer,
//                                questionType: this.addForm.questionType,
//                                ajType: this.addForm.ajType,
//                                analysis: this.addForm.analysis,}
                            //                     JSON.stringify(para);
//							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addSimpleChoice(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getQuestions();
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
                    let para = { id: ids, questionType: 'sc' };
                    batchRemoveQuestion(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getQuestions();
                    });
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.getQuestions();
        }
    }

</script>

<style scoped>

</style>