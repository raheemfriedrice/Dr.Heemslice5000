/* #BetItAll™ — Connect 4 wager desk for The Inconvenience Store™. Rice + Claude. */

// Self-contained so it can be stringified into a Web Worker.
function c4EngineFactory() {
  const W = 7, H = 6, N = 42, WIN = 1000000;
  const ORDER = [3, 2, 4, 1, 5, 0, 6];

  const WINDOWS = [];
  for (let c = 0; c < W; c++) for (let r = 0; r < H; r++) {
    for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const ec = c + 3 * dc, er = r + 3 * dr;
      if (ec < 0 || ec >= W || er < 0 || er >= H) continue;
      WINDOWS.push([c * H + r, (c + dc) * H + r + dr, (c + 2 * dc) * H + r + 2 * dr, ec * H + er]);
    }
  }
  const CELL_WIN = Array.from({ length: N }, () => []);
  WINDOWS.forEach((w, i) => w.forEach(cell => CELL_WIN[cell].push(i)));

  let seed = 0x9e3779b9;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
  const Z1 = [[], [], []], Z2 = [[], [], []];
  for (let p = 1; p <= 2; p++) for (let i = 0; i < N; i++) { Z1[p][i] = rnd(); Z2[p][i] = rnd(); }

  function isWinAt(b, cell, p) {
    for (const wi of CELL_WIN[cell]) {
      const w = WINDOWS[wi];
      if (b[w[0]] === p && b[w[1]] === p && b[w[2]] === p && b[w[3]] === p) return true;
    }
    return false;
  }

  function winLine(b, p) {
    for (const w of WINDOWS) if (b[w[0]] === p && b[w[1]] === p && b[w[2]] === p && b[w[3]] === p) return w;
    return null;
  }

  function play(s, c, p) {
    const cell = c * H + s.h[c];
    s.b[cell] = p; s.h[c]++; s.moves++;
    s.h1 ^= Z1[p][cell]; s.h2 ^= Z2[p][cell];
  }
  function undo(s, c, p) {
    s.h[c]--;
    const cell = c * H + s.h[c];
    s.b[cell] = 0; s.moves--;
    s.h1 ^= Z1[p][cell]; s.h2 ^= Z2[p][cell];
  }
  function canWinNow(s, c, p) {
    if (s.h[c] >= H) return false;
    const cell = c * H + s.h[c];
    s.b[cell] = p;
    const w = isWinAt(s.b, cell, p);
    s.b[cell] = 0;
    return w;
  }
  // Playing c would let the opponent win in the cell directly above.
  function givesAway(s, c, p) {
    const r = s.h[c];
    if (r + 1 >= H) return false;
    const cell = c * H + r, above = cell + 1, o = 3 - p;
    s.b[cell] = p; s.b[above] = o;
    const w = isWinAt(s.b, above, o);
    s.b[above] = 0; s.b[cell] = 0;
    return w;
  }

  function evaluate(b, p) {
    const o = 3 - p;
    let score = 0;
    for (const w of WINDOWS) {
      let mp = 0, mo = 0;
      for (let k = 0; k < 4; k++) { const v = b[w[k]]; if (v === p) mp++; else if (v === o) mo++; }
      if (mp && mo) continue;
      if (mp === 3) score += 40; else if (mp === 2) score += 4; else if (mp === 1) score += 1;
      if (mo === 3) score -= 40; else if (mo === 2) score -= 4; else if (mo === 1) score -= 1;
    }
    return score;
  }

  const TT = new Map();
  let nodes = 0, deadline = 0, stopped = false;

  function negamax(s, depth, alpha, beta, p) {
    if ((++nodes & 2047) === 0 && Date.now() > deadline) stopped = true;
    if (stopped) return 0;
    const o = 3 - p;
    if (s.moves === N) return 0;
    for (const c of ORDER) if (canWinNow(s, c, p)) return WIN - s.moves - 1;
    if (s.moves === N - 1) return 0;

    let forced = -1, threats = 0;
    for (const c of ORDER) if (canWinNow(s, c, o)) { threats++; forced = c; }
    if (threats >= 2) return -(WIN - s.moves - 2);
    if (depth <= 0) return evaluate(s.b, p);

    const alphaOrig = alpha;
    const e = TT.get(s.h1);
    let ttMove = -1;
    if (e && e.k === s.h2) {
      ttMove = e.m;
      if (e.d >= depth) {
        if (e.f === 0) return e.v;
        if (e.f === 1 && e.v > alpha) alpha = e.v;
        else if (e.f === 2 && e.v < beta) beta = e.v;
        if (alpha >= beta) return e.v;
      }
    }

    let moves;
    if (forced >= 0) moves = [forced];
    else {
      const good = [], bad = [];
      if (ttMove >= 0 && s.h[ttMove] < H) (givesAway(s, ttMove, p) ? bad : good).push(ttMove);
      for (const c of ORDER) {
        if (c === ttMove || s.h[c] >= H) continue;
        (givesAway(s, c, p) ? bad : good).push(c);
      }
      moves = good.concat(bad);
    }

    let best = -Infinity, bestMove = moves[0];
    for (const c of moves) {
      play(s, c, p);
      const v = -negamax(s, depth - 1, -beta, -alpha, o);
      undo(s, c, p);
      if (stopped) return 0;
      if (v > best) { best = v; bestMove = c; }
      if (v > alpha) alpha = v;
      if (alpha >= beta) break;
    }
    TT.set(s.h1, { k: s.h2, d: depth, f: best <= alphaOrig ? 2 : best >= beta ? 1 : 0, v: best, m: bestMove });
    return best;
  }

  function search(board, p, ms) {
    const s = { b: Int8Array.from(board), h: new Int8Array(W), moves: 0, h1: 0, h2: 0 };
    for (let c = 0; c < W; c++) for (let r = 0; r < H; r++) {
      const v = s.b[c * H + r];
      if (v) { s.h[c] = r + 1; s.moves++; s.h1 ^= Z1[v][c * H + r]; s.h2 ^= Z2[v][c * H + r]; }
    }
    const legal = ORDER.filter(c => s.h[c] < H);
    if (s.moves === 0) return { move: 3, score: 0, depth: 0, nodes: 0 };
    for (const c of legal) if (canWinNow(s, c, p)) return { move: c, score: WIN - s.moves - 1, depth: 1, nodes: 0 };

    deadline = Date.now() + ms; stopped = false; nodes = 0;
    if (TT.size > 1500000) TT.clear();
    const o = 3 - p;
    let bestMove = legal[0], bestScore = 0, reached = 0;
    for (let d = 1; d <= N - s.moves; d++) {
      let alpha = -Infinity, curBest = -1, curScore = -Infinity;
      for (const c of [bestMove, ...legal.filter(x => x !== bestMove)]) {
        play(s, c, p);
        const v = -negamax(s, d - 1, -Infinity, -alpha, o);
        undo(s, c, p);
        if (stopped) break;
        if (v > curScore) { curScore = v; curBest = c; }
        if (v > alpha) alpha = v;
      }
      if (stopped) break;
      bestMove = curBest; bestScore = curScore; reached = d;
      if (Math.abs(bestScore) > WIN - 100) break;
    }
    return { move: bestMove, score: bestScore, depth: reached, nodes };
  }

  return { search, isWinAt, winLine, WIN, W, H };
}

(function () {
  const E = c4EngineFactory();
  const { W, H, WIN } = E;
  const HUMAN = 1, MACHINE = 2, THINK_MS = 1800;
  const SK_LOG = 'tis_wagerLog', SK_REC = 'tis_wagerRecord';

  const $ = id => document.getElementById(id);
  const boardEl = $('c4-board'), statusEl = $('c4-status'), form = $('wager-form');
  const fieldset = $('wager-fields'), errEl = $('wager-err'), forfeitBtn = $('c4-forfeit');
  const resultEl = $('c4-result'), stakeEl = $('wager-stake');
  if (!boardEl || !form) return;

  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  let worker = null;
  try {
    const src = 'var E=(' + c4EngineFactory.toString() + ')();onmessage=function(e){postMessage(E.search(e.data.board,e.data.p,e.data.ms));};';
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
  } catch (e) { worker = null; }

  function askMachine(board, cb) {
    const payload = { board: Array.from(board), p: MACHINE, ms: THINK_MS };
    const t0 = performance.now();
    const done = r => { r.ms = performance.now() - t0; cb(r); };
    const local = () => setTimeout(() => done(E.search(payload.board, MACHINE, 1200)), 40);
    if (!worker) return local();
    worker.onmessage = e => done(e.data);
    worker.onerror = ev => { if (ev.preventDefault) ev.preventDefault(); worker = null; local(); };
    worker.postMessage(payload);
  }

  let board, heights, moves, turn, live = false, busy = false, gameId = 0, player = null;
  const cols = [], cells = [];

  for (let c = 0; c < W; c++) {
    const col = document.createElement('button');
    col.type = 'button';
    col.className = 'c4-col';
    col.setAttribute('aria-label', 'Drop a rock in column ' + (c + 1));
    const arr = [];
    for (let r = 0; r < H; r++) {
      const cell = document.createElement('span');
      cell.className = 'c4-cell';
      col.appendChild(cell);
      arr.push(cell);
    }
    col.addEventListener('click', () => humanMove(c));
    cols.push(col); cells.push(arr);
    boardEl.appendChild(col);
  }
  boardEl.addEventListener('keydown', e => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 7) { e.preventDefault(); humanMove(n - 1); }
  });

  function reset() {
    board = new Int8Array(W * H); heights = new Int8Array(W); moves = 0;
    cells.forEach(arr => arr.forEach(el => { el.className = 'c4-cell'; }));
  }

  function sync() {
    cols.forEach((col, c) => { col.disabled = !live || busy || turn !== HUMAN || heights[c] >= H; });
    boardEl.classList.toggle('is-live', live && !busy && turn === HUMAN);
  }

  function status(text, mood) {
    statusEl.textContent = text;
    statusEl.dataset.mood = mood || '';
  }

  function place(c, p) {
    const r = heights[c], cell = c * H + r;
    board[cell] = p; heights[c]++; moves++;
    cells.forEach(arr => arr.forEach(el => el.classList.remove('last')));
    const el = cells[c][r];
    el.className = 'c4-cell p' + p + ' drop last';
    el.style.setProperty('--fall', String(H - r));
    if (E.isWinAt(board, cell, p)) return 'win';
    if (moves === W * H) return 'draw';
    return null;
  }

  function humanMove(c) {
    if (!live || busy || turn !== HUMAN || heights[c] >= H) return;
    const end = place(c, HUMAN);
    if (end === 'win') return finish('W');
    if (end === 'draw') return finish('D');
    machineMove();
  }

  const THINKING = [
    'The machine is computing your defeat',
    'The machine is reviewing every future in which you lose',
    'The machine is thinking. You could still leave',
    'The machine is not nervous. You might be',
  ];

  function machineMove() {
    turn = MACHINE; busy = true; sync();
    status(THINKING[Math.floor(Math.random() * THINKING.length)] + '…', 'thinking');
    const id = gameId, before = moves;
    askMachine(board, r => {
      if (id !== gameId || !live) return;
      busy = false;
      const end = place(r.move, MACHINE);
      if (end === 'win') return finish('L');
      if (end === 'draw') return finish('D');
      turn = HUMAN; sync();
      const left = Math.max(1, Math.ceil((WIN - Math.abs(r.score) - before) / 2));
      if (r.score > WIN - 100) {
        status(`Forced win found. The machine needs ${left} more move${left > 1 ? 's' : ''}. Nothing you do changes that.`, 'doom');
      } else if (r.score < -(WIN - 100)) {
        status('The machine has calculated that it is losing. It is now making that take as long as possible.', 'hope');
      } else {
        status(`Machine played column ${r.move + 1}. Searched ${r.nodes.toLocaleString()} positions, ${r.depth} moves deep, in ${(r.ms / 1000).toFixed(1)}s. Your move.`, '');
      }
    });
  }

  function cleanName(v) {
    const s = String(v || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
    return s || 'Anonymous Gambler';
  }

  function updateStake() {
    if (!stakeEl || !window.TIS) return;
    const n = TIS.cartCount();
    const cartText = n ? `${n} item${n > 1 ? 's' : ''} in your bag ($${TIS.cartTotal().toFixed(2)})` : 'an empty bag (bet it anyway)';
    stakeEl.textContent = `Currently at stake: ${cartText}, your shopping privileges for 22h 22m, and your name.`;
  }
  updateStake();
  setInterval(updateStake, 1500);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (live) return;
    if (!$('wager-accept').checked) { errEl.textContent = 'Tick the box to accept the stakes. The machine will not play an uncommitted opponent.'; return; }
    errEl.textContent = '';
    const first = form.querySelector('input[name="wager-first"]:checked').value;
    player = { name: cleanName($('wager-name').value), first };
    gameId++; reset();
    live = true; busy = false;
    fieldset.disabled = true;
    forfeitBtn.hidden = false;
    resultEl.hidden = true;
    boardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (first === 'machine') machineMove();
    else { turn = HUMAN; sync(); status(`${player.name}, you move first. Click a column or press 1–7. Center is strongest.`, ''); cols[3].focus({ preventScroll: true }); }
  });

  forfeitBtn.addEventListener('click', () => { if (live) finish('L', true); });

  function finish(result, forfeited) {
    live = false; busy = false; gameId++;
    forfeitBtn.hidden = true;
    fieldset.disabled = false;
    $('wager-accept').checked = false;
    sync();

    const winner = result === 'W' ? HUMAN : result === 'L' ? MACHINE : 0;
    const line = winner && !forfeited ? E.winLine(board, winner) : null;
    if (line) line.forEach(cell => cells[Math.floor(cell / H)][cell % H].classList.add('win'));

    const rec = store.get(SK_REC, { w: 0, l: 0, d: 0 });
    rec[result.toLowerCase()]++;
    store.set(SK_REC, rec);
    const entry = { n: player.name, r: result, f: player.first, m: moves, x: !!forfeited, t: Date.now() };
    const log = store.get(SK_LOG, []);
    log.unshift(entry);
    store.set(SK_LOG, log.slice(0, 30));

    const T = window.TIS;
    let title, body;
    if (result === 'W') {
      if (T) T.waiveCooldown();
      title = 'You beat the machine.';
      body = 'Your 22:22 cooldown is waived. Rice fistbumps you twice. Rice still does not say thank you. Your name goes on the Wall of Winners.';
      status('You won. The machine is recalibrating. It will not go easier next time.', 'hope');
    } else if (result === 'L') {
      if (T) { T.clearCart(); T.startCooldown(); }
      title = forfeited ? 'Forfeited. Counts as a loss.' : 'The machine wins.';
      body = 'Your bag has been emptied. Your 22:22 cooldown started just now. A 1-star review has been posted in your name. Your name goes on the Wall of Losses.';
      status(forfeited ? 'You forfeited. The machine accepts.' : `Lost in ${moves} moves. The machine does not gloat. The store does.`, 'doom');
      addLossReview(entry, true);
    } else {
      title = 'Draw.';
      body = 'Nothing happens. Nobody wins, nobody loses, nothing changes. The most inconvenient outcome available.';
      status('Draw. The board is full and so is the disappointment.', '');
    }
    $('c4-result-title').textContent = title;
    $('c4-result-body').textContent = body;
    resultEl.dataset.result = result;
    resultEl.hidden = false;
    $('wager-go').textContent = 'Bet It All Again';
    renderWalls();
    if (T) T.toast(title);
  }

  function addLossReview(entry, fresh) {
    const grid = document.querySelector('.rgrid');
    if (!grid) return;
    const card = document.createElement('div');
    card.className = 'rcard rcard--wager';
    const mk = (tag, cls, text) => { const el = document.createElement(tag); el.className = cls; el.textContent = text; return el; };
    card.appendChild(mk('div', 'rcard__stars', '★☆☆☆☆'));
    card.appendChild(mk('p', 'rcard__txt', entry.x
      ? '"I bet it all against a computer at a rock store. I forfeited. My bag is gone. I can\'t shop for 22 hours. 1 star."'
      : `"I bet it all against a computer at a rock store. I lost in ${entry.m} moves. My bag is gone. I can't shop for 22 hours. 1 star."`));
    card.appendChild(mk('div', 'rcard__author', `— ${entry.n} | #BetItAll™ casualty | ${new Date(entry.t).toLocaleDateString()}`));
    const resp = mk('div', 'rcard__resp', '');
    const strong = document.createElement('strong');
    strong.textContent = 'Store Response: ';
    resp.appendChild(strong);
    resp.appendChild(document.createTextNode('The machine does not gloat. We do. This review was written for you, as disclosed in the stakes. It stays on the front page.'));
    card.appendChild(resp);
    grid.prepend(card);
    if (fresh) card.classList.add('fresh');
  }

  function renderWalls() {
    const rec = store.get(SK_REC, { w: 0, l: 0, d: 0 });
    $('wager-record').textContent = `${rec.w} W – ${rec.l} L – ${rec.d} D`;
    const log = store.get(SK_LOG, []);
    const fill = (id, rows, empty) => {
      const ul = $(id);
      ul.textContent = '';
      if (!rows.length) { const li = document.createElement('li'); li.className = 'wall__empty'; li.textContent = empty; ul.appendChild(li); return; }
      rows.slice(0, 8).forEach(e => {
        const li = document.createElement('li');
        const name = document.createElement('strong');
        name.textContent = e.n;
        li.appendChild(name);
        const how = e.x ? 'forfeited' : e.r === 'W' ? `won in ${e.m} moves` : `lost in ${e.m} moves`;
        li.appendChild(document.createTextNode(` — ${how}, ${e.f === 'me' ? 'moved first' : 'machine moved first'}`));
        ul.appendChild(li);
      });
    };
    fill('wall-losses', log.filter(e => e.r === 'L'), 'Nobody yet. The machine is patient.');
    fill('wall-wins', log.filter(e => e.r === 'W'), 'Nobody yet. Statistically, this stays empty.');
  }

  store.get(SK_LOG, []).filter(e => e.r === 'L').slice(0, 4).reverse().forEach(e => addLossReview(e, false));
  reset(); sync(); renderWalls();
  status('Place your wager to start. The machine is ready. It is always ready.', '');
})();
