
import { MessageBox } from 'element-ui';

const install = {
  // 根据list和 value，获取字典的name值
  getNameByValueAndDictList (dictList, value) {
    let res = ''

    dictList.forEach(item => {
      if (item.value == value) {
        res = item.name
        return
      }
    })

    return res
  },
  // 下载文件：需要这样请求 $http({responseType: 'blob'})
  download (res, fileName) {
    if (!res) {
      return new Error('download 方法的res参数不能为空')
    }
    const blob = new Blob([res])
    fileName = fileName || new Date().getTime() + '.xls'
    const elink = document.createElement('a')
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  },
  // list 转 树结构，children为空时，children = ''
  listToTree (lst, pid) {
    let tmp = []
    let treeLst = lst
    treeLst.forEach((item, index) => {
      if (item.parentId == pid) {
        const children = install.listToTree(treeLst, item.id)
        if (children && (children.length > 0)) {
          treeLst[index].children = children
        } else {
          treeLst[index].children = ''
        }
        tmp.push(treeLst[index])
      }
    })
    return tmp
  },
  // list 转 树结构：children始终为 []
  listToTree2 (lst, pid) {
    let tmp = []
    let treeLst = lst
    treeLst.forEach((item, index) => {
      if (item.parentId == pid) {
        const children = install.listToTree2(treeLst, item.id)
        // if (children && (children.length > 0)) {
        treeLst[index].children = children
        // } else {
        // treeLst[index].children = []
        // }
        tmp.push(treeLst[index])
      }
    })
    return tmp
  },
  // 让 children.lenth == 0 的数据变成 children = ''
  handleResultTree (data) {
    if (!data) {
      return
    }
    data.forEach(item => {
      if (item.children && item.children.length == 0) {
        item.children = ''
      } else {
        install.handleResultTree(item.children)
      }
    })
  },
  execConfirm (confirmFun, data, msg) {
    MessageBox.confirm(msg || '确定执行操作？', '提示', {
      confirmButtonText: '确定',
      confirmButtonLoading: false,
      cancelButtonText: '取消',
      type: 'warning',
      closeOnPressEscape: true,
      closeOnClickModal: true,
      showClose: true,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.closeOnPressEscape = false // 不允许按 esc按钮关闭弹窗
          instance.closeOnClickModal = false // 不允许点击遮罩关闭弹窗

          instance.cancelButtonText = '关闭'
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'
          await confirmFun(data)
        }
        done()
      }
    })
  },
}

export default {
  ...install
}
