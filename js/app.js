/* 快乐童年 - Main Application */

const App = {
  currentRoute: '',
  currentGenre: '',
  currentPage: 1,
  currentSort: 'default',
  searchQuery: '',
  genres: [],
  genreMap: {},

  init() {
    this.buildGenreIndex();
    this.bindEvents();
    this.route();
    window.addEventListener('hashchange', () => this.route());
  },

  buildGenreIndex() {
    const counts = {};
    GAMES_DATA.forEach(g => {
      counts[g.genre] = (counts[g.genre] || 0) + 1;
    });
    this.genres = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  },

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    const searchOverlay = document.getElementById('search-overlay');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.searchQuery = e.target.value.trim();
        if (this.searchQuery.length > 0) {
          this.showSearch();
        } else {
          this.hideSearch();
        }
      }, 250);
    });

    searchInput.addEventListener('focus', () => {
      if (this.searchQuery.length > 0) this.showSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideSearch();
        searchInput.blur();
      }
    });

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) this.hideSearch();
    });

    document.querySelector('.nav-logo').addEventListener('click', () => {
      window.location.hash = '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        if (page === 'home') window.location.hash = '';
        else if (page === 'browse') window.location.hash = '#/browse';
        else if (page === 'emulator') window.location.hash = '#/emulator';
      });
    });
  },

  showSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.add('open');
    const results = this.searchGames(this.searchQuery);
    document.getElementById('search-results-list').innerHTML = results.length > 0
      ? results.slice(0, 20).map(g => `
        <div class="search-result-item" onclick="App.playGame(${g.id})">
          <span class="search-result-name">${this.escHtml(g.name)}</span>
          <span class="search-result-meta">
            <span>${g.year}</span>
            <span>${this.escHtml(g.genre)}</span>
          </span>
        </div>
      `).join('')
      : '<div class="empty-state"><div class="empty-icon">🔍</div><div>没有找到相关游戏</div></div>';
  },

  hideSearch() {
    document.getElementById('search-overlay').classList.remove('open');
  },

  searchGames(query) {
    const q = query.toLowerCase();
    return GAMES_DATA.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.publisher.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    );
  },

  route() {
    const hash = window.location.hash || '#/';
    this.updateNav(hash);

    if (hash.startsWith('#/play/')) {
      const id = parseInt(hash.split('/').pop());
      this.renderPlayPage(id);
    } else if (hash === '#/browse') {
      this.renderBrowsePage();
    } else if (hash === '#/emulator') {
      this.renderEmulatorPage();
    } else {
      this.renderHomePage();
    }
  },

  updateNav(hash) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (hash === '#/browse') {
      document.querySelector('[data-page="browse"]')?.classList.add('active');
    } else if (hash === '#/emulator') {
      document.querySelector('[data-page="emulator"]')?.classList.add('active');
    } else {
      document.querySelector('[data-page="home"]')?.classList.add('active');
    }
  },

  renderHomePage() {
    const main = document.getElementById('app');
    const popularGames = this.getPopularGames();
    const recentGames = this.getRecentGames();

    main.innerHTML = `
      <div class="page-enter">
        <div class="hero">
          <span class="hero-pixel">PRESS START</span>
          <h1 class="hero-title">
            <span class="highlight">快乐童年</span>
          </h1>
          <p class="hero-subtitle">重温经典 · ${GAMES_DATA.length} 款红白机游戏 · 浏览器即玩</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">${GAMES_DATA.length}</div>
              <div class="hero-stat-label">款游戏</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${this.genres.length}</div>
              <div class="hero-stat-label">个分类</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">0</div>
              <div class="hero-stat-label">需安装</div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="section">
            <div class="section-header">
              <h2 class="section-title">🔥 热门游戏</h2>
              <span class="section-more" onclick="location.hash='#/browse'">查看全部 →</span>
            </div>
            <div class="scroll-row">
              ${popularGames.map(g => this.renderGameCard(g)).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h2 class="section-title">📂 游戏分类</h2>
            </div>
            <div class="category-grid">
              ${this.genres.map(g => `
                <div class="category-chip" onclick="App.browseGenre('${this.escAttr(g.name)}')">
                  <span class="chip-emoji">${this.getGenreEmoji(g.name)}</span>
                  <span class="chip-name">${this.escHtml(g.name)}</span>
                  <span class="chip-count">${g.count} 款</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h2 class="section-title">🆕 最新收录</h2>
              <span class="section-more" onclick="location.hash='#/browse'">查看全部 →</span>
            </div>
            <div class="game-grid">
              ${recentGames.map(g => this.renderGameCard(g)).join('')}
            </div>
          </div>
        </div>

        <div class="footer">
          <div>© 2025 快乐童年 · 纯前端 NES 模拟器</div>
          <div class="disclaimer">所有资源均来自互联网公开渠道，仅供学习交流使用。基于 EmulatorJS 开源项目。</div>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  },

  renderBrowsePage(genre, page) {
    genre = genre || this.currentGenre;
    page = page || 1;
    this.currentGenre = genre;
    this.currentPage = page;

    const filtered = genre
      ? GAMES_DATA.filter(g => g.genre === genre)
      : [...GAMES_DATA];

    const sorted = this.sortGames(filtered, this.currentSort);
    const perPage = 48;
    const totalPages = Math.ceil(sorted.length / perPage);
    const start = (page - 1) * perPage;
    const pageGames = sorted.slice(start, start + perPage);

    const main = document.getElementById('app');
    main.innerHTML = `
      <div class="page-enter">
        <div class="container">
          <div class="browse-layout">
            <aside class="browse-sidebar">
              <div class="sidebar-section">
                <div class="sidebar-title">游戏分类</div>
                <ul class="sidebar-list">
                  <li class="sidebar-item ${!genre ? 'active' : ''}" onclick="App.browseGenre('')">
                    <span>全部游戏</span>
                    <span class="item-count">${GAMES_DATA.length}</span>
                  </li>
                  ${this.genres.map(g => `
                    <li class="sidebar-item ${genre === g.name ? 'active' : ''}" onclick="App.browseGenre('${this.escAttr(g.name)}')">
                      <span>${this.getGenreEmoji(g.name)} ${this.escHtml(g.name)}</span>
                      <span class="item-count">${g.count}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              <div class="sidebar-section">
                <div class="sidebar-title">玩家数</div>
                <ul class="sidebar-list">
                  <li class="sidebar-item" onclick="App.browsePlayers(1)">👥 单人游戏</li>
                  <li class="sidebar-item" onclick="App.browsePlayers(2)">👥👥 双人游戏</li>
                </ul>
              </div>
            </aside>

            <div class="browse-main">
              <div class="browse-header">
                <div class="browse-count">共 <strong>${sorted.length}</strong> 款游戏${genre ? ' · ' + this.escHtml(genre) : ''}</div>
                <div class="browse-sort">
                  <button class="sort-btn ${this.currentSort === 'default' ? 'active' : ''}" onclick="App.setSort('default')">默认</button>
                  <button class="sort-btn ${this.currentSort === 'name' ? 'active' : ''}" onclick="App.setSort('name')">名称</button>
                  <button class="sort-btn ${this.currentSort === 'year' ? 'active' : ''}" onclick="App.setSort('year')">年份</button>
                  <button class="sort-btn ${this.currentSort === 'players' ? 'active' : ''}" onclick="App.setSort('players')">玩家</button>
                </div>
              </div>
              <div class="game-grid">
                ${pageGames.length > 0
                  ? pageGames.map(g => this.renderGameCard(g)).join('')
                  : '<div class="empty-state"><div class="empty-icon">🎮</div><div>没有找到游戏</div></div>'
                }
              </div>
              ${this.renderPagination(page, totalPages)}
            </div>
          </div>
        </div>
        <div class="footer">
          <div>© 2025 快乐童年</div>
          <div class="disclaimer">所有资源均来自互联网公开渠道，仅供学习交流使用。</div>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  },

  renderPlayPage(id) {
    const game = GAMES_DATA.find(g => g.id === id);
    if (!game) {
      document.getElementById('app').innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><div>游戏未找到</div></div>';
      return;
    }

    const related = this.getRelatedGames(game);
    const main = document.getElementById('app');

    main.innerHTML = `
      <div class="page-enter">
        <div class="container">
          <div class="play-header">
            <div class="back-btn" onclick="history.back()">← 返回</div>
            <h2 style="font-size:18px;font-weight:600;">${this.escHtml(game.name)}</h2>
          </div>
          <div class="play-layout">
            <div class="play-emulator">
              <div class="emulator-wrapper" id="emulator-wrapper">
                <div id="game"></div>
              </div>
              <div class="mobile-controls" id="mobile-controls">
                <div class="dpad">
                  <div class="dpad-btn dpad-center"></div>
                  <div class="dpad-btn" data-key="ArrowUp">↑</div>
                  <div class="dpad-btn dpad-center"></div>
                  <div class="dpad-btn" data-key="ArrowLeft">←</div>
                  <div class="dpad-btn dpad-center"></div>
                  <div class="dpad-btn" data-key="ArrowRight">→</div>
                  <div class="dpad-btn dpad-center"></div>
                  <div class="dpad-btn" data-key="ArrowDown">↓</div>
                  <div class="dpad-btn dpad-center"></div>
                </div>
                <div class="action-buttons">
                  <div class="menu-buttons">
                    <div class="menu-btn" data-key="Shift">SELECT</div>
                    <div class="menu-btn" data-key="Enter">START</div>
                  </div>
                  <div class="action-row">
                    <div class="action-btn" data-key="KeyX">B</div>
                    <div class="action-btn" data-key="KeyZ">A</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="play-sidebar">
              <div class="game-info-card">
                <div class="game-info-title">${this.escHtml(game.name)}</div>
                <div class="game-info-row">
                  <span class="game-info-label">类型</span>
                  <span class="game-info-value">${this.escHtml(game.genre)}</span>
                </div>
                <div class="game-info-row">
                  <span class="game-info-label">厂商</span>
                  <span class="game-info-value">${this.escHtml(game.publisher)}</span>
                </div>
                <div class="game-info-row">
                  <span class="game-info-label">年份</span>
                  <span class="game-info-value">${game.year}</span>
                </div>
                <div class="game-info-row">
                  <span class="game-info-label">玩家</span>
                  <span class="game-info-value">${game.players} 人</span>
                </div>
                <div class="game-actions">
                  <a class="btn btn-primary" href="${game.romUrl}" download="${this.escAttr(game.name)}.nes">📥 下载 ROM</a>
                  <button class="btn btn-secondary" onclick="App.reloadEmulator()">🔄 重新加载</button>
                </div>
              </div>
              <div class="controls-guide">
                <div class="controls-title">⌨️ 操作说明</div>
                <div class="controls-row"><span class="controls-action">移动</span><span class="controls-key">↑ ↓ ← →</span></div>
                <div class="controls-row"><span class="controls-action">A 键</span><span class="controls-key">Z</span></div>
                <div class="controls-row"><span class="controls-action">B 键</span><span class="controls-key">X</span></div>
                <div class="controls-row"><span class="controls-action">开始</span><span class="controls-key">Enter</span></div>
                <div class="controls-row"><span class="controls-action">选择</span><span class="controls-key">Shift</span></div>
              </div>
            </div>
          </div>
          ${related.length > 0 ? `
            <div class="related-section">
              <div class="section-header">
                <h2 class="section-title">🎮 相似游戏</h2>
              </div>
              <div class="related-grid">
                ${related.map(g => `
                  <div class="related-card" onclick="App.playGame(${g.id})">
                    <div class="related-card-name">${this.escHtml(g.name)}</div>
                    <div class="related-card-info">${g.year} · ${this.escHtml(g.genre)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <div>© 2025 快乐童年</div>
        </div>
      </div>
    `;

    this.loadEmulator(game.romUrl);
    window.scrollTo(0, 0);
  },

  renderEmulatorPage() {
    const main = document.getElementById('app');
    main.innerHTML = `
      <div class="page-enter">
        <div class="container" style="padding-top:24px;padding-bottom:48px;">
          <div class="play-header">
            <div class="back-btn" onclick="history.back()">← 返回</div>
            <h2 style="font-size:18px;font-weight:600;">通用模拟器</h2>
          </div>
          <div class="play-layout">
            <div class="play-emulator">
              <div class="emulator-wrapper" id="emulator-wrapper">
                <div id="game"></div>
              </div>
            </div>
            <div class="play-sidebar">
              <div class="game-info-card">
                <div class="game-info-title">加载本地 ROM</div>
                <div class="game-actions">
                  <label class="btn btn-primary" style="cursor:pointer;">
                    📂 选择 .nes 文件
                    <input type="file" accept=".nes" id="rom-file-input" style="display:none;" onchange="App.loadLocalRom(this)">
                  </label>
                </div>
                <div style="margin-top:16px;">
                  <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">或输入 ROM URL：</div>
                  <div style="display:flex;gap:8px;">
                    <input type="text" id="rom-url-input" placeholder="https://example.com/game.nes"
                      style="flex:1;padding:8px 12px;border-radius:var(--radius-sm);border:1px solid var(--border-color);background:var(--bg-secondary);color:var(--text-primary);font-size:13px;outline:none;">
                    <button class="btn btn-secondary" onclick="App.loadUrlRom()">加载</button>
                  </div>
                </div>
              </div>
              <div class="controls-guide">
                <div class="controls-title">⌨️ 操作说明</div>
                <div class="controls-row"><span class="controls-action">移动</span><span class="controls-key">↑ ↓ ← →</span></div>
                <div class="controls-row"><span class="controls-action">A 键</span><span class="controls-key">Z</span></div>
                <div class="controls-row"><span class="controls-action">B 键</span><span class="controls-key">X</span></div>
                <div class="controls-row"><span class="controls-action">开始</span><span class="controls-key">Enter</span></div>
                <div class="controls-row"><span class="controls-action">选择</span><span class="controls-key">Shift</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  },

  renderGameCard(game) {
    return `
      <div class="game-card" onclick="App.playGame(${game.id})">
        <div class="game-card-name" title="${this.escAttr(game.name)}">${this.escHtml(game.name)}</div>
        <div class="game-card-meta">
          <span class="game-tag genre">${this.escHtml(game.genre)}</span>
          <span class="game-tag">${game.year}</span>
          <span class="game-tag">${this.escHtml(game.publisher)}</span>
        </div>
        <div class="game-card-footer">
          <span class="game-card-info">${game.players} 人</span>
          <span class="game-card-play">▶ 开始</span>
        </div>
      </div>
    `;
  },

  renderPagination(current, total) {
    if (total <= 1) return '';
    let pages = [];
    pages.push(1);
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    pages.push(total);
    pages = [...new Set(pages)].sort((a, b) => a - b);

    let html = '<div class="pagination">';
    html += `<button class="page-btn ${current === 1 ? 'disabled' : ''}" onclick="App.goPage(${current - 1})" ${current === 1 ? 'disabled' : ''}>←</button>`;
    pages.forEach((p, i) => {
      if (i > 0 && p - pages[i - 1] > 1) {
        html += '<span class="page-ellipsis">...</span>';
      }
      html += `<button class="page-btn ${p === current ? 'active' : ''}" onclick="App.goPage(${p})">${p}</button>`;
    });
    html += `<button class="page-btn ${current === total ? 'disabled' : ''}" onclick="App.goPage(${current + 1})" ${current === total ? 'disabled' : ''}>→</button>`;
    html += '</div>';
    return html;
  },

  /* Actions */
  playGame(id) {
    this.hideSearch();
    document.getElementById('search-input').value = '';
    this.searchQuery = '';
    window.location.hash = `#/play/${id}`;
  },

  browseGenre(genre) {
    this.currentGenre = genre;
    this.currentPage = 1;
    window.location.hash = '#/browse';
    this.renderBrowsePage(genre, 1);
  },

  browsePlayers(players) {
    const filtered = GAMES_DATA.filter(g => g.players >= players);
    const main = document.querySelector('.browse-main');
    if (main) {
      main.querySelector('.browse-count').innerHTML = `共 <strong>${filtered.length}</strong> 款游戏 · ${players}人`;
      main.querySelector('.game-grid').innerHTML = filtered.slice(0, 48).map(g => this.renderGameCard(g)).join('');
    }
  },

  setSort(sort) {
    this.currentSort = sort;
    this.renderBrowsePage(this.currentGenre, this.currentPage);
  },

  goPage(page) {
    if (page < 1) return;
    this.renderBrowsePage(this.currentGenre, page);
    window.scrollTo(0, 0);
  },

  /* Emulator */
  async loadEmulator(romUrl) {
    window.EJS_player = '#game';
    window.EJS_core = 'nes';
    window.EJS_pathtodata = 'data/';
    window.EJS_startOnLoaded = false;
    window.EJS_language = 'zh-CN';

    const proxies = [
      url => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
      url => 'https://corsproxy.io/?' + encodeURIComponent(url),
      url => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url),
    ];

    let blob = null;
    for (const makeUrl of proxies) {
      try {
        const resp = await fetch(makeUrl(romUrl), { signal: AbortSignal.timeout(15000) });
        if (resp.ok) {
          blob = await resp.blob();
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (blob) {
      window.EJS_gameUrl = URL.createObjectURL(blob);
    } else {
      window.EJS_gameUrl = romUrl;
    }

    const existingScript = document.getElementById('emulator-script');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'emulator-script';
    script.src = 'data/loader.js';
    document.body.appendChild(script);
  },

  loadLocalRom(input) {
    const file = input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.loadEmulator(url);
  },

  loadUrlRom() {
    const input = document.getElementById('rom-url-input');
    if (input && input.value.trim()) {
      this.loadEmulator(input.value.trim());
    }
  },

  reloadEmulator() {
    const hash = window.location.hash;
    const id = parseInt(hash.split('/').pop());
    const game = GAMES_DATA.find(g => g.id === id);
    if (game) {
      this.loadEmulator(game.romUrl + '?t=' + Date.now());
    }
  },

  /* Helpers */
  getPopularGames() {
    const keywords = ['超级玛丽', '魂斗罗', '坦克大战', '冒险岛', '忍者神龟', '双截龙', '马戏团', '淘金者', '绿色兵团', '赤影战士', '炸弹人', '雪人兄弟', '松鼠大战', '热血', '洛克人'];
    return keywords
      .map(kw => GAMES_DATA.find(g => g.name.includes(kw)))
      .filter(Boolean)
      .slice(0, 12);
  },

  getRecentGames() {
    return [...GAMES_DATA]
      .sort((a, b) => b.year - a.year)
      .slice(0, 20);
  },

  getRelatedGames(game) {
    return GAMES_DATA
      .filter(g => g.id !== game.id && g.genre === game.genre)
      .slice(0, 8);
  },

  sortGames(games, sort) {
    switch (sort) {
      case 'name': return [...games].sort((a, b) => a.name.localeCompare(b.name, 'zh'));
      case 'year': return [...games].sort((a, b) => b.year - a.year);
      case 'players': return [...games].sort((a, b) => b.players - a.players);
      default: return games;
    }
  },

  getGenreEmoji(genre) {
    const map = {
      '平台游戏': '🏃', '射击游戏': '🔫', '动作游戏': '⚔️',
      '益智游戏': '🧩', '赛车游戏': '🏎️', '体育游戏': '🏀',
      '角色扮演': '🗡️', '策略游戏': '🃏', '冒险游戏': '🐉',
      '格斗游戏': '🥊', '桌面游戏': '🎲', '模拟游戏': '🎯',
      '冒险冒险': '🗺️', '棋类游戏': '♟️',
    };
    return map[genre] || '🎮';
  },

  escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  escAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
