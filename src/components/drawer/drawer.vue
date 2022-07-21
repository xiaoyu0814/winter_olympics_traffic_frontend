<template>
  <div id="drawer">
    <el-drawer
      title="我是标题"
      :visible.sync="$store.state.drawer"
      direction="ltr"
      append-to-body
      :modal="false"
      :before-close="handleClose"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      size="100%"
    >
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$store.state.drawer = false;
    },
  },
};
</script>

<style scoped>
</style>