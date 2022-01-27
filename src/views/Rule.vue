<template>
  <div id="rule">
    <div class="title">1、如何创建家族战？</div>
    <div class="text">
      <p>家族族长/长老可通过家族PK大厅页面入口创建家族战，家族战分为约战模式和强袭模式！</p>
      <p>约战模式：发起方可选择PK时间和时长以及PK战败惩罚，且需征得被PK方家族长同意后才可发起成功。</p>
      <p>强袭模式：只有家族族长/长老的贵族身份为天神时，可选择PK时间以及PK战败惩罚发起强袭PK，且无需征得被PK方家族长同意即可发起成功，强袭模式家族PK时长固定为30分钟。</p>
    </div>
    <div class="title">2、战败后有什么惩罚？</div>
    <div class="text">
      <p>败方惩罚由PK发起者发起时进行单项选择，可选择内容为：</p>
      <p>1、败方家族成员1天、2天、3天内禁止进入广场；</p>
      <p>2、根据PK结果扣除败方家族总活跃度值</p>
      <p> 计算公式：失败方扣除总活跃值=（获胜方PK伤害值*5-失败方PK伤害值*5）* 等级差值扣减比例，
        等级差= |（发起方家族等级 -接收方家族等级）| ，等级差范围为0-10级，超过10级按照10级计算，败方家族扣除的活跃值将会增加在获胜方家族的总活跃度上。</p>
      <div class="table">
        <div class="tr">
          <div class="th">家族等级差</div>
          <div class="th">差值扣减比例</div>
        </div>
        <div class="tr">
          <div class="td">0-3级</div>
          <div class="td">100%</div>
        </div>
        <div class="tr">
          <div class="td">4级</div>
          <div class="td">90%</div>
        </div>
        <div class="tr">
          <div class="td">5级</div>
          <div class="td">80%</div>
        </div>
        <div class="tr">
          <div class="td">6级</div>
          <div class="td">70%</div>
        </div>
        <div class="tr">
          <div class="td">7级</div>
          <div class="td">60%</div>
        </div>
        <div class="tr">
          <div class="td">8级</div>
          <div class="td">50%</div>
        </div>
        <div class="tr">
          <div class="td">9级</div>
          <div class="td">40%</div>
        </div>
        <div class="tr">
          <div class="td">>=10级</div>
          <div class="td">30%</div>
        </div>
      </div>
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
.table{
  text-align: center;
  .tr{
    display: flex;
    justify-content: center;
    align-items: center;
    .th,.td{
      width: 260px;
      height: 50px;
    }
    .th{
      height: 70px;
      border: 1px solid #997272;
      color: #fccfa2;
      font-weight: 700;
      font-size: 24px;
      line-height: 70px;
      &:first-of-type{
        border-top-left-radius: 10px;
        border-bottom: none;
      }
      &:last-of-type{
        border-top-right-radius: 10px;
        border-left: none;
        border-bottom: none;
      }
    }
    .td{
      border: 1px solid #997272;
      color: #fccfa2;
      font-size: 24px;
      line-height: 50px;
      &:first-of-type{
        border-left: 1px solid #997272;
        border-bottom: 1px solid #997272;
      }
      &:last-of-type{
        border: 1px solid #997272;
        border-left: none;
      }
    }
  }
}
</style>
