<template>
  <div>
    <template v-for="item in routes">
      <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0"
                   :to="item.path+'/'+item.children[0].path" :key="item.name">
        <el-menu-item :index="item.path+'/'+item.children[0].path">
          <wscn-icon-svg v-if="item.icon" :icon-class="item.icon"/>
          {{item.children[0].name}}
        </el-menu-item>
      </router-link>
      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden" :key="item.name">
        <template slot="title">
          <wscn-icon-svg v-if="item.icon" :icon-class="item.icon"/>
          {{item.name}}
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item class="menu-indent" v-if="child.children&&child.children.length>0"
                        :routers="[child]" :key="child.name"></sidebar-item>
          <router-link v-else class="menu-index" :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.name}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .wscn-icon {
    margin-right: 10px;
  }

  .hideSidebar .menu-indent {
    display: block;
    text-indent: 10px;
  }
</style>
