"use strict";
/* ---------- five more games: duck pond, dodgems, coaster run, mirror maze, arcade lights ---------- */
var game = null;
var ITEM_GAME = {ringtoss:'toss', duckpond:'ducks', dodgems:'dodgems', coaster:'coaster', maze:'maze', arcade:'lights', tower:'four', wheel:'oth'};
ITEMS.forEach(function(it){ if(ITEM_GAME[it.id] && !it.activity){ it.activity = true; it.desc += ' It has a game you can play. Each game costs 1 ride ticket.'; } });
function bestOf(id){ return id === 'toss' ? state.tossBest : ((state.best || {})[GAMES[id].key || id] || 0); }
function bestLine(id){ return GAMES[id].best ? GAMES[id].best() : 'Best score: '+bestOf(id); }
function gLoop(step){
  var g = game, last = performance.now();
  (function f(ts){
    if(game !== g || g.phase !== 'play') return;
    var dt = Math.max(0, Math.min(0.05,(ts-last)/1000)); last = ts; step(dt);
    if(game === g && g.phase === 'play') g.raf = requestAnimationFrame(f);
  })(last);
}
function carSVG(x, y, col){
  return '<g transform="translate('+x+','+y.toFixed(1)+')"><rect x="-19" y="-27" width="38" height="54" rx="12" fill="'+col+'" stroke="'+INK+'" stroke-width="2"/><rect x="-11" y="-12" width="22" height="20" rx="5" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/><circle cx="0" cy="-2" r="5" fill="'+INK+'"/></g>';
}
var GAMES = {
  toss:{name:'Ring toss'},

  ducks:{name:'Duck pond', key:'ducks2', hud:['Time','30'], hud2:['Hooks','12'],
    how:'You have 12 hooks and 30 seconds. Each duck shows its points, from 1 to 5. The ducks worth more are smaller and faster. Tap a duck to hook it. The game ends when the time or the hooks run out, so choose which ducks to spend your hooks on.',
    field:function(){ return '<svg class="toss" id="gf" viewBox="0 0 320 220" style="touch-action:none;background:#bfe6f2" role="img" aria-label="Duck pond"><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M30 60 q8 -6 16 0 t16 0"/><path d="M210 110 q8 -6 16 0 t16 0"/><path d="M90 170 q8 -6 16 0 t16 0"/><path d="M250 30 q8 -6 16 0 t16 0"/></g><g id="gl"></g></svg>'; },
    controls:function(){ return ''; },
    duck:function(k){ var c = ['#fff3b0','#ffe27a','#ffd23f','#f9bc1a','#f08a24'][k.p-1], z = [1.3,1.12,0.96,0.82,0.7][k.p-1], dir = k.v > 0 ? 1 : -1;
      return '<g data-d="'+k.id+'" transform="translate('+k.x.toFixed(1)+','+k.y+')" style="cursor:pointer"><circle r="'+Math.max(19,26*z).toFixed(0)+'" fill="transparent"/><g transform="scale('+(dir*z)+','+z+')"><ellipse cx="-2" cy="5" rx="17" ry="11" fill="'+c+'" stroke="'+INK+'" stroke-width="2"/><circle cx="11" cy="-7" r="8" fill="'+c+'" stroke="'+INK+'" stroke-width="2"/><path d="M18 -8 l9 2 l-9 4 Z" fill="#e2572b" stroke="'+INK+'" stroke-width="1.2"/><circle cx="13" cy="-9" r="1.6" fill="'+INK+'"/></g>'+
        '<text x="'+(-3*dir*z).toFixed(1)+'" y="'+(5*z+4.5).toFixed(1)+'" text-anchor="middle" style="font:800 '+(13*z).toFixed(1)+'px var(--body);fill:'+INK+'">'+k.p+'</text></g>'; },
    start:function(g){ var self = this; g.d = []; g.T = 30; g.el = 0; g.spawn = 0; g.n = 0; g.hooks = 12;
      $('#gf').addEventListener('pointerdown', function(e){
        var t = e.target.closest ? e.target.closest('[data-d]') : null; if(!t || game !== g || g.phase !== 'play' || g.hooks < 1) return; e.preventDefault();
        var id = +t.getAttribute('data-d');
        g.d = g.d.filter(function(k){ if(k.id === id){ g.score += k.p; g.hooks--; return false; } return true; });
        $('#gs').textContent = g.score; $('#gt2').textContent = g.hooks; $('#gl').innerHTML = g.d.map(self.duck).join('');
        if(g.hooks < 1) gameOver();
      });
      gLoop(function(dt){
        g.el += dt; if(g.el >= g.T){ gameOver(); return; }
        $('#gt').textContent = Math.ceil(g.T-g.el);
        g.spawn -= dt;
        if(g.spawn <= 0){ var dir = Math.random() < 0.5 ? 1 : -1, r = Math.random(), p = r < 0.34 ? 1 : r < 0.6 ? 2 : r < 0.8 ? 3 : r < 0.92 ? 4 : 5;
          g.d.push({id:g.n++, p:p, x:dir > 0 ? -30 : 350, y:34+rnd(0,150), v:dir*(42+rnd(0,22))*[1,1.3,1.7,2.2,2.8][p-1]}); g.spawn = 0.4+Math.random()*0.45; }
        g.d.forEach(function(k){ k.x += k.v*dt; }); g.d = g.d.filter(function(k){ return k.x > -45 && k.x < 365; });
        $('#gl').innerHTML = g.d.map(self.duck).join('');
      });
    }},

  dodgems:{name:'Dodgems', hud:['Bumps left','3'],
    how:'Other cars drive toward you, and they get faster. Use the Left and Right buttons to change lanes. You score 1 point for each car you dodge. The game ends after 3 bumps.',
    field:function(){ return '<svg class="toss" id="gf" viewBox="0 0 320 250" style="background:#eef1f5" role="img" aria-label="Dodgem track with three lanes"><g stroke="'+INK+'" stroke-width="2" stroke-dasharray="10 10" opacity=".35"><line x1="120" y1="0" x2="120" y2="250"/><line x1="200" y1="0" x2="200" y2="250"/></g><rect x="38" y="0" width="244" height="250" fill="none" stroke="'+INK+'" stroke-width="3"/><g id="gl"></g></svg>'; },
    controls:function(){ return '<div class="row"><button class="btn" style="flex:1;padding:16px" data-act="g:left">Left</button><button class="btn" style="flex:1;padding:16px" data-act="g:right">Right</button></div>'; },
    draw:function(g){ $('#gl').innerHTML = g.cars.map(function(c){ return carSVG(80+c.lane*80, c.y, 'var(--coral)'); }).join('')+carSVG(80+g.lane*80, 205, g.flash > 0 ? '#fff' : 'var(--teal)'); },
    start:function(g){ var self = this; g.lane = 1; g.cars = []; g.lives = 3; g.el = 0; g.spawn = 0.6; g.flash = 0;
      gLoop(function(dt){
        g.el += dt; g.flash = Math.max(0,g.flash-dt);
        var sp = Math.min(430,120+g.el*5); g.spawn -= dt;
        if(g.spawn <= 0){ g.cars.push({lane:rnd(0,2), y:-30}); g.spawn = Math.max(0.42,0.95-g.el*0.012); }
        g.cars.forEach(function(c){ c.y += sp*dt; });
        g.cars = g.cars.filter(function(c){
          if(c.lane === g.lane && Math.abs(c.y-205) < 40){ g.lives--; g.flash = 0.35; $('#gt').textContent = g.lives; return false; }
          if(c.y > 280){ g.score++; $('#gs').textContent = g.score; return false; }
          return true; });
        if(g.lives <= 0){ gameOver(); return; }
        self.draw(g);
      });
    },
    cmd:function(g,c){ if(c === 'left') g.lane = Math.max(0,g.lane-1); if(c === 'right') g.lane = Math.min(2,g.lane+1); this.draw(g); },
    key:function(g,k){ if(k === 'ArrowLeft') this.cmd(g,'left'); else if(k === 'ArrowRight') this.cmd(g,'right'); else return false; return true; }},

  coaster:{name:'Coaster run', hud:['Speed','1.0'],
    how:'The track has gaps. Press Jump to hop over each one. The car speeds up as you go. You score 1 point for each gap you clear, and the game ends when the car falls into a gap. The path of each jump is a parabola.',
    field:function(){ return '<svg class="toss" id="gf" viewBox="0 0 320 180" role="img" aria-label="Roller coaster track"><rect x="0" y="150" width="320" height="30" fill="var(--lawn)"/><g id="gl"></g></svg>'; },
    controls:function(){ return '<div><button class="btn" style="width:100%;padding:18px" data-act="g:jump">Jump</button></div>'; },
    draw:function(g, h){
      var s = '', x = 0, gaps = g.gaps.slice().sort(function(a,b){ return a.x-b.x; });
      gaps.forEach(function(q){ if(q.x > x) s += '<line x1="'+x.toFixed(1)+'" y1="130" x2="'+Math.min(320,q.x).toFixed(1)+'" y2="130" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>'; x = Math.max(x,q.x+q.w); });
      if(x < 320) s += '<line x1="'+x.toFixed(1)+'" y1="130" x2="320" y2="130" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>';
      for(var p = (g.off%40+40)%40; p < 320; p += 40) if(!gaps.some(function(q){ return p > q.x-3 && p < q.x+q.w+3; })) s += '<line x1="'+p.toFixed(1)+'" y1="132" x2="'+p.toFixed(1)+'" y2="150" stroke="'+INK+'" stroke-width="2" opacity=".5"/>';
      s += '<g transform="translate(85,'+(127-h).toFixed(1)+')"><rect x="-17" y="-20" width="34" height="16" rx="5" fill="var(--coral)" stroke="'+INK+'" stroke-width="2"/><circle cx="-9" cy="-3" r="4.5" fill="'+INK+'"/><circle cx="9" cy="-3" r="4.5" fill="'+INK+'"/><circle cx="-4" cy="-23" r="4" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/></g>';
      $('#gl').innerHTML = s; },
    start:function(g){ var self = this; g.gaps = [{x:430,w:40}]; g.j = -1; g.off = 0;
      gLoop(function(dt){
        var sp = 150+Math.min(g.score,25)*7;
        if(g.j >= 0){ g.j += dt/0.6; if(g.j >= 1) g.j = -1; }
        var h = g.j >= 0 ? 4*54*g.j*(1-g.j) : 0;
        g.off -= sp*dt; g.gaps.forEach(function(q){ q.x -= sp*dt; });
        var last = g.gaps[g.gaps.length-1]; if(last.x < 320) g.gaps.push({x:last.x+last.w+rnd(150,260)+Math.min(g.score,30)*3, w:rnd(34,48)});
        g.gaps = g.gaps.filter(function(q){ if(!q.done && q.x+q.w < 68){ q.done = 1; g.score++; $('#gs').textContent = g.score; $('#gt').textContent = ((150+Math.min(g.score,25)*7)/150).toFixed(1); } return q.x+q.w > -10; });
        var fell = h < 5 && g.gaps.some(function(q){ return 85 > q.x+4 && 85 < q.x+q.w-4; });
        self.draw(g, fell ? -14 : h);
        if(fell) gameOver();
      });
    },
    cmd:function(g,c){ if(c === 'jump' && g.j < 0) g.j = 0; },
    key:function(g,k){ if(k === ' ' || k === 'ArrowUp'){ this.cmd(g,'jump'); return true; } return false; }},

  maze:{name:'Mirror maze', key:'mirrors', hud:['Time','180'],
    how:'A beam of light has to reach every star. Tap a square to place a mirror, tap it again to turn the mirror, and tap a third time to take it away. A mirror turns the beam through a right angle, and a dark block stops it. Each puzzle tells you how many mirrors it needs and gives you one spare. Solving it without the spare scores 2 points, and using the spare scores 1. The puzzles get harder as you go. You have 3 minutes.',
    // grid size, blocks, stars, fewest and most mirrors the puzzle may need
    plan:[[5,3,1,1,1],[5,4,1,2,2],[6,6,1,2,2],[6,7,1,3,3],[6,6,2,2,3],[7,9,2,3,3]],
    turn:function(m, d){ return m === '/' ? [-d[1],-d[0]] : [d[1],d[0]]; },
    trace:function(P, mir){ var x = P.sx, y = P.sy, d = [P.dx,P.dy], N = P.n, pts = [[x,y]], lit = {}, n = 0;
      for(var i = 0; i < 200; i++){ x += d[0]; y += d[1];
        if(x < 0 || x >= N || y < 0 || y >= N || P.walls[x+','+y]){ pts.push([x-d[0]/2,y-d[1]/2]); break; }
        pts.push([x,y]); var k = x+','+y;
        if(P.stars[k] && !lit[k]){ lit[k] = 1; n++; }
        if(mir[k]) d = this.turn(mir[k], d); }
      return {pts:pts, lit:lit, done:n === P.ns}; },
    // the fewest mirrors that light every star, up to K, or -1. Also returns one way of doing it
    solve:function(P, K){ var self = this, N = P.n, dec = {};
      function go(x, y, d, left, lit, n, steps){ var mine = [], ok = false;
        while(steps++ < 160){ x += d[0]; y += d[1];
          if(x < 0 || x >= N || y < 0 || y >= N || P.walls[x+','+y]) break;
          var k = x+','+y;
          if(P.stars[k]){ if(!lit[k]){ lit = Object.assign({}, lit); lit[k] = 1; n++; if(n === P.ns){ ok = true; break; } } continue; }
          var c = dec[k];
          if(c === '/' || c === '\\'){ d = self.turn(c, d); continue; }
          if(c === '.') continue;
          if(left > 0){ dec[k] = '/'; if(go(x, y, self.turn('/', d), left-1, lit, n, steps)){ ok = true; break; }
            dec[k] = '\\'; if(go(x, y, self.turn('\\', d), left-1, lit, n, steps)){ ok = true; break; } }
          dec[k] = '.'; mine.push(k); }
        if(!ok) mine.forEach(function(k){ delete dec[k]; });
        return ok; }
      for(var m = 0; m <= K; m++){ dec = {}; if(go(P.sx, P.sy, [P.dx,P.dy], m, {}, 0, 0)){ var sol = {}; for(var k in dec) if(dec[k] !== '.') sol[k] = dec[k]; return {min:m, sol:sol}; } }
      return {min:-1}; },
    gen:function(lvl){ var plan = this.plan[Math.min(lvl, this.plan.length-1)], N = plan[0];
      for(var t = 0; t < 400; t++){ var P = {n:N, walls:{}, stars:{}, ns:plan[2]}, side = rnd(0,3), a = rnd(0,N-1), cells = [], i;
        if(side === 0){ P.sx = -1; P.sy = a; P.dx = 1; P.dy = 0; } else if(side === 1){ P.sx = N; P.sy = a; P.dx = -1; P.dy = 0; }
        else if(side === 2){ P.sx = a; P.sy = -1; P.dx = 0; P.dy = 1; } else { P.sx = a; P.sy = N; P.dx = 0; P.dy = -1; }
        for(i = 0; i < N*N; i++) cells.push((i%N)+','+Math.floor(i/N));
        cells = shuffle(cells); for(i = 0; i < plan[1]; i++) P.walls[cells[i]] = 1; for(i = 0; i < plan[2]; i++) P.stars[cells[plan[1]+i]] = 1;
        var r = this.solve(P, plan[4]);
        if(r.min >= plan[3]){ P.par = r.min; P.sol = r.sol; return P; } }
      return lvl > 0 ? this.gen(lvl-1) : {n:5, walls:{'3,2':1}, stars:{'1,4':1}, ns:1, sx:-1, sy:2, dx:1, dy:0, par:1, sol:{'1,2':'\\'}}; },
    field:function(){ return '<div id="gb"></div><p id="gmsg" class="small" aria-live="polite"></p>'; },
    controls:function(){ return '<div class="row"><button class="btn plain" data-act="g:clear">Clear mirrors</button><button class="btn plain" data-act="g:skip">Skip this puzzle</button></div>'; },
    svg:function(g){ var P = g.P, N = P.n, S = 296/N, O = 22, r = this.trace(P, g.mir), s = '', x, y, k, self = this;
      function X(v){ return (O+(v+0.5)*S).toFixed(1); }
      s += '<rect x="'+O+'" y="'+O+'" width="296" height="296" fill="#fff" stroke="'+INK+'" stroke-width="3"/>';
      for(x = 1; x < N; x++) s += '<line x1="'+(O+x*S)+'" y1="'+O+'" x2="'+(O+x*S)+'" y2="'+(O+296)+'" stroke="'+INK+'" stroke-width="1" opacity=".22"/><line x1="'+O+'" y1="'+(O+x*S)+'" x2="'+(O+296)+'" y2="'+(O+x*S)+'" stroke="'+INK+'" stroke-width="1" opacity=".22"/>';
      for(k in P.walls){ var w = k.split(','); s += '<rect x="'+(O+w[0]*S+2)+'" y="'+(O+w[1]*S+2)+'" width="'+(S-4)+'" height="'+(S-4)+'" rx="5" fill="'+INK+'"/>'; }
      var off = 11/S, ex = P.sx < 0 ? -0.5-off : P.sx >= N ? N-0.5+off : P.sx, ey = P.sy < 0 ? -0.5-off : P.sy >= N ? N-0.5+off : P.sy; r.pts[0] = [ex,ey];
      s += '<polyline points="'+r.pts.map(function(p){ return X(p[0])+','+X(p[1]); }).join(' ')+'" fill="none" stroke="#f08a24" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<circle cx="'+X(ex)+'" cy="'+X(ey)+'" r="8" fill="#f08a24" stroke="'+INK+'" stroke-width="2"/>';
      for(k in P.stars){ var c = k.split(','), sx = +X(+c[0]), sy = +X(+c[1]), d = '', R = S*0.34; for(var i = 0; i < 10; i++){ var a = -Math.PI/2+i*Math.PI/5, q = i%2 ? R*0.45 : R; d += (i ? 'L' : 'M')+(sx+q*Math.cos(a)).toFixed(1)+' '+(sy+q*Math.sin(a)).toFixed(1); }
        s += '<path d="'+d+'Z" fill="'+(r.lit[k] ? 'var(--sun)' : '#fff')+'" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"/>'; }
      for(k in g.mir){ var m = k.split(','), mx = +X(+m[0]), my = +X(+m[1]), e = S*0.34, up = g.mir[k] === '/';
        s += '<line x1="'+(mx-e)+'" y1="'+(up ? my+e : my-e)+'" x2="'+(mx+e)+'" y2="'+(up ? my-e : my+e)+'" stroke="'+INK+'" stroke-width="8" stroke-linecap="round"/><line x1="'+(mx-e)+'" y1="'+(up ? my+e : my-e)+'" x2="'+(mx+e)+'" y2="'+(up ? my-e : my+e)+'" stroke="#9fd8f0" stroke-width="4" stroke-linecap="round"/>'; }
      for(y = 0; y < N; y++) for(x = 0; x < N; x++){ k = x+','+y; if(P.walls[k] || P.stars[k]) continue;
        s += '<rect data-act="g:cell:'+k+'" x="'+(O+x*S)+'" y="'+(O+y*S)+'" width="'+S+'" height="'+S+'" fill="transparent" style="cursor:pointer"/>'; }
      return '<svg class="toss" viewBox="0 0 340 340" style="border:0;background:none" role="img" aria-label="Mirror puzzle">'+s+'</svg>'; },
    used:function(g){ return Object.keys(g.mir).length; },
    info:function(g){ var left = g.P.par+1-this.used(g); return 'This puzzle needs '+g.P.par+(g.P.par === 1 ? ' mirror' : ' mirrors')+'. You have '+left+' left.'; },
    draw:function(g, msg){ var e = $('#gb'); if(e) e.innerHTML = this.svg(g); if($('#gmsg')) $('#gmsg').textContent = msg || this.info(g); },
    next:function(g){ g.P = this.gen(g.lvl); g.mir = {}; g.busy = false; this.draw(g); },
    start:function(g){ g.T = 180; g.lvl = 0; this.next(g);
      g.iv = setInterval(function(){ if(game !== g || g.phase !== 'play'){ clearInterval(g.iv); return; } g.T--; var e = $('#gt'); if(e) e.textContent = g.T; if(g.T <= 0) gameOver(); }, 1000); },
    cmd:function(g, c, arg){ var self = this; if(g.busy) return;
      if(c === 'clear'){ g.mir = {}; this.draw(g); return; }
      if(c === 'skip'){ this.next(g); return; }
      if(c !== 'cell' || g.P.walls[arg] || g.P.stars[arg] || !/^\d,\d$/.test(arg)) return;
      var m = g.mir[arg];
      if(!m){ if(this.used(g) >= g.P.par+1){ this.draw(g, 'You have no mirrors left. Take one away first.'); return; } g.mir[arg] = '/'; }
      else if(m === '/') g.mir[arg] = '\\'; else delete g.mir[arg];
      if(this.trace(g.P, g.mir).done){ var pts = this.used(g) <= g.P.par ? 2 : 1; g.score += pts; g.busy = true; $('#gs').textContent = g.score;
        this.draw(g, pts === 2 ? 'Solved without the spare mirror. 2 points.' : 'Solved with the spare mirror. 1 point.');
        g.timers.push(setTimeout(function(){ if(game !== g || g.phase !== 'play') return; g.lvl++; self.next(g); }, 1300)); }
      else this.draw(g); }},

  lights:{name:'Arcade lights', hud:['Round','1'],
    how:'Four lights flash in a pattern. Watch, then press the lights in the same order. The pattern grows by one light each round. Your score is the number of rounds you finish.',
    field:function(){ return '<div class="pads">'+[0,1,2,3].map(function(i){ return '<button class="pad p'+i+'" id="pad'+i+'" data-act="g:pad:'+i+'" aria-label="Light '+(i+1)+'"></button>'; }).join('')+'</div><p id="gmsg" class="small" aria-live="polite">Watch the pattern.</p>'; },
    controls:function(){ return ''; },
    flash:function(p, ms){ var e = $('#pad'+p); if(!e) return; e.classList.add('lit'); setTimeout(function(){ e.classList.remove('lit'); }, ms); },
    round:function(g){ var self = this, gap; g.seq.push(rnd(0,3)); g.pos = 0; g.input = false; gap = Math.max(300,560-g.seq.length*20);
      $('#gt').textContent = g.seq.length; $('#gmsg').textContent = 'Watch the pattern.';
      g.seq.forEach(function(p,i){ g.timers.push(setTimeout(function(){ if(game === g && g.phase === 'play') self.flash(p, gap*0.6); }, 700+i*gap)); });
      g.timers.push(setTimeout(function(){ if(game !== g || g.phase !== 'play') return; g.input = true; $('#gmsg').textContent = 'Your turn. Press the lights in the same order.'; }, 700+g.seq.length*gap)); },
    start:function(g){ g.seq = []; this.round(g); },
    cmd:function(g,c,arg){ if(c !== 'pad' || !g.input) return; var p = +arg, self = this; this.flash(p,160);
      if(p !== g.seq[g.pos]){ gameOver(); return; }
      g.pos++;
      if(g.pos === g.seq.length){ g.score = g.seq.length; $('#gs').textContent = g.score; g.input = false; $('#gmsg').textContent = 'Correct.';
        g.timers.push(setTimeout(function(){ if(game === g && g.phase === 'play') self.round(g); }, 800)); } }}
,

  four:{name:'Connect Four', item:'tower',
    how:'Take turns with the Robot to drop a disc into a column. The first to get four in a row wins. The four can run across, up and down or diagonally. Your discs are red and you go first. The Robot gets harder after every second win, up to level 5.',
    level:function(){ return Math.min(5,1+Math.floor((state.fourWins || 0)/2)); },
    best:function(){ return 'Wins: '+(state.fourWins || 0)+'. Robot level: '+this.level(); },
    chips:function(){ return '<span class="chip">Robot level: '+this.level()+'</span><span class="chip sun">Your wins: '+(state.fourWins || 0)+'</span>'; },
    quads:(function(){ var q = [], r, c; for(r = 0; r < 6; r++) for(c = 0; c < 7; c++){ var i = r*7+c;
      if(c < 4) q.push([i,i+1,i+2,i+3]); if(r < 3) q.push([i,i+7,i+14,i+21]); if(c < 4 && r < 3) q.push([i,i+8,i+16,i+24]); if(c > 2 && r < 3) q.push([i,i+6,i+12,i+18]); } return q; })(),
    line:function(b, p){ for(var k = 0; k < this.quads.length; k++){ var q = this.quads[k]; if(b[q[0]] === p && b[q[1]] === p && b[q[2]] === p && b[q[3]] === p) return q; } return null; },
    svg:function(g, live){ var s = '<rect x="1.5" y="1.5" width="305" height="263" rx="12" fill="var(--teal)" stroke="'+INK+'" stroke-width="3"/>', r, c;
      for(r = 0; r < 6; r++) for(c = 0; c < 7; c++){ var i = r*7+c, v = g.b[i], hit = g.line && g.line.indexOf(i) >= 0;
        s += '<circle cx="'+(22+44*c)+'" cy="'+(22+44*(5-r))+'" r="17" fill="'+(v === 1 ? 'var(--coral)' : v === 2 ? 'var(--sun)' : '#fff')+'" stroke="'+(hit ? '#fff' : INK)+'" stroke-width="'+(hit ? 5 : 2)+'"/>'+(i === g.last && !hit ? '<circle cx="'+(22+44*c)+'" cy="'+(22+44*(5-r))+'" r="4" fill="'+INK+'"/>' : ''); }
      if(live) for(c = 0; c < 7; c++) s += '<rect data-act="g:col:'+c+'" x="'+(44*c)+'" y="0" width="44" height="266" fill="transparent" style="cursor:pointer" role="button" aria-label="Column '+(c+1)+'"/>';
      return '<svg class="toss" id="gf" viewBox="0 0 308 266" style="border:0;background:none" role="img" aria-label="Connect Four board">'+s+'</svg>'; },
    field:function(){ return '<div id="gb"></div><p id="gmsg" class="small" aria-live="polite">Your turn. Tap a column.</p>'; },
    controls:function(){ return ''; },
    draw:function(g, msg){ var e = $('#gb'); if(e) e.innerHTML = this.svg(g, true); if(msg && $('#gmsg')) $('#gmsg').textContent = msg; },
    start:function(g){ g.b = []; for(var i = 0; i < 42; i++) g.b.push(0); g.h = [0,0,0,0,0,0,0]; g.turn = 1; g.last = -1; g.line = null; g.n = 0; g.lv = this.level(); this.draw(g); },
    drop:function(g, c, p){ var i = g.h[c]*7+c; g.b[i] = p; g.h[c]++; g.n++; g.last = i; g.line = this.line(g.b, p); },
    finish:function(g, res){ g.turn = 0; g.result = res; this.draw(g, res === 'win' ? 'Four in a row. You win.' : res === 'loss' ? 'The Robot has four in a row.' : 'The board is full. It is a draw.');
      g.timers.push(setTimeout(function(){ if(game === g) gameOver(); }, 1500)); },
    cmd:function(g, c, arg){ var self = this, col = +arg; if(c !== 'col' || g.turn !== 1 || !(col >= 0 && col < 7) || g.h[col] >= 6) return;
      this.drop(g, col, 1);
      if(g.line){ this.finish(g,'win'); return; } if(g.n === 42){ this.finish(g,'draw'); return; }
      g.turn = 2; this.draw(g, 'The Robot is thinking.');
      g.timers.push(setTimeout(function(){ if(game !== g || g.phase !== 'play') return;
        self.drop(g, self.ai(g, g.lv+1), 2);
        if(g.line){ self.finish(g,'loss'); return; } if(g.n === 42){ self.finish(g,'draw'); return; }
        g.turn = 1; self.draw(g, 'Your turn. Tap a column.'); }, 450)); },
    key:function(g, k){ if(k >= '1' && k <= '7'){ this.cmd(g,'col',''+(+k-1)); return true; } return false; },
    // the Robot looks a number of moves ahead that grows with its level
    ai:function(g, depth){ var b = g.b.slice(), h = g.h.slice(), Q = this.quads, self = this, order = [3,2,4,1,5,0,6], W = [0,1,4,12];
      function val(p){ var s = 0, o = 3-p; for(var k = 0; k < Q.length; k++){ var q = Q[k], a = 0, e = 0; for(var j = 0; j < 4; j++){ var x = b[q[j]]; if(x === p) a++; else if(x === o) e++; } if(e === 0) s += W[a]; else if(a === 0) s -= W[e]; }
        for(var r = 0; r < 6; r++){ var m = b[r*7+3]; if(m === p) s += 2; else if(m === o) s -= 2; } return s; }
      function won(i, p){ for(var k = 0; k < Q.length; k++){ var q = Q[k]; if((q[0] === i || q[1] === i || q[2] === i || q[3] === i) && b[q[0]] === p && b[q[1]] === p && b[q[2]] === p && b[q[3]] === p) return true; } return false; }
      function nega(p, d, al, be){ var best = -1e9, any = false;
        for(var k = 0; k < 7; k++){ var c = order[k]; if(h[c] >= 6) continue; any = true; var i = h[c]*7+c, v; b[i] = p; h[c]++;
          if(won(i,p)) v = 100000+d; else if(d === 0) v = val(p); else v = -nega(3-p, d-1, -be, -al);
          b[i] = 0; h[c]--; if(v > best) best = v; if(best > al) al = best; if(al >= be) break; }
        return any ? best : 0; }
      var top = -1e9, picks = [];
      order.forEach(function(c){ if(h[c] >= 6) return; var i = h[c]*7+c, v; b[i] = 2; h[c]++; v = won(i,2) ? 200000 : -nega(1, depth-1, -1e9, 1e9); b[i] = 0; h[c]--;
        if(v > top){ top = v; picks = [c]; } else if(v === top) picks.push(c); });
      if(top <= -100000){ var blk = picks.filter(function(c){ var i = h[c]*7+c, w; b[i] = 1; w = won(i,1); b[i] = 0; return w; }); if(blk.length) picks = blk; } // when every move loses, still block a four
      return pick(picks); },
    record:function(g){ g.was = this.level(); if(g.result === 'win'){ state.fourWins = (state.fourWins || 0)+1; } },
    over:function(g){ var lv = this.level();
      return '<p class="rule">'+(g.result === 'win' ? 'You won' : g.result === 'loss' ? 'The Robot won' : 'A draw')+'</p>'+this.svg(g, false)+'<p>Your wins so far: '+(state.fourWins || 0)+'. '+(lv > g.was ? 'The Robot has moved up to level '+lv+'.' : 'The Robot is on level '+lv+'.')+'</p>'; }}
,

  oth:{name:'Othello',
    how:'Take turns with the Robot to place a disc. Each move must trap one or more of the Robot’s discs in a straight line between your new disc and another of your discs. The trapped discs flip to your colour. If you have no move, your turn is skipped. When neither side can move, the side with more discs wins. Your discs are red and you go first. The dots show where you can play. The Robot starts out easy and gets a little better after every second win, up to level 3.',
    level:function(){ return Math.min(3,1+Math.floor((state.othWins || 0)/2)); },
    best:function(){ return 'Wins: '+(state.othWins || 0)+'. Robot level: '+this.level(); },
    chips:function(){ return '<span class="chip">You: <span id="gs1">2</span></span><span class="chip">Robot: <span id="gs2">2</span></span><span class="chip sun">Robot level: '+this.level()+'</span>'; },
    W:[100,-20,10,5,5,10,-20,100, -20,-50,-2,-2,-2,-2,-50,-20, 10,-2,1,1,1,1,-2,10, 5,-2,1,0,0,1,-2,5, 5,-2,1,0,0,1,-2,5, 10,-2,1,1,1,1,-2,10, -20,-50,-2,-2,-2,-2,-50,-20, 100,-20,10,5,5,10,-20,100],
    flips:function(b, i, p){ if(b[i]) return []; var out = [], r0 = i >> 3, c0 = i & 7, o = 3-p;
      for(var dr = -1; dr <= 1; dr++) for(var dc = -1; dc <= 1; dc++){ if(!dr && !dc) continue; var r = r0+dr, c = c0+dc, run = [];
        while(r >= 0 && r < 8 && c >= 0 && c < 8 && b[r*8+c] === o){ run.push(r*8+c); r += dr; c += dc; }
        if(run.length && r >= 0 && r < 8 && c >= 0 && c < 8 && b[r*8+c] === p) out = out.concat(run); }
      return out; },
    moves:function(b, p){ var m = []; for(var i = 0; i < 64; i++) if(!b[i] && this.flips(b,i,p).length) m.push(i); return m; },
    put:function(b, i, p){ var f = this.flips(b,i,p); b[i] = p; f.forEach(function(k){ b[k] = p; }); return f; },
    count:function(b, p){ var n = 0; for(var i = 0; i < 64; i++) if(b[i] === p) n++; return n; },
    svg:function(g, live){ var s = '<rect x="1.5" y="1.5" width="305" height="305" rx="8" fill="#2f9273" stroke="'+INK+'" stroke-width="3"/>', i, k, can = live && g.turn === 1 ? this.moves(g.b,1) : [];
      for(k = 1; k < 8; k++) s += '<line x1="'+(2+38*k)+'" y1="3" x2="'+(2+38*k)+'" y2="305" stroke="'+INK+'" stroke-width="1" opacity=".35"/><line x1="3" y1="'+(2+38*k)+'" x2="305" y2="'+(2+38*k)+'" stroke="'+INK+'" stroke-width="1" opacity=".35"/>';
      for(i = 0; i < 64; i++){ var x = 21+38*(i & 7), y = 21+38*(i >> 3), v = g.b[i];
        if(v) s += '<circle cx="'+x+'" cy="'+y+'" r="15" fill="'+(v === 1 ? 'var(--coral)' : 'var(--sun)')+'" stroke="'+INK+'" stroke-width="2"/>'+(i === g.last ? '<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+INK+'"/>' : ''); }
      can.forEach(function(m){ var x = 21+38*(m & 7), y = 21+38*(m >> 3); s += '<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff" opacity=".7"/><rect data-act="g:cell:'+m+'" x="'+(x-19)+'" y="'+(y-19)+'" width="38" height="38" fill="transparent" style="cursor:pointer" role="button" aria-label="Row '+((m >> 3)+1)+', column '+((m & 7)+1)+'"/>'; });
      return '<svg class="toss" viewBox="0 0 308 308" style="border:0;background:none" role="img" aria-label="Othello board">'+s+'</svg>'; },
    field:function(){ return '<div id="gb"></div><p id="gmsg" class="small" aria-live="polite">Your turn. Tap a dot.</p>'; },
    controls:function(){ return ''; },
    draw:function(g, msg){ var e = $('#gb'); if(e) e.innerHTML = this.svg(g, true); if($('#gs1')){ $('#gs1').textContent = this.count(g.b,1); $('#gs2').textContent = this.count(g.b,2); } if(msg && $('#gmsg')) $('#gmsg').textContent = msg; },
    start:function(g){ g.b = []; for(var i = 0; i < 64; i++) g.b.push(0); g.b[27] = 2; g.b[36] = 2; g.b[28] = 1; g.b[35] = 1; g.turn = 1; g.last = -1; g.lv = this.level(); this.draw(g); },
    // after a move by p: who plays next, allowing for a skipped turn
    next:function(g, p){ var self = this, o = 3-p, msg;
      if(this.moves(g.b,o).length){ g.turn = o; msg = o === 1 ? 'Your turn. Tap a dot.' : 'The Robot is thinking.'; }
      else if(this.moves(g.b,p).length){ g.turn = p; msg = p === 1 ? 'The Robot has no move, so you go again.' : 'You have no move, so the Robot goes again.'; }
      else { var a = this.count(g.b,1), r = this.count(g.b,2); g.turn = 0; g.you = a; g.rob = r; g.result = a > r ? 'win' : a < r ? 'loss' : 'draw';
        this.draw(g, 'No moves are left. You have '+a+' and the Robot has '+r+'.'); g.timers.push(setTimeout(function(){ if(game === g) gameOver(); }, 1800)); return; }
      this.draw(g, msg);
      if(g.turn === 2) g.timers.push(setTimeout(function(){ if(game !== g || g.phase !== 'play') return; var m = self.ai(g.b, g.lv); g.last = m; self.put(g.b, m, 2); self.next(g, 2); }, 650)); },
    cmd:function(g, c, arg){ var i = +arg; if(c !== 'cell' || g.turn !== 1 || !(i >= 0 && i < 64) || !this.flips(g.b,i,1).length) return; g.last = i; this.put(g.b, i, 1); this.next(g, 1); },
    // an easy Robot: it plays some moves at random (half at level 1, a third at level 2, one in seven at level 3).
    // otherwise level 1 takes the most discs, and levels 2 and 3 prefer corners and edges
    ai:function(b, lv){ var self = this, ms = this.moves(b,2), W = this.W, best = -1e9, picks = [];
      if(Math.random() < (lv <= 1 ? 0.5 : lv === 2 ? 0.34 : 0.14)) return pick(ms);
      ms.forEach(function(m){ var f = self.flips(b,m,2).length, v = lv <= 1 ? f : W[m]+f;
        if(v > best){ best = v; picks = [m]; } else if(v === best) picks.push(m); });
      return pick(picks); },
    record:function(g){ g.was = this.level(); if(g.result === 'win') state.othWins = (state.othWins || 0)+1; },
    over:function(g){ var lv = this.level();
      return '<p class="rule">'+(g.result === 'win' ? 'You won '+g.you+' to '+g.rob : g.result === 'loss' ? 'The Robot won '+g.rob+' to '+g.you : 'A draw, '+g.you+' each')+'</p>'+this.svg(g, false)+'<p>Your wins so far: '+(state.othWins || 0)+'. '+(lv > g.was ? 'The Robot has moved up to level '+lv+'.' : 'The Robot is on level '+lv+'.')+'</p>'; }}
};
function stopGame(){ if(!game) return; cancelAnimationFrame(game.raf); clearInterval(game.iv); (game.timers || []).forEach(clearTimeout); }
function openGame(id){
  if(id === 'toss'){ openToss(); return; }
  if(!GAMES[id]) return;
  game = {id:id, phase:'start'}; renderGame(); $('#modal').classList.add('on');
}
function closeGame(){ stopGame(); game = null; $('#modal').classList.remove('on'); $('#modal').innerHTML = ''; render(); }
function gameStart(){
  if(!game || state.tickets < 1) return;
  stopGame(); state.tickets--; save(); hud();
  game = {id:game.id, phase:'play', score:0, timers:[]};
  renderGame(); GAMES[game.id].start(game);
}
function gameOver(){
  if(!game || game.phase !== 'play') return;
  stopGame(); game.phase = 'over';
  var G = GAMES[game.id], key = G.key || game.id;
  if(!state.best) state.best = {};
  if(G.record) G.record(game); else { game.newBest = game.score > (state.best[key] || 0); if(game.newBest) state.best[key] = game.score; }
  save(); renderGame();
}
function renderGame(){
  var G = GAMES[game.id], s = '<div class="card" role="dialog" aria-label="'+G.name+'"><div class="row between"><h2>'+G.name+'</h2><button class="btn plain" data-act="closeGame">Close</button></div>';
  if(game.phase === 'start'){
    s += '<p>'+G.how+'</p>'+(state.tickets > 0 ? '<div><button class="btn" data-act="gameStart">Start the game for 1 ticket</button></div>' : '<p class="fb bad">You have no ride tickets. Finish a quiz to earn 3.</p>')+'<p class="small muted">'+bestLine(game.id)+'</p>';
  } else if(game.phase === 'over'){
    s += (G.over ? G.over(game) : '<p class="rule">'+game.score+(game.score === 1 ? ' point' : ' points')+'</p><p>'+(game.newBest ? 'That is your best score so far.' : 'Your best score is '+bestOf(game.id)+'.')+'</p>')+
      '<div class="row">'+(state.tickets > 0 ? '<button class="btn" data-act="gameStart">Play again for 1 ticket</button>' : '')+'<button class="btn plain" data-act="closeGame">Back to the park</button></div>'+
      (state.tickets > 0 ? '' : '<p class="small muted">You have no ride tickets left. Each quiz you finish earns 3.</p>');
  } else {
    s += '<div class="row between">'+(G.chips ? G.chips(game) : '<span class="chip">'+G.hud[0]+': <span id="gt">'+G.hud[1]+'</span></span>'+(G.hud2 ? '<span class="chip">'+G.hud2[0]+': <span id="gt2">'+G.hud2[1]+'</span></span>' : '')+'<span class="chip sun">Score: <span id="gs">0</span></span>')+'</div>'+G.field()+G.controls();
  }
  $('#modal').innerHTML = s+'</div>';
}
function gameCmd(arg){
  if(!game || game.phase !== 'play') return;
  var i = arg.indexOf(':'), c = i < 0 ? arg : arg.slice(0,i), a = i < 0 ? '' : arg.slice(i+1), G = GAMES[game.id];
  if(G.cmd) G.cmd(game, c, a);
}
function gameKey(k){ if(!game || game.phase !== 'play') return false; var G = GAMES[game.id]; return G.key ? G.key(game,k) : false; }
// the games the student owns, for the Park screen
function gamesCard(){
  var own = ITEMS.filter(function(it){ return ITEM_GAME[it.id] && state.owned[it.id]; });
  if(!own.length) return '';
  return '<div class="card"><div class="row between"><h3>Games</h3><span class="chip">'+state.tickets+(state.tickets === 1 ? ' ticket' : ' tickets')+'</span></div><p class="small muted">Each game costs 1 ride ticket. Every quiz you finish earns 3 tickets.</p>'+
    own.map(function(it){ var id = ITEM_GAME[it.id]; return '<div class="row between gamerow"><span><b>'+GAMES[id].name+'</b><br><span class="small muted">'+bestLine(id)+'</span></span><button class="btn" data-act="play:'+id+'">Play</button></div>'; }).join('')+'</div>';
}
