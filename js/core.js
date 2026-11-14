"use strict";
/* Shared state, helpers, maths rendering and question helpers. Loaded first. */
var $ = function(s, el){ return (el||document).querySelector(s); };
var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var M = '−'; // minus sign
var KEY = 'parabola-park-v1';
var LESSONS = {}, HELP = {};
var NAMES = ['Sam','Priya','Mia','Tom','Lena','Ali','Zoe','Kai'];

var ZONES = [
  {name:'Front Gate', topic:'Number and algebra skills', ride:'Carousel', lessons:['Rounding in repeated calculations','Exponent laws with algebra','Taking out a common factor','Expanding two brackets','Factorising quadratics','Algebraic fractions','Using and rearranging formulas']},
  {name:'The Midway', topic:'Equations', ride:'Dodgems', lessons:['Linear equations','Equations with fractions','Inequalities on a number line','Simultaneous equations on a graph','Simultaneous equations with algebra','Quadratic equations','Exponential equations','Solving with a graph or by guess, check and refine']},
  {name:'Coaster Alley', topic:'Graphs', ride:'Roller coaster', lessons:['Parallel and perpendicular lines','Parabolas','Exponential graphs','Circles and hyperbolas']},
  {name:'Ticket Office', topic:'Money and modelling', ride:'Arcade', lessons:['Simple and compound interest','Growth and decay','Direct and inverse proportion','Algorithms']},
  {name:'Big Wheel', topic:'Measurement', ride:'Ferris wheel', lessons:['Surface area','Volume of composite solids','Angles of elevation and depression','Bearings','Logarithmic scales','Scale and measurement error']},
  {name:'Mirror Maze', topic:'Geometry and networks', ride:'Maze', lessons:['Geometric reasoning','Writing a proof','Networks']},
  {name:'Visitor Centre', topic:'Statistics', ride:'Observation tower', lessons:['Quartiles and box plots','Comparing sets of data','Scatterplots and lines of good fit','Two-way tables','Checking claims in the media','A data investigation']},
  {name:'Sideshow Alley', topic:'Probability', ride:'Duck pond', lessons:['Experiments with two or three steps','Conditional probability','Independent events']}
];

/* ---------- state ---------- */
function fresh(){ return {coins:0, tickets:0, owned:{}, lessons:{}, tests:{}, helpDone:{}, tossBest:0, best:{}}; }
var state = fresh();
var justBuilt = null;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
function loadSaved(){ try{ var s = JSON.parse(localStorage.getItem(KEY)); if(s && typeof s.coins === 'number' && s.owned) return s; }catch(e){} return null; }
function lessonState(id){ return state.lessons[id] || (state.lessons[id] = {done:false, quizzes:0, best:0}); }
function testPassed(z){ return !!(state.tests[z] && state.tests[z].passed); }
function builtCount(){ return ITEMS.filter(function(i){ return state.owned[i.id]; }).length; }

/* ---------- small helpers ---------- */
function rnd(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
function pick(arr){ return arr[rnd(0, arr.length-1)]; }
function shuffle(arr){ for(var i=arr.length-1;i>0;i--){ var j=rnd(0,i), t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }
function sample(arr,n){ return shuffle(arr.slice()).slice(0,n); }
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
function lcm(a,b){ return a*b/gcd(a,b); }
function toast(msg){ var t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(function(){ t.classList.remove('on'); }, 2200); }

/* ---------- number and algebra rendering ---------- */
function fmt(x){ // plain number, up to 4 decimal places, trailing zeros removed
  var s = (Math.round(Math.abs(x)*1e4)/1e4).toString();
  return (x < 0 && s !== '0' ? M : '') + s;
}
function num(n){ return fmt(n); }
function money(x){ return '$' + x.toFixed(2); }
function pt(x,y){ return '(' + num(x) + ', ' + num(y) + ')'; }
function S(b,e){ return (e === 1 || e === '1') ? b : b + '<sup>' + e + '</sup>'; }
function fr(t,b){ return '<span class="fr"><span>' + t + '</span><span>' + b + '</span></span>'; }
function rule(a,h,k){ // y = a(x − h)² + k
  if(a === 0) return 'y = ' + num(k);
  var coef = a === 1 ? '' : a === -1 ? M : num(a);
  var core = h === 0 ? 'x²' : '(x ' + (h > 0 ? M + ' ' + h : '+ ' + (-h)) + ')²';
  var tail = k === 0 ? '' : ' ' + (k > 0 ? '+ ' + k : M + ' ' + (-k));
  return 'y = ' + coef + core + tail;
}
// polynomial from coefficients, highest power first: [1,5,6] is x² + 5x + 6
function polyH(cs, x){
  x = x || 'x'; var n = cs.length-1, s = '';
  cs.forEach(function(c,i){
    if(c === 0) return;
    var d = n-i, v = d === 0 ? '' : S(x,d), a = Math.abs(c);
    var t = v ? ((a === 1 ? '' : fmt(a)) + v) : fmt(a);
    s += s ? (c < 0 ? ' ' + M + ' ' : ' + ') + t : (c < 0 ? M : '') + t;
  });
  return s || '0';
}
function polyF(cs){ return function(x){ return cs.reduce(function(a,c){ return a*x+c; }, 0); }; }
// k·x^e·(a1x + b1)(a2x + b2)…  with equal brackets written as a power
function prodH(k, e, fs, x){
  x = x || 'x';
  var v = e === 0 ? '' : S(x,e), lead = (k === 1 && (v || fs.length)) ? '' : (k === -1 && (v || fs.length)) ? M : num(k);
  var out = '', i = 0;
  while(i < fs.length){
    var j = i; while(j+1 < fs.length && fs[j+1][0] === fs[i][0] && fs[j+1][1] === fs[i][1]) j++;
    out += '(' + polyH(fs[i], x) + ')' + (j > i ? '<sup>' + (j-i+1) + '</sup>' : '');
    i = j+1;
  }
  return lead + v + out;
}
function prodF(k, e, fs){ return function(x){ return fs.reduce(function(a,f){ return a*(f[0]*x+f[1]); }, k*Math.pow(x,e)); }; }
// monomial with several letters, such as 3a³b. Negative exponents go under a fraction bar.
var VARVAL = {a:1.37, b:2.11, k:1.73, m:1.53, n:0.83, p:1.19, x:1.91, y:2.63};
function monoH(c, ex){
  var top = '', bot = '';
  Object.keys(ex).sort().forEach(function(k){ var e = ex[k]; if(e === 0) return; var s = S(k, Math.abs(e)); if(e > 0) top += s; else bot += s; });
  var t = ((c === 1 && top) ? '' : (c === -1 && top) ? M : num(c)) + top;
  return bot ? fr(t, bot) : t;
}
function monoV(c, ex){ var r = c; for(var k in ex) r *= Math.pow(VARVAL[k], ex[k]); return r; }

/* ---------- options that carry a value, so duplicates and wrong keys can be detected ---------- */
var XS = [2, 3, -1.5, 0.7];
function sig(f){ return XS.map(function(x){ return Math.round(f(x)*1e6)/1e6; }).join('|'); }
function E(h, f){ return {h:h, v:sig(f)}; }                       // any expression in x
function N(x, h){ return {h:h || fmt(x), v:Math.round(x*1e6)/1e6}; }  // a number
function P(cs, x){ return E(polyH(cs, x), polyF(cs)); }
function PR(k, e, fs, x){ return E(prodH(k, e, fs, x), prodF(k, e, fs)); }
function MO(c, ex){ return {h:monoH(c, ex), v:Math.round(monoV(c, ex)*1e6)/1e6}; }
// (polynomial) / (dc·x^de)
function RA(cs, dc, de){
  de = de || 0;
  var den = de ? ((dc === 1 ? '' : dc) + S('x', de)) : '' + dc;
  var h = (dc === 1 && !de) ? polyH(cs) : fr(polyH(cs), den);
  return E(h, function(x){ return polyF(cs)(x)/(dc*Math.pow(x,de)); });
}

/* ---------- questions ---------- */
// correct and wrongs are strings or {h, v}. Returns null when two options collide, so the caller draws again.
function makeQ(text, correct, wrongs, explain, extra){
  var all = [correct].concat(wrongs).map(function(o){ return (o && typeof o === 'object') ? {h:o.h, v:o.v} : {h:String(o)}; });
  var hs = {}, vs = {}, i;
  for(i = 0; i < all.length; i++){ if(hs[all[i].h]) return null; hs[all[i].h] = 1; }
  if(!(extra && extra.equivOK)) for(i = 0; i < all.length; i++){ var v = all[i].v; if(v !== undefined){ if(vs[v]) return null; vs[v] = 1; } }
  var c = all[0]; shuffle(all);
  var q = {text:text, opts:all.map(function(o){ return o.h; }), correct:all.indexOf(c), explain:explain, cv:c.v};
  if(extra) for(var k in extra) q[k] = extra[k];
  return q;
}
function ask(gen){
  for(var i = 0; i < 60; i++){ try{ var q = gen(); if(q) return q; }catch(e){} }
  return {text:'What is 2 + 2?', opts:['4','3','5','22'], correct:0, explain:'2 + 2 = 4.'};
}

/* ---------- lesson building blocks ---------- */
function slider(id,label,min,max,step,val){
  return '<div class="slider"><label for="'+id+'">'+label+'</label><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"><output id="'+id+'-o" for="'+id+'">'+num(val)+'</output></div>';
}
function hb(id){ return '<button class="helpbtn" data-act="help:'+id+'">More help: '+HELP[id].btn+'</button>'; }
function H2(t){ return '<h2>'+t+'</h2>'; }
function Pp(t){ return '<p>'+t+'</p>'; }
function note(t){ return '<p class="note">'+t+'</p>'; }
function val(id){ return parseFloat($('#'+id).value); }
function onInput(ids, fn){ ids.forEach(function(id){ $('#'+id).addEventListener('input', fn); }); }
