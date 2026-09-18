// Hand-drawn schematic of the southern core, based on the university's 2025 plan.
// Coordinates use a simplified local plane; building footprints are approximate.
const buildings = [
  'M30 40L130 15L142 45L41 74Z',
  'M52 89L157 58L169 93L67 123Z',
  'M83 152L178 126L208 182L112 214Z',
  'M8 245L73 223L93 271L28 295Z',
  'M42 312L105 291L126 332L64 354Z',
  'M171 35L215 25L226 70L183 81Z',
  'M244 54L308 14L327 40L263 84Z',
  'M313 112L328 107L345 140L367 145L361 161L331 151Z',
  'M250 167L282 144L348 177L355 198L317 217L271 204Z',
  'M410 132L468 126L464 143L487 142L493 123L505 120L515 185L479 189L467 174L449 176L447 192L418 198L414 167L430 165L430 150L415 151Z',
  'M606 151L697 121L730 179L635 212Z',
  'M141 256L186 234L203 264L228 285L204 318L180 304L154 326L136 287Z',
  'M555 273L609 263L621 308L593 313L589 286L565 292L570 320L537 329L533 313L555 307Z',
  'M547 348L613 333L626 375L592 385L588 359L561 365L565 386L551 389Z',
  'M639 257L651 255L654 270L678 265L676 247L690 242L698 279L644 295Z',
  'M652 328L700 321L707 346L686 352L685 347L656 353Z',
  'M362 294L411 286L420 324L400 329L398 306L376 311L380 334L368 336Z',
  'M392 364L434 356L442 392L402 401L399 386L425 382L422 369L395 377Z',
  'M118 470L177 459L181 471L134 483L140 502L263 477L264 451L218 462L215 449L343 430L350 482L324 488L320 457L269 466L273 489L144 517L127 515Z',
  'M383 433L404 429L408 455L433 450L429 425L453 420L467 473L447 478L445 464L410 471L413 486L392 491Z',
  'M552 421L580 415L584 429L566 434L570 453L594 448L592 433L620 427L632 465L573 481L569 466L557 470Z',
  'M665 398L715 389L728 424L711 429L707 413L682 418L685 441L673 444Z',
  'M80 394L118 380L140 426L102 442Z',
];
const roads = [
  'M35 -30L111 118L150 203L111 237L164 356L185 448L234 543',
  'M192 -20L204 65L224 119L212 170L258 216L333 243L458 232L587 211L747 163',
  'M-50 238L124 204L179 226L205 256',
  'M173 465L740 349',
  'M146 536L527 493L849 397',
  'M88 581L555 533L905 404',
  'M268 220L234 271L283 451',
  'M331 265L369 507',
  'M459 265L501 505',
  'M498 264L535 501',
  'M609 224L663 479',
  'M727 181L779 315L836 421',
  'M800 77L925 392',
  'M312 87L399 114L582 91L716 48',
  'M381 123L399 216L519 200',
];
const lawns = [
  'M353 65L530 25L544 82L394 111Z',
  'M737 213L767 208L777 241L750 250Z',
  'M755 272L781 260L809 307L773 321Z',
  'M756 342L818 320L853 362L765 389Z',
  'M548 505L851 416L866 448L560 548Z',
  'M156 553L494 508L502 530L169 578Z',
  'M352 279L441 260L460 409L358 428Z',
  'M474 318L489 315L500 346L481 350Z',
  'M485 365L500 360L508 395L492 400Z',
  'M495 419L511 414L520 452L504 457Z',
];
export default function XianlinMapArt() {
  return (
    <>
      <defs>
        <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="#d9e1dc" strokeWidth=".65" />
        </pattern>
      </defs>
      <rect x="-1000" y="-1000" width="3000" height="3000" fill="#edf1ec" />
      <rect width="945" height="635" fill="url(#map-grid)" />
      <path
        d="M-40 70L726-40L911 396L885 455L548 571L153 605Z"
        fill="#f6f6f0"
        stroke="#ccd6ce"
        strokeDasharray="5 5"
      />
      {lawns.map((d, i) => (
        <path key={i} d={d} fill="#d6e2c8" stroke="#c5d4b6" strokeWidth="1.5" />
      ))}
      <path
        d="M79-20L146 126L186 182L247 215Q338 266 536 223Q584 223 569 175L554 119L525 120L529 176Q543 200 508 205Q348 241 265 205L205 162L157 114L106-20Z"
        fill="#b8dce0"
        stroke="#9fcbd2"
        strokeWidth="2"
      />
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {roads.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#d9ded8" strokeWidth={i === 5 ? 25 : 14} />
            <path d={d} stroke="#fffefa" strokeWidth={i === 5 ? 20 : 10} />
          </g>
        ))}
      </g>
      <g transform="rotate(-10 300 350)">
        <rect x="261" y="284" width="80" height="131" rx="35" fill="#d6bab0" />
        <rect x="267" y="290" width="68" height="119" rx="30" fill="none" stroke="#f4e5db" />
        <rect x="276" y="308" width="51" height="84" fill="#b9ce9e" stroke="#edf1df" />
        <path
          d="M276 350H327M287 308V321H314V308M287 392V379H314V392"
          fill="none"
          stroke="#f2f3e4"
        />
        <circle cx="301" cy="350" r="13" fill="none" stroke="#f2f3e4" />
      </g>
      <g fill="#d7d9df" stroke="#c3c6cf" strokeWidth="1.8" strokeLinejoin="round">
        {buildings.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path d="M474 263L489 260L500 303L480 310Z" fill="#e5ddcb" stroke="#d3c9b3" />
      <g fill="#b9ce9e" opacity=".8">
        {[
          [370, 208],
          [390, 229],
          [530, 273],
          [623, 251],
          [719, 302],
          [646, 380],
          [383, 262],
          [291, 111],
          [414, 525],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" />
        ))}
      </g>
      <g className="map-text" fill="#849080" textAnchor="middle" fontSize="15">
        <text x="293" y="347" transform="rotate(-10 293 347)">
          第一运动场
        </text>
        <text x="490" y="247" transform="rotate(-7 490 247)">
          南 雍 大 道
        </text>
        <text x="456" y="410" transform="rotate(-10 456 410)">
          两 江 路
        </text>
        <text x="478" y="515" transform="rotate(-7 478 515)">
          三 江 路
        </text>
        <text x="714" y="522" transform="rotate(-17 714 522)">
          仙 林 大 道
        </text>
        <text x="458" y="357" transform="rotate(81 458 357)">
          金大路
        </text>
        <text x="518" y="355" transform="rotate(81 518 355)">
          中大路
        </text>
        <text x="625" y="360" transform="rotate(78 625 360)">
          家化路
        </text>
        <text x="756" y="290" transform="rotate(78 756 290)">
          东大路
        </text>
        <text x="396" y="227" fill="#61969b" fontSize="13">
          梦 川
        </text>
        <text x="548" y="171" fill="#61969b" fontSize="13" transform="rotate(80 548 171)">
          藜照湖
        </text>
        <text x="374" y="204" fontSize="12">
          520 广场
        </text>
        <text x="522" y="536" fontSize="13">
          南大门
        </text>
        <text x="309" y="80" fontSize="12">
          学生公寓
        </text>
      </g>
    </>
  );
}
