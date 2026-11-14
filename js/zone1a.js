"use strict";
/* Zone 1, Front Gate: lessons 1.1 to 1.4 */
function ob(v,e){ var r = {}; r[v] = e; return r; }
function coprimePair(lo,hi){ var p,q; do{ p = rnd(lo,hi); q = rnd(lo,hi); }while(p === q || gcd(p,q) !== 1); return [p,q]; }
var LET = ['x','a','m','p','y','k'];
var X2 = 'x<sup>2</sup>';

/* ================= 1.1 Rounding in repeated calculations ================= */
var EXACT = [[1,4,'0.25'],[1,2,'0.5'],[3,4,'0.75'],[1,5,'0.2'],[2,5,'0.4'],[3,5,'0.6'],[1,8,'0.125'],[3,8,'0.375'],[5,8,'0.625'],[7,8,'0.875'],[3,20,'0.15'],[1,20,'0.05']];
var APPROX = [[1,3,'0.33','0.3333…'],[2,3,'0.67','0.6666…'],[1,6,'0.17','0.1666…'],[5,6,'0.83','0.8333…'],[1,7,'0.14','0.142857…'],[2,7,'0.29','0.285714…'],[1,9,'0.11','0.1111…'],[4,9,'0.44','0.4444…'],[2,9,'0.22','0.2222…'],[1,11,'0.09','0.0909…']];

LESSONS['1.1'] = {id:'1.1', zone:1, title:'Rounding in repeated calculations',
  html:function(){ return ''+
    Pp('Calculators and people both shorten long decimals. This lesson shows what that does to an answer, and why it matters more when a shortened number is used again and again.')+
    H2('A value and an approximation of it')+
    Pp('Some values cannot be written as a decimal that ends. One third is 0.3333… and the 3s never end. The square root of 2 is 1.41421… and its digits never end. The number π is 3.14159… and its digits never end either.')+
    Pp('An <b>approximation</b> is a number that is close to a value but not equal to it. When you write 0.33 in place of '+fr(1,3)+', you are using an approximation of '+fr(1,3)+'.')+
    note('The number 0.33 is exact in its own right. It equals '+fr(33,100)+'. It is an approximation only when it is used in place of '+fr(1,3)+'. So always ask: an approximation of what?')+
    hb('fracdec')+
    H2('Rounding and truncating')+
    Pp('There are two common ways to shorten a decimal. <b>Rounding</b> looks at the next digit. If that digit is 5 or more, the last digit you keep goes up by one. <b>Truncating</b> cuts off the extra digits and changes nothing else.')+
    note('Shorten 2.768 to two decimal places. Rounding: the next digit is 8, so 2.76 becomes 2.77. Truncating: cut after the 6 to get 2.76.')+
    hb('round')+
    H2('The error from one rounded value')+
    Pp('The <b>error</b> is the gap between the answer you get and the correct answer.')+
    Pp('0.33 × 3 = 0.99. The correct answer to '+fr(1,3)+' × 3 is 1, so the error is 0.01.')+
    Pp('1.41 × 1.41 = 1.9881. The correct answer to √2 × √2 is 2, so the error is 0.0119.')+
    H2('A rounded value carried into the next step')+
    Pp('A round pool at the park has a radius of 2.3 m. Its surface area is π × 2.3<sup>2</sup> = 16.619 m<sup>2</sup>. The pool is 1.5 m deep, so its volume is 16.619 × 1.5 = 24.93 m<sup>3</sup>.')+
    Pp('Suppose the area is rounded to 17 m<sup>2</sup> before the second step. The volume comes out as 17 × 1.5 = 25.5 m<sup>3</sup>. That is 0.57 m<sup>3</sup> too much, which is 570 litres of water.')+
    H2('A rounded value used again and again')+
    Pp('A park ticket costs $40 and the price rises by 3.75% every year. To raise a price by 3.75%, multiply it by 1.0375.')+
    hb('pctmult')+
    Pp('Suppose someone rounds 1.0375 to 1.04. After one year the two answers are $41.50 and $41.60, which are 10 cents apart. Each year the rounded multiplier is used again, so the gap grows. Move the slider to see it.')+
    '<div class="card"><h3>The ticket price after each year</h3>'+slider('w11y','Years',1,20,1,10)+'<div id="w11"></div></div>'+
    H2('Round once, at the end')+
    Pp('To keep the error small, use the exact value, or keep all the digits your calculator shows, until the last step. Then round the final answer once.')+
    Pp('On a calculator, the Ans key reuses the full previous answer, so you do not need to type a shortened version of it.');
  },
  bind:function(){
    function u(){
      var y = val('w11y'), a = 40*Math.pow(1.0375,y), b = 40*Math.pow(1.04,y), max = 40*Math.pow(1.04,20);
      $('#w11y-o').textContent = y;
      $('#w11').innerHTML = '<div class="barrow"><span>Multiplier 1.0375</span><i style="width:'+(a/max*100)+'%"></i><b>'+money(a)+'</b></div>'+
        '<div class="barrow two"><span>Multiplier rounded to 1.04</span><i style="width:'+(b/max*100)+'%"></i><b>'+money(b)+'</b></div>'+
        '<p>After '+y+(y === 1 ? ' year' : ' years')+' the two answers are <b>'+money(b-a)+'</b> apart.</p>';
    }
    onInput(['w11y'], u); u();
  },
  gens:[
    function(){
      var ex = pick(EXACT), ap = sample(APPROX,3), o = function(p){ return fr(p[0],p[1])+' and '+p[2]; };
      return makeQ('In which pair is the decimal exactly equal to the fraction?', o(ex), ap.map(o),
        ex[0]+' ÷ '+ex[1]+' = '+ex[2]+' exactly. In each of the other pairs the decimal has been rounded. For example, '+ap[0][0]+' ÷ '+ap[0][1]+' = '+ap[0][3]+' and the digits do not end.');
    },
    function(){
      var dp = pick([1,2]), Nn = rnd(10000,99999), unit = Math.pow(10,4-dp), q = Math.floor(Nn/unit), rem = Nn%unit;
      if(rem === 0 || Nn%10 === 0) return null;
      var up = rem*2 >= unit, r = up ? q+1 : q, f = function(k){ return (k/Math.pow(10,dp)).toFixed(dp); };
      var x = (Nn/10000).toFixed(4), next = Math.floor(rem*10/unit);
      var more = (Math.round(Nn/(unit/10))/Math.pow(10,dp+1)).toFixed(dp+1);
      if(parseFloat(more) === parseFloat(f(r))) return null; // 7.10 would be the same number as 7.1
      return makeQ('Round '+x+' to '+(dp === 1 ? 'one decimal place' : 'two decimal places')+'.', f(r), [f(up ? q : q+1), more, f(up ? q+2 : q-1)],
        'The digit after the '+(dp === 1 ? 'first' : 'second')+' decimal place is '+next+'. '+(up ? 'It is 5 or more, so the digit before it goes up by one.' : 'It is less than 5, so the digit before it stays the same.')+' The answer is '+f(r)+'.');
    },
    function(){
      var k = pick([20,50,200]), Nn = rnd(1100,9899), nm = sample(NAMES,2);
      if(Nn%100 === 50 || Nn%10 === 0) return null;
      if(k === 50 && Nn%2) return null;
      var T = Math.round(Nn/100), early = T*k/10, late = Math.round(Nn*k/100)/10, diff = Math.abs(early-late);
      if(diff < 1e-9) return null;
      var x = (Nn/1000).toFixed(3), exact = Nn*k/1000, t1 = (T/10).toFixed(1);
      return makeQ(nm[0]+' rounds '+x+' to one decimal place and then multiplies by '+k+'. '+nm[1]+' multiplies '+x+' by '+k+' and then rounds to one decimal place. What is the difference between their answers?',
        N(diff), [N(0), N(Math.abs(Nn-T*100)/1000), N(diff*10)],
        nm[0]+': '+x+' rounds to '+t1+', and '+t1+' × '+k+' = '+fmt(early)+'. '+nm[1]+': '+x+' × '+k+' = '+fmt(exact)+(fmt(exact) === fmt(late) ? '' : ', which rounds to '+fmt(late))+'. The difference is '+fmt(diff)+'.', {calc:true});
    },
    function(){
      var f = pick([[1,3,'0.33'],[2,3,'0.67'],[1,6,'0.17'],[5,6,'0.83'],[1,9,'0.11'],[2,9,'0.22'],[4,9,'0.44']]), k = f[1]*100*pick([1,2,3]);
      var approx = Math.round(parseFloat(f[2])*100)*k/100, exact = f[0]*k/f[1];
      var o = function(a,b){ return fmt(a)+', and the correct answer is '+fmt(b); };
      return makeQ(fr(f[0],f[1])+' is rounded to '+f[2]+' and then multiplied by '+k+'. What is the result, and what is the correct answer?',
        o(approx,exact), [o(exact,approx), o(approx,approx), o(exact,exact)],
        f[2]+' × '+k+' = '+fmt(approx)+'. The exact calculation is '+fr(f[0],f[1])+' × '+k+' = '+fmt(exact)+'. The rounded value gives an answer that is '+fmt(Math.abs(exact-approx))+' too '+(approx < exact ? 'small' : 'large')+'.', {calc:true});
    },
    function(){
      var S0 = pick([100,200,400,1000]), m = pick([105,115,125,135]), mr = m+5, nm = pick(NAMES);
      var g1 = S0*(mr-m)/100, g2 = S0*(mr*mr-m*m)/10000;
      var o = function(a,b){ return fmt(a)+' after one step and '+fmt(b)+' after two steps'; };
      return makeQ('A number starts at '+S0+' and is multiplied by '+(m/100)+' at each step. '+nm+' rounds '+(m/100)+' to '+(mr/100)+'. How far is the answer '+nm+' gets from the correct answer after one step, and after two steps?',
        o(g1,g2), [o(g1,g1), o(g1,2*g1), o(g2,g1)],
        'After one step: '+S0+' × '+(m/100)+' = '+fmt(S0*m/100)+' and '+S0+' × '+(mr/100)+' = '+fmt(S0*mr/100)+', a gap of '+fmt(g1)+'. After two steps the answers are '+fmt(S0*m*m/10000)+' and '+fmt(S0*mr*mr/10000)+', a gap of '+fmt(g2)+'. The gap more than doubles because the rounded multiplier is used twice.', {calc:true});
    },
    function(){
      var dp = pick([1,2]), digits = dp+1, Nn = rnd(Math.pow(10,digits), Math.pow(10,digits+1)-1), last = Nn%10;
      if(last < 5) return null;
      var t = Math.floor(Nn/10), r = t+1, f = function(k){ return (k/Math.pow(10,dp)).toFixed(dp); }, x = (Nn/Math.pow(10,digits)).toFixed(digits);
      var o = function(a,b){ return f(a)+' by rounding and '+f(b)+' by truncating'; };
      return makeQ(x+' is shortened to '+(dp === 1 ? 'one decimal place' : 'two decimal places')+'. What does rounding give, and what does truncating give?',
        o(r,t), [o(t,r), o(r,r), o(t,t)],
        'The next digit is '+last+', which is 5 or more, so rounding gives '+f(r)+'. Truncating cuts off the extra digit and gives '+f(t)+'.');
    }
  ]
};

/* ================= 1.2 Exponent laws with algebra ================= */
LESSONS['1.2'] = {id:'1.2', zone:1, title:'Exponent laws with algebra',
  html:function(){ var x = 'x'; return ''+
    Pp('Exponents are a short way to write repeated multiplication. This lesson gives the laws for multiplying and dividing terms that have exponents.')+
    H2('What an exponent means')+
    Pp('In '+S(x,4)+', the letter x is called the <b>base</b> and 4 is called the <b>exponent</b>. The exponent tells you how many times the base is multiplied by itself, so '+S(x,4)+' = x × x × x × x.')+
    Pp('Your teacher may say index or power in place of exponent. All three words mean the same thing here.')+
    hb('expmean')+
    H2('Multiplying powers with the same base')+
    Pp(S(x,3)+' × '+S(x,2)+' = (x × x × x) × (x × x). There are 3 + 2 = 5 factors of x, so the answer is '+S(x,5)+'.')+
    note('To multiply powers with the same base, add the exponents.')+
    '<div class="card"><h3>Powers written out as tiles</h3><div class="row"><button class="btn plain" id="w12op">Change × to ÷</button></div>'+slider('w12m','First exponent',1,6,1,3)+slider('w12n','Second exponent',1,6,1,2)+'<div id="w12"></div></div>'+
    H2('Dividing powers with the same base')+
    Pp(S(x,5)+' ÷ '+S(x,2)+' = '+fr('x × x × x × x × x','x × x')+'. Two factors of x on the top cancel with the two on the bottom. That leaves 5 − 2 = 3 factors, so the answer is '+S(x,3)+'.')+
    note('To divide powers with the same base, subtract the exponents.')+
    hb('explaws')+
    H2('A power of a power')+
    Pp('('+S(x,2)+')<sup>3</sup> = '+S(x,2)+' × '+S(x,2)+' × '+S(x,2)+' = '+S(x,6)+'. There are 3 groups of 2 factors, which is 3 × 2 = 6 factors.')+
    note('To raise a power to another power, multiply the exponents.')+
    Pp('A power outside a bracket applies to every factor inside the bracket. (2x)<sup>3</sup> = 2x × 2x × 2x = 8'+S(x,3)+'.')+
    H2('The exponent 0')+
    Pp(S(x,3)+' ÷ '+S(x,3)+' = 1, because any number divided by itself is 1. The law for dividing gives '+S(x,'3 − 3')+' = '+S(x,0)+'. Both answers are correct, so '+S(x,0)+' = 1. This is true for every value of x except 0.')+
    Pp('In 6'+S(x,0)+' the exponent applies only to x, so 6'+S(x,0)+' = 6 × 1 = 6.')+
    H2('Negative exponents')+
    Pp(S(x,2)+' ÷ '+S(x,4)+' = '+fr('x × x','x × x × x × x')+' = '+fr(1,S(x,2))+'. The law for dividing gives '+S(x,'2 − 4')+' = '+S(x,M+'2')+'. Both answers are correct, so '+S(x,M+'2')+' = '+fr(1,S(x,2))+'.')+
    note('A negative exponent means 1 divided by the power. It does not make the answer a negative number.')+
    H2('Terms with numbers and more than one letter')+
    Pp('Deal with the numbers first, then with each letter on its own.')+
    Pp('3'+S(x,2)+'y × 4'+S(x,3)+'y = 12'+S(x,5)+S('y',2)+'. The numbers give 3 × 4 = 12. The x terms give '+S(x,'2 + 3')+' = '+S(x,5)+'. The y terms give y × y = '+S('y',2)+'.')+
    Pp('12'+S('a',5)+S('b',2)+' ÷ 4'+S('a',2)+'b = 3'+S('a',3)+'b. The numbers give 12 ÷ 4 = 3. The a terms give '+S('a','5 − 2')+' = '+S('a',3)+'. The b terms give '+S('b','2 − 1')+' = b.')+
    hb('multterms');
  },
  bind:function(){
    var div = false;
    function tiles(n,cls,cut){ var s = ''; for(var i = 0; i < n; i++) s += '<span class="tile '+(cls||'')+(i < (cut||0) ? ' cut' : '')+'">x</span>'; return s; }
    function u(){
      var m = val('w12m'), n = val('w12n'), s;
      $('#w12m-o').textContent = m; $('#w12n-o').textContent = n;
      $('#w12op').textContent = div ? 'Change ÷ to ×' : 'Change × to ÷';
      if(!div){
        s = '<p class="rule">'+S('x',m)+' × '+S('x',n)+' = '+S('x',m+n)+'</p><div class="tiles">'+tiles(m)+'<b>×</b>'+tiles(n,'b')+'</div><div class="tiles"><b>=</b>'+tiles(m)+tiles(n,'b')+'</div>'+
          '<p>'+m+' tiles and '+n+' tiles make '+(m+n)+' tiles. Add the exponents: '+m+' + '+n+' = '+(m+n)+'.</p>';
      } else {
        var c = Math.min(m,n), d = m-n, res = d > 0 ? S('x',d) : d === 0 ? '1' : fr(1,S('x',-d));
        s = '<p class="rule">'+S('x',m)+' ÷ '+S('x',n)+' = '+res+'</p><div class="tilefr"><div class="tiles">'+tiles(m,'',c)+'</div><div class="tiles">'+tiles(n,'b',c)+'</div></div>'+
          '<p>'+c+(c === 1 ? ' tile cancels' : ' tiles cancel')+' on the top and on the bottom. '+
          (d > 0 ? d+(d === 1 ? ' tile is' : ' tiles are')+' left on the top. Subtract the exponents: '+m+' − '+n+' = '+d+'.'
           : d === 0 ? 'Nothing is left except 1. Subtracting the exponents gives '+m+' − '+n+' = 0, so '+S('x',0)+' = 1.'
           : (-d)+((-d) === 1 ? ' tile is' : ' tiles are')+' left on the bottom. Subtracting the exponents gives '+m+' − '+n+' = '+M+(-d)+', so '+S('x',M+(-d))+' = '+fr(1,S('x',-d))+'.')+'</p>';
      }
      $('#w12').innerHTML = s;
    }
    $('#w12op').addEventListener('click', function(){ div = !div; u(); });
    onInput(['w12m','w12n'], u); u();
  },
  gens:[
    function(){
      var v = pick(LET), a = rnd(2,6), b = rnd(2,6); if(a === b) return null;
      return makeQ('Simplify '+S(v,a)+' × '+S(v,b)+'.', MO(1,ob(v,a+b)), [MO(1,ob(v,a*b)), MO(2,ob(v,a+b)), MO(1,ob(v,Math.abs(a-b)))],
        'The bases are the same, so add the exponents: '+a+' + '+b+' = '+(a+b)+'. The answer is '+S(v,a+b)+'.');
    },
    function(){
      var v = pick(LET), b = rnd(2,4), a = b+rnd(2,5);
      return makeQ('Simplify '+S(v,a)+' ÷ '+S(v,b)+'.', MO(1,ob(v,a-b)), [MO(1,ob(v,a+b)), MO(1,ob(v,a*b)), MO(1,ob(v,b-a))],
        'The bases are the same, so subtract the exponents: '+a+' − '+b+' = '+(a-b)+'. The answer is '+S(v,a-b)+'.');
    },
    function(){
      var v = pick(LET), ab = pick([[2,3],[3,2],[2,4],[4,2],[3,3]]), a = ab[0], b = ab[1];
      return makeQ('Simplify ('+S(v,a)+')<sup>'+b+'</sup>.', MO(1,ob(v,a*b)), [MO(1,ob(v,a+b)), MO(b,ob(v,a)), MO(1,ob(v,Math.pow(a,b)))],
        'This is a power of a power, so multiply the exponents: '+a+' × '+b+' = '+(a*b)+'. The answer is '+S(v,a*b)+'.');
    },
    function(){
      var v = pick(LET), c1 = rnd(2,6), c2 = rnd(2,6), a = rnd(2,5), b = rnd(2,5);
      if(a*b === a+b || c1*c2 === c1+c2) return null;
      return makeQ('Simplify '+c1+S(v,a)+' × '+c2+S(v,b)+'.', MO(c1*c2,ob(v,a+b)), [MO(c1+c2,ob(v,a+b)), MO(c1*c2,ob(v,a*b)), MO(c1+c2,ob(v,a*b))],
        'Multiply the numbers: '+c1+' × '+c2+' = '+(c1*c2)+'. Add the exponents: '+a+' + '+b+' = '+(a+b)+'. The answer is '+monoH(c1*c2,ob(v,a+b))+'.');
    },
    function(){
      var pr = pick([['a','b'],['x','y'],['m','n'],['p','k']]), u = pr[0], w = pr[1], c1 = rnd(2,6), k = rnd(2,5);
      if(c1 === 2 && k === 2) return null;
      var c = rnd(1,3), a = c+rnd(1,3), d = rnd(1,2), b = d+rnd(1,2), top = {}, bot = {}, res = {}, w1 = {}, w2 = {};
      top[u] = a; top[w] = b; bot[u] = c; bot[w] = d; res[u] = a-c; res[w] = b-d; w1[u] = a+c; w1[w] = b+d; w2[u] = a-c; w2[w] = b;
      return makeQ('Simplify '+monoH(c1*k,top)+' ÷ '+monoH(c1,bot)+'.', MO(k,res), [MO(c1*k-c1,res), MO(k,w1), MO(k,w2)],
        'Divide the numbers: '+(c1*k)+' ÷ '+c1+' = '+k+'. For '+u+', subtract the exponents: '+a+' − '+c+' = '+(a-c)+'. For '+w+': '+b+' − '+d+' = '+(b-d)+'. The answer is '+monoH(k,res)+'.');
    },
    function(){
      var v = pick(LET), c = rnd(2,5), a = rnd(2,4), b = pick([2,3]), cb = Math.pow(c,b);
      if((c === 2 && b === 2) || cb > 125) return null;
      return makeQ('Simplify ('+c+S(v,a)+')<sup>'+b+'</sup>.', MO(cb,ob(v,a*b)), [MO(c,ob(v,a*b)), MO(c*b,ob(v,a*b)), MO(cb,ob(v,a))],
        'The power outside applies to both factors inside the bracket. The number gives '+c+'<sup>'+b+'</sup> = '+cb+'. The letter gives '+a+' × '+b+' = '+(a*b)+' as its exponent. The answer is '+monoH(cb,ob(v,a*b))+'.');
    },
    function(){
      var v = pick(LET), c = rnd(2,9);
      if(Math.random() < 0.5) return makeQ('What is '+c+S(v,0)+'?', N(c), [N(1), N(0), MO(c,ob(v,1))],
        S(v,0)+' = 1, and the exponent applies only to '+v+'. So '+c+S(v,0)+' = '+c+' × 1 = '+c+'.');
      return makeQ('What is ('+c+v+')<sup>0</sup>?', N(1), [N(c), N(0), MO(c,ob(v,1))],
        'The exponent 0 applies to everything inside the bracket. Any number other than 0 raised to the power 0 is 1.');
    },
    function(){
      var v = pick(LET), n = rnd(2,5);
      return makeQ('Write '+S(v,M+n)+' with a positive exponent.', MO(1,ob(v,-n)), [MO(-1,ob(v,n)), MO(-n,ob(v,1)), MO(1,ob(v,n))],
        'A negative exponent means 1 divided by the power, so '+S(v,M+n)+' = '+fr(1,S(v,n))+'. It does not make the answer negative.');
    }
  ]
};

/* ================= 1.3 Taking out a common factor ================= */
LESSONS['1.3'] = {id:'1.3', zone:1, title:'Taking out a common factor',
  html:function(){ return ''+
    Pp('Factorising rewrites an expression as a multiplication. It is used to simplify expressions and, later, to solve equations.')+
    H2('Factorising is expanding in reverse')+
    Pp('A <b>factor</b> is a number or letter that divides exactly into a term. Expanding removes brackets: 3(x + 4) = 3x + 12. Factorising puts them back: 3x + 12 = 3(x + 4).')+
    hb('expand1')+
    H2('A common number')+
    Pp('Look for the largest number that divides into every term. This is called the <b>highest common factor</b>. For 6x + 9 it is 3. Write 3 in front of a bracket and divide each term by 3.')+
    note('6x + 9 = 3(2x + 3)')+
    hb('hcf')+
    '<div class="card"><h3>A rectangle with area 12x + 18</h3><p class="small muted">The height is the factor taken out. The width is what stays in the bracket.</p>'+slider('w13h','Height',0,3,1,1)+'<svg id="w13" class="model" viewBox="0 0 300 170" role="img" aria-label="Rectangle split into two parts"></svg><p id="w13t"></p></div>'+
    H2('A common letter')+
    Pp('Both terms of '+X2+' + 5x contain x, so x can be taken out: '+X2+' + 5x = x(x + 5).')+
    H2('A number and a letter together')+
    Pp('In 6'+X2+' + 9x the largest number that divides into 6 and 9 is 3, and both terms contain x. Take out 3x.')+
    note('6'+X2+' + 9x = 3x(2x + 3)<br>8'+S('a',3)+' + 12'+S('a',2)+' = 4'+S('a',2)+'(2a + 3)')+
    Pp('An expression is <b>fully factorised</b> when nothing more can be taken out of the bracket. 3(2'+X2+' + 3x) is equal to 6'+X2+' + 9x, but it is not fully factorised because x can still be taken out.')+
    hb('multterms')+
    H2('A negative common factor')+
    Pp('When the first term is negative, a negative number can be taken out. Every sign inside the bracket then changes.')+
    note(M+'2x − 6 = '+M+'2(x + 3)')+
    H2('A bracket as the common factor')+
    Pp('In x(x + 2) + 5(x + 2), both parts contain the bracket (x + 2). The whole bracket can be taken out as a common factor.')+
    note('x(x + 2) + 5(x + 2) = (x + 2)(x + 5)')+
    H2('Checking by expanding')+
    Pp('Expand your answer. If you get the expression you started with, the factorising is correct. For example, 3x(2x + 3) = 6'+X2+' + 9x.');
  },
  bind:function(){
    var hs = [1,2,3,6], px = [26,44,62,110];
    function u(){
      var i = val('w13h'), h = hs[i], a = 12/h, b = 18/h, H = px[i], y = 150-H;
      $('#w13h-o').textContent = h;
      $('#w13').innerHTML = '<rect x="46" y="'+y+'" width="150" height="'+H+'" fill="#ffe9a8" stroke="var(--ink)" stroke-width="2"/><rect x="196" y="'+y+'" width="84" height="'+H+'" fill="#bfe9e4" stroke="var(--ink)" stroke-width="2"/>'+
        '<text x="121" y="'+(y+H/2+5)+'" text-anchor="middle" class="mt">12x</text><text x="238" y="'+(y+H/2+5)+'" text-anchor="middle" class="mt">18</text>'+
        '<text x="121" y="'+(y-8)+'" text-anchor="middle" class="ml">'+(a === 1 ? '' : a)+'x</text><text x="238" y="'+(y-8)+'" text-anchor="middle" class="ml">'+b+'</text>'+
        '<text x="34" y="'+(y+H/2+5)+'" text-anchor="end" class="ml">'+h+'</text>';
      var g = gcd(a,b);
      $('#w13t').innerHTML = '<b>12x + 18 = '+prodH(h,0,[[a,b]])+'</b><br>'+(g > 1 ? 'The numbers '+a+' and '+b+' in the bracket can both still be divided by '+g+', so this is not fully factorised.' : 'Nothing more can be taken out of the bracket. This is the fully factorised form.');
    }
    onInput(['w13h'], u); u();
  },
  gens:[
    function(){
      var g = pick([2,3,4,5,6,7]), pq = coprimePair(2,5), p = pq[0], q = pq[1], d = g === 4 ? 2 : g === 6 ? pick([2,3]) : 1;
      return makeQ('What is the highest common factor of '+(g*p)+'x and '+(g*q)+'?', N(g), [N(d), N(g*p), N(g*p*q)],
        (g*p)+' = '+g+' × '+p+' and '+(g*q)+' = '+g+' × '+q+'. The largest number that divides into both is '+g+'.');
    },
    function(){
      var g = rnd(2,7), pq = coprimePair(2,5), p = pq[0], q = pq[1]*pick([1,-1]);
      return makeQ('Factorise '+polyH([g*p,g*q])+'.', PR(g,0,[[p,q]]), [PR(g,0,[[p,g*q]]), PR(g,0,[[g*p,q]]), PR(g*p,0,[[1,q]])],
        'The highest common factor of '+(g*p)+' and '+Math.abs(g*q)+' is '+g+'. Divide each term by '+g+' to get what goes in the bracket: '+prodH(g,0,[[p,q]])+'.', {pv:sig(polyF([g*p,g*q]))});
    },
    function(){
      var g = rnd(2,6), pq = coprimePair(2,5), p = pq[0], q = pq[1];
      return makeQ('Which is the fully factorised form of '+polyH([g*p,g*q,0])+'?', prodH(g,1,[[p,q]]), [g+'('+polyH([p,q,0])+')', 'x('+polyH([g*p,g*q])+')', prodH(g,1,[[p,g*q]])],
        'The highest common factor of the numbers is '+g+' and both terms contain x, so take out '+g+'x. The answer is '+prodH(g,1,[[p,q]])+'. Two of the other options are equal to the expression, but more can still be taken out of their brackets.', {equivOK:true});
    },
    function(){
      var v = pick(['a','x','m','y']), g = rnd(2,6), pq = coprimePair(2,5), p = pq[0], q = pq[1], e = rnd(1,3);
      return makeQ((g*p)+S(v,e+1)+' + '+(g*q)+S(v,e)+' = '+g+S(v,e)+'( ? ). What goes in the bracket?', P([p,q],v), [P([p,g*q],v), P([g*p,q],v), P([q,p],v)],
        'Divide each term by '+g+S(v,e)+'. '+(g*p)+S(v,e+1)+' ÷ '+g+S(v,e)+' = '+p+v+' and '+(g*q)+S(v,e)+' ÷ '+g+S(v,e)+' = '+q+'. The bracket is '+polyH([p,q],v)+'.');
    },
    function(){
      var g = rnd(2,6), pq = coprimePair(2,5), p = pq[0], q = pq[1];
      return makeQ('Factorise '+polyH([-g*p,-g*q])+' with a negative number in front.', PR(-g,0,[[p,q]]), [PR(-g,0,[[p,-q]]), PR(g,0,[[p,q]]), PR(-g,0,[[p,g*q]])],
        'Take out '+M+g+'. Dividing each term by '+M+g+' changes both signs: '+M+(g*p)+'x ÷ '+M+g+' = '+p+'x and '+M+(g*q)+' ÷ '+M+g+' = '+q+'. The answer is '+prodH(-g,0,[[p,q]])+'.', {pv:sig(polyF([-g*p,-g*q]))});
    },
    function(){
      var a = rnd(1,9), b = rnd(1,9)*pick([1,-1]); if(Math.abs(b) === a) return null;
      var br = '('+polyH([1,a])+')';
      return makeQ('Factorise x'+br+' '+(b < 0 ? M : '+')+' '+Math.abs(b)+br+'.', PR(1,0,[[1,a],[1,b]]), [PR(1,0,[[1,a],[1,-b]]), PR(1,0,[[1,a],[1,a]]), PR(1,0,[[1,b],[1,b]])],
        'Both parts contain the bracket '+br+'. Take it out as a common factor. What is left is '+polyH([1,b])+', so the answer is '+prodH(1,0,[[1,a],[1,b]])+'.', {pv:sig(function(x){ return x*(x+a)+b*(x+a); })});
    },
    function(){
      var g = rnd(2,9), pq = coprimePair(2,5), p = pq[0], q = pq[1]*pick([1,-1]);
      return makeQ('Which expression expands to '+polyH([g*p,g*q])+'?', PR(g,0,[[p,q]]), [PR(g,0,[[p,-q]]), PR(g,0,[[p,q+(q > 0 ? 1 : -1)]]), PR(g+1,0,[[p,q]])],
        'Expand each option. '+prodH(g,0,[[p,q]])+' gives '+g+' × '+p+'x = '+(g*p)+'x and '+g+' × '+num(q)+' = '+num(g*q)+', which matches.', {pv:sig(polyF([g*p,g*q]))});
    }
  ]
};

/* ================= 1.4 Expanding two brackets ================= */
function expand2(a,b){
  if(a+b === 0) return null;
  return makeQ('Expand ('+polyH([1,a])+')('+polyH([1,b])+').', P([1,a+b,a*b]), [P([1,a*b,a+b]), P([1,a+b,-a*b]), P([1,0,a*b])],
    'The four products are '+X2+', '+polyH([b,0])+', '+polyH([a,0])+' and '+num(a*b)+'. Collect the like terms: '+polyH([1,a+b,a*b])+'.', {pv:sig(prodF(1,0,[[1,a],[1,b]]))});
}
LESSONS['1.4'] = {id:'1.4', zone:1, title:'Expanding two brackets',
  html:function(){ return ''+
    Pp('Expanding means multiplying out brackets. This lesson covers a product of two brackets, such as (x + 3)(x + 2).')+
    H2('One bracket first')+
    Pp('The number in front multiplies each term inside the bracket: 3(x + 2) = 3x + 6.')+
    hb('expand1')+
    H2('Two brackets as an area')+
    Pp('(x + 3)(x + 2) is the area of a rectangle with sides x + 3 and x + 2. The rectangle has four parts: x × x = '+X2+', x × 2 = 2x, 3 × x = 3x and 3 × 2 = 6.')+
    note('(x + 3)(x + 2) = '+X2+' + 2x + 3x + 6 = '+X2+' + 5x + 6')+
    Pp('2x and 3x are <b>like terms</b> because they have the same letter part. Like terms can be added together.')+
    hb('like')+
    '<div class="card"><h3>The four parts of (x + a)(x + b)</h3>'+slider('w14a','a',-6,6,1,3)+slider('w14b','b',-6,6,1,2)+'<div id="w14"></div></div>'+
    H2('The method without a drawing')+
    Pp('Multiply each term in the first bracket by each term in the second bracket. That gives four products. Then collect the like terms.')+
    Pp('One way to keep track is to take the terms of the first bracket one at a time: (x + 3)(x + 2) = x(x + 2) + 3(x + 2) = '+X2+' + 2x + 3x + 6.')+
    H2('Negative terms')+
    Pp('(x + 4)(x − 1) = '+X2+' − x + 4x − 4 = '+X2+' + 3x − 4.')+
    Pp('(x − 2)(x − 5) = '+X2+' − 5x − 2x + 10 = '+X2+' − 7x + 10. Two negative numbers multiply to give a positive number, so the last term is +10.')+
    hb('neg')+
    H2('Perfect squares')+
    Pp('(x + 3)<sup>2</sup> means (x + 3)(x + 3). Expanding gives '+X2+' + 3x + 3x + 9 = '+X2+' + 6x + 9.')+
    note('A common mistake is to write (x + 3)<sup>2</sup> = '+X2+' + 9. Set both sliders above to 3 to see the two parts that this leaves out.')+
    H2('Difference of two squares')+
    Pp('(x + 3)(x − 3) = '+X2+' − 3x + 3x − 9 = '+X2+' − 9. The two middle terms cancel. The answer is one square minus another square, which is where the name comes from.')+
    H2('A number in front of x')+
    Pp('(2x + 1)(x + 3) = 2'+X2+' + 6x + x + 3 = 2'+X2+' + 7x + 3. The method is the same. Only the products change.');
  },
  bind:function(){
    function cell(c,v){ return '<td class="'+(c < 0 ? 'neg' : '')+'">'+(c === 0 ? '0' : polyH(v === 2 ? [c,0,0] : v === 1 ? [c,0] : [c]))+'</td>'; }
    function u(){
      var a = val('w14a'), b = val('w14b');
      $('#w14a-o').textContent = num(a); $('#w14b-o').textContent = num(b);
      var four = [[1,2],[b,1],[a,1],[a*b,0]].filter(function(t){ return t[0] !== 0; }).map(function(t,i){
        var s = polyH(t[1] === 2 ? [Math.abs(t[0]),0,0] : t[1] === 1 ? [Math.abs(t[0]),0] : [Math.abs(t[0])]);
        return (i ? (t[0] < 0 ? ' '+M+' ' : ' + ') : (t[0] < 0 ? M : ''))+s; }).join('');
      var msg = '';
      if(a !== 0 && a === b) msg = 'The two brackets are the same, so this is a perfect square. The two middle parts are equal.';
      else if(a !== 0 && a === -b) msg = 'The two middle parts are '+polyH([b,0])+' and '+polyH([a,0])+'. They cancel, leaving a difference of two squares.';
      $('#w14').innerHTML = '<table class="grid"><tr><th>×</th><th>x</th><th>'+num(b)+'</th></tr><tr><th>x</th>'+cell(1,2)+cell(b,1)+'</tr><tr><th>'+num(a)+'</th>'+cell(a,1)+cell(a*b,0)+'</tr></table>'+
        '<p class="rule" style="font-size:18px">('+polyH([1,a])+')('+polyH([1,b])+')<br>= '+four+'<br>= '+polyH([1,a+b,a*b])+'</p>'+(msg ? '<p>'+msg+'</p>' : '');
    }
    onInput(['w14a','w14b'], u); u();
  },
  gens:[
    function(){ return expand2(rnd(1,9), rnd(1,9)); },
    function(){ var a = rnd(1,9), b = -rnd(1,9); return Math.random() < 0.5 ? expand2(a,b) : expand2(b,a); },
    function(){ return expand2(-rnd(1,9), -rnd(1,9)); },
    function(){
      var a = rnd(2,9)*pick([1,-1]);
      return makeQ('Expand ('+polyH([1,a])+')<sup>2</sup>.', P([1,2*a,a*a]), [P([1,0,a*a]), P([1,a,a*a]), P([1,2*a,-a*a])],
        '('+polyH([1,a])+')<sup>2</sup> means ('+polyH([1,a])+')('+polyH([1,a])+'). The four products are '+X2+', '+polyH([a,0])+', '+polyH([a,0])+' and '+(a*a)+'. Collect the like terms: '+polyH([1,2*a,a*a])+'.', {pv:sig(prodF(1,0,[[1,a],[1,a]]))});
    },
    function(){
      var a = rnd(3,9);
      return makeQ('Expand ('+polyH([1,a])+')('+polyH([1,-a])+').', P([1,0,-a*a]), [P([1,0,a*a]), P([1,-2*a,a*a]), P([1,0,-2*a])],
        'The four products are '+X2+', '+polyH([-a,0])+', '+polyH([a,0])+' and '+num(-a*a)+'. The two middle terms cancel, leaving '+polyH([1,0,-a*a])+'.', {pv:sig(prodF(1,0,[[1,a],[1,-a]]))});
    },
    function(){
      var c = rnd(2,4), a = rnd(1,5), b = rnd(1,5);
      return makeQ('Expand ('+polyH([c,a])+')('+polyH([1,b])+').', P([c,c*b+a,a*b]), [P([c,a+b,a*b]), P([1,c*b+a,a*b]), P([c,c*a+b,a*b])],
        'The four products are '+polyH([c,0,0])+', '+polyH([c*b,0])+', '+polyH([a,0])+' and '+(a*b)+'. Collect the like terms: '+polyH([c,c*b+a,a*b])+'.', {pv:sig(prodF(1,0,[[c,a],[1,b]]))});
    },
    function(){
      var a = rnd(2,9), b = rnd(2,9);
      return makeQ('('+polyH([1,a])+')(x + ?) = '+polyH([1,a+b,a*b])+'. What is the missing number?', N(b), [N(a+b), N(a*b), N(a)],
        'The last term is the product of the two numbers: '+a+' × ? = '+(a*b)+', so the missing number is '+b+'. The middle term confirms it: '+a+' + '+b+' = '+(a+b)+'.');
    }
  ]
};
