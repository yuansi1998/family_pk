<template>
  <div id="tips" v-if="status">{{ msg }}</div>
</template>

<script>
export default {
  name: "Tips",
  data() {
    return {
      status: false,
      msg: "",
    };
  },
  methods: {
    showTips(msg) {
      this.status = true;
      this.msg = msg;
      setTimeout(() => {
        this.status = false;
      }, 2000);
    },
  },
};
</script>

<style scoped lang="scss">
#tips {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  font-size: 30px;
  line-height: 34px;
  border-radius: 50px;
  color: #fff;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 30px;
}
</style>