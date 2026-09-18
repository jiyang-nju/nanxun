import { useRef, useState } from 'react';
import { LocateFixed, Minus, Plus } from 'lucide-react';
import { clampPoint } from '../lib/game';
import GulouMapArt from './GulouMapArt';
import XianlinMapArt from './XianlinMapArt';
import type { Campus, MapBounds, Point } from '../lib/game';

type View = MapBounds;
interface Props {
  campus: Campus;
  guess: Point | null;
  answer?: Point;
  onGuess: (p: Point) => void;
}
function bounded(view: View, bounds: MapBounds): View {
  return {
    ...view,
    x: Math.max(bounds.x, Math.min(bounds.x + bounds.width - view.width, view.x)),
    y: Math.max(bounds.y, Math.min(bounds.y + bounds.height - view.height, view.y)),
  };
}
export default function CampusMap({ campus, guess, answer, onGuess }: Props) {
  const { bounds, center } = campus.map;
  const svg = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>(bounds);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    x: number;
    y: number;
    start: View;
    matrix: DOMMatrix;
    moved: boolean;
  } | null>(null);
  const scale = bounds.width / view.width;
  function position(clientX: number, clientY: number, matrix?: DOMMatrix): Point {
    const point = new DOMPoint(clientX, clientY);
    const inverse = matrix ?? svg.current!.getScreenCTM()!.inverse();
    return point.matrixTransform(inverse);
  }
  function zoom(factor: number) {
    const newScale = Math.max(1, Math.min(3.5, scale * factor));
    const width = bounds.width / newScale,
      height = bounds.height / newScale;
    const focus = guess ?? center;
    setView(bounded({ x: focus.x - width / 2, y: focus.y - height / 2, width, height }, bounds));
  }
  return (
    <div className={`map-shell ${answer ? 'map-revealed' : ''}`}>
      <div className="map-caption">
        <span className="map-dot" /> {campus.area} <span>示意地图</span>
      </div>
      <div className="map-compass" aria-hidden="true">
        <span>N</span>
        <i />
      </div>
      <svg
        ref={svg}
        data-testid="campus-map"
        className={dragging ? 'campus-map dragging' : 'campus-map'}
        viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
        preserveAspectRatio={campus.id === 'xianlin' ? 'xMidYMid meet' : 'xMidYMid slice'}
        role="application"
        aria-label="校园选点地图。点击选择位置，拖动平移。键盘方向键移动落点，Shift 加速。"
        tabIndex={0}
        onKeyDown={(e) => {
          if (answer) return;
          const step = e.shiftKey ? 25 : 5;
          const p = guess ?? center;
          const moves: Record<string, Point> = {
            ArrowUp: { x: p.x, y: p.y - step },
            ArrowDown: { x: p.x, y: p.y + step },
            ArrowLeft: { x: p.x - step, y: p.y },
            ArrowRight: { x: p.x + step, y: p.y },
            Enter: p,
            ' ': p,
          };
          if (moves[e.key]) {
            e.preventDefault();
            const next = clampPoint(moves[e.key], bounds);
            onGuess(next);
            setView((v) =>
              bounded({ ...v, x: next.x - v.width / 2, y: next.y - v.height / 2 }, bounds),
            );
          }
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          svg.current!.setPointerCapture(e.pointerId);
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            start: view,
            matrix: svg.current!.getScreenCTM()!.inverse(),
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5) d.moved = true;
          if (d.moved) {
            setDragging(true);
            const start = position(d.x, d.y, d.matrix),
              now = position(e.clientX, e.clientY, d.matrix);
            setView(
              bounded(
                {
                  ...d.start,
                  x: d.start.x - (now.x - start.x),
                  y: d.start.y - (now.y - start.y),
                },
                bounds,
              ),
            );
          }
        }}
        onPointerUp={(e) => {
          if (drag.current && !drag.current.moved && !answer)
            onGuess(clampPoint(position(e.clientX, e.clientY), bounds));
          drag.current = null;
          setDragging(false);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(false);
        }}
      >
        {campus.id === 'gulou' ? <GulouMapArt /> : <XianlinMapArt />}
        {answer && guess && (
          <line
            x1={guess.x}
            y1={guess.y}
            x2={answer.x}
            y2={answer.y}
            stroke="#73448f"
            strokeWidth={3 / scale}
            strokeDasharray={`${7 / scale} ${5 / scale}`}
          />
        )}
        {answer && (
          <g transform={`translate(${answer.x} ${answer.y}) scale(${1 / scale})`}>
            <circle r="24" fill="#31977b" opacity=".16" />
            <circle r="11" fill="#31977b" stroke="white" strokeWidth="3" />
            <path d="M-4 0L-1 3L5-4" fill="none" stroke="white" strokeWidth="2" />
          </g>
        )}
        {guess && (
          <g
            transform={`translate(${guess.x} ${guess.y}) scale(${1 / scale})`}
            className="guess-marker"
          >
            <ellipse rx="12" ry="4" cy="4" fill="#55366f" opacity=".15" />
            <path
              d="M0 0C-4-6-16-14-16-25a16 16 0 0 1 32 0C16-14 4-6 0 0Z"
              fill="#754395"
              stroke="white"
              strokeWidth="3"
            />
            <circle cy="-25" r="5" fill="white" />
          </g>
        )}
      </svg>
      <div className="map-controls">
        <button onClick={() => zoom(1.5)} disabled={scale >= 3.49} aria-label="放大地图">
          <Plus size={18} />
        </button>
        <button onClick={() => zoom(1 / 1.5)} disabled={scale <= 1} aria-label="缩小地图">
          <Minus size={18} />
        </button>
        <button onClick={() => setView(bounds)} aria-label="重置地图视野">
          <LocateFixed size={18} />
        </button>
      </div>
      <div className="map-bottom">
        <span>
          {answer ? (
            <>
              <i className="legend-purple" />
              你的落点 <i className="legend-green" />
              地标位置
            </>
          ) : (
            '点击落点 · 拖动探索'
          )}
        </span>
        <span className="scale-label">校园示意 · 非导航</span>
      </div>
    </div>
  );
}
