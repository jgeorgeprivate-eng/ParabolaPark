"use strict";
/* Zone 3, lesson 3.2 Parabolas, and three background cards */
/* ---------- graph ---------- */
function drawGraph(el,o){
  var X0=-6, ymin=o.ymin, ymax=ymin+12, S=25;
  var px=function(x){ return (x-X0)*S; }, py=function(y){ return (ymax-y)*S; };
  var s='', i;
  for(i=0;i<=12;i++) s+='<line class="g" x1="'+i*S+'" y1="0" x2="'+i*S+'" y2="300"/><line class="g" x1="0" y1="'+i*S+'" x2="300" y2="'+i*S+'"/>';
  s+='<line class="ax" x1="0" y1="'+py(0)+'" x2="300" y2="'+py(0)+'"/><line class="ax" x1="'+px(0)+'" y1="0" x2="'+px(0)+'" y2="300"/>';
  for(i=-4;i<=4;i+=2) if(i!==0) s+='<text x="'+px(i)+'" y="'+(py(0)+11)+'" text-anchor="middle">'+num(i)+'</text>';
  for(i=ymin+2;i<ymax;i+=2) if(i!==0) s+='<text x="'+(px(0)-4)+'" y="'+(py(i)+3)+'" text-anchor="end">'+num(i)+'</text>';
  s+='<text x="292" y="'+(py(0)-5)+'" text-anchor="end">x</text><text x="'+(px(0)+6)+'" y="10">y</text>';
  var curve=function(a,h,k){
    var d='', pen=false;
    for(var j=0;j<=240;j++){ var x=-6+j*0.05, y=a*(x-h)*(x-h)+k;
      if(y<ymin-3||y>ymax+3){ pen=false; continue; }
      d+=(pen?'L':'M')+px(x).toFixed(1)+' '+py(y).toFixed(1); pen=true; }
    return d;
  };
  if(o.ref) s+='<path class="ref" d="'+curve(1,0,0)+'"/>';
  if(!o.nocurve) s+='<path class="cv" d="'+curve(o.a,o.h,o.k)+'"/>';
  (o.pts||[]).forEach(function(p){ s+='<circle class="pt" cx="'+px(p[0])+'" cy="'+py(p[1])+'" r="4"/>'; });
  if(o.tp && o.a!==0){
    var lx=px(o.h)+(o.h>=3?-9:9), ly=py(o.k)+(o.a<0?-9:16);
    s+='<circle class="tp" cx="'+px(o.h)+'" cy="'+py(o.k)+'" r="5.5"/><text class="tpl" x="'+lx+'" y="'+ly+'" text-anchor="'+(o.h>=3?'end':'start')+'">'+pt(o.h,o.k)+'</text>';
  }
  el.innerHTML=s;
  return {px:px,py:py,ymin:ymin,ymax:ymax};
}
var carTimer=null;
function bindLesson(){
  drawGraph($('#g1'),{a:1,h:0,k:0,ymin:-2,pts:[-3,-2,-1,0,1,2,3].map(function(x){return [x,x*x];})});
  var val=function(id){ return parseFloat($('#'+id).value); };
  function u2(){
    var a=val('s2a'); $('#s2a-o').textContent=num(a); $('#r2').textContent=rule(a,0,0);
    drawGraph($('#g2'),{a:a,h:0,k:0,ymin:-6,ref:true});
    var c;
    if(a>1) c='The number is bigger than 1, so the curve is narrower than y = x².';
    else if(a===1) c='The number is 1, so this is y = x².';
    else if(a>0) c='The number is between 0 and 1, so the curve is wider than y = x².';
    else if(a===0) c='The number is 0, so there is no x² left in the rule. The graph is a flat line and not a parabola.';
    else if(a>-1) c='The number is negative, so the curve is upside down. It is also wider than y = x².';
    else if(a===-1) c='The number is '+M+'1, so this is y = x² turned upside down.';
    else c='The number is negative, so the curve is upside down. It is also narrower than y = x².';
    $('#c2').textContent=c;
  }
  function u3(){
    var h=val('s3h'), k=val('s3k'); $('#s3h-o').textContent=num(h); $('#s3k-o').textContent=num(k);
    $('#r3').textContent=rule(1,h,k);
    drawGraph($('#g3'),{a:1,h:h,k:k,ymin:-4,ref:true,tp:true});
    var parts=[];
    parts.push(h===0?'not moved sideways':Math.abs(h)+(h>0?' to the right':' to the left'));
    parts.push(k===0?'not moved up or down':Math.abs(k)+(k>0?' up':' down'));
    $('#c3').textContent='Compared with y = x², this curve is '+parts[0]+' and '+parts[1]+'. Its turning point is '+pt(h,k)+'.';
  }
  var g4;
  function u4(){
    var a=val('s4a'), h=val('s4h'), k=val('s4k');
    $('#s4a-o').textContent=num(a); $('#s4h-o').textContent=num(h); $('#s4k-o').textContent=num(k);
    $('#r4').textContent=rule(a,h,k);
    g4=drawGraph($('#g4'),{a:a,h:h,k:k,ymin:-4,tp:true});
    var goal=$('#goal'), ok=a<0&&h===2&&k===3;
    goal.classList.toggle('done',ok);
    goal.textContent = ok ? 'Done. This hill has its top at (2, 3).' : (a>=0&&h===2&&k===3 ? 'The turning point is at (2, 3), but this curve is not a hill yet. Make a negative.' : 'Build a hill with its top at (2, 3).');
  }
  $('#s2a').addEventListener('input',u2);
  $('#s3h').addEventListener('input',u3); $('#s3k').addEventListener('input',u3);
  ['s4a','s4h','s4k'].forEach(function(id){ $('#'+id).addEventListener('input',function(){ cancelAnimationFrame(carTimer); u4(); }); });
  $('#run4').addEventListener('click',function(){
    cancelAnimationFrame(carTimer); u4();
    var a=val('s4a'), h=val('s4h'), k=val('s4k'), pts=[];
    for(var j=0;j<=240;j++){ var x=-6+j*0.05, y=a*(x-h)*(x-h)+k; if(y>=g4.ymin&&y<=g4.ymax) pts.push([g4.px(x),g4.py(y)]); }
    if(!pts.length) return;
    var car=document.createElementNS('http://www.w3.org/2000/svg','circle');
    car.setAttribute('r','7'); car.setAttribute('class','tp'); $('#g4').appendChild(car);
    var t0=null, dur=REDUCED?1:1800;
    (function step(ts){
      if(t0===null) t0=ts;
      var f=Math.min(1,(ts-t0)/dur), p=pts[Math.round(f*(pts.length-1))];
      car.setAttribute('cx',p[0]); car.setAttribute('cy',p[1]);
      if(f<1) carTimer=requestAnimationFrame(step); else setTimeout(function(){ if(car.parentNode) car.parentNode.removeChild(car); },500);
    })(performance.now());
  });
  u2(); u3(); u4();
}


var GEN32 = [
  function(){
    var h=pick([-5,-4,-3,-2,-1,1,2,3,4,5]), k; do{ k=pick([-5,-4,-3,-2,-1,1,2,3,4,5]); }while(k===h);
    return makeQ('What is the turning point of '+rule(1,h,k)+'?', pt(h,k), [pt(-h,k),pt(h,-k),pt(k,h)],
      'The bracket equals 0 when x = '+num(h)+'. The number at the end gives y = '+num(k)+'. The turning point is '+pt(h,k)+'.');
  },
  function(){
    var c=rule(-pick([1,2,3]), pick([0,1,2,3]), pick([1,2,3,4]));
    var w=[rule(pick([2,3]),0,-pick([1,2,3,4,5])), rule(1,pick([1,2,3,4,5]),0), rule(pick([2,3,4]),-pick([1,2,3]),pick([1,2,3]))];
    return makeQ('Which rule gives a parabola that is upside down, like a hill?', c, w,
      'A parabola is upside down only when the number in front of x² or the bracket is negative. A minus sign anywhere else moves the curve but does not turn it over.');
  },
  function(){
    var as=shuffle([0.5,1,2,3,4,5]).slice(0,4), narrow=Math.random()<0.5;
    var target=narrow?Math.max.apply(null,as):Math.min.apply(null,as);
    return makeQ('Which rule gives the '+(narrow?'narrowest':'widest')+' parabola?', rule(target,0,0), as.filter(function(a){return a!==target;}).map(function(a){return rule(a,0,0);}),
      narrow?'The bigger the number in front of x², the narrower the curve. The biggest number here is '+target+'.':'The smaller the number in front of x², the wider the curve. The smallest number here is '+target+'.');
  },
  function(){
    var n=rnd(2,6), dir=pick(['up','down','to the right','to the left']);
    var all={'up':rule(1,0,n),'down':rule(1,0,-n),'to the right':rule(1,n,0),'to the left':rule(1,-n,0)};
    var c=all[dir], w=Object.keys(all).filter(function(d){return d!==dir;}).map(function(d){return all[d];});
    var ex={'up':'Adding '+n+' at the end makes every y value '+n+' bigger, so the curve moves up.',
            'down':'Subtracting '+n+' at the end makes every y value '+n+' smaller, so the curve moves down.',
            'to the right':'The bracket (x '+M+' '+n+') equals 0 when x = '+n+', so the lowest point moves to x = '+n+'. That is '+n+' units to the right.',
            'to the left':'The bracket (x + '+n+') equals 0 when x = '+M+n+', so the lowest point moves to x = '+M+n+'. That is '+n+' units to the left.'}[dir];
    return makeQ('The graph of y = x² is moved '+n+' units '+dir+'. What is the new rule?', c, w, ex);
  },
  function(){
    var a=pick([2,3]), m=pick([3,4,5])*pick([1,-1]), sq=m*m;
    var q=makeQ('For '+rule(a,0,0)+', what is y when x = '+num(m)+'?', ''+a*sq, [M+a*sq, ''+(a*m)*(a*m), ''+2*a*Math.abs(m)],
      'Square first: '+(m<0?'('+num(m)+')':m)+'² = '+sq+'. Then multiply by '+a+' to get '+a*sq+'.');
    q.help = m<0 ? 'squares' : 'subst';
    return q;
  }
];

Object.assign(HELP, {
  squares:{title:'Squaring negative numbers', btn:'squaring negative numbers',
    html:'<p>Squaring a number means multiplying it by itself. For example, 5² = 5 × 5 = 25.</p>'+
         '<p>When you multiply two negative numbers, the answer is positive. So ('+M+'5)² = ('+M+'5) × ('+M+'5) = 25.</p>'+
         '<p class="note">The brackets matter. ('+M+'5)² means the whole number '+M+'5 is squared, which gives 25. Without brackets, '+M+'5² means square 5 first and then make the answer negative, which gives '+M+'25.</p>',
    gen:function(){
      var n=rnd(3,9), br=Math.random()<0.6;
      return makeQ('What is '+(br?'('+M+n+')²':M+n+'²')+'?', br?''+n*n:M+n*n, [br?M+n*n:''+n*n, ''+2*n, M+2*n],
        br?'The brackets mean the whole number '+M+n+' is squared. ('+M+n+') × ('+M+n+') = '+n*n+'.':'There are no brackets, so square '+n+' first to get '+n*n+'. Then make it negative: '+M+n*n+'.');
    }},
  subst:{title:'Putting a number into a rule', btn:'putting a number into a rule',
    html:'<p>A rule such as y = 3x² tells you how to work out y from x. To use it, replace x with the number and then calculate. This is called substituting.</p>'+
         '<p>The order matters. Work out the square first, then multiply, then add or subtract.</p>'+
         '<p class="note">Example: find y when x = 4 in the rule y = 3x² + 2. Square first: 4² = 16. Multiply: 3 × 16 = 48. Add: 48 + 2 = 50. So y = 50.</p>',
    gen:function(){
      var a=pick([2,3]), m=pick([3,4,5]), c=rnd(1,5);
      return makeQ('For y = '+a+'x² + '+c+', what is y when x = '+m+'?', ''+(a*m*m+c), [''+(a*m*a*m+c), ''+(2*a*m+c), ''+a*m*m],
        'Square first: '+m+'² = '+m*m+'. Multiply: '+a+' × '+m*m+' = '+a*m*m+'. Add: '+a*m*m+' + '+c+' = '+(a*m*m+c)+'.');
    }},
  plot:{title:'Plotting a point on a graph', btn:'plotting points',
    html:'<p>A point on a graph is described by two numbers called coordinates, written (x, y).</p>'+
         '<p>The first number tells you how far to go across from the place where the axes cross. Right is positive and left is negative. The second number tells you how far to go up or down. Up is positive and down is negative.</p>'+
         '<p class="note">Example: to plot ('+M+'2, 4), start where the axes cross, go 2 to the left, then go 4 up.</p>',
    gen:function(){
      var x=pick([-5,-4,-3,-2,-1,1,2,3,4,5]), y; do{ y=pick([-3,-2,-1,1,2,3,4,5,6,7]); }while(y===x);
      var q=makeQ('Which point is marked on the graph?', pt(x,y), [pt(y,x),pt(-x,y),pt(x,-y)],
        'The point is '+Math.abs(x)+(x>0?' to the right':' to the left')+' and '+Math.abs(y)+(y>0?' up':' down')+', so its coordinates are '+pt(x,y)+'.');
      q.graph=[x,y]; return q;
    }}
});
HELP.squares.zone=3; HELP.plot.zone=3; HELP.subst.zone=1;
LESSONS['3.2']={id:'3.2', zone:3, title:'Parabolas', bind:bindLesson, gens:GEN32, html:function(){
  var xs=[-3,-2,-1,0,1,2,3];
  return '<p>A ball thrown through the air follows a curve called a parabola. So does the ring in a ring toss. In this lesson you learn how the rule for a parabola controls its shape and its position. A rule is an equation that tells you how to work out y from x.</p>'+

  '<h2>The graph of y = x²</h2>'+
  '<p>x² means x multiplied by itself. To draw the graph of y = x², choose some values of x, work out y for each one, then plot the points.</p>'+
  hb('subst')+
  '<div class="tablewrap"><table class="vals"><tr><th>x</th>'+xs.map(function(x){return '<td>'+num(x)+'</td>';}).join('')+'</tr><tr><th>y</th>'+xs.map(function(x){return '<td>'+(x*x)+'</td>';}).join('')+'</tr></table></div>'+
  '<svg class="graph" id="g1" viewBox="0 0 300 300" role="img" aria-label="Graph of y equals x squared with seven plotted points"></svg>'+
  hb('plot')+
  '<p>A negative number multiplied by itself gives a positive number, so ('+M+'3)² = 9, the same as 3². That is why the left side of the curve matches the right side.</p>'+
  hb('squares')+
  '<p>The lowest point of this curve is at (0, 0). The lowest or highest point of a parabola is called its <b>turning point</b>.</p>'+

  '<h2>The number in front of x²</h2>'+
  '<p>In y = 2x², every y value is twice as big as it is in y = x². The points move further from the x-axis, so the curve looks narrower. Move the slider to change the number in front of x².</p>'+
  '<div class="card"><div class="rule" id="r2"></div><svg class="graph" id="g2" viewBox="0 0 300 300" role="img" aria-label="Graph that changes with the slider"></svg>'+
  slider('s2a','Number in front',-3,3,0.5,2)+'<p id="c2"></p><p class="small muted">The grey dashed curve is y = x², so you can compare.</p></div>'+

  '<h2>Moving the curve</h2>'+
  '<p>Adding a number at the end of the rule moves the whole curve up. The graph of y = x² + 3 is 3 units higher than the graph of y = x². Subtracting a number moves the curve down.</p>'+
  '<p>Putting a number inside a bracket with x moves the curve sideways. The graph of y = (x '+M+' 2)² is 2 units to the right of the graph of y = x².</p>'+
  '<p class="note">The sideways direction is the opposite of the sign you see. x '+M+' 2 moves the curve right and x + 2 moves it left. To check, ask which value of x makes the bracket equal 0. For (x '+M+' 2)² that value is x = 2, so the lowest point is at x = 2.</p>'+
  '<div class="card"><div class="rule" id="r3"></div><svg class="graph" id="g3" viewBox="0 0 300 300" role="img" aria-label="Graph that moves with the sliders"></svg>'+
  slider('s3h','Left or right',-4,4,1,2)+slider('s3k','Up or down',-3,6,1,1)+'<p id="c3"></p></div>'+

  '<h2>A rule with all three parts</h2>'+
  '<p>The rule y = a(x '+M+' h)² + k uses all three ideas. The letter a is the number in front, h is the move sideways and k is the move up or down. The turning point is at (h, k).</p>'+
  '<p>When a is negative the curve is upside down and looks like a hill. The turning point is then the top of the hill. For example, y = '+M+'2(x '+M+' 1)² + 5 is a hill with its top at (1, 5).</p>'+
  '<div class="card"><h3>Design a coaster hill</h3><div class="goal" id="goal">Build a hill with its top at (2, 3).</div><div class="rule" id="r4"></div><svg class="graph" id="g4" viewBox="0 0 300 300" role="img" aria-label="Graph of your coaster hill"></svg>'+
  slider('s4a','a',-3,3,0.5,-1)+slider('s4h','h',-4,4,1,-2)+slider('s4k','k',-3,6,1,1)+
  '<div><button class="btn plain" id="run4">Send a car along the curve</button></div></div>';
}};
