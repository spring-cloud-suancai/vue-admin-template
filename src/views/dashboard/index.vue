<template>
  <div class="dashboard-container">
    <div class="dashboard-text">nickname: {{ vuex_user.nickname }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
