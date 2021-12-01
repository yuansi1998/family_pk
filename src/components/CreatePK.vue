<template>
  <div id="create-pk" v-if="createDialogState">
    <div class="pk-dialog">
      <img src="@/assets/image/title-img.png" alt="" class="title-img" />
      <ul class="tabs" v-if="isGodNoble">
        <li class="tab-list" :class="{'tab-left':liActiveClass == 0}"  @click="handleClick(0)">约战</li>
        <li class="tab-list" :class="{'tab-right':liActiveClass == 1}" @click="handleClick(1)">强袭</li>
      </ul>
      <img
        src="@/assets/image/close-icon.png"
        @click="closeCrateDialog"
        alt=""
        class="close-icon"
      />
      <div class="family-info">
        <input
          v-if="!familyInfo"
          type="text"
          v-model="familyId"
          placeholder="请输入对方家族ID"
          @blur="searchFamilyInfo"
          class="family-input"
        />
        <div class="info" v-else>
          <img :src="familyInfo.avatarUrl" alt="" class="avatar" />
          <div class="info-list">
            <div class="name">{{ familyInfo.name }}</div>
            <div class="id-name">ID: {{ familyInfo.id }}</div>
          </div>
          <img
            @click="clearFamilyInfo"
            src="@/assets/image/close-icon2.png"
            alt=""
            class="close-info"
          />
        </div>
      </div>
      <div class="error-tip" v-if="searchFamilyErrorText">
        {{ searchFamilyErrorText }}
      </div>
      <div class="pk-length">
        <span class="pk-length-title">PK时长</span>
        <select class="pk-time-length" v-model="duration" @click="handleTime(0)">
          <option :value="pkTime.id" v-for="pkTime in pkTimes">{{pkTime.text}}</option>
        </select>
      </div>
      <div class="pk-start-time">
        <span class="pk-start-title">PK开始时间</span>
        <div class="select-box">
          <select class="pk-start pk-start1" v-model="timeType" @change="handleTime(1)">
            <option :value="type.id" v-for=" type in timeTypes">{{type.text}}</option>
          </select>
          <select class="pk-start" v-model="time" @change="handleTime(2)">
            <option :value="beginTime.id" v-for=" beginTime in beginTimes">{{beginTime.text}}</option>
          </select>
        </div>
      </div>
      <div class="title">请选择PK惩罚</div>
      <div class="checkbox-list">
        <div class="list">
          <input
            type="radio"
            name="enter"
            value="enter_group"
            v-model="checkedNames"
          />
          <i></i>
          对赌败方禁止进入广场

          <span class="score" @click="openDayDialog">
            {{ dayList[dayIndex] }}
            <div class="family-score" v-show="dayState">
              <div class="sub-title">请选择数量</div>
              <div
                  class="list"
                  @click="checkDayLength(index)"
                  v-for="(item, index) in dayList"
                  :key="index"
              >
                {{ item }}
              </div>
            </div>
          </span>

        </div>
        <div class="list">
          <input
            type="radio"
            name="enter"
            value="family_score"
            v-model="checkedNames"
          />
          <i></i>
          对赌
          <span class="score" @click="openScoreDialog">
            {{ familyScoreList[scoreIndex] }}
            <div class="family-score" v-show="scoreState">
              <div class="sub-title">请选择数量</div>
              <div
                class="list"
                @click="checkFamilyScore(index)"
                v-for="(item, index) in familyScoreList"
                :key="index"
              >
                {{ item }}
              </div><br>
            </div>
          </span>
          家族活跃值
        </div>
      </div>
      <div class="create-btn" @click="cratePk">
        约战<span>(消耗1000钻石)</span>
      </div>
      <div class="text">
        说明：<br>
        1、发起约战模式后，对方家族接受后则双方家族进入备战状态<br>
        2、家族长当前贵族身份为天神贵族时每周可发起强袭PK一次，固定PK时间30分钟，发起后即刻进入备战状态无需征得对方家族同意<br>
        3、约战模式PK开始前10分钟：发起方可申请取消约战，只退还一半的约战申请费；对方家族解散，则只退回一半约战申请费；对方家族拒绝， 全额退还申请费用<br>
        4、强袭模式PK开始前10分钟：发起方可申请取消强袭，取消只退还一半的约战申请费，且强袭次数算已使用，对方家族解散，只退还一半的约战申请费，且强袭次数算已使用；<br>
        5、发起PK时间距离正式PK时间需>=30分钟<br>
        6、PK发起成功处于备战中状态时，双方家族成员都可在家族内通过赠送“同心火炬”礼物获得火力值点数，在正式PK中通过消耗火力值兑换道具造成伤害，PK时间结束伤害值高的一方获胜<br>

      </div>
    </div>
    <Dialog
      :dialog-info="dialogInfo"
      @closeDialog="closeDialog"
    >
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
import http from "@/utils/http";

export default {
  name: "CreatePK",
  components: { Dialog },
  props: {
    createDialogState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      familyScoreList: [10000, 20000, 50000, 100000],
      dayList:['1天','2天','3天'],
      dialogInfo: {
        status: false,
        title: "",
      },
      familyId: null,
      scoreState: false,
      dayState:false,
      scoreIndex: 0,
      dayIndex:0,
      familyInfo: null,
      searchFamilyErrorText: "",
      checkedNames: "enter_group",
      pkType: 0,
      pkTimes:[
        {"id":15,"text":"15分钟"},
        {"id":30,"text":"30分钟"},
        {"id":45,"text":"45分钟"}
      ],
      duration: 15,
      isGodNoble: false,
      timeType:0,
      time:10,
      timeTypes:[
        {"id":0,"text":"今天"},
        {"id":1,"text":"明天"}
      ],
      beginTimes:[
        {"id":10,"text":"10:00"},{"id":11,"text":"11:00"},{"id":12,"text":"12:00"},{"id":13,"text":"13:00"},
        {"id":14,"text":"14:00"},{"id":15,"text":"15:00"},{"id":16,"text":"16:00"},{"id":17,"text":"17:00"},
        {"id":18,"text":"18:00"},{"id":19,"text":"19:00"},{"id":20,"text":"20:00"},{"id":21,"text":"21:00"},
        {"id":22,"text":"22:00"},{"id":23,"text":"23:00"}
      ],
      beginAt: new Date(),
      liActiveClass: 0,
      isElder: 0
    };
  },
  computed: {
    groupPunishDay() {
      return this.checkedNames === "enter_group" ? 1 : 0;
    },
    punishDayLength() {
      const isDayLength = "enter_group" === this.checkedNames;
      if (isDayLength) {
        return this.dayList[this.dayIndex];
      }
      return 0;
    },
    punishScoreAmount() {
      const isFamilyScore = "family_score" === this.checkedNames;
      if (isFamilyScore) {
        return this.familyScoreList[this.scoreIndex];
      }
      return 0;
    },
  },
  created() {
    this.initDate(this.timeType)
    this.handleTime(1)
    if (parseInt(window.USER_NOBLE) === 8) {
      this.isGodNoble = true;
    }
  },
  methods: {
    closeCrateDialog() {
      this.$emit("closeDialog", false);
    },
    closeDialog(state) {
      this.dialogInfo.status = state;
      if (this.dialogInfo.callBack) {
        this.dialogInfo.callBack();
      }
    },
    checkFamilyScore(num) {
      this.scoreIndex = num;
      this.scoreState = true;
    },
    checkDayLength(num){
      this.dayIndex = num;
      this.dayState = true;
    },
    openDayDialog(){
      this.dayState = !this.dayState;
    },
    openScoreDialog() {
      this.scoreState = !this.scoreState;
    },
    clearFamilyInfo() {
      this.familyInfo = null;
      this.familyId = null;
    },
    searchFamilyInfo() {
      if (!this.familyId) {
        this.searchFamilyErrorText = "请输入家族ID";
        return;
      }
      http.post("/family_fights/search_family", {
          id: this.familyId,
        })
        .then(res => {
          if (res.error_code === 0) {
            this.familyInfo = {
              avatarUrl: res.avatar,
              name: res.name,
              id: res.id,
            };
            this.searchFamilyErrorText = "";
            if(res.is_elder){
              this.isElder = 1;
            }
            return;
          }
          this.searchFamilyErrorText = res.error_reason;
        });
    },
    cratePk() {
      if (!this.familyId) {
        this.searchFamilyErrorText = "请输入家族ID";
        return;
      }
      http.post("/family_fights/create", {
          "family_id": this.familyId,
          "group_punish_day": this.groupPunishDay,
          "punish_score_amount": this.punishScoreAmount,
          "punish_day_length": this.punishDayLength,
          'duration':this.duration,
          'pk_type':this.pkType,
          'begin_time':this.beginAt
        }).then(res => {
          if (res.error_code === 0) {
            var title = this.isElder == 0? '约战申请成功':'约战成功';
            this.dialogInfo = {
              status: true,
              title: title,
              contentText: res.error_reason,
              callBack: () => {
                this.$emit("closeDialog", false);
              },
            };
            return;
          }
          this.dialogInfo = {
            status: true,
            title: "申请失败",
            contentText: res.error_reason,
          };
        });
    },
    handleClick(index) {
      this.pkType = index;
      if(parseInt(index) === 1){
        this.duration = 30;
        this.liActiveClass = 1;
        this.pkTimes = [{"id":30,"text":"30分钟"}];
      } else if(parseInt(index) === 0){
        this.liActiveClass = 0;
        this.duration = 15;
        this.pkTimes = [
          {"id":15,"text":"15分钟"},
          {"id":30,"text":"30分钟"},
          {"id":45,"text":"45分钟"}
        ];
      }
    },
    handleTime(index){
      if(index == 1){
        this.initDate(this.timeType)
      }
      if(parseInt(this.timeType) === 0){
        var time = this.time < 10?"0"+this.time:this.time;
        this.beginAt = this.dealTime(6)+ ' ' + time + ":00:00";
      }
      if(parseInt(this.timeType) === 1){
        var time = this.time < 10?"0"+this.time:this.time;
        this.beginAt = this.dealTime(9) + ' ' + time + ":00:00";
      }
    },
    dealTime(v){
      let b = 24*60*60*1000   //一天的时间
      let day = new Date();  //当天的时间
      v == 3 ? day.setTime(day.getTime()-b) : v == 6 ?
      day.setTime(day.getTime()) : day.setTime(day.getTime() + b);
      let dayMon=(day.getMonth() + 1) >= 10 ? day.getMonth()+1 : '0' + (day.getMonth() + 1)
      let dayDat=(day.getDate() + 1) >= 10 ? day.getDate() : '0' + (day.getDate())
      let s = day.getFullYear() + "-" + dayMon + "-" + dayDat;
      return s;
    },
    initDate(type)
    {
      this.beginTimes=[];
      if(type==0){
        var date = new Date();
        var hour = date.getHours();
        this.time = hour +1;
        if(hour >= 10){
          for(var i=hour; i<23; i++){
            this.beginTimes.push({"id":(i+1),"text": (i+1)+':00'});
          }
        } else {
          this.time = 10;
          for(var i=10; i<=23; i++){
            this.beginTimes.push({"id":i,"text": i+':00'});
          }
        }
      } else if(type==1){
        this.time = 10;
        for(var i=10; i<=23; i++){
          this.beginTimes.push({"id":i,"text": i+':00'});
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
#create-pk {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  overflow-y: scroll;
}
.pk-dialog {
  position: absolute;
  top: 10%;
  left: 50%;
  width: 685px;
  padding-bottom: 65px;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 30px;
  .title-img {
    height: 71px;
    margin: 0 auto;
  }
  .tabs{
    width: 240px;
    height: 60px;
    border-radius: 30px;
    border: 1px solid #E6B2F7;
    margin: 17px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-list{
      color: #D860FF;
      font-size: 30px;
      width: 124px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .tab-left{
      color: #ffffff;
      background-image: url("../assets/image/tab-left.png");
    }
    .tab-right{
      color: #ffffff;
      background-image: url("../assets/image/tab-right.png");
    }
  }
  .close-icon {
    position: absolute;
    top: 27px;
    right: 35px;
    width: 56px;
    z-index: 2;
  }
}
.family-info {
  margin: 43px auto 0;
  width: 558px;
  border-radius: 45px;
  background: rgba(245, 246, 249, 1);
  .family-input {
    width: 100%;
    line-height: 90px;
    font-size: 32px;
    padding: 0 39px;
    border-radius: 45px;
    border: none;
    color: rgba(153, 153, 153, 1);
    background: rgba(245, 246, 249, 1);
  }
  .info {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    .avatar {
      width: 69px;
      height: 69px;
      border-radius: 50%;
    }
    .info-list {
      padding-left: 20px;
      flex: 1;
      .name {
        font-size: 28px;
        line-height: 30px;
        color: #333333;
      }
      .id-name {
        padding-top: 10px;
        font-size: 24px;
        line-height: 26px;
        color: #999999;
      }
    }
    .close-info {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }
}
.error-tip {
  padding-top: 20px;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 110, 110, 1);
}
.title {
  padding-top: 47px;
  font-size: 30px;
  margin-left: 93px;
  color: #333333;
  line-height: 30px;
}
.pk-length{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 33px 93px 0;
  .pk-length-title{
    font-size: 30px;
    color: #333333;
  }
  .pk-time-length{
    width: 130px;
    height: 48px;
    background: #FFFFFF;
    border-radius: 24px;
    font-size: 28px;
    color: #333333;
    border: 1px solid #D9D9D9;
  }
}
.pk-start-time{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 33px 93px 0;
  .pk-start-title{
    font-size: 30px;
    color: #333333;
  }
  .select-box{
    display: flex;
    justify-content: center;
    align-content: center;
    .pk-start{
      width: 130px;
      height: 48px;
      background: #FFFFFF;
      border-radius: 24px;
      font-size: 28px;
      color: #333333;
      border: 1px solid #D9D9D9;
      text-align: center;
    }
    .pk-start1{
      margin-right: 10px;
    }
  }
}
.checkbox-list {
  padding-top: 43px;
  padding-left: 93px;
  .list {
    //display: inline-block;
    position: relative;
    font-size: 28px;
    font-weight: 400;
    color: #666666;
    line-height: 28px;
    padding-bottom: 26px;
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 26px;
      opacity: 0;
      z-index: 22;
      &:checked + i {
        background: url("../assets/image/check-icon.png") no-repeat 50% 50%;
        background-size: 100% 100%;
      }
    }
    i {
      margin-right: 10px;
      display: inline-block;
      width: 26px;
      height: 26px;
      background: url("../assets/image/no-check-icon.png") no-repeat 50% 50%;
      background-size: 100% 100%;
    }
    .score {
      position: relative;
      display: inline-block;
      width: 160px;
      line-height: 40px;
      border: 1px solid #b6b6b6;
      font-size: 32px;
      border-radius: 8px;
      text-align: center;
      color: #333333;
    }
  }
}
.family-score {
  position: absolute;
  top: 53px;
  left: 0;
  width: 100%;
  padding: 0 15px;
  border-radius: 9px;
  background: #333657;
  z-index: 999;
  .sub-title {
    border-bottom: 1px solid #1d1f43;
  }
  .sub-title,
  .list {
    padding: 30px 0;
    font-size: 24px;
    line-height: 24px;
    color: #ffffff;
  }
}
.create-btn {
  width: 558px;
  text-align: center;
  border-radius: 45px;
  margin: 0 auto;
  font-size: 30px;
  padding: 12px 0;
  color: #fff;
  background: linear-gradient(90deg, #6d8afc 0%, #a722ff 100%);
  span {
    display: block;
    font-size: 24px;
    padding-top: 4px;
    line-height: 24px;
    color: #fff;
  }
}
.text {
  padding: 28px 60px 0;
  font-size: 24px;
  color: #929292;
  line-height: 41px;
}
</style>
