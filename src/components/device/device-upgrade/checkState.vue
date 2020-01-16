<template>
    <div>
         <el-table
          :data="upgradeInfoList"
          border
          v-if="upgradeInfoList"
          style="width: 60%">
          <el-table-column
            label="mac"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.mac}}</span>
            </template>
          </el-table-column>
            <el-table-column
            label="升级次数"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.count+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isSuccess}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
          label="操作"
          align="center">
            <template slot-scope="scope">
              <el-button @click="showUpgradedMac(scope)" size="mini">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="block">
          <el-pagination
            layout="total, prev, pager, next"
            :total='checkMacStateTotal'
            :current-page.sync="macStateCurrentPage"
            :page-size="MacStatepageSize"
            @current-change="changePage">
          </el-pagination>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
