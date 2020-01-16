<template>
  <div class="device-class app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="handleAddDeviceClass">新建设备类型</el-button>
    </div>
    <el-table
      :data="lists"
      height="690"
      border
      style="width: 100%">
      <el-table-column
        label="编号"
        width="180"
        v-loading.body="listLoading"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备名称"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.devclassname}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        align="center">
        <template slot-scope="scope">
          <div>
            <img class="img" :src="scope.row.headimg"
                 alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditDeviceClass(scope.row)" icon="edit">编辑</el-button>
          <!--<el-button type="success" size="mini" icon="check">完成</el-button>-->
          <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form " ref="form" class="demo-ruleForm">
        <el-form-item label="设备类型："
                      prop="devclassname"
                      :rules="{required:true,message:'设备类型不能为空', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-input v-model="form.devclassname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备图片：" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action='uploadApi'
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogTitle==='新建'" @click="handleAddSave(form)">确 定</el-button>
        <el-button type="primary" v-if="dialogTitle!=='新建'" @click="handleEditSave(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pagesize"
      layout="prev, pager, next, jumper"
      :total="total"
      style="">
    </el-pagination>
  </div>
</template>

<script>
  import * as device from 'api/device'
  const uploadApi = process.env.BASE_API + '/uploadFile'
  export default {
    data() {
      return {
        uploadApi,
        lists: [],
        listLoading: true,
        offset: 0,
        currentPage: 1,
        total: 1,
        pagesize: 12,
        dialogFormVisible: false,
        dialogTitle: '新建',
        form: {
          devclassname: '',
          headimg: ''
        },
        formLabelWidth: '130px',
        imageUrl: ''
      }
    },
    created() {
      this._getLists(this.offset, this.pagesize)
    },
    methods: {
      _getLists(offset, max) {
        this.listLoading = true
        device.getClassList(offset, max).then(res => {
          console.log(res.data)
          this.listLoading = false
          this.total = res.data.total
          this.lists = res.data.lists
        })
      },
      handleCurrentChange(o) {
        console.log((o - 1) * this.pagesize)
        this.offset = (o - 1) * this.pagesize
        this._getLists(this.offset, this.pagesize)
      },
      handleSizeChange() {
        console.log('333')
      },
      handleAddDeviceClass() {
        this.dialogFormVisible = true
        this.dialogTitle = '新建'
        this.imageUrl = ''
        this.form = {
          devclassname: '',
          headimg: ''
        }
      },
      handleAddSave(o) {
        console.log(o)
        device.addDevClass(o).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '新建成功!'
            })
            this.dialogFormVisible = false
            this._getLists(this.offset, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: '新建失败!'
            })
          }
        })
      },
      handleEditDeviceClass(o) {
        this.dialogFormVisible = true
        this.imageUrl = o.headimg
        this.form.id = o.id
        this.form.headimg = o.headimg
        this.dialogTitle = '编辑'
        this.form.devclassname = o.devclassname
      },
      handleEditSave(o) {
        console.log(o)
        device.updateDevClass(o).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.dialogFormVisible = false
            this._getLists(this.offset, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: '修改失败!'
            })
          }
        })
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          device.deleteDevClass(id).then(res => {
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._getLists(this.offset, this.pagesize)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.headimg = res.url
        console.log(res)
      },
      beforeAvatarUpload(file) {
        console.log(file)
        // const isJPG = file.type === 'image/jpeg'
        const isJPG = !/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .device-class {
    .img {
      height: 50px;
      width: 50px;
      display: block;
      margin: 10px auto;
    }
    .avatar-uploader div.el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #20a0ff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      margin: 1px;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
