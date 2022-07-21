import mapboxgl from "mapbox-gl";
import store from "@/vuex/store"

export default {
    map: null,
    trafficLayer: null,
    imageLayer: null,
    placeSearch: null,
    traffic_history: null,
    polylineLayers: [],
    heatmapLayer: null,
    mask: [],
    initMap() {
        var opts = {
            subdistrict: 0,
            extensions: 'all',
            level: 'city'
        };
        //利用行政区查询获取边界构建mask路径
        //也可以直接通过经纬度构建mask路径
        var district = new AMap.DistrictSearch(opts);
        this.mask = []
        district.search('北京市', (status, result) => {
            var bounds = result.districtList[0].boundaries;
            for (var i = 0; i < bounds[0].length; i += 1) {
                let temp = [bounds[0][i].lng, bounds[0][i].lat]
                this.mask.push(temp)
            }
        });
        district.search('张家口市', (status, result) => {
            var bounds = result.districtList[0].boundaries;
            for (var i = 0; i < bounds[0].length; i += 1) {
                let temp = [bounds[0][i].lng, bounds[0][i].lat]
                this.mask.push(temp)
            }
        });
        this.map = new AMap.Map("container", {
            // mask,
            center: [116.39996, 39.917646], //初始化地图中心点
            zoom: 11, //初始化地图层级
            resizeEnable: true, //是否监控地图容器尺寸变化
            viewMode: '2D',
        });
        window.map = this.map
        this.map.on("complete", () => {
            // this.addMarkerlayer()
            // this.addLinelayer()
            // this.addPolygonlayer()
            // this.addCirclelayer()
            this.addTileLayer()
            // this.addImageLayer()
            // this.init_infoWindow()
            this.addTileLayer_history()
            this.traffic_history.hide()
            // this.pathSimplifier()
            // this.heatmap()
            // this.addMaskLayer()
        });
    },
    removeLayer(layer) {
        this.map.remove(layer)
    },
    addMaskLayer() {
        // 外多边形坐标数组和内多边形坐标数组
        var pointers = {
            outer: [
                [-180, 90],
                [-180, -90],
                [180, -90],
                [180, 90]
            ],
            inner: this.mask
        };
        var pathArray = [
            pointers.outer,
            pointers.inner
        ];
        var polygonOptions = {
            map: map,
            strokeColor: '#97EC7100',
            strokeWeight: 2,
            fillColor: '#fff',
            fillOpacity: 1,
            zIndex: 10000
        };
        var polygon = new AMap.Polygon(polygonOptions);
        polygon.setPath(pathArray);
        map.add(polygon);
    },
    addGridTileLayer() {
        this.map.addLayer({
            type: "raster",
            id: "map",
            source: {
                type: "raster",
                tiles: ["http://piecloud.piesat.cn/dataservices/service/v1/tile?map=GoogleTerrian&access_token=&x={x}&y={y}&z={z}"],
                tileSize: 256
            }
        });
        this.map.addLayer({
            type: "raster",
            id: "lukuang",
            source: {
                type: "raster",
                tiles: ["https://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&t=1&zoom={z}&x={x}&y={y}"],
                tileSize: 256
            }
        });
    },
    addMarkerlayer() { // marker图层
        // 创建一个 icon
        var icon = new AMap.Icon({
            size: new AMap.Size(36, 36), // 元素大小
            image: require("../../public/assets/img/wd2.png"),
            imageSize: new AMap.Size(36, 36), // 显示大小（位置：右下）
            imageOffset: new AMap.Pixel(0, 0) // 偏移量
        });
        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
            position: new AMap.LngLat(116.39, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: '北京abcd',
            angle: 180, // 旋转角度 0-359
            icon: icon
        });
        var marker2 = new AMap.Marker({
            position: new AMap.LngLat(116.50, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: '北京abcd',
            angle: 90,
            icon: icon
        });
        var marker3 = new AMap.Marker({
            position: new AMap.LngLat(116.60, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: '北京abcd',
            angle: 45,
            icon: icon
        });

        // 将创建的点标记添加到已有的地图实例：
        this.map.add(marker);
        this.map.add(marker2);
        this.map.add(marker3);

        // 移除已创建的 marker
        // map.remove(marker);

        //鼠标点击marker弹出自定义的信息窗体
        AMap.event.addListener(marker, 'click', (e) => {
            console.log(e)
            this.infoWindow.open(this.map, marker.getPosition());
        });
    },
    addLinelayer(path, level, type) { // 面图层
        // if (this.polyline) {
        //     this.map.remove(this.polyline);
        //     this.polyline = null;
        // }
        let new_path = []
        if (path != "null") {
            path = path.substring(0, path.length - 1)
            let navArray = path.split(';')
            for (let i = 0; i < navArray.length; i++) {
                let test = navArray[i].split(',')
                new_path.push(
                    new AMap.LngLat(
                        Number(test[0]),
                        Number(test[1])
                    )
                )
            }
        }
        let colorArr
        if (type == "od") {
            colorArr = this.gradientColors('#ffffff', '#0700e4', 100)
        } else {

        }
        // 创建折线实例
        var polyline = new AMap.Polyline({
            path: new_path,
            borderWeight: 1, // 线条宽度，默认为 1
            strokeColor: type ? colorArr[level] : '#00f', // 线条颜色
            lineJoin: 'round', // 折线拐点连接处样式
            // lineCap: "round", // 折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
            // showDir: true, // 线上增加箭头
            strokeWeight: 2, // 线宽
            zIndex: 1 // 
        });

        // 将折线添加至地图实例
        this.map.add(polyline);
        this.polylineLayers.push(polyline)
        this.map.setCenter(new_path[0])
    },
    addPolygonlayer() { // 面图层
        // 多边形轮廓线的节点坐标数组
        var path = [
            new AMap.LngLat(116.348904, 39.943423),
            new AMap.LngLat(116.342122, 39.941176),
            new AMap.LngLat(116.357271, 39.942501),
            new AMap.LngLat(116.348258, 39.944600)
        ];

        var polygon = new AMap.Polygon({
            path: path,
            fillColor: '#fff', // 多边形填充颜色
            borderWeight: 1, // 线条宽度，默认为 1
            strokeColor: 'red', // 线条颜色
        });

        this.map.add(polygon);
    },
    addCirclelayer() { // 圆形图层
        var circle = new AMap.Circle({
            center: new AMap.LngLat(116.39, 39.9), // 圆心位置
            radius: 100, // 圆半径
            fillColor: 'red', // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 2, // 描边宽度
        });
        this.map.add(circle);
    },
    addImageLayer() {
        this.imageLayer = new AMap.ImageLayer({
            url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            bounds: new AMap.Bounds(
                [116.327911, 39.939229],
                [116.342659, 39.946275]
                // [-180, -90],
                // [180, 90]
            ),
            zooms: [0, 22]
        });
        this.map.add(this.imageLayer)
    },
    removeImageLayer() {
        this.map.remove(this.imageLayer)
        this.imageLayer = null
    },
    addTileLayer() { // 实时路况图层
        this.trafficLayer = new AMap.TileLayer.Traffic({
            zIndex: 10
        });

        this.trafficLayer.setMap(this.map);
        this.trafficLayer.hide()
    },
    addTileLayer_history(date) { // 预测路况图层
        let d, h
        let random = Math.floor(Math.random() * 10000000000000000) / 100000000000000000
        if (date) {
            d = date.d == "0" ? "7" : date.d
            h = date.h
        } else {
            d = new Date().getDay().toString() == "0" ? "7" : new Date().getDay().toString()
            h = new Date().getHours().toString()
        }
        if (this.traffic_history) {
            this.map.remove(this.traffic_history)
            this.traffic = null
        }
        this.traffic_history = new AMap.TileLayer({
            'getTileUrl': function (x, y, z) {
                var a = `https://history.traffic.amap.com/traffic?type=2&day=${d}&hh=${h}&mm=0&x=${x}&y=${y}&z=${z}&ra=${random}`;
                return a;
            },
            'zooms': [6, 20],
            'zIndex': 4
        });
        this.map.add(this.traffic_history)
    },
    removeAlllayer() { // 移除覆盖图层
        this.map.clearMap();
    },
    poi() {
        var auto = new AMap.Autocomplete({
            input: "tipinput"
        });
        var placeSearch = new AMap.PlaceSearch({
            map: this.map,
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "010", // 兴趣点城市
            citylimit: true, //是否强制限制在设置的城市内搜索
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        }); //构造地点查询类
        this.placeSearch = placeSearch;
        AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
        function select(e) {
            store.state.panel_show = true;
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
        }
    },
    closePlaceSearch() {
        store.state.panel_show = false;
    },
    init_infoWindow() {
        let title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>',
            content = [];
        content.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
        content.push("电话：010-64733333");
        content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
        this.infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            content: this.createInfoWindow(title, content.join("<br/>")),
            offset: new AMap.Pixel(16, -45)
        });
    },
    createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "custom-info input-card content-window-card";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = this.closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "https://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    },
    //关闭信息窗体
    closeInfoWindow() {
        window.map.clearInfoWindow();
    },
    pathSimplifier(data, type) {
        let self = this
        if (data.path.charAt(data.path.length - 1) == ";") {
            data.path = data.path.substring(0, data.path.length - 1)
        }
        let navArray = data.path.split(';')
        let new_path = []
        for (let i = 0; i < navArray.length; i++) {
            let test = navArray[i].split(',')
            new_path.push(
                // new AMap.LngLat(
                [Number(test[0]), Number(test[1])]
                // )
            )
        }
        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }

            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                //autoSetFitView:false,
                map: self.map, //所属的地图实例

                getPath: function (pathData, pathIndex) {

                    return pathData.path;
                },
                getHoverTitle: function (pathData, pathIndex, pointIndex) {

                    // if (pointIndex >= 0) {
                    //     //point 
                    //     return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                    // }

                    return data.label;
                },
                renderOptions: {

                    renderAllPointsIfNumberBelow: -1, //绘制路线节点，如不需要可设置为-1
                    //轨迹线的样式
                    pathLineStyle: {
                        strokeStyle: type == "header" ? '#ff000000' : '#f00',
                        lineWidth: type == "header" ? 0 : 3,
                        dirArrowStyle: true
                    },
                    pathNavigatorStyle: {
                        initRotateDegree: 0, // 初始旋转角度
                        width: type == "header" ? 16 : 0, // 巡航器形状宽度
                        height: 0, // 巡航器形状高度
                        autoRotate: true, // 是否根据路径方向进行角度旋转（相对于正上方向），默认true
                        lineJoin: 'round', // 折线拐点连接处样式
                        content: 'defaultPathNavigator', // 巡航器的内容
                        fillStyle: '#087EC4', // 填充色
                        strokeStyle: '#116394', // 描边色,
                        lineWidth: 0, // 描边宽度
                        pathLinePassedStyle: { // 巡航器经过的路径的样式
                            lineWidth: 2, // 线宽度
                            strokeStyle: type == "header" ? self.gradientColors('#ffffff', '#0700e4', 100)[data.level] : '#f00', // 线颜色
                            borderWidth: 0, // 描边宽度
                            borderStyle: '#eeeeee', // 描边颜色
                            dirArrowStyle: false // 方向箭头样式，lineWidth>=4 时有效
                        }
                    }
                }
            });
            //设置数据
            pathSimplifierIns.setData([{
                name: '路线0',
                path: new_path
            }]);

            //对第一条线路（即索引 0）创建一个巡航器
            var navg1 = pathSimplifierIns.createPathNavigator(0, {
                loop: false, //循环播放
                speed: 5000 //巡航速度，单位千米/小时
            });
            if (type == "noAnimate") {

            } else {
                navg1.start();
            }

        });
    },
    addHeatmap(data) {
        map.plugin(["AMap.Heatmap"], () => { //加载热力图插件
            this.heatmapLayer = new AMap.Heatmap(
                map, {
                radius: 25, //给定半径
                opacity: [0, 0.8]
            }); //在地图对象叠加热力图
            this.heatmapLayer.setDataSet({
                data: data,
                max: 100
            }); //设置热力图数据集
            //具体参数见接口文档
        });
    },
    gradientColors(start, end, steps, gamma) {
        var parseColor = function (hexStr) {
            return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
        };

        // zero-pad 1 digit to 2
        var pad = function (s) {
            return (s.length === 1) ? '0' + s : s;
        };
        var i, j, ms, me, output = [], so = [];
        gamma = gamma || 1;
        var normalize = function (channel) {
            return Math.pow(channel / 255, gamma);
        };
        start = parseColor(start).map(normalize);
        end = parseColor(end).map(normalize);
        for (i = 0; i < steps; i++) {
            ms = i / (steps - 1);
            me = 1 - ms;
            for (j = 0; j < 3; j++) {
                so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
            }
            output.push('#' + so.join(''));
        }
        return output;
    }
}