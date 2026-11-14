"use strict";
/* Calculator panel. It sits below the question area, so the question stays in view while it is open. */
var calc = {toks:[], ans:0, done:false, open:false, last:''};
var CALC_KEYS = ['C','⌫','(',')','÷', '7','8','9','×','x²', '4','5','6','−','xʸ', '1','2','3','+','√', '0','.','π','Ans','='];

var DEG = Math.PI/180;
var TRIG = {'sin':function(a){ return Math.sin(a*DEG); }, 'cos':function(a){ return Math.cos(a*DEG); }, 'tan':function(a){ return Math.tan(a*DEG); },
  'sin⁻¹':function(a){ return Math.asin(a)/DEG; }, 'cos⁻¹':function(a){ return Math.acos(a)/DEG; }, 'tan⁻¹':function(a){ return Math.atan(a)/DEG; }};
function calcEval(toks){
  var i = 0;
  function peek(){ return toks[i]; }
  function isNum(t){ return t !== undefined && /^[0-9.]+$/.test(t); }
  function startsPrimary(t){ return isNum(t) || t === '(' || t === 'π' || t === 'Ans' || t === '√' || TRIG[t]; }
  function primary(){
    var t = toks[i++];
    if(isNum(t)){ if((t.match(/\./g)||[]).length > 1 || t === '.') throw 0; return parseFloat(t); }
    if(t === 'π') return Math.PI;
    if(t === 'Ans') return calc.ans;
    if(t === '('){ var v = expr(); if(peek() === ')') i++; return v; }
    if(t === '√'){ var r = power(); if(r < 0) throw 0; return Math.sqrt(r); }
    if(TRIG[t]){ var a = power(), v2 = TRIG[t](a); if(!isFinite(v2) || isNaN(v2)) throw 0; return Math.abs(v2) < 1e-12 ? 0 : v2; }
    throw 0;
  }
  function postfix(){ var v = primary(); while(peek() === '²'){ i++; v = v*v; } return v; }
  function power(){ var b = postfix(); if(peek() === '^'){ i++; return Math.pow(b, unary()); } return b; }
  function unary(){ if(peek() === '−'){ i++; return -unary(); } return power(); }
  function term(){
    var v = unary();
    for(;;){
      var t = peek();
      if(t === '×'){ i++; v *= unary(); }
      else if(t === '÷'){ i++; var d = unary(); if(d === 0) throw 0; v /= d; }
      else if(startsPrimary(t)) v *= power();
      else return v;
    }
  }
  function expr(){
    var v = term();
    for(;;){ var t = peek(); if(t === '+'){ i++; v += term(); } else if(t === '−'){ i++; v -= term(); } else return v; }
  }
  var out = expr();
  if(i < toks.length) throw 0;
  if(!isFinite(out)) throw 0;
  return out;
}
function calcFmt(v){
  var s = parseFloat(v.toPrecision(10)).toString();
  if(s.indexOf('e') >= 0) s = v.toPrecision(6);
  return s.replace('-', M);
}
function calcShow(){
  var ex = $('#calc-ex'), rs = $('#calc-rs'); if(!ex) return;
  ex.textContent = calc.toks.join(' ').replace(/ ²/g,'²').replace(/\( /g,'(').replace(/ \)/g,')').replace(/√ /g,'√').replace(/(sin|cos|tan)(⁻¹)? /g,'$1$2 ') || '0';
  rs.textContent = calc.last;
}
function calcKey(k){
  var t = calc.toks, lastTok = t[t.length-1], isDigit = /^[0-9.]$/.test(k);
  if(k === 'C'){ calc.toks = []; calc.last = ''; calc.done = false; return calcShow(); }
  if(k === '⌫'){
    if(calc.done){ calc.toks = []; calc.last = ''; calc.done = false; return calcShow(); }
    if(lastTok !== undefined){ if(/^[0-9.]+$/.test(lastTok) && lastTok.length > 1) t[t.length-1] = lastTok.slice(0,-1); else t.pop(); }
    return calcShow();
  }
  if(k === '='){
    if(!t.length) return;
    try{ var v = calcEval(t); calc.ans = v; calc.last = '= '+calcFmt(v); calc.done = true; }
    catch(e){ calc.last = 'Check what you typed'; }
    return calcShow();
  }
  if(calc.done){ // start again after a result: an operator carries on from the answer
    calc.toks = t = (k === '+' || k === '−' || k === '×' || k === '÷' || k === 'x²' || k === 'xʸ') ? ['Ans'] : [];
    calc.done = false; calc.last = ''; lastTok = t[t.length-1];
  }
  if(k === 'inv'){ calc.inv = !calc.inv; calcTrigLabels(); return; }
  if(k === 'sin' || k === 'cos' || k === 'tan'){ t.push(calc.inv ? k+'⁻¹' : k); calc.inv = false; calcTrigLabels(); return calcShow(); }
  if(isDigit){ if(lastTok !== undefined && /^[0-9.]+$/.test(lastTok)) t[t.length-1] = lastTok+k; else t.push(k); }
  else if(k === 'x²') t.push('²');
  else if(k === 'xʸ') t.push('^');
  else t.push(k);
  calcShow();
}
function calcBuild(){
  var el = $('#calc'); if(!el || el.firstChild) return;
  el.innerHTML = '<div class="calc-top"><div class="calc-disp"><div id="calc-ex">0</div><div id="calc-rs"></div></div><button class="btn plain" data-act="calcClose">Close</button></div>'+
    '<div class="calc-keys" id="calc-trig" hidden>'+['sin','cos','tan','inv'].map(function(k){ return '<button type="button" class="ck" data-k="'+k+'">'+k+'</button>'; }).join('')+'<span class="small muted" style="align-self:center">degrees</span></div>'+
    '<div class="calc-keys">'+CALC_KEYS.map(function(k){ return '<button type="button" class="ck'+(/^[0-9.]$/.test(k) ? ' num' : k === '=' ? ' eq' : '')+'" data-k="'+k+'">'+k+'</button>'; }).join('')+'</div>';
  el.addEventListener('click', function(e){ var b = e.target.closest('[data-k]'); if(b) calcKey(b.getAttribute('data-k')); });
}
function calcTrigLabels(){ ['sin','cos','tan'].forEach(function(k){ var b = $('#calc-trig [data-k="'+k+'"]'); if(b) b.textContent = calc.inv ? k+'⁻¹' : k; }); }
function calcOpen(trig){
  calcBuild(); calc.open = true; $('#calc').hidden = false; $('#calc-trig').hidden = !trig;
  var q = $('#qtext'); if(q && q.scrollIntoView) q.scrollIntoView({block:'start'});
}
function calcClose(){ calc.open = false; var el = $('#calc'); if(el) el.hidden = true; }
