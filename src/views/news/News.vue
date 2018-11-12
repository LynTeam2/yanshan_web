<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="新闻标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getNews">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="newsList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="id" width="60">
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" width="120" sortable>
            </el-table-column>
            <el-table-column prop="introduction" label="新闻简介" width="180" sortable>
            </el-table-column>
            <el-table-column prop="newsTime" label="新闻发布时间" width="180" sortable>
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
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="70%">
            <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="editForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻简介">
                    <el-input type="textarea" v-model="editForm.introduction"></el-input>
                </el-form-item>
                <el-form-item label="新闻缩略图">
                    <el-upload
                            class="upload-demo"
                            action="http://api.anjian.hanyuhuake.com/upload"
                            list-type="picture"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="新闻发布时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.newsTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="新闻内容">
                    <quill-editor v-model="editForm.content"
                                  ref="myQuillEditor"
                                  :options="editorOption"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)">
                    </quill-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="70%">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="addForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻简介">
                    <el-input type="textarea" v-model="addForm.introduction"></el-input>
                </el-form-item>
                <el-form-item label="新闻缩略图">
                    <el-upload
                            class="upload-demo"
                            action="http://api.anjian.hanyuhuake.com/upload"
                            list-type="picture"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList2"
                            :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="新闻发布时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.newsTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="新闻内容">
                    <quill-editor
                              id="editor"
                              v-model="addForm.content"
                              ref="myQuillEditor"
                              :options="editorOption"
                              @blur="onEditorBlur($event)"
                              @focus="onEditorFocus($event)"
                              @ready="onEditorReady($event)">
                    </quill-editor>
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
    import Quill from 'quill'
//    import VueQuillEditor from 'vue-quill-editor'
//    import { ImageDrop } from 'quill-image-drop-module'
//    import ImageResize from 'quill-image-resize-module';
//    var Align = Quill.import('attributors/style/align');
//    Align.whitelist = ['right', 'center', 'justify'];
//    Quill.register('modules/imageDrop', ImageDrop)
//    Quill.register('modules/imageResize', ImageResize)
//    const quill = new Quill(VueQuillEditor, {
//        // ...
//        modules: {
//            // ...
//            imageDrop: true
//        }
//    });
    import { getNewsListPage, removeNews, batchRemoveNews, editNews, addNews } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                newsList: [],
                total: 0,
                page: 0,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    title: [
                        { required: true, message: '请输入新闻标题', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    title: '',
                    introduction: '',
//					age: 0,
//					birth: '',
//					addr: '',
                    //安监类别
                    //是否首页展示
                    imageName: '',
                    imagePath: '',
                    newsTime: '',
                    content: '',
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    title: [
                        { required: true, message: '请输入新闻标题', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    title: '',
                    introduction: '',
//					age: 0,
//					birth: '',
//					addr: '',
                    //安监类别
                    //是否首页展示
                    imageName: '',
                    imagePath: '',
                    newsTime: '',
                    content: '',
                },
                fileList:[],
                fileList2: [],
                editorOption: {
//                    modules: {
//                        toolbar: [
//                            [{ 'size': ['small', false, 'large'] }],
//                            ['bold', 'italic'],
//                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//                            ['link', 'image']
//                        ],
//                        history: {
//                            delay: 1000,
//                            maxStack: 50,
//                            userOnly: false
//                        },
//                        imageDrop: true,
//                        imageResize: {
//                            displayStyles: {
//                                backgroundColor: 'black',
//                                border: 'none',
//                                color: 'white'
//                            },
//                            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
//                        }
//                    }
                }
            }
        },
        compited: {
            editor() {
                return this.$refs.myQuillEditor.quill
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
            //性别显示转换
            formatType: function (row, column) {
                return row.courseType == 1 ? '阅读' : row.courseType == 2 ? '视频' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getNews();
            },
            //获取用户列表
            getNews() {
                let para = {
                    page: this.page,
					query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getNewsListPage(para).then((res) => {
                    this.total = res.data.results.newsList.totalElements;
                    this.newsList = res.data.results.newsList.content;
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
                    removeNews(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNews();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.fileList2 = [];
                var file = {name: this.editForm.imageName, url: this.editForm.imagePath};
                this.fileList2.push(file)

            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    title: '',
                    introduction: '',
//					age: 0,
//					birth: '',
//					addr: '',
                    //安监类别
                    imageName: '',
                    imagePath: '',
                    newsTime: '',
                    content: '',
                };
                this.fileList2 = []
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.imageName = this.fileList2[0].name;
                            para.imagePath = this.fileList2[0].url;
                            editNews(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getNews();
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
                            para.imageName = this.fileList2[0].name;
                            para.imagePath = this.fileList2[0].url;
//							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addNews(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getNews();
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
                    batchRemoveNews(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNews();
                    });
                }).catch(() => {

                });
            },

            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },
            onEditorChange({ quill, html, text }) {
                console.log('editor change!', quill, html, text)
                this.content = html
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
            }
        },
        mounted() {
            this.getNews();
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        }
    }

</script>

<style scoped>

</style>