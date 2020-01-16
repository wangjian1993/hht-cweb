<template>
  <div class="device-upgrade app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="vertical-align: top;" type="primary" icon="plus" @click="handleAddDeviceClass">新建升级规则</el-button>
      <el-button type="primary" @click="importOutMac">导入outMac</el-button>
      <el-button @click="checkimportedOutMac = true" type="primary">查询outMac</el-button>
      <el-dialog
        title="OutMac"
        :visible.sync="checkimportedOutMac"
        width="50%">
        <template>
          <el-select v-model="selectedHw" placeholder="请选择Hw号">
            <el-option
              v-for="item in hwList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="checkUpgradeMac_g" style="width:200px;" placeholder="输入要查询的mac" @keyup.enter.native="checkOutMac" clearable></el-input>
          <el-button @click="checkOutMac">点击查询</el-button>
          <el-table
            v-if="!checkUpgradeMac_g"
            border
            :data="showoutmacList"
            style="width: 70%; margin-top:30px; height:300px;">
            <el-table-column
              label="mac"
              border
              align="center"
              width="220">
              <template slot-scope="scope">
                <span>{{scope.row}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              border>
              <template slot-scope="scope">
                <el-button type="danger" @click="delOutMac(scope)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p style="margin:40px" v-else>{{this.showOutMacMsg}}</p>
        </template>
      </el-dialog>
    </div>
    <el-dialog
      title="importOutMac" 
      :visible.sync="OutmacDia"
      width="30%"
      :before-close="clearOutMacFile">
      <el-upload 
        class="avatar-uploader" 
        :action="importoutmac"
        ref="upload"
        :auto-upload="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel"
        name="file"
        :clearFiles="clearOutMacFile"
        :on-preview="handlePreview"
        :data="outMacMsg"
        :on-success="upoutMacSuccess"
        style="display:inline-block;">
        <el-button size="mini">选择文件</el-button>
      </el-upload>
      <span>支持xls, xlsx文件</span>
      <template>
        <el-select v-model="selectedHw" placeholder="请选择Hw号">
          <el-option
            v-for="item in hwList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <!-- <el-input v-model="valueHw" placeholder="请输入hw"></el-input> -->
      <!-- <el-input v-model="valueSw" placeholder="请输入sw"></el-input> -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="OutmacDia = false">取 消</el-button> -->
        <el-button type="primary" @click="upOutMacList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <template>
      <el-button type="text" >点击打开外层 Dialog</el-button> -->
    <el-dialog title="已升级的mac" :visible.sync="outerVisible" width="80%" :before-close="hideMacPage">
      <!-- <div> -->
        <!-- <el-input v-model="checkUpgradeMac" style="width:200px; margin-bottom: 20px;" placeholder="请输入mac"></el-input> -->
        <!-- <el-button style="dispaly:inline-block;">点击查询</el-button> -->
      <!-- </div> -->
      <!-- <el-dialog
        width="30%"
        title="状态"
        :visible.sync="innerVisible"
        append-to-body>
        <div>
          <p>升级次数： {{upgradeCount}}</p>
          <p>状态：<span>{{macUpgradestate}}</span></p>
        </div>
      </el-dialog> -->
      <template>
        <!-- <li v-for="(macItem, index) in macList" :key="index" class="MacList" style="list-style:none;"> 
          <div>
            <span>{{macItem}}</span>
          </div>
          <el-button @click="innerVisible = true" size="small">查看</el-button>
        </li> -->
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
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCheckMacState">取 消</el-button>
        <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
      </div>
    </el-dialog>
    <!-- </template> -->
    <el-table
      :data="lists"
      maxHeight="690"
      border
      v-loading.body="listLoading"
      heighlight-current-row
      style="width: 100%">
      <el-table-column
        label="编号"
        width="80"
        fixed="left"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="起始日期"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.startdate)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束日期"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{_formatDate(scope.row.enddate)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="软件版本"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sw}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="硬件版本"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.hw}}</span>
        </template>
      </el-table-column>
           <el-table-column
        label="升级限制"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.limitnum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最小版本号"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.minsw}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="已升级数量"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>已升级</span>
          <el-button size="mini" @click="upgradeMsg(scope)">查看</el-button>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="剩余升级数量"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>剩余</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="升级镜像文件"
        align="center">
        <template slot-scope="scope">
          <p style="color:red;" v-if="scope.row.imgurl">imgurl:  {{scope.row.imgurl}}</p>
          <p style="color:red;" v-if="scope.row.imgurl2">imgurl2:  {{scope.row.imgurl2}}</p>
          <p style="color:red;" v-if="scope.row.imgurl3">imgurl3:  {{scope.row.imgurl3}}</p>
          <p v-for="(img, index) in scope.row.imgMap" :key= index><span>{{img.name}}  :  </span><span>{{img.url}}</span></p>
        </template>
      </el-table-column>
      <el-table-column
        label="强制升级"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isforce ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <!--    <el-table-column
            label=""
            width="180"
            align="center">
            <template scope="scope">
              <span>{{scope.row.eDevid}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="sDevid"
            width="180"
            align="center">
            <template scope="scope">
              <span>{{scope.row.sDevid}}</span>
            </template>
          </el-table-column>-->
      <el-table-column fixed="right" width="280px" align="center" label="操作">
        <template slot-scope="scope">
          <div style="margin-bottom:20px;">
            <el-button @click="showCheckInMac(scope)" type="primary" size="mini">查询InMac</el-button>
            <el-button size="mini" type="primary" @click="upgradeMsg(scope)">查看mac状态</el-button>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="handleEditDeviceClass(scope.row)" icon="edit">编辑</el-button>
            <!--<el-button type="success" size="mini" icon="check">完成</el-button>-->
            <el-button type="danger" size="mini" icon="delete" @click="handleDelete(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="history"
      :visible.sync="checkimportedInMac"
      width="80%">
      <el-dialog
        width="30%"
        title="状态"
        :visible.sync="showInMacStateVisible"
        append-to-body>
        <p>升级次数：{{inMacUpgradeCount}}</p>
        <p>状态： {{inMacUpgradeState}}</p>
      </el-dialog>
      <template>
        <!-- <el-input v-model="checkUpgradeInMac" style="width:200px;" placeholder="输入要查询的mac" clearable></el-input> -->
        <!-- <el-button @click="checkInMac(scope)">点击查询</el-button> -->
        <el-table
          v-if="!checkUpgradeInMac"
          border
          :data="showinmacList"
          style="width: 80%; margin-top:30px;">
          <el-table-column
            label="mac"
            border
            align="center"
            width="200">
            <template slot-scope="scope">
              <span>{{scope.row}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="hw"
            border
            align="center"
            width="120">
            <template slot-scope="scope">
              <span>{{currentHw}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="sw"
            border
            align="center"
            width="120">
            <template slot-scope="scope">
              <span>{{currentSw}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            border
            width="">
            <template slot-scope="scope">
              <el-button type="primary" @click="checkInMac(scope)" size="mini">查看状态</el-button>
              <el-button type="danger" @click="delInMac(scope)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <p style="margin:40px" v-else>{{showInMacMsg}}</p> -->
      </template>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" custom-class="dialog" top="5%">
      <el-form :model="form" :label-position="'left'" ref="form" class="demo-ruleForm">
        <el-form-item label="起始日期"
                      required
                      :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="form.startdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期"
                      required
                      :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.enddate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="硬件版本"
                      prop="hw"
                      :rules="{required:true,message:'硬件版本不能为空', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-input v-model="form.hw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="软件版本"
                      prop="sw"
                      :rules="{required:true,message:'软件版本不能为空', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-input v-model="form.sw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="minsw"
                      prop="minsw"
                      :rules="{required:true,message:'minsw不能为空', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-input v-model="form.minsw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Sdevid"
                      :label-width="formLabelWidth">
                      <el-switch
                        v-model="SdevidSel"
                        active-text='enable'
                        inactive-text=''
                        @change="selectEnableState">
                      </el-switch>
          <!-- <el-input v-model="form.sDevid" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="Edevid"
                      :label-width="formLabelWidth">
          <el-input v-model="form.eDevid" auto-complete="off"></el-input>
        </el-form-item>
          <el-form-item label="升级限制数"
                      prop="limitnum"
                      :rules="{required:true,message:'升级限制数不能为空, -1表示无限', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-input v-model="form.limitnum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="强制升级"
                      prop="isforce"
                      :rules="{required:true,message:'设备类型不能为空', trigger:'blur'}"
                      :required=true
                      :label-width="formLabelWidth">
          <el-switch active-text="是" inactive-text="否" v-model="form.isforce"></el-switch>
        </el-form-item>
        <el-form-item label="导入inMac"
                      :label-width="formLabelWidth">
          <!-- <el-button type="primary" @click="importInMacBtn">导入inMac</el-button> -->
          <el-upload 
            class="avatar-uploader"
            :show-file-list="false"
            :action="importinmac"
            auto-upload
            ref="inMacData"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel"
            name="file"
            :on-preview="handlePreview2"
            :data="inMacMsg"
            :clearFiles="clearInMacFile"
            :before-upload="upInMacParams"
            :on-success="upInMacSuccess"
            style="display:inline-block; vertical-align:top;">
            <el-button style="vertical-align: top;" type="primary">导入inMac</el-button>
          </el-upload>
          <!-- <el-button @click="importInMacparams">点击上传</el-button> -->
        </el-form-item>
        <!-- <el-dialog
          width="30%"
          title="导入inmac"
          :visible.sync="showInMacdia"
          append-to-body>
            <div>
              <el-upload 
                class="avatar-uploader" 
                :action="importinmac"
                ref="uploadInMac"
                :auto-upload="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel"
                name="file"
                :on-preview="handlePreview2"
                :data="inMacMsg"
                style="display:inline-block; vertical-align:top; margin-left:20px;">
                <el-button style="vertical-align: top;" type="primary" @click="importInMac">导入inMac</el-button>
              </el-upload>
              <span style="vertical-align:middle;">支持xls, xlsx文件</span>
              <el-input v-model="inMachw" placeholder="输入hw"></el-input>
              <el-input v-model="inMacsw" placeholder="输入sw"></el-input>
            </div>
            
            <span slot="footer" class="dialog-footer">
              <el-button @click="showInMacdia = false">取 消</el-button>
              <el-button type="primary" @click="upinMacList">确 定</el-button>
            </span>
        </el-dialog> -->


        <!-- <el-form-item label="兼容imgurl"
                      :label-width="formLabelWidth">
          <el-col :span="8">
            <el-tooltip class="item" effect="light" :content="form.imgurl" placement="top">
            <el-upload
              class="uploader-demo"
              :action="uploadApi"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="handleFileSuccess1"
              :on-error="handleFileError">
              <el-button size="small" type="primary">上传imgurl</el-button>
            </el-upload>
            </el-tooltip>
          </el-col>
          <el-col :span="8" :justify="'center'">
            <el-tooltip class="item" effect="light" :content="form.imgurl2" placement="top">
            <el-upload
              class="uploader-demo"
              :action="uploadApi"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="handleFileSuccess2"
              :on-error="handleFileError">
              <el-button size="small" type="primary">上传imgurl2</el-button>
            </el-upload>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="light" :content="form.imgurl3" placement="top">
            <el-upload
              class="uploader-demo"
              :action="uploadApi"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="handleFileSuccess3"
              :on-error="handleFileError">
              <el-button size="small" type="primary">上传imgurl3</el-button>
            </el-upload>
            </el-tooltip>
          </el-col>
        </el-form-item> -->

        <el-form-item label="镜像文件" required :label-width="formLabelWidth">
          <div>
            <div>
              <el-button size="middle" style="margin-bottom: 10px;" type="primary" @click="addImgMap">+</el-button>
            </div>
            <div v-for="(img, index) in imgMap" :key='index' style="height:30px;margin: 10px 0;float: left;">
              <el-col :span="5">
                <div style="width: 85%;">
                  <el-input v-model="img.name" auto-complete="off"></el-input>
                </div>
                <!-- <span>:</span> -->
              </el-col>
              <el-col :span="13">
                <el-tooltip class="item" effect="light" :content="img.url" placement="top">
                  <div
                    style=" margin: 0; white-space:nowrap;text-overflow-ellipsis: ellipsis; overflow: hidden; min-width: 200px; padding-right:20px;box-sizing: border-box;">
                    {{img.url}}
                  </div>
                </el-tooltip>
              </el-col>
              <el-col :span="3">
                   <el-upload
                    class="uploader-demo"
                    :action="uploadApi"
                    :show-file-list="false"
                    :auto-upload="true"
                    :on-success="handleFileSuccess"
                    :on-error="handleFileError">
                  <el-button :disabled="cInd !== -1 && cInd !== index" size="small" type="primary" @click="clickMe(index)">上传</el-button>
                  </el-upload>
              </el-col>
              <el-col :span="3">
                  <el-button size="small" type="danger" @click="deleteImgMap(index)">删除</el-button>
              </el-col>
            </div>
          </div>
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
  import * as upgrade from 'api/upgrade'
  import { parseTime, formatDate } from 'utils/index'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
  const uploadApi = process.env.BASE_API + '/uploadFile'
  const importoutmac = process.env.BASE_API + '/upgrade/importOutUpgradeDevice'
  const importinmac = process.env.BASE_API + '/upgrade/importInUpgradeDevice'
  const reg = /[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}:[A-Z\d]{2}/i
  export default {
    components: {ElButton},
    data() {
      return {
        uploadApi,
        importoutmac,
        importinmac,
        reg,
        lists: [],
        listLoading: true,
        offset: 0,
        currentPage: 1,
        total: 1,
        pagesize: 12,
        dialogFormVisible: false,
        dialogTitle: '新建',
        form: {
          startdate: '',
          enddate: '',
          isforce: false,
          hw: '',
          sw: '',
          eDevid: '',
          sDevid: '',
          limitnum: -1,
          minsw: '',
          imgurl: '',
          imgurl2: '',
          imgurl3: ''
        },
        imgMap: [{name: '', url: ''}],
        cInd: -1,
        formLabelWidth: '130px',
        outerVisible: false,
        innerVisible: false,
        macList: [],
        upgradeInfoList: [],
        macListTotal: 200,
        macListPageSize: 20,
        macCurrentPage: 1,
        // judgeShowMacPage: true,
        OutmacDia: false,
        outMacMsg: {
          hw: '',
          sw: ''
        },
        inMacMsg: {
          hw: '',
          sw: '',
          upId: ''
        },
        SdevidSel: false,
        enable: 'enable',
        hwList: [],
        selectedHw: '',
        checkUpgradeMac: '',
        checkUpgradeMac_g: '',
        showInMacdia: false,
        checkimportedOutMac: false,
        checkimportedInMac: false,
        showoutmacList: [],
        showinmacList: [],
        showOutMacMsg: '',
        showInMacMsg: [],
        inMachw: '',
        inMacsw: '',
        checkUpgradedHw: '',
        checkUpgradedSw: '',
        checkUpgradeInMac: '',
        delInMacParamHw: '',
        delInMacParamSw: '',
        delInMacParamupId: '',
        currentHw: '',
        currentSw: '',
        currentupId: '',
        macUpgradestate: '',
        showInMacStateVisible: false,
        inMacUpgradeState: '',
        inMacUpgradeCount: '',
        upgradeCount: '',
        MacStateoffset: 0,
        MacStatepageSize: 20,
        macStateCurrentPage: 1,
        checkMacStateTotal: null
      }
    },
    created() {
      this._getLists(this.offset, this.pagesize)
    },
    methods: {
      _getLists() {
        this.listLoading = true
        device.getUpgradeList().then(res => {
          console.log('这是数据', res.data)
          this.listLoading = false
          this.total = res.data.total
          this.lists = res.data.lists
          let abc = []
          for (var i = 0; i < this.lists.length; i++) {
            if (abc.indexOf(this.lists[i].hw) === -1) {
              abc.push(this.lists[i].hw)
              // abc.push({'value': this.lists[i].hw})
            }
          }
          abc.forEach(item => {
            this.hwList.push({'value': item, 'lable': item})
          })
        })
        console.log(this.hwList)
      },
      _formatDate(time) {
        return formatDate(time, ' ', 'Y-M-d-h-m-s')
      },
      deleteImgMap(index) {
        this.imgMap.splice(index, 1)
        if (index === this.cInd) this.cInd = -1
      },
      addImgMap() {
        this.imgMap.push({'name': '', 'url': ''})
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
        this.form = {
          startdate: '',
          enddate: '',
          isforce: false,
          hw: '',
          sw: '',
          eDevid: '',
          sDevid: '',
          minsw: '',
          limitnum: -1,
          imgurl: '',
          imgurl2: '',
          imgurl3: ''
        }
        this.imgMap = []
      },
      handleAddSave(o) {
        if (!this.SdevidSel) {
          this.enable = ''
        } else {
          this.enable = this.enable
        }
        console.log('开始时间', o.startdate)
        let startdate = new Date(o.startdate)
        let enddate = new Date(o.enddate)
        o.startdate = parseTime(startdate)
        o.enddate = parseTime(enddate)
        o.imgMap = this.imgMap
        console.log(o)
        device.addUpgrade(o).then(res => {
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
              message: res.data.msg
            })
          }
        })
      },
      handleEditDeviceClass(o) {
        console.log(o)
        if (o.sdevid === 'enable') {
          this.SdevidSel = true
          this.enable = 'enable'
        } else {
          this.SdevidSel = false
          this.enable = ''
        }
        this.dialogFormVisible = true
        this.dialogTitle = '编辑'
        this.form = {
          id: o.id,
          startdate: o.startdate,
          enddate: o.enddate,
          isforce: o.isforce,
          hw: o.hw,
          sw: o.sw,
          eDevid: o.eDevid,
          sDevid: this.enable,
          minsw: o.minsw,
          limitnum: o.limitnum,
          imgurl: o.imgurl,
          imgurl2: o.imgurl2,
          imgurl3: o.imgurl3
        }
        this.imgMap = o.imgMap
      },
      handleEditSave(o) {
        console.log(1)
        if (this.SdevidSel) {
          o.sDevid = this.enable
        } else {
          o.sDevid = ''
        }
        let startdate = new Date(o.startdate)
        let enddate = new Date(o.enddate)
        console.log('开始时间', o.startdate)
        o.startdate = parseTime(startdate)
        o.enddate = parseTime(enddate)
        o.imgMap = this.imgMap
        device.updateUpgrade(o).then(res => {
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
              message: res.data.msg
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
          device.deleteUpgrade(id).then(res => {
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
      clickMe(index) {
        this.cInd = index
      },
      handleFileError() {
        this.$message({
          type: 'error',
          message: '上传失败!'
        })
        this.cInd = -1
      },
      handleFileSuccess(res, file) {
        console.log(res, file)
        console.log(res.url)
        this.imgMap[this.cInd].url = res.url
        this.cInd = -1
      },
      upgradeMsg(scope) {
        this.outerVisible = true
        console.log(scope.row.hw, scope.row.sw)
        this.checkUpgradedHw = scope.row.hw
        this.checkUpgradedSw = scope.row.sw
        this.checkMacState()
      },
      checkMacState() {
        upgrade.upgradeMsg(this.checkUpgradedHw, this.checkUpgradedSw, this.MacStateoffset, this.MacStatepageSize).then(res => {
          // console.log('suoyou', res)
          this.macList = res.data.lists
          this.checkMacStateTotal = res.data.total
          // console.log('这是数据', res)
          console.log(this.macList)
          upgrade.selectAllMacConfig(this.macList, this.checkUpgradedHw, this.checkUpgradedSw).then((res) => {
            console.log('批量获取mac', res)
            res.forEach((item, index) => {
              let cur = item.data
              cur.mac = this.macList.shift()
              this.upgradeInfoList.push(cur)
            })
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err
            })
          })
        })
      },
      changePage(value) {
        // console.log(this.macStateCurrentPage)
        console.log(value)
        this.upgradeInfoList = []
        this.MacStateoffset = (value - 1)
        this.checkMacState()
      },
      cancelCheckMacState() {
        this.outerVisible = false
        this.upgradeInfoList = []
        // this.MacStateoffset = 0
        // this.macStateCurrentPage = 1
      },
      hideMacPage(done) {
        // this.judgeShowMacPage = true
        done()
        this.upgradeInfoList = []
      },
      importOutMac() {
        this.OutmacDia = true
        this.selectedHw = ''
      },
      upOutMacList() {
        console.log(this.selectedHw)
        this.OutmacDia = false
        this.outMacMsg.hw = this.selectedHw
        this.$refs.upload.submit()
      },
      handlePreview(file) {
        console.log(file)
      },
      handlePreview2(file) {
        console.log(file)
      },
      importInMac() {
      },
      importInMacBtn() {
        this.showInMacdia = true
      },
      upinMacList() {
        this.showInMacdia = false
        this.$refs.uploadInMac.submit()
      },
      upoutMacSuccess(response, file, fileList) {
        console.log(response)
        if (response.ret === 0) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
        }
        console.log(file, fileList)
      },
      clearOutMacFile(done) {
        this.$refs.upload.clearFiles()
        done()
      },
      clearInMacFile () {
        this.$refs.inMacData.clearFiles()
      },
      checkOutMac() {
        console.log(this.selectedHw)
        if (this.checkUpgradeMac_g === '') {
          upgrade.selectOutUpgradeMac(this.selectedHw, this.checkUpgradeMac_g).then(res => {
            console.log(res)
            this.showoutmacList = res.data.lists
            console.log(this.showoutmacList)
          })
        } else {
          if (!reg.test(this.checkUpgradeMac_g)) {
            this.$message({
              type: 'error',
              message: '请输入正确的Mac地址'
            })
          } else {
            upgrade.selectOutUpgradeMac(this.selectedHw, this.checkUpgradeMac_g).then(res => {
              console.log(res)
              this.showOutMacMsg = res.data.msg
              console.log(this.showOutMacMsg)
            })
          }
        }
      },
      upInMacParams() {
        console.log(this.form)
        this.inMacMsg.sw = this.form.sw
        this.inMacMsg.hw = this.form.hw
        this.inMacMsg.upId = Number(this.form.id)
        console.log(typeof this.inMacMsg.sw)
        console.log(typeof this.inMacMsg.hw)
        console.log(typeof this.inMacMsg.upId)
      },
      upInMacSuccess(response, file, fileList) {
        console.log(response)
        console.log(file)
        if (response.ret === 0) {
          this.$message({
            type: 'success',
            message: response.msg
          })
        }
      },
      // importInMacparams() {
      //   this.$refs.upInMacload.submit()
      // },
      delOutMac (scope) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          upgrade.delOutUpgradeMac(this.selectedHw, scope.row).then(res => {
            console.log(res)
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.checkOutMac()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      showUpgradedMac(scope) {
        this.innerVisible = true
        console.log(scope.row)
        upgrade.selectMacConfig(scope.row, this.checkUpgradedHw, this.checkUpgradedSw).then(res => {
          console.log(res)
          this.macUpgradestate = res.data.isSuccess
          this.upgradeCount = res.data.count + 1
        })
      },
      showCheckInMac(scope) {
        console.log(scope)
        upgrade.selectInUpgradeMac(scope.row.hw, scope.row.sw, scope.row.id, this.checkUpgradeInMac).then(res => {
          console.log(res)
          if (res.data.lists.length === 0) {
            this.$message({
              type: 'info',
              message: '暂无数据，请导入inMac数据'
            })
          } else {
            this.checkimportedInMac = true
          }
          console.log(this.showinmacList)
          this.showinmacList = res.data.lists
          this.currentHw = scope.row.hw
          this.currentSw = scope.row.sw
          this.currentupId = scope.row.id
          console.log(this.currentHw)
        })
      },
      checkInMac(scope) {
        this.showInMacStateVisible = true
        console.log(scope.row)
        upgrade.selectMacConfig(scope.row, this.currentHw, this.currentSw).then(res => {
          console.log(res)
          this.inMacUpgradeState = res.data.isSuccess
          this.inMacUpgradeCount = res.data.count
        })
          // upgrade.selectInUpgradeMac(scope.row.hw, scope.row.sw, scope.row.id, item).then(res => {
          //   console.log(res.data.msg)
          //   this.showInMacMsg = res.data.msg
          // })
        // console.log(scope)
        // upgrade.selectInUpgradeMac(scope.row.hw, scope.row.sw, scope.row.id, this.checkUpgradeInMac).then(res => {
        //   console.log(res.data.msg)
        //   this.showInMacMsg = res.data.msg
        // })
      },
      delInMac(scope) {
        console.log(scope.row)
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          upgrade.delInUpgradeMac(this.currentHw, this.currentSw, this.currentupId, scope.row).then(res => {
            console.log(res)
            if (res.data.ret === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            }
            // let o = {}
            // o.row.hw = this.currentHw
            // o.row.sw = this.currentSw
            // o.row.id = this.currentupId
            // console.log(o)
            // this.showCheckInMac(o)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      selectEnableState() {
        if (this.SdevidSel) {
          this.enableState = false
          this.enable = 'enable'
          this.form.sDevid = 'enable'
        } else {
          this.enableState = true
          this.enable = ''
          this.form.sDevid = ''
        }
        console.log(this.SdevidSel)
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .dialog {
    min-width: 710px;
  }
  .MacList {
    list-style: none;
    div {
      display:inline-block;
      padding-left:8px; 
      margin-right:40px; 
      width:200px; 
      height:30px; 
      border:1px solid #aaa;
    }
  }
</style>

