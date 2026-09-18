const buildings = [
  'M509 349H566V397H509Z',
  'M521 418H596V443H521Z',
  'M641 398H692V438H641Z',
  'M701 429L729 422L749 501L718 510Z',
  'M697 532L752 522L750 534L699 544Z',
  'M767 515L830 504L833 524L767 535Z',
  'M875 432L913 427L917 448L878 453Z',
  'M900 500L918 498L925 539L907 542Z',
  'M797 552L870 538L880 569L804 581Z',
  'M762 605L787 599L801 660L775 666Z',
  'M892 587L915 582L928 642L903 648Z',
  'M733 551L749 549L755 584L738 587Z',
  'M706 600L720 596L734 658L719 661Z',
  'M717 665L746 659L751 681L722 688Z',
  'M766 689L800 682L808 706L773 714Z',
  'M908 667L966 660L972 684L914 692Z',
  'M911 712L968 701L975 727L952 733L963 785L985 781L989 805L928 818L923 793L941 790L930 738L916 741Z',
  'M671 742L795 722L800 744L677 764Z',
  'M782 775L812 768L818 792L790 799Z',
  'M543 770L588 761L591 779L575 783L586 840L606 836L610 855L565 864L560 844L572 842L560 785L548 790Z',
  'M623 844L696 830L700 849L628 864Z',
  'M568 909L608 900L618 943L578 951Z',
  'M630 895L686 883L690 901L645 912L650 945L690 936L695 955L639 967Z',
  'M703 916L720 911L728 950L711 955Z',
  'M814 865L842 858L858 962L830 968Z',
  'M854 884L886 878L892 900L860 907Z',
  'M878 929L902 923L909 950L885 957Z',
  'M953 899L982 893L988 920L959 928Z',
  'M966 944L996 938L1001 962L972 970Z',
];
const lawns = [
  'M697 550L726 543L734 589L709 594Z',
  'M754 546L785 541L796 583L762 590Z',
  'M803 592L837 584L843 615L808 623Z',
  'M843 583L876 578L882 610L850 618Z',
  'M809 632L844 625L850 660L816 670Z',
  'M852 627L883 620L890 655L859 663Z',
  'M700 606L733 597L744 648L712 659Z',
  'M815 679L844 672L859 735L829 742Z',
  'M852 674L882 668L895 729L865 735Z',
  'M722 766L765 756L777 814L735 824Z',
  'M837 757L869 750L881 804L850 812Z',
  'M744 861L789 851L811 969L764 978Z',
  'M686 1050L745 1041L750 1068H688Z',
];
const roads = [
  'M410 281Q660 308 951 255',
  'M420 760Q651 706 941 663',
  'M481 1044L1040 976',
  'M503 334L504 670L527 703L548 989',
  'M615 329L613 449L634 689',
  'M660 418L647 467L685 690L730 990',
  'M695 553L925 514',
  'M746 529L760 603L774 669',
  'M884 477L891 566L913 674L966 988',
  'M648 775L916 728',
  'M616 881L933 819',
  'M835 580L855 681L893 817',
  'M681 863L703 979',
  'M995 401L956 296M951 406L1053 1013',
];
export default function GulouMapArt() {
  return (
    <>
      <defs>
        <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="#d9e1dc" strokeWidth=".65" />
        </pattern>
      </defs>
      <rect x="300" y="150" width="950" height="1100" fill="#edf1ec" />
      <rect x="300" y="150" width="950" height="1100" fill="url(#map-grid)" />
      <path
        d="M495 312L611 312L646 389L691 415L748 497L916 467L1008 972L550 1040L507 724Z"
        fill="#f6f6f0"
        stroke="#ccd6ce"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      {lawns.map((d, i) => (
        <path key={`l${i}`} d={d} fill="#d6e2c8" stroke="#c5d4b6" strokeWidth="1.5" />
      ))}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {roads.map((d, i) => (
          <g key={`r${i}`}>
            <path d={d} stroke="#d9ded8" strokeWidth={i === 0 || i === 2 ? 24 : 14} />
            <path d={d} stroke="#fffefa" strokeWidth={i === 0 || i === 2 ? 19 : 10} />
          </g>
        ))}
      </g>
      <g transform="rotate(-8 592 585)">
        <rect x="535" y="480" width="110" height="205" rx="52" fill="#d6bab0" />
        <rect x="546" y="491" width="88" height="183" rx="42" fill="none" stroke="#f4e5db" />
        <rect x="555" y="510" width="70" height="145" fill="#b9ce9e" stroke="#edf1df" />
        <path
          d="M555 582H625M577 510V527H604V510M577 655V638H604V655"
          fill="none"
          stroke="#f2f3e4"
        />
        <circle cx="590" cy="582" r="17" fill="none" stroke="#f2f3e4" />
      </g>
      <g fill="#d7d9df" stroke="#c3c6cf" strokeWidth="1.8" strokeLinejoin="round">
        {buildings.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="#8f9b85" opacity=".45">
        {[
          [692, 713],
          [816, 678],
          [875, 570],
          [742, 706],
          [916, 698],
          [852, 838],
          [807, 840],
          [889, 850],
          [751, 838],
          [640, 761],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" />
        ))}
      </g>
      <g className="map-text" fill="#8a9287" textAnchor="middle" fontSize="13">
        <text x="594" y="588" transform="rotate(-8 594 588)">
          苏浙运动场
        </text>
        <text x="677" y="711" transform="rotate(-10 677 711)">
          南 高 路
        </text>
        <text x="846" y="752" transform="rotate(-10 846 752)">
          两 江 路
        </text>
        <text x="704" y="858" transform="rotate(-10 704 858)">
          三 江 路
        </text>
        <text x="794" y="1010" transform="rotate(-8 794 1010)">
          汉 口 路
        </text>
        <text x="999" y="720" transform="rotate(79 999 720)">
          天 津 路
        </text>
        <text x="835" y="650" transform="rotate(81 835 650)">
          金 大 路
        </text>
        <text x="570" y="813" transform="rotate(80 570 813)">
          图书馆
        </text>
        <text x="872" y="975" fontSize="11">
          汉口路校门
        </text>
        <text x="832" y="607" fontSize="11" fill="#7a946a">
          大草坪
        </text>
        <text x="583" y="373" fontSize="11">
          费彝民楼
        </text>
      </g>
    </>
  );
}
