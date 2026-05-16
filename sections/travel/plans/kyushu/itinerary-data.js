(function () {
  window.TravelItineraries = window.TravelItineraries || {};
  const points = [
      { id: "D1-1", day: 1, kind: "transit", time: "10:55", name: "9C6609 抵达福冈机场", note: "9C6609 上海浦东 PVG -> 福冈 FUK，08:00 上海起飞，10:55 福冈到达，当地时间。入境取行李后接驳到国内线/地铁侧。", lat: 33.5849, lng: 130.4516 },
      { id: "D1-2", day: 1, kind: "transit", time: "12:25", name: "福冈机场地铁站", note: "地铁空港线约 5 分钟到博多。", lat: 33.5972, lng: 130.4480 },
      { id: "D1-3", day: 1, kind: "transit", time: "12:35", name: "博多站", note: "取票/买便当；13:01 SAKURA 751 出发。", lat: 33.5902, lng: 130.4207 },
      { id: "D1-4", day: 1, kind: "visit", time: "14:35-15:10", name: "樱之马场城彩苑", note: "午餐/小吃，顺路进入熊本城区域。", lat: 32.8050, lng: 130.7034 },
      { id: "D1-5", day: 1, kind: "visit", featured: true, time: "15:10-16:30", name: "熊本城", note: "熊本城是日本三名城之一，黑色天守、石垣和加藤清正相关历史是重点。2016 年地震后持续修复，参观时可看到复原后的天守和仍在修复的城郭结构，路线建议从二之丸广场进入，留意闭馆和停止售票时间。", lat: 32.8062, lng: 130.7058, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Kumamoto%20Castle%2006s5s4272.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:Kumamoto_Castle_06s5s4272.jpg" },
      { id: "D1-6", day: 1, kind: "visit", time: "18:30-20:30", name: "下通/上通商店街", note: "晚餐区域：马肉料理、熊本拉面、辛子莲藕、太平燕、赤牛/和牛烧肉、居酒屋。第一晚更适合选动线顺的店，不要为了排队名店压缩熊本城后的休息时间。", lat: 32.8024, lng: 130.7110 },

      { id: "D2-1", day: 2, kind: "visit", featured: true, time: "09:10-10:30", name: "水前寺成趣园", note: "水前寺成趣园是熊本代表性的回游式庭园，以东海道五十三次为灵感设计，池泉、草坡、石桥和能乐殿组合很有层次。这里节奏比熊本城安静，适合早上散步拍照；如果前一天熊本城没玩够，也可以把这里作为可删除项目。", lat: 32.7897, lng: 130.7335, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Suizen-ji%20Garden%2C%20Kumamoto.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:Suizen-ji_Garden,_Kumamoto.jpg" },
      { id: "D2-2", day: 2, kind: "transit", time: "12:40", name: "熊本站", note: "SAKURA 749 熊本 -> 鹿儿岛中央。", lat: 32.7900, lng: 130.6890 },
      { id: "D2-3", day: 2, kind: "transit", time: "13:37", name: "鹿儿岛中央站", note: "抵达鹿儿岛，酒店寄存行李/午餐。", lat: 31.5838, lng: 130.5411 },
      { id: "D2-A", day: 2, kind: "visit", optional: true, time: "14:30-15:30", name: "维新故乡馆", summary: "备选：维新故乡馆", note: "如果天气不好、体力一般，或想补一点萨摩藩和明治维新背景，可以把城山展望台前后的时间改到维新故乡馆。这里离鹿儿岛中央站不远，适合作为 D2 下午的轻量室内备选。", lat: 31.5847, lng: 130.5459 },
      { id: "D2-4", day: 2, kind: "visit", featured: true, time: "15:45-16:45", name: "城山展望台", note: "城山展望台是鹿儿岛市区看樱岛最经典的位置，视野能同时覆盖市街、锦江湾和火山轮廓。下午光线通常更适合拍城市和海湾层次；如果天气通透，可以在这里先建立对鹿儿岛地形的整体印象，再去天文馆晚餐。", lat: 31.5967, lng: 130.5507, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sakurajima%20from%20Shiroyama%20View%20Point.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:Sakurajima_from_Shiroyama_View_Point.jpg" },
      { id: "D2-B", day: 2, kind: "visit", optional: true, time: "16:50-17:40", name: "照国神社 / 美术馆周边", summary: "备选：照国神社/美术馆周边", note: "如果城山展望台结束后还有体力，可以顺路走照国神社、鹿儿岛市立美术馆周边，再慢慢回到天文馆晚餐。它更像城市散步，不适合当成必须打卡的重景点。", lat: 31.5948, lng: 130.5521 },
      { id: "D2-5", day: 2, kind: "visit", time: "18:30-20:30", name: "天文馆商圈", note: "晚餐区域：黑豚炸猪排、黑豚涮涮锅、鹿儿岛黑毛和牛烧肉/寿喜烧、萨摩料理、烧酎。想吃和牛的话，D2 或 D3 晚上选一顿即可，预算会比普通定食明显高。", lat: 31.5907, lng: 130.5556, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/G3%20Arcade%20of%20Temmonkan%20Shopping%20Street%20at%20night.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:G3_Arcade_of_Temmonkan_Shopping_Street_at_night.jpg" },

      { id: "D3-1", day: 3, kind: "transit", time: "09:00", name: "鹿儿岛港樱岛渡轮码头", note: "渡轮约 15 分钟到樱岛港。", lat: 31.5960, lng: 130.5652 },
      { id: "D3-2", day: 3, kind: "transit", time: "09:30", name: "樱岛港", note: "转 Sakurajima Island View 巴士。", lat: 31.5921, lng: 130.5998 },
      { id: "D3-3", day: 3, kind: "visit", featured: true, time: "10:30-11:10", name: "汤之平展望所", note: "汤之平展望所是樱岛常规游客能抵达的高处观景点之一，离火山体更近，能清楚感受到活火山的体量。天气好时可以看南岳和昭和火口方向，也能回望锦江湾；若火山灰较大，注意口罩、眼镜和电子设备防尘。", lat: 31.6018, lng: 130.6328, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sakurajima%20at%20Sunset.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:Sakurajima_at_Sunset.jpg" },
      { id: "D3-4", day: 3, kind: "transit", time: "11:40", name: "樱岛港返回", note: "坐渡轮回鹿儿岛市区。", lat: 31.5921, lng: 130.5998 },
      { id: "D3-5", day: 3, kind: "visit", featured: true, time: "12:45-15:30", name: "仙岩园", note: "仙岩园是岛津家别邸庭园，最大亮点是把樱岛和锦江湾纳入借景，空间感比普通庭园开阔很多。园内可结合尚古集成馆了解萨摩藩近代工业化，也适合安排庭园咖啡和慢走；如果只在鹿儿岛选一个文化景点，优先级很高。", lat: 31.6171, lng: 130.5770, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20from%20Sengan-en%20-Sakurajima.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:View_from_Sengan-en_-Sakurajima.jpg" },
      { id: "D3-6", day: 3, kind: "visit", time: "18:00-20:30", name: "天文馆商圈", note: "鹿儿岛最后一晚晚餐。建议在黑豚涮涮锅、鹿儿岛黑毛和牛烧肉/寿喜烧、萨摩料理居酒屋之间选一个主方向；如果 D2 已经吃过重餐，D3 可以改成拉面、定食或轻量居酒屋。", lat: 31.5907, lng: 130.5556, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/G3%20Arcade%20of%20Temmonkan%20Shopping%20Street%20at%20night.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:G3_Arcade_of_Temmonkan_Shopping_Street_at_night.jpg" },

      { id: "D4-1", day: 4, kind: "transit", time: "10:44", name: "鹿儿岛中央站", note: "SAKURA 752 鹿儿岛中央 -> 博多。", lat: 31.5838, lng: 130.5411 },
      { id: "D4-2", day: 4, kind: "transit", time: "12:30", name: "博多站", note: "午餐、伴手礼。最稳选择是站内 AMU Plaza、阪急百货、KITTE、DEITOS。", lat: 33.5902, lng: 130.4207 },
      { id: "D4-3", day: 4, kind: "visit", featured: true, time: "13:30-14:20", name: "Canal City / 櫛田神社", note: "Canal City 是博多站附近最方便的综合商业体，适合最后补伴手礼、药妆或快速用餐；櫛田神社则是博多祇园山笠相关的重要神社，离商场步行可达。这段只能作为机动短逛，14:45 前必须回到博多站准备去机场。", lat: 33.5900, lng: 130.4107, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Kushida%20Shrine%20the%20torii%20and%20the%20R%C5%8Dmon%201-41%20Kami-kawabatamachi%20Hakata-ku%20Fukuoka%2020230801.jpg?width=700", photoSource: "https://commons.wikimedia.org/wiki/File:Kushida_Shrine_the_torii_and_the_R%C5%8Dmon_1-41_Kami-kawabatamachi_Hakata-ku_Fukuoka_20230801.jpg" },
      { id: "D4-4", day: 4, kind: "transit", time: "15:45", name: "福冈机场国际航站楼", note: "建议 16:00 前开始办理国际航班值机。", lat: 33.5849, lng: 130.4516 },
      { id: "D4-5", day: 4, kind: "transit", time: "18:00", name: "福冈机场国际航站楼", note: "9C6538 福冈 -> 上海浦东。", lat: 33.5849, lng: 130.4516 }
    ];

  const routeSegments = [
      {
        day: 1,
        mode: "airport-subway",
        label: "D1-1 -> D1-3 机场接驳 + 地铁空港线",
        routeTag: "接驳+地铁约25分",
        coords: [[33.5849, 130.4516], [33.5892, 130.4498], [33.5972, 130.4480], [33.5898, 130.4349], [33.5902, 130.4207]]
      },
      {
        day: 1,
        mode: "shinkansen",
        label: "D1-3 博多站 -> 熊本站",
        routeTag: "新干线约40分 / Pass",
        coords: [[33.5902, 130.4207], [33.3718, 130.4903], [33.3196, 130.5017], [33.1776, 130.4926], [33.0314, 130.4436], [32.9425, 130.5742], [32.7900, 130.6890]]
      },
      {
        day: 1,
        mode: "city",
        label: "熊本站 -> D1-4/D1-5/D1-6 熊本市内",
        coords: [[32.7900, 130.6890], [32.7956, 130.6983], [32.8020, 130.7036], [32.8050, 130.7034], [32.8062, 130.7058], [32.8024, 130.7110]]
      },
      {
        day: 2,
        mode: "city",
        label: "D2-1 -> D2-2 熊本市内返回熊本站",
        coords: [[32.7897, 130.7335], [32.7931, 130.7189], [32.7956, 130.6983], [32.7900, 130.6890]]
      },
      {
        day: 2,
        mode: "shinkansen",
        label: "D2-2 熊本站 -> D2-3 鹿儿岛中央站",
        routeTag: "新干线约57分 / Pass",
        coords: [[32.7900, 130.6890], [32.5070, 130.6340], [32.2109, 130.3975], [32.0899, 130.3580], [31.8138, 130.3125], [31.5838, 130.5411]]
      },
      {
        day: 2,
        mode: "city",
        label: "D2-3 -> D2-4 -> D2-5 鹿儿岛市内",
        coords: [[31.5838, 130.5411], [31.5907, 130.5556], [31.5967, 130.5507], [31.5907, 130.5556]]
      },
      {
        day: 3,
        mode: "city",
        label: "D3-6/酒店 -> D3-1 鹿儿岛港",
        coords: [[31.5907, 130.5556], [31.5939, 130.5608], [31.5960, 130.5652]]
      },
      {
        day: 3,
        mode: "ferry",
        label: "D3-1 鹿儿岛港 -> D3-2 樱岛港",
        routeTag: "渡轮约15分 / ¥250",
        coords: [[31.5960, 130.5652], [31.5942, 130.5818], [31.5921, 130.5998]]
      },
      {
        day: 3,
        mode: "bus",
        label: "D3-2 樱岛港 -> D3-3 汤之平展望所",
        routeTag: "Island View约60分",
        coords: [[31.5921, 130.5998], [31.5934, 130.6108], [31.5978, 130.6235], [31.6018, 130.6328]]
      },
      {
        day: 3,
        mode: "bus",
        label: "D3-3 -> D3-4 返回樱岛港",
        coords: [[31.6018, 130.6328], [31.5978, 130.6235], [31.5934, 130.6108], [31.5921, 130.5998]]
      },
      {
        day: 3,
        mode: "ferry",
        label: "D3-4 樱岛港 -> D3-1 鹿儿岛港",
        routeTag: "返程渡轮约15分",
        coords: [[31.5921, 130.5998], [31.5942, 130.5818], [31.5960, 130.5652]]
      },
      {
        day: 3,
        mode: "city",
        label: "D3-1 -> D3-5 鹿儿岛港 -> 仙岩园",
        coords: [[31.5960, 130.5652], [31.6049, 130.5694], [31.6171, 130.5770]]
      },
      {
        day: 3,
        mode: "city",
        label: "D3-5 -> D3-6 仙岩园 -> 天文馆",
        coords: [[31.6171, 130.5770], [31.6049, 130.5694], [31.5907, 130.5556]]
      },
      {
        day: 4,
        mode: "shinkansen",
        label: "D4-1 鹿儿岛中央站 -> D4-2 博多站",
        routeTag: "新干线约99分 / Pass",
        coords: [[31.5838, 130.5411], [31.8138, 130.3125], [32.0899, 130.3580], [32.2109, 130.3975], [32.5070, 130.6340], [32.7900, 130.6890], [32.9425, 130.5742], [33.0314, 130.4436], [33.1776, 130.4926], [33.3196, 130.5017], [33.3718, 130.4903], [33.5902, 130.4207]]
      },
      {
        day: 4,
        mode: "airport-subway",
        label: "D4-2 -> D4-3 博多短逛",
        coords: [[33.5902, 130.4207], [33.5900, 130.4107], [33.5902, 130.4207]]
      },
      {
        day: 4,
        mode: "airport-subway",
        label: "D4-2 博多站 -> D4-4 福冈机场国际航站楼",
        routeTag: "地铁约5分+接驳",
        coords: [[33.5902, 130.4207], [33.5898, 130.4349], [33.5972, 130.4480], [33.5892, 130.4498], [33.5849, 130.4516]]
      }
    ];

  window.TravelItineraries.kyushu = {
    days: [1, 2, 3, 4],
    points,
    routeSegments
  };
})();
