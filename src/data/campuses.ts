import type { Campus } from '../lib/game.ts';
import { gulouQuestions, xianlinQuestions } from './questions.ts';

export const campuses: Campus[] = [
  {
    id: 'gulou',
    name: '鼓楼校区',
    shortName: '鼓楼',
    englishName: 'GULOU CAMPUS',
    area: '鼓楼北园',
    description: '老楼与梧桐',
    questions: gulouQuestions,
    map: {
      bounds: { x: 435, y: 300, width: 635, height: 770 },
      center: { x: 820, y: 650 },
      metersPerUnit: 0.8,
      source: {
        title: '南京大学鼓楼校区平面图（2024）',
        url: 'https://zcc.nju.edu.cn/DFS/file/2024/09/20/20240920103404667kkasuw.pdf',
      },
    },
  },
  {
    id: 'xianlin',
    name: '仙林校区',
    shortName: '仙林',
    englishName: 'XIANLIN CAMPUS',
    area: '仙林南部核心区',
    description: '湖畔与书声',
    questions: xianlinQuestions,
    map: {
      bounds: { x: 0, y: 0, width: 945, height: 635 },
      center: { x: 480, y: 310 },
      metersPerUnit: 1.2,
      source: {
        title: '南京大学仙林校区导示图（2025）',
        url: 'https://zcc.nju.edu.cn/dzdt/xlxqdt/index.html',
      },
    },
  },
];
