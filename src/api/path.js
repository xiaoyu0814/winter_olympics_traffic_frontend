let ip = {
    online: "https://oneticket.jphtw.top/wog-sys1",
    offline: "https://oneticket.jphtw.top/wog-sys1"
}
let flag = false
let path = {
    travel: {
        person_type_dataset: (flag ? ip.online : ip.offline) + "/person-type-dataset", // 获取出行人群数据集编号列表
        travel_mode_dataset: (flag ? ip.online : ip.offline) + "/travel-mode-dataset", // 获取出行模式数据集编号列表
        person_type_count: (flag ? ip.online : ip.offline) + "/person-type-count", // 获取出行人群类型统计结果，包含各类人群及对应数据数量
        travel_mode_count: (flag ? ip.online : ip.offline) + "/travel-mode-count", // 获取出行模式种类统计结果，包含各类出行模式及对应数据数量
        get_track_person: (flag ? ip.online : ip.offline) + "/get-track-person", // 获取指定人群的出行轨迹数据
        get_track_travel: (flag ? ip.online : ip.offline) + "/get-track-travel", // 获取指定出行模式对应的轨迹数据
    },
    traffic: {
        demand_dataset: (flag ? ip.online : ip.offline) + "/demand-dataset", // 返回需求数据的数据集编号列表
        od_time: (flag ? ip.online : ip.offline) + "/od-time", // 返回可选时间列表，用于查询指定时间的od需求情况
        od_demand: (flag ? ip.online : ip.offline) + "/od-demand", // 返回指定时间的od需求数据
        path_time: (flag ? ip.online : ip.offline) + "/path-time", // 返回可选时间列表，用于查询指定时间的path需求情况
        path_demand: (flag ? ip.online : ip.offline) + "/path-demand", // 返回指定时间的path需求数据
        link_time: (flag ? ip.online : ip.offline) + "/link-time", // 返回可选时间列表，用于查询指定时间的link需求情况
        link_demand: (flag ? ip.online : ip.offline) + "/link-demand", // 返回指定时间的link需求数据
    },
    excavate: {
        division_time: (flag ? ip.online : ip.offline) + "/division-time", // 返回可选时间列表，用于查询指定时间的赛区附近路网流量情况
        division_area: (flag ? ip.online : ip.offline) + "/division-area", // 返回可选城市列表，用于查询指定时间的赛区附近路网流量情况
        division_flow: (flag ? ip.online : ip.offline) + "/division-flow", // 返回指定赛区，在指定时间的路网流量数据
        hsr_demand: (flag ? ip.online : ip.offline) + "/hsr-demand", // 返回主要火车站的坐标和流量水平
        airport_demand: (flag ? ip.online : ip.offline) + "/airport-demand", // 返回主要航班线路起止点坐标和流量水平
    }
}

export default path