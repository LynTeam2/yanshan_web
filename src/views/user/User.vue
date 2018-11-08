<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="userName" label="用户名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="realName" label="真实姓名" width="100" sortable>
            </el-table-column>
            <el-table-column prop="telephone" label="联系电话" width="100" sortable>
            </el-table-column>
            <el-table-column prop="" label="角色权限" :formatter="formatType" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="warning" size="small" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
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
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="editForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色权限">
                    <el-select v-model="editForm.role" clearable placeholder="请选择">
                        <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属企业">
                    <el-select v-model="editForm.unitId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in units"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="addForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="addForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色权限">
                    <el-select v-model="addForm.role" clearable placeholder="请选择">
                        <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属企业">
                    <el-select v-model="addForm.unitId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in units"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getUnitList, resetPassword} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列
                zipLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    userName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    userName: '',
                    realName: '',
                    telephone: '',
                    role: '',
                    unitId: '',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    userName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    userName: '',
                    realName: '',
                    telephone: '',
                    role: '',
                    unitId: '',
                },
                roles: [
                    {
                        label: '超级管理员',
                        value: '1',
                    },
                    {
                        label: '管理员',
                        value: '2',
                    },
                    {
                        label: '企业用户',
                        value: '3',
                    },
                    {
                        label: '安委会部门负责人',
                        value: '4',
                    }
                ],
                units: []
            }
        },
        methods: {
            formatType: function (row, column) {
                return row.role == 1 ? '超级管理员' : row.role == 2 ? '管理员' : row.role == 3 ? '企业用户' : row.role == 4 ? '安委会部门负责人' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page - 1,
                    query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    this.total = res.data.results.users.totalElements;
                    this.users = res.data.results.users.content;
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
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.editForm.unitId = row.unitId;
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    userName: '',
                    realName: '',
                    telephone: '',
                    role: '',
                    unitId: '',
                };
            },
            //重置密码
            handleReset: function (index, row) {
                this.$confirm('确认重置密码吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { userName: row.userName };

                    resetPassword(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '重置成功',
                            type: 'success'
                        });
                    });
                }).catch(() => {

                });
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);

                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
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
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
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
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },

            //获取企业信息
            getUnitList: function () {
                let para = {};
                let result = [];
                getUnitList(para).then((res) => {
                    let units = res.data.results.units;
                    units.forEach((unit, index) => {
                        result.push({
                            label: unit.unitName,
                            value: unit.id + "",
                        })
                    })
                });
                this.units = result;
            }
        },
        mounted() {
            this.getUsers();
            this.getUnitList();
        }
    }

</script>

<style scoped>

</style>