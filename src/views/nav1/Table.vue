<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCourses">查询</el-button>
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
		<el-table :data="courses" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<el-table-column prop="courseName" label="课程名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="ajType" label="安监类别" width="100" sortable>
			</el-table-column>
			<el-table-column prop="courseType" label="课程类别" width="100" :formatter="formatType" sortable>
			</el-table-column>
			<el-table-column prop="role" label="推送用户" width="100" :formatter="formatRoleType" sortable>
			</el-table-column>
			<el-table-column prop="homePage" label="首页显示" width="120" sortable>
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
				<el-form-item label="课程名称" prop="courseName">
					<el-input v-model="editForm.courseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程类别">
					<el-radio-group v-model="editForm.courseType">
						<el-radio class="radio" :label="2">视频</el-radio>
						<el-radio class="radio" :label="1">阅读</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="推送对象">
					<el-select v-model="editForm.role" clearable placeholder="请选择">
						<el-option
								v-for="item in roles"
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
				<el-form-item label="首页展示">
					<el-switch
							style="display: block"
							v-model="editForm.homePage"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="是"
							inactive-text="否">
					</el-switch>
				</el-form-item>
				<el-form-item label="课程内容">
					<el-input type="textarea" v-model="editForm.content"></el-input>
				</el-form-item>
				<el-form-item label="课程缩略图">
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
				<el-form-item label="课程视频">
					<el-upload
							class="upload-demo"
							action="http://api.anjian.hanyuhuake.com/upload"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList3"
							:on-success="handleSuccess2">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100mb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="判断题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="editForm.tfList"
							:data="tfData">
					</el-transfer>
				</el-form-item>
				<el-form-item label="单选题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="editForm.scList"
							:data="scData">
					</el-transfer>
				</el-form-item>
				<el-form-item label="多选题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="editForm.mcList"
							:data="mcData">
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
				<el-form-item label="课程名称" prop="courseName">
					<el-input v-model="addForm.courseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="课程类别">
					<el-radio-group v-model="addForm.courseType">
						<el-radio class="radio" :label="2">视频</el-radio>
						<el-radio class="radio" :label="1">阅读</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="推送对象">
					<el-select v-model="addForm.role" clearable placeholder="请选择">
						<el-option
								v-for="item in roles"
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
				<el-form-item label="首页展示">
					<el-switch
							style="display: block"
							v-model="addForm.homePage"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="是"
							inactive-text="否">
					</el-switch>
				</el-form-item>
				<el-form-item label="课程内容">
					<el-input type="textarea" v-model="addForm.content"></el-input>
				</el-form-item>
				<el-form-item label="课程缩略图">
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
				<el-form-item label="课程视频">
					<el-upload
							class="upload-demo"
							action="http://api.anjian.hanyuhuake.com/upload"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList3"
							:on-success="handleSuccess2">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100mb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="判断题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="addForm.tfList"
							:data="tfData">
					</el-transfer>
				</el-form-item>
				<el-form-item label="单选题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="addForm.scList"
							:data="scData">
					</el-transfer>
				</el-form-item>
				<el-form-item label="多选题">
					<el-transfer
							filterable
							:filter-method="filterMethod"
							filter-placeholder="请输入试题编号"
							:titles="['试题库', '课程试题']"
							v-model="addForm.mcList"
							:data="mcData">
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
	import { getCourseListPage, removeCourse, batchRemoveCourse, editCourse, addCourse, getQuestionList, sevenZip } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				courses: [],
				total: 0,
				page: 0,
				listLoading: false,
				sels: [],//列表选中列
				zipLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					courseName: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
                    courseName: '',
                    courseType: -1,
                    homePage: true,
                    content: '',
                    ajType: '',
                    icon: '',
                    iconName: '',
					video: '',
					videoName: '',
                    tfList: [],
                    scList: [],
                    mcList: [],
					role: '',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					courseName: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					courseName: '',
					courseType: -1,
					homePage: true,
					content: '',
					ajType: '',
                    icon:'',
                    iconName:'',
                    video: '',
                    videoName: '',
					tfList: [],
					scList: [],
					mcList: [],
					role: '',
				},
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
				fileList2: [],
				fileList3: [],
				tfData: [],
				scData: [],
				mcData: [],
				tfAll: [],
				scAll: [],
				mcAll: [],
				roles: [
                    {
                        value: 'app1',
                        label: '企业用户'
                    },
                    {
                        value: 'app2',
                        label: '安委会部门负责人'
                    },
				]
			}
		},
		methods: {
			//性别显示转换
			formatType: function (row, column) {
				return row.courseType == 1 ? '阅读' : row.courseType == 2 ? '视频' : '未知';
			},
            formatRoleType: function (row, column) {
                return row.role == 'app1' ? '企业用户' : row.role == 'app2' ? '安委会部门负责人' : '未知';
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getCourses();
			},
			//获取用户列表
			getCourses() {
				let para = {
					page: this.page - 1,
					query: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getCourseListPage(para).then((res) => {
					this.total = res.data.results.courses.totalElements;
					this.courses = res.data.results.courses.content;
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
					removeCourse(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCourses();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
                this.fileList2 = [];
				var file = {name: this.editForm.iconName, url: this.editForm.icon};
				this.fileList2.push(file);


                this.fileList3 = [];
				var file = {name: this.editForm.videoName, url: this.editForm.video};
				this.fileList3.push(file);

                this.getTfList();
                this.getScList();
                this.getMcList();

                let tfs = [];
                if (this.editForm.tfList.length > 0) {
                    this.editForm.tfList.forEach((question, index) => {
                        tfs.push(question.id)
					})
				}
				this.editForm.tfList = tfs;

                let scs = [];
                if (this.editForm.scList.length > 0) {
                    this.editForm.scList.forEach((question, index) => {
                        scs.push(question.id)
                    })
                }
                this.editForm.scList = scs;

                let mcs = [];
                if (this.editForm.mcList.length > 0) {
                    this.editForm.mcList.forEach((question, index) => {
                        mcs.push(question.id)
                    })
                }
                this.editForm.mcList = mcs;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    courseName: '',
                    courseType: -1,
                    ajType: '',
                    //是否首页展示
					icon:'',
					iconName:'',
                    video: '',
                    videoName: '',
                    homePage: true,
                    content: '',
                    tfList: [],
                    scList: [],
                    mcList: [],
					role: '',
				};
                this.fileList2 = [];
                this.fileList3 = [];
                this.getTfList();
				this.getScList();
				this.getMcList();
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							if (this.fileList2.length > 0) {
                                para.iconName = this.fileList2[0].name;
                                para.icon = this.fileList2[0].url;
							}
							if (this.fileList3.length > 0) {
                                para.videoName = this.fileList3[0].name;
                                para.video = this.fileList3[0].url;
							}

                            let tfs = [];
                            para.tfList.forEach((tf, index) => {
                                for (var tf2 of this.tfAll) {
                                    if (tf2.id == tf) {
                                        tfs.push(tf2);
									}
								}
							});
                            para.tfList = tfs;

                            let scs = [];
                            para.scList.forEach((sc, index) => {
                                for (var sc2 of this.scAll) {
                                    if (sc2.id == sc) {
                                        scs.push(sc2);
                                    }
                                }
                            });
                            para.scList = scs;

                            let mcs = [];
                            para.mcList.forEach((mc, index) => {
                                for (var mc2 of this.mcAll) {
                                    if (mc2.id == mc) {
                                        mcs.push(mc2);
                                    }
                                }
                            });
                            para.mcList = mcs;
							editCourse(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCourses();
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
                            if (this.fileList2.length > 0) {
                                para.iconName = this.fileList2[0].name;
                                para.icon = this.fileList2[0].url;
                            }
                            if (this.fileList3.length > 0) {
                                para.videoName = this.fileList3[0].name;
                                para.video = this.fileList3[0].url;
                            }
                            let tfs = [];
                            para.tfList.forEach((tf, index) => {
                                for (var tf2 of this.tfAll) {
                                    if (tf2.id == tf) {
                                        tfs.push(tf2);
                                    }
                                }
                            });
                            para.tfList = tfs;

                            let scs = [];
                            para.scList.forEach((sc, index) => {
                                for (var sc2 of this.scAll) {
                                    if (sc2.id == sc) {
                                        scs.push(sc2);
                                    }
                                }
                            });
                            para.scList = scs;

                            let mcs = [];
                            para.mcList.forEach((mc, index) => {
                                for (var mc2 of this.mcAll) {
                                    if (mc2.id == mc) {
                                        mcs.push(mc2);
                                    }
                                }
                            });
                            para.mcList = mcs;
							addCourse(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCourses();
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
					batchRemoveCourse(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCourses();
					});
				}).catch(() => {

				});
			},
            onEditorBlur: function(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus: function(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady: function(quill) {
                console.log('editor ready!', quill)
            },
            onEditorChange: function({ quill, html, text }) {
                console.log('editor change!', quill, html, text)
                this.content = html
            },
            handleSuccess: function(response, files, fileList) {
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
            handleSuccess2: function(response, files, fileList) {
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
			filterMethod: function(query, item) {
			    return item.label.indexOf(query) > -1;
			},
            getTfList: function() {
                let para = {
                    questionType: "tf"
                };
                let result = [];
                getQuestionList(para).then((res) => {
                    let questions = res.data.results.questions;
                    this.tfAll = questions;
                    questions.forEach((question, index) => {
                        result.push({
                            label: question.uid,
                            key: question.id,
                        })
                    })
                });
                this.tfData = result;
            },
            getScList: function() {
                let para = {
                    questionType: "sc"
                };
                let result = [];
                getQuestionList(para).then((res) => {
                    let questions = res.data.results.questions;
                    this.scAll = questions;
                    questions.forEach((question, index) => {
                        result.push({
                            label: question.uid,
                            key: question.id,
                        })
                    })
                });
                this.scData = result;
            },
            getMcList: function() {
                let para = {
                    questionType: "mc"
                };
                let result = [];
                getQuestionList(para).then((res) => {
                    let questions = res.data.results.questions;
                    this.mcAll = questions;
                    questions.forEach((question, index) => {
                        result.push({
                            label: question.uid,
                            key: question.id,
                        })
                    })
                });
                this.mcData = result;
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
			this.getCourses();
		}
	}

</script>

<style scoped>

</style>