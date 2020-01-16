<template>
  <div class="types app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="handleAddDevice">新建设备型号</el-button>
    </div>
    <sheet :data="list"
           @deleteDevType="handleDelete"
           @editDevType="handleEditDevice"
           @editChannel="handleEditChannel"
    ></sheet>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" top="10%">
      <el-form :model="form">
        <el-form-item label="设备图片：" required :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              :action="uploadApi"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item
          prop="name"
          :rules="{required:true,message:'设备型号不能为空', trigger:'blur'}"
          label="设备型号：" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置项：" required :label-width="formLabelWidth">
          <multiselect
            v-model="form.items"
            :options="configs"
            :multiple="true"
            :placeholder="'选择配置项'"
            :label="'cfgItem'"
            :close-on-select="false"
            :track-by="'id'"
          >
          </multiselect>
        </el-form-item>
        <el-form-item label="设备类型：" required :label-width="formLabelWidth">
          <el-select v-model="form.devclassId" placeholder="请选择设备类型">
            <el-option v-for="devClass in devClasses" :key="devClass.id" :label="devClass.devclassname"
                       :value="devClass.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户：" required :label-width="formLabelWidth">
          <el-select v-model="form.customerId" placeholder="请选择客户">
            <el-option v-for="custo in customers" :key="custo.id" :label="custo.full_name"
                       :value="custo.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="自动创建：" required :label-width="formLabelWidth">
          <el-switch
            v-model="form.bootstrap"
            on-text="是"
            off-text="否">
          </el-switch>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-show="dialogTitle==='编辑'" @click="handleEditSave(form)">确 定</el-button>
        <el-button type="primary" v-show="dialogTitle!=='编辑'" @click="handleAddSave(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="channelTitle" :visible.sync="channelVisible" top="20%">
      <el-form :model="channelList">
        <el-form-item>
          <el-button type="primary" icon="plus" @click="handleAddChannel">新建频道</el-button>
          <el-button type="danger" v-show="!isDelete && channelList.length" @click="isDelete = true" icon="delete">
            删除频道
          </el-button>
          <el-button type="danger" v-show="isDelete && channelList.length" @click="isDelete = false" icon="delete">
            取消删除
          </el-button>
        </el-form-item>
        <el-form-item class="">
          <div class="channel-list">
            <div class="item" v-for="channel in channelList">
              <span>位置：{{channel.orderId}}</span>
              <div class="channelImg">
                <img :src="channel.image" alt="">
              </div>
              <span>{{channel.name}}</span>
              <el-button class="channel-edit" type="primary" size="small" icon="edit"
                         @click="updateChannelItem(channel)">编辑频道
              </el-button>
              <div class="icon" v-show="isDelete" @click="channelDelete(channel.id)"><span
                class="el-icon-delete2"></span></div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="channelVisible = false">取 消</el-button>
        <el-button type="primary" @click="channelVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="addChannelTitle" :visible.sync="addChannelVisible" top="25%" size="small">
      <el-form :model="addChannel">
        <el-form-item label="位置："
                      prop="orderId"
                      :rules="{required:true,message:'频道位置不能为空', trigger:'blur'}"
                      required :label-width="'80px'">
          <el-input class="channel-name" v-model="addChannel.orderId" type="text"></el-input>
        </el-form-item>
        <el-form-item label="图片：" required :label-width="'80px'" class="">
          <div class="channel-list">
            <div class="item">
              <el-upload
                class="channel"
                :action="uploadApi"
                :show-file-list="false"
                :auto-upload="true"
                :on-success="channelImgSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="addChannel.image" :src="channelImg" class="channel">
                <i v-else class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="名称："
                      prop="name"
                      :rules="{required:true,message:'频道名不能为空', trigger:'blur'}"
                      required :label-width="'80px'">
          <el-input class="channel-name" v-model="addChannel.name" type="text"></el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addChannelVisible = false">取 消</el-button>
        <el-button type="primary" v-show="addChannelTitle==='编辑频道'" @click="channelEditSave(addChannel)">确 定</el-button>
        <el-button type="primary" v-show="addChannelTitle!=='编辑频道'" @click="channelAddSave(addChannel)">确 定</el-button>
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
  import Sheet from './sheet.vue'
  import * as device from 'api/device'
  import { mapGetters } from 'vuex'
  const uploadApi = process.env.BASE_API + '/uploadFile'
  export default {
    components: {
      Sheet
    },
    data() {
      return {
        uploadApi,
        list: [],
        configs: [],
        offset: 0,
        currentPage: 1,
        total: 1,
        pagesize: 12,
        isDelete: false,
        dialogTitle: '',
        channelTitle: '',
        addChannelTitle: '',
        addChannelVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          devclassId: '',
          customerId: '',
          items: [],
          headimg: ''
         // bootstrap: false
        },
        channelList: [],
        addChannel: {
          orderId: '',
          name: '',
          image: '',
          devtypeId: ''
        },
        imageUrl: '',
        channelImg: '',
        formLabelWidth: '140px',
        channelVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'devClasses',
        'customers'
      ])
    },
    created() {
      this._getLists(this.offset, this.pagesize)
      console.log(this.customers)
    },
    methods: {
      _getLists(offset, max) {
        device.getTypeList(offset, max).then(res => {
          console.log(res)
          this.total = res.data.total
          this.list = res.data.lists
        })
        device.getConfigAll().then(res => {
          this.configs = res.data.lists
        })
      },
      handleEditDevice(d) {
        console.log(d)
        device.getOneConfig(d.id).then(res => {
          this.form.items = res.data.lists
        })
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.imageUrl = d.headimg
        this.form.id = d.id
        this.form.name = d.name
        this.form.devclassId = d.devclassId
        this.form.customerId = d.customerId
        this.form.headimg = d.headimg
       // this.form.bootstrap = !!d.bootstrap
      },
      handleEditSave(o) {
        console.log(o)
        device.updateDevType(o).then(res => {
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
      handleAddDevice() {
        this.dialogTitle = '新建'
        this.imageUrl = ''
        this.dialogFormVisible = true
        this.form = {
          name: '',
          devclassId: '',
          customerId: '',
          items: null,
          headimg: ''
        }
      },
      handleAddSave(o) {
      //  o.bootstrap = Number(o.bootstrap)

        console.log(o)
        device.addDevType(o).then(res => {
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
      handleDelete(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          device.deleteDevType(id).then(res => {
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
      handleCurrentChange(o) {
        console.log((o - 1) * this.pagesize)
        this.offset = (o - 1) * this.pagesize
        this._getLists(this.offset, this.pagesize)
      },
      handleSizeChange() {
        console.log('333')
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
      },
      handleEditChannel(item) {
        this.channelTitle = '编辑频道'
        this.channelVisible = true
        this.isDelete = false
        this.addChannel.devtypeId = item.id
        this.channelList = item.channels
      },
      updateChannelItem(channel) {
        this.addChannelTitle = '编辑频道'
        this.addChannelVisible = true
        this.addChannel.orderId = channel.orderId
        this.addChannel.name = channel.name
        this.channelImg = channel.image
        this.addChannel.image = channel.image
        this.addChannel.id = channel.id
      },
      handleAddChannel() {
        this.addChannelTitle = '新建频道'
        this.addChannelVisible = true
        this.addChannel.orderId = ''
        this.addChannel.name = ''
        this.addChannel.image = ''
      },
      channelEditSave(o) {
        let channelItem = {
          orderId: Number(o.orderId),
          name: o.name,
          image: o.image,
          id: o.id
        }
        device.updateDevTypeChannel(channelItem).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.channelVisible = false
            this.addChannelVisible = false
            this._getLists(this.offset, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: '修改失败!'
            })
          }
        })
      },
      channelAddSave(o) {
        let channelItem = {
          orderId: Number(o.orderId),
          name: o.name,
          image: o.image,
          devtypeId: o.devtypeId
        }
        device.addDevTypeChannel(channelItem).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '新建成功!'
            })
            this.channelVisible = false
            this.addChannelVisible = false
            this._getLists(this.offset, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: '新建失败!'
            })
          }
        })
      },
      channelDelete(id) {
        this.$confirm('此操作将永久删除该频道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          device.deleteDevTypeChannel(id).then(res => {
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.channelVisible = false
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
      channelImgSuccess(res, file) {
        this.channelImg = URL.createObjectURL(file.raw)
        this.addChannel.image = res.url
        console.log(res)
        console.log(this.uploadApi)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
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
    font-size: 15px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 1px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }

  .channel {
    height: 82px;
    width: 82px;
    display: block;
    border-radius: 50% !important;
    overflow: hidden;
    margin-bottom: 10px;
    .el-upload {
    }
    .el-icon-plus {
      font-size: 15px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
  }

  .channel-list {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    .item {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin: 0 20px;
      .icon {
        position: absolute;
        top: -20px;
        right: -20px;
        height: 20px;
        width: 20px;
        cursor: pointer;
        font-size: 20px;
        .el-icon-delete2 {
          color: #ff4949;
        }
      }
    }
    .channelImg {
      height: 80px;
      width: 80px;
      border-radius: 50%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .channel-name {
      text-align: center;
    }
    .channel-edit {
      margin-top: 10px;
    }
  }
</style>
