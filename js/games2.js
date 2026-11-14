"use strict";
/* ---------- five more games: duck pond, dodgems, coaster run, mirror maze, arcade lights ---------- */
var game = null;
var ITEM_GAME = {ringtoss:'toss', duckpond:'ducks', dodgems:'dodgems', coaster:'coaster', maze:'maze', arcade:'lights'};
ITEMS.forEach(function(it){ if(ITEM_GAME[it.id] && !it.activity){ it.activity = true; it.desc += ' It has a game you can play. Each game costs 1 ride ticket.'; } });
function bestOf(id){ return id === 'toss' ? state.tossBest : ((state.best || {})[id] || 0); }
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

  ducks:{name:'Duck pond', hud:['Time left','30'],
    how:'Ducks swim across the pond for 30 seconds. Tap a duck to hook it. A yellow duck is worth 1 point. A gold duck is faster and is worth 3 points.',
    field:function(){ return '<svg class="toss" id="gf" viewBox="0 0 320 220" style="touch-action:none;background:#bfe6f2" role="img" aria-label="Duck pond"><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M30 60 q8 -6 16 0 t16 0"/><path d="M210 110 q8 -6 16 0 t16 0"/><path d="M90 170 q8 -6 16 0 t16 0"/><path d="M250 30 q8 -6 16 0 t16 0"/></g><g id="gl"></g></svg>'; },
    controls:function(){ return ''; },
    duck:function(k){ var c = k.gold ? '#f5b800' : '#ffe27a';
      return '<g data-d="'+k.id+'" transform="translate('+k.x.toFixed(1)+','+k.y+') scale('+(k.v > 0 ? 1 : -1)+',1)" style="cursor:pointer"><circle r="26" fill="transparent"/><ellipse cx="-2" cy="5" rx="17" ry="11" fill="'+c+'" stroke="'+INK+'" stroke-width="2"/><circle cx="11" cy="-7" r="8" fill="'+c+'" stroke="'+INK+'" stroke-width="2"/><path d="M18 -8 l9 2 l-9 4 Z" fill="#f08a24" stroke="'+INK+'" stroke-width="1.2"/><circle cx="13" cy="-9" r="1.6" fill="'+INK+'"/></g>'; },
    start:function(g){ var self = this; g.d = []; g.T = 30; g.el = 0; g.spawn = 0; g.n = 0;
      $('#gf').addEventListener('pointerdown', function(e){
        var t = e.target.closest ? e.target.closest('[data-d]') : null; if(!t || game !== g || g.phase !== 'play') return; e.preventDefault();
        var id = +t.getAttribute('data-d');
        g.d = g.d.filter(function(k){ if(k.id === id){ g.score += k.gold ? 3 : 1; return false; } return true; });
        $('#gs').textContent = g.score; $('#gl').innerHTML = g.d.map(self.duck).join('');
      });
      gLoop(function(dt){
        g.el += dt; if(g.el >= g.T){ gameOver(); return; }
        $('#gt').textContent = Math.ceil(g.T-g.el);
        g.spawn -= dt;
        if(g.spawn <= 0){ var dir = Math.random() < 0.5 ? 1 : -1, gold = Math.random() < 0.15; g.d.push({id:g.n++, x:dir > 0 ? -24 : 344, y:34+rnd(0,150), v:dir*(45+rnd(0,55)+g.el*1.5)*(gold ? 1.6 : 1), gold:gold}); g.spawn = 0.45+Math.random()*0.5; }
        g.d.forEach(function(k){ k.x += k.v*dt; }); g.d = g.d.filter(function(k){ return k.x > -40 && k.x < 360; });
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

  maze:{name:'Mirror maze', hud:['Time left','60'],
    how:'Move the dot to the star with the arrow buttons. Each maze you finish scores 1 point, and then a new maze appears. You have 60 seconds.',
    field:function(){ return '<svg class="toss" id="gf" viewBox="0 0 240 240" style="background:#fff;max-width:290px;margin:0 auto" role="img" aria-label="Maze"><g id="gl"></g></svg>'; },
    controls:function(){ var b = function(c,t){ return '<button class="btn" data-act="g:'+c+'" aria-label="'+c+'">'+t+'</button>'; };
      return '<div class="dpad"><span></span>'+b('up','▲')+'<span></span>'+b('left','◀')+b('down','▼')+b('right','▶')+'</div>'; },
    make:function(g){ var n = 6, w = [], seen = [], st = [0], i;
      for(i = 0; i < n*n; i++) w.push({r:1,d:1}); seen[0] = 1;
      while(st.length){ var c = st[st.length-1], x = c%n, y = (c-x)/n, o = [];
        if(x > 0 && !seen[c-1]) o.push([c-1,'L']); if(x < n-1 && !seen[c+1]) o.push([c+1,'R']); if(y > 0 && !seen[c-n]) o.push([c-n,'U']); if(y < n-1 && !seen[c+n]) o.push([c+n,'D']);
        if(!o.length){ st.pop(); continue; }
        var m = pick(o); if(m[1] === 'L') w[c-1].r = 0; else if(m[1] === 'R') w[c].r = 0; else if(m[1] === 'U') w[c-n].d = 0; else w[c].d = 0;
        seen[m[0]] = 1; st.push(m[0]); }
      g.w = w; g.px = 0; g.py = 0; },
    draw:function(g){ var n = 6, S = 36, O = 12, s = '<rect x="'+O+'" y="'+O+'" width="'+(n*S)+'" height="'+(n*S)+'" fill="none" stroke="'+INK+'" stroke-width="3"/>';
      for(var i = 0; i < n*n; i++){ var x = i%n, y = (i-x)/n, c = g.w[i];
        if(c.r && x < n-1) s += '<line x1="'+(O+(x+1)*S)+'" y1="'+(O+y*S)+'" x2="'+(O+(x+1)*S)+'" y2="'+(O+(y+1)*S)+'" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/>';
        if(c.d && y < n-1) s += '<line x1="'+(O+x*S)+'" y1="'+(O+(y+1)*S)+'" x2="'+(O+(x+1)*S)+'" y2="'+(O+(y+1)*S)+'" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/>'; }
      var ex = O+(n-0.5)*S, ey = O+(n-0.5)*S, st = ''; for(var k = 0; k < 10; k++){ var a = -Math.PI/2+k*Math.PI/5, r = k%2 ? 5 : 12; st += (k ? 'L' : 'M')+(ex+r*Math.cos(a)).toFixed(1)+' '+(ey+r*Math.sin(a)).toFixed(1); }
      s += '<path d="'+st+'Z" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/><circle cx="'+(O+(g.px+0.5)*S)+'" cy="'+(O+(g.py+0.5)*S)+'" r="10" fill="var(--coral)" stroke="'+INK+'" stroke-width="2"/>';
      $('#gl').innerHTML = s; },
    start:function(g){ g.T = 60; this.make(g); this.draw(g);
      g.iv = setInterval(function(){ if(game !== g || g.phase !== 'play'){ clearInterval(g.iv); return; } g.T--; var e = $('#gt'); if(e) e.textContent = g.T; if(g.T <= 0) gameOver(); }, 1000); },
    cmd:function(g,c){ var n = 6, i = g.py*n+g.px;
      if(c === 'right' && g.px < n-1 && !g.w[i].r) g.px++;
      else if(c === 'left' && g.px > 0 && !g.w[i-1].r) g.px--;
      else if(c === 'down' && g.py < n-1 && !g.w[i].d) g.py++;
      else if(c === 'up' && g.py > 0 && !g.w[i-n].d) g.py--;
      if(g.px === n-1 && g.py === n-1){ g.score++; $('#gs').textContent = g.score; this.make(g); }
      this.draw(g); },
    key:function(g,k){ var m = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[k]; if(!m) return false; this.cmd(g,m); return true; }},

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
  if(!state.best) state.best = {};
  game.newBest = game.score > (state.best[game.id] || 0); if(game.newBest) state.best[game.id] = game.score;
  save(); renderGame();
}
function renderGame(){
  var G = GAMES[game.id], s = '<div class="card" role="dialog" aria-label="'+G.name+'"><div class="row between"><h2>'+G.name+'</h2><button class="btn plain" data-act="closeGame">Close</button></div>';
  if(game.phase === 'start'){
    s += '<p>'+G.how+'</p>'+(state.tickets > 0 ? '<div><button class="btn" data-act="gameStart">Start the game for 1 ticket</button></div>' : '<p class="fb bad">You have no ride tickets. Finish a quiz to earn 3.</p>')+'<p class="small muted">Best score: '+bestOf(game.id)+'</p>';
  } else if(game.phase === 'over'){
    s += '<p class="rule">'+game.score+(game.score === 1 ? ' point' : ' points')+'</p><p>'+(game.newBest ? 'That is your best score so far.' : 'Your best score is '+bestOf(game.id)+'.')+'</p>'+
      '<div class="row">'+(state.tickets > 0 ? '<button class="btn" data-act="gameStart">Play again for 1 ticket</button>' : '')+'<button class="btn plain" data-act="closeGame">Back to the park</button></div>'+
      (state.tickets > 0 ? '' : '<p class="small muted">You have no ride tickets left. Each quiz you finish earns 3.</p>');
  } else {
    s += '<div class="row between"><span class="chip">'+G.hud[0]+': <span id="gt">'+G.hud[1]+'</span></span><span class="chip sun">Score: <span id="gs">0</span></span></div>'+G.field()+G.controls();
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
    own.map(function(it){ var id = ITEM_GAME[it.id]; return '<div class="row between gamerow"><span><b>'+GAMES[id].name+'</b><br><span class="small muted">Best score '+bestOf(id)+'</span></span><button class="btn" data-act="play:'+id+'">Play</button></div>'; }).join('')+'</div>';
}
