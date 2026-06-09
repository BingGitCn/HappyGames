const GAMES_DATA = [
  {
    id: 1,
    name: "超级玛丽",
    year: 1985,
    genre: "平台游戏",
    publisher: "任天堂",
    players: 1,
    description: "任天堂最具代表性的经典游戏，水管工马里奥踏上拯救公主的冒险之旅。踩蘑菇、吃金币、钻水管，横版过关游戏的鼻祖。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0000超级玛丽.nes"
  },
  {
    id: 2,
    name: "魂斗罗1",
    year: 1988,
    genre: "射击游戏",
    publisher: "Konami",
    players: 2,
    description: "经典双人合作射击游戏，比尔和兰斯深入敌军基地消灭外星异形。30条命秘籍 ↑↑↓↓←→←→BA 堪称游戏界最著名的秘籍。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0001魂斗罗1.nes"
  },
  {
    id: 3,
    name: "坦克大战1",
    year: 1985,
    genre: "射击游戏",
    publisher: "Namco",
    players: 2,
    description: "驾驶坦克保卫基地，消灭所有敌方坦克即可过关。支持双人合作，还有经典的自建关卡模式。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0139坦克大战1.nes"
  },
  {
    id: 4,
    name: "冒险岛3",
    year: 1992,
    genre: "平台游戏",
    publisher: "Hudson",
    players: 1,
    description: "高桥名人的冒险岛系列第三代，骑乘各种恐龙伙伴穿越丛林、火山、海洋等多样关卡，画面和玩法全面升级。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0050冒险岛3中文版.nes"
  },
  {
    id: 5,
    name: "忍者神龟1",
    year: 1989,
    genre: "动作游戏",
    publisher: "Konami",
    players: 2,
    description: "四只变异忍者龟在纽约下水道中展开冒险，拯救师父斯普林特。可在四只神龟间自由切换，各有不同的武器和能力。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0072忍者神龟1.nes"
  },
  {
    id: 6,
    name: "忍者神龟2",
    year: 1990,
    genre: "动作游戏",
    publisher: "Konami",
    players: 2,
    description: "忍者神龟系列的横版过关经典，流畅的格斗手感、丰富的关卡设计，双人合作的乐趣无可替代。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0073忍者神龟2.nes"
  },
  {
    id: 7,
    name: "忍者神龟3",
    year: 1992,
    genre: "动作游戏",
    publisher: "Konami",
    players: 2,
    description: "系列巅峰之作，画面精美，必杀技华丽。神龟们穿越时空，从纽约到远古时代，展开史诗般的冒险。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0074忍者神龟3.nes"
  },
  {
    id: 8,
    name: "双截龙2",
    year: 1989,
    genre: "格斗游戏",
    publisher: "Technōs",
    players: 2,
    description: "经典双人格斗过关游戏，比利和吉米两兄弟为复仇而战。拳脚组合、飞膝旋风腿，打击感十足的街机移植经典。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0034双截龙2(中文).nes"
  },
  {
    id: 9,
    name: "双截龙3",
    year: 1991,
    genre: "格斗游戏",
    publisher: "Technōs",
    players: 2,
    description: "双截龙系列第三作，加入了更多角色和必杀技，关卡横跨全球多个地点，最终挑战埃及金字塔中的神秘力量。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0035双截龙3(中文).nes"
  },
  {
    id: 10,
    name: "三目童子",
    year: 1992,
    genre: "平台游戏",
    publisher: "Konami",
    players: 1,
    description: "改编自手冢治虫同名漫画，写乐保介用额头的第三只眼释放超能力。独特的三眼设定和精巧的关卡设计，FC 上的隐藏佳作。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0080三目童子(中文).nes"
  },
  {
    id: 11,
    name: "炸弹人",
    year: 1985,
    genre: "益智游戏",
    publisher: "Hudson",
    players: 2,
    description: "放置炸弹炸开障碍、消灭敌人、寻找出口。支持双人对战模式，炸弹与道具的博弈让每局都充满策略性。",
    romUrl: "https://cdn.jsdelivr.net/gh/BingGitCn/NES-Roms@main/0194炸弹人.nes"
  }
];
