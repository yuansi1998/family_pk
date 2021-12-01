<template>
  <div id="dialog" v-if="dialogInfo.status">
    <div class="dialog-box">
      <div class="title">{{ dialogInfo.title }}</div>
      <div class="text" v-if="dialogInfo.contentText">
        {{ dialogInfo.contentText }}
      </div>
      <slot name="content-html"></slot>
      <div class="btn-list">
        <div class="cancel-btn btn" @click="closeDialog">{{ closeBtnText }}</div>
        <div class="submit-btn btn" @click="submitDialog" v-if="dialogInfo.showSubmitBtn">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    dialogInfo: {
      type: Object,
    },
  },
  computed: {
    closeBtnText() {
      if (this.dialogInfo.closeBtnText) {
        return this.dialogInfo.closeBtnText;
      }
      return "我知道了";
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    submitDialog() {
      this.$emit("submitDialog", false);
    },
  },
};
</script>

<style scoped lang="scss">
#dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .dialog-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 630px;
    border-radius: 20px;
    padding: 20px 20px 0;
    transform: translate(-50%, -50%);
    text-align: center;
    background: #ffffff;
  }
  .title {
    padding: 37px 0 40px;
    font-size: 34px;
    line-height: 34px;
    font-weight: bold;
    color: #333333;
  }
  .text {
    padding: 0 24px;
    font-size: 30px;
    color: #666666;
    line-height: 50px;
  }
  .btn-list {
    margin-top: 31px;
    border-top: 1px solid #d8d8d8;
    display: flex;
  }
  .btn {
    flex: 1;
    font-size: 34px;
    line-height: 36px;
    padding: 35px 0 37px;
  }
  .cancel-btn {
    color: #9c50fe;
  }
  .submit-btn {
    border-left: 1px solid #d8d8d8;
  }
}
</style>
<style lang="scss">
#dialog {
  .txt {
    font-size: 30px;
    color: #666666;
    line-height: 50px;
  }
  .img {
    display: inline-block;
    width: 137px;
    height: 137px;
    margin: 15px 20px 36px;
    border-radius: 50%;
    background: #eee5e5;
  }
}
</style>