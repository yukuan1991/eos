<template>
<div class="accountinfo_container">
  <div class="accountinfo_interface">
    <div class="accountinfo_title">
      <span>帐户设置</span>
    </div>
    <div class="accountinfo_setting">
      <div class="setting_left">
        <div class="accountinfo_username accountinfo">
          <i class="iconfont icon-user-name"></i>
          <input class="input_accountinfo" type="text" v-model="name" placeholder="用户名">
        </div>
        <div class="accountinfo_name accountinfo">
          <i class="iconfont icon-user"></i>
          <input class="input_accountinfo" type="text" v-model="abbname" placeholder="姓名">
        </div>
        <div class="accountinfo_password accountinfo">
          <i class="iconfont icon-password"></i>
          <input class="input_accountinfo" type="text" v-model="pwd" placeholder="密码">
        </div>
        <div class="accountinfo_position accountinfo">
          <i class="iconfont icon-position"></i>
          <input class="input_accountinfo" type="text" v-model="job" placeholder="职位">
        </div>
        <div class="accountinfo_boss dropdown accountinfo">
          <i class="iconfont icon-superior"></i>
          <input class="input_accountinfo" type="text" v-model="leader" placeholder="直线上司">
        </div>
        <div class="accountinfo_effectivemenu">
          <i class="iconfont icon-Effective-menu"></i>
          <div class="menu_container">
            <div class="menu_title">
              有效菜单
            </div>
            <div class="menu_option">
              <div class="input_menuoption" v-for='(option,index) in validmenuList' :key="index">
                <input v-model="postOptions" :value="option.validmenuid" :id='"menu"+index' type="checkbox" class="mycheck">
                <label :for='"menu"+index' v-text='option.name'></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="accountinfo_areacontainer">
        <div class="visablearea_title">
          <span><i class="iconfont icon-Viewing-area"></i>可视区域范围</span>
        </div>
        <div class="visablearea_tree">
          <ul id="visual_area_tree" class="ztree"></ul>
        </div>

      </div>
    </div>
    <div class="area_button text-right">
      <input v-model="continueAdd" id='continueCheck' :checked="this.check" type="checkbox" class="mycheck">
      <label v-show="flag" for='continueCheck'>连续添加</label>
      <span class="button_confirm button" @click="confirm">确认</span>
      <span class="button_cancel button" @click="cancel">取消</span>
    </div>
  </div>
</div>
</template>

<script type="text/javascript">
import {mapState,mapActions} from "vuex";
export default {
  created: function() {
    this.getOptions()
  },
  data() {
    return {
      flag: false,
      check: false,
      continueAdd: false,
      name: "",
      abbname: '',
      job: '',
      pwd: '',
      leader: '',
      postOptions: [], // 初渲染所有选项
      post: null, // 提交选项也是已选中选项
      checkLists: "",
      setting: {
        view: {
          selectedMulti: false,
          showIcon: false,
        },
        callback: {
          beforeCheck: this.zTreeBeforeCheck,
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        check: {
          enable: true,
          chkStyle: "checkbox",
          radioType: "level"
        },
      },
    };
  },
  computed: {
    ...mapState([
      "userinfor",
      "validmenu",
      "validmenuList",
      "validarea",
      "addResult",
      "areaAll"
    ])
  },
  methods: {
    ...mapActions(["addUser", "updateUserById", "selectUserById", "selectAreaAll"]),
    empty(val) {
      let reg = /^\s+$/gi;
      if (reg.test(val) || val.length == 0) {
        return true;
      }
    },
    getOptions() {
      let _this = this;
      if (this.$route.query.userid) {
        this.postOptions = this.validmenu.split(',');
      } else {
        this.postOptions = [];
      }


    },
    isArray: function(arr) {
      return Object.prototype.toString.apply(arr) === "[object Array]";
    },
    clone: function(obj, attrs) {
      if (obj === null) return null;
      let objIsArray = this.isArray(obj);
      let o = objIsArray ? [] : {};
      for (let i in obj) {
        if (objIsArray || attrs[i]) {
          o[i] = (obj[i] instanceof Date) ? newDate(obj[i].getTime()) : (typeof obj[i] === "object" ?
            this.clone(obj[i], attrs) : obj[i]);
        }
      }
      return o;
    },
    filterHalfCheck(zTree) {
      let nodes = zTree.getCheckedNodes(true);
      let checkedNodes = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].getCheckStatus().half == false) {
          checkedNodes.push(nodes[i]);
        }
      }
      return checkedNodes;
    },
    confirm() {
      let zTree = $.fn.zTree.getZTreeObj("visual_area_tree");
      let checkedNodes = this.filterHalfCheck(zTree);
      this.checkLists = this.clone(checkedNodes, {
        id: 1,
        pId: 1,
        name: 1
      });
      if (this.$route.query.userid) {
        this.updateOption({
          userId: this.$route.query.userid,
          userName: this.name,
          userPsd: this.pwd,
          userAbbName: this.abbname,
          userJob: this.job,
          userLeader: this.leader,
          validMenu: this.postOptions.join(","),
          validArea: JSON.stringify(this.checkLists),
        });
      } else {
        this.addOption({
          userName: this.name,
          userPsd: this.pwd,
          userAbbName: this.abbname,
          userJob: this.job,
          userLeader: this.leader,
          validMenu: this.postOptions.join(","),
          validArea: JSON.stringify(this.checkLists),
        });
      }
    },
    updateOption(obj) {
      let _this = this;
      if (this.validateData()) {
        Ewin.confirm({
          message: "确认要更新数据吗？"
        }).on(function(e) {
          _this.updateUserById(obj);
          _this.$router.push({
            name: "account"
          });
        });
      }
    },
    cancel() {
      let _this = this;
      if (!this.empty(this.name) ||
        !this.empty(this.abbname) ||
        !this.empty(this.pwd) ||
        !this.empty(this.job)
      ) {
        Ewin.confirm({
          message: "确认要取消编辑吗？"
        }).on(function(e) {
          _this.$Message.info('已取消编辑');
          _this.$router.push({
            name: "account"
          });
        });
      } else {
        _this.$router.push({
          name: "account"
        });
      }
    },

    validateData() {
      //if (this.empty(this.username)) alert("用户情况不能为空"); this.
      if (
        this.empty(this.name) ||
        this.empty(this.abbname) ||
        this.empty(this.pwd) ||
        this.empty(this.job)
      ) {
        this.$Message.error('用户信息不能为空');
        return false;
      }
      return true;
    },
    addOption(obj) {
      let _this = this;
      if (this.validateData()) {
        _this.addUser(obj);
        _this.name = ""
        _this.pwd = ""
        _this.abbname = ""
        _this.job = ""
        _this.leader = ""
        _this.postOptions = []
        let treeObj = $.fn.zTree.getZTreeObj("visual_area_tree");
        treeObj.checkAllNodes(false);
      }
    },
    filter(node) {
      return (node.level == this.maxLevel);
    },
    zTreeBeforeCheck(treeId, treeNode) {
      let zTree = $.fn.zTree.getZTreeObj(treeId);
      let checkedNodes = this.filterHalfCheck(zTree);
      if (checkedNodes.length <= 0) return true;
      checkedNodes.sort(function(nodeA, nodeB) {
        if (nodeA.level > nodeB.level) {
          return 1;
        } else if (nodeA.level < nodeB.level) {
          return -1;
        }
        return 0;
      });
      const maxNode = checkedNodes[0];
      if (maxNode.id === treeNode.id) return true;
      if (maxNode.pId === null) {
        this.$Message.error("请根据职位选择相应最高可视区域范围");
        return false
      }
      if (maxNode.getParentNode().id === treeNode.id) return true;

      if(maxNode.level > treeNode.level) {
        const parentNodes = maxNode.getPath();
        for (let i = 0; i < parentNodes.length; i++) {
          if (parentNodes[i].id === treeNode.id) {
            return true;
          } else {
            this.$Message.error("请根据职位选择相应最高可视区域范围");
            return false;
          }
        }
      } else {
        this.$Message.error("请根据职位选择相应最高可视区域范围");
        return false;
      }
    }

  },
  watch: {
    validmenu(newVal) {
      this.getOptions()
    },
    areaAll(newVal) {
      $.fn.zTree.init($("#visual_area_tree"), this.setting, this.areaAll);
    },
    validarea(newVal) {
      $.fn.zTree.init($("#visual_area_tree"), this.setting, this.validarea);
    },
    userinfor() {
      this.name = this.userinfor.username;
      this.pwd = this.userinfor.userpsd;
      this.abbname = this.userinfor.userabbname;
      this.job = this.userinfor.userjob;
      this.leader = this.userinfor.userleader;
    },
    addResult(newVal) {
      if (newVal.status == 101) {
        this.$Message.error('用户名已存在,请勿重复添加');
        return false
      } else if (newVal.status == 0) {
        this.$Message.success('添加成功');
        if (!this.continueAdd)
          this.$router.push({
            name: "account"
          });
      } else {
        this.$Message.warning('服务器忙请稍后再试');
      }
    }
  },

  mounted() {
    if (this.$route.query.userid) {
      this.selectUserById({
        userid: this.$route.query.userid
      });
    } else {
      this.flag = !this.flag;
      this.selectAreaAll();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
