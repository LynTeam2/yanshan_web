<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="企业名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUnits">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="units" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="unitName" label="企业名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="headerName" label="企业负责人" width="100" sortable>
            </el-table-column>
            <el-table-column prop="telephone" label="联系电话" width="100" sortable>
            </el-table-column>
            <el-table-column prop="address" label="联系地址" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
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
                <el-form-item label="企业名称" prop="unitName">
                    <el-input v-model="editForm.unitName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="editForm.headerName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="传真">
                    <el-input v-model="editForm.fax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系地址">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
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
                <el-form-item label="企业名称" prop="unitName">
                    <el-input v-model="addForm.unitName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="addForm.headerName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="addForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="传真">
                    <el-input v-model="addForm.fax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系地址">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
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
    import { getUnitListPage, removeUnit, batchRemoveUnit, editUnit, addUnit} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                units: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列
                zipLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    unitName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    unitName: '',
                    headerName: '',
                    telephone: '',
                    email: '',
                    fax: '',
                    address: '',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    unitName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    unitName: '',
                    headerName: '',
                    telephone: '',
                    email: '',
                    fax: '',
                    address: '',
                },
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getUnits();
            },
            //获取用户列表
            getUnits() {
                let para = {
                    page: this.page - 1,
                    query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getUnitListPage(para).then((res) => {
                    this.total = res.data.results.units.totalElements;
                    this.units = res.data.results.units.content;
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
                    let para = { id: row.id };
                    removeUnit(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUnits();
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
                    unitName: '',
                    headerName: '',
                    telephone: '',
                    email: '',
                    fax: '',
                    address: '',
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

                            editUnit(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUnits();
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
                            addUnit(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUnits();
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
                    let para = { id: ids };
                    batchRemoveUnit(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUnits();
                    });
                }).catch(() => {

                });
            },
            filterMethod: function(query, item) {
                return item.label.indexOf(query) > -1;
            },
        },
        mounted() {
            this.getUnits();
        }
    }

</script>

<style scoped>

</style>