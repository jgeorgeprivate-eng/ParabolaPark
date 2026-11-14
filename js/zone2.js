"use strict";
/* Zone 2, The Midway: equations */
var Q = makeQ;
var SYM = ['>','≥','<','≤'], FLIP = {'>':'<','<':'>','≥':'≤','≤':'≥'};
function xyH(a,b){ return (a === 1 ? '' : a === -1 ? M : num(a))+'x'+(b < 0 ? ' '+M+' ' : ' + ')+(Math.abs(b) === 1 ? '' : Math.abs(b))+'y'; }
function sol2(a,b){ return 'x = '+num(a)+' or x = '+num(b); }
function r2(v){ return Math.round(v*100)/100; }
function nz(a,b){ return ri(a,b,[0]); }

/* ---------- 2.1 Linear equations ---------- */
LSN('2.1','Linear equations',{
  w:balance('w21','Find the value of x that balances the equation','3x + 2 = x + 10', x => 3*x+2, x => x+10, -5, 10, 1, 0),
  body:w => Pp('An equation says that two things are equal. Solving it means finding the value of the letter that makes it true.')+
    sec('Two-step equations','Undo the operations one at a time, and do the same thing to both sides each time.','!3x + 4 = 19. Subtract 4 from both sides: 3x = 15. Divide both sides by 3: x = 5.',hb('solve'))+
    sec('Equations with brackets','Divide both sides by the number in front of the bracket, or expand the bracket first.','!4(x + 3) = 20. Divide both sides by 4: x + 3 = 5. Subtract 3 from both sides: x = 2.',hb('expand1'))+
    sec('The unknown on both sides','Collect the x terms on one side first.','!3x + 2 = x + 10. Subtract x from both sides: 2x + 2 = 10. Subtract 2 from both sides: 2x = 8. Divide both sides by 2: x = 4.',w)+
    sec('An equation with a division','!'+fr('x',5)+' − 2 = 4. Add 2 to both sides: '+fr('x',5)+' = 6. Multiply both sides by 5: x = 30.')+
    sec('Writing an equation from words','Choose a letter for the unknown number, then write what the words say.','!Entry to a fair costs $12 and each ride costs $4. Mia spends $40. If n is the number of rides, then 4n + 12 = 40. Subtract 12 from both sides: 4n = 28. Divide both sides by 4: n = 7 rides.')+
    sec('Checking','Put your answer back into the original equation. Both sides should give the same number. For x = 4 in 3x + 2 = x + 10: the left side is 3 × 4 + 2 = 14 and the right side is 4 + 10 = 14.'),
  help:['solve','expand1','like','solve','solve','mulfrac'],
  gens:[
    () => { var a = rnd(2,9), x = nz(-9,9), b = nz(-12,12), c = a*x+b;
      return Q('Solve '+polyH([a,b])+' = '+num(c)+'.', Nx(x), [Nx(c-b), Nx(r2((c+b)/a)), Nx(-x)],
        (b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: '+a+'x = '+num(a*x)+'. Divide both sides by '+a+': x = '+num(x)+'.'); },
    () => { var a = rnd(2,9), x = nz(-9,9), b = nz(-9,9), c = a*(x+b);
      return Q('Solve '+a+'('+polyH([1,b])+') = '+num(c)+'.', Nx(x), [Nx(c/a+b), Nx(r2((c-b)/a)), Nx(c-a-b)],
        'Divide both sides by '+a+': '+polyH([1,b])+' = '+num(c/a)+'. '+(b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: x = '+num(x)+'.'); },
    () => { var a = rnd(3,9), c = rnd(1,a-1), x = nz(-8,8), b = nz(-9,9), d = (a-c)*x+b;
      return Q('Solve '+polyH([a,b])+' = '+polyH([c,d])+'.', Nx(x), [Nx(r2((d-b)/(a+c))), Nx(r2((d+b)/(a-c))), Nx(d-b)],
        'Subtract '+polyH([c,0])+' from both sides: '+polyH([a-c,b])+' = '+num(d)+'. '+(b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: '+polyH([a-c,0])+' = '+num(d-b)+'. Divide both sides by '+(a-c)+': x = '+num(x)+'.'); },
    () => { var E = rnd(8,20), r = rnd(3,6), n = rnd(3,9), T = r*n+E, nm = pick(NAMES);
      return Q(nm+' pays $'+E+' to enter a fair and $'+r+' for each ride, and spends $'+T+' in total. Which equation gives the number of rides, n?', r+'n + '+E+' = '+T, [E+'n + '+r+' = '+T, r+'n − '+E+' = '+T, '('+r+' + '+E+')n = '+T],
        'Each ride costs $'+r+', so n rides cost '+r+'n. Add the entry fee of $'+E+'. The total is $'+T+', so '+r+'n + '+E+' = '+T+'.'); },
    () => { var E = rnd(8,20), r = rnd(3,6), n = rnd(3,9), T = r*n+E, nm = pick(NAMES);
      return Q(nm+' pays $'+E+' to enter a fair and $'+r+' for each ride, and spends $'+T+' in total. How many rides does '+nm+' go on?', N(n), [N(T-E), N(r2(T/r)), N(r2((T+E)/r))],
        'The equation is '+r+'n + '+E+' = '+T+'. Subtract '+E+' from both sides: '+r+'n = '+(T-E)+'. Divide both sides by '+r+': n = '+n+'.'); },
    () => { var a = rnd(2,9), b = nz(-9,9), k = nz(-6,9), c = k+b;
      return Q('Solve '+fr('x',a)+pm(b)+' = '+num(c)+'.', Nx(a*k), [Nx(a*c-b), Nx(r2((c-b)/a)), Nx(a*(c+b))],
        (b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: '+fr('x',a)+' = '+num(k)+'. Multiply both sides by '+a+': x = '+num(a*k)+'.'); }
  ]});

/* ---------- 2.2 Equations with fractions ---------- */
LSN('2.2','Equations with fractions',{
  w:balance('w22','Find the value of x that balances the equation',fr('x',2)+' + '+fr('x',3)+' = 10', x => x/2+x/3, x => 10, 0, 24, 1, 6),
  body:w => Pp('Some equations have the unknown inside a fraction. The method is to remove the fractions first and then solve as usual.')+
    sec('One fraction','A fraction is a division, and multiplying undoes dividing. Multiply both sides by the denominator.','!'+fr('x + 2',3)+' = 5. Multiply both sides by 3: x + 2 = 15. Subtract 2 from both sides: x = 13.',hb('mulfrac'))+
    sec('A fraction and a number','Move the number first, then remove the fraction.','!'+fr('x',4)+' + 3 = 7. Subtract 3 from both sides: '+fr('x',4)+' = 4. Multiply both sides by 4: x = 16.')+
    sec('Two fractions','Multiply every term by a common denominator. That removes both fractions in one step.','!'+fr('x',2)+' + '+fr('x',3)+' = 10. The common denominator is 6. Multiply every term by 6: 3x + 2x = 60. So 5x = 60 and x = 12.',w,hb('addfrac'))+
    sec('A fraction on each side','!'+fr('x + 1',2)+' = '+fr('x + 7',4)+'. Multiply both sides by 4: 2(x + 1) = x + 7. Expand: 2x + 2 = x + 7. Subtract x and then 2 from both sides: x = 5.','Each top is multiplied as a whole, so keep it in a bracket until you expand.')+
    sec('Checking by substitution','Put the answer into the original equation. For x = 12: '+fr(12,2)+' + '+fr(12,3)+' = 6 + 4 = 10, which matches.'),
  help:['mulfrac','mulfrac','solve','addfrac','expand1','subst'],
  gens:[
    () => { var a = rnd(2,9), b = nz(-9,9);
      return Q('Solve '+fr('x',a)+' = '+num(b)+'.', Nx(a*b), [Nx(r2(b/a)), Nx(a+b), Nx(b-a)], 'x is divided by '+a+', so multiply both sides by '+a+': x = '+num(a*b)+'.'); },
    () => { var a = rnd(2,6), k = rnd(2,9), p = nz(-9,9), x = a*k-p;
      return Q('Solve '+fr(polyH([1,p]),a)+' = '+k+'.', Nx(x), [Nx(a*k+p), Nx(k-p), Nx(a*(k-p))],
        'Multiply both sides by '+a+': '+polyH([1,p])+' = '+(a*k)+'. '+(p > 0 ? 'Subtract '+p+' from' : 'Add '+(-p)+' to')+' both sides: x = '+num(x)+'.'); },
    () => { var a = rnd(2,6), p = nz(-9,9), k = nz(-5,9), b = k+p;
      return Q('Solve '+fr('x',a)+pm(p)+' = '+num(b)+'.', Nx(a*k), [Nx(a*b-p), Nx(r2((b-p)/a)), Nx(a*(b+p))],
        (p > 0 ? 'Subtract '+p+' from' : 'Add '+(-p)+' to')+' both sides: '+fr('x',a)+' = '+num(k)+'. Multiply both sides by '+a+': x = '+num(a*k)+'.'); },
    () => { var ab = pick([[2,3],[2,5],[3,4],[2,4],[3,6],[4,6]]), a = ab[0], b = ab[1], L = lcm(a,b), x = L*rnd(1,4), c = x/a+x/b;
      return Q('Solve '+fr('x',a)+' + '+fr('x',b)+' = '+c+'.', Nx(x), [Nx(c*(a+b)), Nx(c*L), Nx(r2(c/2))],
        'Multiply every term by '+L+': '+(L/a)+'x + '+(L/b)+'x = '+(c*L)+'. So '+(L/a+L/b)+'x = '+(c*L)+' and x = '+x+'.'); },
    () => { var a = rnd(2,5), b = ri(2,5,[a]), k = rnd(1,6), p = nz(-6,6), x = a*k-p, q = b*k-x;
      if(q === 0 || q === p || x === 0) return null;
      return Q('Solve '+fr(polyH([1,p]),a)+' = '+fr(polyH([1,q]),b)+'.', Nx(x), [Nx(-x), Nx(x+a), Nx(b*k)],
        'Multiply both sides by '+(a*b)+': '+b+'('+polyH([1,p])+') = '+a+'('+polyH([1,q])+'). Expand: '+polyH([b,b*p])+' = '+polyH([a,a*q])+'. Collect the x terms and solve: x = '+num(x)+'.'); },
    () => { var X = pick([12,18,20,24,30]), ds = [2,3,4,5,6].filter(d => X%d === 0), eq = i => { var a = pick(ds), p = rnd(1,9); return {h:fr('x',a)+' + '+p+' = '+(X/a+p+(i ? pick([-2,-1,1,2]) : 0)), a:a, p:p}; };
      var c = eq(0);
      return Q('Which equation has the solution x = '+X+'?', c.h, [eq(1).h, eq(2).h, eq(3).h],
        'Put x = '+X+' into each equation. Only one is true: '+fr(X,c.a)+' + '+c.p+' = '+(X/c.a)+' + '+c.p+' = '+(X/c.a+c.p)+'.'); }
  ]});

/* ---------- 2.3 Inequalities on a number line ---------- */
var SYMW = {'>':'greater than','≥':'greater than or equal to','<':'less than','≤':'less than or equal to'};
LSN('2.3','Inequalities on a number line',{
  w:sliderW('w23','An inequality on a number line',[['a','Boundary',-5,5,1,2],['s','Symbol',0,3,1,0,t => SYM[t]]], v => { var s = SYM[v.s], inc = s === '≥' || s === '≤';
    return '<p class="rule">x '+s+' '+num(v.a)+'</p>'+numLine(-6,6,v.a,(s === '>' || s === '≥') ? 1 : -1,inc)+
      '<p>x can be any number '+SYMW[s]+' '+num(v.a)+'. The circle is '+(inc ? 'filled because '+num(v.a)+' is included.' : 'open because '+num(v.a)+' itself is not included.')+'</p>'; }),
  body:w => Pp('An inequality says that one thing is bigger or smaller than another. Its solution is a range of numbers.')+
    sec('The four symbols','x > 3 means x is greater than 3. x < 3 means x is less than 3. x ≥ 3 means x is greater than or equal to 3. x ≤ 3 means x is less than or equal to 3.',hb('ineq'))+
    sec('Showing the solution on a number line','Draw a circle at the boundary number and a line over all the numbers that work. Use an open circle when the boundary is not included, which is the case for > and <. Use a filled circle when it is included, which is the case for ≥ and ≤.',w)+
    sec('Solving an inequality','Solve it the way you solve an equation. Undo the operations and do the same thing to both sides.','!2x + 3 < 11. Subtract 3 from both sides: 2x < 8. Divide both sides by 2: x < 4.')+
    sec('Multiplying or dividing by a negative number','There is one difference from equations. When you multiply or divide both sides by a negative number, the inequality sign reverses.','!'+M+'2x < 6. Divide both sides by '+M+'2 and reverse the sign: x > '+M+'3.','To see why, test two numbers. x = 0 is greater than '+M+'3, and '+M+'2 × 0 = 0, which is less than 6, so x = 0 works. x = '+M+'5 is less than '+M+'3, and '+M+'2 × '+M+'5 = 10, which is more than 6, so x = '+M+'5 does not work.',hb('neg'))+
    sec('Inequalities from words','At least 120 means 120 or more, so h ≥ 120. At most 8 means 8 or fewer, so n ≤ 8. More than 5 means x > 5. Fewer than 5 means x < 5.'),
  help:['solve','neg','ineq','subst','ineq','solve'],
  gens:[
    () => { var a = rnd(2,6), v = nz(-5,8), b = nz(-9,9), s = pick(SYM), c = a*v+b;
      return Q('Solve '+polyH([a,b])+' '+s+' '+num(c)+'.', 'x '+s+' '+num(v), ['x '+FLIP[s]+' '+num(v), 'x '+s+' '+num(c-b), 'x '+FLIP[s]+' '+num(c-b)],
        (b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: '+a+'x '+s+' '+num(c-b)+'. Divide both sides by '+a+': x '+s+' '+num(v)+'. Dividing by a positive number does not change the sign.'); },
    () => { var a = rnd(2,6), v = nz(-5,8), b = nz(-9,9), s = pick(SYM), c = -a*v+b;
      return Q('Solve '+polyH([-a,b])+' '+s+' '+num(c)+'.', 'x '+FLIP[s]+' '+num(v), ['x '+s+' '+num(v), 'x '+FLIP[s]+' '+num(-v), 'x '+s+' '+num(-v)],
        (b > 0 ? 'Subtract '+b+' from' : 'Add '+(-b)+' to')+' both sides: '+M+a+'x '+s+' '+num(c-b)+'. Divide both sides by '+M+a+' and reverse the sign: x '+FLIP[s]+' '+num(v)+'.'); },
    () => { var at = rnd(-4,4), s = pick(SYM);
      return Q('Which inequality is shown on the number line?'+numLine(-6,6,at,(s === '>' || s === '≥') ? 1 : -1,s === '≥' || s === '≤'), 'x '+s+' '+num(at), SYM.filter(t => t !== s).map(t => 'x '+t+' '+num(at)),
        'The line covers the numbers '+(s === '>' || s === '≥' ? 'greater' : 'less')+' than '+num(at)+'. The circle is '+(s === '≥' || s === '≤' ? 'filled, so '+num(at)+' is included.' : 'open, so '+num(at)+' is not included.')); },
    () => { var a = rnd(2,5), b = rnd(1,9), v = rnd(2,9), s = pick(['>','<']), c = a*v+b, d = rnd(1,3), ok = s === '>' ? v+d : v-d, w = s === '>' ? [v, v-1, v-3] : [v, v+1, v+3];
      return Q('Which value of x makes '+polyH([a,b])+' '+s+' '+c+' true?', N(ok), w.map(t => N(t)),
        'With x = '+ok+': '+a+' × '+ok+' + '+b+' = '+(a*ok+b)+', which is '+(s === '>' ? 'greater' : 'less')+' than '+c+'. With x = '+v+' the left side equals '+c+', which is not '+(s === '>' ? 'greater' : 'less')+' than '+c+'.'); },
    () => { var n = rnd(5,150), T = pick([
        ['A ride is open to people who are at least '+n+' cm tall. Which inequality describes the height h of a person who can go on?','h','≥'],
        ['A boat carries at most '+n+' people. Which inequality describes the number of people n on the boat?','n','≤'],
        ['A discount applies to orders of more than $'+n+'. Which inequality describes the value v of an order that gets the discount?','v','>'],
        ['A child ticket is for people younger than '+n+' years. Which inequality describes the age a of a person who can use one?','a','<']]);
      return Q(T[0], T[1]+' '+T[2]+' '+n, SYM.filter(t => t !== T[2]).map(t => T[1]+' '+t+' '+n), 'The words mean '+SYMW[T[2]]+' '+n+', which is written '+T[1]+' '+T[2]+' '+n+'.'); },
    () => { var a = rnd(2,5), b = rnd(1,9), v = rnd(2,9), s = pick(['<','≤']), c = a*v+b, ans = s === '<' ? v-1 : v;
      return Q('x is a whole number and '+polyH([a,b])+' '+s+' '+c+'. What is the largest possible value of x?', N(ans), [N(s === '<' ? v : v-1), N(v+1), N(c-b)],
        'Solving gives x '+s+' '+v+'. '+(s === '<' ? v+' itself is not included, so the largest whole number is '+(v-1)+'.' : v+' is included, so the largest whole number is '+v+'.')); }
  ]});

/* ---------- 2.4 Simultaneous equations on a graph ---------- */
function twoLines(){ var m1 = pick([-2,-1,1,2,3]), m2 = ri(-2,3,[0,m1]), x0 = nz(-3,3), y0 = ri(-4,4,[0,x0,-x0]); return {m1:m1, m2:m2, x0:x0, y0:y0, c1:y0-m1*x0, c2:y0-m2*x0}; }
LSN('2.4','Simultaneous equations on a graph',{
  w:sliderW('w24','Two lines and the point where they cross',[['m','Gradient of the red line',-3,3,0.5,1],['c','Where the red line cuts the y-axis',-4,8,1,0]], v => {
    var par = v.m === -1, x = par ? 0 : (6-v.c)/(v.m+1), y = -x+6, on = !par && Math.abs(x) <= 6 && y >= -2 && y <= 10;
    return '<p class="rule" style="font-size:18px">'+lineH(v.m,v.c)+' and y = '+M+'x + 6</p>'+plotSVG({x0:-6,x1:6,y0:-2,y1:10,xl:'x',yl:'y',fns:[{f:t => v.m*t+v.c},{f:t => -t+6,c:'cv2'}],pts:on ? [[x,y,pt(r2(x),r2(y)),'tp']] : []})+
      '<p>'+(par ? (v.c === 6 ? 'The two rules are the same line, so every point on it is a solution.' : 'The lines have the same gradient, so they are parallel and never cross. There is no solution.') : 'The lines cross at '+pt(r2(x),r2(y))+'. That point fits both rules, so it is the solution.'+(on ? '' : ' It is outside this window.'))+'</p>'; }),
  body:w => Pp('Simultaneous equations are two equations that must both be true at the same time. This lesson solves them with a graph.')+
    sec('A solution fits both equations','Take y = x + 1 and y = '+M+'x + 5. The values x = 2 and y = 3 fit both: 2 + 1 = 3 and '+M+'2 + 5 = 3. The solution is written as the point (2, 3).')+
    sec('Solving with a graph','Each equation is a straight line. Every point on a line fits that equation. The point where the two lines cross is on both lines, so it fits both equations. That point is the solution.',w,hb('linegraph'))+
    sec('Lines that never cross','Two lines with the same gradient are parallel. Parallel lines never cross, so the equations have no solution. y = 2x + 1 and y = 2x − 3 are an example.')+
    sec('A break-even problem','Stall A charges $6 to enter and $2 a game, so the cost is y = 2x + 6. Stall B charges $4 a game with no entry fee, so the cost is y = 4x. The lines cross at (3, 12). For 3 games, both stalls cost $12. For fewer than 3 games stall B is cheaper, and for more than 3 games stall A is cheaper.')+
    sec('Checking','Put the x and y values into both equations. Both must be true.'),
  help:['plot','subst','linegraph','solve','solve','subst'],
  gens:[
    () => { var L = twoLines();
      return Q('The graphs of '+lineH(L.m1,L.c1)+' and '+lineH(L.m2,L.c2)+' are shown. What is the solution of the two equations?'+plotSVG({x0:-6,x1:6,y0:-6,y1:6,xl:'x',yl:'y',fns:[{f:x => L.m1*x+L.c1},{f:x => L.m2*x+L.c2,c:'cv2'}]}),
        PT(L.x0,L.y0), [PT(L.y0,L.x0), PT(0,L.c1), PT(-L.x0,L.y0)], 'The lines cross at '+pt(L.x0,L.y0)+'. That point is on both lines, so it is the solution.'); },
    () => { var L = twoLines();
      return Q('Which point is the solution of '+lineH(L.m1,L.c1)+' and '+lineH(L.m2,L.c2)+'?', PT(L.x0,L.y0), [PT(L.x0+1,L.m1*(L.x0+1)+L.c1), PT(L.x0-1,L.m2*(L.x0-1)+L.c2), PT(L.y0,L.x0)],
        'Test '+pt(L.x0,L.y0)+' in both rules. '+num(L.m1)+' × '+num(L.x0)+pm(L.c1)+' = '+num(L.y0)+' and '+num(L.m2)+' × '+num(L.x0)+pm(L.c2)+' = '+num(L.y0)+'. Each of the other points fits one rule at most.'); },
    () => { var m = pick([-3,-2,2,3,4]), c = nz(-5,5), t = rnd(1,3), o = ['None','One','Two','Infinitely many'], e2, ans, why;
      if(t === 1){ e2 = lineH(m, ri(-5,5,[c])); ans = 0; why = 'Both lines have gradient '+num(m)+' but cut the y-axis at different places. They are parallel and never cross.'; }
      else if(t === 2){ e2 = lineH(ri(-3,4,[0,m]), nz(-5,5)); ans = 1; why = 'The gradients are different, so the lines cross at exactly one point.'; }
      else { e2 = '2y = '+polyH([2*m,2*c]); ans = 3; why = 'Dividing the second equation by 2 gives '+lineH(m,c)+', which is the first equation. They are the same line, so every point on it is a solution.'; }
      return Q('How many solutions do the equations '+lineH(m,c)+' and '+e2+' have?', o[ans], o.filter((_,i) => i !== ans), why); },
    () => { var a = rnd(1,4), d = rnd(1,4), b = a+d, n = rnd(2,8), f = d*n;
      return Q('Stall A charges $'+f+' to enter and $'+a+' a game. Stall B charges $'+b+' a game with no entry fee. For how many games do the two stalls cost the same?', N(n), [N(r2(f/b)), N(r2(f/a)), N(f)],
        'The costs are equal when '+a+'n + '+f+' = '+b+'n. Subtract '+a+'n from both sides: '+f+' = '+d+'n, so n = '+n+'.'); },
    () => { var L = twoLines();
      return Q('The lines '+lineH(L.m1,L.c1)+' and '+lineH(L.m2,L.c2)+' cross at one point. What is the x-coordinate of that point?', N(L.x0), [N(L.y0), N(-L.x0), N(L.c2-L.c1)],
        'At the crossing point both rules give the same y, so '+polyH([L.m1,L.c1])+' = '+polyH([L.m2,L.c2])+'. Solving this gives x = '+num(L.x0)+'.'); },
    () => { var L = twoLines();
      return Q('The lines '+lineH(L.m1,L.c1)+' and '+lineH(L.m2,L.c2)+' cross where x = '+num(L.x0)+'. What is the y-coordinate of that point?', N(L.y0), [N(L.x0), N(L.c1), N(L.c2)],
        'Put x = '+num(L.x0)+' into either rule: '+num(L.m1)+' × '+num(L.x0)+pm(L.c1)+' = '+num(L.y0)+'.'); }
  ]});

/* ---------- 2.5 Simultaneous equations with algebra ---------- */
function sys(){ var x = nz(-5,6), y = ri(-5,6,[0,x,-x]); return {x:x, y:y}; }
LSN('2.5','Simultaneous equations with algebra',{
  w:stepper('w25','Elimination, one step at a time', () => { var s = sys(), a1 = rnd(1,4), a2 = rnd(1,4), b = rnd(1,3), p = a1*s.x+b*s.y, q = a2*s.x-b*s.y;
    return {head:xyH(a1,b)+' = '+num(p)+'<br>'+xyH(a2,-b)+' = '+num(q), steps:[
      'Add the two equations. The y terms cancel: <b>'+(a1+a2)+'x = '+num(p+q)+'</b>',
      'Divide both sides by '+(a1+a2)+': <b>x = '+num(s.x)+'</b>',
      'Put x = '+num(s.x)+' into the first equation: '+num(a1*s.x)+' + '+(b === 1 ? '' : b)+'y = '+num(p)+', so <b>y = '+num(s.y)+'</b>',
      'Check in the second equation: '+num(a2*s.x)+' − '+num(b*s.y)+' = '+num(q)+'. The solution is <b>'+pt(s.x,s.y)+'</b>']}; }),
  body:w => Pp('A graph gives the solution only when the crossing point is easy to read. Algebra gives the exact solution every time. There are two methods.')+
    sec('Substitution','Use this when one equation already has y or x on its own. Replace that letter in the other equation.','!y = 2x + 1 and 3x + y = 11. Replace y in the second equation: 3x + (2x + 1) = 11. So 5x + 1 = 11 and x = 2. Then y = 2 × 2 + 1 = 5. The solution is (2, 5).',hb('subst'))+
    sec('Elimination by adding','If one letter has opposite numbers in front of it in the two equations, add the equations. That letter disappears.','!2x + y = 7 and x − y = 2. Add: 3x = 9, so x = 3. Put x = 3 into the first equation: 6 + y = 7, so y = 1. The solution is (3, 1).',w)+
    sec('Elimination by subtracting','If one letter has the same number in front of it in both equations, subtract one equation from the other.','!3x + 2y = 16 and x + 2y = 8. Subtract the second from the first: 2x = 8, so x = 4. Then 4 + 2y = 8, so y = 2. The solution is (4, 2).')+
    sec('Multiplying first','If neither letter matches, multiply one equation by a number so that one does.','!x + 2y = 8 and 3x + y = 9. Multiply the second equation by 2: 6x + 2y = 18. Now the y terms match. Subtract the first equation: 5x = 10, so x = 2. Then 2 + 2y = 8, so y = 3. The solution is (2, 3).')+
    sec('Checking','Put both values into both original equations. Both must be true.'),
  help:['subst','solve','solve','like','solve','solve'],
  gens:[
    () => { var s = sys(), m = rnd(1,3), c = s.y-m*s.x, a = rnd(1,4), d = a*s.x+s.y;
      return Q('Solve '+lineH(m,c)+' and '+xyH(a,1)+' = '+num(d)+'.', PT(s.x,s.y), [PT(s.y,s.x), PT(s.x+1,m*(s.x+1)+c), PT(s.x,d)],
        'Replace y in the second equation: '+polyH([a,0])+' + ('+polyH([m,c])+') = '+num(d)+'. So '+polyH([a+m,c])+' = '+num(d)+' and x = '+num(s.x)+'. Then y = '+num(m)+' × '+num(s.x)+pm(c)+' = '+num(s.y)+'.'); },
    () => { var s = sys(), a1 = rnd(1,4), a2 = rnd(1,4), b = rnd(1,3), p = a1*s.x+b*s.y, q = a2*s.x-b*s.y;
      return Q('Solve '+xyH(a1,b)+' = '+num(p)+' and '+xyH(a2,-b)+' = '+num(q)+'.', PT(s.x,s.y), [PT(s.y,s.x), PT(s.x,-s.y), PT(-s.x,s.y)],
        'Add the equations so that the y terms cancel: '+(a1+a2)+'x = '+num(p+q)+', so x = '+num(s.x)+'. Put this into the first equation to get y = '+num(s.y)+'.'); },
    () => { var s = sys(), a2 = rnd(1,3), a1 = a2+rnd(1,3), b = rnd(1,4), p = a1*s.x+b*s.y, q = a2*s.x+b*s.y;
      return Q('Solve '+xyH(a1,b)+' = '+num(p)+' and '+xyH(a2,b)+' = '+num(q)+'.', PT(s.x,s.y), [PT(s.y,s.x), PT(s.x,-s.y), PT(-s.x,s.y)],
        'Subtract the second equation from the first so that the y terms cancel: '+polyH([a1-a2,0])+' = '+num(p-q)+', so x = '+num(s.x)+'. Put this into the second equation to get y = '+num(s.y)+'.'); },
    () => { var s = sys(), a1 = rnd(2,5), a2 = ri(1,4,[a1]), b = rnd(1,3), p = a1*s.x+b*s.y, q = a2*s.x-b*s.y; if(q === 0) return null;
      return Q('What do you get when you add the equations '+xyH(a1,b)+' = '+num(p)+' and '+xyH(a2,-b)+' = '+num(q)+'?', (a1+a2)+'x = '+num(p+q), [(a1+a2)+'x + '+(2*b)+'y = '+num(p+q), polyH([a1-a2,0])+' = '+num(p-q), (a1+a2)+'x = '+num(p-q)],
        'Add the x terms: '+a1+'x + '+a2+'x = '+(a1+a2)+'x. The y terms cancel. Add the right sides: '+num(p)+' + '+num(q)+' = '+num(p+q)+'.'); },
    () => { var b1 = rnd(2,4), a2 = ri(2,5,[b1]), s = sys(), p = s.x+b1*s.y, q = a2*s.x+s.y;
      return Q('Which step makes the numbers in front of y the same in x + '+b1+'y = '+num(p)+' and '+a2+'x + y = '+num(q)+'?', 'Multiply the second equation by '+b1, ['Multiply the first equation by '+b1, 'Multiply the second equation by '+a2, 'Add the two equations'],
        'The first equation has '+b1+'y and the second has y. Multiplying the second equation by '+b1+' gives '+(a2*b1)+'x + '+b1+'y = '+num(q*b1)+', so both have '+b1+'y.'); },
    () => { var A = rnd(12,30), C = ri(5,11,[A]), k = rnd(2,4), X = 3*A+k*C, Y = A+k*C, d = v => N(v,'$'+v);
      return Q('3 adult tickets and '+k+' child tickets cost $'+X+'. 1 adult ticket and '+k+' child tickets cost $'+Y+'. What does one adult ticket cost?', d(A), [d(C), d(X-Y), d(A+C)],
        'The child tickets are the same in both, so subtract: 2 adult tickets cost $'+X+' − $'+Y+' = $'+(X-Y)+'. One adult ticket costs $'+A+'.'); }
  ]});

/* ---------- 2.6 Quadratic equations ---------- */
function roots(){ var a = nz(-9,9), b = ri(-9,9,[0,a,-a]); return [a,b]; }
function f2(v){ return (v < 0 ? M : '')+Math.abs(v).toFixed(2); }
LSN('2.6','Quadratic equations',{
  w:sliderW('w26','The solutions of '+X2+' + bx + c = 0',[['b','b',-8,8,1,-1],['c','c',-12,12,1,-6]], v => { var D = v.b*v.b-4*v.c, s = Math.sqrt(Math.max(D,0)), x1 = (-v.b+s)/2, x2 = (-v.b-s)/2;
    return '<p class="rule" style="font-size:18px">'+polyH([1,v.b,v.c])+' = 0</p>'+plotSVG({x0:-8,x1:8,y0:-14,y1:14,gx:2,gy:2,lx:4,ly:4,xl:'x',yl:'y',fns:[{f:x => x*x+v.b*x+v.c}],pts:D > 0 ? [[x1,0,'','tp'],[x2,0,'','tp']] : D === 0 ? [[x1,0,'','tp']] : []})+
      '<p>'+S('b',2)+' − 4ac = '+num(D)+'. '+(D > 0 ? 'It is positive, so there are two solutions: x = '+fmt(r2(x1))+' and x = '+fmt(r2(x2))+'. They are where the parabola crosses the x-axis.' : D === 0 ? 'It is 0, so there is one solution: x = '+fmt(r2(x1))+'. The parabola touches the x-axis once.' : 'It is negative, so there are no solutions. The parabola does not reach the x-axis.')+'</p>'; }),
  body:w => Pp('A quadratic equation has '+X2+' as its highest power, such as '+X2+' + 3x − 10 = 0. It can have two solutions, one solution or none.')+
    sec('Equations of the form '+X2+' = a number',X2+' = 25 has two solutions, because 5 × 5 = 25 and '+M+'5 × '+M+'5 = 25. The solutions are x = 5 and x = '+M+'5.',hb('sqrt'))+
    sec('The null factor law','If two numbers multiply to give 0, at least one of them must be 0. This is called the <b>null factor law</b>.','!(x − 2)(x + 5) = 0. Either x − 2 = 0, which gives x = 2, or x + 5 = 0, which gives x = '+M+'5.')+
    sec('Factorise first','If the quadratic is not in brackets, factorise it as in lesson 1.5.','!'+X2+' + 3x − 10 = 0 factorises to (x + 5)(x − 2) = 0, so x = '+M+'5 or x = 2.','!'+X2+' − 5x = 0 has a common factor: x(x − 5) = 0, so x = 0 or x = 5. Dividing both sides by x would lose the solution x = 0.')+
    sec('Make one side zero','The null factor law works only when one side is 0. For '+X2+' + 3x = 10, subtract 10 from both sides first to get '+X2+' + 3x − 10 = 0.')+
    sec('The quadratic formula','Some quadratics do not factorise with whole numbers. The quadratic formula solves any equation of the form a'+X2+' + bx + c = 0.','!x = '+fr(M+'b ± √('+S('b',2)+' − 4ac)','2a'),'The symbol ± means there are two calculations, one with + and one with −. For '+X2+' + 4x + 1 = 0: a = 1, b = 4 and c = 1, so '+S('b',2)+' − 4ac = 16 − 4 = 12. The solutions are x = '+fr(M+'4 + √12',2)+' = '+M+'0.27 and x = '+fr(M+'4 − √12',2)+' = '+M+'3.73.')+
    sec('How many solutions','The number under the square root, '+S('b',2)+' − 4ac, tells you how many solutions there are. If it is positive there are two. If it is 0 there is one. If it is negative there are none, because no number multiplied by itself gives a negative number.',w),
  help:['sqrt','neg','hcf','hcf','neg','sqrt','hcf'],
  gens:[
    () => { var n = rnd(2,12);
      return Q('Solve '+X2+' = '+(n*n)+'.', sol2(n,-n), ['x = '+n+' only', sol2(n*n/2,-n*n/2), sol2(n*n,-n*n)], n+' × '+n+' = '+(n*n)+' and '+M+n+' × '+M+n+' = '+(n*n)+', so there are two solutions.'); },
    () => { var r = roots();
      return Q('Solve ('+polyH([1,-r[0]])+')('+polyH([1,-r[1]])+') = 0.', sol2(r[0],r[1]), [sol2(-r[0],-r[1]), sol2(r[0],-r[1]), sol2(-r[0],r[1])],
        'One of the brackets must be 0. '+polyH([1,-r[0]])+' = 0 gives x = '+num(r[0])+'. '+polyH([1,-r[1]])+' = 0 gives x = '+num(r[1])+'.'); },
    () => { var r = roots();
      return Q('Solve '+polyH([1,-(r[0]+r[1]),r[0]*r[1]])+' = 0.', sol2(r[0],r[1]), [sol2(-r[0],-r[1]), sol2(r[0],-r[1]), sol2(-r[0],r[1])],
        'It factorises to ('+polyH([1,-r[0]])+')('+polyH([1,-r[1]])+') = 0. Each bracket gives one solution: x = '+num(r[0])+' or x = '+num(r[1])+'.'); },
    () => { var r = roots(), b = -(r[0]+r[1]), c = r[0]*r[1];
      return Q('Solve '+polyH([1,b,0])+' = '+num(-c)+'.', sol2(r[0],r[1]), [sol2(-r[0],-r[1]), sol2(r[0],-r[1]), sol2(-r[0],r[1])],
        'Make one side 0 first: '+polyH([1,b,c])+' = 0. This factorises to ('+polyH([1,-r[0]])+')('+polyH([1,-r[1]])+') = 0, so x = '+num(r[0])+' or x = '+num(r[1])+'.'); },
    () => { var t = rnd(1,3), b, c, o = ['Two','One','None','Three'];
      if(t === 2){ b = 2*nz(-5,5); c = b*b/4; } else { b = rnd(-8,8); c = rnd(-9,14); }
      var D = b*b-4*c, ans = D > 0 ? 0 : D === 0 ? 1 : 2; if(t !== 2 && (ans === 1 || (t === 3 && ans !== 2))) return null;
      return Q('How many solutions does '+polyH([1,b,c])+' = 0 have?', o[ans], o.filter((_,i) => i !== ans),
        S('b',2)+' − 4ac = '+(b*b)+' − 4 × 1 × '+num(c)+' = '+num(D)+'. That is '+(D > 0 ? 'positive, so there are two solutions.' : D === 0 ? '0, so there is one solution.' : 'negative, so there are no solutions.')); },
    () => { var b = rnd(3,8)*pick([1,-1]), c = nz(-6,6), D = b*b-4*c, s = Math.sqrt(D); if(D <= 0 || s === Math.round(s)) return null;
      var o = (p,q) => 'x = '+f2(p)+' or x = '+f2(q);
      return Q('Use the quadratic formula to solve '+polyH([1,b,c])+' = 0. Give the solutions to two decimal places.', o((-b+s)/2,(-b-s)/2), [o((b+s)/2,(b-s)/2), o(-b+s,-b-s), o(-b+s/2,-b-s/2)],
        'a = 1, b = '+num(b)+' and c = '+num(c)+'. '+S('b',2)+' − 4ac = '+num(D)+'. The solutions are x = '+fr(num(-b)+' + √'+D,2)+' = '+f2((-b+s)/2)+' and x = '+fr(num(-b)+' − √'+D,2)+' = '+f2((-b-s)/2)+'.', {calc:true}); },
    () => { var k = nz(-9,9); if(Math.abs(k) < 2) return null;
      return Q('Solve '+polyH([1,-k,0])+' = 0.', sol2(0,k), ['x = '+num(k)+' only', sol2(0,-k), sol2(k,-k)],
        'Take out the common factor x: x('+polyH([1,-k])+') = 0. Either x = 0 or '+polyH([1,-k])+' = 0, which gives x = '+num(k)+'.'); }
  ]});

/* ---------- 2.7 Exponential equations ---------- */
function bn(){ var b = rnd(2,5), n = rnd(2, b === 2 ? 7 : b === 3 ? 5 : b === 4 ? 4 : 4); return {b:b, n:n, v:Math.pow(b,n)}; }
LSN('2.7','Exponential equations',{
  w:sliderW('w27','Powers of a base',[['b','Base',2,5,1,2],['x','Exponent',0,6,1,3]], v => { var h = '', r = '';
    for(var k = 0; k <= 6; k++){ var on = k === v.x ? ' class="hit"' : ''; h += '<td'+on+'>'+S(v.b,k)+'</td>'; r += '<td'+on+'>'+Math.pow(v.b,k)+'</td>'; }
    return '<div class="tablewrap"><table class="vals"><tr>'+h+'</tr><tr>'+r+'</tr></table></div><p class="rule">'+S(v.b,v.x)+' = '+Math.pow(v.b,v.x)+'</p><p>Each step to the right multiplies the value by '+v.b+'.</p>'; }),
  body:w => Pp('In an exponential equation the unknown is in the exponent, as in '+S(2,'x')+' = 32. This lesson solves the ones that can be written with the same base on both sides.')+
    sec('Writing both sides with the same base','32 = 2 × 2 × 2 × 2 × 2 = '+S(2,5)+'. So '+S(2,'x')+' = 32 can be written as '+S(2,'x')+' = '+S(2,5)+'. When the bases are the same, the exponents must be equal, so x = 5.',w,hb('expmean'))+
    sec('An exponent that is an expression',S(3,'x + 1')+' = 81. Since 81 = '+S(3,4)+', the exponents give x + 1 = 4, so x = 3.',S(5,'2x')+' = 625. Since 625 = '+S(5,4)+', the exponents give 2x = 4, so x = 2.')+
    sec('A number in front','Divide both sides by the number in front first.','!3 × '+S(2,'x')+' = 48. Divide both sides by 3: '+S(2,'x')+' = 16 = '+S(2,4)+', so x = 4.')+
    sec('Zero and negative exponents',S(2,'x')+' = 1 has the solution x = 0, because any number other than 0 raised to the power 0 is 1.',S(2,'x')+' = '+fr(1,8)+' has the solution x = '+M+'3, because '+fr(1,8)+' = '+fr(1,S(2,3))+' = '+S(2,M+'3')+'.',hb('explaws'))+
    sec('Growth problems','A colony of 100 bacteria doubles every hour. After t hours there are 100 × '+S(2,'t')+' bacteria. To find when there are 1600, solve 100 × '+S(2,'t')+' = 1600. Divide both sides by 100: '+S(2,'t')+' = 16, so t = 4 hours.'),
  help:['expmean','expmean','expmean','solve','expmean','explaws'],
  gens:[
    () => { var p = bn();
      return Q('Solve '+S(p.b,'x')+' = '+p.v+'.', Nx(p.n), [Nx(p.v/p.b), Nx(p.n+1), Nx(p.n-1)], p.v+' = '+S(p.b,p.n)+', so '+S(p.b,'x')+' = '+S(p.b,p.n)+' and x = '+p.n+'.'); },
    () => { var p = bn(), k = rnd(1,3); if(p.n <= k) return null;
      return Q('Solve '+S(p.b,'x + '+k)+' = '+p.v+'.', Nx(p.n-k), [Nx(p.n), Nx(p.n+k), Nx(p.n-k+1)], p.v+' = '+S(p.b,p.n)+', so the exponents give x + '+k+' = '+p.n+' and x = '+(p.n-k)+'.'); },
    () => { var t = pick([[2,2,2],[2,2,3],[2,3,2],[3,2,2],[2,2,4],[5,2,2]]), b = t[0], k = t[1], m = t[2], n = k*m, v = Math.pow(b,n);
      return Q('Solve '+S(b,k+'x')+' = '+v+'.', Nx(m), [Nx(n), Nx(n-k), Nx(n*k)], v+' = '+S(b,n)+', so the exponents give '+k+'x = '+n+' and x = '+m+'.'); },
    () => { var p = bn(), c = rnd(2,9);
      return Q('Solve '+c+' × '+S(p.b,'x')+' = '+(c*p.v)+'.', Nx(p.n), [Nx(p.n+1), Nx(p.n-1), Nx(p.v)], 'Divide both sides by '+c+': '+S(p.b,'x')+' = '+p.v+' = '+S(p.b,p.n)+', so x = '+p.n+'.'); },
    () => { var P0 = pick([50,100,200,500]), b = pick([2,3]), n = rnd(2, b === 2 ? 5 : 4), tg = P0*Math.pow(b,n), y = v => N(v, v+' years');
      return Q('A population of '+P0+' rabbits '+(b === 2 ? 'doubles' : 'triples')+' every year. After how many years does it reach '+tg+'?', y(n), [y(Math.pow(b,n)), y(n+1), y(n-1)],
        'After t years the population is '+P0+' × '+S(b,'t')+'. Solve '+P0+' × '+S(b,'t')+' = '+tg+'. Divide both sides by '+P0+': '+S(b,'t')+' = '+Math.pow(b,n)+' = '+S(b,n)+', so t = '+n+'.'); },
    () => { var b = rnd(2,5), n = rnd(2,3), v = Math.pow(b,n);
      if(Math.random() < 0.4) return Q('Solve '+S(b,'x')+' = 1.', Nx(0), [Nx(1), Nx(b), Nx(-1)], 'Any number other than 0 raised to the power 0 is 1, so x = 0.');
      return Q('Solve '+S(b,'x')+' = '+fr(1,v)+'.', Nx(-n), [Nx(n), Nx(-v), N(1/n,'x = '+fr(1,n))], fr(1,v)+' = '+fr(1,S(b,n))+' = '+S(b,M+n)+', so x = '+M+n+'.'); }
  ]});

/* ---------- 2.8 Solving with a graph or by guess, check and refine ---------- */
LSN('2.8','Solving with a graph or by guess, check and refine',{
  w:sliderW('w28','Guess, check and refine for '+S(2,'x')+' = 10',[['x','x',0,5,0.05,2]], v => { var y = Math.pow(2,v.x), d = y-10;
    return plotSVG({x0:0,x1:5,y0:0,y1:20,gx:1,gy:2,lx:1,ly:4,xl:'x',yl:'y',fns:[{f:t => Math.pow(2,t)},{f:() => 10,c:'cv2'}],pts:[[v.x,y,'','tp']]})+
      '<p class="rule" style="font-size:18px">'+S(2,v.x.toFixed(2))+' = '+y.toFixed(2)+'</p><p class="goal'+(Math.abs(d) < 0.2 ? ' done' : '')+'">'+(Math.abs(d) < 0.2 ? 'That is within 0.2 of 10. To one decimal place the solution is 3.3.' : d < 0 ? 'That is too small. Try a larger x.' : 'That is too big. Try a smaller x.')+'</p>'; }),
  body:w => Pp('Some equations cannot be solved by the methods so far. '+S(2,'x')+' = 10 is one, because 10 is not a whole-number power of 2. Two methods still give an answer as accurate as you need.')+
    sec('Solving with a graph','Draw a graph of each side of the equation. For '+X2+' = x + 2, draw y = '+X2+' and y = x + 2. The solutions are the x-coordinates of the points where the graphs cross.',plotSVG({x0:-4,x1:4,y0:-2,y1:8,xl:'x',yl:'y',fns:[{f:x => x*x},{f:x => x+2,c:'cv2'}],pts:[[-1,1,'('+M+'1, 1)','tp'],[2,4,'(2, 4)','tp']]}),'The graphs cross where x = '+M+'1 and where x = 2, so those are the two solutions.')+
    sec('Finding every solution','An equation can have more than one solution. Make sure the graph shows a wide enough range of x values to include every crossing point. A graph of only the right-hand half above would miss x = '+M+'1.')+
    sec('Guess, check and refine','Choose a value for x, work out the left side and compare it with the right side. Then choose a better value.','!Solve '+S(2,'x')+' = 10. '+S(2,3)+' = 8 is too small and '+S(2,4)+' = 16 is too big, so x is between 3 and 4. '+S(2,'3.3')+' = 9.85 is too small and '+S(2,'3.4')+' = 10.56 is too big, so x is between 3.3 and 3.4.',w)+
    sec('How accurate','Each round of guesses narrows the range that contains the solution. Stop when the range is as narrow as the question asks for. To one decimal place, the solution of '+S(2,'x')+' = 10 is 3.3, because 9.85 is closer to 10 than 10.56 is.'),
  help:['plot','plot','subst','subst','plot','subst'],
  gens:[
    () => { var k = rnd(-4,2), t = rnd(1,3), c = t === 1 ? k+rnd(1,5) : t === 2 ? k : k-rnd(1,2), o = ['Two','One','None','Three'], ans = t-1, P = polyH([1,0,k]) === 'x<sup>2</sup>' ? X2 : polyH([1,0,k]);
      return Q('The graphs of y = '+P+' and y = '+num(c)+' are shown. How many solutions does '+P+' = '+num(c)+' have?'+plotSVG({x0:-5,x1:5,y0:-6,y1:8,xl:'x',yl:'y',fns:[{f:x => x*x+k},{f:() => c,c:'cv2'}]}), o[ans], o.filter((_,i) => i !== ans),
        'Each crossing point gives one solution. The graphs '+(ans === 0 ? 'cross at two points.' : ans === 1 ? 'touch at one point.' : 'do not meet.')); },
    () => { var r1 = rnd(-4,3), r2v = r1+rnd(1,5); if(r2v > 4 || r1 === -r2v || r1*r2v === 0) return null;
      var P = polyH([1,-(r1+r2v),r1*r2v]), s = (a,b) => 'x = '+num(a)+' and x = '+num(b);
      return Q('The graph of y = '+P+' is shown. What are the solutions of '+P+' = 0?'+plotSVG({x0:-6,x1:6,y0:-8,y1:8,gy:2,ly:4,xl:'x',yl:'y',fns:[{f:x => (x-r1)*(x-r2v)}]}), s(r1,r2v), [s(-r2v,-r1), 'x = '+num(r1*r2v)+' only', 'x = '+num(r1)+' only'],
        'y = 0 on the x-axis, so the solutions are the x values where the graph crosses the x-axis: '+num(r1)+' and '+num(r2v)+'.'); },
    () => { var n = rnd(2,4), T = rnd(n*n*n+2, (n+1)*(n+1)*(n+1)-2), o = a => 'Between '+a+' and '+(a+1);
      return Q('The equation is '+S('x',3)+' = '+T+'. Between which two whole numbers is the solution?', o(n), [o(n-1), o(n+1), o(n+2)],
        S(n,3)+' = '+(n*n*n)+' is less than '+T+' and '+S(n+1,3)+' = '+Math.pow(n+1,3)+' is more than '+T+', so the solution is between '+n+' and '+(n+1)+'.', {calc:true}); },
    () => { var b = pick([2,3]), lo = rnd(b === 2 ? 30 : 15, b === 2 ? 48 : 28)/10, hi = r2(lo+0.1), vl = Math.pow(b,lo), vh = Math.pow(b,hi), T = Math.ceil(vl), nm = pick(NAMES);
      if(T >= vh || T-vl < 0.05) return null;
      var dl = T-vl, dh = vh-T; if(Math.max(dl,dh)/Math.min(dl,dh) < 1.6) return null;
      var o = [lo.toFixed(1)+', because '+vl.toFixed(2)+' is closer to '+T, hi.toFixed(1)+', because '+vh.toFixed(2)+' is closer to '+T, lo.toFixed(1)+', because it is the smaller value', hi.toFixed(1)+', because it is the larger value'], ans = dl < dh ? 0 : 1;
      return Q('To solve '+S(b,'x')+' = '+T+', '+nm+' finds that '+S(b,lo.toFixed(1))+' = '+vl.toFixed(2)+' and '+S(b,hi.toFixed(1))+' = '+vh.toFixed(2)+'. Which value of x is closer to the solution?', o[ans], o.filter((_,i) => i !== ans),
        vl.toFixed(2)+' is '+dl.toFixed(2)+' away from '+T+' and '+vh.toFixed(2)+' is '+dh.toFixed(2)+' away. The closer result comes from x = '+(ans ? hi : lo).toFixed(1)+'.'); },
    () => { var m = rnd(1,5), c = rnd(1,9);
      return Q('Which equation is solved by finding where the graphs of y = '+X2+' and y = '+polyH([m,c])+' cross?', X2+' = '+polyH([m,c]), [polyH([1,m,c])+' = 0', 'y = '+polyH([1,m,c]), X2+' = 0'],
        'Where the graphs cross, both rules give the same y, so '+X2+' = '+polyH([m,c])+'.'); },
    () => { var g = rnd(3,11)/2, v = g*g+g, T = Math.round(v)+pick([-3,-2,2,3]), nm = pick(NAMES), lt = v < T;
      var o = (a,b) => 'A '+a+' value, because '+fmt(v)+' is '+b+' than '+T;
      return Q(nm+' tries x = '+g+' in '+X2+' + x = '+T+' and gets '+fmt(v)+'. What should the next guess be?', o(lt ? 'larger' : 'smaller', lt ? 'less' : 'more'), [o(lt ? 'smaller' : 'larger', lt ? 'less' : 'more'), o('larger', lt ? 'more' : 'less'), o('smaller', lt ? 'more' : 'less')].filter((s,i,arr) => arr.indexOf(s) === i),
        fmt(v)+' is '+(lt ? 'less' : 'more')+' than '+T+'. For positive x, a larger x gives a larger value of '+X2+' + x, so the next guess should be '+(lt ? 'larger' : 'smaller')+'.'); }
  ]});

/* ---------- background cards for Zone 2 ---------- */
HELP.ineq = {title:'Inequality symbols', btn:'inequality symbols', zone:2,
  html:'<p>The symbols < and > compare two numbers. The open end of the symbol faces the bigger number.</p>'+
       '<p class="note">3 < 7 is read as 3 is less than 7.<br>7 > 3 is read as 7 is greater than 3.</p>'+
       '<p>A line under the symbol means or equal to. x ≥ 5 means x can be 5 or any number greater than 5. x ≤ 5 means x can be 5 or any number less than 5.</p>',
  gen:() => { var a = rnd(-9,9), s = pick(SYM), ok = (s === '>') ? a+rnd(1,4) : s === '<' ? a-rnd(1,4) : a, bad = (s === '>' || s === '≥') ? [a-1, a-3, s === '>' ? a : a-5] : [a+1, a+3, s === '<' ? a : a+5];
    return Q('Which number fits x '+s+' '+num(a)+'?', N(ok), bad.map(t => N(t)), num(ok)+' is '+SYMW[s]+' '+num(a)+'. None of the other numbers is.'); }};
HELP.linegraph = {title:'Gradient and y-intercept of a line', btn:'gradient and y-intercept', zone:2,
  html:'<p>A rule such as y = 2x + 1 gives a straight line.</p>'+
       '<p>The number in front of x is the <b>gradient</b>. It tells you how steep the line is. A gradient of 2 means the line goes up 2 for every 1 it goes across. A negative gradient means the line goes down from left to right.</p>'+
       '<p>The number on its own is the <b>y-intercept</b>. It is where the line cuts the y-axis.</p>'+
       '<p class="note">y = 2x + 1 has gradient 2 and cuts the y-axis at 1.<br>y = '+M+'x + 6 has gradient '+M+'1 and cuts the y-axis at 6.</p>',
  gen:() => { var m = ri(-5,6,[0,1]), c = ri(-9,9,[0,m]), g = Math.random() < 0.5;
    return Q('What is the '+(g ? 'gradient' : 'y-intercept')+' of the line '+lineH(m,c)+'?', N(g ? m : c), [N(g ? c : m), N(g ? -m : -c), N(m+c)],
      (g ? 'The gradient is the number in front of x, which is '+num(m)+'.' : 'The y-intercept is the number on its own, which is '+num(c)+'.')); }};
