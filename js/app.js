"use strict";
/* Views, actions and start-up. Loaded last. */
var view = 'park', curLesson = null, quiz = null, help = null, scrollMem = {}, openZ = {0:true};
var TABS = ['park','learn','shop','plan'];

function lessonIds(){ return Object.keys(LESSONS).sort(); }
function zoneLessonIds(z){ return ZONES[z-1].lessons.map(function(_,i){ return z+'.'+(i+1); }); }
function zoneBuilt(z){ return zoneLessonIds(z).every(function(id){ return LESSONS[id]; }); }
function nextUp(){
  var ids = lessonIds();
  for(var i = 0; i < ids.length; i++){
    var s = lessonState(ids[i]);
    if(!s.done) return {kind:'lesson', id:ids[i]};
    if(!s.quizzes) return {kind:'quiz', id:ids[i]};
  }
  for(var z = 1; z <= ZONES.length; z++) if(zoneBuilt(z) && !testPassed(z)) return {kind:'test', zone:z};
  return null;
}
function locked(it){ return it.lockZone && !testPassed(it.lockZone); }

/* ---------- park ---------- */
function vPark(){
  var n = builtCount(), nx = nextUp(), next;
  if(!nx) next = '<p>Spend your coins in the shop, or repeat any quiz with new numbers to earn more.</p><div class="row"><button class="btn" data-act="go:shop">Open the shop</button><button class="btn plain" data-act="go:learn">Go to Learn</button></div>';
  else if(nx.kind === 'lesson') next = '<p>Lesson '+nx.id+', '+LESSONS[nx.id].title+'. Finishing it earns 20 coins.</p><div class="row"><button class="btn" data-act="lesson:'+nx.id+'">Open the lesson</button><button class="btn plain" data-act="go:learn">Choose another lesson</button></div>';
  else if(nx.kind === 'quiz') next = '<p>The quiz for lesson '+nx.id+', '+LESSONS[nx.id].title+'. It pays 10 coins for each correct answer and 3 ride tickets.</p><div class="row"><button class="btn" data-act="quiz:'+nx.id+'">Start the quiz</button><button class="btn plain" data-act="go:learn">Choose another lesson</button></div>';
  else next = '<p>The '+ZONES[nx.zone-1].name+' zone test. Passing it earns 100 coins and unlocks the '+ZONES[nx.zone-1].ride+'.</p><div><button class="btn" data-act="test:'+nx.zone+'">Start the zone test</button></div>';
  var play = gamesCard();
  return '<div class="row between"><h1>Your park</h1><span class="chip sun">'+n+' of '+ITEMS.length+' built</span></div>'+
    mapSVG()+'<div class="card"><h3>What to do next</h3>'+next+'</div>'+play+
    '<p class="small muted">Dashed boxes are empty plots. Tap one to see what you can build there.</p>';
}

/* ---------- shop ---------- */
function vShop(){
  var s = '<div class="row between"><h1>Shop</h1><span class="chip sun">'+state.coins+' coins to spend</span></div>';
  ['Scenery','Stalls','Rides'].forEach(function(kind){
    s += '<div class="shopgroup"><h2>'+kind+'</h2>';
    ITEMS.filter(function(i){ return i.kind === kind; }).forEach(function(it){
      var owned = state.owned[it.id], lk = locked(it), btn;
      if(owned) btn = '<span class="chip">Built</span>';
      else if(lk) btn = '<span class="chip lock">Locked</span>';
      else btn = '<button class="btn" data-act="buy:'+it.id+'"'+(state.coins < it.cost ? ' disabled' : '')+'>Build</button>';
      var extra = lk ? 'Opens when you pass the '+ZONES[it.lockZone-1].name+' zone test.' : (!owned && state.coins < it.cost ? 'You need '+(it.cost-state.coins)+' more coins.' : it.desc);
      s += '<div class="item">'+thumb(it)+'<div><div class="name">'+it.name+(it.activity ? ' <span class="chip sun">Game</span>' : '')+'</div><div class="small muted">'+extra+'</div><div class="price">'+it.cost+' coins</div></div>'+btn+'</div>';
    });
    s += '</div>';
  });
  return s;
}

/* ---------- learn ---------- */
function vLearn(){
  var s = '<h1>Learn</h1><p class="small muted">Each zone is one part of Year 10 maths. You can do the zones and lessons in any order. Passing a zone test unlocks that zone’s ride.</p>';
  ZONES.forEach(function(z,zi){
    var ids = zoneLessonIds(zi+1), done = ids.filter(function(id){ return LESSONS[id] && lessonState(id).done; }).length, any = ids.some(function(id){ return LESSONS[id]; });
    s += '<details class="zone" data-z="'+zi+'"'+(openZ[zi] ? ' open' : '')+'><summary><span><span class="zn">'+(zi+1)+'. '+z.name+'</span><br><span class="small muted">'+z.topic+' · '+(any ? done+' of '+z.lessons.length+' lessons finished' : z.lessons.length+' lessons')+'</span></span><span class="chip">'+z.ride+'</span></summary><ol>';
    z.lessons.forEach(function(l,li){
      var id = ids[li], L = LESSONS[id], st = L ? lessonState(id) : null, right;
      if(!L) right = '<span class="chip lock">Coming</span>';
      else right = '<span class="lrow"><button class="btn" data-act="lesson:'+id+'">Open</button><button class="btn plain" data-act="quiz:'+id+'">Quiz</button></span>';
      var status = !L ? '' : st.quizzes ? 'Best quiz score '+st.best+' of 5' : st.done ? 'Lesson read' : '';
      s += '<li><span><span class="num">'+id+'</span>'+l+(status ? '<br><span class="small muted">'+status+'</span>' : '')+'</span>'+right+'</li>';
    });
    if(zoneBuilt(zi+1)){
      var t = state.tests[zi+1];
      s += '<li><span><b>Zone test</b><br><span class="small muted">'+(2*z.lessons.length)+' questions. Unlocks the '+z.ride+'.</span></span><span class="lrow">'+(t ? '<span class="chip '+(t.passed ? 'sun' : '')+'">'+(t.passed ? 'Passed' : 'Best '+t.best)+'</span>' : '')+'<button class="btn" data-act="test:'+(zi+1)+'">Start</button></span></li>';
    }
    s += '</ol></details>';
  });
  var cards = Object.keys(HELP).filter(function(id){ return !HELP[id].extra; }).sort(function(a,b){ return HELP[a].title < HELP[b].title ? -1 : 1; });
  s += '<div class="card"><div class="row between"><h2>Info Booth</h2><span class="chip">Background</span></div>'+
    '<p>Short reminders of skills that the lessons build on. Open one whenever a lesson uses something you are not sure about.</p>'+
    '<details class="boothlist" data-z="booth"'+(openZ.booth ? ' open' : '')+'><summary>Show all '+cards.length+' cards</summary><div class="booth">'+cards.map(function(id){ return '<button class="helpbtn" data-act="help:'+id+'">'+HELP[id].title+'</button>'; }).join('')+'</div></details></div>';
  return s;
}

/* ---------- lesson ---------- */
function finCard(){
  var st = lessonState(curLesson);
  return '<div class="card" id="fin"><h3>'+(st.done ? 'Lesson finished' : 'Finish the lesson')+'</h3>'+
    (st.done ? '<p>You have collected the 20 coins for this lesson.</p><div><button class="btn" data-act="quiz:'+curLesson+'">'+(st.quizzes ? 'Repeat the quiz' : 'Start the quiz')+'</button></div>'
             : '<p>Collect 20 coins, then try the quiz.</p><div><button class="btn" data-act="finishLesson">Collect 20 coins</button></div>')+'</div>';
}
function vLesson(){
  var L = LESSONS[curLesson];
  if(!L) return vLearn();
  return '<div class="lesson"><div><button class="btn plain" data-act="go:learn">Back to Learn</button></div>'+
    '<div class="row between"><h1>'+L.title+'</h1><span class="chip">Lesson '+L.id+'</span></div>'+L.html()+finCard()+'</div>';
}

/* ---------- quiz and zone test ---------- */
// background card offered after a wrong answer, one entry per question type in each lesson
Object.assign(HELPMAP, {
  '1.1':['fracdec','round','round','fracdec','pctmult','round'],
  '1.2':['explaws','explaws','expmean','multterms','multterms','expmean','expmean','expmean'],
  '1.3':['hcf','hcf','multterms','multterms','neg','expand1','expand1'],
  '1.4':['expand1','neg','neg','expand1','neg','like','hcf'],
  '1.5':['hcf','hcf','neg','neg','sqrt','sqrt','hcf'],
  '1.6':['equiv','equiv','addfrac','addfrac','addfrac','mulfrac','mulfrac'],
  '1.7':['subst','solve','solve','solve','solve','sqrt','sqrt']
});
function drawQ(id, g){
  var q = ask(g), m = HELPMAP[id];
  if(!q.help && m) q.help = m[LESSONS[id].gens.indexOf(g)];
  q.lesson = id;
  return q;
}
function startQuiz(id){
  var L = LESSONS[id]; if(!L) return;
  var gens = L.gens.length > 5 ? sample(L.gens,5) : L.gens;
  quiz = {kind:'lesson', id:id, title:'Lesson '+id+' quiz', qs:gens.map(function(g){ return drawQ(id,g); }), i:0, score:0, picked:null, wrong:[]};
  go('quiz', true);
}
function startTest(z){
  if(!zoneBuilt(z)) return;
  var qs = [];
  zoneLessonIds(z).forEach(function(id){ sample(LESSONS[id].gens,2).forEach(function(g){ qs.push(drawQ(id,g)); }); });
  quiz = {kind:'test', zone:z, title:ZONES[z-1].name+' zone test', qs:qs, i:0, score:0, picked:null, wrong:[]};
  go('quiz', true);
}
function finishQuiz(){
  var n = quiz.qs.length;
  if(quiz.kind === 'lesson'){
    var st = lessonState(quiz.id), first = st.quizzes === 0, coins = quiz.score*(first ? 10 : 5);
    state.coins += coins; state.tickets += 3; st.quizzes++; st.best = Math.max(st.best, quiz.score);
    quiz.result = {coins:coins, first:first};
  } else {
    var t = state.tests[quiz.zone] || (state.tests[quiz.zone] = {passed:false, best:0}), mark = Math.ceil(n*0.7), pass = quiz.score >= mark, firstPass = pass && !t.passed;
    if(firstPass){ state.coins += 100; state.tickets += 3; t.passed = true; }
    t.best = Math.max(t.best, quiz.score);
    quiz.result = {pass:pass, firstPass:firstPass, mark:mark};
  }
  save();
}
function optsHTML(q, picked, act){
  var done = picked !== null, s = '<div class="opts">';
  q.opts.forEach(function(o,i){
    var cls = done ? (i === q.correct ? ' right' : (i === picked ? ' wrong' : '')) : '';
    s += '<button class="opt'+cls+'" data-act="'+act+':'+i+'"'+(done ? ' disabled' : '')+'>'+o+(done && i === q.correct ? ' <b>✓</b>' : '')+(done && i === picked && i !== q.correct ? ' <b>✗</b>' : '')+'</button>';
  });
  return s+'</div>';
}
function vQuiz(){
  if(!quiz) return vLearn();
  var n = quiz.qs.length, r = quiz.result, s;
  if(quiz.i >= n){
    s = '<h1>'+quiz.title+'</h1><div class="card"><p class="rule">'+quiz.score+' out of '+n+'</p>';
    if(quiz.kind === 'lesson'){
      s += '<p>You earned '+r.coins+' coins and 3 ride tickets.'+(r.first ? '' : ' A repeated quiz pays 5 coins for each correct answer.')+'</p>'+
        '<div class="row"><button class="btn" data-act="quiz:'+quiz.id+'">Try again with new numbers</button><button class="btn plain" data-act="go:learn">Back to Learn</button><button class="btn plain" data-act="go:shop">Open the shop</button></div></div>';
    } else {
      s += (r.pass ? '<p><b>You passed.</b> '+(r.firstPass ? 'You earned 100 coins and 3 ride tickets, and the '+ZONES[quiz.zone-1].ride+' is now unlocked in the shop.' : 'You had already passed this test, so there is no new reward.')+'</p>'
                   : '<p>The pass mark is '+r.mark+' out of '+n+'. The questions you missed are listed below with links to the lessons. You can take the test again at any time.</p>')+
        '<div class="row"><button class="btn" data-act="'+(r.pass ? 'go:shop' : 'test:'+quiz.zone)+'">'+(r.pass ? 'Open the shop' : 'Take the test again')+'</button><button class="btn plain" data-act="go:learn">Back to Learn</button></div></div>';
    }
    if(quiz.wrong.length){
      s += '<h2>Questions to look at again</h2>';
      quiz.wrong.forEach(function(w){
        var q = w.q, lid = q.lesson || quiz.id;
        s += '<div class="card flat review"><div class="qtext">'+q.text+'</div><p>Your answer: '+q.opts[w.picked]+'</p><p>Correct answer: '+q.opts[q.correct]+'</p><p class="small">'+q.explain+'</p>'+
          '<div class="row"><button class="btn plain" data-act="lesson:'+lid+'">Open lesson '+lid+'</button>'+(q.help ? hb(q.help) : '')+'</div></div>';
      });
    }
    return s;
  }
  var q = quiz.qs[quiz.i], done = quiz.picked !== null;
  s = '<div class="row between"><h1>'+quiz.title+'</h1><span class="chip">Question '+(quiz.i+1)+' of '+n+'</span></div>'+
    '<div class="progress" aria-hidden="true"><i style="width:'+((quiz.i+(done ? 1 : 0))/n*100)+'%"></i></div>'+
    '<div class="qtext" id="qtext">'+q.text+'</div>'+
    '<div><button class="btn plain" data-act="calcToggle">Calculator</button></div>'+
    optsHTML(q, quiz.picked, 'answer');
  if(done){
    var ok = quiz.picked === q.correct;
    s += '<div class="fb '+(ok ? 'good' : 'bad')+'"><b>'+(ok ? 'Correct.' : 'Not correct.')+'</b> '+q.explain+'</div>'+(!ok && q.help ? hb(q.help) : '')+
      '<div><button class="btn" data-act="nextQ">'+(quiz.i === n-1 ? 'See your result' : 'Next question')+'</button></div>';
  }
  return s;
}

/* ---------- background cards ---------- */
function openHelp(id){ if(!HELP[id]) return; $('#modal').innerHTML = ''; help = {id:id, q:ask(HELP[id].gen), picked:null}; renderHelp(); $('#modal').classList.add('on'); }
function closeHelp(){ help = null; $('#modal').classList.remove('on'); $('#modal').innerHTML = ''; hud(); }
function renderHelp(){
  var h = HELP[help.id], q = help.q, done = help.picked !== null;
  var s = '<div class="card" role="dialog" aria-label="'+h.title+'"><div class="row between"><span class="chip">'+(h.extra ? 'Extra' : 'Background')+'</span><button class="btn plain" data-act="closeHelp">Close</button></div>'+
    '<h2>'+h.title+'</h2>'+h.html+'<h3>Try one</h3><div class="qtext">'+q.text+'</div>'+
    (q.graph ? '<svg class="graph" id="hg" viewBox="0 0 300 300" role="img" aria-label="Graph with one point marked"></svg>' : '')+optsHTML(q, help.picked, 'helpPick');
  if(done){
    var ok = help.picked === q.correct;
    s += '<div class="fb '+(ok ? 'good' : 'bad')+'"><b>'+(ok ? 'Correct.' : 'Not correct.')+'</b> '+q.explain+'</div>'+
      '<div class="row"><button class="btn" data-act="helpNew">Try another</button><button class="btn plain" data-act="closeHelp">Close</button></div>';
  }
  var old = $('#modal .card'), y = old ? old.scrollTop : 0;
  $('#modal').innerHTML = s+'</div>';
  $('#modal .card').scrollTop = y;
  if(q.graph) drawGraph($('#hg'), {a:1, h:0, k:0, ymin:-4, nocurve:true, pts:[q.graph]});
}

/* ---------- plan (for Jenny) ---------- */
var secretN = 0, checkMode = false;
function vPlan(){
  var ids = lessonIds(), types = ids.reduce(function(n,id){ return n+LESSONS[id].gens.length; }, 0);
  var cards = Object.keys(HELP).filter(function(id){ return !HELP[id].extra; }).length;
  var done = ids.filter(function(id){ return lessonState(id).done; }).length, quizzed = ids.filter(function(id){ return lessonState(id).quizzes > 0; }).length;
  var passed = ZONES.filter(function(z,i){ return testPassed(i+1); }).length;
  var s = '<div class="plan"><h1>About</h1>'+
  (checkMode ? '<section><h2>Test controls</h2><p class="small muted">These are for an adult checking the app. Tap the park name at the top five times to hide them.</p><div class="row"><button class="btn plain" data-act="demoCoins">Add 100 coins</button><button class="btn plain" data-act="demoTickets">Add 3 tickets</button><button class="btn plain" data-act="demoPass">Pass every zone test</button><button class="btn plain" data-act="demoFill">Build everything</button><button class="btn plain" data-act="demoEmpty">Empty the park</button><button class="btn plain" data-act="demoReset">Reset all progress</button></div></section>' : '')+
  '<section><h2>Your progress</h2><ul><li>Lessons finished: '+done+' of '+ids.length+'</li><li>Lesson quizzes done at least once: '+quizzed+' of '+ids.length+'</li><li>Zone tests passed: '+passed+' of '+ZONES.length+'</li><li>Things built in the park: '+builtCount()+' of '+ITEMS.length+'</li></ul></section>'+
  '<section><h2>How the park works</h2><ul>'+
  '<li>Finishing a lesson earns 20 coins.</li>'+
  '<li>Each correct quiz answer earns 10 coins the first time you do that quiz and 5 coins on a repeat. Every quiz you finish earns 3 ride tickets.</li>'+
  '<li>A zone test has two questions from each lesson in the zone. The pass mark is 70%. The first pass earns 100 coins and 3 ride tickets, and it unlocks that zone’s ride in the shop.</li>'+
  '<li>The first correct practice answer on each More help card earns 5 coins.</li>'+
  '<li>Coins buy things for the park. '+['None','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'][Object.keys(ITEM_GAME).length]+' of them have a game, and each game costs 1 ride ticket.</li>'+
  '<li>Every question has new numbers each time, so a quiz can be repeated for practice.</li>'+
  '<li>Progress is saved on this device, in this browser. Nothing is sent anywhere.</li></ul></section>'+
  '<section><h2>What the app covers</h2><p>Year 10 maths in '+ZONES.length+' zones, with '+ids.length+' lessons, '+types+' types of question and '+cards+' More help cards on earlier work.</p><ul>'+
  ZONES.map(function(z,i){ return '<li><b>'+(i+1)+'. '+z.name+':</b> '+z.topic+', '+z.lessons.length+' lessons. Ride: '+z.ride+'.</li>'; }).join('')+'</ul></section></div>';
  return s;
}

/* ---------- routing ---------- */
var VIEWS = {park:vPark, learn:vLearn, lesson:vLesson, quiz:vQuiz, shop:vShop, plan:vPlan};
function hud(){ $('#coins').textContent = state.coins; $('#tickets').textContent = state.tickets; }
function memKey(){ return view === 'lesson' ? 'lesson:'+curLesson : view; }
function render(){
  hud();
  TABS.forEach(function(v){
    var on = v === view || (v === 'learn' && (view === 'lesson' || view === 'quiz'));
    var b = $('#nav-'+v); if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  var main = $('#main'), y = main.scrollTop;
  main.innerHTML = VIEWS[view]();
  if(view === 'lesson' && LESSONS[curLesson] && LESSONS[curLesson].bind) LESSONS[curLesson].bind();
  main.scrollTop = y; // a rebuilt screen stays where it was
  justBuilt = null;
}
function go(v, top){
  if(typeof carTimer !== 'undefined') cancelAnimationFrame(carTimer);
  if(!VIEWS[v]) v = 'park';
  var main = $('#main');
  scrollMem[memKey()] = main.scrollTop; // remember where this screen was left
  if(v !== 'quiz') calcClose();
  view = v;
  try{ var h = TABS.indexOf(v) >= 0 ? v : 'learn'; if(location.hash.slice(1) !== h) history.replaceState(null,'','#'+h); }catch(e){}
  render();
  main.scrollTop = top ? 0 : (scrollMem[memKey()] || 0);
}
function reveal(sel){ var el = $(sel); if(el && el.scrollIntoView) el.scrollIntoView({block:'nearest'}); }

function act(a){
  var i = a.indexOf(':'), cmd = i < 0 ? a : a.slice(0,i), arg = i < 0 ? '' : a.slice(i+1);
  if(cmd === 'go') go(arg);
  else if(cmd === 'lesson'){ if(LESSONS[arg]){ if(help) closeHelp(); scrollMem[memKey()] = $('#main').scrollTop; curLesson = arg; view = 'lesson'; calcClose(); render(); $('#main').scrollTop = scrollMem[memKey()] || 0; } }
  else if(cmd === 'quiz') startQuiz(arg);
  else if(cmd === 'test') startTest(+arg);
  else if(cmd === 'buy'){
    var it = ITEMS.filter(function(x){ return x.id === arg; })[0];
    if(!it || state.owned[it.id] || state.coins < it.cost || locked(it)) return;
    state.coins -= it.cost; state.owned[it.id] = 1; save(); justBuilt = it.id; toast(it.name+' built'); go('park', true);
  }
  else if(cmd === 'finishLesson'){
    var st = lessonState(curLesson);
    if(!st.done){ st.done = true; state.coins += 20; save(); toast('20 coins collected'); }
    var fin = $('#fin'); if(fin) fin.outerHTML = finCard(); hud();
  }
  else if(cmd === 'answer'){
    if(quiz && quiz.picked === null){
      var q = quiz.qs[quiz.i]; quiz.picked = +arg;
      if(quiz.picked === q.correct) quiz.score++; else quiz.wrong.push({q:q, picked:quiz.picked});
      render(); reveal('#main [data-act=nextQ]');
    }
  }
  else if(cmd === 'nextQ'){
    quiz.i++; quiz.picked = null; calcClose();
    if(quiz.i >= quiz.qs.length) finishQuiz();
    render(); $('#main').scrollTop = 0;
  }
  else if(cmd === 'calcToggle'){ if(calc.open) calcClose(); else calcOpen(quiz && quiz.qs[quiz.i] && quiz.qs[quiz.i].calc === 'trig'); }
  else if(cmd === 'calcClose') calcClose();
  else if(cmd === 'play'){ var gid = arg || 'toss'; if(Object.keys(ITEM_GAME).some(function(k){ return ITEM_GAME[k] === gid && state.owned[k]; })) openGame(gid); }
  else if(cmd === 'closeGame') closeGame();
  else if(cmd === 'gameStart') gameStart();
  else if(cmd === 'g') gameCmd(arg);
  else if(cmd === 'secret'){ secretN++; if(secretN >= 5){ secretN = 0; checkMode = !checkMode; toast(checkMode ? 'Test controls are on. They are on the About tab.' : 'Test controls are off.'); go('plan', true); } }
  else if(cmd === 'closeToss') closeToss();
  else if(cmd === 'tossStart'){ if(state.tickets > 0){ state.tickets--; save(); hud(); toss = {phase:'aim', rings:5, score:0, raf:null, t0:0, p:0}; renderToss(); tossAim(); } }
  else if(cmd === 'tossThrow') tossThrow();
  else if(cmd === 'help') openHelp(arg);
  else if(cmd === 'closeHelp') closeHelp();
  else if(cmd === 'helpNew'){ if(help){ help.q = ask(HELP[help.id].gen); help.picked = null; renderHelp(); } }
  else if(cmd === 'helpPick'){
    if(help && help.picked === null){
      help.picked = +arg;
      if(help.picked === help.q.correct && !state.helpDone[help.id]){ state.helpDone[help.id] = 1; state.coins += 5; save(); hud(); toast('5 coins collected'); }
      renderHelp(); reveal('#modal [data-act=helpNew]');
    }
  }
  else if(cmd === 'demoCoins'){ state.coins += 100; save(); toast('100 coins added'); render(); }
  else if(cmd === 'demoTickets'){ state.tickets += 3; save(); toast('3 tickets added'); render(); }
  else if(cmd === 'demoPass'){ ZONES.forEach(function(z,i){ state.tests[i+1] = {passed:true, best:(state.tests[i+1] || {}).best || 0}; }); save(); toast('Every zone test marked as passed'); render(); }
  else if(cmd === 'demoFill'){ ITEMS.forEach(function(x){ state.owned[x.id] = 1; }); save(); go('park', true); }
  else if(cmd === 'demoEmpty'){ state.owned = {}; save(); go('park', true); }
  else if(cmd === 'demoReset'){ state = fresh(); quiz = null; save(); toast('Progress reset'); go('park', true); }
}
document.addEventListener('click', function(e){
  var el = e.target.closest('[data-act]'); if(!el || el.disabled) return;
  act(el.getAttribute('data-act'));
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && toss){ closeToss(); return; }
  if(e.key === 'Escape' && game){ closeGame(); return; }
  if(game && gameKey(e.key)){ e.preventDefault(); return; }
  if(e.key === 'Escape' && help){ closeHelp(); return; }
  if((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g[data-act]')){ e.preventDefault(); act(e.target.getAttribute('data-act')); }
});
document.addEventListener('toggle', function(e){ var d = e.target; if(d.matches && d.matches('details[data-z]')) openZ[d.getAttribute('data-z')] = d.open; }, true);
window.addEventListener('hashchange', function(){ var v = location.hash.slice(1); if(TABS.indexOf(v) >= 0 && v !== view && !(v === 'learn' && (view === 'lesson' || view === 'quiz'))) go(v); });

function start(data){
  var saved = (data && typeof data.coins === 'number' && data.owned) ? data : loadSaved();
  if(saved){ var f = fresh(); for(var k in f) if(saved[k] === undefined) saved[k] = f[k]; state = saved; }
  var v = location.hash.slice(1);
  view = TABS.indexOf(v) >= 0 ? v : 'park';
  render();
}
var hot = window.claude && window.claude.hot;
if(hot && hot.snapshot) hot.snapshot(function(){ return state; });
if(hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
