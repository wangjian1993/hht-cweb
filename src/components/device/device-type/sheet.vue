<template>
  <ul class="list">
    <li class="item" v-for="(item, index) in data" :key="index">
      <div class="head">
        <div class="headimg"><img :src="item.headimg" alt=""></div>
        <div class="title">
          <p class="item-id">编号：<span>{{item.id}}</span></p>
          <p class="item-type-name">设备类型名称：<span>{{item.devClass.devclassname}}</span></p>
          <p class="item-name">设备名称：<span>{{item.name}}</span></p>
          <p class="item-auto">自动播放：<span>{{item.bootstrap ? '是':'否'}}</span></p>
          <div class="channel">
            <el-button type="primary" size="mini"
            @click="editChannel(item)">频道</el-button>
          </div>
          <div class="icon"><span class="el-icon-edit" @click="editDevType(item)"></span><span class="el-icon-delete2" @click="deleteDevType(item.id)"></span></div>
        </div>
      </div>
      <div class="desc">详情：<span>{{item.sdesc}}</span></div>
      <div class="line"></div>
      <ul class="channel" v-if="item.channels.length">
        <li class="channel-item" v-for="(channel, index) in item.channels" :key="index">
          <div class="channel-img"><img :src="channel.image" alt=""></div>
          <p class="channel-name">
            {{channel.name}}
          </p>
        </li>
      </ul>
      <div class="noChannel" v-if="!item.channels.length">
        目前没有频道...
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      deleteDevType(id) {
        this.$emit('deleteDevType', id)
      },
      editDevType(o) {
        this.$emit('editDevType', o)
      },
      editChannel(o) {
        this.$emit('editChannel', o)
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .list {
    list-style: none;
    padding: 0;
    display: flex;
    background-color: #f5f5f5;
    flex-flow: row wrap;
    margin: 0;
    max-height:700px;
    overflow-y: scroll;
    .item {
      position: relative;
      top: 0;
      height: 215px;
      width: 23%;
      min-width: 250px;
      background-color: #fff;
      margin: 0.5% 1%;
      box-shadow: 1px 1px 2px #aaa;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
      transition: top 0.3s ease;
      &:hover {
        transition: top 0.3s ease;
        top: -5px;
        box-shadow: 1px 1px 2px #999;
      }
      .head {
        display: flex;
        flex-flow: row nowrap;
        height: 90px;
        padding: 10px 10px 3px;
        .headimg {
          width: 70px;
          height: 70px;
          margin: 0 10px;
          img{
            height:100%;
            width:100%;
          }
        }
        .title {
          position: relative;
          font-size: 12px;
          color: #333;
          flex: 1;
          .channel{
            position: absolute;
            top: 60px;
            right: 5px;
          }
          .icon {
            position: absolute;
            top: 0;
            right: 5px;
            width: 50px;
            height: 20px;
            color: #20a0ff;
            span {
              float: left;
              cursor: pointer;
              width: 20px;
              height: 20px;
              font-size: 16px;
              text-align: center;
              line-height: 20px;
              margin: 0 2.5px;
            }
          }
          p {
            line-height: 20px;
            padding: 0;
            margin: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .item-name {
            span {
              color: #20a0ff;
            }
          }

        }

      }
      .desc {
        font-size: 12px;
        line-height: 20px;
        padding-left: 10px;
        margin-bottom: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .line {
        height: 2px;
        width: 95%;
        margin: 0 auto;
        background-color: #20a0ff;
      }
      .noChannel {
        width:100%;
        height:86px;
        line-height: 86px;
        text-align: center;
        font-size: 24px;
        color:#ccc;
      }
      .channel {
        list-style: none;
        padding: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        .channel-item {
          width: 20%;
          .channel-img {
            width: 50px;
            height: 50px;
            margin: 10px auto;
            border-radius: 50%;
            cursor: pointer;
            overflow: hidden;
            img{
              height:100%;
              width:100%;
            }
          }
          .channel-name {
            font-size: 12px;
            text-align: center;
            line-height: 16px;
          }
        }
      ;
      }
    }
  }
</style>
