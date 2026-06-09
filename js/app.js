/* 存档点 — Retro Arcade Collection (11 Games) */

const App = {
  filter: '',

  init() {
    this.bindEvents();
    this.route();
    window.addEventListener('hashchange', () => this.route());
  },

  bindEvents() {
    // Logo → home
    document.querySelector('.nav-logo').onclick = () => { window.location.hash = ''; };
    // Nav links
    document.querySelectorAll('.nav-link').forEach(el => {
      el.onclick = () => {
        const p = el.dataset.page;
        window.location.hash = p === 'home' ? '' : '#/' + p;
      };
    });
    // Mobile toggle
    document.getElementById('nav-toggle').onclick = () => {
      document.getElementById('nav-links').classList.toggle('open');
    };
    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.getElementById('nav-links').classList.remove('open');
    });
  },

  route() {
    const hash = window.location.hash;
    // Close mobile nav
    document.getElementById('nav-links').classList.remove('open');
    // Update active link
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    if (hash.startsWith('#/play/')) {
      this.renderPlay(parseInt(hash.split('/')[2]));
    } else if (hash === '#/emulator') {
      document.querySelector('[data-page="emulator"]')?.classList.add('active');
      this.renderEmulator();
    } else {
      document.querySelector('[data-page="home"]')?.classList.add('active');
      this.renderHome();
    }
  },

  /* ==================== HOME ==================== */
  renderHome() {
    const el = document.getElementById('app');
    const genres = [...new Set(GAMES_DATA.map(g => g.genre))];

    el.innerHTML = `
      <div class="fade-in">
        <div class="hero">
          <div class="hero-eyebrow">SAVED GAME LOADED_</div>
          <h1 class="hero-title"><span>存档点</span></h1>
          <p class="hero-sub">在此处，时间暂停</p>
        </div>

        <div class="container">
          <div class="filter-bar" id="filter-bar">
            <input class="filter-input" id="filter-input"
              placeholder="&gt; 搜索游戏..." autocomplete="off">
            <div class="filter-chips" id="filter-chips">
              <span class="chip active" data-filter="">全部</span>
              ${genres.map(g => `<span class="chip" data-filter="${this.esc(g)}">${this.esc(g)}</span>`).join('')}
            </div>
          </div>

          <div class="game-list" id="game-list">
            ${GAMES_DATA.map(g => this.card(g)).join('')}
          </div>
        </div>

        <div class="footer">
          <div>&copy; 2025 存档点 // NES EMULATOR</div>
          <div class="note">基于 EmulatorJS · 所有资源来自互联网公开渠道</div>
        </div>
      </div>
    `;

    // Bind filter
    const input = document.getElementById('filter-input');
    input.addEventListener('input', () => {
      this.filter = input.value.trim().toLowerCase();
      this.applyFilter();
    });
    document.querySelectorAll('#filter-chips .chip').forEach(chip => {
      chip.onclick = () => {
        document.querySelectorAll('#filter-chips .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.filter = chip.dataset.filter.toLowerCase();
        input.value = chip.dataset.filter;
        this.applyFilter();
      };
    });

    window.scrollTo(0, 0);
  },

  applyFilter() {
    const q = this.filter;
    document.querySelectorAll('#game-list .game-card').forEach(card => {
      const name = card.dataset.name || '';
      const genre = card.dataset.genre || '';
      const pub = card.dataset.pub || '';
      const match = !q || name.includes(q) || genre.includes(q) || pub.includes(q);
      card.classList.toggle('hidden', !match);
    });
  },

  card(g) {
    const barColors = {
      '平台游戏': 'var(--accent)',
      '射击游戏': 'var(--red)',
      '动作游戏': 'var(--cyan)',
      '格斗游戏': 'var(--red)',
      '益智游戏': 'var(--cyan)',
    };
    const barColor = barColors[g.genre] || 'var(--accent)';
    return `
      <div class="game-card" data-name="${this.esc(g.name.toLowerCase())}"
           data-genre="${this.esc(g.genre.toLowerCase())}"
           data-pub="${this.esc(g.publisher.toLowerCase())}"
           onclick="location.hash='#/play/${g.id}'">
        <div class="game-card-bar" style="background:${barColor}"></div>
        <div class="game-card-body">
          <div class="game-card-top">
            <span class="game-tag genre">${this.esc(g.genre)}</span>
            <span class="game-tag">${g.year}</span>
            <span class="game-tag">${g.players}P</span>
          </div>
          <div class="game-card-name">${this.esc(g.name)}</div>
          <div class="game-card-desc">${g.description ? this.esc(g.description) : ''}</div>
          <div class="game-card-footer">
            <span class="game-card-info">${this.esc(g.publisher)}</span>
            <span class="game-card-play">&gt; PLAY</span>
          </div>
        </div>
      </div>
    `;
  },

  /* ==================== PLAY ==================== */
  renderPlay(id) {
    const g = GAMES_DATA.find(x => x.id === id);
    if (!g) {
      document.getElementById('app').innerHTML = '<div class="empty-msg">GAME NOT FOUND</div>';
      return;
    }
    const related = GAMES_DATA.filter(x => x.id !== g.id && x.genre === g.genre);
    const el = document.getElementById('app');

    el.innerHTML = `
      <div class="fade-in">
        <div class="container">
          <div class="play-top">
            <button class="back-btn" onclick="history.back()">&larr; 返回</button>
            <div class="play-title">${this.esc(g.name)}</div>
          </div>

          <div class="emulator-wrap">
            <div class="emulator-bar">
              <div class="emulator-dots"><span></span><span></span><span></span></div>
              <span class="emulator-status">// ${this.esc(g.name)}</span>
              <span>${g.year}</span>
            </div>
            <div class="emulator-box" id="emulator-box">
              <div id="game"></div>
              <button class="fs-btn" onclick="App.fullscreen()" title="全屏">⛶</button>
            </div>
          </div>

          <div class="mobile-controls" id="mobile-controls">
            <div class="dpad">
              <div class="dpad-btn dpad-empty"></div>
              <div class="dpad-btn" data-key="ArrowUp">↑</div>
              <div class="dpad-btn dpad-empty"></div>
              <div class="dpad-btn" data-key="ArrowLeft">←</div>
              <div class="dpad-btn dpad-empty"></div>
              <div class="dpad-btn" data-key="ArrowRight">→</div>
              <div class="dpad-btn dpad-empty"></div>
              <div class="dpad-btn" data-key="ArrowDown">↓</div>
              <div class="dpad-btn dpad-empty"></div>
            </div>
            <div class="action-side">
              <div class="menu-row">
                <div class="menu-btn" data-key="Shift">SELECT</div>
                <div class="menu-btn" data-key="Enter">START</div>
              </div>
              <div class="action-row">
                <div class="ab-btn" data-key="KeyX">B</div>
                <div class="ab-btn" data-key="KeyZ">A</div>
              </div>
            </div>
          </div>

          <div class="play-info">
            ${g.description ? `<div class="info-desc">${this.esc(g.description)}</div>` : ''}
            <div class="info-grid">
              <div class="info-cell">
                <div class="info-label">类型</div>
                <div class="info-value">${this.esc(g.genre)}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">厂商</div>
                <div class="info-value">${this.esc(g.publisher)}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">年份</div>
                <div class="info-value">${g.year}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">玩家</div>
                <div class="info-value">${g.players} 人</div>
              </div>
            </div>

            <div class="info-actions">
              <button class="btn btn-primary" onclick="App.reload()">重新加载</button>
              <button class="btn btn-ghost" onclick="App.fullscreen()">全屏模式</button>
            </div>

            <div class="controls-section">
              <h3>// 操作指南</h3>
              <div class="controls-grid">
                <div class="ctrl-row"><span class="ctrl-action">移动</span><span class="ctrl-key">↑ ↓ ← →</span></div>
                <div class="ctrl-row"><span class="ctrl-action">A 键</span><span class="ctrl-key">Z</span></div>
                <div class="ctrl-row"><span class="ctrl-action">B 键</span><span class="ctrl-key">X</span></div>
                <div class="ctrl-row"><span class="ctrl-action">开始</span><span class="ctrl-key">Enter</span></div>
                <div class="ctrl-row"><span class="ctrl-action">选择</span><span class="ctrl-key">Shift</span></div>
                <div class="ctrl-row"><span class="ctrl-action">全屏</span><span class="ctrl-key">F11</span></div>
              </div>
            </div>

            ${related.length > 0 ? `
              <div class="related">
                <h3>// 相似游戏</h3>
                <div class="related-list">
                  ${related.map(r => `
                    <div class="related-item" onclick="location.hash='#/play/${r.id}'">
                      <div class="related-name">${this.esc(r.name)}</div>
                      <div class="related-meta">${r.year} · ${this.esc(r.genre)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="footer">
          <div>&copy; 2025 存档点</div>
        </div>
      </div>
    `;

    this.startEmulator(g.romUrl);
    window.scrollTo(0, 0);
    this.bindControls();
  },

  /* ==================== EMULATOR PAGE ==================== */
  renderEmulator() {
    const el = document.getElementById('app');
    el.innerHTML = `
      <div class="fade-in">
        <div class="container">
          <div class="play-top">
            <button class="back-btn" onclick="history.back()">&larr; 返回</button>
            <div class="play-title">通用模拟器</div>
          </div>

          <div class="emulator-wrap">
            <div class="emulator-bar">
              <div class="emulator-dots"><span></span><span></span><span></span></div>
              <span class="emulator-status">// ROM LOADER</span>
              <span>READY</span>
            </div>
            <div class="emulator-box" id="emulator-box">
              <div id="game"></div>
              <button class="fs-btn" onclick="App.fullscreen()" title="全屏">⛶</button>
            </div>
          </div>

          <div class="play-info">
            <div style="margin-bottom:12px;">
              <label class="btn btn-primary" style="cursor:pointer;">
                选择 .nes 文件
                <input type="file" accept=".nes" style="display:none;" onchange="App.loadFile(this)">
              </label>
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--fg-muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">// 或输入 ROM URL</div>
              <div style="display:flex;gap:8px;">
                <input type="text" id="rom-url" placeholder="https://example.com/game.nes"
                  style="flex:1;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);color:var(--accent);font-family:var(--font-mono);font-size:12px;outline:none;">
                <button class="btn btn-ghost" onclick="App.loadUrl()">加载</button>
              </div>
            </div>

            <div class="controls-section">
              <h3>// 操作指南</h3>
              <div class="controls-grid">
                <div class="ctrl-row"><span class="ctrl-action">移动</span><span class="ctrl-key">↑ ↓ ← →</span></div>
                <div class="ctrl-row"><span class="ctrl-action">A 键</span><span class="ctrl-key">Z</span></div>
                <div class="ctrl-row"><span class="ctrl-action">B 键</span><span class="ctrl-key">X</span></div>
                <div class="ctrl-row"><span class="ctrl-action">开始</span><span class="ctrl-key">Enter</span></div>
                <div class="ctrl-row"><span class="ctrl-action">选择</span><span class="ctrl-key">Shift</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mobile-controls" id="mobile-controls">
          <div class="dpad">
            <div class="dpad-btn dpad-empty"></div>
            <div class="dpad-btn" data-key="ArrowUp">↑</div>
            <div class="dpad-btn dpad-empty"></div>
            <div class="dpad-btn" data-key="ArrowLeft">←</div>
            <div class="dpad-btn dpad-empty"></div>
            <div class="dpad-btn" data-key="ArrowRight">→</div>
            <div class="dpad-btn dpad-empty"></div>
            <div class="dpad-btn" data-key="ArrowDown">↓</div>
            <div class="dpad-btn dpad-empty"></div>
          </div>
          <div class="action-side">
            <div class="menu-row">
              <div class="menu-btn" data-key="Shift">SELECT</div>
              <div class="menu-btn" data-key="Enter">START</div>
            </div>
            <div class="action-row">
              <div class="ab-btn" data-key="KeyX">B</div>
              <div class="ab-btn" data-key="KeyZ">A</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div>&copy; 2025 存档点</div>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
    this.bindControls();
  },

  /* ==================== MOBILE CONTROLS ==================== */
  bindControls() {
    const target = document.getElementById('emulator-box');
    if (!target) return;
    // Map data-key → keyCode (EmulatorJS uses event.keyCode)
    const keyMap = {
      'ArrowUp':    { key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
      'ArrowDown':  { key: 'ArrowDown',  code: 'ArrowDown',  keyCode: 40 },
      'ArrowLeft':  { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
      'ArrowRight': { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
      'KeyZ':       { key: 'z',          code: 'KeyZ',       keyCode: 90 },
      'KeyX':       { key: 'x',          code: 'KeyX',       keyCode: 88 },
      'Enter':      { key: 'Enter',      code: 'Enter',      keyCode: 13 },
      'Shift':      { key: 'Shift',      code: 'Shift',      keyCode: 16 },
    };
    const activeTouches = new Map();

    const makeEvent = (type, info) => {
      const evt = new KeyboardEvent(type, {
        key: info.key, code: info.code, bubbles: true, cancelable: true
      });
      Object.defineProperty(evt, 'keyCode', { value: info.keyCode });
      Object.defineProperty(evt, 'which', { value: info.keyCode });
      return evt;
    };

    const parent = target.closest('.container') || target.parentElement;
    parent.addEventListener('touchstart', e => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const btn = el?.closest('[data-key]');
        if (!btn) continue;
        const info = keyMap[btn.dataset.key];
        if (!info) continue;
        btn.classList.add('pressed');
        activeTouches.set(touch.identifier, { info, btn });
        target.dispatchEvent(makeEvent('keydown', info));
      }
    }, { passive: false });

    const endTouches = (e) => {
      for (const touch of e.changedTouches) {
        const entry = activeTouches.get(touch.identifier);
        if (!entry) continue;
        entry.btn.classList.remove('pressed');
        activeTouches.delete(touch.identifier);
        target.dispatchEvent(makeEvent('keyup', entry.info));
      }
    };
    parent.addEventListener('touchend', endTouches, { passive: false });
    parent.addEventListener('touchcancel', endTouches, { passive: false });
  },

  /* ==================== EMULATOR CORE ==================== */
  startEmulator(romUrl) {
    window.EJS_player = '#game';
    window.EJS_core = 'nes';
    window.EJS_pathtodata = 'data/';
    window.EJS_startOnLoaded = false;
    window.EJS_language = 'zh-CN';
    window.EJS_gameUrl = romUrl;

    const old = document.getElementById('ejs-script');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'ejs-script';
    s.src = 'data/loader.js';
    document.body.appendChild(s);
  },

  loadFile(input) {
    if (input.files[0]) this.startEmulator(URL.createObjectURL(input.files[0]));
  },

  loadUrl() {
    const el = document.getElementById('rom-url');
    if (el?.value.trim()) this.startEmulator(el.value.trim());
  },

  reload() {
    const id = parseInt(location.hash.split('/')[2]);
    const g = GAMES_DATA.find(x => x.id === id);
    if (g) this.startEmulator(g.romUrl + '?t=' + Date.now());
  },

  fullscreen() {
    const el = document.getElementById('emulator-box');
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  },

  esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
