"use strict";
/* Background cards for Zone 1. Each has a short explanation and a practice question with new numbers. */
function frS(n,d){ var g = gcd(n,d); n /= g; d /= g; return N(n/d, d === 1 ? ''+n : fr(n,d)); }

HELP.round = {title:'Rounding decimals', btn:'rounding decimals', zone:1,
  html:'<p>Rounding shortens a number to a chosen number of decimal places.</p>'+
       '<p>Find the last digit you want to keep. Then look at the digit after it. If that digit is 5 or more, the last digit you keep goes up by one. If it is 4 or less, the last digit stays the same.</p>'+
       '<p class="note">Round 3.47 to one decimal place. The digit to keep is 4 and the next digit is 7. Because 7 is 5 or more, the 4 goes up to 5. The answer is 3.5.</p>',
  gen:function(){
    var Nn = rnd(101,989); if(Nn%10 === 0) return null;
    var q = Math.floor(Nn/10), last = Nn%10, up = last >= 5, r = up ? q+1 : q, f = function(k){ return (k/10).toFixed(1); };
    return makeQ('Round '+(Nn/100).toFixed(2)+' to one decimal place.', f(r), [f(up ? q : q+1), (Nn/100).toFixed(2), f(up ? q+2 : q-1)],
      'The digit after the first decimal place is '+last+'. '+(up ? 'It is 5 or more, so round up.' : 'It is less than 5, so the digit before it stays the same.')+' The answer is '+f(r)+'.');
  }};

HELP.fracdec = {title:'Fractions and decimals', btn:'fractions and decimals', zone:1,
  html:'<p>A fraction is a division. To change a fraction to a decimal, divide the top by the bottom.</p>'+
       '<p>'+fr(3,4)+' = 3 ÷ 4 = 0.75. This decimal ends.</p>'+
       '<p>'+fr(1,3)+' = 1 ÷ 3 = 0.3333… This decimal never ends. The same digit repeats for ever.</p>'+
       '<p class="note">When a decimal never ends, any written version of it, such as 0.33, has been shortened. The fraction is the exact value.</p>',
  gen:function(){
    var ex = pick([[1,4,'0.25'],[3,4,'0.75'],[1,5,'0.2'],[2,5,'0.4'],[3,5,'0.6'],[1,8,'0.125'],[3,8,'0.375'],[5,8,'0.625'],[7,8,'0.875'],[3,20,'0.15']]);
    return makeQ('Which decimal is equal to '+fr(ex[0],ex[1])+'?', ex[2], ['0.'+ex[0]+ex[1], ex[0]+'.'+ex[1], fmt(parseFloat(ex[2])*10)],
      'Divide the top by the bottom: '+ex[0]+' ÷ '+ex[1]+' = '+ex[2]+'.');
  }};

HELP.pctmult = {title:'Percentage increase with a multiplier', btn:'percentage increases', zone:1,
  html:'<p>Per cent means out of 100. So 5% is '+fr(5,100)+', which is 0.05.</p>'+
       '<p>To increase an amount by 5%, you keep the whole amount, which is 100% of it, and add 5% more. That makes 105% of the amount, and 105% = 1.05.</p>'+
       '<p class="note">To increase $80 by 5%, multiply by 1.05. $80 × 1.05 = $84.</p>'+
       '<p>The number you multiply by is called the multiplier. For an increase of 3.75% the multiplier is 1.0375.</p>',
  gen:function(){
    var p = pick([2,3,4,6,7,8,9,12,15,25,35]);
    return makeQ('Which multiplier increases an amount by '+p+'%?', N(1+p/100), [N(p/100), N(1+p/10), N(p)],
      'Keep 100% and add '+p+'%. That is '+(100+p)+'%, which is '+fmt(1+p/100)+' as a decimal.');
  }};

HELP.expmean = {title:'What an exponent means', btn:'what an exponent means', zone:1,
  html:'<p>An exponent is a short way to write repeated multiplication.</p>'+
       '<p>5<sup>3</sup> means 5 × 5 × 5, which is 125. The 5 is called the base. The 3 is called the exponent, and it tells you how many 5s are multiplied together.</p>'+
       '<p class="note">5<sup>3</sup> is not 5 × 3. 5 × 3 = 15, but 5<sup>3</sup> = 125.</p>',
  gen:function(){
    var b = rnd(2,9), n = rnd(3,5); if(b === n) return null;
    var out = []; for(var i = 0; i < n; i++) out.push(b);
    return makeQ('Which is the same as '+out.join(' × ')+'?', S(b,n), [S(n,b), b+' × '+n, S(b,n+1)],
      'There are '+n+' factors of '+b+', so the base is '+b+' and the exponent is '+n+'.');
  }};

HELP.explaws = {title:'Exponent laws with numbers', btn:'exponent laws with numbers', zone:1,
  html:'<p>When two powers have the same base, there are shortcuts for multiplying and dividing them.</p>'+
       '<p>2<sup>3</sup> × 2<sup>4</sup> = (2 × 2 × 2) × (2 × 2 × 2 × 2). That is seven 2s multiplied together, so the answer is 2<sup>7</sup>. Add the exponents: 3 + 4 = 7.</p>'+
       '<p>2<sup>5</sup> ÷ 2<sup>2</sup> = '+fr('2 × 2 × 2 × 2 × 2','2 × 2')+'. Two 2s cancel, leaving 2<sup>3</sup>. Subtract the exponents: 5 − 2 = 3.</p>'+
       '<p class="note">The base stays the same. Only the exponents are added or subtracted.</p>',
  gen:function(){
    var b = rnd(2,7), m = rnd(2,6), n = rnd(2,6); if(m === n || m*n === m+n) return null;
    return makeQ('Write '+S(b,m)+' × '+S(b,n)+' as a single power.', S(b,m+n), [S(b,m*n), S(2*b,m+n), S(b*b,m*n)],
      'The bases are the same, so keep the base '+b+' and add the exponents: '+m+' + '+n+' = '+(m+n)+'.');
  }};

HELP.multterms = {title:'Multiplying algebraic terms', btn:'multiplying algebraic terms', zone:1,
  html:'<p>In algebra, 3x means 3 × x. To multiply two terms, multiply the numbers together and multiply the letters together.</p>'+
       '<p class="note">3x × 4x = 3 × 4 × x × x = 12'+S('x',2)+'</p>'+
       '<p>x × x is written '+S('x',2)+'. It is not 2x, because 2x means x + x.</p>',
  gen:function(){
    var a = rnd(2,6), b = rnd(2,6); if(a*b === a+b) return null;
    return makeQ('Simplify '+a+'x × '+b+'x.', MO(a*b,{x:2}), [MO(a+b,{x:2}), MO(a*b,{x:1}), MO(a+b,{x:1})],
      'Multiply the numbers: '+a+' × '+b+' = '+(a*b)+'. Multiply the letters: x × x = '+S('x',2)+'.');
  }};

HELP.hcf = {title:'Factors and highest common factor', btn:'factors and highest common factor', zone:1,
  html:'<p>A factor of a number divides into it exactly. The factors of 12 are 1, 2, 3, 4, 6 and 12.</p>'+
       '<p>Factors come in pairs that multiply to the number. The factor pairs of 12 are 1 and 12, 2 and 6, and 3 and 4.</p>'+
       '<p>The highest common factor of two numbers is the largest number that is a factor of both.</p>'+
       '<p class="note">The factors of 12 are 1, 2, 3, 4, 6, 12. The factors of 18 are 1, 2, 3, 6, 9, 18. The largest number in both lists is 6, so the highest common factor of 12 and 18 is 6.</p>',
  gen:function(){
    var g = pick([2,3,4,5,6,7,8]), pq = coprimePair(2,5), a = g*pq[0], b = g*pq[1], d = g%2 === 0 && g > 2 ? 2 : (g === 3 || g === 5 || g === 7 || g === 2 ? 1 : 3);
    return makeQ('What is the highest common factor of '+a+' and '+b+'?', N(g), [N(d), N(Math.min(a,b)), N(g*pq[0]*pq[1])],
      a+' = '+g+' × '+pq[0]+' and '+b+' = '+g+' × '+pq[1]+'. The largest number that divides into both is '+g+'.');
  }};

HELP.expand1 = {title:'Expanding one bracket', btn:'expanding one bracket', zone:1,
  html:'<p>A number in front of a bracket multiplies every term inside the bracket.</p>'+
       '<p class="note">3(x + 2) = 3 × x + 3 × 2 = 3x + 6</p>'+
       '<p>A common mistake is to multiply only the first term, which gives 3x + 2.</p>'+
       '<p>If the number in front is negative, the sign of each term changes: '+M+'2(x + 5) = '+M+'2x − 10.</p>',
  gen:function(){
    var a = rnd(2,9)*pick([1,1,-1]), b = rnd(1,9)*pick([1,-1]); if(a*b === a+b) return null;
    return makeQ('Expand '+num(a)+'('+polyH([1,b])+').', P([a,a*b]), [P([a,b]), P([1,a*b]), P([a,a+b])],
      'Multiply each term in the bracket by '+num(a)+': '+num(a)+' × x = '+num(a)+'x and '+num(a)+' × '+num(b)+' = '+num(a*b)+'.', {pv:sig(function(x){ return a*(x+b); })});
  }};

HELP.like = {title:'Collecting like terms', btn:'collecting like terms', zone:1,
  html:'<p>Like terms have exactly the same letter part. 2x and 5x are like terms. 2x and 5 are not, and neither are 2x and 5'+S('x',2)+'.</p>'+
       '<p>Like terms can be added or subtracted by adding or subtracting the numbers in front.</p>'+
       '<p class="note">2x + 5x = 7x<br>2x + 5 + 4x = 6x + 5<br>2x + 5 cannot be made any simpler.</p>',
  gen:function(){
    var a = rnd(2,9), b = rnd(2,9), c = rnd(1,9);
    return makeQ('Simplify '+a+'x + '+c+' + '+b+'x.', P([a+b,c]), [E((a+b+c)+'x', function(x){ return (a+b+c)*x; }), P([a*b,c]), E((a+b)+S('x',2)+' + '+c, function(x){ return (a+b)*x*x+c; })],
      a+'x and '+b+'x are like terms, so add them: '+(a+b)+'x. The number '+c+' has no x, so it stays separate.', {pv:sig(function(x){ return a*x+c+b*x; })});
  }};

HELP.neg = {title:'Negative numbers', btn:'negative numbers', zone:1,
  html:'<p><b>Adding and subtracting.</b> Think of a number line. Adding a negative number moves left: 4 + '+M+'3 = 1. Subtracting a larger number takes you below zero: 3 − 8 = '+M+'5.</p>'+
       '<p><b>Multiplying.</b> When the two signs are the same, the answer is positive. When the two signs are different, the answer is negative.</p>'+
       '<p class="note">3 × 4 = 12<br>'+M+'3 × '+M+'4 = 12<br>3 × '+M+'4 = '+M+'12<br>'+M+'3 × 4 = '+M+'12</p>',
  gen:function(){
    var a = rnd(2,9), b = rnd(2,9), t = rnd(1,3); if(a === b) return null;
    if(t === 1) return makeQ('What is '+M+a+' × '+M+b+'?', N(a*b), [N(-a*b), N(-(a+b)), N(a+b)], 'The two signs are the same, so the answer is positive: '+a+' × '+b+' = '+(a*b)+'.');
    if(t === 2) return makeQ('What is '+M+a+' + '+M+b+'?', N(-(a+b)), [N(a+b), N(a*b), N(Math.abs(a-b))], 'Start at '+M+a+' and move '+b+' further left. That reaches '+M+(a+b)+'.');
    var lo = Math.min(a,b), hi = Math.max(a,b);
    return makeQ('What is '+lo+' − '+hi+'?', N(lo-hi), [N(hi-lo), N(-(lo+hi)), N(lo+hi)], 'Start at '+lo+' and move '+hi+' to the left. That passes zero and reaches '+M+(hi-lo)+'.');
  }};

HELP.equiv = {title:'Equivalent fractions and simplifying', btn:'simplifying fractions', zone:1,
  html:'<p>Two fractions are equivalent when they have the same value. '+fr(1,2)+', '+fr(2,4)+' and '+fr(6,12)+' are all equivalent.</p>'+
       '<p>Multiplying or dividing the top and the bottom by the same number gives an equivalent fraction.</p>'+
       '<p>To simplify a fraction, divide the top and the bottom by their highest common factor.</p>'+
       '<p class="note">'+fr(12,18)+': both 12 and 18 divide by 6, so '+fr(12,18)+' = '+fr(2,3)+'.</p>',
  gen:function(){
    var g = rnd(2,6), pq = coprimePair(1,7), p = Math.min(pq[0],pq[1]), q = Math.max(pq[0],pq[1]);
    var f = function(n,d){ return N(n/d, fr(n,d)); };
    return makeQ('Simplify '+fr(g*p,g*q)+'.', f(p,q), [f(p,g*q), f(g*p,q), f(q,p)],
      'Divide the top and the bottom by '+g+': '+(g*p)+' ÷ '+g+' = '+p+' and '+(g*q)+' ÷ '+g+' = '+q+'.');
  }};

HELP.addfrac = {title:'Adding and subtracting fractions', btn:'adding fractions', zone:1,
  html:'<p>Fractions can be added or subtracted only when they have the same denominator, which is the bottom number.</p>'+
       '<p>If the denominators are different, change both fractions to equivalent fractions with a common denominator. Then add or subtract the tops.</p>'+
       '<p class="note">'+fr(1,2)+' + '+fr(1,3)+' = '+fr(3,6)+' + '+fr(2,6)+' = '+fr(5,6)+'</p>'+
       '<p>A common mistake is to add the tops and add the bottoms, which gives '+fr(2,5)+'. That is less than '+fr(1,2)+', so it cannot be right.</p>',
  gen:function(){
    var a = rnd(2,6), b = rnd(2,6); if(a === b) return null;
    var L = lcm(a,b), f = function(n,d){ return N(n/d, fr(n,d)); };
    return makeQ('What is '+fr(1,a)+' + '+fr(1,b)+'?', frS(L/a+L/b, L), [f(2,a+b), f(1,a+b), f(2,a*b)],
      'The common denominator is '+L+'. '+fr(1,a)+' = '+fr(L/a,L)+' and '+fr(1,b)+' = '+fr(L/b,L)+'. Add the tops: '+fr(L/a+L/b,L)+(gcd(L/a+L/b,L) > 1 ? ', which simplifies to '+frS(L/a+L/b,L).h : '')+'.');
  }};

HELP.mulfrac = {title:'Multiplying and dividing fractions', btn:'multiplying and dividing fractions', zone:1,
  html:'<p><b>Multiplying.</b> Multiply the tops together and multiply the bottoms together. Then simplify.</p>'+
       '<p class="note">'+fr(2,3)+' × '+fr(4,5)+' = '+fr(8,15)+'</p>'+
       '<p><b>Dividing.</b> Turn the second fraction upside down, then multiply.</p>'+
       '<p class="note">'+fr(2,3)+' ÷ '+fr(4,5)+' = '+fr(2,3)+' × '+fr(5,4)+' = '+fr(10,12)+' = '+fr(5,6)+'</p>',
  gen:function(){
    var a = rnd(1,5), b = rnd(2,7), c = rnd(1,5), d = rnd(2,7), f = function(n,dd){ return N(n/dd, fr(n,dd)); };
    if(gcd(a,b) !== 1 || gcd(c,d) !== 1 || a === b || c === d) return null;
    if(Math.random() < 0.5) return makeQ('What is '+fr(a,b)+' × '+fr(c,d)+'?', frS(a*c,b*d), [f(a+c,b+d), frS(a*d,b*c), f(a*c,b+d)],
      'Multiply the tops: '+a+' × '+c+' = '+(a*c)+'. Multiply the bottoms: '+b+' × '+d+' = '+(b*d)+'. That gives '+fr(a*c,b*d)+(gcd(a*c,b*d) > 1 ? ', which simplifies to '+frS(a*c,b*d).h : '')+'.');
    return makeQ('What is '+fr(a,b)+' ÷ '+fr(c,d)+'?', frS(a*d,b*c), [frS(a*c,b*d), frS(b*c,a*d), f(a+d,b+c)],
      'Turn the second fraction upside down and multiply: '+fr(a,b)+' × '+fr(d,c)+' = '+fr(a*d,b*c)+(gcd(a*d,b*c) > 1 ? ', which simplifies to '+frS(a*d,b*c).h : '')+'.');
  }};

HELP.solve = {title:'Solving simple equations', btn:'solving simple equations', zone:1,
  html:'<p>Solving an equation means finding the value of the letter that makes it true.</p>'+
       '<p>Undo each operation by doing the opposite, and do the same thing to both sides. Adding undoes subtracting. Dividing undoes multiplying.</p>'+
       '<p class="note">Solve 3x + 4 = 19. Subtract 4 from both sides: 3x = 15. Divide both sides by 3: x = 5. Check: 3 × 5 + 4 = 19.</p>',
  gen:function(){
    var a = rnd(2,9), x = rnd(2,9), b = rnd(1,12), s = pick([1,-1]), c = a*x+s*b;
    return makeQ('Solve '+polyH([a,s*b])+' = '+num(c)+'.', N(x, 'x = '+x), [N(c-s*b, 'x = '+num(c-s*b)), N((c+s*b)/a, 'x = '+fmt((c+s*b)/a)), N(a*(c-s*b), 'x = '+num(a*(c-s*b)))],
      (s > 0 ? 'Subtract '+b+' from' : 'Add '+b+' to')+' both sides: '+a+'x = '+(a*x)+'. Divide both sides by '+a+': x = '+x+'.');
  }};

HELP.sqrt = {title:'Squares and square roots', btn:'squares and square roots', zone:1,
  html:'<p>Squaring a number means multiplying it by itself. 7<sup>2</sup> = 7 × 7 = 49.</p>'+
       '<p>A square root undoes squaring. The square root of 49 is 7, because 7 × 7 = 49. It is written √49.</p>'+
       '<p class="note">√49 = 7<br>√100 = 10<br>√2 is not a whole number. It is 1.41421… and its digits never end.</p>',
  gen:function(){
    var n = rnd(4,12);
    if(Math.random() < 0.5) return makeQ('What is √'+(n*n)+'?', N(n), [N(n*n/2), N(n*n*2), N(n+1)],
      n+' × '+n+' = '+(n*n)+', so the square root of '+(n*n)+' is '+n+'. Halving is a common mistake.');
    return makeQ('What is '+n+'<sup>2</sup>?', N(n*n), [N(2*n), N(n+2), N(n*n+n)],
      n+'<sup>2</sup> means '+n+' × '+n+', which is '+(n*n)+'. It does not mean '+n+' × 2.');
  }};
