<template>
  <div class="app-container">

    <el-table ref="tableData" :data="tableData" align="center" show-overflow-tooltip highlight-current-row class="w100" v-loading="tableDataLoading" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="index" width="50" class-name="indexClassName"></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="value" label="value"></el-table-column>
      <el-table-column prop="orderNo" label="排序号"></el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <span :class="`${scope.row.status == 1 ? 'yes' : 'no'}`">
            {{$utilsPro.getNameByValueAndDictList(vuex_yes_no_dict,scope.row.status)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="290">
        <template slot="header">
          <!-- <el-tooltip class="item" effect="dark" content="搜索" placement="top" :open-delay="800">
            <el-button icon="el-icon-search" circle size="medium" @click="searchDrawerVisible = true"></el-button>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="新增" placement="top" :open-delay="800">
            <el-button icon="el-icon-plus" type="primary" circle size="mini" @click="addRow()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :open-delay="800">
            <el-button icon="el-icon-delete" type="danger" circle size="mini" @click="delRow()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top" :open-delay="800">
            <el-button @click="refreshTableData()" type="success" icon="el-icon-refresh-right" circle size="mini"></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="viewRow(scope.row)" plain>详情</el-button>
          <!-- <el-button type="success" size="mini" @click="addRow(scope.row.id)" plain>添加</el-button> -->
          <el-button type="primary" size="mini" @click="editRow(scope.row)" plain>编辑</el-button>
          <el-button type="danger" size="mini" @click="delRow(scope.row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-e m-t-10">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="rowDialogVisible" :title="rowDialogTitle" center :close-on-click-modal="false" v-dialogDrag append-to-body>
      <el-form ref="rowForm" :model="rowForm" label-width="80px" :disabled="rowDialogTitle.indexOf('查看') != -1" v-loading="rowFormLoading">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="value" prop="value" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-input v-model="rowForm.value" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNo">
          <el-input v-model="rowForm.orderNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
          <el-select v-model="rowForm.status" placeholder="请选择" :class="`w100 ${rowForm.status == 1 ? 'yes' : 'no'}`">
            <el-option v-for="item in vuex_yes_no_dict" :key="item.value" :label="item.name" :value="item.value">
              <span style="float: left;" :class="`${item.value == 1 ? 'yes' : 'no'}`">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rowDialogVisible = false">{{rowDialogTitle.indexOf('查看') != -1 ? '关 闭' : '取 消'}}</el-button>
        <el-button type="primary" @click="clickInserOrUpdate()" v-if="rowDialogTitle.indexOf('查看') == -1" v-noMoreClick>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: {
    dictKey: {
      type: String,
      required: true
    }
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
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.refreshTableData()
    },
    refreshTableData () {
      this.tableDataLoading = true

      this.$http({
        url: '/dict-service/dict/page',
        method: 'get',
        params: {
          ...this.searchForm,
          type: 2,
          dictKey: this.dictKey,
          // pageNum: this.pageNum,
          pageSize: -1,
          'orders[0].column': 'order_no',
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
        url: '/dict-service/dict/insertOrUpdate',
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
      this.openDialog({ dictKey: this.dictKey, type: 2, status: '1' }, '新增字典子项')
    },
    viewRow (row) {
      this.openDialog(row, '查看字典子项')
    },
    editRow (row) {
      this.openDialog(row, '编辑字典子项')
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
        url: '/dict-service/dict/deleteByIdList',
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
