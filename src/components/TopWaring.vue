<template>
  <div id="top-waring" v-if="topDialog && topDialog.status">
    <div class="type-1" v-if="topDialog.type === '1'">
      <div class="text" v-html="topDialog.msg"></div>
      <div class="btn" @click="submitEvent">{{ topDialog.submitBtnText }}</div>
    </div>
    <div class="type-2 top-waring-style" v-if="topDialog.type === '2'">
      <div v-html="topDialog.contentEl"></div>
      <div class="btn-list">
        <div class="btn cancel-btn" @click="closeTopDialog">{{ topDialog.cancelBtnText }}</div>
        <div class="btn submit-btn" @click="submitEvent">{{ topDialog.submitBtnText }}</div>
      </div>
    </div>
    <div class="type-2 top-waring-style" v-if="topDialog.type === '3'">
      <div v-html="topDialog.contentEl"></div>
      <div class="btn-list">
        <div class="btn cancel-btn" @click="closeTopDialog">{{ topDialog.cancelBtnText }}</div>
        <div class="btn submit-btn" @click="submitEvent">{{ topDialog.submitBtnText }}</div>
      </div>
    </div>
    <div class="type-1" v-if="topDialog.type === '4'">
      <div class="text" style="font-size: 3.266667vw;" v-html="topDialog.msg"></div>
      <div class="btn" @click="submitEvent">{{ topDialog.submitBtnText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopWaring",
  props: {
    topDialog: {
      type: Object
    }
  },
  mounted() {
    console.log(this.topDialog.contentEl);
  },
  methods: {
    closeTopDialog() {
      this.$emit("closeTopDialog", false);
    },
    submitEvent() {
      this.$emit("submitEvent");
    }
  }
};
</script>

<style scoped lang="scss">
#top-waring {
  position: fixed;
  top: 14px;
  width: 690px;
  left: 50%;
  padding: 20px 30px;
  background: #ffffff;
  border-radius: 16px;
  z-index: 999;
  transform: translateX(-50%);
}
.type-1 {
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    margin-right: 30px;
    font-size: 26px;
    font-weight: 400;
    color: #333333;
    line-height: 38px;
  }
  .btn {
    width: 131px;
    height: 62px;
    line-height: 62px;
    font-weight: 500;
    font-size: 24px;
    text-align: center;
    color: #ffffff;
    background: linear-gradient(270deg, #be15e2 0%, #3d6ae1 100%);
    border-radius: 12px;
  }
}

.btn-list {
  display: flex;
  padding: 24px 35px 0;
  justify-content: space-between;
  .btn {
    width: 256px;
    line-height: 64px;
    border-radius: 12px;
    text-align: center;
    font-size: 26px;
    border: 1px solid #bababa;
    color: #c3c3c3;
  }
  .submit-btn {
    border-color: transparent;
    color: #fff;
    background: linear-gradient(270deg, #be15e2 0%, #3d6ae1 100%);
  }
}
</style>
<style lang="scss">
.top-waring-style {
  .text {
    font-size: 28px;
    line-height: 44px;
    color: #333333;
    span {
      font-size: 28px;
    }
  }
  .sub-text {
    padding-top: 10px;
    font-size: 24px;
    line-height: 40px;
    color: #333333;
    span {
      font-size: 28px;
    }
  }
  .strong {
    color: #a823e2;
  }
}
.strong {
  font-size: 26px;
  color: #a823e2;
}
</style>
