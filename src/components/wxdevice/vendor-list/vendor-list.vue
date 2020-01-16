<template>
  <div class="device-class app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="_showAddVendor">新建厂商</el-button>
    </div>
    <el-table
      :data="lists"
      height="690"
      border
      v-loading.body="listLoading"
      style="width: 100%">
      <el-table-column
        label="编号"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="厂商"
        width="200"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="型号"
        align="left">
        <template slot-scope="scope">
          <span>{{scope.row.mqtopic}}</span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="edit" @click="_showEditVendor(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="delete" @click="_deleteManagerType(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="showAddVendorTitle" :visible.sync="showAddVendor">
      <el-form :label-position="'right'">
        <el-form-item
          :rules="{required:true,message:'厂商类型不能为空'}"
          label="厂商类型：" :label-width="formLabelWidth">
          <el-input v-model="vendorType"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddVendor = false">取 消</el-button>
        <el-button type="primary" v-if="showAddVendorTitle==='新建厂商'"  @click="_saveAddVendor">确 定</el-button>
        <el-button type="primary" v-if="showAddVendorTitle==='编辑厂商'" @click="_saveEditVendor">确 定</el-button>
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
  export default {
    data() {
      return {
        showAddVendor: false,
        sapply: false,
        lists: [],
        listLoading: true,
        page: 0,
        currentPage: 1,
        total: 1,
        pagesize: 15,
        listQuery: '',
        formLabelWidth: '130px',
        showAddVendorTitle: '新建厂商',
        vendorType: '',
        vendorId: null
      }
    },
    created() {
      this._getLists(this.page, this.pagesize)
    },
    methods: {
      _saveAddVendor() {
        service.addManagerType(this.vendorType).then(res => {
          console.log(res)
          if (res.data.errcode === 0) {
            this.$message({
              type: 'success',
              message: '增加成功!'
            })
            this.showAddVendor = false
            this._getLists(this.page, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: res.data.errms
            })
          }
        })
      },
      _showAddVendor() {
        this.showAddVendor = true
        this.showAddVendorTitle = '新建厂商'
        this.vendorType = ''
      },
      _showEditVendor(item) {
        this.showAddVendor = true
        this.vendorId = item.id
        this.showAddVendorTitle = '编辑厂商'
        this.vendorType = item.type
      },
      _saveEditVendor() {
        service.updateManagerType(this.vendorId, this.vendorType).then(res => {
          if (res.data.errcode === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this._getLists(this.page, this.pagesize)
          } else {
            this.$message({
              type: 'error',
              message: res.data.errms
            })
          }
        })
      },

      _deleteManagerType(id) {
        this.$confirm('此操作将永久改厂商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          service.deleteManagerType(id).then(res => {
            if (res.data.errcode === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._getLists(this.page, this.pagesize)
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
      _getLists(page, pageSize) {
        service.getManagerList(page, pageSize).then(res => {
          this.listLoading = true
          console.log(res.data)
          this.listLoading = false
          this.total = res.data.total
          this.lists = res.data.list
        })
      },
      handleCurrentChange(o) {
        this.page = o - 1
        this._getLists(this.page, this.pagesize)
      },
      handleSizeChange() {}
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .switch {
    margin: 0 10px 10px;
  }
</style>
