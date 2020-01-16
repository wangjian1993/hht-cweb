<template>
  <div class="device-class app-container calendar-list-container">
    <div class="filter-container" style="min-width: 1081px; position: relative;">
      <el-select clearable style="width:120px;" class="filter-item" v-model="listQuery" placeholder="设备厂商"
                 @change="_selectChange">
        <el-option v-for="(clas,index) in devtypes" :key="index" :label="clas"
                   :value="clas">
        </el-option>
      </el-select>
      <el-input style="vertical-align:top; width:160px;" placeholder="请输入起始值" v-model="exportDevStart" clearable></el-input>
      <el-input style="vertical-align:top; width:160px;" placeholder="请输入导入的数量" v-model="exportDevMax" clearable></el-input>
      <el-button class="filter-item" type="primary" icon="document" @click="_exportDev(listQuery)">导出二维码</el-button>
      <el-button class="filter-item" type="primary" icon="upload2" @click="showApplyDev">申请设备二维码</el-button>
      <el-switch
        class="switch"
        v-model="avaliable"
        height="40"
        active-text="显示绑定"
        inactive-text="显示全部"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="_checkUnbind"
      >
      </el-switch>
      <div class="filter-item" style="position: absolute; right:20px;">
        <el-input style="width:200px" placeholder="请输入要搜索的MAC或者设备号" v-model="searchQ" clearable></el-input>
        <!-- <el-select style="width:120px;" v-model="searchType" placeholder="搜索的东西">
          <el-option v-for="type in searchTypeList" :key="type.type" :label="type.name"
                     :value="type.type">
          </el-option>
        </el-select> -->
        <el-button type="primary" icon="search" @click="_searchOne">搜索</el-button>  
      </div>
    </div>
    <el-dialog
      class="showQRcode"
      :title="deviceId"
      :visible.sync="showQRcode"
      :before-close="handleClose">
      <qriously style="width:200px;margin:0 auto !important;" :value="qrcode" :size="200"/>
    </el-dialog>
    <el-table
      :data="lists"
      height="690"
      border
      v-loading.body="listLoading"
      style="width: 100%">
      <el-table-column
        label="编号"
        width="90"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备号"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="MAC"
        width="140"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mac}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备型号"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生产ID"
        width="140"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.productId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="二维码地址"
        min-width="300"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.qRcode}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="200px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="_showQrcode(scope.row)" icon="picture">二维码</el-button>
          <!--<el-button type="success" size="mini" icon="check">完成</el-button>-->
          <el-button type="warning" size="mini" v-if="scope.row.mac === undefined" icon="plus"
                     @click="showBindMac(scope.row.deviceId)">绑定
          </el-button>
          <el-button type="danger" size="mini" v-if="scope.row.mac!==undefined" icon="minus"
                     @click="cleanBindMac(scope.row.deviceId)">清除绑定
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="申请二维码" :visible.sync="sapply" :before-close="handleClose">
      <el-form :model="form" :label-position="'right'">
        <el-form-item
          prop="type"
          :rules="{required:true,message:'厂商类型不能为空'}"
          label="厂商类型：" :label-width="formLabelWidth">
          <el-select clearable v-model="form.type" placeholder="选择型号">
            <el-option v-for="clas in devtypes" :key="clas" :label="clas"
                       :value="clas">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="productId"
          :rules="{required:true,message:'生产ID不能为空', trigger:'blur'}"
          label="生产ID：" :label-width="formLabelWidth">
          <el-input style="width:60%" v-model="form.productId"></el-input>
        </el-form-item>
        <el-form-item
          prop="num"
          :rules="{required:true,message:'申请数量不能为空且为数字', trigger:'blur'}"
          label="申请数量：" :label-width="formLabelWidth">
          <el-input style="width:80%" v-model="form.num"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sapply = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSave(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更新设备mac地址" :visible.sync="bindMac">
      <el-form :label-position="'right'">
        <el-form-item
          :rules="{required:true,message:'MAC不能为空', trigger:'blur'}"
          label="MAC：" :label-width="formLabelWidth">
          <el-input v-model="mac"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindMac = false">取 消</el-button>
        <el-button type="primary" @click="handleBindMac">确 定</el-button>
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
  import * as service from 'api/service'
  const exportApi = `${service.api}/manager/device/exportQRcode`
  export default {
    data() {
      return {
        qrcode: null,
        showQRcode: false,
        searchTypeList: [{type: 'mac', name: 'mac'}, {type: 'deviceId', name: 'deviceId'}],
        searchType: 'mac',
        searchQ: '',
        bindMac: false,
        deviceId: '',
        mac: '',
        sapply: false,
        lists: [],
        listLoading: true,
        page: 0,
        currentPage: 1,
        total: 1,
        pagesize: 15,
        listQuery: '',
        avaliable: false,
        formLabelWidth: '130px',
        devtypes: [],
        form: {
          productId: '',
          num: null,
          type: null
        },
        exportDevStart: null,
        exportDevMax: null
      }
    },
    created() {
      this._getWxDevtypes()
      this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery)
    },
    methods: {
      handleClose(done) {
        this.deviceId = ''
        done()
        //  window.location.reload()
      },
      _showQrcode(item) {
        this.showQRcode = true
        this.deviceId = item.deviceId
        this.qrcode = item.qRcode
      },
      _searchOne() {
        console.log(this.searchQ)
        if (this.searchQ === '') {
          this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery)
          return
        }
        if (this.searchQ.length === 12 || this.searchQ.length === 17) {
          this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery, '', this.searchQ.trim())
        }
        var reg = /^\[\d]{7}$/
        if (!reg.test(this.searchQ)) {
          this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery, this.searchQ.trim(), '')
        }
      },
      showBindMac(deviceId) {
        console.log(deviceId)
        this.bindMac = true
        this.mac = ''
        this.deviceId = deviceId
      },
      cleanBindMac(deviceId) {
        this.$confirm('此操作将永久清除 ' + deviceId + ' 绑定不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          service.clearMac(deviceId).then(res => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'success',
                message: '清除成功!'
              })
              this._getLists(this.page, this.pagesize, this.listQuery)
            } else {
              this.$message({
                type: 'error',
                message: res.data.errms
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
      },
      handleBindMac() {
        if (this.mac === '') {
          this.$message({
            showClose: true,
            message: 'mac 为空！',
            type: 'error'
          })
          return
        }
        service.updateDevInfo(this.mac, this.deviceId).then(res => {
          console.log(res)
          if (res.data.errcode === 0) {
            this.$message({
              showClose: true,
              message: 'mac更新成功！',
              type: 'success'
            })
            this.bindMac = false
          } else {
            this.$message({
              showClose: true,
              message: 'mac更新失败！',
              type: 'error'
            })
          }
        })
      },
      showApplyDev() {
        this.sapply = true
        this.form = {
          productId: '',
          num: null,
          type: null
        }
      },
      handleAddSave(form) {
        console.log(form)
        service.applyWxDev(form.type, Number(form.num), form.productId).then(res => {
          if (res.data.errcode === 0 && res.data.list !== undefined) {
            this.$message({
              showClose: true,
              message: '申请设备二维码成功！',
              type: 'success'
            })
            this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery)
            this.sapply = false
          } else {
            if (res.data.errcode === -2) {
              this.$message({
                showClose: true,
                message: '设备类型不存在！',
                type: 'error'
              })
            }
            if (res.data.errcode === 0 && res.data.list === undefined) {
              this.$message({
                showClose: true,
                message: '设备数量已达上限！',
                type: 'error'
              })
            }
          }
        })
      },
      _checkUnbind() {
        this.page = 0
        this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery)
      },
      _exportDev(devTypeId) {
        console.log(devTypeId)
        if (devTypeId === '') {
          this.$message({
            type: 'error',
            message: '请选择设备型号!'
          })
          return
        }
        if (this.exportDevStart === null) {
          this.$message({
            type: 'error',
            message: '起始值不能为空!'
          })
          return
        }
        if (this.exportDevMax === null) {
          this.$message({
            type: 'error',
            message: '结束值不能为空!'
          })
          return
        }
        // console.log(devTypeId, this.exportDevStart, this.exportDevMax)
        window.location.href = `${exportApi}?type=${devTypeId}&start=${this.exportDevStart}&max=${this.exportDevMax}`
      },
      _selectChange(o) {
        this._getLists(this.page, this.pagesize, this.avaliable, o)
      },
      _getWxDevtypes() {
        service.getAllWXType().then(res => {
          console.log(res.data)
          let data = res.data.list
          let oSet = new Set()
          let oAry = []
          data.forEach((item) => {
            oSet.add(item.type)
          })
          oSet.forEach(item => oAry.push(item))
          this.devtypes = oAry
        })
      },
      _getLists(page, pageSize, avaliable, devtypeId, deviceId, mac) {
        this.listLoading = true
        service.getWXDeviceList(page, pageSize, avaliable, devtypeId, deviceId, mac).then(res => {
          console.log(res.data)
          this.listLoading = false
          this.total = res.data.total
          this.lists = res.data.list
        })
      },
      handleCurrentChange(o) {
        this.page = o - 1
        this._getLists(this.page, this.pagesize, this.avaliable, this.listQuery)
      },
      handleSizeChange() {}
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .showQRcode /deep/ .el-dialog--small {
    width: 300px !important;
  }

  .switch {
    margin: 0 10px 10px;
  }

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
