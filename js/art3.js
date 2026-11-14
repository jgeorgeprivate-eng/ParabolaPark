"use strict";
/* Items added with the full build, and the prices for a park that takes all eight zones to finish */
ITEMS.push(
  {id:'lamps', name:'Lamp posts', cost:30, kind:'Scenery', desc:'Six lamps along the paths at the north end.', box:'140 -134 80 80'},
  {id:'picnic', name:'Picnic tables', cost:35, kind:'Scenery', desc:'Two tables on the lawn below the Ferris wheel.', box:'36 244 66 48'},
  {id:'balloon', name:'Hot air balloon', cost:120, kind:'Scenery', desc:'A balloon tied down on the lawn below the carousel.', box:'272 240 56 56'},
  {id:'fireworks', name:'Fireworks', cost:150, kind:'Scenery', desc:'Fireworks in the sky above the roller coaster.', box:'140 6 80 80'}
);
(function(){ var P = {carousel:150, wheel:260, coaster:350, dodgems:280, arcade:260, maze:240, tower:300, duckpond:160}; ITEMS.forEach(function(it){ if(P[it.id]) it.cost = P[it.id]; }); })();
PLOTS.lamps=[[146,-34,68,22]]; PLOTS.picnic=[[36,254,66,28]]; PLOTS.balloon=[[276,246,48,44]]; PLOTS.fireworks=[[150,24,60,24]];
SHORT.lamps='Lamp posts'; SHORT.picnic='Picnic tables'; SHORT.balloon='Balloon'; SHORT.fireworks='Fireworks';
MAP_ORDER.splice(MAP_ORDER.indexOf('benches'),0,'picnic');
MAP_ORDER.push('lamps','balloon','fireworks');
ART.lamps=function(){
  return [[150,-64],[210,-64],[166,-18],[194,-18],[158,-122],[202,-122]].map(function(p,i){
    return '<line x1="'+p[0]+'" y1="'+(p[1]+12)+'" x2="'+p[0]+'" y2="'+(p[1]-6)+'" stroke="'+INK+'" stroke-width="2.2" stroke-linecap="round"/><circle class="'+(i%2 ? 'tw1' : 'tw2')+'" cx="'+p[0]+'" cy="'+(p[1]-9)+'" r="4.5" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.5"/>'; }).join('');
};
ART.picnic=function(){
  return [[52,268],[86,268]].map(function(p){
    return '<rect x="'+(p[0]-12)+'" y="'+(p[1]-9)+'" width="24" height="4" rx="1.5" fill="#b9825a" stroke="'+INK+'" stroke-width="1.2"/><rect x="'+(p[0]-12)+'" y="'+(p[1]+7)+'" width="24" height="4" rx="1.5" fill="#b9825a" stroke="'+INK+'" stroke-width="1.2"/>'+
      '<rect x="'+(p[0]-13)+'" y="'+(p[1]-4)+'" width="26" height="10" rx="2" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/><path d="M'+(p[0]-13)+' '+(p[1]+1)+' h26" stroke="var(--coral)" stroke-width="3"/>'; }).join('');
};
ART.balloon=function(){
  var x=300, y=262;
  return '<g class="bobA"><path d="M'+(x-7)+' '+(y+12)+' L'+(x-4)+' '+(y+22)+' M'+(x+7)+' '+(y+12)+' L'+(x+4)+' '+(y+22)+'" stroke="'+INK+'" stroke-width="1.2" fill="none"/>'+
    '<path d="M'+x+' '+(y-18)+' C'+(x+22)+' '+(y-18)+' '+(x+20)+' '+(y+4)+' '+(x+7)+' '+(y+13)+' L'+(x-7)+' '+(y+13)+' C'+(x-20)+' '+(y+4)+' '+(x-22)+' '+(y-18)+' '+x+' '+(y-18)+' Z" fill="var(--coral)" stroke="'+INK+'" stroke-width="2"/>'+
    '<path d="M'+x+' '+(y-18)+' C'+(x+8)+' '+(y-10)+' '+(x+7)+' '+(y+4)+' '+(x+3)+' '+(y+13)+' L'+(x-3)+' '+(y+13)+' C'+(x-7)+' '+(y+4)+' '+(x-8)+' '+(y-10)+' '+x+' '+(y-18)+' Z" fill="var(--sun)" stroke="'+INK+'" stroke-width="1.2"/>'+
    '<rect x="'+(x-5)+'" y="'+(y+22)+'" width="10" height="7" rx="1.5" fill="#b9825a" stroke="'+INK+'" stroke-width="1.5"/></g>';
};
ART.fireworks=function(){
  var cols=['var(--coral)','var(--sun)','#35b8ae'];
  return [[180,34,12],[128,58,10],[232,56,10]].map(function(b,i){
    var s='';
    for(var k=0;k<8;k++){ var a=k*Math.PI/4, c=Math.cos(a), d=Math.sin(a);
      s+='<line x1="'+(b[0]+c*3).toFixed(1)+'" y1="'+(b[1]+d*3).toFixed(1)+'" x2="'+(b[0]+c*b[2]).toFixed(1)+'" y2="'+(b[1]+d*b[2]).toFixed(1)+'" stroke="'+cols[i]+'" stroke-width="2.4" stroke-linecap="round"/>'; }
    return '<g class="'+(i%2 ? 'tw1' : 'tw2')+'">'+s+'<circle cx="'+b[0]+'" cy="'+b[1]+'" r="2" fill="#fff" stroke="'+INK+'" stroke-width="1"/></g>'; }).join('');
};
