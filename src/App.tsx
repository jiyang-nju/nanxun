import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  CircleHelp,
  Compass,
  Download,
  Flag,
  Image as ImageIcon,
  Lightbulb,
  MapPin,
  Maximize2,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import CampusMap from './components/CampusMap';
import Modal from './components/Modal';
import { questions } from './data/questions';
import credits from './data/credits.json';
import {
  distanceBetween,
  rankFor,
  readBest,
  ROUND_COUNT,
  saveBest,
  scoreDistance,
  shuffleQuestions,
} from './lib/game';
import type { Point, Question, RoundResult } from './lib/game';
import { createScorecard } from './lib/scorecard';

type Dialog = 'rules' | 'credits' | 'photo' | 'restart' | 'scorecard' | null;
const number = (n: number) => n.toLocaleString('en-US');
function Photo({
  question,
  round,
  revealed,
  onZoom,
}: {
  question: Question;
  round: number;
  revealed: boolean;
  onZoom: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [retry, setRetry] = useState(0);
  return (
    <div className={`photo-frame ${loaded ? 'is-loaded' : ''}`}>
      {!failed && (
        <img
          className="question-photo"
          src={`${question.image}${retry ? `?retry=${retry}` : ''}`}
          alt={revealed ? question.name : `第 ${round + 1} 轮待猜的鼓楼校园风景`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="image-error">
          <ImageIcon size={36} />
          <h3>这张风景暂时没能加载</h3>
          <button
            className="button secondary"
            onClick={() => {
              setFailed(false);
              setRetry((n) => n + 1);
            }}
          >
            重新加载
          </button>
        </div>
      )}
      <div className="photo-top">
        <span className="photo-badge">
          <span /> GULOU CAMPUS
        </span>
        <button
          className="photo-expand"
          aria-label="放大查看照片"
          onClick={onZoom}
          disabled={failed}
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <div className="photo-bottom">
        <div className="photo-index">
          {String(round + 1).padStart(2, '0')}
          <span> / 05</span>
        </div>
        <p>{revealed ? question.name : '留意屋檐、树影，还有走过的路。'}</p>
        <span className="photo-corner">南 / 寻</span>
      </div>
    </div>
  );
}
export default function App() {
  const [deck, setDeck] = useState<Question[]>(questions);
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState<Point | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [hint, setHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [best, setBest] = useState(readBest);
  const [scorecard, setScorecard] = useState('');
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const heading = useRef<HTMLHeadingElement>(null);
  const question = deck[round];
  const result = results[round];
  const total = results.reduce((sum, r) => sum + r.score, 0);
  const rank = rankFor(total);
  useEffect(() => {
    if (!finished) {
      const image = new Image();
      image.src = deck[(round + 1) % deck.length].image;
    }
  }, [round, deck, finished]);
  function submit() {
    if (!guess || result || finished) return;
    const distance = distanceBetween(guess, question.position);
    setResults((prev) =>
      prev.length === round
        ? [
            ...prev,
            {
              questionId: question.id,
              guess,
              distance,
              score: scoreDistance(distance),
              hinted: hintUsed,
            },
          ]
        : prev,
    );
  }
  function next() {
    if (round === ROUND_COUNT - 1) {
      saveBest(total);
      setBest(Math.max(best, total));
      setFinished(true);
    } else {
      setRound((n) => n + 1);
      setGuess(null);
      setHint(false);
      setHintUsed(false);
    }
    requestAnimationFrame(() => heading.current?.focus());
  }
  function restart() {
    setDeck(shuffleQuestions(questions));
    setRound(0);
    setGuess(null);
    setResults([]);
    setHint(false);
    setHintUsed(false);
    setFinished(false);
    setDialog(null);
    setDownloadState('idle');
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function download() {
    setDownloadState('loading');
    try {
      const image = await createScorecard(results, questions);
      setScorecard(image);
      setDialog('scorecard');
      setDownloadState('done');
    } catch {
      setDownloadState('error');
    }
  }
  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">
              <span>N</span>
              <i />
            </div>
            <div>
              <strong>南寻</strong>
              <span>NJU GUESSR</span>
            </div>
          </div>
          <div className="campus-pill">
            <MapPin size={15} />
            <span>南京大学 · 鼓楼校区</span>
            <span className="edition">初遇篇</span>
          </div>
          <button className="text-button rule-button" onClick={() => setDialog('rules')}>
            <CircleHelp size={18} />
            <span>怎么玩</span>
          </button>
        </div>
      </header>
      <main className="main-content">
        {!finished ? (
          <>
            <section className="game-heading">
              <div>
                <div className="eyebrow">
                  <span /> 跟着记忆，重逢校园
                </div>
                <h1 tabIndex={-1} ref={heading}>
                  这一眼，<span>你在南哪儿？</span>
                </h1>
                <p>看一张照片，在地图上标记你记忆里的位置。</p>
              </div>
              <div className="score-summary">
                <div className="score-icon">
                  <Trophy size={23} strokeWidth={1.6} />
                </div>
                <div>
                  <span>本局得分</span>
                  <strong>
                    {number(total)}
                    <small> / 25,000</small>
                  </strong>
                </div>
              </div>
            </section>
            <div className="round-strip">
              <div className="round-title">
                <span className="tiny-compass">
                  <Compass size={18} />
                </span>
                <strong>鼓楼漫游</strong>
                <span className="round-separator" />
                <span>第 {round + 1} / 5 站</span>
              </div>
              <ol className="round-dots" aria-label="挑战进度">
                {deck.map((q, i) => (
                  <li
                    key={q.id}
                    className={`${i === round ? 'current ' : ''}${results[i] ? 'complete' : ''}`}
                    aria-current={i === round ? 'step' : undefined}
                  >
                    <span>{results[i] ? <Check size={12} /> : i + 1}</span>
                    <em>{i === round ? '正在寻觅' : ''}</em>
                  </li>
                ))}
              </ol>
              <span className="relax-note">不赶时间，慢慢寻找。</span>
            </div>
            <section className="game-grid">
              <div className="photo-column">
                <Photo
                  key={question.id}
                  question={question}
                  round={round}
                  revealed={!!result}
                  onZoom={() => setDialog('photo')}
                />
                <div className={`photo-note ${result ? 'revealed-note' : ''}`}>
                  <span className="note-icon">
                    {result ? <MapPin size={20} /> : <Lightbulb size={20} />}
                  </span>
                  <div>
                    {result ? (
                      <>
                        <h3>原来是这里 · {question.name}</h3>
                        <p>{question.story}</p>
                      </>
                    ) : (
                      <>
                        <h3>每一处风景，都有迹可循</h3>
                        <p>从建筑轮廓到窗前的树，找找那些让你觉得熟悉的细节。</p>
                      </>
                    )}
                  </div>
                  {!result && (
                    <button
                      className="hint-button"
                      onClick={() => {
                        setHint((v) => !v);
                        setHintUsed(true);
                      }}
                      aria-expanded={hint}
                    >
                      {hint ? '收起提示' : '给点提示'}
                      <Sparkles size={15} />
                    </button>
                  )}
                </div>
                {hint && !result && (
                  <div className="hint-box" role="status">
                    <Lightbulb size={16} />
                    <span>{question.hint}</span>
                  </div>
                )}
              </div>
              <div className="guess-column">
                <div className="guess-panel">
                  <div className="panel-heading">
                    <div className="panel-icon">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h2>{result ? '看看，离记忆有多近' : '把记忆，落在地图上'}</h2>
                      <p>
                        {result ? '紫色是你的落点，绿色是地标位置' : '点击地图，放下你的定位标记'}
                      </p>
                    </div>
                  </div>
                  <CampusMap
                    key={question.id}
                    guess={guess}
                    answer={result ? question.position : undefined}
                    onGuess={setGuess}
                  />
                  <div className="guess-action" aria-live="polite">
                    {result ? (
                      <>
                        <div className="round-result">
                          <div>
                            <span>估算距离</span>
                            <strong>
                              {Math.round(result.distance)}
                              <small> m</small>
                            </strong>
                          </div>
                          <div>
                            <span>{result.score === 5000 ? '就在这里！' : '本轮得分'}</span>
                            <strong className="purple">+{number(result.score)}</strong>
                          </div>
                        </div>
                        <button className="button primary" onClick={next}>
                          {round === 4 ? '查看我的成绩' : '继续下一站'}
                          <ArrowRight size={19} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="selection-status">
                          <span className={guess ? 'selected-dot' : 'empty-dot'} />
                          {guess ? '已选好位置，也可以继续调整' : '先在地图上选一个位置'}
                          <span>每轮最高 5,000 分</span>
                        </div>
                        <button className="button primary" disabled={!guess} onClick={submit}>
                          <Flag size={18} />
                          就选这里
                          <ArrowRight size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="map-disclaimer">距离按示意图估算 · 地标周围约 20 m 内满分</p>
              </div>
            </section>
            <div className="game-bottom">
              <div>
                <span className="mini-line" /> 五张照片，一场校园漫游。
              </div>
              <button className="text-button" onClick={() => setDialog('restart')}>
                <RotateCcw size={15} />
                重新开始
              </button>
            </div>
          </>
        ) : (
          <section className="results-page">
            <div className="results-intro">
              <div className="eyebrow">GULOU CAMPUS · 漫游完成</div>
              <div className="award-icon">
                <Award size={46} strokeWidth={1.3} />
              </div>
              <h1 tabIndex={-1} ref={heading}>
                {rank.title}
              </h1>
              <p>{rank.description}</p>
            </div>
            <div className="final-score">
              <span>{number(total)}</span>
              <small> / 25,000</small>
            </div>
            <div className="result-stats">
              <span>
                <Flag size={16} />
                完成 5 / 5 站
              </span>
              <span>
                <Trophy size={16} />
                本机最高 {number(best)}
              </span>
              <span>
                <Lightbulb size={16} />
                使用 {results.filter((r) => r.hinted).length} 次提示
              </span>
            </div>
            <div className="journey-list">
              <div className="journey-heading">
                <h2>这一程，走过的风景</h2>
                <span>估算距离 / 本轮得分</span>
              </div>
              {results.map((r, i) => {
                const q = questions.find((q) => q.id === r.questionId)!;
                return (
                  <div className="journey-row" key={r.questionId}>
                    <span className="journey-number">0{i + 1}</span>
                    <img src={q.image} alt="" />
                    <div className="journey-place">
                      <h3>{q.name}</h3>
                      <span>
                        {r.score === 5000
                          ? '准确抵达'
                          : r.score >= 3000
                            ? '已经很近了'
                            : '下次再走近一点'}
                      </span>
                    </div>
                    <span className="journey-distance">约 {Math.round(r.distance)} m</span>
                    <strong>
                      {number(r.score)}
                      <small> 分</small>
                    </strong>
                  </div>
                );
              })}
            </div>
            <div className="results-actions">
              <button className="button primary" onClick={restart}>
                <RotateCcw size={18} />
                再寻一次
                <ArrowRight size={18} />
              </button>
              <button
                className="button secondary"
                onClick={download}
                disabled={downloadState === 'loading'}
              >
                <Download size={18} />
                {downloadState === 'loading' ? '正在制作…' : '保存成绩卡'}
              </button>
            </div>
            <p className="download-status" role="status">
              {downloadState === 'done'
                ? '成绩卡已生成，可以预览或保存。'
                : downloadState === 'error'
                  ? '图片生成失败，请重试或截图保存成绩。'
                  : '把这一程收进口袋，再去校园里走一走。'}
            </p>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <span>
          南寻 <span className="footer-divider">/</span> 你走过的南大，还认得吗？
        </span>
        <div>
          <button onClick={() => setDialog('credits')}>
            照片与地图来源
            <ArrowUpRight size={13} />
          </button>
          <span>Made for NJUers</span>
        </div>
      </footer>
      {dialog === 'rules' && (
        <Modal title="一起，寻一寻南大" onClose={() => setDialog(null)}>
          <div className="rules-content">
            <div>
              <span>01</span>
              <section>
                <h3>看风景</h3>
                <p>每局 5 张鼓楼校区照片。留意建筑和周围环境，也可以放大照片或查看提示。</p>
              </section>
            </div>
            <div>
              <span>02</span>
              <section>
                <h3>落下你的标记</h3>
                <p>
                  点击地图猜建筑的位置，支持缩放和拖动。键盘方向键也能移动标记，按住 Shift
                  移动更快。
                </p>
              </section>
            </div>
            <div>
              <span>03</span>
              <section>
                <h3>让记忆给你答案</h3>
                <p>
                  每轮最高 5,000 分。距地标约 20 m
                  内满分，此后分数随距离递减。提示不扣分，结算时会记录使用次数。
                </p>
              </section>
            </div>
            <p className="rules-footnote">
              这是鼓楼北园的入门练习题库。地图为校园平面示意，位置经过人工标注，距离仅作游戏估算；答案对应建筑位置，不是摄影师的拍摄点。最高分只保存在当前浏览器。
            </p>
            <button className="button primary" onClick={() => setDialog(null)}>
              知道了，开始寻找
              <ArrowRight size={18} />
            </button>
          </div>
        </Modal>
      )}
      {dialog === 'credits' && (
        <Modal title="风景从哪里来" onClose={() => setDialog(null)}>
          <div className="credits-content">
            <p>
              当前使用南京大学「南大风华」的公开校园照片作本地开发样例，版权归原作者及相关权利人所有。原站未注明开放许可；公开发布前请换成自摄或已获授权的素材。
            </p>
            <div className="credit-list">
              {credits.map((c) => (
                <a key={c.id} href={c.source} target="_blank" rel="noreferrer">
                  <span>{c.name}</span>
                  <span>
                    南京大学
                    <ArrowUpRight size={15} />
                  </span>
                </a>
              ))}
            </div>
            <p>照片经过缩放、WebP 格式转换，页面中可能裁切显示。</p>
            <a
              className="map-source"
              href="https://zcc.nju.edu.cn/DFS/file/2024/09/20/20240920103404667kkasuw.pdf"
              target="_blank"
              rel="noreferrer"
            >
              地图位置参考：南京大学鼓楼校区平面图（2024）
              <ArrowUpRight size={16} />
            </a>
            <p>本项目为学生校园小游戏，与南京大学官方无隶属关系。</p>
          </div>
        </Modal>
      )}
      {dialog === 'photo' && (
        <Modal
          title={result ? question.name : `第 ${round + 1} 站 · 仔细看看`}
          wide
          onClose={() => setDialog(null)}
        >
          <img
            className="full-photo"
            src={question.image}
            alt={result ? question.name : '本轮校园风景放大图'}
          />
          <p className="photo-modal-note">
            <ArrowDown size={14} />
            观察细节后，关闭照片回到地图选点。
          </p>
        </Modal>
      )}
      {dialog === 'scorecard' && (
        <Modal title="收好这段校园记忆" onClose={() => setDialog(null)}>
          <img className="scorecard-preview" src={scorecard} alt="南寻鼓楼漫游成绩卡" />
          <a
            className="button primary download-link"
            href={scorecard}
            download={`南寻-鼓楼漫游-${total}分.png`}
          >
            <Download size={18} />
            下载 PNG 成绩卡
          </a>
          <p className="save-note">也可以长按或右键图片，保存这段校园记忆。</p>
        </Modal>
      )}
      {dialog === 'restart' && (
        <Modal title="重新出发？" onClose={() => setDialog(null)}>
          <p className="restart-copy">这局的进度将被清空，5 张照片会重新排序。</p>
          <div className="confirm-actions">
            <button className="button secondary" onClick={() => setDialog(null)}>
              继续这一局
            </button>
            <button className="button primary" onClick={restart}>
              重新开始
              <ArrowRight size={18} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
