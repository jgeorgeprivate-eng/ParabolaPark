"use strict";
/* Shared building blocks for Zones 2 to 8: lesson registration, graphs, number lines and generic widgets. */
var HELPMAP = {};
function LSN(id, title, o){
  LESSONS[id] = {id:id, zone:+id.charAt(0), title:title, gens:o.gens,
    html:function(){ return o.body(!o.w ? '' : Array.isArray(o.w) ? o.w.map(function(x){ return x.html; }) : o.w.html); },
    bind:function(){ if(o.w) [].concat(o.w).forEach(function(x){ x.bind(); }); }};
  if(o.help) HELPMAP[id] = o.help;
}
// sec('Heading', 'paragraph', '!note', '<raw html>') builds one lesson section
function sec(title){
  var s = H2(title);
  for(var i = 1; i < arguments.length; i++){ var a = arguments[i]; s += a.charAt(0) === '!' ? note(a.slice(1)) : a.charAt(0) === '<' ? a : Pp(a); }
  return s;
}
function PT(x,y){ return {h:pt(x,y), v:'pt'+x+','+y}; }
function Nx(v, name){ return N(v, (name || 'x')+' = '+fmt(v)); }
function pm(n){ return n < 0 ? ' '+M+' '+fmt(-n) : ' + '+fmt(n); }
function lineH(m,c){ return 'y = '+polyH([m,c]); }
function ri(a,b,ex){ var v; do{ v = rnd(a,b); }while(ex && ex.indexOf(v) >= 0); return v; } // random integer avoiding some values

/* ---------- coordinate graph ---------- */
function plotSVG(o){
  var W = o.w || 300, H = o.h || 300, x0 = o.x0, x1 = o.x1, y0 = o.y0, y1 = o.y1, sx = W/(x1-x0), sy = H/(y1-y0);
  var gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx*2, ly = o.ly || gy*2, s = '', i;
  var X = function(x){ return +((x-x0)*sx).toFixed(1); }, Y = function(y){ return +((y1-y)*sy).toFixed(1); };
  for(i = Math.ceil(x0/gx)*gx; i <= x1+1e-9; i += gx) s += '<line class="g" x1="'+X(i)+'" y1="0" x2="'+X(i)+'" y2="'+H+'"/>';
  for(i = Math.ceil(y0/gy)*gy; i <= y1+1e-9; i += gy) s += '<line class="g" x1="0" y1="'+Y(i)+'" x2="'+W+'" y2="'+Y(i)+'"/>';
  var ax = Math.min(Math.max(0,x0),x1), ay = Math.min(Math.max(0,y0),y1);
  s += '<line class="ax" x1="0" y1="'+Y(ay)+'" x2="'+W+'" y2="'+Y(ay)+'"/><line class="ax" x1="'+X(ax)+'" y1="0" x2="'+X(ax)+'" y2="'+H+'"/>';
  for(i = Math.ceil(x0/lx)*lx; i < x1-lx/4; i += lx) if(Math.abs(i-ax) > 1e-9 && i > x0) s += '<text x="'+X(i)+'" y="'+(Y(ay)+(ay === y0 ? -4 : 11))+'" text-anchor="middle">'+fmt(i)+'</text>';
  for(i = Math.ceil(y0/ly)*ly; i < y1-ly/4; i += ly) if(Math.abs(i-ay) > 1e-9 && i > y0) s += '<text x="'+(X(ax)+(ax === x0 ? 4 : -4))+'" y="'+(Y(i)+3)+'" text-anchor="'+(ax === x0 ? 'start' : 'end')+'">'+fmt(i)+'</text>';
  if(o.xl) s += '<text x="'+(W-4)+'" y="'+(Y(ay)-5)+'" text-anchor="end">'+o.xl+'</text>';
  if(o.yl) s += '<text x="'+(X(ax)+6)+'" y="10">'+o.yl+'</text>';
  (o.fns || []).forEach(function(fn){
    var d = '', pen = false, n = 240, pad = (y1-y0)*0.3;
    for(var j = 0; j <= n; j++){ var x = x0+(x1-x0)*j/n, y = fn.f(x);
      if(!isFinite(y) || y < y0-pad || y > y1+pad){ pen = false; continue; }
      d += (pen ? 'L' : 'M')+X(x)+' '+Y(y); pen = true; }
    s += '<path class="'+(fn.c || 'cv')+'" d="'+d+'"/>';
  });
  (o.segs || []).forEach(function(g){ s += '<line class="'+(g[4] || 'cv')+'" x1="'+X(g[0])+'" y1="'+Y(g[1])+'" x2="'+X(g[2])+'" y2="'+Y(g[3])+'"/>'; });
  (o.circ || []).forEach(function(c){ s += '<ellipse class="cv" cx="'+X(c[0])+'" cy="'+Y(c[1])+'" rx="'+(c[2]*sx).toFixed(1)+'" ry="'+(c[2]*sy).toFixed(1)+'"/>'; });
  (o.pts || []).forEach(function(p){ s += '<circle class="'+(p[3] || 'pt')+'" cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="'+(p[3] === 'tp' ? 5.5 : 4)+'"/>'+(p[2] ? '<text class="tpl" x="'+(X(p[0])+8)+'" y="'+(Y(p[1])-8)+'">'+p[2]+'</text>' : ''); });
  (o.txt || []).forEach(function(t){ s += '<text class="tpl" x="'+X(t[0])+'" y="'+Y(t[1])+'" text-anchor="'+(t[3] || 'start')+'">'+t[2]+'</text>'; });
  return '<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(o.label || 'Graph')+'">'+s+'</svg>';
}
function numLine(lo, hi, at, dir, closed){
  var X = function(v){ return +(20+(v-lo)*(260/(hi-lo))).toFixed(1); }, s = '<line class="ax" x1="8" y1="26" x2="292" y2="26"/>', end = dir > 0 ? 292 : 8;
  for(var i = lo; i <= hi; i++) s += '<line class="ax" x1="'+X(i)+'" y1="21" x2="'+X(i)+'" y2="31"/><text x="'+X(i)+'" y="47" text-anchor="middle">'+num(i)+'</text>';
  s += '<line class="cv" x1="'+X(at)+'" y1="26" x2="'+end+'" y2="26"/><path class="arr" d="M'+end+' 26 l'+(-dir*10)+' -7 v14 Z"/><circle cx="'+X(at)+'" cy="26" r="6.5" class="'+(closed ? 'dotc' : 'doto')+'"/>';
  return '<svg class="graph nl" viewBox="0 0 300 54" role="img" aria-label="Number line">'+s+'</svg>';
}

/* ---------- generic widgets ---------- */
// sliders that redraw a block of html. defs: [key, label, min, max, step, start]
function sliderW(id, title, defs, draw){
  return {
    html:'<div class="card"><h3>'+title+'</h3>'+defs.map(function(d){ return slider(id+d[0], d[1], d[2], d[3], d[4], d[5]); }).join('')+'<div id="'+id+'o" class="wout"></div></div>',
    bind:function(){
      function u(){ var v = {}; defs.forEach(function(d){ v[d[0]] = val(id+d[0]); $('#'+id+d[0]+'-o').textContent = d[6] ? d[6](v[d[0]]) : num(v[d[0]]); }); $('#'+id+'o').innerHTML = draw(v); }
      onInput(defs.map(function(d){ return id+d[0]; }), u); u();
    }};
}
// worked example revealed one step at a time. gen() returns {head, steps:[...]}
function stepper(id, title, gen){
  var cur, shown;
  return {
    html:'<div class="card"><h3>'+title+'</h3><p class="rule" id="'+id+'h" style="font-size:18px"></p><ol class="steps" id="'+id+'s"></ol><div class="row"><button class="btn plain" id="'+id+'n">Next step</button><button class="btn plain" id="'+id+'x">New example</button></div></div>',
    bind:function(){
      function draw(){ $('#'+id+'h').innerHTML = cur.head; $('#'+id+'s').innerHTML = cur.steps.slice(0,shown).map(function(t){ return '<li>'+t+'</li>'; }).join(''); $('#'+id+'n').disabled = shown >= cur.steps.length; }
      function fresh(){ cur = gen(); shown = 0; draw(); }
      $('#'+id+'n').addEventListener('click', function(){ if(shown < cur.steps.length) shown++; draw(); });
      $('#'+id+'x').addEventListener('click', fresh); fresh();
    }};
}
// two sides of an equation shown as bars for a chosen value of x
function balance(id, title, eqH, lhs, rhs, min, max, step, start){
  return sliderW(id, title, [['x','x',min,max,step,start]], function(v){
    var L = lhs(v.x), R = rhs(v.x), big = Math.max(Math.abs(L),Math.abs(R),1), eq = Math.abs(L-R) < 1e-9;
    return '<p class="rule" style="font-size:18px">'+eqH+'</p>'+
      '<div class="barrow"><span>Left side</span><i style="width:'+Math.max(2,Math.abs(L)/big*100)+'%"></i><b>'+fmt(L)+'</b></div>'+
      '<div class="barrow two"><span>Right side</span><i style="width:'+Math.max(2,Math.abs(R)/big*100)+'%"></i><b>'+fmt(R)+'</b></div>'+
      '<p class="goal'+(eq ? ' done' : '')+'">'+(eq ? 'The two sides are equal, so x = '+num(v.x)+' is a solution.' : 'With x = '+num(v.x)+' the left side is '+(L > R ? 'bigger' : 'smaller')+' than the right side.')+'</p>';
  });
}
