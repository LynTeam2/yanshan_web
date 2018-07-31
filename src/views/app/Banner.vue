<template>
    <section>
        <div class="block">
            <span class="demonstration">默认 Hover 指示器触发</span>
            <el-carousel height="250px" type="card">
                <el-carousel-item v-for="item in fileList" :key="item.name">
                    <img :src="item.url" width="100%"/>
                </el-carousel-item>
            </el-carousel>
        </div>
        <el-upload
                class="upload-demo"
                drag
                list-type="picture"
                action="http://39.105.27.225/upload"
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :on-success="handleSuccess"
                multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </section>
</template>

<script>
    import util from '../../common/js/util'

    import { getBannerList, saveBannerList } from '../../api/api';

    export default {
        data() {
            return {
                fileList: []
            }
        },
        methods: {
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            getBanners() {
                let para = {};
                getBannerList(para).then(
                    (res) => {
                        let banners = res.data.results.banners
                        for(var banner of banners) {
                            var file = {name : banner.imgName, url: banner.path}
                            this.fileList.push(file)
                        }
                    }
                )
            },
            handleSuccess(response, files, fileList) {
                let para = [];
                for(var file of fileList) {
                    let banner = {};
                    if (null != file.response) {
                        banner = {imgName: file.name, path: file.response.results.path}
                    } else {
                        banner = {imgName: file.name, path: file.url}
                    }

                    para.push(banner)
                }
                saveBannerList(para).then((res) => {
                        this.$message({
                            message: '图片上传成功',
                            type: 'success'
                        });
                    }
                )
            }
        },
        mounted() {
            this.getBanners();
        }
    }
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>