<template>
  <div class="app-container">

    <LeftWResize>
      <el-card slot="left" shadow="never" class="h100 overflow-y">
        <div slot="header" class="flex jc-sb ai-c">
          <div>角色列表</div>
          <div class="m-l-30">
            <el-tooltip class="item" effect="dark" content="搜索" placement="top" :open-delay="800">
              <el-button icon="el-icon-search" circle size="mini" @click="searchDrawerVisible = true"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="新增" placement="top" :open-delay="800">
              <el-button icon="el-icon-plus" type="primary" circle size="mini" @click="addRow()"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :open-delay="800">
              <el-button icon="el-icon-delete" type="danger" circle size="mini" @click="delRow()"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top" :open-delay="800">
              <el-button @click="refreshTableData()" type="success" icon="el-icon-refresh-right" circle size="mini"></el-button>
            </el-tooltip>
          </div>
        </div>
        <el-table ref="tableData" :data="tableData" align="center" show-overflow-tooltip highlight-current-row class="w100" v-loading="tableDataLoading" @selection-change="handleSelectionChange" row-key="id"
          @current-change="tableDataHandleCurrentChange">
          <el-table-column type="index" width="50" class-name="indexClassName"></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
        </el-table>
      </el-card>

      <el-tabs v-model="tabsActiveName" slot="right">
        <el-tab-pane label="关联菜单">
          <div v-loading="menuTreeLoading">
            <el-tree ref="menuTree" :data="menuTree" highlight-current default-expand-all show-checkbox node-key="id" :props="{label: 'name'}" @check-change="menuTreeChange">
            </el-tree>
            <div class="t-c">
              <el-button size="medium" type="primary" @click="updateRefMenu()" v-noMoreClick>保存</el-button>
              <el-button size="medium" type="success" @click="getAllMenu()" v-noMoreClick>刷新</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关联用户">
          <div v-loading="userTableDataLoading">
            <el-table ref="userTableData" :data="userTableData" align="center" show-overflow-tooltip highlight-current-row class="w100" @selection-change="userTableHandleSelectionChange" row-key="id">
              <el-table-column type="index" width="50" class-name="indexClassName"></el-table-column>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="nickname" label="昵称"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column width="290">
                <template slot="header">
                  <el-tooltip class="item" effect="dark" content="搜索" placement="top" :open-delay="800">
                    <el-button icon="el-icon-search" circle size="small" @click="userSearchDrawerVisible = true"></el-button>
                  </el-tooltip>
                  <!-- <el-tooltip class="item" effect="dark" content="新增" placement="top" :open-delay="800">
                    <el-button icon="el-icon-plus" type="primary" circle size="small" @click="addRow()"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :open-delay="800">
                    <el-button icon="el-icon-delete" type="danger" circle size="small" @click="delRow()"></el-button>
                  </el-tooltip> -->
                  <el-tooltip class="item" effect="dark" content="刷新" placement="top" :open-delay="800">
                    <el-button @click="refreshUserTableData()" type="success" icon="el-icon-refresh-right" circle size="small"></el-button>
                  </el-tooltip>
                </template>
                <!-- <template slot-scope="scope"> -->
                <!-- <el-button type="info" size="mini" @click="viewUserRow(scope.row)" plain>详情</el-button> -->
                <!-- <el-button type="primary" size="mini" @click="editRow(scope.row)" plain>编辑</el-button>
                  <el-button type="danger" size="mini" @click="delRow(scope.row.id)" plain>删除</el-button> -->
                <!-- </template> -->
              </el-table-column>
            </el-table>
            <div class="flex jc-e m-t-10">
              <el-pagination @size-change="userPageHandleSizeChange" @current-change="userPageHandleCurrentChange" :current-page="userPageNum" :page-sizes="[10, 20, 50, 100]" :page-size="userPageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="userTotal">
              </el-pagination>
            </div>
            <div class="t-c">
              <el-button size="medium" type="primary" @click="updateRefUser()" v-noMoreClick>保存</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </LeftWResize>

    <el-dialog :visible.sync="rowDialogVisible" :title="rowDialogTitle" center :close-on-click-modal="false" v-dialogDrag>
      <el-form ref="rowForm" :model="rowForm" label-width="80px" :disabled="rowDialogTitle === '查看角色'" v-loading="rowFormLoading">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.name" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="关联菜单">
          <el-cascader class="w100" v-model="rowForm.menuIdList" :options="menuTree" :props="{multiple: true, emitPath: false, value: 'id',label: 'name'}" placeholder="" filterable clearable>
            <template slot-scope="{ data }">
              <span>{{ data.name }}</span>
              <span>{{ data.children.length ? `(${data.children.length})` : '' }}</span>
            </template>
          </el-cascader>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rowDialogVisible = false">{{rowDialogTitle === '查看角色' ? '关 闭' : '取 消'}}</el-button>
        <el-button type="primary" @click="clickInserOrUpdate()" v-if="rowDialogTitle !== '查看角色'" v-noMoreClick>确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer title="搜索-角色" :visible.sync="searchDrawerVisible" size="22%">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" @submit.native.prevent class="app-container">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer title="搜索-用户" :visible.sync="userSearchDrawerVisible" size="22%">
      <el-form ref="userSearchForm" :model="userSearchForm" label-width="80px" @submit.native.prevent class="app-container">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userSearchForm.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userSearchForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
import LeftWResize from '@/views/components/LeftWResize'
export default {
  components: {
    LeftWResize
  },
  data () {
    return {
      tableData: [],
      tableDataLoading: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      rowDialogVisible: false,
      rowDialogTitle: '',
      rowForm: {},
      rowFormLoading: false,
      dataListSelections: [],
      searchForm: {},
      searchDrawerVisible: false,
      allMenuList: [],
      // allUserList: [],
      tabsActiveName: '0',
      currentRow: {},
      rightMenuTree: [],
      menuTreeLoading: false,
      userTableData: [],
      userTableDataLoading: false,
      userPageNum: 1,
      userPageSize: 10,
      userTotal: 0,
      userSearchDrawerVisible: false,
      userSearchForm: {},
    }
  },
  computed: {
    menuTree () {
      return this.$utilsPro.listToTree(this.allMenuList, 0)
    }
  },
  watch: {
    searchForm: {
      handler: function () {
        this.refreshTableData()
      },
      deep: true
    },
    userSearchForm: {
      handler: function () {
        this.refreshUserTableData()
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.refreshTableData()

      this.getAllMenu()
      this.refreshUserTableData()
    },
    userTableHandleSelectionChange (val) {
      this.currentRow.userIdList = val.map(item => { return item.userId }).filter(item => { return item })
    },
    menuTreeChange () {
      this.currentRow.menuIdList = this.$refs.menuTree.getCheckedKeys()
    },
    tableDataHandleCurrentChange (row) {
      let userIdList = row.userIdList

      this.currentRow = JSON.parse(JSON.stringify(row))

      this.$refs.menuTree.setCheckedKeys(this.currentRow.menuIdList || [])

      if (this.userTableData[0]) {
        this.$refs.userTableData.clearSelection() // 清除所有选中
      }

      if (!userIdList || !userIdList[0] || !this.userTableData[0]) {
        return
      }

      this.userTableData.forEach(item => {
        if (userIdList.indexOf(item.userId) !== -1) {
          this.$refs.userTableData.toggleRowSelection(item, true) // 根据数据库的值，勾选数据
        }
      })
    },
    getAllMenu () {
      this.menuTreeLoading = true
      this.$http({
        url: '/menu-service/menu/page',
        method: 'get',
        params: {
          pageSize: -1
        }
      }).then(({ data }) => {
        this.allMenuList = data.records || []

        this.menuTreeLoading = false
      }).catch(() => {
        this.menuTreeLoading = false
      })
    },
    refreshUserTableData () {
      this.userTableDataLoading = true
      this.$http({
        url: '/user-service/user/page',
        method: 'get',
        params: {
          ...this.userSearchForm,
          pageNum: this.userPageNum,
          pageSize: this.userPageSize
        }
      }).then(({ data }) => {
        this.userTableData = data.records || []
        this.userTotal = data.total
        this.userTableDataLoading = false

        this.$nextTick(() => {
          if (!this.currentRow.userIdList || !this.currentRow.userIdList[0]) {
            return
          }
          let userIdList = JSON.parse(JSON.stringify(this.currentRow.userIdList))
          this.userTableData.forEach(item => {
            if (userIdList.indexOf(item.userId) !== -1) {
              this.$refs.userTableData.toggleRowSelection(item, true) // 根据数据库的值，勾选数据
            }
          })
        })
      }).catch(() => {
        this.userTableDataLoading = false
      })
    },
    refreshTableData () {
      this.tableDataLoading = true

      this.$http({
        url: '/role-service/role/page',
        method: 'get',
        params: {
          ...this.searchForm,
          pageSize: -1,
          // pageNum: this.pageNum,
          // pageSize: this.pageSize,
        }
      }).then(({ data }) => {
        this.tableData = data.records || []
        this.total = data.total
        this.tableDataLoading = false

        if (this.currentRow.id) {
          // 高亮之前选择的角色
          this.$refs.tableData.setCurrentRow(this.currentRow)
        } else {
          // 默认高亮第一个角色
          this.$refs.tableData.setCurrentRow(this.tableData[0])
        }
      }).catch(() => {
        this.tableDataLoading = false
      })
    },
    clickInserOrUpdate () {
      this.$refs.rowForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.insertOrUpdate()
      })
    },
    updateRefUser () {
      this.userTableDataLoading = true
      this.$http({
        url: '/role-service/role/insertOrUpdate',
        method: 'post',
        data: {
          ...this.currentRow
        }
      }).then(res => {
        this.$message.success(res.msg)
        this.refreshTableData()
        this.userTableDataLoading = false
      }).catch(() => {
        this.userTableDataLoading = false
      })
    },
    updateRefMenu () {
      this.menuTreeLoading = true
      this.$http({
        url: '/role-service/role/insertOrUpdate',
        method: 'post',
        data: {
          ...this.currentRow
        }
      }).then(res => {
        this.$message.success(res.msg)
        this.refreshTableData()
        this.menuTreeLoading = false
      }).catch(() => {
        this.menuTreeLoading = false
      })
    },
    insertOrUpdate () {
      this.rowFormLoading = true
      this.$http({
        url: '/role-service/role/insertOrUpdate',
        method: 'post',
        data: {
          ...this.rowForm
        }
      }).then(res => {
        this.$message.success(res.msg)

        this.refreshTableData()
        this.rowFormLoading = false
        this.rowDialogVisible = false
      }).catch(() => {
        this.rowFormLoading = false
      })
    },
    addRow () {
      this.openDialog({}, '新增角色')
    },
    viewRow (row) {
      this.openDialog(row, '查看角色')
    },
    editRow (row) {
      this.openDialog(row, '编辑角色')
    },
    openDialog (row, title) {
      this.rowForm = JSON.parse(JSON.stringify(row))
      this.rowFormLoading = false
      this.rowDialogTitle = title || 'title'
      this.rowDialogVisible = true
      this.$nextTick(() => {
        this.$refs.rowForm.clearValidate()
      })
    },
    delRow (id) {
      let idList = (id ? [id] : '') || this.dataListSelections.map(item => {
        return item.id
      })

      if (!idList || idList.length === 0) {
        this.$message.error('请选择 (*^▽^*)')
        return
      }

      this.$utilsPro.execConfirm(this.deleteByIdList, idList, '确定删除所选项？')
    },
    deleteByIdList (idList) {
      if (!idList || idList.length === 0) {
        this.$message.error('请选择 (*^▽^*)')
        return
      }

      return this.$http({
        url: '/role-service/role/deleteByIdList',
        method: 'post',
        data: {
          idList
        }
      }).then(res => {
        this.$message.success(res.msg)
        this.refreshTableData()
      }).catch(() => {
        this.refreshTableData()
      })
    },
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    userPageHandleSizeChange (val) {
      this.userPageSize = val
      this.refreshUserTableData()
    },
    userPageHandleCurrentChange (val) {
      this.userPageNum = val
      this.refreshUserTableData()
    },
  }
}
</script>

<style scoped>
/* 降低table的Header的高度 */
::v-deep .el-table__header th {
  padding: 7px 0;
}
</style>
