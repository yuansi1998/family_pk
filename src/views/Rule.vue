<template>
  <div id="rule">
    <div class="title">1、如何创建家族战？</div>
    <div class="text">
      <p>家族族长可通过家族PK大厅页面入口创建家族战，家族战分为约战模式和强袭模式！</p>
      <p>约战模式：发起方可选择PK时间和时长，且需征得对方家族长同意后才可发起成功。</p>
      <p>强袭模式：只要家族族长贵族身份为天神贵族时可发起强袭PK且无需征得对方家族族长同意即可发起家族PK，强袭模式家族PK时长固定为30分钟。</p>
    </div>
    <div class="title">2、战败后有什么惩罚？</div>
    <div class="text">
      <p>败方惩罚由申请方发起时进行单项选择，可选择内容为：</p>
      <p>目前约战模式支持：</p>
      <p>1、败方家族成员1天内禁止进入广场</p>
      <p>2、败方家族的对赌活跃值奖励奖励给对方</p>
    </div>
    <div class="title">3、什么是备战？</div>
    <div class="text">
      <p>
        备战就是双方在成员约战成功，或被强袭且未正式开始PK前，家族成员通过赠送【同心火炬】礼物获取火力值，火力值可在开战期间消耗，本场Pk结束后未消耗的火力值将清零。
      </p>
    </div>
    <div class="title">4、如何判定胜负？</div>
    <div class="text">
      <p>
        PK时间内，根据双方造成的伤害值判定，PK时间结束后伤害值高的一方获胜！
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rule"
};
</script>

<style scoped lang="scss">
#rule {
  padding: 30px;
  min-height: 100vh;
  background: #0a0000;
}
.title {
  font-size: 28px;
  line-height: 28px;
  padding-bottom: 14px;
  color: #fccfa2;
}
.text {
  padding-bottom: 20px;
}
.text p {
  text-indent: 2em;
  font-size: 24px;
  line-height: 42px;
  color: #997272;
}
</style>
