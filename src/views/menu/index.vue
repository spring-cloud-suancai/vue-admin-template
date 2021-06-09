<template>
  <div class="app-container">

    <el-table ref="tableData" :data="menuTree" align="center" show-overflow-tooltip highlight-current-row class="w100" v-loading="tableDataLoading" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="index" width="50" class-name="indexClassName"></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="展开全部" placement="top" :open-delay="800">
            <span class="hand" @click="clickToggleRowExpansion()">名称 <i class="el-icon-arrow-down"></i></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="uri" label="uri"></el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{$utilsPro.getNameByValueAndDictList(typeDict,scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="排序号"></el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="scope">
          <span :class="`${scope.row.showFlag == 1 ? 'yes' : 'no'}`">
            {{$utilsPro.getNameByValueAndDictList(vuex_yes_no_dict,scope.row.showFlag)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="290">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="搜索" placement="top" :open-delay="800">
            <el-button icon="el-icon-search" circle size="medium" @click="searchDrawerVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="top" :open-delay="800">
            <el-button icon="el-icon-plus" type="primary" circle size="medium" @click="addRow()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :open-delay="800">
            <el-button icon="el-icon-delete" type="danger" circle size="medium" @click="delRow()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top" :open-delay="800">
            <el-button @click="refreshTableData()" type="success" icon="el-icon-refresh-right" circle size="medium"></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="viewRow(scope.row)" plain>详情</el-button>
          <el-button type="success" size="mini" @click="addRow(scope.row.id)" plain>添加</el-button>
          <el-button type="primary" size="mini" @click="editRow(scope.row)" plain>编辑</el-button>
          <el-button type="danger" size="mini" v-if="sysMenuIdList.indexOf(scope.row.id) == -1" @click="delRow(scope.row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-e m-t-10">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="rowDialogVisible" :title="rowDialogTitle" center :close-on-click-modal="false" v-dialogDrag>
      <el-form ref="rowForm" :model="rowForm" label-width="80px" :disabled="rowDialogTitle === '查看菜单'" v-loading="rowFormLoading">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader class="w100" v-model="rowForm.parentId" :options="menuTree" :props="{emitPath: false, value: 'id',label: 'name'}" placeholder="" filterable clearable @change="rowFormParentIdChange">
            <template slot-scope="{ data }">
              <span>{{ data.name }}</span>
              <span>{{ data.children.length ? `(${data.children.length})` : '' }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-select v-model="rowForm.type" placeholder="请选择" class="w100">
            <el-option v-for="item in typeDict" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="rowForm.type == 2" label="uri" prop="uri" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.uri" clearable placeholder="页面的uri（不能重复）"></el-input>
        </el-form-item>
        <el-form-item v-if="rowForm.type == 2" label="组件路径" prop="componentPath" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.componentPath" clearable placeholder="页面组件的路径（@/views + component_path）"></el-input>
        </el-form-item>
        <el-form-item v-if="rowForm.type == 2" label="权限" prop="auths">
          <el-input v-model="rowForm.auths" clearable placeholder="权限，多个可用逗号拼接，格式：user:add,user:list,user:update,..."></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="rowForm.type != 3" label="图标" prop="icon">
          <el-input v-model="rowForm.icon" clearable></el-input>
        </el-form-item> -->
        <el-form-item v-if="rowForm.type != 3" label="排序号" prop="orderNo">
          <el-input v-model.number="rowForm.orderNo" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="rowForm.type != 3" label="是否显示" prop="showFlag" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-select v-model="rowForm.showFlag" placeholder="请选择" :class="`w100 ${rowForm.showFlag == 1 ? 'yes' : 'no'}`">
            <el-option v-for="item in vuex_yes_no_dict" :key="item.value" :label="item.name" :value="item.value">
              <span style="float: left;" :class="`${item.value == 1 ? 'yes' : 'no'}`">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rowDialogVisible = false">{{rowDialogTitle === '查看菜单' ? '关 闭' : '取 消'}}</el-button>
        <el-button type="primary" @click="clickInserOrUpdate()" v-if="rowDialogTitle !== '查看菜单'" v-noMoreClick>确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer title="搜索" :visible.sync="searchDrawerVisible" size="22%">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" @submit.native.prevent class="app-container">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="uri" prop="uri">
          <el-input v-model="searchForm.uri" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择" class="w100" clearable>
            <el-option v-for="item in typeDict" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="showFlag">
          <el-select v-model="searchForm.showFlag" placeholder="请选择" :class="`w100 ${searchForm.showFlag == 1 ? 'yes' : 'no'}`" clearable>
            <el-option v-for="item in vuex_yes_no_dict" :key="item.value" :label="item.name" :value="item.value">
              <span style="float: left;" :class="`${item.value == 1 ? 'yes' : 'no'}`">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
export default {
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
      sysMenuIdList: ['1'], // 系统自带的菜单
      typeDict: [{ name: '菜单', value: '1' }, { name: '页面', value: '2' }, { name: '按钮', value: '3' }], // 1 菜单 2 页面 3 按钮
    }
  },
  created () {
    this.init()
  },
  computed: {
    menuTree () {
      return this.$utilsPro.listToTree(this.tableData, 0)
    }
  },
  watch: {
    searchForm: {
      handler: function () {
        this.refreshTableData()
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.refreshTableData()
    },
    clickToggleRowExpansion () {
      this.tableData.forEach(item => {
        this.$refs.tableData.toggleRowExpansion(item)
      })
    },
    rowFormParentIdChange (newV) {
      if (!newV) {
        this.rowForm.parentId = 0
      }
    },
    refreshTableData () {
      this.tableDataLoading = true

      this.$http({
        url: '/menu-service/menu/page',
        method: 'get',
        params: {
          ...this.searchForm,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          'orders[0].column': 'order_no'
        }
      }).then(({ data }) => {
        this.tableData = data.records || []
        this.total = data.total

        this.tableDataLoading = false
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
    insertOrUpdate () {
      this.rowFormLoading = true
      this.$http({
        url: '/menu-service/menu/insertOrUpdate',
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
    addRow (id) {
      this.openDialog({ showFlag: '1', parentId: id || '0', type: '1' }, '新增菜单')
    },
    viewRow (row) {
      this.openDialog(row, '查看菜单')
    },
    editRow (row) {
      this.openDialog(row, '编辑菜单')
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
        url: '/menu-service/menu/deleteByIdList',
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
    handleSizeChange (val) {
      this.pageSize = val
      this.refreshTableData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.refreshTableData()
    },
  }
}
</script>

<style>
</style>
