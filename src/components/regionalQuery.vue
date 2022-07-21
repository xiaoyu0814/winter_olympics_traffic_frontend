<template>
  <div
    id="regionalQuery"
    ref="box"
    @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <header>
      <span>地区查询</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <ul class="content">
      <li>
        <span>地区：</span>
        <el-input
          v-model="limitNum"
          placeholder="请输入内容"
          style="width: 200px"
          size="mini"
          id="tipinput"
        ></el-input>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      personList: [],
      personValue: "",
      limitNum: "",
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
    };
  },
  mounted() {
    this.$map.poi();
  },
  methods: {
    getPersonList() {
      let path = this.$path.travel.person_type;
      let params = {};
      this.$http.get(path, params).then(() => {
        console.log(res);
      });
    },
    getTrackPerson() {
      let path = this.$path.travel.get_track_person;
      let params = {
        personType: this.personValue,
        limitNum: this.limitNum,
      };
      this.$http.get(path, params).then(() => {
        console.log(res);
      });
    },
    close() {
      this.$store.state.regionalQuery_show = false;
      this.$map.closePlaceSearch();
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      if (event.target.id == "tipinput") {
        return;
      }
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 200 + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      event.currentTarget.style.cursor = "move";
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
  },
};
</script>

<style scoped>
#regionalQuery {
  width: 400px;
  height: 200px;
  background-color: #fffe;
  border: 1px solid #ccc;
  border-radius: 5px;
}
header {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
header span {
  font-size: 16px;
  font-weight: bold;
}
header i {
  cursor: pointer;
}
.content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
}
</style>