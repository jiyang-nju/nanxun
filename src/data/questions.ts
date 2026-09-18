import type { Question } from '../lib/game';
const photo = (n: string) => `${import.meta.env.BASE_URL}photos/${n}.webp`;
export const questions: Question[] = [
  {
    id: 'north-building',
    name: '北大楼',
    image: photo('01'),
    position: { x: 833, y: 562 },
    hint: '抬头看看那座塔楼。它在北园东侧的建筑群中，面对着一片草坪。',
    story:
      '塔楼、青砖和爬山虎，是许多人关于南大的第一帧记忆。换个季节再来，同一座楼也会有不同的表情。',
    source: 'https://www.nju.edu.cn/info/4041/422051.htm',
  },
  {
    id: 'great-hall',
    name: '大礼堂',
    image: photo('02'),
    position: { x: 786, y: 698 },
    hint: '它在西大楼南边，南高路与两江路之间。',
    story: '屋檐下是校园里的相聚时刻。典礼、演出与掌声，让一栋建筑有了共同的记忆。',
    source: 'https://www.nju.edu.cn/info/4041/422081.htm',
  },
  {
    id: 'east-building',
    name: '东大楼',
    image: photo('03'),
    position: { x: 909, y: 619 },
    hint: '名字里藏着方位：在北大楼前草坪的东侧，与另一座楼隔草坪相望。',
    story: '草坪两侧的建筑像安静的老朋友。走得太匆忙时，容易错过屋顶和窗边的细节。',
    source: 'https://www.nju.edu.cn/info/4041/422061.htm',
  },
  {
    id: 'memorial',
    name: '革命烈士纪念碑',
    image: photo('04'),
    position: { x: 735, y: 674 },
    hint: '它在运动场东南侧、西大楼西南角的小片绿地中。',
    story: '在草木之间停下脚步，向那些被校园记住的名字致意。',
    source: 'https://www.nju.edu.cn/info/4041/422111.htm',
  },
  {
    id: 'west-building',
    name: '西大楼',
    image: photo('05'),
    position: { x: 780, y: 633 },
    hint: '它在北大楼前草坪的西边，再往西就是运动场。',
    story: '沿着草坪向西走，熟悉的楼影会在树叶间出现。你认出的是建筑，还是某次路过的午后？',
    source: 'https://www.nju.edu.cn/info/4041/422071.htm',
  },
];
