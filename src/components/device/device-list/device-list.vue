<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="position: relative; min-width: 1080px">
      <!--  <el-input @keyup.enter.native="handleFilter" style="width:90px;" class="filter-item" placeholder="设备类型"
                  v-model="listQuery.title">
        </el-input>-->
      <el-select clearable style="width:200px;" class="filter-item" v-model="listQuery" placeholder="设备型号"
                 @change="_selectChange">
        <el-option v-for="clas in devTypes" :key="clas.id" :label="clas.name"
                   :value="clas.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="document" @click="_exportDev(listQuery)">导出</el-button>
      <el-button class="filter-item" type="primary" icon="upload2" @click="handleImport">导入设备</el-button>
      <el-button class="filter-item" type="primary" icon="plus" @click="handleAddDevice">新建设备</el-button>
      <div class="filter-item" style="position: absolute; right:20px;">
        <el-input style="width:250px" placeholder="请输入要搜索的MAC或者DID" v-model="searchQ" clearable></el-input>
        <el-select style="width:120px;" v-model="searchType" placeholder="搜索的东西">
          <el-option v-for="type in searchTypeList" :key="type.type" :label="type.name"
                     :value="type.type">
          </el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="_searchOne">搜索</el-button>
      </div>
    </div>
    <el-table :data="list" max-height="690" v-loading.body="listLoading" border fit heighlight-current-row
              style="width: 100%">
      <el-table-column width="80px" fixed="left" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="设备号（MAC）">
        <template slot-scope="scope">
          <span>{{scope.row.devid}}</span>
        </template>
      </el-table-column>
      <el-table-column width="170px" align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{scope.row.devType.devClass.devclassname}}</span>
        </template>
      </el-table-column>
      <el-table-column max-width="150px" align="center" label="型号">
        <template slot-scope="scope">
          <span>{{scope.row.devType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="设备所属用户">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="绑定用户ID">
        <template slot-scope="scope" v-if="scope.row.user">
          <span v-if="scope.row.user">{{scope.row.user.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="scope">
          <span style="color:red;">{{statuses[scope.row.status].status}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="绑定时间">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.bandingeventtime)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="激活时间">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.fristonlinetime)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="最近上线时间">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.lastonlinetime)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="240px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditDevice(scope.row)" icon="edit">编辑</el-button>
          <el-button type="warning" size="mini" icon="minus" :disabled="!scope.row.user">解绑</el-button>
          <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          prop="devid"
          :rules="{required:true,message:'设备号不能为空', trigger:'blur'}"
          label="设备号（MAC）：" :label-width="formLabelWidth">
          <el-input v-model="form.devid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型：" :label-width="formLabelWidth">
          <el-select v-model="form.devtypeId" placeholder="请选择设备型号">
            <el-option v-for="clas in devTypes" :key="clas.id" :label="clas.name"
                       :value="clas.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="status in statuses" :key="status.id" :label="status.status"
                       :value="status.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-show="dialogTitle==='编辑'" @click="handleEditSave(form)">确 定</el-button>
        <el-button type="primary" v-show="dialogTitle!=='编辑'" @click="handleAddSave(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入设备" :visible.sync="impo">
      <el-upload
        class="upload-demo"
        drag
        :action="uploadApi"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel"
        :auto-upload="true"
        :on-success="_impoSuccess"
        :on-error="_impoError"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em> 自动上传</div>
        <div class="el-upload__tip" slot="tip">只能上传.xls或.xlsx文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="impo = false">取 消</el-button>
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
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
  import * as device from 'api/device'
  import { formatDate } from 'utils/index'
  import { mapGetters, mapMutations } from 'vuex'
  const uploadApi = process.env.BASE_API + '/device/importDevice'
  // const uploadApi = 'http://192.168.0.106:8080/hiyun/device/importDevice'
  const exportApi = process.env.BASE_API + '/device/exportWeChatDevice'
  export default {
    components: {
      ElButton,
      ElInput
    },
    computed: {
      ...mapGetters([
        'devTypes',
        'devClasses',
        'statuses'
      ])
    },
    data() {
      return {
        uploadApi,
        searchQ: '',
        searchTypeList: [{type: 'mac', name: 'mac'}, {type: 'DID', name: 'DID'}],
        searchType: 'mac',
        list: [],
        listLoading: true,
        offset: 0,
        total: 0,
        currentPage: 1,
        pagesize: 15,
        deviceClass: [],
        impo: false,
        listQuery: null,
        dialogFormVisible: false,
        dialogTitle: '编辑',
        form: {
          devid: '',
          devtypeId: '',
          status: ''
        },
        formLabelWidth: '140px'
      }
    },
    created() {
      this._getLists(this.offset, this.pagesize, this.listQuery)
    },
    filter: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    methods: {
      ...mapMutations({
        setDevtypeList: 'SET_DEVTYPELIST',
        setDevclassList: 'SET_DEVCLASSLIST'
      }),
      _searchOne() {
        // console.log(this.searchQ)
        if (this.searchQ === '') {
          this._getLists(this.offset, this.pagesize, this.listQuery)
          return
        }
        // var reg = /[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}/i
        // if (!reg.test(this.searchQ)) {
        //   this.$message({
        //     type: 'error',
        //     message: 'mac地址格式不正确！mac地址格式为00:24:21:19:BD:E4'
        //   })
        // } else {
        if (this.searchType === 'mac') {
          this._getLists(this.offset, this.pagesize, this.listQuery, '', this.searchQ.trim())
        }
        if (this.searchType === 'DID') {
          this._getLists(this.offset, this.pagesize, this.listQuery, this.searchQ.trim(), '')
        }
        // }
      },
      _exportDev(devTypeId) {
        if (devTypeId === null) {
          this.$message({
            type: 'error',
            message: '设备型号为空!'
          })
          return
        }
        window.location.href = `${exportApi}?deviceTypeId=${devTypeId}`
      },
      _selectChange(o) {
        if (o === '') o = null
        if (this.listQuery === '') this.listQuery = null
        console.log(o)
        this._getLists(this.offset, this.pagesize, o)
      },
      _formatDate(time) {
        return formatDate(time, ' ', 'Y-M-d-h-m-s')
      },
      _getLists(offset, max, devtypeId, DID, MAC) {
        console.log('1111')
        this.listLoading = true
        device.getList(offset, max, devtypeId, DID, MAC).then(res => {
          console.log('1111', res)
          this.listLoading = false
          this.total = res.data.total
          this.list = res.data.lists
          this.listLoading = false
        })
      },
      handleEditDevice(d) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.form.id = d.id
        this.form.devid = d.devid
        this.form.devtypeId = d.devtypeId
        this.form.status = d.status
      },
      handleEditSave(o) {
        console.log(o)
        device.updateDev(o).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.dialogFormVisible = false
            this._getLists(this.offset, this.pagesize, this.listQuery)
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
        this.dialogFormVisible = true
        this.form = {
          devid: '',
          devtypeId: '',
          status: ''
        }
      },
      handleAddSave(o) {
        device.addDev(o).then(res => {
          if (res.data.ret === 0) {
            this.$message({
              type: 'success',
              message: '新建成功!'
            })
            this.dialogFormVisible = false
            this._getLists(this.offset, this.pagesize, this.listQuery)
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
          device.deleteDev(id).then(res => {
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._getLists(this.offset, this.pagesize, this.listQuery)
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
        this._getLists(this.offset, this.pagesize, this.listQuery)
      },
      handleSizeChange() {

      },
      handleDownload() {},
      handleImport() {
        this.impo = true
      },
      handleFilter() {},
      _impoSuccess() {
        this.$message({
          showClose: true,
          message: '上传成功！',
          type: 'success'
        })
      },
      _impoError() {
        this.$message({
          showClose: true,
          message: '上传失败！',
          type: 'error'
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
</style>
