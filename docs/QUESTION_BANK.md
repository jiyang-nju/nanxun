# 题库维护指南

1. 用自摄或授权照片替换 `public/photos/01.webp`（鼓楼）或 `public/photos/xianlin/01.webp`（仙林）等文件。建议横向照片、长边 1600px、WebP 格式，保留足够环境细节。
2. 在 `src/data/questions.ts` 的 `gulouQuestions` 或 `xianlinQuestions` 中维护题目。图片路径写 `photos/...`，界面统一通过 `assetUrl()` 添加部署目录前缀。
3. `position` 是本校区的 SVG 平面坐标，不是经纬度。地图边界和距离估算比例在 `src/data/campuses.ts` 中配置，图形位于 `GulouMapArt.tsx` 和 `XianlinMapArt.tsx`。把建筑或广场中心作为答案，提示应与地图方位一致。
4. 在 `src/data/credits.json` 登记与题目一致的 `id`、`campus`、照片路径、来源、作者和许可。自己的照片可写明“本人拍摄，授权项目使用”。
5. 运行 `pnpm test` 和 `pnpm build`，在浏览器检查两个校区的选点、切换、答案连线、提示和成绩卡。

## 校区坐标

| 校区 | 坐标范围                 | 估算米 / 单位 | 当前覆盖       |
| ---- | ------------------------ | ------------- | -------------- |
| 鼓楼 | x=435..1070，y=300..1070 | 0.8           | 鼓楼北园       |
| 仙林 | x=0..945，y=0..635       | 1.2           | 仙林南部核心区 |

仙林局部坐标参照官方 2025 年 10 月导示图的南部区域手工绘制，非经纬度或等比例测绘。不要直接将一个校区的坐标复制到另一个校区。

## 题目格式

```ts
{
  id: 'xianlin-unique-landmark', // 全部校区之间也要唯一
  name: '地标名称',
  image: 'photos/xianlin/06.webp',
  position: { x: 480, y: 310 },
  hint: '不直接给出名称的方位提示。',
  story: '一两句你自己的校园记忆。',
  source: '原作者授权页面或素材来源',
}
```

每局固定 `ROUND_COUNT = 5`。初次进入取当前校区前 5 题；重玩用 Fisher–Yates 打乱后取 5 题。扩充题库时直接追加题目即可，不会让一局超过 5 题。完整性测试会检查照片文件、来源记录、题目 ID 和答案是否超出地图。

## 切换与记录

切换校区会重新创建一局，包括照片、落点、地图视野、提示、结算和成绩卡。已有落点、已看提示或已答题时会先确认，取消则保留进度。

最高分分别保存在 `nanxun-best-v2-gulou` 和 `nanxun-best-v2-xianlin`；鼓楼读取时兼容旧键 `nanxun-best-v1`。当前校区保存在 `nanxun-campus-v1`。刷新保留校区选择，但不会恢复进行中的一局。浏览器禁用存储时仍然可以正常游戏。

## 距离与精度

`distance = hypot(guess.x - answer.x, guess.y - answer.y) * campus.map.metersPerUnit`。

20 m 内满分，之后 `round(5000 * exp(-(distance - 20) / 110))`。距离是示意图估算值，不应显示为精确实测距离。

未来接入真实地图时，需要同时替换底图和坐标系统，统一照片目标与地图坐标基准，再采用地理距离公式。不要混用 WGS84、GCJ-02 或现有 SVG 平面坐标。
