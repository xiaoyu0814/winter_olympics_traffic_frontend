export default {
    getdate(date) {
        const opt = {
            Y: date.getFullYear().toString(),        // 年
            m: (date.getMonth() + 1).toString(),     // 月
            d: date.getDate().toString(),            // 日
            H: date.getHours().toString(),           // 时
            M: date.getMinutes().toString(),         // 分
            S: date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };

        return `${opt.Y}/${opt.m}/${opt.d} ${opt.H}:${opt.M}`;
    }
}