export interface Point {
  x: number;
  y: number;
}
export interface Question {
  id: string;
  name: string;
  image: string;
  position: Point;
  hint: string;
  story: string;
  source: string;
}
export interface RoundResult {
  questionId: string;
  guess: Point;
  distance: number;
  score: number;
  hinted: boolean;
}
export const ROUND_COUNT = 5;
export const MAX_SCORE = 5000;
// Map-space units are an estimate based on the university's 2024 campus plan.
// This is NOT a georeferenced GPS map. Targets are landmark centers, not camera positions.
export const METERS_PER_UNIT = 0.8;
export const MAP_BOUNDS = { x: 435, y: 300, width: 635, height: 770 };
export function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y) * METERS_PER_UNIT;
}
export function scoreDistance(distance: number): number {
  if (!Number.isFinite(distance) || distance < 0) return 0;
  return distance <= 20
    ? MAX_SCORE
    : Math.max(0, Math.round(MAX_SCORE * Math.exp(-(distance - 20) / 110)));
}
export function shuffleQuestions<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function clampPoint(p: Point): Point {
  return {
    x: Math.max(MAP_BOUNDS.x, Math.min(MAP_BOUNDS.x + MAP_BOUNDS.width, p.x)),
    y: Math.max(MAP_BOUNDS.y, Math.min(MAP_BOUNDS.y + MAP_BOUNDS.height, p.y)),
  };
}
export function rankFor(score: number): { title: string; description: string } {
  if (score >= 22500) return { title: '鼓楼活地图', description: '一砖一瓦，都是你的主场。' };
  if (score >= 17500) return { title: '校园寻路人', description: '熟悉的风景，都藏在你的记忆里。' };
  if (score >= 10000) return { title: '梧桐漫游者', description: '再走一走，故事就会慢慢清晰。' };
  return { title: '初来寻南', description: '每一次迷路，都是认识南大的开始。' };
}
export function readBest(): number {
  try {
    const n = Number(localStorage.getItem('nanxun-best-v1'));
    return Number.isFinite(n) && n >= 0 && n <= 25000 ? n : 0;
  } catch {
    return 0;
  }
}
export function saveBest(score: number): void {
  try {
    localStorage.setItem('nanxun-best-v1', String(Math.max(readBest(), score)));
  } catch {
    /* Storage is optional; gameplay still works. */
  }
}
