"use strict";
/* Park map art, shop items and plots */
var ITEMS = [
  {id:'paths',   name:'Paths',           cost:10,  kind:'Scenery', desc:'Paved paths from the gate to every part of the park.', box:'120 170 120 120'},
  {id:'trees',   name:'Trees',           cost:15,  kind:'Scenery', desc:'Eight trees around the edges.', box:'3 372 60 60'},
  {id:'garden',  name:'Flower garden',   cost:20,  kind:'Scenery', desc:'Two flower beds beside the gate.', box:'88 350 60 60'},
  {id:'lights',  name:'String lights',   cost:30,  kind:'Scenery', desc:'Lights over the main path and around the plaza.', box:'150 290 60 60'},
  {id:'fountain',name:'Fountain',        cost:40,  kind:'Scenery', desc:'A fountain in the middle of the plaza.', box:'150 198 60 60'},
  {id:'icecream',name:'Ice cream stall', cost:35,  kind:'Stalls',  desc:'A stall near the gate.', box:'258 292 64 64'},
  {id:'ringtoss',name:'Ring toss stall', cost:50,  kind:'Stalls',  desc:'A game you can play. Each game costs 1 ride ticket.', box:'38 292 64 64', activity:true},
  {id:'carousel',name:'Carousel',        cost:80,  kind:'Rides',   desc:'Three horses that go up and down.', box:'246 152 88 88', lockZone:1},
  {id:'wheel',   name:'Ferris wheel',    cost:120, kind:'Rides',   desc:'The tallest ride in the park.', box:'18 138 108 108', lockZone:5},
  {id:'coaster', name:'Roller coaster',  cost:200, kind:'Rides',   desc:'Three hills along the top of the park.', box:'30 8 110 110', lockZone:3}
];
var PLOTS = {
  coaster:[[28,26,304,92]], wheel:[[26,144,92,102]], carousel:[[250,158,80,78]], fountain:[[154,204,52,46]],
  ringtoss:[[40,296,60,56]], icecream:[[262,296,56,56]], garden:[[92,366,52,24],[216,366,52,24]]
};
var SHORT = {coaster:'Roller coaster', wheel:'Ferris wheel', carousel:'Carousel', fountain:'Fountain', ringtoss:'Ring toss', icecream:'Ice cream', garden:'Garden'};
/* ---------- park art ---------- */
var INK='var(--ink)';
function boothArt(x,y,c,inner){
  var s='<rect x="'+(x+5)+'" y="'+(y+16)+'" width="46" height="34" fill="#fff" stroke="'+INK+'" stroke-width="2"/>';
  s+='<rect x="'+(x+5)+'" y="'+(y+37)+'" width="46" height="13" fill="'+c+'" stroke="'+INK+'" stroke-width="2"/>';
  for(var i=0;i<7;i++) s+='<rect x="'+(x+i*8)+'" y="'+(y+2)+'" width="8" height="14" fill="'+(i%2?'#fff':c)+'"/>';
  s+='<rect x="'+x+'" y="'+(y+2)+'" width="56" height="14" fill="none" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"/>';
  return s+inner;
}
function trackPoints(){
  var hills=[[34,134,78],[134,226,44],[226,326,70]], pts=[];
  hills.forEach(function(h,i){
    for(var x=h[0]; x<=h[1]; x+=4){
      if(i>0 && x===h[0]) continue;
      var t=(x-h[0])/(h[1]-h[0]);
      pts.push([x, 110 - h[2]*Math.pow(Math.sin(Math.PI*t),2)]);
    }
  });
  return pts;
}
var ART = {
  gate:function(){
    return '<rect x="150" y="386" width="7" height="30" fill="'+INK+'"/><rect x="203" y="386" width="7" height="30" fill="'+INK+'"/>'+
      '<path d="M153 390 Q180 356 207 390" fill="none" stroke="'+INK+'" stroke-width="11" stroke-linecap="round"/>'+
      '<path d="M153 390 Q180 356 207 390" fill="none" stroke="var(--coral)" stroke-width="7" stroke-linecap="round"/>'+
      '<path d="M153 390 Q180 356 207 390" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="7 7"/>';
  },
  paths:function(){
    return '<g fill="none" stroke="#f1dfb6" stroke-width="15" stroke-linecap="round">'+
      '<path d="M180 404 L180 128"/><path d="M172 236 Q120 250 84 292"/><path d="M188 236 Q240 250 282 292"/>'+
      '<path d="M168 216 Q130 222 108 240"/><path d="M192 216 Q230 215 258 226"/></g><circle cx="180" cy="226" r="34" fill="#f1dfb6"/>';
  },
  trees:function(){
    return [[20,394],[46,408],[318,408],[342,392],[136,150],[226,150],[18,270],[342,264]].map(function(p){
      return '<rect x="'+(p[0]-2)+'" y="'+(p[1]+7)+'" width="4" height="9" fill="#8a5a3c"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="12" fill="#4fae72" stroke="'+INK+'" stroke-width="1.5"/><circle cx="'+(p[0]-4)+'" cy="'+(p[1]-4)+'" r="4" fill="#84d6a0"/>';
    }).join('');
  },
  garden:function(){
    var cols=['var(--coral)','var(--sun)','#fff'];
    return [118,242].map(function(cx){
      var s='<ellipse cx="'+cx+'" cy="378" rx="26" ry="11" fill="#7cc47f" stroke="'+INK+'" stroke-width="1.5"/>';
      [-17,-9,-1,7,15,-5,10].forEach(function(dx,i){ s+='<circle cx="'+(cx+dx)+'" cy="'+(378+(i%3-1)*4)+'" r="3" fill="'+cols[i%3]+'" stroke="'+INK+'" stroke-width=".8"/>'; });
      return s;
    }).join('');
  },
  lights:function(){
    var nodes=[[166,270],[194,292],[166,314],[194,336],[166,358],[194,380]], s='', n=0;
    s+='<polyline points="'+nodes.map(function(p){return p.join(',');}).join(' ')+'" fill="none" stroke="'+INK+'" stroke-width="1"/>';
    for(var i=0;i<nodes.length-1;i++){
      [0.25,0.5,0.75].forEach(function(t){
        var x=nodes[i][0]+(nodes[i+1][0]-nodes[i][0])*t, y=nodes[i][1]+(nodes[i+1][1]-nodes[i][1])*t+1.5;
        s+='<circle class="'+(n++%2?'tw1':'tw2')+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.8" fill="var(--sun)" stroke="'+INK+'" stroke-width=".7"/>';
      });
    }
    for(var k=0;k<12;k++){
      var a=k*Math.PI/6;
      s+='<circle class="'+(k%2?'tw1':'tw2')+'" cx="'+(180+39*Math.cos(a)).toFixed(1)+'" cy="'+(226+39*Math.sin(a)).toFixed(1)+'" r="2.8" fill="var(--sun)" stroke="'+INK+'" stroke-width=".7"/>';
    }
    return s;
  },
  fountain:function(){
    return '<ellipse cx="180" cy="232" rx="24" ry="11" fill="#bfe6f2" stroke="'+INK+'" stroke-width="2"/>'+
      '<ellipse cx="180" cy="230" rx="9" ry="4" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/>'+
      '<g class="jet" fill="none" stroke="#3aa9cc" stroke-width="2.5" stroke-linecap="round"><path d="M180 229 L180 206"/><path d="M180 212 Q170 204 166 226"/><path d="M180 212 Q190 204 194 226"/></g>';
  },
  icecream:function(){
    return boothArt(262,298,'#35b8ae','<path d="M285 325 L295 325 L290 336 Z" fill="#e9b872" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><circle cx="290" cy="322" r="5" fill="#ffd1dc" stroke="'+INK+'" stroke-width="1.2"/>');
  },
  ringtoss:function(sfx){
    var inner='';
    [58,70,82].forEach(function(x){ inner+='<line x1="'+x+'" y1="334" x2="'+x+'" y2="322" stroke="'+INK+'" stroke-width="2" stroke-linecap="round"/><ellipse cx="'+x+'" cy="331" rx="5" ry="2" fill="none" stroke="var(--sun)" stroke-width="2"/>'; });
    if(!sfx) inner+='<g class="pulse"><circle cx="97" cy="300" r="10" fill="var(--sun)" stroke="'+INK+'" stroke-width="2"/><path d="M94 295 L102 300 L94 305 Z" fill="'+INK+'"/></g>';
    return boothArt(42,298,'var(--coral)',inner);
  },
  carousel:function(){
    return '<rect x="254" y="224" width="72" height="9" rx="3" fill="var(--sun)" stroke="'+INK+'" stroke-width="2"/>'+
      '<g stroke="'+INK+'" stroke-width="2"><line x1="266" y1="192" x2="266" y2="224"/><line x1="290" y1="192" x2="290" y2="224"/><line x1="314" y1="192" x2="314" y2="224"/></g>'+
      '<g class="bobA"><ellipse cx="266" cy="211" rx="8" ry="5" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/></g>'+
      '<g class="bobB"><ellipse cx="290" cy="209" rx="8" ry="5" fill="#7fd3cd" stroke="'+INK+'" stroke-width="1.5"/></g>'+
      '<g class="bobA"><ellipse cx="314" cy="211" rx="8" ry="5" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/></g>'+
      '<path d="M250 190 L290 164 L330 190 Z" fill="var(--coral)" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"/>'+
      '<path d="M290 166 L277 189 L265 189 Z" fill="#fff"/><path d="M290 166 L303 189 L315 189 Z" fill="#fff"/>'+
      '<rect x="250" y="188" width="80" height="6" rx="2" fill="var(--sun)" stroke="'+INK+'" stroke-width="2"/>'+
      '<line x1="290" y1="164" x2="290" y2="152" stroke="'+INK+'" stroke-width="2"/><path d="M290 152 L301 156 L290 160 Z" fill="var(--teal)"/>';
  },
  wheel:function(){
    var cx=72, cy=188, r=40, cols=['var(--sun)','#7fd3cd','#fff','var(--sun)','#7fd3cd','#fff','var(--sun)','#7fd3cd'], s='';
    s+='<g stroke="'+INK+'" stroke-width="4" stroke-linecap="round"><line x1="72" y1="188" x2="52" y2="242"/><line x1="72" y1="188" x2="92" y2="242"/><line x1="44" y1="242" x2="100" y2="242"/></g>';
    s+='<g class="spin" style="transform-origin:72px 188px"><circle cx="72" cy="188" r="40" fill="none" stroke="var(--coral)" stroke-width="4"/><circle cx="72" cy="188" r="26" fill="none" stroke="'+INK+'" stroke-width="1.3"/>';
    for(var i=0;i<8;i++){ var a=i*Math.PI/4, x=cx+r*Math.cos(a), y=cy+r*Math.sin(a);
      s+='<line x1="72" y1="188" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="'+INK+'" stroke-width="1.3"/>'; }
    for(var j=0;j<8;j++){ var b=j*Math.PI/4;
      s+='<circle cx="'+(cx+r*Math.cos(b)).toFixed(1)+'" cy="'+(cy+r*Math.sin(b)).toFixed(1)+'" r="6.5" fill="'+cols[j]+'" stroke="'+INK+'" stroke-width="1.5"/>'; }
    s+='</g><circle cx="72" cy="188" r="5" fill="'+INK+'"/>';
    return s;
  },
  coaster:function(sfx){
    var pts=trackPoints(), id='trk'+(sfx||''), s='';
    var d=pts.map(function(p,i){ return (i?'L':'M')+p[0]+' '+p[1].toFixed(1); }).join('');
    pts.forEach(function(p,i){ if(i%3===0 && p[1]<104) s+='<line x1="'+p[0]+'" y1="'+p[1].toFixed(1)+'" x2="'+p[0]+'" y2="112" stroke="var(--ink-soft)" stroke-width="1.2"/>'; });
    s+='<line x1="28" y1="112" x2="332" y2="112" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/>';
    s+='<path d="'+d+'" fill="none" stroke="'+INK+'" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>';
    s+='<path id="'+id+'" d="'+d+'" fill="none" stroke="var(--coral)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
    var car='<rect x="-9" y="-13" width="18" height="10" rx="3" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/>';
    if(REDUCED) s+='<g transform="translate(84,32)">'+car+'</g>';
    else s+='<g>'+car+'<animateMotion dur="9s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints="0;1;0" keyTimes="0;0.5;1"><mpath href="#'+id+'"/></animateMotion></g>';
    return s;
  }
};
var MAP_ORDER=['paths','garden','fountain','benches','icecream','popcorn','ringtoss','duckpond','maze','dodgems','arcade','tower','carousel','wheel','coaster','trees','lights','bunting'];
function mapSVG(){
  var o=state.owned, s='<svg class="map" viewBox="0 -200 360 630" role="img" aria-label="Map of your park. '+builtCount()+' of '+ITEMS.length+' things built.">';
  s+='<rect x="4" y="-196" width="352" height="622" rx="22" fill="var(--lawn)" stroke="'+INK+'" stroke-width="3"/>';
  s+='<g fill="#b9dcb2"><ellipse cx="90" cy="120" rx="40" ry="10"/><ellipse cx="270" cy="270" rx="34" ry="9"/><ellipse cx="120" cy="330" rx="30" ry="8"/><ellipse cx="250" cy="130" rx="36" ry="9"/></g>';
  MAP_ORDER.forEach(function(id){
    if(o[id]){
      var body=ART[id]();
      if(ITEM_GAME[id]) body='<g class="plot" data-act="play:'+ITEM_GAME[id]+'" tabindex="0" role="button" aria-label="Play '+GAMES[ITEM_GAME[id]].name+'">'+body+'</g>';
      s+='<g'+(justBuilt===id?' class="pop"':'')+'>'+body+'</g>';
    } else if(PLOTS[id]){
      PLOTS[id].forEach(function(b,i){
        s+='<g class="plot" data-act="go:shop"'+(i===0?' tabindex="0" role="button" aria-label="'+SHORT[id]+', not built yet. Open the shop."':'')+'>'+
          '<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+b[3]+'" rx="9" fill="rgba(255,255,255,.4)" stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="5 4"/>'+
          '<text x="'+(b[0]+b[2]/2)+'" y="'+(b[1]+b[3]/2+3.5)+'" text-anchor="middle">'+SHORT[id]+'</text></g>';
      });
    }
  });
  // a pulsing play button on every built thing that has a game (the ring toss stall draws its own)
  for(var gid in PLAY_AT) if(o[gid] && ITEM_GAME[gid]){ var q=PLAY_AT[gid];
    s+='<g class="plot" data-act="play:'+ITEM_GAME[gid]+'" aria-hidden="true"><g class="pulse"><circle cx="'+q[0]+'" cy="'+q[1]+'" r="10" fill="var(--sun)" stroke="'+INK+'" stroke-width="2"/><path d="M'+(q[0]-3)+' '+(q[1]-5)+' L'+(q[0]+5)+' '+q[1]+' L'+(q[0]-3)+' '+(q[1]+5)+' Z" fill="'+INK+'"/></g></g>'; }
  s+=ART.gate()+'</svg>';
  return s;
}
var PLAY_AT={duckpond:[322,-82], maze:[110,-82], dodgems:[120,-172], arcade:[324,-172], tower:[204,-150], wheel:[110,154], coaster:[320,40]};
function thumb(it){
  return '<svg class="thumb" viewBox="'+it.box+'" aria-hidden="true"><rect x="-200" y="-200" width="900" height="900" fill="var(--lawn)"/>'+ART[it.id]('-t')+'</svg>';
}


/* ---------- items added with Zone 1 ---------- */
ITEMS.push(
  {id:'benches', name:'Benches', cost:15, kind:'Scenery', desc:'Three benches beside the main path.', box:'196 300 56 56'},
  {id:'bunting', name:'Bunting', cost:25, kind:'Scenery', desc:'Strings of flags on each side of the gate.', box:'104 340 60 60'},
  {id:'popcorn', name:'Popcorn cart', cost:30, kind:'Stalls', desc:'A cart beside the main path.', box:'108 290 54 54'}
);
PLOTS.popcorn=[[114,298,40,38]];
SHORT.popcorn='Popcorn';
ART.benches=function(){
  return [[222,314],[222,346],[134,350]].map(function(p){
    return '<rect x="'+(p[0]-9)+'" y="'+(p[1]-3)+'" width="18" height="6" rx="2" fill="#b9825a" stroke="'+INK+'" stroke-width="1.3"/>'+
      '<line x1="'+(p[0]-6)+'" y1="'+(p[1]+3)+'" x2="'+(p[0]-6)+'" y2="'+(p[1]+7)+'" stroke="'+INK+'" stroke-width="1.5"/><line x1="'+(p[0]+6)+'" y1="'+(p[1]+3)+'" x2="'+(p[0]+6)+'" y2="'+(p[1]+7)+'" stroke="'+INK+'" stroke-width="1.5"/>';
  }).join('');
};
ART.bunting=function(){
  var cols=['var(--coral)','var(--sun)','#35b8ae'], s='';
  [[[112,352],[152,384]],[[248,352],[208,384]]].forEach(function(seg){
    var a=seg[0], b=seg[1];
    s+='<line x1="'+a[0]+'" y1="'+(a[1]+14)+'" x2="'+a[0]+'" y2="'+(a[1]-2)+'" stroke="'+INK+'" stroke-width="2.5" stroke-linecap="round"/>';
    s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+INK+'" stroke-width="1"/>';
    for(var i=1;i<=4;i++){ var t=i/5, x=a[0]+(b[0]-a[0])*t, y=a[1]+(b[1]-a[1])*t;
      s+='<path d="M'+(x-4).toFixed(1)+' '+y.toFixed(1)+' L'+(x+4).toFixed(1)+' '+y.toFixed(1)+' L'+x.toFixed(1)+' '+(y+8).toFixed(1)+' Z" fill="'+cols[i%3]+'" stroke="'+INK+'" stroke-width=".8"/>'; }
  });
  return s;
};
ART.popcorn=function(){
  var x=116, y=300, s='';
  s+='<rect x="'+(x+4)+'" y="'+(y+12)+'" width="28" height="18" fill="#fff" stroke="'+INK+'" stroke-width="2"/>';
  for(var i=0;i<4;i++) s+='<rect x="'+(x+2+i*8)+'" y="'+(y+2)+'" width="8" height="10" fill="'+(i%2?'#fff':'var(--sun)')+'"/>';
  s+='<rect x="'+(x+2)+'" y="'+(y+2)+'" width="32" height="10" fill="none" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"/>';
  s+='<circle cx="'+(x+12)+'" cy="'+(y+19)+'" r="2.5" fill="var(--sun)"/><circle cx="'+(x+18)+'" cy="'+(y+21)+'" r="2.5" fill="var(--sun)"/><circle cx="'+(x+24)+'" cy="'+(y+19)+'" r="2.5" fill="var(--sun)"/>';
  s+='<circle cx="'+(x+10)+'" cy="'+(y+33)+'" r="4" fill="'+INK+'"/><circle cx="'+(x+26)+'" cy="'+(y+33)+'" r="4" fill="'+INK+'"/>';
  return s;
};
