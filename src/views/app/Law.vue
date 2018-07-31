<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="法律名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getLaws">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="lawList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="lawName" label="法律名称" width="180" sortable>
            </el-table-column>
            <el-table-column prop="lawType" label="法律归类" :formatter="formatType" width="120" sortable>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名称" width="180" sortable>
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
                <el-form-item label="法律名称" prop="lawName">
                    <el-input v-model="editForm.lawName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="法律归类">
                    <el-select v-model="editForm.lawType" placeholder="请选择" disable>
                        <el-option
                                v-for="item in lawType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="法律缩略图">
                    <el-upload
                            class="upload-demo"
                            action="http://39.105.27.225/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList3"
                            type="picture"
                            :on-success="handleSuccess2">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10mb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="法律文件">
                    <el-upload
                            class="upload-demo"
                            action="http://39.105.27.225/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList2"
                            type="picture"
                            :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
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
                <el-form-item label="法律名称" prop="lawName">
                    <el-input v-model="addForm.lawName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="法律归类">
                    <el-select v-model="addForm.lawType" placeholder="请选择" disable>
                        <el-option
                                v-for="item in lawType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="法律缩略图">
                    <el-upload
                            class="upload-demo"
                            action="http://39.105.27.225/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList3"
                            type="picture"
                            :on-success="handleSuccess2">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10mb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="法律文件">
                    <el-upload
                            class="upload-demo"
                            action="http://39.105.27.225/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList2"
                            type="picture"
                            :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10mb</div>
                    </el-upload>
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
    import { getLawListPage, removeLaw, batchRemoveLaw, editLaw, addLaw } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                lawList: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    lawName: [
                        { required: true, message: '请输入法律名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    lawName: '',
                    lawType: '',
                    iconName: '',
                    iconPath: '',
                    fileName: '',
                    filePath: '',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    lawName: [
                        { required: true, message: '请输入法律名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    lawName: '',
                    lawType: '',
                    iconName: '',
                    iconPath: '',
                    fileName: '',
                    filePath: '',
                },

                lawType: [
                    {
                        value: '0',
                        label: '法律法规'
                    },
                    {
                        value: '1',
                        label: '规范性文件'
                    },
                    {
                        value: '2',
                        label: '标准规范'
                    },
                    {
                        value: '3',
                        label: '文件解读'
                    },
                ],
                fileList2: [],
                fileList3: [],
            }
        },
        methods: {
            formatType: function (row, column) {
                return row.lawType == 0 ? '法律法规' : row.lawType == 1 ? '规范性文件' : row.lawType == 2 ? '标准规范' : row.lawType == 3 ? '文件解读' : '未知';
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getLaws();
            },
            //获取试题列表
            getLaws() {
                let para = {
                    page: this.page - 1,
					query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getLawListPage(para).then((res) => {
                    this.total = res.data.results.laws.totalElements;
                    this.lawList = res.data.results.laws.content;
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
                    removeLaw(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLaws();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.fileList2 = [];
                this.fileList3 = [];
                const item = {name : row.fileName, url : row.filePath};
                const item2 = {name : row.iconName, url : row.iconPath};
                this.fileList2.push(item);
                this.fileList3.push(item2);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    lawName: '',
                    lawType: '',
                    fileName: '',
                    filePath: '',
                };
                this.fileList2 = [];
                this.fileList3 = [];
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.fileName = this.fileList2[0].name;
                            para.filePath = this.fileList2[0].url;
                            para.iconName = this.fileList3[0].name;
                            para.iconPath = this.fileList3[0].url;
                            editLaw(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getLaws();
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
                            para.fileName = this.fileList2[0].name;
                            para.filePath = this.fileList2[0].url;
                            para.iconName = this.fileList3[0].name;
                            para.iconPath = this.fileList3[0].url;
                            addLaw(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getLaws();
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
                    batchRemoveLaw(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLaws();
                    });
                }).catch(() => {

                });
            },

            handleSuccess(response, files, fileList) {
                for(var file of fileList) {
                    let item = {};
                    if (null != file.response) {
                        item = {name: file.name, url: file.response.results.path}
                    } else {
                        item = {name: file.name, url: file.url}
                    }
                    this.fileList2 = [];
                    this.fileList2.push(item)
                }
            },

            handleSuccess2(response, files, fileList) {
                for(var file of fileList) {
                    let item = {};
                    if (null != file.response) {
                        item = {name: file.name, url: file.response.results.path}
                    } else {
                        item = {name: file.name, url: file.url}
                    }
                    this.fileList3 = [];
                    this.fileList3.push(item)
                }
            },
        },
        mounted() {
            this.getLaws();
        }
    }

</script>

<style scoped>

</style>