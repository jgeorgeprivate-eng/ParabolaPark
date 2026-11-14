"use strict";
/* North end of the park: the rides unlocked by Zones 2, 4, 6, 7 and 8 */
ITEMS.push(
  {id:'duckpond', name:'Duck pond', cost:90, kind:'Stalls', desc:'A pond with ducks at the north end of the park.', box:'238 -94 92 92', lockZone:8},
  {id:'dodgems', name:'Dodgems', cost:150, kind:'Rides', desc:'Bumper cars under a striped roof.', box:'28 -198 100 100', lockZone:2},
  {id:'arcade', name:'Arcade', cost:140, kind:'Rides', desc:'A games arcade.', box:'232 -198 100 100', lockZone:4},
  {id:'maze', name:'Mirror maze', cost:130, kind:'Rides', desc:'A maze of walls and mirrors.', box:'26 -94 92 92', lockZone:6},
  {id:'tower', name:'Observation tower', cost:160, kind:'Rides', desc:'The tallest building in the park.', box:'136 -196 88 88', lockZone:7}
);
PLOTS.dodgems=[[26,-182,104,70]]; PLOTS.arcade=[[230,-182,104,70]]; PLOTS.maze=[[28,-92,92,84]]; PLOTS.duckpond=[[236,-92,96,84]]; PLOTS.tower=[[150,-194,60,88]];
SHORT.dodgems='Dodgems'; SHORT.arcade='Arcade'; SHORT.maze='Mirror maze'; SHORT.duckpond='Duck pond'; SHORT.tower='Tower';
(function(){
  var p0=ART.paths, t0=ART.trees;
  ART.paths=function(){ return p0()+'<g fill="none" stroke="#f1dfb6" stroke-width="15" stroke-linecap="round"><path d="M180 128 L180 -100"/><path d="M180 -48 L126 -48"/><path d="M180 -48 L236 -48"/><path d="M180 -138 L134 -142"/><path d="M180 -138 L228 -142"/></g>'; };
  ART.trees=function(){ return t0()+[[18,-186],[342,-186],[16,-100],[344,-100],[150,6],[212,6]].map(function(p){
    return '<rect x="'+(p[0]-2)+'" y="'+(p[1]+7)+'" width="4" height="9" fill="#8a5a3c"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="12" fill="#4fae72" stroke="'+INK+'" stroke-width="1.5"/><circle cx="'+(p[0]-4)+'" cy="'+(p[1]-4)+'" r="4" fill="#84d6a0"/>'; }).join(''); };
})();
ART.dodgems=function(){
  var s='<rect x="30" y="-168" width="96" height="52" rx="8" fill="#dfe6f5" stroke="'+INK+'" stroke-width="2"/>';
  for(var i=0;i<12;i++) s+='<rect x="'+(30+i*8)+'" y="-180" width="8" height="12" fill="'+(i%2?'#fff':'var(--coral)')+'"/>';
  s+='<rect x="30" y="-180" width="96" height="12" fill="none" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"/>';
  [[40,-156,'var(--coral)'],[76,-162,'var(--sun)'],[98,-140,'#35b8ae'],[56,-136,'#fff']].forEach(function(c){
    s+='<rect x="'+c[0]+'" y="'+c[1]+'" width="20" height="13" rx="5" fill="'+c[2]+'" stroke="'+INK+'" stroke-width="1.5"/><circle cx="'+(c[0]+10)+'" cy="'+(c[1]+6.5)+'" r="2.5" fill="'+INK+'"/>'; });
  return s;
};
ART.arcade=function(){
  return '<rect x="236" y="-166" width="92" height="52" fill="#fff" stroke="'+INK+'" stroke-width="2"/>'+
    '<rect x="248" y="-180" width="68" height="16" rx="3" fill="var(--sun)" stroke="'+INK+'" stroke-width="2"/><text x="282" y="-168.500" text-anchor="middle" style="font-weight:700;font-size:9px;fill:#1d2545">ARCADE</text>'+
    '<rect x="272" y="-140" width="20" height="26" fill="var(--coral)" stroke="'+INK+'" stroke-width="2"/>'+
    '<rect x="244" y="-154" width="18" height="16" fill="#7fd3cd" stroke="'+INK+'" stroke-width="1.5"/><rect x="302" y="-154" width="18" height="16" fill="#7fd3cd" stroke="'+INK+'" stroke-width="1.5"/>';
};
ART.maze=function(){
  return '<rect x="36" y="-88" width="76" height="76" rx="3" fill="#e3f3e0" stroke="'+INK+'" stroke-width="2.5"/>'+
    '<path d="M36 -70 H82 M98 -88 V-56 M52 -52 H112 M52 -52 V-30 M68 -12 V-36 H96 M96 -36 V-24" fill="none" stroke="'+INK+'" stroke-width="2.5" stroke-linecap="round"/>'+
    '<circle cx="104" cy="-20" r="4" fill="var(--coral)" stroke="'+INK+'" stroke-width="1"/>';
};
ART.duckpond=function(){
  var s='<ellipse cx="284" cy="-48" rx="44" ry="28" fill="#bfe6f2" stroke="'+INK+'" stroke-width="2"/>';
  [[266,-54],[292,-40],[302,-60]].forEach(function(d){
    s+='<ellipse cx="'+d[0]+'" cy="'+d[1]+'" rx="7.5" ry="5.5" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.2"/><circle cx="'+(d[0]+6)+'" cy="'+(d[1]-5)+'" r="3.6" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.2"/><path d="M'+(d[0]+9)+' '+(d[1]-5)+' l5 1 l-5 2 Z" fill="var(--coral)"/>'; });
  return s;
};
ART.tower=function(){
  return '<path d="M168 -108 L192 -108 L187 -124 L173 -124 Z" fill="'+INK+'"/><rect x="174" y="-176" width="12" height="54" fill="#fff" stroke="'+INK+'" stroke-width="2"/>'+
    '<rect x="160" y="-188" width="40" height="13" rx="5" fill="var(--coral)" stroke="'+INK+'" stroke-width="2"/><g fill="#fff"><rect x="166" y="-185" width="5" height="6"/><rect x="177.500" y="-185" width="5" height="6"/><rect x="189" y="-185" width="5" height="6"/></g>'+
    '<line x1="180" y1="-188" x2="180" y2="-198" stroke="'+INK+'" stroke-width="2"/>';
};
