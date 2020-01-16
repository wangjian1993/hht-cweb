<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="handleAddCustomer">新建用户</el-button>
    </div>
    <el-table :data="list" max-height="690" v-loading.body="listLoading" border fit heighlight-current-row
              style="width: 100%">
      <el-table-column width="80px" fixed="left" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="客户名称">
        <template slot-scope="scope">
          <span>{{scope.row.full_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.sdesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.addrs}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.mail}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="密码">
        <template slot-scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="手机">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.createdate)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="200px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditCustomer(scope.row)" icon="edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" top="10%">
      <el-form :model="form">
        <el-form-item
          prop="full_name"
          :rules="{required:true,message:'客户名称不能为空', trigger:'blur'}"
          label="客户名称：" :label-width="formLabelWidth">
          <el-input v-model="form.full_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="mail"
          :rules="{required:true,message:'邮箱不能为空', trigger:'blur'}"
          label="邮箱：" :label-width="formLabelWidth">
          <el-input v-model="form.mail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="{required:true,message:'密码不能为空', trigger:'blur'}"
          label="密码：" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="{required:true,message:'手机不能为空', trigger:'blur'}"
          label="手机：" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="sdesc"
          :rules="{required:true,message:'描述不能为空', trigger:'blur'}"
          label="描述：" :label-width="formLabelWidth">
          <el-input v-model="form.sdesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="sitedomain"
          :rules="{required:true,message:'二级域名不能为空', trigger:'blur'}"
          label="二级域名：" :label-width="formLabelWidth">
          <el-input v-model="form.sitedomain" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="addrs"
          :rules="{required:true,message:'地址不能为空', trigger:'blur'}"
          label="地址：" :label-width="formLabelWidth">
          <v-distpicker @province="_province" @city="_city" @area="_area" :placeholders="placeholders"></v-distpicker>
          <el-input style="margin-top: 15px;" v-model="form.addrs" auto-complete="off"></el-input>
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
      :page-size="15"
      layout="prev, pager, next, jumper"
      :total="total"
      style="">
    </el-pagination>
  </div>
</template>

<script>
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
  import * as customer from 'api/customer'
  import { formatDate } from 'utils/index'
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
        total: 0,
        currentPage: 1,
        pagesize: 15,
        dialogFormVisible: false,
        dialogTitle: '编辑',
        province: '',
        city: '',
        area: '',
        placeholders: {
          province: '------- 省 --------',
          city: '--- 市 ---',
          area: '--- 区 ---'
        },
        form: {
          full_name: '',
          mail: '',
          password: '',
          sdesc: '',
          phone: '',
          sitedomain: '',
          addrs: ''
        },
        formLabelWidth: '140px'
      }
    },
    created() {
      this._getLists(this.offset, this.pagesize)
    },
    methods: {
      _formatDate(time) {
        return formatDate(time, ' ', 'Y-M-d-h-m-s')
      },
      _province(o) {
        this.province = o.value
        console.log(o)
      },
      _city(o) {
        this.city = o.value
      },
      _area(o) {
        this.area = o.value
      },
      _getLists(offset, max) {
        this.listLoading = true
        customer.getCustomerList(offset, max).then(res => {
          console.log(res)
          this.total = res.data.total
          this.list = res.data.lists
          this.listLoading = false
        })
      },
      handleEditCustomer(d) {
        console.log(d)
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        let addr = d.addrs.split(',').reverse()[0]
        this.form = {
          id: d.id,
          full_name: d.full_name,
          mail: d.mail,
          password: d.password,
          phone: d.phone,
          sdesc: d.sdesc,
          sitedomain: d.sitedomain,
          addrs: addr
        }
      },
      handleEditSave(o) {
        console.log(o)
        customer.updateCustomer(o).then(res => {
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
      handleAddCustomer() {
        this.dialogTitle = '新建'
        this.dialogFormVisible = true
        this.form = {
          full_name: '',
          mail: '',
          password: '',
          sdesc: '',
          phone: '',
          sitedomain: '',
          addrs: ''
        }
        this.placeholders = {
          province: '------- 省 --------',
          city: '--- 市 ---',
          area: '--- 区 ---'
        }
      },
      handleAddSave(o) {
        let result = {
          full_name: o.full_name,
          mail: o.mail,
          password: o.password,
          sdesc: o.sdesc,
          phone: o.phone,
          sitedomain: o.sitedomain,
          addrs: this.province + ',' + this.city + ',' + this.area + ',' + o.addrs
        }
        console.log(result)
        customer.addCustomer(result).then(res => {
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
          customer.deleteCustomer(id).then(res => {
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
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
</style>
