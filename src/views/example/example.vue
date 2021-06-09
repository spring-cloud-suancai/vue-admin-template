<template>
  <div class="app-container">

    <el-form-item label="建筑面积（㎡）" prop="buildingArea" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
      <el-input v-model="rowForm.buildingArea" clearable></el-input>
    </el-form-item>

    <el-form-item label="父级菜单" prop="parentId">
      <el-cascader class="w100" v-model="rowForm.parentId" :options="menuTree" :props="{emitPath: false, checkStrictly: true, value: 'id',label: 'name'}" placeholder="" filterable clearable
        @change="rowFormParentIdChange">
        <template slot-scope="{ data }">
          <span>{{ data.name }}</span>
          <span>{{ data.children.length ? `(${data.children.length})` : '' }}</span>
        </template>
      </el-cascader>
    </el-form-item>

    <el-form-item label="是否显示" prop="showFlag" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
      <el-select v-model="rowForm.showFlag" placeholder="请选择" class="w100">
        <el-option v-for="item in vuex_yes_no_dict" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="rowForm.type != 3" label="是否显示" prop="showFlag" :rules="[{ required: true, message: '该输入项不能为空', trigger: 'change'}]">
      <el-select v-model="rowForm.showFlag" placeholder="请选择" :class="`w100 ${rowForm.showFlag == 1 ? 'yes' : 'no'}`">
        <el-option v-for="item in vuex_yes_no_dict" :key="item.value" :label="item.name" :value="item.value">
          <span style="float: left;" :class="`${item.value == 1 ? 'yes' : 'no'}`">{{ item.name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-table-column label="是否显示">
      <template slot-scope="scope">
        <span :class="`${scope.row.showFlag == 1 ? 'yes' : 'no'}`">
          {{$utilsPro.getNameByValueAndDictList(vuex_yes_no_dict,scope.row.showFlag)}}
        </span>
      </template>
    </el-table-column>

    <el-tooltip class="item" effect="dark" content="刷新" placement="top" :open-delay="800">
      <el-button @click="refreshTableData()" type="success" icon="el-icon-refresh-right" circle size="medium"></el-button>
    </el-tooltip>

    <el-drawer title="搜索" :visible.sync="searchDrawerVisible" :size="'22%'">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" @submit.native.prevent class="app-container">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-drawer>

    <div class="flex jc-e m-t-10">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <el-pagination layout="total" :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
  },
  data () {
    return {
      size: "medium"
    }
  },
  watch: {
    searchForm: {
      handler: () => {
        this.refreshTableData()
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.$refs.rowForm.clearValidate()
      })

      this.$refs.rowForm.validate((valid) => {
        if (!valid) {
          return
        }
      })
    }
  }
}
</script>

<style>
</style>
