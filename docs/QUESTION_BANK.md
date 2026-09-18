# 题库维护指南

1. 用自摄或授权照片替换 `public/photos/01.webp` 等文件，建议横向照片、长边 1600px、WebP 格式。保留足够环境细节，避免用整个文件名或 alt 属性直接泄露答案。
2. 编辑 `src/data/questions.ts` 中对应记录。`image` 用 `import.meta.env.BASE_URL` 开头以支持子目录部署。
3. `position` 是 `CampusMap.tsx` 的 SVG 平面坐标，不是经纬度。默认画布范围为 `MAP_BOUNDS`：x=435..1070，y=300..1070。把建筑中心作为答案，所有提示应与地图方位一致。
4. 在 `src/data/credits.json` 登记作者、来源、具体许可或授权情况及是否修改过。自己的照片可写明“本人拍摄，授权项目使用”，不要照搬样例的署名。
5. 运行 `pnpm test` 和 `pnpm build`，在浏览器走完一局，核对图片、答案连线、提示和成绩卡。

## 规则

每局目前固定 5 题，`ROUND_COUNT = 5`。现有题库也为 5 题，重玩通过 Fisher–Yates 算法打乱顺序。

如果扩展到 20 张，应让每局从题库中随机抽取不重复的 5 张，而不是直接将 20 张全部放入当前 `deck`：修改 `App.tsx` 的初始 deck 和 restart，使用 `shuffleQuestions(questions).slice(0, ROUND_COUNT)`；地图、成绩卡和来源记录随新题一起更新。

```ts
// 示例数据格式，请使用实际拍摄点对应的建筑坐标。
{
  id: 'unique-landmark-id',
  name: '地标名称',
  image: `${import.meta.env.BASE_URL}photos/06.webp`,
  position: { x: 800, y: 700 },
  hint: '不直接给出名称的方位提示。',
  story: '一两句你自己的校园记忆。',
  source: '原作者授权页面或素材来源',
}
```

## 距离与精度

`distance = hypot(guess.x - answer.x, guess.y - answer.y) * 0.8`。

20 m 内给满分，之后 `round(5000 * exp(-(distance - 20) / 110))`。这是示意地图玩法，没有真实经纬度或精确标定，不应当显示为精确实测距离。

未来接入真实地图时，需要同时替换底图和坐标系统，并统一照片目标与地图的坐标基准，再采用地理距离公式。不要混用 WGS84、GCJ-02 或现有 SVG 平面坐标。
