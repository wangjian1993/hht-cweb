<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="handleAddDevice">新建配置</el-button>
    </div>
    <el-table :data="list" max-height="690" v-loading.body="listLoading" border fit heighlight-current-row
              style="width: 100%">
      <el-table-column width="80px" fixed="left" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="配置项">
        <template slot-scope="scope">
          <span>{{scope.row.cfgItem}}</span>
        </template>
      </el-table-column>
      <el-table-column width="310px" align="center" label="默认值">
        <template slot-scope="scope">
          <span>{{scope.row.defaultVaule}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="400px" align="center" label="配置描述">
        <template slot-scope="scope">
          <span>{{scope.row.valueRange}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditDevice(scope.row)" icon="edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :label-position="'right'">
        <el-form-item
          prop="cfgItem"
          :rules="{required:true,message:'配置项不能为空', trigger:'blur'}"
          label="配置项：" :label-width="formLabelWidth">
          <el-input v-model="form.cfgItem" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认值：" :rules="{required:true,message:'默认值不能为空', trigger:'blur'}"
                      :label-width="formLabelWidth" prop="defaultVaule">
          <el-input type="textarea" v-model="form.defaultVaule"></el-input>
        </el-form-item>
        <el-form-item label="配置范围：" :rules="{required:true,message:'配置范围不能为空', trigger:'blur'}"
                      :label-width="formLabelWidth" prop="valueRange">
          <el-input type="textarea" v-model="form.valueRange"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-show="dialogTitle==='编辑'" @click="handleEditSave(form)">确 定</el-button>
        <el-button type="primary" v-show="dialogTitle!=='编辑'" @click="handleAddSave(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
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
  export default {
    components: {
      ElButton,
      ElInput
    },
    data() {
      return {
        list: [],
        listLoading: true,
        offset: 0,
        currentPage: 1,
        total: 1,
        pagesize: 15,
        dialogFormVisible: false,
        dialogTitle: '编辑',
        form: {
          cfgItem: '',
          defaultVaule: '',
          valueRange: ''
        },
        formLabelWidth: '140px'
      }
    },
    created() {
      this._getLists(this.offset, this.pagesize)
    },
    methods: {
      _getLists(offset, max) {
        this.listLoading = true
        device.getConfigList(offset, max).then(res => {
          console.log(res)
          this.total = res.data.total
          this.list = res.data.lists
          this.listLoading = false
        })
      },
      handleCurrentChange(o) {
        console.log((o - 1) * this.pagesize)
        this.offset = (o - 1) * this.pagesize
        this._getLists(this.offset, this.pagesize)
      },
      handleEditDevice(d) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.form = {
          id: d.id,
          cfgItem: d.cfgItem,
          defaultVaule: d.defaultVaule,
          valueRange: d.valueRange
        }
      },
      handleEditSave(o) {
        console.log(o)
        device.updateDevConfig(o).then(res => {
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
        this.dialogFormVisible = true
        this.form = {
          cfgItem: '',
          defaultVaule: '',
          valueRange: ''
        }
      },
      handleAddSave(o) {
        device.addDevConfig(o).then(res => {
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
          device.deleteDevConfig(id).then(res => {
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._getLists()
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
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
</style>
