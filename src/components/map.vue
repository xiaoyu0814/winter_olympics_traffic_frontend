<template>
  <div id="map_box">
    <div id="map" @mousewheel="setZoom" v-show="$store.state.mysubway_show"></div>
    <div id="container"></div>

    <div id="panel" v-if="$store.state.panel_show"></div>
    <div class="tools_box">
      <!-- <input id="tipinput" /> -->
      <!-- <el-button type="primary" @click="$map.removeAlllayer()"
        >删除所有覆盖物</el-button
      >
      <el-button type="primary" @click="$map.removeImageLayer()"
        >删除图片图层</el-button
      >
      <el-button type="primary" @click="$store.state.drawer=!$store.state.drawer"
        >侧边栏显示/隐藏</el-button
      > -->
    </div>
  </div>
</template>

<script>
export default {
  name: "map_box",
  data() {
    return {
      mysubway:null,
      zoom: 0.8
    };
  },
  mounted() {
    this.$map.initMap();
    setTimeout(() => {
      this.mysubway = subway("map", { easy: 1 });
    }, 1000);
  },
  methods: {
    setZoom() {
      if (window.event.deltaY > 0) {
        console.log("down");
        if(this.zoom <= 0.3){
          return
        }
        this.zoom -= 0.5
        this.mysubway.scale(this.zoom)
      } else {
        console.log("up");
        if(this.zoom >= 1.3){
          return
        }
        this.zoom += 0.5
        this.mysubway.scale(this.zoom)
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css");
#map_box {
  height: 100%;
  width: 100%;
}
#map_box #map {
  position: fixed !important;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;
  background-color: #fff;
}
#map_box .amap-demo {
  height: 100%;
}
#map_box #container {
  width: 100%;
  height: 100vh;
}
#tipinput {
  padding: 5px;
  border-radius: 5px;
  margin-right: 5px;
  height: 40px;
  border: 1px solid #ccc;
}
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
.tools_box {
  position: fixed;
  left: 100px;
  top: 50px;
}
</style>

<style>
.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

span {
  margin-left: 5px;
  font-size: 11px;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
</style>