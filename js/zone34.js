"use strict";
/* Zone 3, Coaster Alley (3.1, 3.3, 3.4) and Zone 4, Ticket Office */
function perpH(m){ return Math.abs(m) === 1 ? num(-m) : (m > 0 ? M : '')+fr(1,Math.abs(m)); }      // −1/m
function perpX(m){ return Math.abs(m) === 1 ? (m > 0 ? M : '')+'x' : (m > 0 ? M : '')+fr('x',Math.abs(m)); } // (−1/m)x
function sqT(v,c){ return c === 0 ? S(v,2) : '('+v+(c > 0 ? ' '+M+' '+c : ' + '+(-c))+')<sup>2</sup>'; }
function tbl(xs, ys, a, b){ return '<div class="tablewrap"><table class="vals"><tr><th>'+(a || 'x')+'</th>'+xs.map(v => '<td>'+v+'</td>').join('')+'</tr><tr><th>'+(b || 'y')+'</th>'+ys.map(v => '<td>'+v+'</td>').join('')+'</tr></table></div>'; }
function code(lines){ return '<div class="code">'+lines.join('\n')+'</div>'; }
function D(v){ return N(r2(v), money(v)); }
var Y2 = S('y',2);

/* ---------- 3.1 Parallel and perpendicular lines ---------- */
LSN('3.1','Parallel and perpendicular lines',{
  w:sliderW('w31','Parallel and perpendicular lines',[['m','Gradient of the red line',-4,4,1,2]], v => { var m = v.m;
    return plotSVG({x0:-6,x1:6,y0:-6,y1:6,xl:'x',yl:'y',fns:[{f:x => m*x+1},{f:x => m*x-3,c:'cv2'}].concat(m ? [{f:x => -x/m,c:'thin'}] : []),segs:m ? [] : [[0,-6,0,6,'thin']]})+
      '<p><b>Red:</b> '+lineH(m,1)+'. <b>Green:</b> '+lineH(m,-3)+' has the same gradient, so it is parallel to the red line.</p>'+
      '<p><b>Black:</b> '+(m ? 'y = '+perpX(m)+' has gradient '+perpH(m)+'. '+num(m)+' × '+perpH(m)+' = '+M+'1, so it is perpendicular to the red line.' : 'the red line is horizontal, so a perpendicular line is vertical. A vertical line has no gradient.')+'</p>'; }),
  body:w => Pp('The gradient of a line tells you its direction. That makes it easy to tell when two lines are parallel or meet at a right angle.')+
    sec('Gradient','The <b>gradient</b> of a line is how far it rises for each unit it moves to the right. In y = 3x − 2 the gradient is 3. Between two points, gradient = rise ÷ run.',hb('gradient'))+
    sec('Parallel lines','Parallel lines point in the same direction and never meet. Two lines are parallel when they have the same gradient. y = 3x − 2 and y = 3x + 5 are parallel.',w)+
    sec('Perpendicular lines','Perpendicular lines meet at a right angle. Two lines are perpendicular when their gradients multiply to give '+M+'1.','!y = 2x + 1 has gradient 2. A perpendicular line has gradient '+M+fr(1,2)+', because 2 × '+M+fr(1,2)+' = '+M+'1.','To find the perpendicular gradient, turn the gradient upside down and change its sign. The perpendicular gradient for 3 is '+M+fr(1,3)+', and for '+M+'4 it is '+fr(1,4)+'.')+
    sec('A parallel line through a point','To find the line parallel to y = 2x + 1 that passes through (3, 10), keep the gradient 2 and write y = 2x + c. Put the point in: 10 = 2 × 3 + c, so c = 4. The line is y = 2x + 4.',hb('subst'))+
    sec('Testing two lines','Compare the gradients. If they are equal, the lines are parallel. If they multiply to '+M+'1, the lines are perpendicular. Otherwise they are neither.'),
  help:['linegraph','linegraph','linegraph','subst','linegraph','gradient'],
  gens:[
    () => { var m = rnd(2,6)*pick([1,-1]), c = nz(-9,9);
      return Q('A line is parallel to '+lineH(m,c)+'. What is its gradient?', N(m), [N(-m), N(-1/m,perpH(m)), N(1/m,perpH(-m))], 'Parallel lines have the same gradient. The gradient of '+lineH(m,c)+' is '+num(m)+'.'); },
    () => { var m = rnd(2,6)*pick([1,-1]), c = nz(-9,9);
      return Q('A line is perpendicular to '+lineH(m,c)+'. What is its gradient?', N(-1/m,perpH(m)), [N(m), N(-m), N(1/m,perpH(-m))], 'The gradients of perpendicular lines multiply to '+M+'1. '+num(m)+' × '+perpH(m)+' = '+M+'1.'); },
    () => { var m = rnd(2,5)*pick([1,-1]), c1 = nz(-8,8), c2 = ri(-8,8,[0,c1]), t = rnd(0,2), o = ['Parallel','Perpendicular','Neither','The same line'];
      var e2 = t === 0 ? lineH(m,c2) : t === 1 ? 'y = '+perpX(m)+pm(c2) : lineH(-m,c2);
      return Q('Are the lines '+lineH(m,c1)+' and '+e2+' parallel, perpendicular or neither?', o[t], o.filter((_,i) => i !== t),
        t === 0 ? 'Both gradients are '+num(m)+', so the lines are parallel.' : t === 1 ? 'The gradients are '+num(m)+' and '+perpH(m)+'. They multiply to '+M+'1, so the lines are perpendicular.' : 'The gradients are '+num(m)+' and '+num(-m)+'. They are not equal, and they multiply to '+num(-m*m)+', not '+M+'1.'); },
    () => { var m = nz(-4,4), c = nz(-8,8), x1 = nz(-4,4), y1 = rnd(-6,8), c2 = y1-m*x1; if(c2 === c || c2 === 0 || c2 === y1) return null;
      return Q('Which line is parallel to '+lineH(m,c)+' and passes through '+pt(x1,y1)+'?', lineH(m,c2), [lineH(m,y1), lineH(-m,y1+m*x1), lineH(m,-c2)],
        'A parallel line has the same gradient, so its rule is y = '+polyH([m,0])+' + c. Put the point in: '+num(y1)+' = '+num(m)+' × '+num(x1)+' + c, so c = '+num(c2)+'.'); },
    () => { var m = rnd(2,5)*pick([1,-1]), c = nz(-8,8), k = nz(-8,8);
      return Q('Which line is perpendicular to '+lineH(m,c)+' and cuts the y-axis at '+num(k)+'?', 'y = '+perpX(m)+pm(k), [lineH(m,k), lineH(-m,k), 'y = '+perpX(-m)+pm(k)],
        'The perpendicular gradient is '+perpH(m)+', because '+num(m)+' × '+perpH(m)+' = '+M+'1. The line cuts the y-axis at '+num(k)+', so that is the number on its own.'); },
    () => { var m = rnd(2,4)*pick([1,-1]), r = rnd(2,4), x1 = rnd(-4,3), y1 = rnd(-5,5), x2 = x1+r, y2 = y1+m*r;
      return Q('What is the gradient of the line through '+pt(x1,y1)+' and '+pt(x2,y2)+'?', N(m), [N(1/m,perpH(-m)), N(-m), N(m*r)],
        'The rise is '+num(y2)+' − '+num(y1)+' = '+num(m*r)+'. The run is '+num(x2)+' − '+num(x1)+' = '+r+'. Gradient = rise ÷ run = '+num(m)+'.'); }
  ]});

/* ---------- 3.3 Exponential graphs ---------- */
LSN('3.3','Exponential graphs',{
  w:sliderW('w33','The graph of y = k × aˣ',[['a','Base a',0.25,4,0.25,2],['k','Number in front, k',1,5,1,1]], v =>
    '<p class="rule" style="font-size:18px">y = '+(v.k === 1 ? '' : v.k+' × ')+S(v.a,'x')+'</p>'+plotSVG({x0:-4,x1:4,y0:0,y1:16,gy:2,ly:4,xl:'x',yl:'y',fns:[{f:x => v.k*Math.pow(v.a,x)}],pts:[[0,v.k,'(0, '+v.k+')','tp']]})+
    '<p>The graph cuts the y-axis at '+v.k+'. '+(v.a > 1 ? 'The base is greater than 1, so y grows as x increases. Each step to the right multiplies y by '+v.a+'.' : v.a === 1 ? 'The base is 1, and 1 to any power is 1, so the graph is a flat line.' : 'The base is between 0 and 1, so y shrinks as x increases. Each step to the right multiplies y by '+v.a+'.')+'</p>'),
  body:w => Pp('A rule with x in the exponent, such as y = '+S(2,'x')+', gives an exponential graph. These graphs describe things that double, triple or halve over equal steps.')+
    sec('A table of values for y = '+S(2,'x'),tbl([M+'2',M+'1',0,1,2,3,4],[fr(1,4),fr(1,2),1,2,4,8,16]),'Each step to the right doubles y. Each step to the left halves it.',hb('expmean'))+
    sec('The shape of the graph','The graph passes through (0, 1), because any number other than 0 raised to the power 0 is 1. To the right it climbs faster and faster. To the left it gets closer and closer to the x-axis but never reaches it, because a power of 2 is never 0 or negative.',w)+
    sec('Growth and decay','When the base is greater than 1, y grows as x increases. When the base is between 0 and 1, y shrinks as x increases, which is called decay. y = '+S('0.5','x')+' halves at every step.')+
    sec('A number in front','In y = 3 × '+S(2,'x')+' every value is 3 times as big as in y = '+S(2,'x')+'. The graph cuts the y-axis at 3, because 3 × '+S(2,0)+' = 3 × 1 = 3.')+
    sec('Exponential and straight-line growth','A straight line adds the same amount at every step. An exponential graph multiplies by the same number at every step. For small x the line can be ahead, but the exponential graph always overtakes it in the end.'),
  help:['subst','subst','expmean','plot','expmean','expmean'],
  gens:[
    () => { var k = rnd(2,9), a = ri(2,5,[k]);
      return Q('Where does the graph of y = '+k+' × '+S(a,'x')+' cut the y-axis?', PT(0,k), [PT(0,a), PT(0,k*a), PT(k,0)], 'On the y-axis x = 0, and '+S(a,0)+' = 1. So y = '+k+' × 1 = '+k+'.'); },
    () => { var k = rnd(2,5), a = pick([2,3]), x = rnd(2,4), v = Math.pow(a,x);
      return Q('For y = '+k+' × '+S(a,'x')+', what is y when x = '+x+'?', N(k*v), [N(k*a*x), N(Math.pow(k*a,x)), N(k+v)], 'Work out the power first: '+S(a,x)+' = '+v+'. Then multiply by '+k+' to get '+(k*v)+'.'); },
    () => { var g = sample([2,3,1.5,4,1.2,5],3), d = sample([0.5,0.2,0.8,0.25,0.9],3), dec = Math.random() < 0.5, f = (b,i) => 'y = '+(i ? (i+1)+' × ' : '')+S(b,'x');
      var c = dec ? d[0] : g[0], w = dec ? g : d;
      return Q('Which rule shows '+(dec ? 'decay, where y gets smaller as x increases?' : 'growth, where y gets bigger as x increases?'), f(c,0), w.map((b,i) => f(b,i)),
        (dec ? 'Decay needs a base between 0 and 1. Only '+c+' is.' : 'Growth needs a base greater than 1. Only '+c+' is.')+' The number in front does not change this.'); },
    () => { var bs = [2,3,4,0.5], a = pick(bs), px = a > 1 ? 1 : -1, py = a > 1 ? a : 2;
      return Q('The graph passes through (0, 1) and the marked point '+pt(px,py)+'. Which rule gives this graph?'+plotSVG({x0:-3,x1:3,y0:0,y1:10,ly:2,xl:'x',yl:'y',fns:[{f:x => Math.pow(a,x)}],pts:[[0,1,'','pt'],[px,py,pt(px,py),'tp']]}),
        'y = '+S(a,'x'), bs.filter(b => b !== a).map(b => 'y = '+S(b,'x')), 'Test the marked point. When x = '+num(px)+', '+S(a,num(px))+' = '+py+'. None of the other rules gives '+py+'.'); },
    () => { var m = pick([5,10,20]), n = rnd(3,8), e = Math.pow(2,n), l = m*n; if(e === l) return null;
      var E = 'y = '+S(2,'x'), Ln = 'y = '+m+'x', big = e > l ? E : Ln, sm = e > l ? Ln : E, d = Math.abs(e-l);
      return Q('Compare y = '+S(2,'x')+' and y = '+m+'x when x = '+n+'.', big+' is larger, by '+d, [sm+' is larger, by '+d, 'The two values are equal', big+' is larger, by '+(e+l)],
        S(2,n)+' = '+e+' and '+m+' × '+n+' = '+l+'. The difference is '+d+'.'); },
    () => { var k = rnd(2,5), a = ri(2,3,[k]);
      return Q('Which rule fits this table?'+tbl([0,1,2,3],[k,k*a,k*a*a,k*a*a*a]), 'y = '+k+' × '+S(a,'x'), ['y = '+a+' × '+S(k,'x'), 'y = '+(k*a-k)+'x + '+k, 'y = '+S(a,'x')+' + '+(k-1)],
        'Each y value is '+a+' times the one before, so the base is '+a+'. When x = 0, y = '+k+', so the number in front is '+k+'.'); }
  ]});

/* ---------- 3.4 Circles and hyperbolas ---------- */
LSN('3.4','Circles and hyperbolas',{
  w:[sliderW('w34','A circle and its rule',[['r','Radius',1,6,1,3],['h','Centre, x',-3,3,1,0],['k','Centre, y',-3,3,1,0]], v =>
      '<p class="rule" style="font-size:18px">'+sqT('x',v.h)+' + '+sqT('y',v.k)+' = '+(v.r*v.r)+'</p>'+plotSVG({x0:-9,x1:9,y0:-9,y1:9,lx:3,ly:3,xl:'x',yl:'y',circ:[[v.h,v.k,v.r]],pts:[[v.h,v.k,pt(v.h,v.k),'tp']]})+'<p>The centre is '+pt(v.h,v.k)+' and the radius is '+v.r+', because '+v.r+'<sup>2</sup> = '+(v.r*v.r)+'.</p>'),
     sliderW('w34b','The hyperbola y = k ÷ x',[['k','k',-12,12,1,6]], v => v.k === 0 ? '<p>When k = 0, y is 0 for every x, so the graph is the x-axis.</p>' :
      '<p class="rule" style="font-size:18px">y = '+fr(num(v.k),'x')+'</p>'+plotSVG({x0:-8,x1:8,y0:-8,y1:8,lx:2,ly:2,xl:'x',yl:'y',fns:[{f:x => v.k/x}]})+'<p>For every point on the curve, x × y = '+num(v.k)+'. The curve has two separate parts, and it never touches either axis.</p>')],
  body:w => Pp('Two more curves have simple rules: the circle and the hyperbola.')+
    sec('A circle with its centre at (0, 0)','Every point on a circle is the same distance from the centre. That distance is the radius, r. For a point (x, y) on the circle, Pythagoras’ theorem gives '+X2+' + '+Y2+' = '+S('r',2)+'.','!'+X2+' + '+Y2+' = 25 is a circle with centre (0, 0) and radius 5, because √25 = 5. The point (3, 4) is on it, because 9 + 16 = 25.',hb('pythag'))+
    sec('Moving the centre','The rule (x − h)<sup>2</sup> + (y − k)<sup>2</sup> = '+S('r',2)+' is a circle with centre (h, k) and radius r. As with parabolas, the signs in the brackets are the opposite of the centre’s coordinates.',w[0])+
    sec('The hyperbola y = k ÷ x','In y = '+fr(12,'x')+', y is 12 divided by x.',tbl([1,2,3,4,6,12],[12,6,4,3,2,1]),'As x gets bigger, y gets smaller. In every column x × y = 12. x cannot be 0, because you cannot divide by 0, so the curve never touches the y-axis.',w[1])+
    sec('Telling the graphs apart','A rule with '+X2+' + '+Y2+' is a circle. A rule with x in the denominator is a hyperbola. A rule with '+X2+' and plain y is a parabola. A rule with x in the exponent is an exponential graph.'),
  help:['sqrt','sqrt','pythag','plot','subst','mulfrac','plot'],
  gens:[
    () => { var n = rnd(2,12);
      return Q('What is the radius of the circle '+X2+' + '+Y2+' = '+(n*n)+'?', N(n), [N(n*n), N(n*n/2), N(2*n)], 'The number on the right is '+S('r',2)+'. The radius is √'+(n*n)+' = '+n+'.'); },
    () => { var r = rnd(3,12), L = X2+' + '+Y2+' = ';
      return Q('Which rule gives a circle with centre (0, 0) and radius '+r+'?', L+(r*r), [L+r, L+(2*r), 'x + y = '+r], 'The rule is '+X2+' + '+Y2+' = '+S('r',2)+', and '+r+'<sup>2</sup> = '+(r*r)+'.'); },
    () => { var t = pick([[3,4,5],[6,8,10],[5,12,13],[8,6,10],[4,3,5]]), a = t[0]*pick([1,-1]), b = t[1]*pick([1,-1]);
      return Q('Which point is on the circle '+X2+' + '+Y2+' = '+(t[2]*t[2])+'?', PT(a,b), [PT(t[0],t[0]), PT(t[1],t[1]), PT(t[2],1)],
        'Put the point into the rule: '+(a*a)+' + '+(b*b)+' = '+(t[2]*t[2])+'. The other points give a different total.'); },
    () => { var h = nz(-5,5), k = ri(-5,5,[0,h]), r = rnd(2,6);
      return Q('What is the centre of the circle '+sqT('x',h)+' + '+sqT('y',k)+' = '+(r*r)+'?', PT(h,k), [PT(-h,-k), PT(h,-k), PT(k,h)],
        'The x bracket is 0 when x = '+num(h)+' and the y bracket is 0 when y = '+num(k)+'. The centre is '+pt(h,k)+'.'); },
    () => { var k = pick([12,18,20,24,30,36]), x = pick([2,3,4,5,6].filter(d => k%d === 0));
      return Q('For y = '+fr(k,'x')+', what is y when x = '+x+'?', N(k/x), [N(k*x), N(k-x), N(x/k,fr(x,k))], 'Divide '+k+' by '+x+' to get '+(k/x)+'.'); },
    () => { var k = pick([12,24,36,48]), a = pick([2,3]), m = pick([2,3]); if(k%(a*m)) return null;
      return Q('In y = '+fr(k,'x')+', x changes from '+a+' to '+(a*m)+'. What happens to y?', 'It is divided by '+m+', from '+(k/a)+' to '+(k/(a*m)), ['It is multiplied by '+m+', from '+(k/a)+' to '+(k/a*m), 'It goes down by '+m+', from '+(k/a)+' to '+(k/a-m), 'It stays at '+(k/a)],
        'When x = '+a+', y = '+(k/a)+'. When x = '+(a*m)+', y = '+(k/(a*m))+'. Multiplying x by '+m+' divides y by '+m+'.'); },
    () => { var circ = Math.random() < 0.5, r = rnd(2,5), k = rnd(2,8), o = [X2+' + '+Y2+' = '+(r*r), 'y = '+fr(k,'x'), 'y = '+X2, 'y = x + '+k], ans = circ ? 0 : 1;
      return Q('Which rule gives this graph?'+plotSVG(circ ? {x0:-6,x1:6,y0:-6,y1:6,xl:'x',yl:'y',circ:[[0,0,r]]} : {x0:-6,x1:6,y0:-6,y1:6,xl:'x',yl:'y',fns:[{f:x => k/x}]}), o[ans], o.filter((_,i) => i !== ans),
        circ ? 'The graph is a circle with centre (0, 0) and radius '+r+', so its rule is '+o[0]+'.' : 'The graph has two separate parts that never touch the axes. That is a hyperbola, which has x in the denominator.'); }
  ]});

/* ---------- 4.1 Simple and compound interest ---------- */
LSN('4.1','Simple and compound interest',{
  w:sliderW('w41','$1000 invested: simple and compound interest',[['r','Rate, % a year',1,10,1,5],['n','Years',1,30,1,10]], v => { var s = 1000*(1+v.r*v.n/100), c = 1000*Math.pow(1+v.r/100,v.n);
    return '<div class="barrow"><span>Simple interest: 1000 + 1000 × '+(v.r/100)+' × '+v.n+'</span><i style="width:'+(s/c*100)+'%"></i><b>'+money(s)+'</b></div><div class="barrow two"><span>Compound interest: 1000 × '+S(fmt(1+v.r/100),v.n)+'</span><i style="width:100%"></i><b>'+money(c)+'</b></div><p>Compound interest is ahead by <b>'+money(c-s)+'</b>.</p>'; }),
  body:w => Pp('Interest is money paid for the use of money. A bank pays interest on savings and charges interest on loans. There are two ways to calculate it.')+
    sec('Simple interest','With <b>simple interest</b>, the interest each year is a percentage of the amount first invested, which is called the <b>principal</b>. The interest is the same every year.','!$500 at 4% a year for 3 years. Each year earns 0.04 × 500 = $20. Three years earn 3 × $20 = $60. The total is $560.','As a formula, I = Prn, where P is the principal, r is the rate as a decimal and n is the number of years.',hb('pct'))+
    sec('Compound interest','With <b>compound interest</b>, each year’s interest is added to the balance, and the next year’s interest is worked out on the new balance. The interest grows every year.',tbl(['1','2','3'],['$520.00','$540.80','$562.43'],'End of year','Balance'),'Year 1: 500 × 1.04 = 520. Year 2: 520 × 1.04 = 540.80. Year 3: 540.80 × 1.04 = 562.43.',hb('pctmult'))+
    sec('The compound interest formula','Each year the balance is multiplied by 1.04. After 3 years it has been multiplied by 1.04 three times, which is 500 × '+S('1.04',3)+'.','!A = P(1 + r)<sup>n</sup>, where A is the final amount.')+
    sec('Comparing the two','After 3 years simple interest gives $560 and compound interest gives $562.43. The gap is small at first and grows every year, because compound interest earns interest on its interest.',w),
  help:['pct','pct','pctmult','pctmult','pct','pct'],
  gens:[
    () => { var P = 100*rnd(2,20), r = pick([2,3,4,5,6,8]), n = rnd(2,6), I = P*r*n/100;
      return Q('$'+P+' earns simple interest at '+r+'% a year for '+n+' years. How much interest does it earn?', D(I), [D(P*r/100), D(P+I), D(I*10)], 'One year earns '+(r/100)+' × '+P+' = '+money(P*r/100)+'. '+n+' years earn '+n+' × '+money(P*r/100)+' = '+money(I)+'.'); },
    () => { var P = 100*rnd(2,20), r = pick([2,3,4,5,6,8]), n = rnd(2,6), I = P*r*n/100;
      return Q('$'+P+' earns simple interest at '+r+'% a year for '+n+' years. What is the total at the end?', D(P+I), [D(I), D(P+P*r/100), D(P*Math.pow(1+r/100,n))], 'The interest is '+P+' × '+(r/100)+' × '+n+' = '+money(I)+'. Add the principal: '+money(P+I)+'.', {calc:true}); },
    () => { var P = 1000*rnd(1,9), r = pick([2,4,5,6,10]), n = pick([2,3]), m = 1+r/100;
      return Q('$'+P+' is invested at '+r+'% a year compound interest. What is it worth after '+n+' years?', D(P*Math.pow(m,n)), [D(P*(1+r*n/100)), D(P*m), D(P*Math.pow(m,n+1))], 'Multiply by '+m+' once for each year: '+P+' × '+S(m,n)+' = '+money(P*Math.pow(m,n))+'.', {calc:true}); },
    () => { var P = 1000*rnd(1,9), r = pick([2,3,4,5,6,8]), n = rnd(3,9), m = 1+r/100;
      return Q('$'+P+' is invested at '+r+'% a year compound interest. Which calculation gives its value after '+n+' years?', P+' × '+S(m,n), [P+' × '+m+' × '+n, P+' × '+S(r/100,n), P+' + '+(r/100)+' × '+n], 'Each year multiplies the balance by '+m+'. After '+n+' years it has been multiplied by '+m+' '+n+' times, which is '+S(m,n)+'.'); },
    () => { var P = 1000*rnd(1,9), r = pick([4,5,6,8,10]), n = pick([2,3]), c = P*Math.pow(1+r/100,n), s = P*(1+r*n/100);
      return Q('How much more does $'+P+' earn in '+n+' years at '+r+'% compound interest than at '+r+'% simple interest?', D(c-s), [D(0), D(c-P), D(s-P)], 'Compound: '+P+' × '+S(1+r/100,n)+' = '+money(c)+'. Simple: '+P+' + '+P+' × '+(r/100)+' × '+n+' = '+money(s)+'. The difference is '+money(c-s)+'.', {calc:true}); },
    () => { var B = 1000*rnd(1,9), r = pick([2,4,5,6,8,10]), X = B*(1+r/100);
      return Q('$'+B+' earns '+r+'% a year compound interest. At the end of year 1 the balance is '+money(X)+'. How much interest is earned in year 2?', D(X*r/100), [D(B*r/100), D(2*B*r/100), D(X*r/100+B*r/100)], 'Year 2 interest is worked out on the new balance: '+(r/100)+' × '+money(X)+' = '+money(X*r/100)+'.', {calc:true}); }
  ]});

/* ---------- 4.2 Growth and decay ---------- */
LSN('4.2','Growth and decay',{
  w:sliderW('w42','$1000 changing by a fixed percentage each year',[['p','Change each year, %',-30,30,5,-10],['n','Years',0,10,1,5]], v => { var m = 1+v.p/100, val = 1000*Math.pow(m,v.n);
    return plotSVG({x0:0,x1:10,y0:0,y1:14000,gx:1,gy:1000,lx:2,ly:2000,xl:'years',fns:[{f:t => 1000*Math.pow(m,t)}],pts:[[v.n,val,'','tp']]})+
      '<p class="rule" style="font-size:18px">1000 × '+S(fmt(m),v.n)+' = '+money(val)+'</p><p>'+(v.p > 0 ? 'A rise of '+v.p+'% means multiplying by '+fmt(m)+' each year. This is growth.' : v.p < 0 ? 'A fall of '+(-v.p)+'% means multiplying by '+fmt(m)+' each year. This is decay.' : 'With no change, the multiplier is 1 and the amount stays the same.')+'</p>'; }),
  body:w => Pp('Many quantities change by the same percentage in each time period. Populations, prices and the value of a car all behave this way.')+
    sec('Growth','A quantity that rises by 5% each year is multiplied by 1.05 each year. After n years it has been multiplied by 1.05 n times.','!A = P × m<sup>n</sup>, where P is the starting amount, m is the multiplier and n is the number of periods.',hb('pctmult'))+
    sec('Decay','A quantity that falls by a fixed percentage is multiplied by a number less than 1. A car that loses 15% of its value each year keeps 85% of it, so the multiplier is 0.85.','!A $20 000 car after 3 years: 20 000 × '+S('0.85',3)+' = $12 282.50.',w)+
    sec('Half-life','Some things halve in every equal period of time. That period is called the <b>half-life</b>. After one half-life '+fr(1,2)+' remains, after two '+fr(1,4)+' remains, and after three '+fr(1,8)+' remains.')+
    sec('Choosing a model','If a quantity goes up or down by the same amount in each step, a straight line fits it. This is a <b>linear</b> model. If it is multiplied by the same number in each step, an <b>exponential</b> model fits it.',tbl([0,1,2,3],[100,120,140,160],'Year','Plan A')+tbl([0,1,2,3],[100,120,144,172.8],'Year','Plan B'),'Plan A adds 20 each year, so it is linear. Plan B multiplies by 1.2 each year, so it is exponential.'),
  help:['pctmult','pctmult','pctmult','mulfrac','pctmult','pctmult'],
  gens:[
    () => { var p = pick([5,10,12,15,20,25,30]);
      return Q('A car loses '+p+'% of its value each year. Which multiplier gives its value after one year?', N(1-p/100), [N(p/100), N(1+p/100), N(100-p)], 'Losing '+p+'% leaves '+(100-p)+'%, which is '+(1-p/100)+' as a decimal.'); },
    () => { var V = 2000*rnd(4,20), p = pick([10,15,20,25]), n = pick([2,3]), m = 1-p/100;
      return Q('A car worth $'+V+' loses '+p+'% of its value each year. What is it worth after '+n+' years?', D(V*Math.pow(m,n)), [D(V*(1-n*p/100)), D(V*Math.pow(1+p/100,n)), D(V*m)], 'The multiplier is '+m+'. '+V+' × '+S(m,n)+' = '+money(V*Math.pow(m,n))+'.', {calc:true}); },
    () => { var P = 100*rnd(2,50), g = pick([2,3,4,5,8,10]), n = rnd(2,4), m = 1+g/100, R = Math.round;
      return Q('A town of '+P+' people grows by '+g+'% a year. What is its population after '+n+' years, to the nearest whole number?', N(R(P*Math.pow(m,n))), [N(R(P*(1+g*n/100))), N(R(P*m)), N(R(P*Math.pow(1-g/100,n)))], 'The multiplier is '+m+'. '+P+' × '+S(m,n)+' = '+r2(P*Math.pow(m,n))+', which rounds to '+R(P*Math.pow(m,n))+'.', {calc:true}); },
    () => { var h = pick([2,5,10,30]), k = rnd(3,5), f = d => N(1/d, fr(1,d));
      return Q('The amount of a substance halves every '+h+' years. What fraction of it remains after '+(k*h)+' years?', f(Math.pow(2,k)), [f(2*k), f(k), f(k*k)], (k*h)+' years is '+k+' half-lives. Halving '+k+' times leaves '+fr(1,Math.pow(2,k))+'.'); },
    () => { var s = 10*rnd(2,9), ex = Math.random() < 0.5, m = pick([2,3]), d = 5*rnd(2,8), ys = [0,1,2,3].map(i => ex ? s*Math.pow(m,i) : s+d*i), first = ys[1]-ys[0];
      var o = ex ? ['Exponential: each value is '+m+' times the one before','Linear: each value is '+first+' more than the one before','Linear: each value is '+m+' more than the one before','Exponential: each value is '+first+' times the one before']
                 : ['Linear: each value is '+d+' more than the one before','Exponential: each value is '+d+' times the one before','Exponential: each value is 2 times the one before','Linear: each value is '+(2*d)+' more than the one before'];
      return Q('Which model fits this table?'+tbl([0,1,2,3],ys,'Step','Value'), o[0], o.slice(1), ex ? ys[1]+' ÷ '+ys[0]+' = '+m+', '+ys[2]+' ÷ '+ys[1]+' = '+m+' and '+ys[3]+' ÷ '+ys[2]+' = '+m+'. Multiplying by the same number each time is exponential.' : 'Each value is '+d+' more than the one before. Adding the same amount each time is linear.'); },
    () => { var a = pick([50,80,100,120]), m = pick([1.05,1.08,1.1]), n = pick([5,10,15]), A = 1000+a*n, B = 1000*Math.pow(m,n), d = Math.abs(A-B), big = A > B ? 'Plan A' : 'Plan B', sm = A > B ? 'Plan B' : 'Plan A';
      return Q('Plan A adds $'+a+' each year. Plan B multiplies the amount by '+m+' each year. Both start at $1000. Compare them after '+n+' years.', big+' is larger, by '+money(d), [sm+' is larger, by '+money(d), 'The two plans are equal', big+' is larger, by '+money(d+a)],
        'Plan A: 1000 + '+a+' × '+n+' = '+money(A)+'. Plan B: 1000 × '+S(m,n)+' = '+money(B)+'. The difference is '+money(d)+'.', {calc:true}); }
  ]});

/* ---------- 4.3 Direct and inverse proportion ---------- */
var PROPO = ['Directly proportional, because y ÷ x is the same for every pair','Inversely proportional, because x × y is the same for every pair','Neither, because y ÷ x and x × y both change','Both, because y changes when x changes'];
LSN('4.3','Direct and inverse proportion',{
  w:sliderW('w43','Speed, time and distance',[['s','Speed, km/h',20,120,10,60]], v => { var t = 240/v.s, d = 3*v.s;
    return '<div class="barrow"><span>Time for a 240 km trip: 240 ÷ '+v.s+'</span><i style="width:'+(t/12*100)+'%"></i><b>'+fmt(r2(t))+' h</b></div><div class="barrow two"><span>Distance covered in 3 hours: 3 × '+v.s+'</span><i style="width:'+(d/360*100)+'%"></i><b>'+d+' km</b></div>'+
      '<p>Double the speed and the time for the trip halves. That is inverse proportion. Double the speed and the distance covered in 3 hours doubles. That is direct proportion.</p>'; }),
  body:w => Pp('Two quantities are in proportion when a change in one causes a matching change in the other. There are two kinds.')+
    sec('Direct proportion','y is <b>directly proportional</b> to x when y = kx for some fixed number k. Doubling x doubles y. The graph is a straight line through (0, 0).','!Apples cost $4 a kilogram, so cost = 4 × weight. 3 kg cost $12 and 6 kg cost $24.',hb('ratio'))+
    sec('Finding k','Divide any y value by its x value. If 5 kg cost $20, then k = 20 ÷ 5 = 4. The rule is y = 4x, so 8 kg cost $32.')+
    sec('Inverse proportion','y is <b>inversely proportional</b> to x when y = '+fr('k','x')+' for some fixed number k. Doubling x halves y. The graph is a hyperbola.','!A 240 km trip takes 240 ÷ speed hours. At 60 km/h it takes 4 hours. At 120 km/h it takes 2 hours.',w)+
    sec('Telling them apart in a table','In direct proportion, y ÷ x is the same for every pair. In inverse proportion, x × y is the same for every pair.',tbl([1,2,3,4],[5,10,15,20])+tbl([1,2,3,4],[12,6,4,3]),'In the first table y ÷ x is always 5, so it shows direct proportion. In the second table x × y is always 12, so it shows inverse proportion.'),
  help:['ratio','mulfrac','ratio','ratio','ratio','ratio'],
  gens:[
    () => { var k = rnd(2,9), a = rnd(2,6), c = ri(2,12,[a]), b = k*a;
      return Q('y is directly proportional to x. When x = '+a+', y = '+b+'. What is y when x = '+c+'?', N(k*c), [N(b+c-a), N(r2(b*a/c)), N(c)], 'k = '+b+' ÷ '+a+' = '+k+', so y = '+k+'x. When x = '+c+', y = '+(k*c)+'.'); },
    () => { var K = pick([24,36,48,60,72]), ds = [2,3,4,6,8,12].filter(d => K%d === 0), a = pick(ds), c = pick(ds.filter(d => d !== a)), b = K/a;
      return Q('y is inversely proportional to x. When x = '+a+', y = '+b+'. What is y when x = '+c+'?', N(K/c), [N(r2(b*c/a)), N(b-(c-a)), N(K)], 'k = x × y = '+a+' × '+b+' = '+K+', so y = '+fr(K,'x')+'. When x = '+c+', y = '+(K/c)+'.'); },
    () => { var dir = Math.random() < 0.5, xs, ys, k;
      if(dir){ xs = sample([1,2,3,4,5,6],4).sort((a,b) => a-b); k = rnd(2,9); ys = xs.map(x => k*x); }
      else { k = pick([24,36,48,60]); xs = sample([1,2,3,4,6,12].filter(d => k%d === 0),4).sort((a,b) => a-b); ys = xs.map(x => k/x); }
      var ans = dir ? 0 : 1;
      return Q('How are x and y related in this table?'+tbl(xs,ys), PROPO[ans], PROPO.filter((_,i) => i !== ans), dir ? 'y ÷ x is '+k+' for every pair, so y = '+k+'x.' : 'x × y is '+k+' for every pair, so y = '+fr(k,'x')+'.'); },
    () => { var w = pick([2,3,4,6]), d = rnd(4,12), W = w*d, w2 = pick([2,3,4,6,8,12].filter(t => W%t === 0 && t !== w)); if(!w2) return null;
      var f = v => N(v, fmt(v)+' days');
      return Q(w+' workers take '+d+' days to paint a fence. How long do '+w2+' workers take, working at the same rate?', f(W/w2), [f(r2(d*w2/w)), f(d-(w2-w)), f(W)], 'The job needs '+w+' × '+d+' = '+W+' days of work. Shared between '+w2+' workers, that is '+W+' ÷ '+w2+' = '+(W/w2)+' days. More workers take less time, so this is inverse proportion.'); },
    () => { var a = 50*rnd(2,8), b = 6*rnd(2,5), mult = pick([2,3,1.5]), c = b*mult, f = v => N(v, fmt(v)+' g');
      return Q(a+' g of flour makes '+b+' biscuits. How much flour is needed for '+c+' biscuits?', f(a*mult), [f(a+c-b), f(r2(a*b/c)), f(a+c)], c+' ÷ '+b+' = '+mult+', so every amount is multiplied by '+mult+'. '+a+' × '+mult+' = '+(a*mult)+' g.'); },
    () => { var dir = Math.random() < 0.5, m = rnd(2,5), o = dir ? ['It is multiplied by '+m,'It is divided by '+m,'It goes up by '+m,'It stays the same'] : ['It is divided by '+m,'It is multiplied by '+m,'It goes down by '+m,'It stays the same'];
      return Q('y is '+(dir ? 'directly' : 'inversely')+' proportional to x. x is multiplied by '+m+'. What happens to y?', o[0], o.slice(1), dir ? 'In y = kx, multiplying x by '+m+' multiplies y by '+m+'.' : 'In y = '+fr('k','x')+', multiplying x by '+m+' divides y by '+m+'.'); }
  ]});

/* ---------- 4.4 Algorithms ---------- */
function rl(n,lo,hi){ var a = []; for(var i = 0; i < n; i++) a.push(rnd(lo,hi)); return a; }
LSN('4.4','Algorithms',{
  w:stepper('w44','Tracing an algorithm', () => { var L = rl(4,1,9), t = 0, steps = L.map(n => { var s = 'n = '+n+': total becomes '+t+' + '+n+' = <b>'+(t+n)+'</b>'; t += n; return s; });
    return {head:code(['list ← ['+L.join(', ')+']','total ← 0','for each n in list','    total ← total + n','output total']), steps:steps.concat(['The loop has used every value. The output is <b>'+t+'</b>'])}; }),
  body:w => Pp('An algorithm is a list of steps that solves a problem. Each step is exact enough for a computer to follow.')+
    sec('Pseudocode','Algorithms written for people to read are in <b>pseudocode</b>, which is part way between English and a programming language. The steps are carried out in order from top to bottom.')+
    sec('Variables','A <b>variable</b> is a named place that stores a value. The arrow ← means store. The step total ← 0 stores 0 in the variable total. The step total ← total + 5 works out total + 5 and stores the answer back in total.')+
    sec('Lists','A <b>list</b> stores several values in order, for example prices ← [4, 7, 5]. Each value has a position. In this app position 1 is the first value, so position 2 of prices holds 7. Some programming languages count positions from 0.')+
    sec('Loops','A <b>loop</b> repeats steps. The step “for each n in list” runs the indented steps once for every value in the list, with n set to each value in turn. The step “repeat 3 times” runs the indented steps three times.',w)+
    sec('Decisions','The step “if … then” runs a step only when a condition is true.',code(['count ← 0','for each n in list','    if n > 5 then count ← count + 1','output count']),'This algorithm counts how many values in the list are greater than 5.')+
    sec('Tracing','To find out what an algorithm does, trace it. Write down the value of every variable after each step.')+
    sec('Algorithms on points','A list can hold points. This algorithm moves every point 2 to the right and 1 down, which is how a computer moves a shape.',code(['for each (x, y) in points','    output (x + 2, y − 1)']),hb('plot')),
  help:['subst','ineq','ineq','subst','subst','plot'],
  gens:[
    () => { var L = rl(4,1,9), s = L.reduce((a,b) => a+b, 0);
      return Q('What does this algorithm output?'+code(['list ← ['+L.join(', ')+']','total ← 0','for each n in list','    total ← total + n','output total']), N(s), [N(L[3]), N(4), N(s-L[0])], 'total starts at 0 and each value is added in turn: '+L.join(' + ')+' = '+s+'.'); },
    () => { var L = rl(5,1,12), k = rnd(4,8), big = L.filter(n => n > k), c = big.length;
      return Q('What does this algorithm output?'+code(['list ← ['+L.join(', ')+']','count ← 0','for each n in list','    if n > '+k+' then count ← count + 1','output count']), N(c), [N(5-c), N(big.reduce((a,b) => a+b, 0)), N(c+1)], 'count goes up by 1 for each value greater than '+k+'. '+(c ? 'Those values are '+big.join(', ')+', so the output is '+c+'.' : 'No value is greater than '+k+', so the output is 0.')); },
    () => { var srt = sample([1,2,3,4,5,6,7,8,9,10,11,12],5).sort((a,b) => a-b), mx = srt[4], mn = srt[0], mid = shuffle([1,2,3]), rest = shuffle([srt[1],srt[2],srt[3]]), L = [];
      L[mid[0]] = mx; L[mid[1]] = mn; L[0] = rest[0]; L[4] = rest[1]; L[mid[2]] = rest[2];
      return Q('What does this algorithm output?'+code(['list ← ['+L.join(', ')+']','big ← first value in list','for each n in list','    if n > big then big ← n','output big']), N(mx), [N(mn), N(L[0]), N(L[4])], 'big is replaced whenever a larger value is found, so it ends as the largest value in the list, which is '+mx+'.'); },
    () => { var L = sample(['Carousel','Dodgems','Maze','Coaster','Wheel','Arcade'],4), p = rnd(1,4);
      return Q('rides ← ['+L.join(', ')+']. Positions start at 1. What is the value at position '+p+'?', L[p-1], L.filter((_,i) => i !== p-1), 'Count from the left, starting at 1. Position '+p+' holds '+L[p-1]+'.'); },
    () => { var a = rnd(1,4), b = rnd(1,3), x = a, tr = []; for(var i = 0; i < 3; i++){ x = x*2+b; tr.push(x); }
      return Q('What does this algorithm output?'+code(['x ← '+a,'repeat 3 times','    x ← x × 2 + '+b,'output x']), N(x), [N(tr[0]), N((a*2+b)*3), N(a*8+b)], 'x starts at '+a+'. After each repeat it is '+tr.join(', then ')+'. The output is '+x+'.'); },
    () => { var P = [[rnd(0,4),rnd(0,5)],[rnd(1,6),rnd(1,6)],[rnd(0,5),rnd(2,7)]], dx = nz(-3,3), dy = ri(-3,3,[0,dx]), f = (a,b) => P.map(p => pt(p[0]+a,p[1]+b)).join(', '), t = v => 'x'+pm(v).replace(/^ /,' ');
      return Q('What does this algorithm output?'+code(['points ← ['+P.map(p => pt(p[0],p[1])).join(', ')+']','for each (x, y) in points','    output (x'+pm(dx)+', y'+pm(dy)+')']), f(dx,dy), [f(dx,0), f(dy,dx), f(-dx,-dy)], 'Each x value changes by '+num(dx)+' and each y value changes by '+num(dy)+'.'); }
  ]});

/* ---------- background cards for Zones 3 and 4 ---------- */
HELP.gradient = {title:'Gradient from two points', btn:'finding a gradient', zone:3,
  html:'<p>The gradient of a line measures how steep it is.</p><p>Choose two points on the line. The <b>rise</b> is how far up you go from the first point to the second. The <b>run</b> is how far to the right you go. Gradient = rise ÷ run.</p>'+
       '<p class="note">From (1, 2) to (3, 8) the rise is 8 − 2 = 6 and the run is 3 − 1 = 2. The gradient is 6 ÷ 2 = 3.</p><p>If the line goes down from left to right, the rise is negative, so the gradient is negative.</p>',
  gen:() => { var m = rnd(2,5)*pick([1,-1]), r = rnd(2,4), x1 = rnd(0,4), y1 = rnd(-3,6);
    return Q('What is the gradient of the line through '+pt(x1,y1)+' and '+pt(x1+r,y1+m*r)+'?', N(m), [N(m*r), N(-m), N(m+r)], 'Rise = '+num(m*r)+' and run = '+r+'. Gradient = '+num(m*r)+' ÷ '+r+' = '+num(m)+'.'); }};
HELP.pct = {title:'A percentage of an amount', btn:'percentages of an amount', zone:4,
  html:'<p>Per cent means out of 100. To find a percentage of an amount, change the percentage to a decimal and multiply.</p><p>To change a percentage to a decimal, divide by 100: 4% = 0.04 and 25% = 0.25.</p>'+
       '<p class="note">4% of $500 = 0.04 × 500 = $20</p>',
  gen:() => { var p = pick([2,3,4,5,6,8,10,12,15,20,25]), A = 100*rnd(1,20), v = p*A/100, d = x => N(x,'$'+fmt(x));
    return Q('What is '+p+'% of $'+A+'?', d(v), [d(v*10), d(r2(A/p)), d(A-p)], p+'% = '+(p/100)+' as a decimal. '+(p/100)+' × '+A+' = '+fmt(v)+'.'); }};
HELP.ratio = {title:'Rates and scaling up', btn:'rates', zone:4,
  html:'<p>A rate tells you how much of one thing goes with one unit of another, such as dollars per kilogram.</p><p>To find a rate, divide. To use a rate, multiply.</p>'+
       '<p class="note">5 kg of apples cost $20. One kilogram costs 20 ÷ 5 = $4. So 8 kg cost 8 × 4 = $32.</p>',
  gen:() => { var k = rnd(2,9), a = rnd(2,6), c = ri(2,12,[a]), d = x => N(x,'$'+fmt(x));
    return Q(a+' kg of apples cost $'+(k*a)+'. How much do '+c+' kg cost?', d(k*c), [d(k*a+c-a), d(k*a+c), d(r2(k*a*a/c))], 'One kilogram costs '+(k*a)+' ÷ '+a+' = $'+k+'. So '+c+' kg cost '+c+' × '+k+' = $'+(k*c)+'.'); }};
HELP.pythag = {title:'Pythagoras’ theorem', btn:'Pythagoras’ theorem', zone:5,
  html:'<p>In a right-angled triangle, the longest side is opposite the right angle. It is called the <b>hypotenuse</b>.</p><p>Pythagoras’ theorem says that the square of the hypotenuse equals the sum of the squares of the other two sides: '+S('a',2)+' + '+S('b',2)+' = '+S('c',2)+', where c is the hypotenuse.</p>'+
       '<p class="note">The two shorter sides are 3 and 4. Then '+S('c',2)+' = 9 + 16 = 25, so c = √25 = 5.</p><p>To find a shorter side, subtract: if the hypotenuse is 13 and one side is 5, the other side is √(169 − 25) = √144 = 12.</p>',
  gen:() => { var t = pick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]]), hyp = Math.random() < 0.5;
    return hyp ? Q('A right-angled triangle has shorter sides '+t[0]+' and '+t[1]+'. How long is the hypotenuse?', N(t[2]), [N(t[0]+t[1]), N(t[0]*t[0]+t[1]*t[1]), N(t[1]-t[0])], t[0]+'<sup>2</sup> + '+t[1]+'<sup>2</sup> = '+(t[0]*t[0])+' + '+(t[1]*t[1])+' = '+(t[2]*t[2])+'. The square root of '+(t[2]*t[2])+' is '+t[2]+'.')
               : Q('A right-angled triangle has hypotenuse '+t[2]+' and one shorter side '+t[0]+'. How long is the other side?', N(t[1]), [N(t[2]-t[0]), N(t[2]+t[0]), N(r2(Math.sqrt(t[2]*t[2]+t[0]*t[0])))], t[2]+'<sup>2</sup> − '+t[0]+'<sup>2</sup> = '+(t[2]*t[2])+' − '+(t[0]*t[0])+' = '+(t[1]*t[1])+'. The square root of '+(t[1]*t[1])+' is '+t[1]+'.'); }};

HELPMAP['3.2'] = ['plot','plot','squares','plot','squares'];
