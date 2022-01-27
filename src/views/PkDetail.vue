<template>
  <div id="family-pk" v-if="familyPkInfo">
    <div class="pk-progress">
      <div class="progress" :style="{ width: pkProgressScore + '%'}">
        <img src="@/assets/image/grogress-icon.png" alt="" class="icon" />
      </div>
      <div class="left">{{ familyPkInfo.sender_text }} {{ familyPkInfo.sender_pk_score }}</div>
      <div class="right">{{ familyPkInfo.receiver_text }} {{ familyPkInfo.receiver_pk_score }}</div>
    </div>
    <div class="count-down" v-if="countdownText">
      <span v-if="!familyPkInfo.my_pk_status">开启倒计时：{{ countdownText }}</span>
      <span v-if="familyPkInfo.my_pk_status">pk结束倒计时：{{ countdownText }}</span>
    </div>
    <div class="pk-info clearfix">
      <div class="user-family">
        <div id="sender-svga"></div>
        <img
          v-if="familyPkInfo.sender_family.pkResult === 1"
          src="@/assets/image/success-icon.png"
          alt=""
          class="icon"
        />
        <img
          v-if="familyPkInfo.sender_family.pkResult === 2"
          src="@/assets/image/fail-icon.png"
          alt=""
          class="icon"
        />
        <img :src="familyPkInfo.sender_family.avatar_url" alt="" class="avatar" />
        <div class="name">{{ familyPkInfo.sender_family.name }}</div>
      </div>
      <img src="@/assets/image/pk-icon.png" alt="" class="pk-icon" />
      <img v-if="isEqual" src="@/assets/image/equal.png" alt="" class="equal-icon">
      <div class="other-family">
        <div id="receiver-svga"></div>
        <img
          v-if="familyPkInfo.receiver_family.pkResult === 1"
          src="@/assets/image/success-icon.png"
          alt=""
          class="icon"
        />
        <img
          v-if="familyPkInfo.receiver_family.pkResult === 2"
          src="@/assets/image/fail-icon.png"
          alt=""
          class="icon"
        />
        <img
          :src="familyPkInfo.receiver_family.avatar_url"
          alt=""
          class="avatar"
        />
        <div class="name">{{ familyPkInfo.receiver_family.name }}</div>
      </div>
    </div>
    <div v-if="!familyPkInfo.is_show_treasure">
      <div class="top-users">
        <div class="user-list left" v-if="familyPkInfo.sender_top_ranks">
          <div class="list" v-for="(user, index) in familyPkInfo.sender_top_ranks" :key="user.id">

            <img src="@/assets/image/crown-icon.png" alt="" v-if="index == 0 && familyPkInfo.sender_family.pkResult === 2" class="crown-icon">
            <img src="@/assets/image/border-avatar.png" alt="" v-if="index == 0 && familyPkInfo.sender_family.pkResult === 1" class="border-avatar">

            <div class="rank" v-if="index != 0">{{ index + 1 }}</div>
            <img :src="user.avatar_url" alt="" class="avatar" />
            <div class="score">{{ user.total_amount_text }}</div>
          </div>
        </div>
        <div class="user-list right" v-if="familyPkInfo.receiver_top_ranks">
          <div class="list" v-for="(user, index) in familyPkInfo.receiver_top_ranks" :key="user.id">

            <img src="@/assets/image/crown-icon.png" alt="" v-if="index == 0 && familyPkInfo.receiver_family.pkResult === 2" class="crown-icon">
            <img src="@/assets/image/border-avatar.png" alt="" v-if="index == 0 && familyPkInfo.receiver_family.pkResult === 1" class="border-avatar">

            <div class="rank" v-if="index != 0">{{ index + 1 }}</div>
            <img :src="user.avatar_url" alt="" class="avatar" />
            <div class="score">{{ user.total_amount_text }}</div>
          </div>
        </div>
      </div>
      <div class="props-info" v-if="familyPkInfo.is_family_member">
        <div
          class="list"
          v-for="(prop, index) in familyPkInfo.props"
          :key="index"
          @click="createPkHistory(prop.id, index)"
        >
          <div class="prop">
            <div class="tip">伤害+{{ prop.score }}</div>
            <img :src="prop.icon" alt="" class="icon" />
            <div :class="['animation-icon', prop.animation, isTopRank ? 'top-rank-padding': '']">
              <img :src="prop.icon" alt="" />
            </div>
          </div>
<!--          <div class="name">{{ prop.name }}</div>-->
          <div class="score">{{ prop.amount }}火力值</div>
        </div>
      </div>
      <div class="my-score" v-if="familyPkInfo.is_family_member">
        <img src="@/assets/image/score-icon.png" alt="" class="icon" />
        我的火力值：<span class="score">{{ familyPkInfo.my_pk_score }}点</span>
      </div>
    </div>
<!--    <div class="open-prize" v-if="familyPkInfo.is_show_treasure">-->
<!--      <div class="open-after" v-if="familyPkInfo.is_open_treasure">-->
<!--        <div class="diamond-amount"><span>{{ familyPkInfo.prize_diamond_amount }}</span>钻石</div>-->
<!--        <img src="@/assets/image/open-after.png" alt="" class="img" />-->
<!--      </div>-->
<!--      <img v-else src="@/assets/image/open-img.png" @click="openPrizeTreasure" alt="" class="img" />-->
<!--    </div>-->
    <div class="waring-tip">
      <p class="waring-font" v-if="familyPkInfo.status == 2 && familyPkInfo.punish_type == 0 ">根据当前PK值预估败方家族扣减：{{ familyPkInfo.reduce_active_score }}活跃度</p>
      <p class="waring-font" v-if="familyPkInfo.status != 3">PK惩罚：{{ familyPkInfo.punish_text }}</p>
      <p class="waring-font" v-if="familyPkInfo.status == 3 && familyPkInfo.punish_type == 0 && familyPkInfo.receiver_pk_score != familyPkInfo.sender_pk_score">根据本场PK值败方家族将扣减：{{ familyPkInfo.reduce_active_score }}活跃度</p>
      <p class="waring-font" v-if="familyPkInfo.status == 3 && familyPkInfo.punish_type == 0 && familyPkInfo.receiver_pk_score == familyPkInfo.sender_pk_score">本场PK结果为平局，双方都无活跃度扣</p>
      <p class="waring-font" v-if="familyPkInfo.status == 3 && familyPkInfo.punish_type == 0 ">（PK惩罚：根据PK结果扣减败方家族总活跃度）</p>
      <p class="waring-font" v-if="familyPkInfo.status == 3 && familyPkInfo.punish_type == 1 ">PK惩罚：{{ familyPkInfo.punish_text }}</p>
    </div>
    <div class="data-list">
      <div class="no-data" v-if="!fightHistories">
        <img src="@/assets/image/no-data.png" alt="" class="icon" />
        <div class="text">暂无伤害数据信息</div>
      </div>
      <div class="data-content" v-else>
        <div class="list" v-for="history in fightHistories" :key="history.id">
          <img
            v-if="history.from_family === 'sender'"
            src="@/assets/image/send-icon.png"
            alt=""
            class="icon"
          />
          <img
            v-else src="@/assets/image/receiver-icon.png"
            alt=""
            class="icon"
          />
          <div class="name">{{ history.user.name }}</div>
          <div class="text">扔出 {{ history.num }}个{{ history.name }}，造成 {{ history.total_amount }} 点伤害</div>
        </div>
      </div>
    </div>
    <div class="rule">
      <div class="title">家族PK规则说明：</div>
      <div class="text">
        1、PK时间内通过消耗火力值兑换置顶道具扔出增加伤害值<br />
        2、火力值获取：赠送 [同心火炬] 可获得 1点火力值 <br />
        3、PK方式：消耗火力值兑换指定道具扔出，可造成伤害<br />
        4、获胜方式：PK结束后，血条值高的一方获胜<br />
      </div>
    </div>
    <div
      class="cancel-btn"
      v-if="familyPkInfo.can_cancel_pk"
      @click="cancelFamilyPk"
    >{{cancelText}}</div>
    <div class="open-treasure-dialog" v-if="openDialogStatus">
      <div class="dialog-box">
        <div class="title">恭喜您获得<span>{{ prizeDialogAmount }}</span>钻石</div>
        <img src="@/assets/image/open-after-img.png" alt="" class="img" />
        <div class="btn" @click="popupVisible(false)">开心收下</div>
      </div>
    </div>
    <Dialog
      :dialog-info="dialogInfo"
      @closeDialog="closeDialog"
      @submitDialog="submitDialog"
    >
      <template v-slot:content-html>
        <div class="txt">{{ dialogInfo.tip }}</div>
        <img
          v-for="(url, index) in dialogInfo.iconUrls"
          :src="url"
          :key="index"
          alt=""
          class="img"
        />
        <div class="txt">{{ dialogInfo.content }}</div>
      </template>
    </Dialog>
    <Tips ref="tips"></Tips>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
import SVGA from "svgaplayerweb";
import { useCountdown } from "../utils/utils";
import http from "../utils/http";


export default {
  name: "PkDetail",
  data() {
    return {
      familyPkInfo: null,
      dialogInfo: {
        status: false,
        title: ""
      },
      fightHistories: [],
      loop: null,
      receiverPlayer: null,
      senderPlayer: null,
      openDialogStatus: false,
      prizeDialogAmount: 0,
      parser: null,
      countdownText: "",
      cancelText: "取消约战",
      pkType: 0,
      sid: window.USER_SID,
    }
  },
  components: {
    Dialog
  },
  computed: {
    pkProgressScore() {
      const familyPkInfo = this.familyPkInfo;
      const senderPkScore = familyPkInfo.sender_pk_score;
      const receiverPkScore = familyPkInfo.receiver_pk_score;
      if (familyPkInfo && (senderPkScore > 0 || receiverPkScore > 0)) {
        const total = senderPkScore + receiverPkScore;
        return Math.floor(senderPkScore / total * 100);
      }
      return 50;
    },
    isTopRank() {
      if (
        this.familyPkInfo.receiver_top_ranks ||
        this.familyPkInfo.sender_top_ranks
      ) { return true; }
      return false;
    },
    isEqual() {
      if (this.familyPkInfo.status === 3) {
        if (this.familyPkInfo.sender_pk_score === this.familyPkInfo.receiver_pk_score) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.getFamilyPkDetail(true);
    this.getFightHistories();
    this.familyDataLoop();
  },
  methods: {
    closeDialog(state) {
      this.dialogInfo.status = state;
    },
    submitDialog() {
      this.dialogInfo.status = false;
      if (this.dialogInfo.submitCallback) {
        this.dialogInfo.submitCallback();
      }
    },
    getFamilyPkDetail(isInit = false) {
      const id = this.$route.query.id;
      http.get("/family_fights/fight_detail", {params: {id}}).then((res) => {
        if (res.error_code !== 0) {
          return;
        }
        if (res.start_surplus_time > 0 && isInit) {
          useCountdown().start(res.start_surplus_time, this.countdownCallback);
        }
        if (res.data) {
          const familyPkInfo = res.data;
          const receiverPkScore = familyPkInfo.receiver_pk_score;
          const senderPkScore = familyPkInfo.sender_pk_score;
          familyPkInfo.receiver_family.pkResult = 0;
          familyPkInfo.sender_family.pkResult = 0;
          if (familyPkInfo.status === 3) {
            const receiverPkResult = receiverPkScore >= senderPkScore ? receiverPkScore === senderPkScore ? 3 : 1 : 2;
            familyPkInfo.receiver_family.pkResult = receiverPkResult;
            const senderPkResult = senderPkScore >= receiverPkScore ? senderPkScore === receiverPkScore ? 3 : 1 : 2;
            familyPkInfo.sender_family.pkResult = senderPkResult;
          }
          if (isInit) {
            const props = [];
            for (const index in familyPkInfo.props) {
              const prop = familyPkInfo.props[index];
              prop.icon = require(`@/assets/image/prop-${prop.id}.png`);
              props.push(prop);
            }
            familyPkInfo.props = props;
          }
          if (!isInit && this.familyPkInfo.props) {
            familyPkInfo.props = this.familyPkInfo.props;
          }
          if(res.pk_type==1){
            this.pkType = 1;
            this.cancelText = '取消强袭';
          }
          this.familyPkInfo = familyPkInfo;
        }
      });
    },
    countdownCallback(text) {
      if (!text) {
        return;
      }
      if(text == '00'){
        text = 0;
      }
      this.countdownText = text;
    },
    calcPropClassName(id, index) {
      const prop = this.familyPkInfo.props[index];
      let fromType = "sender";
      const userFamilyId = this.familyPkInfo.user_family_id;
      if (userFamilyId == this.familyPkInfo.sender_family.id) {
        fromType = "receiver";
      }
      prop.animation = `${fromType}-animation`;
      this.$nextTick(() => {
        this.familyPkInfo.props.splice(index, 1, prop);
      });
      setTimeout(() => {
        if (!this.senderPlayer) {
          this.senderPlayer = new SVGA.Player("#sender-svga");
          this.receiverPlayer = new SVGA.Player("#receiver-svga");
          this.parser = new SVGA.Parser();
        }
        const player =
          fromType === "sender" ? this.senderPlayer : this.receiverPlayer;
        this.parser.load(prop.svga, videoItem=> {
          player.loops = 1;
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
        setTimeout(() => {
          prop.animation = "";
          this.$nextTick(() => {
            this.familyPkInfo.props.splice(index, 1, prop);
          });
        }, 70);
      }, 600);

    },
    createPkHistory(propId, index) {
      const id = this.$route.query.id;
      http
        .post("/family_fights/fight", {
          "family_pk_id": id,
          "prop_id": propId,
          num: 1
        })
        .then(res=> {
          if (res.error_code !== 0) {
            const popup = res.popup;
            if (popup) {
              this.dialogInfo = {
                status: true,
                title: popup.title,
                contentText: "",
                tip: popup.tip,
                iconUrls: popup.icon_urls,
                content: popup.content
              };
              return;
            }
            this.$refs.tips.showTips(res.error_reason);
            return;
          }
          if (res.history) {
            this.calcPropClassName(propId, index);
            this.fightHistories.unshift(res.history);
            const familyKey = res.history.from_family;
            this.familyPkInfo[`${familyKey}_pk_score`] += res.history.total_amount;
            this.familyPkInfo['reduce_active_score'] = res.history.reduce_active_score;
            this.familyPkInfo['status'] = res.history.status;
            this.familyPkInfo['receiver_pk_score'] = res.history.receiver_pk_score;
            this.familyPkInfo['sender_pk_score'] = res.history.sender_pk_score;
            this.familyPkInfo['punish_type'] = res.history.punish_type;
          }
        });
    },
    getFightHistories() {
      const id = this.$route.query.id;
      http
        .get("/family_fights/fight_histories", {
          params: {
            "family_pk_id": id
          }
        })
        .then(res => {
          if (res.histories && res.histories.length > 0) {
            this.fightHistories = res.histories;
          }
        });
    },
    cancelFamilyPk() {
      var pkTypeText =  this.pkType == 1?'取消强袭':'取消约战';
      this.dialogInfo = {
        status: true,
        title: pkTypeText,
        contentText: "是否确认取消家族战，取消后退还一半申请费用",
        closeBtnText: "在想想",
        showSubmitBtn: true,
        submitCallback: () => {
          http
            .get("/family_fights/response", {
              params: {
                "family_pk_id": this.familyPkInfo.id,
                "type": "cancel"
              }
            })
            .then(res => {
              const sid = this.sid;
              if(res.error_code == 0){
                this.$router.push({ path: `/`, query: { sid } });
              }
              this.$refs.tips.showTips(res.error_reason);
            });
        }
      };
    },
    popupVisible(status) {
      if (status) {
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
      } else {
        document.body.style.position = "static";
        document.body.style.height = "auto";
      }
      this.openDialogStatus = status;
    },
    // openPrizeTreasure() {
    //   http
    //     .get("/family_fights/open_treasure", {
    //       params: {
    //         "family_pk_id": this.familyPkInfo.id
    //       }
    //     })
    //     .then(res => {
    //       if (res.error_code === 0) {
    //         this.prizeDialogAmount = res.amount;
    //         this.popupVisible(true);
    //         return;
    //       }
    //       this.$refs.tips.showTips(res.error_reason);
    //     });
    // },
    familyDataLoop() {
      this.loop = setInterval(() => {
        this.getFamilyPkDetail();
        this.getFightHistories();
      }, 5000);
    }
  },
  beforeUnmount() {
    clearInterval(this.loop);
  }
};
</script>

<style scoped lang="scss">
.open-after {
  position: relative;
  .diamond-amount {
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 30px;
    line-height: 78px;
    color: #fff;
    span {
      display: inline-block;
      padding-right: 10px;
      font-size: 70px;
      color: #fcea3e;
    }
  }
}
.open-treasure-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
  text-align: center;
  .title {
    font-size: 40px;
    line-height: 71px;
    color: #ffffff;
    span {
      display: inline-block;
      padding: 0 10px;
      font-size: 71px;
      color: #fcea3e;
    }
  }
  .img {
    width: 650px;
    margin: 0 auto;
  }
  .btn {
    width: 527px;
    line-height: 94px;
    margin: -40px auto 0;
    border-radius: 300px;
    font-size: 34px;
    font-weight: bold;
    color: #5d1111;
    background: linear-gradient(180deg, #ffe754 0%, #ff8b00 100%);
    box-shadow: 0 4px 3px 1px #ff4d00;
  }
}
#family-pk {
  padding-top: 30px;
  padding-bottom: 83px;
  min-height: 100vh;
  background: url(../assets/image/pk-bg.png) no-repeat 50% 50% fixed;
  background-size: 100% 100%;
}
.pk-progress {
  position: relative;
  width: 690px;
  height: 36px;
  margin: 0 auto;
  padding: 0 30px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #eaf9ff 0%, #87dbfd 16%, #26a8ff 100%);
  box-shadow: inset 0 0 12px 0 #ffffff;
  .left,
  .right {
    position: relative;
    font-size: 24px;
    line-height: 36px;
    font-weight: bold;
    z-index: 22;
    color: #fff;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    transition: width 0.4s;
    background: linear-gradient(180deg, #ffceea 0%, #f770be 30%, #eb3d89 100%);
    .icon {
      position: absolute;
      right: -12px;
      top: 0;
      width: 24px;
      height: 36px;
    }
  }
}
.count-down {
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
  width: 315px;
  line-height: 46px;
  text-align: center;
  font-size: 22px;
  margin: 0 auto;
  color: #fff;
  background: url("../assets/image/count-down-bg.png") no-repeat 50% 50%;
  background-size: contain;
  span{
    line-height: 46px;
    text-align: center;
    font-size: 22px;
    color: #fff;
  }
}
.pk-info {
  position: relative;
  padding: 72px 40px 0;
  overflow: hidden;
  .user-family,
  .other-family {
    position: relative;
    width: 320px;
    height: 320px;
    padding: 14px;
    &::after {
      display: block;
      content: "";
      position: absolute;
      bottom: 14px;
      left: 14px;
      right: 14px;
      height: 145px;
      border-bottom-right-radius: 60px;
      border-bottom-left-radius: 60px;
      z-index: 1;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      opacity: 0.5;
    }
    .icon {
      width: 118px;
      height: 78px;
      position: absolute;
      left: -14px;
      top: -18px;
      z-index: 22;
      object-fit: contain;
    }
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 60px;
    }
  }
  .user-family {
    float: left;
    background: url("../assets/image/user-border.png") no-repeat 50% 50%;
    background-size: 100% 100%;
  }
  .other-family {
    float: right;
    background: url("../assets/image/other-border.png") no-repeat 50% 50%;
    background-size: 100% 100%;
    .icon {
      left: auto;
      right: -30px;
      top: -24px;
    }
  }
  .pk-icon {
    width: 155px;
    position: absolute;
    top: 57%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 22;
  }
  .name {
    position: absolute;
    left: 0;
    padding: 0 20px;
    width: 100%;
    bottom: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 28px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
    z-index: 2;
    color: #ffffff;
  }
}
#sender-svga,
#receiver-svga{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99;
}
.props-info {
  display: flex;
  padding: 45px 15px 30px;
  justify-content: center;
  .list {
    width: 25%;
  }
  .prop {
    position: relative;
    width: 116px;
    height: 116px;
    margin: 0 auto;
    border-radius: 50%;
    background: linear-gradient(180deg, #3e0606 0%, #250303 100%);
    border: 1px solid #b12f2f;
    .icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .tip {
      position: absolute;
      top: -10px;
      left: -10px;
      font-size: 24px;
      line-height: 24px;
      white-space: nowrap;
      padding: 6px 10px;
      border-radius: 14px;
      transform: scale(0.8);
      transform-origin: 0 0;
      color: #ffffff;
      background: #cf3030;
      z-index: 3;
    }
  }
  .name {
    padding: 12px 0;
    font-size: 26px;
    line-height: 26px;
    text-align: center;
    color: #ffd2a4;
  }
  .score {
    padding-top: 20px;
    text-align: center;
    font-size: 24px;
    line-height: 24px;
    transform: scale(0.8);
    transform-origin: 50% 0;
    color: #997272;
  }
}
.my-score {
  padding: 0 38px;
  display: flex;
  font-size: 24px;
  line-height: 34px;
  color: #997272;
  .icon {
    margin-right: 8px;
    width: 28px;
    height: 34px;
  }
  .score {
    font-size: 24px;
    line-height: 34px;
    color: #ffd2a4;
  }
}
.waring-tip {
  width: 689px;
  padding: 20px;
  margin: 27px auto 38px;
  background: url(../assets/image/waring-bg.png) no-repeat 50% 50%;
  background-size: 100% 100%;

  .waring-font{
    font-size: 28px;
    font-weight: bold;
    color: #5d1111;
    text-align: center;
  }
}
.data-list {
  width: 690px;
  height: 250px;
  margin: 0 auto;
  padding: 26px 45px;
  background: linear-gradient(180deg, #3e0606 0%, #250303 100%);
  border-radius: 16px;
  border: 1px solid #b12f2f;
}
.data-content {
  width: 100%;
  height: 100%;
  overflow: scroll;
  .list {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    font-size: 0;
    .icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .name {
      margin-right: 10px;
      white-space: nowrap;
      overflow: hidden;
      max-width: 160px;
      text-overflow: ellipsis;
      font-size: 24px;
      color: #ffd2a4;
    }
    .text {
      font-size: 24px;
      white-space: nowrap;
      color: #a17878;
    }
  }
}
.no-data {
  padding-top: 15px;
  .icon {
    width: 178px;
    margin: 0 auto;
  }
  .text {
    text-align: center;
    padding-top: 28px;
    font-size: 26px;
    line-height: 26px;
    font-weight: bold;
    color: #876363;
  }
}
.rule {
  padding: 35px 30px;
  .title {
    font-size: 24px;
    line-height: 26px;
    padding-bottom: 15px;
    color: #a17878;
  }
  .text {
    font-size: 24px;
    line-height: 46px;
    color: #997272;
  }
}
.cancel-btn {
  width: 666px;
  line-height: 88px;
  margin: 0 auto;
  font-size: 34px;
  font-weight: bold;
  text-align: center;
  color: #5d1111;
  overflow: hidden;
  background: linear-gradient(360deg, #bc0e0e 0%, #f3cb14 100%);
  box-shadow: inset 0 3px 4px 0 rgba(255, 255, 255, 0.65);
  border-radius: 49px;
}
.top-users {
  padding: 35px 48px 12px;
  overflow: hidden;
  .user-list {
    display: flex;
  }
  .list {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin-right: 25px;
    background: #d8d8d8;
    border: 2px solid #ffb829;
    &:nth-child(2) {
      border-color: #7585a7;
      .rank {
        text-shadow: #7585a7 3px 0 0, #7585a7 0 3px 0, #7585a7 -3px 0 0,
          #7585a7 0 -3px 0;
      }
      .score {
        background: rgba(137, 165, 187, 0.8);
      }
    }
    &:nth-child(3) {
      border-color: #a46a5b;
      .rank {
        text-shadow: #a46a5b 3px 0 0, #a46a5b 0 3px 0, #a46a5b -3px 0 0,
          #a46a5b 0 -3px 0;
      }
      .score {
        background: rgba(189, 133, 98, 0.8);
      }
    }
    .rank {
      position: absolute;
      right: 0;
      top: -5px;
      font-size: 24px;
      line-height: 24px;
      transform: scale(0.85);
      transform-origin: 50% 0;
      text-shadow: #ffb829 3px 0 0, #ffb829 0 3px 0, #ffb829 -3px 0 0,
        #ffb829 0 -3px 0;
      color: #ffffff;
    }
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .border-avatar{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: scale(1.552);
      transform-origin:center;
    }
    .crown-icon{
      position: absolute;
      left: -5px;
      top: -4px;
      width: 20px;
      height: 20px;
    }
    .score {
      position: absolute;
      left: 50%;
      bottom: -12px;
      height: 38px;
      background: rgba(255, 184, 41, 0.8);
      border-radius: 24px;
      font-size: 24px;
      line-height: 38px;
      text-align: center;
      transform: translateX(-50%) scale(0.7);
      transform-origin: 50% 100%;
      color: #ffffff;
      white-space: nowrap;
    }
  }
  .left {
    float: left;
    .list {
      &:nth-child(1) {
        order: 3;
      }
      &:nth-child(2) {
        order: 2;
      }
      &:nth-child(3) {
        order: 1;
      }
    }
  }
  .right {
    float: right;
    .list {
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.open-prize {
  width: 500px;
  height: 350px;
  margin: 44px auto 0;
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
<style scoped lang="scss">
.animation-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: scale(1);
  opacity: 0;
}
.props-info .list {
  .sender-animation,
  .receiver-animation {
    transition: left 0.6s 0.1s ease-in, top 0.6s 0.1s linear;
    opacity: 1;
    top: -290px;
    &.top-rank-padding {
      top: -370px;
    }
  }
  &:nth-child(1) {
    .sender-animation {
      left: 100px;
    }
    .receiver-animation {
      left: 450px;
    }
  }
  &:nth-child(2) {
    .sender-animation {
      left: -80px;
    }
    .receiver-animation {
      left: 270px;
    }
  }
  &:nth-child(3) {
    .sender-animation {
      left: -260px;
    }
    .receiver-animation {
      left: 90px;
    }
  }
  &:nth-child(4) {
    .sender-animation {
      left: -440px;
    }
    .receiver-animation {
      left: -90px;
    }
  }
}
.equal-icon {
  position: absolute;
  top: 50px;
  left: 50%;
  width: 128px;
  transform: translateX(-50%);
  z-index: 2;
}
</style>
