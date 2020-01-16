<template>
  <div class="device-class app-container calendar-list-container">
    <div class="filter-container" style="min-width: 1081px; position: relative;">
      <div class="filter-item">
        <el-input style="width:250px" placeholder="请输入要搜索的uid" v-model="searchQ"></el-input>
        <!--<el-select style="width:120px;" v-model="searchType" placeholder="搜索的东西">-->
        <!--<el-option v-for="type in searchTypeList" :key="type.type" :label="type.name"-->
        <!--:value="type.type">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <el-button type="primary" icon="search" @click="_searchOne">搜索</el-button>
      </div>
    </div>
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
        label="UID"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.uid}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="OPENID"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.openid}}</span>
        </template>
      </el-table-column>
    </el-table>
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
  export default {
    data() {
      return {
        lists: [],
        listLoading: true,
        page: 1,
        currentPage: 1,
        total: 1,
        pagesize: 15,
        searchQ: '',
        formLabelWidth: '130px'
      }
    },
    created() {
      this._getLists(this.page, this.pagesize, this.searchQ)
    },
    methods: {
      handleClose(done) {
        this.uid = ''
        done()
        //  window.location.reload()
      },
      _searchOne() {
        console.log(this.searchQ)
//        if (this.searchQ === '') {
//          this._getLists(this.page, this.pagesize, this.searchQ.trim())
//          return
//        }
        this._getLists(this.page, this.pagesize, this.searchQ.trim())
      },
      _getLists(page, pageSize, uid) {
        this.listLoading = true
        device.getWxUserList(page, pageSize, uid).then(res => {
          console.log(res.data)
          this.listLoading = false
          this.total = res.data.total
          this.lists = res.data.lists
        })
      },
      handleCurrentChange(o) {
        this.page = o
        this._getLists(this.page, this.pagesize, this.searchQ)
      },
      handleSizeChange() {}
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
  }
</style>
