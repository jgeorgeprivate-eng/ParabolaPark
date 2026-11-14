"use strict";
/* Zone 1, Front Gate: lessons 1.5 to 1.7 and the two extra cards */

/* ================= 1.5 Factorising quadratics ================= */
function factQ(p, q, wrongs, why){
  return makeQ('Factorise '+polyH([1,p+q,p*q])+'.', PR(1,0,[[1,p],[1,q]]), wrongs,
    why+' The answer is '+prodH(1,0,[[1,p],[1,q]])+'.', {pv:sig(polyF([1,p+q,p*q]))});
}
function B2(p,q){ return PR(1,0,[[1,p],[1,q]]); }
LESSONS['1.5'] = {id:'1.5', zone:1, title:'Factorising quadratics',
  html:function(){ return ''+
    Pp('In lesson 1.4 you expanded two brackets. This lesson goes the other way and turns an expression back into two brackets.')+
    H2('What a quadratic is')+
    Pp('A <b>quadratic</b> is an expression in which the highest power of x is '+X2+', such as '+X2+' + 7x + 12. Factorising a quadratic means writing it as two brackets multiplied together.')+
    H2('The number pair')+
    Pp('Expanding (x + 3)(x + 4) gives '+X2+' + 7x + 12. Notice that 3 + 4 = 7 and 3 × 4 = 12.')+
    Pp('So to factorise '+X2+' + 7x + 12, find two numbers that multiply to 12 and add to 7. The pairs that multiply to 12 are 1 and 12, 2 and 6, and 3 and 4. Only 3 and 4 add to 7.')+
    note(X2+' + 7x + 12 = (x + 3)(x + 4)')+
    hb('hcf')+
    '<div class="card"><h3>Number-pair finder</h3><p class="rule" id="w15q"></p>'+slider('w15p','First number',-12,12,1,1)+slider('w15r','Second number',-12,12,1,1)+'<div id="w15"></div><div><button class="btn plain" id="w15new">New quadratic</button></div></div>'+
    H2('Signs')+
    Pp('When the last number is positive, both numbers in the pair have the same sign as the middle term. '+X2+' − 7x + 12 = (x − 3)(x − 4), because '+M+'3 × '+M+'4 = 12 and '+M+'3 + '+M+'4 = '+M+'7.')+
    Pp('When the last number is negative, one number in the pair is positive and the other is negative. '+X2+' + x − 12 = (x + 4)(x − 3), because 4 × '+M+'3 = '+M+'12 and 4 + '+M+'3 = 1.')+
    hb('neg')+
    H2('Difference of two squares')+
    Pp(X2+' − 25 has no x term, and both parts are squares. It factorises as (x + 5)(x − 5). You saw this pattern in lesson 1.4, where the two middle terms cancelled.')+
    H2('Perfect squares')+
    Pp(X2+' + 10x + 25 = (x + 5)<sup>2</sup>. The number pair is 5 and 5, because 5 × 5 = 25 and 5 + 5 = 10.')+
    H2('A common factor first')+
    Pp('If every term can be divided by the same number, take that number out first, as in lesson 1.3. Then factorise the quadratic that is left.')+
    note('2'+X2+' + 10x + 12 = 2('+X2+' + 5x + 6) = 2(x + 2)(x + 3)')+
    H2('Checking by expanding')+
    Pp('Expand the brackets. The result should be the quadratic you started with.')+
    H2('Extra: two more methods')+
    Pp('These two methods are optional. They are not in the zone test. Each one has a short explanation and a practice question.')+
    '<div class="booth"><button class="helpbtn" data-act="help:x_group">Extra: grouping in pairs</button><button class="helpbtn" data-act="help:x_cts">Extra: completing the square</button></div>';
  },
  bind:function(){
    var tp, tq;
    function fresh15(){ do{ tp = rnd(-9,9); tq = rnd(-9,9); }while(tp === 0 || tq === 0 || tp+tq === 0); $('#w15q').innerHTML = polyH([1,tp+tq,tp*tq]); }
    function u(){
      var p = val('w15p'), q = val('w15r'), b = tp+tq, c = tp*tq, okP = p*q === c, okS = p+q === b;
      $('#w15p-o').textContent = num(p); $('#w15r-o').textContent = num(q);
      $('#w15').innerHTML = '<div class="tablewrap"><table class="vals"><tr><th></th><th>Needed</th><th>Your pair</th></tr>'+
        '<tr><th>Multiply to</th><td>'+num(c)+'</td><td class="'+(okP ? 'hit' : '')+'">'+num(p*q)+'</td></tr><tr><th>Add to</th><td>'+num(b)+'</td><td class="'+(okS ? 'hit' : '')+'">'+num(p+q)+'</td></tr></table></div>'+
        '<p class="goal'+(okP && okS ? ' done' : '')+'">'+prodH(1,0,[[1,p],[1,q]])+' = '+polyH([1,p+q,p*q])+(okP && okS ? '. Both targets are met.' : '')+'</p>';
    }
    $('#w15new').addEventListener('click', function(){ fresh15(); u(); });
    onInput(['w15p','w15r'], u); fresh15(); u();
  },
  gens:[
    function(){
      var o = function(a,b){ return num(a)+' and '+num(b); }, p, q;
      if(Math.random() < 0.5){
        p = rnd(2,9); q = rnd(2,9); if(p >= q) return null;
        return makeQ('Which two numbers multiply to '+(p*q)+' and add to '+(p+q)+'?', o(p,q), [o(1,p*q), o(p-1,q+1), o(p,q+1)],
          p+' × '+q+' = '+(p*q)+' and '+p+' + '+q+' = '+(p+q)+'.');
      }
      p = rnd(2,9); q = -rnd(2,9); if(p === -q) return null;
      return makeQ('Which two numbers multiply to '+num(p*q)+' and add to '+num(p+q)+'?', o(p,q), [o(-p,-q), o(p,-q), o(-p*q,-1)],
        p+' × '+num(q)+' = '+num(p*q)+' and '+p+' + '+num(q)+' = '+num(p+q)+'.');
    },
    function(){
      var p = rnd(2,9), q = rnd(2,9);
      return factQ(p, q, [B2(1,p*q), B2(-p,-q), B2(p-1,q+1)], p+' × '+q+' = '+(p*q)+' and '+p+' + '+q+' = '+(p+q)+'.');
    },
    function(){
      var p = rnd(2,9), q = rnd(2,9);
      return factQ(-p, -q, [B2(p,q), B2(-1,-p*q), B2(p,-q)], 'The last number is positive and the middle term is negative, so both numbers are negative. '+M+p+' × '+M+q+' = '+(p*q)+' and '+M+p+' + '+M+q+' = '+M+(p+q)+'.');
    },
    function(){
      var p = rnd(2,9), q = rnd(2,9); if(p === q) return null;
      return factQ(p, -q, [B2(-p,q), B2(p,q), B2(-p,-q)], 'The last number is negative, so one number is positive and one is negative. '+p+' × '+M+q+' = '+M+(p*q)+' and '+p+' + '+M+q+' = '+num(p-q)+'.');
    },
    function(){
      var n = rnd(2,12);
      return makeQ('Factorise '+polyH([1,0,-n*n])+'.', B2(n,-n), [B2(-n,-n), B2(n,n), B2(n*n,-1)],
        'There is no x term and '+(n*n)+' = '+n+'<sup>2</sup>, so this is a difference of two squares. The answer is '+prodH(1,0,[[1,n],[1,-n]])+'.', {pv:sig(polyF([1,0,-n*n]))});
    },
    function(){
      var n = rnd(2,9), s = pick([1,-1]);
      return makeQ('Factorise '+polyH([1,2*s*n,n*n])+'.', B2(s*n,s*n), [B2(-s*n,-s*n), B2(n,-n), B2(s*n*n,s)],
        'The number pair is '+num(s*n)+' and '+num(s*n)+', because '+num(s*n)+' × '+num(s*n)+' = '+(n*n)+' and '+num(s*n)+' + '+num(s*n)+' = '+num(2*s*n)+'. The answer is '+prodH(1,0,[[1,s*n],[1,s*n]])+'.', {pv:sig(polyF([1,2*s*n,n*n]))});
    },
    function(){
      var k = rnd(2,5), p = rnd(1,6), q = rnd(1,6);
      return makeQ('Factorise '+polyH([k,k*(p+q),k*p*q])+' fully.', PR(k,0,[[1,p],[1,q]]), [PR(1,0,[[1,p],[1,q]]), PR(k,0,[[1,k*p],[1,q]]), PR(k,0,[[1,-p],[1,-q]])],
        'Every term divides by '+k+', so take out '+k+' first: '+k+'('+polyH([1,p+q,p*q])+'). Then '+p+' × '+q+' = '+(p*q)+' and '+p+' + '+q+' = '+(p+q)+'. The answer is '+prodH(k,0,[[1,p],[1,q]])+'.', {pv:sig(polyF([k,k*(p+q),k*p*q]))});
    }
  ]
};

/* extra cards for lesson 1.5 (not listed in the Info Booth, not in the zone test) */
function csH(h,k){ return '('+polyH([1,h])+')<sup>2</sup> '+(k < 0 ? M+' '+(-k) : '+ '+k); }
HELP.x_group = {title:'Extra: grouping in pairs', btn:'grouping in pairs', extra:true, zone:1,
  html:'<p>Some expressions with four terms can be factorised two terms at a time.</p>'+
       '<p>Take '+X2+' + 3x + 2x + 6. Take x out of the first two terms and 2 out of the last two terms: x(x + 3) + 2(x + 3).</p>'+
       '<p>Both parts now contain the bracket (x + 3). Take it out as a common factor: (x + 3)(x + 2).</p>'+
       '<p class="note">The method works only when the two brackets come out the same.</p>',
  gen:function(){
    var a = rnd(1,9), b = rnd(1,9); if(a === b) return null;
    return makeQ('Factorise by grouping in pairs: '+X2+' + '+polyH([a,0])+' + '+polyH([b,0])+' + '+(a*b)+'.', B2(a,b), [B2(a,a), B2(a+b,1), B2(a,-b)],
      'The first pair is x('+polyH([1,a])+'). The second pair is '+b+'('+polyH([1,a])+'). Take out the common bracket to get '+prodH(1,0,[[1,a],[1,b]])+'.', {pv:sig(polyF([1,a+b,a*b]))});
  }};
HELP.x_cts = {title:'Extra: completing the square', btn:'completing the square', extra:true, zone:1,
  html:'<p>Completing the square rewrites a quadratic as a perfect square plus or minus a number.</p>'+
       '<p>Take '+X2+' + 6x + 2. Halve the number in front of x: 6 ÷ 2 = 3. Now expand (x + 3)<sup>2</sup> to get '+X2+' + 6x + 9.</p>'+
       '<p>That ends in 9, but the quadratic ends in 2. To get from 9 to 2, subtract 7.</p>'+
       '<p class="note">'+X2+' + 6x + 2 = (x + 3)<sup>2</sup> − 7</p>'+
       '<p>This form shows the turning point of a parabola, which is covered in Coaster Alley.</p>',
  gen:function(){
    var h = rnd(1,6)*pick([1,-1]), c = rnd(-9,20), k = c-h*h;
    if(k === 0 || c === 0 || c-4*h*h === 0) return null;
    var e = function(hh,kk){ return E(csH(hh,kk), function(x){ return (x+hh)*(x+hh)+kk; }); };
    return makeQ('Complete the square for '+polyH([1,2*h,c])+'.', e(h,k), [e(2*h,c-4*h*h), e(h,c), e(h,c+h*h)],
      'Half of '+num(2*h)+' is '+num(h)+'. ('+polyH([1,h])+')<sup>2</sup> = '+polyH([1,2*h,h*h])+', which ends in '+(h*h)+'. The quadratic ends in '+num(c)+', so '+(k < 0 ? 'subtract '+(-k) : 'add '+k)+'. The answer is '+csH(h,k)+'.', {pv:sig(polyF([1,2*h,c]))});
  }};

/* ================= 1.6 Algebraic fractions ================= */
LESSONS['1.6'] = {id:'1.6', zone:1, title:'Algebraic fractions',
  html:function(){ return ''+
    Pp('Fractions that contain letters follow the same rules as fractions made of numbers. This lesson applies those rules one at a time.')+
    H2('What an algebraic fraction is')+
    Pp('An <b>algebraic fraction</b> is a fraction with a letter in the top, the bottom or both, such as '+fr('x',3)+' or '+fr(5,'x')+'. The bottom of a fraction is called the <b>denominator</b>.')+
    H2('Simplifying')+
    Pp('Divide the top and the bottom by a common factor. In '+fr('6x',9)+' both 6 and 9 divide by 3, which gives '+fr('2x',3)+'.')+
    Pp('In '+fr('4'+X2,'2x')+' the top and the bottom both divide by 2x, which gives 2x.')+
    hb('equiv')+
    H2('A top with two terms')+
    Pp('To simplify '+fr('3x + 6',3)+', factorise the top first: '+fr('3(x + 2)',3)+' = x + 2.')+
    note('A common mistake is to divide only one of the two terms, which gives x + 6. The fraction bar works like a bracket around the whole top, so every term on the top must be divided.')+
    H2('Adding and subtracting')+
    Pp('Fractions can be added only when they have the same denominator. For '+fr('x',2)+' + '+fr('x',3)+' the common denominator is 6.')+
    note(fr('x',2)+' + '+fr('x',3)+' = '+fr('3x',6)+' + '+fr('2x',6)+' = '+fr('5x',6))+
    hb('addfrac')+
    '<div class="card"><h3>Adding two fractions of x</h3>'+slider('w16a','First denominator',2,6,1,2)+slider('w16b','Second denominator',2,6,1,3)+'<div id="w16"></div></div>'+
    H2('Tops with two terms')+
    Pp(fr('x + 1',2)+' + '+fr('x − 3',4)+' = '+fr('2(x + 1)',4)+' + '+fr('x − 3',4)+' = '+fr('2x + 2 + x − 3',4)+' = '+fr('3x − 1',4))+
    Pp('In a subtraction, the minus sign applies to the whole second top.')+
    note(fr('x + 1',2)+' − '+fr('x − 3',4)+' = '+fr('2x + 2 − (x − 3)',4)+' = '+fr('2x + 2 − x + 3',4)+' = '+fr('x + 5',4))+
    hb('like')+
    H2('A letter in the denominator')+
    Pp('When the denominators are the same, add the tops: '+fr(2,'x')+' + '+fr(3,'x')+' = '+fr(5,'x')+'.')+
    Pp('When they are different, find a common denominator as before: '+fr(1,'x')+' + '+fr(1,2)+' = '+fr(2,'2x')+' + '+fr('x','2x')+' = '+fr('x + 2','2x')+'.')+
    H2('Multiplying')+
    Pp('Multiply the tops, multiply the bottoms, then simplify: '+fr('2x',3)+' × '+fr(9,'x')+' = '+fr('18x','3x')+' = 6.')+
    hb('mulfrac')+
    H2('Dividing')+
    Pp('To divide by a fraction, turn it upside down and multiply: '+fr('x',4)+' ÷ '+fr('x',2)+' = '+fr('x',4)+' × '+fr(2,'x')+' = '+fr('2x','4x')+' = '+fr(1,2)+'.');
  },
  bind:function(){
    function bar(parts, runs){
      var w = 280/parts, s = '', i = 0;
      runs.forEach(function(r){ for(var k = 0; k < r[0]; k++, i++) s += '<rect x="'+(i*w)+'" y="0" width="'+w+'" height="26" fill="'+r[1]+'"/>'; });
      for(var j = 1; j < parts; j++) s += '<line x1="'+(j*w)+'" y1="0" x2="'+(j*w)+'" y2="26" stroke="var(--ink)" stroke-width="1"/>';
      return '<svg class="fbar" viewBox="0 0 280 26" preserveAspectRatio="none" aria-hidden="true">'+s+'<rect x="0" y="0" width="280" height="26" fill="none" stroke="var(--ink)" stroke-width="3"/></svg>';
    }
    function tx(n){ return (n === 1 ? '' : n)+'x'; }
    function u(){
      var a = val('w16a'), b = val('w16b'), L = lcm(a,b), na = L/a, nb = L/b, n = na+nb, g = gcd(n,L);
      $('#w16a-o').textContent = a; $('#w16b-o').textContent = b;
      var simp = g > 1 ? ' = '+(L/g === 1 ? tx(n/g) : fr(tx(n/g), L/g)) : '';
      $('#w16').innerHTML = '<p class="small muted">Each bar stands for x. The shaded part is the fraction.</p>'+
        '<div class="flab">'+fr('x',a)+'</div>'+bar(a,[[1,'var(--coral)']])+'<div class="flab">'+fr('x',b)+'</div>'+bar(b,[[1,'#35b8ae']])+
        '<div class="flab">Both cut into '+L+' equal parts</div>'+bar(L,[[na,'var(--coral)'],[nb,'#35b8ae']])+
        '<p class="rule" style="font-size:18px">'+fr('x',a)+' + '+fr('x',b)+' = '+fr(tx(na),L)+' + '+fr(tx(nb),L)+' = '+fr(tx(n),L)+simp+'</p>';
    }
    onInput(['w16a','w16b'], u); u();
  },
  gens:[
    function(){
      var g = rnd(2,6), p = rnd(1,7), q = rnd(2,9); if(p === q || gcd(p,q) !== 1) return null;
      return makeQ('Simplify '+fr((g*p)+'x', g*q)+'.', RA([p,0],q), [RA([g*p,0],q), RA([p,0],g*q), N(p/q, fr(p,q))],
        'Divide the top and the bottom by '+g+'. '+(g*p)+' ÷ '+g+' = '+p+' and '+(g*q)+' ÷ '+g+' = '+q+'.', {pv:sig(function(x){ return g*p*x/(g*q); })});
    },
    function(){
      var g = rnd(2,6), p = pick([1,1,2,3]), c = rnd(1,9);
      return makeQ('Simplify '+fr(polyH([g*p,g*c]), g)+'.', P([p,c]), [P([p,g*c]), P([g*p,c]), P([p,g+c])],
        'Factorise the top: '+g+'('+polyH([p,c])+'). Then divide the top and the bottom by '+g+'. Every term on the top is divided, not only the first.', {pv:sig(function(x){ return (g*p*x+g*c)/g; })});
    },
    function(){
      var a = rnd(2,6), b = rnd(2,6); if(a === b) return null;
      var L = lcm(a,b), na = L/a, nb = L/b, n = na+nb, g = gcd(n,L);
      return makeQ('Simplify '+fr('x',a)+' + '+fr('x',b)+'.', RA([n/g,0],L/g), [RA([2,0],a+b), RA([2,0],L), RA([1,0],a+b)],
        'The common denominator is '+L+'. '+fr('x',a)+' = '+fr(na+'x',L)+' and '+fr('x',b)+' = '+fr(nb+'x',L)+'. Add the tops to get '+fr(n+'x',L)+(g > 1 ? ', which simplifies to '+RA([n/g,0],L/g).h : '')+'.', {pv:sig(function(x){ return x/a+x/b; })});
    },
    function(){
      var a = pick([2,3,4]), k = pick([2,3]), b = a*k, p = rnd(1,6), q = rnd(1,6)*pick([1,-1]), s = pick([1,-1]);
      var cx = k+s, c0 = k*p+s*q;
      if(c0 === 0 || gcd(gcd(cx,c0),b) !== 1) return null;
      return makeQ('Simplify '+fr(polyH([1,p]),a)+' '+(s < 0 ? M : '+')+' '+fr(polyH([1,q]),b)+'.', RA([cx,c0],b), [RA([cx,k*p-s*q],b), RA([cx,p+s*q],b), RA([k-s,k*p-s*q],b)],
        'Write the first fraction over '+b+': '+fr(k+'('+polyH([1,p])+')',b)+'. The top becomes '+polyH([k,k*p])+' '+(s < 0 ? M : '+')+' ('+polyH([1,q])+') = '+polyH([cx,c0])+'.'+(s < 0 ? ' The minus sign applies to both terms of the second top.' : ''), {pv:sig(function(x){ return (x+p)/a+s*(x+q)/b; })});
    },
    function(){
      var p = rnd(1,9), q = rnd(1,9), s = pick([1,-1]); if(s < 0 && p <= q) return null;
      var n = p+s*q; if(p*q === n) return null;
      return makeQ('Simplify '+fr(p,'x')+' '+(s < 0 ? M : '+')+' '+fr(q,'x')+'.', RA([n],1,1), [RA([n],2,1), RA([n],1,2), RA([p*q],1,1)],
        'The denominators are the same, so '+(s < 0 ? 'subtract' : 'add')+' the tops and keep the denominator: '+p+' '+(s < 0 ? M : '+')+' '+q+' = '+n+'.', {pv:sig(function(x){ return p/x+s*q/x; })});
    },
    function(){
      var b = rnd(2,5), m = rnd(2,4), c = b*m, a = rnd(2,5);
      return makeQ('Simplify '+fr(a+'x',b)+' × '+fr(c,'x')+'.', E(''+(a*m), function(){ return a*m; }), [E((a*m)+'x', function(x){ return a*m*x; }), E(''+(a*c), function(){ return a*c; }), E(fr(a*m,'x'), function(x){ return a*m/x; })],
        'Multiply the tops and multiply the bottoms: '+fr((a*c)+'x', b+'x')+'. Divide the top and the bottom by '+b+'x to get '+(a*m)+'.', {pv:sig(function(x){ return (a*x/b)*(c/x); })});
    },
    function(){
      var base = rnd(2,4), k = rnd(2,5), flip = Math.random() < 0.5, a = flip ? base*k : base, b = flip ? base : base*k;
      var res = function(v){ return v >= 1 ? E(''+v, function(){ return v; }) : E(fr(1,Math.round(1/v)), function(){ return v; }); };
      return makeQ('Simplify '+fr('x',a)+' ÷ '+fr('x',b)+'.', res(b/a), [res(a/b), E(fr(X2,a*b), function(x){ return x*x/(a*b); }), E('x', function(x){ return x; })],
        'Turn the second fraction upside down and multiply: '+fr('x',a)+' × '+fr(b,'x')+' = '+fr(b+'x', a+'x')+'. Divide the top and the bottom by '+(flip ? b : a)+'x to get '+res(b/a).h+'.', {pv:sig(function(x){ return (x/a)/(x/b); })});
    }
  ]
};

/* ================= 1.7 Using and rearranging formulas ================= */
var F17 = [
  {name:'v = u + at', ctx:'A ride starts at speed u and speeds up at rate a for time t. Its final speed is v.',
   steps:['v = u + at', 'Subtract u from both sides: <b>v − u = at</b>', 'Divide both sides by a: <b>t = '+fr('v − u','a')+'</b>'],
   vars:[['u',0,10,1,2],['a',1,6,1,3],['t',1,10,1,4]],
   chk:function(o){ var v = o.u+o.a*o.t; return 'The formula gives v = '+o.u+' + '+o.a+' × '+o.t+' = '+v+'. The rearranged formula gives t = '+fr(v+' − '+o.u, o.a)+' = '+o.t+', which is the value on the slider.'; }},
  {name:'C = 2πr', ctx:'A Ferris wheel with radius r metres has circumference C metres.',
   steps:['C = 2πr', 'r is multiplied by 2π, so divide both sides by 2π: <b>r = '+fr('C','2π')+'</b>'],
   vars:[['r',5,40,1,25]],
   chk:function(o){ var C = 2*Math.PI*o.r; return 'The formula gives C = 2 × π × '+o.r+' = '+C.toFixed(2)+'. The rearranged formula gives r = '+fr(C.toFixed(2),'2π')+' = '+o.r+', which is the value on the slider.'; }},
  {name:'A = πr²', ctx:'A round pool with radius r metres has surface area A square metres.',
   steps:['A = π'+S('r',2), 'Divide both sides by π: <b>'+fr('A','π')+' = '+S('r',2)+'</b>', 'Take the square root of both sides: <b>r = √('+fr('A','π')+')</b>'],
   vars:[['r',1,10,0.5,3]],
   chk:function(o){ var A = Math.PI*o.r*o.r; return 'The formula gives A = π × '+o.r+'<sup>2</sup> = '+A.toFixed(2)+'. The rearranged formula gives r = √('+fr(A.toFixed(2),'π')+') = '+o.r+', which is the value on the slider.'; }}
];
LESSONS['1.7'] = {id:'1.7', zone:1, title:'Using and rearranging formulas',
  html:function(){ return ''+
    Pp('A formula lets you calculate one quantity from others. This lesson shows how to use a formula and how to rewrite it to find a different quantity.')+
    H2('Formulas and their subject')+
    Pp('A <b>formula</b> is a rule that links quantities. The <b>subject</b> is the letter on its own on one side. In A = lw the subject is A. This formula gives the area of a rectangle from its length l and its width w.')+
    H2('Finding the subject')+
    Pp('Put the numbers in place of the letters and calculate. The formula v = u + at gives the final speed of a ride that starts at speed u and speeds up at rate a for time t.')+
    note('With u = 2, a = 3 and t = 4: v = 2 + 3 × 4 = 2 + 12 = 14.')+
    hb('subst')+
    H2('Finding a different letter')+
    Pp('Put the numbers in, then solve the equation that is left.')+
    note('With v = 20, u = 2 and a = 3: 20 = 2 + 3t. Subtract 2 from both sides to get 18 = 3t. Divide both sides by 3 to get t = 6.')+
    hb('solve')+
    H2('Rearranging a formula')+
    Pp('<b>Rearranging</b> means rewriting a formula so that a different letter is the subject. Undo the operations one at a time, and do the same thing to both sides each time.')+
    Pp('In v = u + at, the letter t is multiplied by a and then u is added. To make t the subject, undo the adding first and then undo the multiplying.')+
    '<div class="card"><h3>Rearranging one step at a time</h3><div class="row" id="w17f"></div><p class="small muted" id="w17c"></p><ol id="w17s" class="steps"></ol><div><button class="btn plain" id="w17n">Next step</button></div><div id="w17v"></div><p id="w17k"></p></div>'+
    H2('Formulas with multiplication and division')+
    Pp('Speed is distance divided by time: s = '+fr('d','t')+'. To make d the subject, multiply both sides by t to get d = st. To make t the subject, start from st = d and divide both sides by s to get t = '+fr('d','s')+'.')+
    Pp('The circumference of a circle is C = 2πr. To make r the subject, divide both sides by 2π to get r = '+fr('C','2π')+'.')+
    H2('Squares and roots')+
    Pp('The area of a circle is A = π'+S('r',2)+'. Divide both sides by π to get '+fr('A','π')+' = '+S('r',2)+'. Then take the square root of both sides: r = √('+fr('A','π')+'). Only the positive root is used, because r is a length.')+
    hb('sqrt')+
    Pp('A <b>cube root</b> undoes cubing. The cube root of 8 is 2, because 2 × 2 × 2 = 8. It is written ∛8. The volume of a sphere is V = '+fr(4,3)+'π'+S('r',3)+'. Rearranged for r, this is r = ∛('+fr('3V','4π')+').')+
    H2('When to rearrange first')+
    Pp('If you need the same letter several times, for example the radius of five different pools, rearrange the formula once and then use the new formula each time. That saves solving an equation five times.');
  },
  bind:function(){
    var cur = 0, shown = 1;
    function vals(){ var o = {}; F17[cur].vars.forEach(function(v,i){ o[v[0]] = val('w17x'+i); }); return o; }
    function chk(){ var o = vals(); F17[cur].vars.forEach(function(v,i){ $('#w17x'+i+'-o').textContent = o[v[0]]; }); $('#w17k').innerHTML = shown >= F17[cur].steps.length ? F17[cur].chk(o) : ''; }
    function draw(){
      var f = F17[cur];
      $('#w17f').innerHTML = F17.map(function(g,i){ return '<button class="btn '+(i === cur ? '' : 'plain')+'" data-f="'+i+'">'+g.name+'</button>'; }).join('');
      $('#w17c').textContent = f.ctx;
      $('#w17s').innerHTML = f.steps.slice(0,shown).map(function(s){ return '<li>'+s+'</li>'; }).join('');
      $('#w17n').textContent = shown >= f.steps.length ? 'Show the steps again' : 'Next step';
      $('#w17v').style.display = shown >= f.steps.length ? '' : 'none';
      chk();
    }
    function sliders(){ $('#w17v').innerHTML = '<p class="small muted">Check the rearranged formula with numbers.</p>'+F17[cur].vars.map(function(v,i){ return slider('w17x'+i, v[0], v[1], v[2], v[3], v[4]); }).join(''); }
    $('#w17f').addEventListener('click', function(e){ var b = e.target.closest('[data-f]'); if(!b) return; cur = +b.getAttribute('data-f'); shown = 1; sliders(); draw(); });
    $('#w17n').addEventListener('click', function(){ shown = shown >= F17[cur].steps.length ? 1 : shown+1; draw(); });
    $('#w17v').addEventListener('input', chk);
    sliders(); draw();
  },
  gens:[
    function(){
      if(Math.random() < 0.5){
        var l = rnd(3,12), w = rnd(2,9); if(l === w) return null;
        return makeQ('P = 2l + 2w. Find P when l = '+l+' and w = '+w+'.', N(2*l+2*w), [N(l+w), N(2*l+w), N(2*l*w)],
          'P = 2 × '+l+' + 2 × '+w+' = '+(2*l)+' + '+(2*w)+' = '+(2*l+2*w)+'.');
      }
      var u = rnd(1,9), a = rnd(2,6), t = rnd(2,9);
      return makeQ('v = u + at. Find v when u = '+u+', a = '+a+' and t = '+t+'.', N(u+a*t), [N((u+a)*t), N(u+a+t), N(u*a*t)],
        'Multiply first: '+a+' × '+t+' = '+(a*t)+'. Then add: '+u+' + '+(a*t)+' = '+(u+a*t)+'.');
    },
    function(){
      if(Math.random() < 0.5){
        var u = rnd(1,9), a = rnd(2,6), t = rnd(2,9), v = u+a*t;
        return makeQ('v = u + at. Find t when v = '+v+', u = '+u+' and a = '+a+'.', N(t), [N(v-u), N(v-u-a), N((v-u)*a)],
          'Put the numbers in: '+v+' = '+u+' + '+a+'t. Subtract '+u+' from both sides: '+(v-u)+' = '+a+'t. Divide both sides by '+a+': t = '+t+'.');
      }
      var l = rnd(3,12), w = rnd(2,9), P = 2*l+2*w;
      return makeQ('P = 2l + 2w. Find w when P = '+P+' and l = '+l+'.', N(w), [N(P-2*l), N(P/2), N((P-l)/2)],
        'Put the numbers in: '+P+' = '+(2*l)+' + 2w. Subtract '+(2*l)+' from both sides: '+(P-2*l)+' = 2w. Divide both sides by 2: w = '+w+'.');
    },
    function(){
      var a = rnd(2,9), b = rnd(1,9);
      var T = pick([
        ['v = u + at', 'Subtract u from both sides.', 'v − u = at', ['v = at − u', 'v + u = at', 'v − u = a + t'], 'Subtracting u from the left side gives v − u. Subtracting u from the right side leaves at.'],
        ['s = '+fr('d','t'), 'Multiply both sides by t.', 'st = d', ['s = dt', fr('s','t')+' = d', 'st = '+fr('d','t')], 'Multiplying the left side by t gives st. Multiplying the right side by t cancels the division by t and leaves d.'],
        ['A = π'+S('r',2), 'Divide both sides by π.', fr('A','π')+' = '+S('r',2), ['Aπ = '+S('r',2), 'A − π = '+S('r',2), fr('A','π')+' = r'], 'Dividing the left side by π gives A over π. Dividing the right side by π leaves r squared.'],
        ['y = '+a+'x − '+b, 'Add '+b+' to both sides.', 'y + '+b+' = '+a+'x', ['y − '+b+' = '+a+'x', 'y + '+b+' = '+a+'x + '+b, 'y = '+a+'x + '+b], 'Adding '+b+' to the left side gives y + '+b+'. Adding '+b+' to the right side cancels the − '+b+' and leaves '+a+'x.'],
        ['y = '+a+'x + '+b, 'Subtract '+b+' from both sides.', 'y − '+b+' = '+a+'x', ['y + '+b+' = '+a+'x', 'y − '+b+' = '+a+'x − '+b, 'y = '+a+'x − '+b], 'Subtracting '+b+' from the left side gives y − '+b+'. Subtracting '+b+' from the right side cancels the + '+b+' and leaves '+a+'x.']
      ]);
      return makeQ('Start with '+T[0]+'. '+T[1]+' What does the formula become?', T[2], T[3], T[4]);
    },
    function(){
      var a = rnd(2,9), b = rnd(1,9), s = pick([1,-1]), op = s > 0 ? M : '+', wr = s > 0 ? '+' : M;
      return makeQ('Make x the subject of y = '+polyH([a,s*b])+'.', E('x = '+fr('y '+op+' '+b, a), function(y){ return (y-s*b)/a; }),
        [E('x = '+fr('y '+wr+' '+b, a), function(y){ return (y+s*b)/a; }), E('x = '+fr('y',a)+' '+op+' '+b, function(y){ return y/a-s*b; }), E('x = '+a+'y '+op+' '+b, function(y){ return a*y-s*b; })],
        (s > 0 ? 'Subtract '+b+' from both sides: y − '+b+' = '+a+'x.' : 'Add '+b+' to both sides: y + '+b+' = '+a+'x.')+' Then divide both sides by '+a+'.');
    },
    function(){
      var T = pick([
        ['Make t the subject of s = '+fr('d','t')+'.', 't = '+fr('d','s'), ['t = '+fr('s','d'), 't = sd', 't = d − s'], 'Multiply both sides by t to get st = d. Then divide both sides by s.'],
        ['Make d the subject of s = '+fr('d','t')+'.', 'd = st', ['d = '+fr('s','t'), 'd = '+fr('t','s'), 'd = s + t'], 'd is divided by t, so multiply both sides by t.'],
        ['Make r the subject of C = 2πr.', 'r = '+fr('C','2π'), ['r = 2πC', 'r = C − 2π', 'r = '+fr('2π','C')], 'r is multiplied by 2π, so divide both sides by 2π.'],
        ['Make n the subject of T = np.', 'n = '+fr('T','p'), ['n = Tp', 'n = '+fr('p','T'), 'n = T − p'], 'n is multiplied by p, so divide both sides by p.'],
        ['Make h the subject of V = lwh.', 'h = '+fr('V','lw'), ['h = Vlw', 'h = '+fr('lw','V'), 'h = V − lw'], 'h is multiplied by lw, so divide both sides by lw.']
      ]);
      return makeQ(T[0], T[1], T[2], T[3]);
    },
    function(){
      var T = pick([
        ['Make r the subject of A = π'+S('r',2)+'.', 'r = √('+fr('A','π')+')', ['r = '+fr('A','π'), 'r = '+fr('√A','π'), 'r = ('+fr('A','π')+')<sup>2</sup>'], 'Divide both sides by π. Then take the square root of both sides. The whole of A over π is under the root.'],
        ['Make s the subject of A = '+S('s',2)+'.', 's = √A', ['s = '+fr('A',2), 's = '+S('A',2), 's = 2A'], 'A square root undoes squaring, so take the square root of both sides.'],
        ['Make r the subject of V = π'+S('r',2)+'h.', 'r = √('+fr('V','πh')+')', ['r = '+fr('V','πh'), 'r = √(Vπh)', 'r = '+fr('√V','πh')], 'Divide both sides by πh. Then take the square root of both sides.'],
        ['Make t the subject of d = 5'+S('t',2)+'.', 't = √('+fr('d',5)+')', ['t = '+fr('d',5), 't = √(5d)', 't = '+fr('√d',5)], 'Divide both sides by 5. Then take the square root of both sides.']
      ]);
      return makeQ(T[0], T[1], T[2], T[3]);
    },
    function(){
      if(Math.random() < 0.5){
        var r = rnd(12,40), C = Math.round(2*Math.PI*r); if(Math.round(C/(2*Math.PI)) !== r) return null;
        var m = function(v){ return N(v, v+' m'); };
        return makeQ('A Ferris wheel has a circumference of '+C+' m. Use C = 2πr to find its radius to the nearest metre.', m(r), [m(Math.round(C/Math.PI)), m(Math.round(C/2)), m(Math.round(Math.sqrt(C/Math.PI)))],
          'Rearrange to r = '+fr('C','2π')+'. Then r = '+C+' ÷ (2 × π) = '+(C/(2*Math.PI)).toFixed(2)+', which is '+r+' m to the nearest metre.', {calc:true});
      }
      var r2 = rnd(4,12)/2, A = Math.round(Math.PI*r2*r2*10)/10, back = Math.sqrt(A/Math.PI);
      if(back.toFixed(1) !== r2.toFixed(1)) return null;
      var d = function(v){ return N(Math.round(v*10)/10, v.toFixed(1)+' m'); };
      return makeQ('A round pool has a surface area of '+A.toFixed(1)+' m<sup>2</sup>. Use A = π'+S('r',2)+' to find its radius to one decimal place.', d(r2), [d(A/Math.PI), d(A/(2*Math.PI)), d(Math.sqrt(A))],
        'Rearrange to r = √('+fr('A','π')+'). Then '+A.toFixed(1)+' ÷ π = '+(A/Math.PI).toFixed(3)+', and the square root of that is '+back.toFixed(3)+', which is '+r2.toFixed(1)+' m to one decimal place.', {calc:true});
    }
  ]
};
