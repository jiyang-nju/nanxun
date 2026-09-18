# 素材来源

## 样例照片

以下图片由南京大学官网「南大风华」公开展示；原站未注明 Creative Commons 等开放许可，权利归原作者及相关权利人所有。本地开发样例不代表已获得公开再分发授权。正式公开发布前应换成自摄或授权图片。

| 本地文件                        | 场景                   | 来源                                        |
| ------------------------------- | ---------------------- | ------------------------------------------- |
| `public/photos/01.webp`         | 北大楼                 | https://www.nju.edu.cn/info/4041/422051.htm |
| `public/photos/02.webp`         | 大礼堂                 | https://www.nju.edu.cn/info/4041/422081.htm |
| `public/photos/03.webp`         | 东大楼                 | https://www.nju.edu.cn/info/4041/422061.htm |
| `public/photos/04.webp`         | 南京大学革命烈士纪念碑 | https://www.nju.edu.cn/info/4041/422111.htm |
| `public/photos/05.webp`         | 西大楼                 | https://www.nju.edu.cn/info/4041/422071.htm |
| `public/photos/xianlin/01.webp` | 杜厦图书馆             | https://www.nju.edu.cn/info/4031/421661.htm |
| `public/photos/xianlin/02.webp` | 行政南楼               | https://www.nju.edu.cn/info/4031/421721.htm |
| `public/photos/xianlin/03.webp` | 方肇周体育馆           | https://www.nju.edu.cn/info/4031/421711.htm |
| `public/photos/xianlin/04.webp` | 敬文学生活动中心       | https://www.nju.edu.cn/info/4031/421701.htm |
| `public/photos/xianlin/05.webp` | 二源广场               | https://www.nju.edu.cn/info/4031/421651.htm |

照片缩放至长边不超过 1600px，并转换为 WebP。游戏画面使用 `object-fit: cover` 裁切显示，放大弹窗可查看完整画幅。未消除原图署名。

原图 URL 见 `src/data/credits.json`。未使用 AI 生成的校园照片。

## 地图

参考：[南京大学资产管理处，鼓楼校区平面图，2024 年 3 月](https://zcc.nju.edu.cn/DFS/file/2024/09/20/20240920103404667kkasuw.pdf)。

游戏中的 SVG 地图是简化的位置示意，不包含原 PDF 文件，也不使用在线瓦片。形状和距离不具有测绘精度。大礼堂对应西大楼南侧地标，革命烈士纪念碑位于西大楼西南侧。

仙林参考：[南京大学资产管理处，仙林校区地图页面](https://zcc.nju.edu.cn/dzdt/xlxqdt/index.html)，其中的[导示图为 2025 年 10 月版本](https://zcc.nju.edu.cn/DFS/file/2025/10/31/20251031135649554qnxxha.jpg)。游戏手工重绘南部核心区，保留南雍大道、梦川、藜照湖、第一运动场与南大门等参照；原图未打包进项目。二源广场位置标在南雍大道南侧、金大路和中大路之间，与图书馆的答案点分开。

## 其他

界面使用系统字体；图标来自 lucide-react（ISC 许可）。成绩卡完全在本地 canvas 中绘制，不上传用户数据。
