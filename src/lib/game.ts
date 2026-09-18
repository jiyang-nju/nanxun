export interface Point {
  x: number;
  y: number;
}
export type CampusId = 'gulou' | 'xianlin';
export interface MapBounds extends Point {
  width: number;
  height: number;
}
export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  englishName: string;
  area: string;
  description: string;
  questions: Question[];
  map: {
    bounds: MapBounds;
    center: Point;
    metersPerUnit: number;
    source: { title: string; url: string };
  };
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
// Each campus uses its own schematic scale, not georeferenced GPS coordinates.
export function distanceBetween(a: Point, b: Point, metersPerUnit: number): number {
  return Math.hypot(a.x - b.x, a.y - b.y) * metersPerUnit;
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
export function clampPoint(p: Point, bounds: MapBounds): Point {
  return {
    x: Math.max(bounds.x, Math.min(bounds.x + bounds.width, p.x)),
    y: Math.max(bounds.y, Math.min(bounds.y + bounds.height, p.y)),
  };
}
export function rankFor(score: number, campusName: string): { title: string; description: string } {
  if (score >= 22500)
    return { title: `${campusName}活地图`, description: '一砖一瓦，都是你的主场。' };
  if (score >= 17500) return { title: '校园寻路人', description: '熟悉的风景，都藏在你的记忆里。' };
  if (score >= 10000) return { title: '梧桐漫游者', description: '再走一走，故事就会慢慢清晰。' };
  return { title: '初来寻南', description: '每一次迷路，都是认识南大的开始。' };
}
function validBest(value: string | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= ROUND_COUNT * MAX_SCORE ? n : 0;
}
export function readBest(campusId: CampusId): number {
  try {
    const current = validBest(localStorage.getItem(`nanxun-best-v2-${campusId}`));
    // The original game only had Gulou. Preserve that record without leaking it to Xianlin.
    const legacy = campusId === 'gulou' ? validBest(localStorage.getItem('nanxun-best-v1')) : 0;
    return Math.max(current, legacy);
  } catch {
    return 0;
  }
}
export function saveBest(campusId: CampusId, score: number): void {
  if (!Number.isFinite(score) || score < 0 || score > ROUND_COUNT * MAX_SCORE) return;
  try {
    localStorage.setItem(`nanxun-best-v2-${campusId}`, String(Math.max(readBest(campusId), score)));
  } catch {
    /* Storage is optional; gameplay still works. */
  }
}
export function readCampus(): CampusId {
  try {
    return localStorage.getItem('nanxun-campus-v1') === 'xianlin' ? 'xianlin' : 'gulou';
  } catch {
    return 'gulou';
  }
}
export function saveCampus(id: CampusId): void {
  try {
    localStorage.setItem('nanxun-campus-v1', id);
  } catch {
    /* Storage is optional. */
  }
}
