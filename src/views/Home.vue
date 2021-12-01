<template>
  <div class="home">
    <TopWaring
      :top-dialog="topDialog"
      @submitEvent="submitEvent"
      @closeTopDialog="closeTopDialog"
    ></TopWaring>
    <router-link :to="{ path: '/rule', query: { sid: sid } }">
      <img src="@/assets/image/banner.png" class="banner" alt="" />
    </router-link>
    <div class="tab-family-list">
      <div class="tab-list">
        <div
          v-for="(tab, index) in tabList"
          :key="index"
          @click="tabChange(index)"
          :class="['list', tabIndex === index ? 'active' : '']"
        >
          {{ tab }}
        </div>
      </div>
      <div class="family-pk-list" v-if="familyPkList.length > 0">
        <div
          class="list clearfix"
          v-for="pkInfo in familyPkList"
          :key="pkInfo.id"
          @click="goToPk(pkInfo.id)"
        >
          <div class="receiver family-pk-style">
            <div class="score">防守方: {{ pkInfo.receiver_pk_score }}</div>
            <img
              v-if="pkInfo.receiver_family.pkResult === 1"
              src="@/assets/image/success-icon.png"
              alt=""
              class="icon"
            />
            <img
              v-if="pkInfo.receiver_family.pkResult === 2"
              src="@/assets/image/fail-icon.png"
              alt=""
              class="icon"
            />
            <div class="info">
              <img :src="pkInfo.receiver_family.avatar_url" alt="" class="avatar" />
              <div class="my-family-btn" v-if="currentFamilyID == pkInfo.receiver_family.id">
                <p class="word">我的家族</p>
              </div>
              <div class="name">{{ pkInfo.receiver_family.name }}</div>
            </div>
          </div>
          <img src="@/assets/image/pk-icon.png" alt="" class="vs-icon"/>
          <img v-if="pkInfo.isEqual" src="@/assets/image/equal.png" alt="" class="equal-icon">
          <div v-else-if="pkInfo.status === 2" class="state-info pk">
            <img src="@/assets/image/icon.png" alt="" class="icon" />
          </div>
          <div v-else-if="pkInfo.status === 1" class="state-info prepare">{{ pkInfo.status_text }}</div>
          <div v-else class="state-info end">{{ pkInfo.status_text }}</div>
          <div class="sponsor family-pk-style">
            <div class="score">进攻方: {{ pkInfo.sender_pk_score }}</div>
            <img
              v-if="pkInfo.sender_family.pkResult === 1"
              src="@/assets/image/success-icon.png"
              alt=""
              class="icon"
            />
            <img
              v-if="pkInfo.sender_family.pkResult === 2"
              src="@/assets/image/fail-icon.png"
              alt=""
              class="icon"
            />
            <div class="info">
              <img
                :src="pkInfo.sender_family.avatar_url"
                alt=""
                class="avatar"
              />
              <div class="name">{{ pkInfo.sender_family.name }}</div>
              <div class="my-family-btn" v-if="currentFamilyID == pkInfo.sender_family.id">
                <p class="word">我的家族</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-else>
        <img src="@/assets/image/no-data-icon.png" alt="" class="icon" />
        <div class="name">暂无开战家族</div>
      </div>
    </div>
    <div class="footer" v-if="isCreate">
      <div class="create-btn" @click="createPK">创建家族战</div>
      <div class="chat-btn" @click="goToChat">
        <img src="@/assets/image/chat-icon.png" alt="" class="icon" />
      </div>
    </div>
    <CreatePK
      :create-dialog-state="dialogState"
      @closeDialog="closeCreateDialog"
    ></CreatePK>
    <Tips ref="tips"></Tips>
    <Dialog
      :dialog-info="dialogInfo"
      @closeDialog="closeDialog"
      @submitDialog="submitDialog"
    >
    </Dialog>
  </div>
</template>

<script>
import http from "@/utils/http";
import { openClientApp } from "@/utils/utils";
import CreatePK from "@/components/CreatePK.vue";
import TopWaring from "@/components/TopWaring.vue";
import Dialog from "@/components/Dialog.vue";

export default {
  name: "Home",
  components: {
    CreatePK,
    TopWaring,
    Dialog
  },
  data() {
    return {
      tabList: ["今日开战家族", "明日开战家族"],
      tabIndex: 0,
      dialogState: false,
      topDialog: {
        status: false,
        type: "1",
      },
      familyPkList: [],
      sid: window.USER_SID,
      dialogInfo: {
        status: false,
        title: ""
      },
      isCreate: false,
      isPatriarch: false,
      isElder: false,
      currentFamilyID: window.CURRENT_FAMILY_ID,
      pkType: 0
    }
  },
  mounted() {
    this.getFamilyPkList();
    this.getNoticeInfo();
    // http.get("/ws/create").then((r: any) => {
    //   new websocketClass(r.ws_client_url, (res: any) => {
    //     console.log(res);
    //   });
    // });
  },
  methods: {
    goToPk(id) {
      const sid = this.sid;
      this.$router.push({ path: `/pk_detail`, query: { sid, id } });
    },
    closeDialog(state) {
      this.dialogInfo.status = state;
    },
    submitDialog() {
      this.dialogInfo.status = false;
      if (this.dialogInfo.submitCallback) {
        this.dialogInfo.submitCallback();
      }
    },
    tabChange(num) {
      this.tabIndex = num;
      const time = Math.floor(new Date().getTime() / 1000);
      this.getFamilyPkList(time + num * 24 * 60 * 60);
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
                "family_pk_id": this.topDialog.familyPkId,
                "type": "cancel"
              }
            })
            .then(res => {
              this.$refs.tips.showTips(res.error_reason);
              this.topDialog.status = false;
            });
        }
      };
    },
    createPK() {
      this.dialogState = !this.dialogState;
    },
    closeCreateDialog(state) {
      this.dialogState = state;
      this.getFamilyPkList();
      this.getNoticeInfo();
    },
    submitEvent() {
      let params = null;
      if (this.topDialog.type == "1") {
        this.cancelFamilyPk();
        return;
      }
      if (this.topDialog.type === "2") {
        params = {
          "family_pk_id": this.topDialog.familyPkId,
          "type": "accept"
        };
      }
      if(this.topDialog.type === "3"){
        params = {
          "family_pk_id": this.topDialog.familyPkId,
          "type": "agree"
        };
      }
      if(this.topDialog.type === "4"){
        params = {
          "family_pk_id": this.topDialog.familyPkId,
          "type": "cancel_apply"
        };
      }
      if (!params) {
        return;
      }
      http.get("/family_fights/response", {
          params
        }).then(res => {
          this.getFamilyPkList();
          this.$refs.tips.showTips(res.error_reason);
          this.topDialog.status = false;
        });
    },
    closeTopDialog() {
      if (this.topDialog.type === "2") {
        http.get("/family_fights/response", {
            params: {
              "family_pk_id": this.topDialog.familyPkId,
              "type": "reject"
            }
          }).then((res) => {
            this.$refs.tips.showTips(res.error_reason);
            this.topDialog.status = false;
          });
      }
      if (this.topDialog.type === "3") {
        http.get("/family_fights/response", {
          params: {
            "family_pk_id": this.topDialog.familyPkId,
            "type": "reject_apply"
          }
        }).then((res) => {
          this.$refs.tips.showTips(res.error_reason);
          this.topDialog.status = false;
        });
      }
      this.topDialog.status = false;
    },
    getFamilyPkList(time = 0) {
      http
        .get("/family_fights/histories", {
          params: {
            time
          }
        })
        .then(res => {
          if (res.error_code === 0) {
            const familyList = res.histories;
            this.familyPkList = familyList.map((item) => {
              const receiverPkScore = item.receiver_pk_score;
              const senderPkScore = item.sender_pk_score;
              item.receiver_family.pkResult = 0;
              item.sender_family.pkResult = 0;
              item.isEqual = false;
              if (item.status !== 3) {
                return item;
              }
              item.receiver_family.pkResult =
                receiverPkScore >= senderPkScore
                  ? receiverPkScore === senderPkScore ? 3 : 1 : 2;
              item.sender_family.pkResult =
                receiverPkScore >= senderPkScore
                  ? receiverPkScore === senderPkScore ? 3 : 2 : 1;
              item.isEqual = receiverPkScore === senderPkScore;
              return item;
            });
            this.$nextTick(() => {
              window.scrollTo(0, 1);
              window.scrollTo(0, 0);
            });
          }
        });
    },
    getNoticeInfo() {
      http.get("/family_fights/notice_info").then(res => {
        if (res.is_patriarch || res.is_elder) {
          this.isCreate = true;
        }
        if(res.is_patriarch){
          this.isPatriarch = true;
        }
        if(res.is_elder){
          this.isElder = true;
        }
        if (res.notice) {
          const notice = res.notice;
          this.pkType = notice.pk_type
          this.showAcceptTopDialog(notice);
        }
      });
    },
    showAcceptTopDialog(notice) {
      window.goFamilyDetail = function(id) {
        openClientApp(`app://family/detail?family_id=${id}`);
      };
      const type = notice.type;
      let content = "";
      let msg = "";
      let dialogType = type === "receiver" ? "2" : "1";
      console.log(type === "agree" && this.isPatriarch)
      if (type === "receiver") {
        content = `<div class="text"><span class="strong" onclick="goFamilyDetail(${notice.sender_family.id})">${notice.sender_family.name}</span>正在向您的家族在${notice.begin_at_text}发起${notice.duration}分钟约战申请，是否接受约战，PK开始前30分钟未同意则约战自动过期</div>
            <div class="sub-text">约战惩罚：<span class="strong">${notice.punish_text}</span></div>`;
        this.topDialog.submitBtnText = "接受";
        this.topDialog.cancelBtnText = "拒绝";
      } else if (type === "sender") {
        msg = `正在等待 <span class="strong" onclick="goFamilyDetail(${notice.receiver_family.id})">${notice.receiver_family.name}</span> 家族 接受您在${notice.begin_at_text}发起${notice.duration}分钟约战申请，开战前您可申请取消约战。`;
        this.topDialog.submitBtnText = "取消约战";
      } else if(type === "agree" && this.isElder){
        var content_type = notice.pk_type == 1?'强袭PK':'约战PK';
        msg = `您已向<span class="strong" onclick="goFamilyDetail(${notice.receiver_family.id})">${notice.receiver_family.name}</span>家族在${notice.begin_at_text}发起${notice.duration}分钟${content_type}，等待家族族长同意后即可向对方家族发起${content_type}，若家族族长拒绝PK，则${content_type}失败,族长拒绝 返还一半钻石`
        this.topDialog.submitBtnText = "取消申请";
        dialogType = "4";
      } else if(type === "agree" && this.isPatriarch){
        var content_type = notice.pk_type == 1?'强袭PK':'约战PK';
        content = `<div class="text">您的家族长老<span class="strong">${notice.nickname}</span>申请在${notice.begin_at_text}向
<span class="strong" onclick="goFamilyDetail(${notice.receiver_family.id})">${notice.receiver_family.name}</span> 家族发起${notice.duration}分钟${content_type}！</div>
            <div class="sub-text">约战惩罚：<span class="strong">${notice.punish_text}</span></div>`;
        this.topDialog.submitBtnText = "同意";
        this.topDialog.cancelBtnText = "拒绝";
        dialogType = "3";
      }
      this.topDialog.familyPkId = notice.id;
      this.topDialog.contentEl = content;
      this.topDialog.msg = msg;
      this.topDialog.status = true;
      this.topDialog.type = dialogType;
    },
    goToChat() {
      openClientApp("app://chats/send?receiver_id=1");
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  padding: 30px 30px 165px;
  min-height: 100vh;
  background: url("../assets/image/bg.png") no-repeat 50% 50% fixed;
  background-size: 100% 100%;
}
body {
  background: #021449;
}
.banner {
  width: 100%;
}

.tab-list {
  padding-top: 44px;
  display: flex;
  .list {
    position: relative;
    padding-bottom: 20px;
    font-size: 40px;
    line-height: 40px;
    margin-right: 67px;
    transform: scale(0.75);
    color: #999999;
    &:before {
      display: none;
      content: "";
      width: 14px;
      height: 10px;
      border-radius: 5px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
    }
    &.active {
      transform: scale(1);
      color: #fff;
      &:before {
        display: block;
      }
    }
  }
}
.tab-family-list {
  .time {
    padding: 34px 0;
    font-size: 24px;
    color: #999999;
    line-height: 26px;
  }
}
.family-pk-list {
  .list {
    position: relative;
    padding: 20px 30px 30px 30px;
    margin-bottom: 28px;
    background: url(../assets/image/list-bg.png) no-repeat 50% 50%;
    background-size: 100% 100%;
    .vs-icon {
      position: absolute;
      top: 58%;
      left: 49%;
      width: 85px;
      height: 80px;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }
  .family-pk-style {
    .icon {
      position: absolute;
      width: 102px;
      height: 68px;
      object-fit: contain;
      z-index: 22;
    }
    .score {
      font-size: 24px;
      line-height: 24px;
      color: #ffffff;
      opacity: 0.8;
    }
    .info {
      position: relative;
      margin-top: 20px;
      display: flex;
      align-items: center;
      .avatar {
        width: 65px;
        height: 65px;
        background: #d8d8d8;
        border: 2px solid #ffffff;
        border-radius: 50%;
      }
      .my-family-btn{
        position: absolute;
        left: -11px;
        top: 50px;
        width: 90px;
        height: 28px;
        border-radius: 14px;
        background: #ffffff;
        .word{
          white-space: nowrap;
          font-size: 24px;
          line-height: 28px;
          text-align: center;
          transform: scale(0.75);
          transform-origin: center;
          color: #F71497;
        }
      }
      .name {
        max-width: 190px;
        margin-left: 18px;
        font-size: 30px;
        line-height: 33px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #ffffff;
      }
    }
  }
  .sponsor {
    float: left;
    .icon {
      left: 145px;
      top: -20px;
    }
  }
  .receiver {
    float: right;
    text-align: right;
    .icon {
      right: 145px;
      top: -20px;
    }
  }
}
.state-info {
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -123px;
  width: 246px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 24px;
  color: #fff;
  background: linear-gradient(134deg, #245de9 0%, #d50bb6 100%);
  border-radius: 0 0 28px 28px;
  &.end {
    color: rgba(255, 255, 255, 0.51);
  }
  &.pk .icon {
    width: 30px;
    display: inline-block;
    vertical-align: middle;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 143px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: #021449;
  z-index: 33;
  .create-btn {
    width: 495px;
    line-height: 88px;
    font-weight: 500;
    font-size: 30px;
    color: #ffffff;
    text-align: center;
    background: linear-gradient(270deg, #be15e2 0%, #3d6ae1 100%);
    border-radius: 16px;
  }
  .chat-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 157px;
    height: 88px;
    border-radius: 16px;
    border: 1px solid rgba(187, 23, 226, 1);
    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
.no-data {
  padding-top: 137px;
  .icon {
    width: 350px;
    margin: 0 auto;
  }
  .name {
    padding-top: 60px;
    text-align: center;
    font-size: 30px;
    line-height: 30px;
    color: #38386c;
  }
}
.equal-icon {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: -22px;
  width: 102px;
  transform: translateX(-50%);
}
</style>
