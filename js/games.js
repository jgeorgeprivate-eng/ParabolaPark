"use strict";
/* ---------- ring toss ---------- */
var toss=null;
var PEGS=[{x:140,p:1},{x:205,p:2},{x:270,p:3}];
function tossSVG(){
  var s='<svg class="toss" id="tossfield" viewBox="0 0 320 200" role="img" aria-label="Ring toss stall with three pegs">';
  s+='<rect x="0" y="176" width="320" height="24" fill="var(--lawn)"/><line x1="0" y1="176" x2="320" y2="176" stroke="'+INK+'" stroke-width="2"/>';
  for(var i=0;i<4;i++) s+='<rect x="'+(8+i*9)+'" y="140" width="9" height="36" fill="'+(i%2?'#fff':'var(--coral)')+'"/>';
  s+='<rect x="8" y="140" width="36" height="36" fill="none" stroke="'+INK+'" stroke-width="2"/>';
  PEGS.forEach(function(g){
    s+='<line x1="'+g.x+'" y1="176" x2="'+g.x+'" y2="148" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>'+
       '<circle cx="'+g.x+'" cy="189" r="8" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/><text x="'+g.x+'" y="192.5" text-anchor="middle" font-size="10" font-weight="700" fill="#1d2545" font-family="Verdana,sans-serif">'+g.p+'</text>';
  });
  s+='<path id="arc" d="" fill="none" stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="4 4"/>';
  s+='<ellipse id="ring" cx="44" cy="134" rx="11" ry="4" fill="none" stroke="var(--coral)" stroke-width="3.5"/></svg>';
  return s;
}
function openToss(){
  toss={phase:'start', rings:5, score:0, raf:null, t0:0, p:0};
  renderToss(); $('#modal').classList.add('on');
}
function closeToss(){ if(toss){ cancelAnimationFrame(toss.raf); } toss=null; $('#modal').classList.remove('on'); $('#modal').innerHTML=''; render(); }
function renderToss(){
  var m=$('#modal'), s='<div class="card" role="dialog" aria-label="Ring toss"><div class="row between"><h2>Ring toss</h2><button class="btn plain" data-act="closeToss">Close</button></div>';
  if(toss.phase==='start'){
    s+='<p>You get 5 rings. A marker moves along the bar. Press Throw to stop it. The further right the marker is, the further the ring goes. The far peg is worth 3 points.</p>'+
       '<p class="small muted">The path of the ring is a parabola.</p>'+
       (state.tickets>0?'<div><button class="btn" data-act="tossStart">Start the game for 1 ticket</button></div>':'<p class="fb bad">You have no ride tickets. Finish a quiz to earn 3.</p>')+
       '<p class="small muted">Best score: '+state.tossBest+'</p>';
  } else if(toss.phase==='over'){
    s+=tossSVG()+'<p class="rule">'+toss.score+' points</p><p>'+(toss.newBest?'That is your best score so far.':'Your best score is '+state.tossBest+'.')+'</p>'+
       '<div class="row">'+(state.tickets>0?'<button class="btn" data-act="tossStart">Play again for 1 ticket</button>':'')+'<button class="btn plain" data-act="closeToss">Back to the park</button></div>';
  } else {
    s+='<div class="row between"><span class="chip">Rings left: <span id="tr">'+toss.rings+'</span></span><span class="chip sun">Score: <span id="ts">'+toss.score+'</span></span></div>'+tossSVG()+
       '<div class="bar" aria-hidden="true">'+PEGS.map(function(g){ return '<div class="tick" style="left:'+((g.x-100)/2)+'%">'+g.p+'</div>'; }).join('')+'<div class="mark" id="mark" style="left:0%"></div></div>'+
       '<p id="tmsg" class="small" aria-live="polite">Press Throw when the marker is over a green band.</p>'+
       '<div><button class="btn" id="throw" data-act="tossThrow" style="width:100%;padding:16px">Throw</button></div>';
  }
  var old=$('#modal .card'), y=old?old.scrollTop:0;
  m.innerHTML=s+'</div>';
  $('#modal .card').scrollTop=y;
}
function tossAim(){
  toss.phase='aim'; toss.t0=performance.now();
  var ring=$('#ring'), arc=$('#arc'); if(ring){ ring.setAttribute('cx',44); ring.setAttribute('cy',134); } if(arc) arc.setAttribute('d','');
  var b=$('#throw'); if(b) b.disabled=false;
  (function loop(ts){
    if(!toss||toss.phase!=='aim') return;
    toss.p=0.5-0.5*Math.cos((ts-toss.t0)/1500*2*Math.PI);
    var mk=$('#mark'); if(mk) mk.style.left=(toss.p*100)+'%';
    toss.raf=requestAnimationFrame(loop);
  })(performance.now());
}
function tossThrow(){
  if(!toss||toss.phase!=='aim') return;
  cancelAnimationFrame(toss.raf); toss.phase='fly'; $('#throw').disabled=true;
  var X=100+toss.p*200, hit=null;
  PEGS.forEach(function(g){ if(Math.abs(X-g.x)<=10) hit=g; });
  var endX=hit?hit.x:X, endY=hit?166:173, x0=44, y0=134, H=78, ring=$('#ring'), arc=$('#arc'), d='', t0=performance.now();
  (function fly(ts){
    if(!toss) return;
    var t=Math.min(1,(ts-t0)/650), x=x0+(endX-x0)*t, y=y0+(endY-y0)*t-4*H*t*(1-t);
    ring.setAttribute('cx',x.toFixed(1)); ring.setAttribute('cy',y.toFixed(1));
    d+=(d?'L':'M')+x.toFixed(1)+' '+y.toFixed(1); arc.setAttribute('d',d);
    if(t<1){ toss.raf=requestAnimationFrame(fly); return; }
    toss.rings--; if(hit) toss.score+=hit.p;
    $('#tr').textContent=toss.rings; $('#ts').textContent=toss.score;
    $('#tmsg').textContent = hit ? 'On the '+hit.p+'-point peg.' : 'Missed. The ring landed '+(X<140?'short of the first peg':X>280?'past the last peg':'between the pegs')+'.';
    setTimeout(function(){
      if(!toss) return;
      if(toss.rings>0) tossAim();
      else { toss.newBest=toss.score>state.tossBest; if(toss.newBest) state.tossBest=toss.score; save(); toss.phase='over'; renderToss(); }
    },900);
  })(performance.now());
}

