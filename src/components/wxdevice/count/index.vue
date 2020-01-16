<template>
  <div class="device-class app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" :class="flag === 'user'?'active1':'none'" type="primary" @click="chooseUser" plain>
        用户在线总数（{{userOnlineCount}}）
      </el-button>
      <el-button plain class="filter-item" type="primary" @click="chooseDev"
                 :class="flag === 'device'?'active1':'none'">设备在线总数（{{deviceOnlineCount}}）
      </el-button>
    </div>
    <el-table
      v-if="flag === 'user'"
      :data="userList"
      height="690"
      border
      style="width: 100%">
      <el-table-column
        label="编号"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="UID"
        width="200"
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
    <el-table
      v-if="flag === 'device'"
      :data="deviceList"
      height="690"
      border
      style="width: 100%">
      <el-table-column
        label="编号"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="DID"
        width="200"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.did}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="DEVICEID"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceId}}</span>
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
        flag: 'user',
        userOnlineCount: 0,
        deviceOnlineCount: 0,
        userList: [],
        deviceList: [],
        pagesize: 20,
        currentPage: 1,
        total: 0
      }
    },
    created() {
      this._getLists()
    },
    methods: {
      chooseUser() {
        this.flag = 'user'
        this.total = this.userOnlineCount
        this._getOnlineUserList(0)
      },
      chooseDev() {
        this.flag = 'device'
        this.total = this.deviceOnlineCount
        this._getOnlineDeviceList(0)
      },
      _getLists() {
        this._getCount()
        this._getOnlineUserList()
        this._getOnlineDeviceList()
      },
      _getCount() {
        device.count().then(res => {
          this.chooseUser()
          this.userOnlineCount = res.data.count[0].onlineCount
          this.deviceOnlineCount = res.data.count[1].onlineCount
        })
      },
      _getOnlineUserList(offset) {
        device.onlineUserList(offset).then(res => {
          this.userList = res.data.userlist
        })
      },
      _getOnlineDeviceList(offset) {
        device.onlineDeviceList(offset).then(res => {
          console.log('device', res.data)
          this.deviceList = res.data.devicelist
        })
      },
      handleSizeChange() {

      },
      handleCurrentChange(o) {
        if (this.flag === 'user') {
          let offset = (o - 1) * 20
          this._getOnlineUserList(offset)
        } else {
          let offset = (o - 1) * 20
          this._getOnlineDeviceList(offset)
        }
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .switch {
    margin: 0 10px 10px;
  }

  .active1 {
    background: #b3d8ff !important;
    border-color: #20a0ff !important;
    color: #20a0ff !important;
  }

  .none {
    background: #fff !important;
    border: 1px solid #bfcbd9 !important;
    color: #1f2d3d !important;
  }
</style>
