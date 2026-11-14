"use strict";
/* Zone 7, Visitor Centre (statistics) and Zone 8, Sideshow Alley (probability) */
function F(a,b){ var g = gcd(a,b) || 1; return a === 0 ? N(0,'0') : a === b ? N(1,'1') : N(a/b, fr(a/g,b/g)); }
function frr(a,b){ var g = gcd(a,b) || 1; return a === 0 ? '0' : a === b ? '1' : fr(a/g,b/g); }
function pc(v){ return N(v, fmt(v)+'%'); }
function sortN(a){ return a.slice().sort((x,y) => x-y); }
function med(a){ var s = sortN(a), n = s.length; return n%2 ? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2; }
function five(a){ var s = sortN(a), n = s.length, h = Math.floor(n/2); return [s[0], med(s.slice(0,h)), med(s), med(s.slice(n-h)), s[n-1]]; }
function mean(a){ return a.reduce((x,y) => x+y, 0)/a.length; }
function inc(f){ return f[0] < f[1] && f[1] < f[2] && f[2] < f[3] && f[3] < f[4]; }
function dset(n, lo, hi){ for(;;){ var a = sortN(rl(n,lo,hi)); if(inc(five(a))) return a; } }
function f5(){ var a = 5*rnd(2,6), b = a+5*rnd(1,3), c = b+5*rnd(1,3), d = c+5*rnd(1,3); return [a,b,c,d,d+5*rnd(1,4)]; } // five-number summary on multiples of 5
function w3(pool, c){ // three different wrong numbers: the pool first, then nearby values if the pool runs short
  var u = pool.filter((x,i,a) => x !== c && x > 0 && isFinite(x) && a.indexOf(x) === i);
  [c+10,c+5,c-5,c+1,c+2,c+3,c+4].forEach(x => { if(u.length < 3 && x > 0 && x !== c && u.indexOf(x) < 0) u.push(x); });
  return u.slice(0,3);
}
function distinct(n, lo, hi){ var a = []; for(var i = lo; i <= hi; i++) a.push(i); return sample(a,n); }
function wF(pool, c){ var u = []; pool.concat([[1,2],[1,3],[2,3],[1,4],[3,4],[1,6],[5,6]]).forEach(q => { var v = q[0]/q[1]; if(q[0] > 0 && q[0] <= q[1] && Math.abs(v-c[0]/c[1]) > 1e-9 && !u.some(z => Math.abs(z[0]/z[1]-v) < 1e-9)) u.push(q); }); return u.slice(0,3).map(q => F(q[0],q[1])); }
function corr(p){ var n = p.length, mx = mean(p.map(q => q[0])), my = mean(p.map(q => q[1])), sxy = 0, sxx = 0, syy = 0;
  p.forEach(q => { sxy += (q[0]-mx)*(q[1]-my); sxx += (q[0]-mx)*(q[0]-mx); syy += (q[1]-my)*(q[1]-my); }); return sxy/Math.sqrt(sxx*syy); }

/* ---------- diagrams ---------- */
function boxSVG(sets, lo, hi, step, minor){
  var n = sets.length, H = 36+44*n, X = v => +(36+(v-lo)/(hi-lo)*246).toFixed(1), ay = H-22, s = '', v;
  for(v = lo; v <= hi+1e-9; v += (minor || step)) s += '<line class="g" x1="'+X(v)+'" y1="4" x2="'+X(v)+'" y2="'+ay+'"/>';
  s += '<line class="ax" x1="28" y1="'+ay+'" x2="292" y2="'+ay+'"/>';
  for(v = lo; v <= hi+1e-9; v += step) s += '<line class="ax" x1="'+X(v)+'" y1="'+ay+'" x2="'+X(v)+'" y2="'+(ay+5)+'"/><text class="tpl" x="'+X(v)+'" y="'+(ay+17)+'" text-anchor="middle">'+fmt(v)+'</text>';
  sets.forEach((b,i) => { var f = b.f, y = 24+44*i, we = b.wmax === undefined ? f[4] : b.wmax;
    s += (b.lab ? '<text class="dl" x="6" y="'+(y+5)+'">'+b.lab+'</text>' : '')+
      '<line class="thin" x1="'+X(f[0])+'" y1="'+y+'" x2="'+X(f[1])+'" y2="'+y+'"/><line class="thin" x1="'+X(f[3])+'" y1="'+y+'" x2="'+X(we)+'" y2="'+y+'"/>'+
      '<line class="thin" x1="'+X(f[0])+'" y1="'+(y-7)+'" x2="'+X(f[0])+'" y2="'+(y+7)+'"/><line class="thin" x1="'+X(we)+'" y1="'+(y-7)+'" x2="'+X(we)+'" y2="'+(y+7)+'"/>'+
      '<rect class="'+(i%2 ? 'fillB' : 'fillA')+'" x="'+X(f[1])+'" y="'+(y-13)+'" width="'+(X(f[3])-X(f[1])).toFixed(1)+'" height="26"/><line class="cv" x1="'+X(f[2])+'" y1="'+(y-13)+'" x2="'+X(f[2])+'" y2="'+(y+13)+'" style="stroke-width:3"/>'+
      (b.out || []).map(o => '<circle class="tp" cx="'+X(o)+'" cy="'+y+'" r="4"/>').join(''); });
  return '<svg class="graph dia" viewBox="0 0 300 '+H+'" role="img" aria-label="Box plot">'+s+'</svg>';
}
function histSVG(fq){
  var n = fq.length, mx = Math.max.apply(null,fq), w = 250/n, s = '';
  fq.forEach((f,i) => { s += '<rect class="fillB" x="'+(30+i*w).toFixed(1)+'" y="'+(112-f/mx*100).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+(f/mx*100).toFixed(1)+'"/>'; });
  return '<svg class="graph dia" viewBox="0 0 300 120" role="img" aria-label="Histogram"><line class="ax" x1="30" y1="6" x2="30" y2="112"/>'+s+'<line class="ax" x1="24" y1="112" x2="286" y2="112"/></svg>';
}
function treeSVG(nm, p1, p2, ends){
  var s = '', Y1 = [55,155], Y2 = [[25,85],[125,185]];
  [0,1].forEach(i => {
    s += '<line class="thin" x1="14" y1="105" x2="84" y2="'+Y1[i]+'"/><text class="tpl" x="44" y="'+(i ? 146 : 70)+'" text-anchor="end">'+p1[i]+'</text><text class="dl" x="92" y="'+(Y1[i]+5)+'" text-anchor="middle">'+nm[i]+'</text>';
    [0,1].forEach(j => { var y = Y2[i][j];
      s += '<line class="thin" x1="102" y1="'+Y1[i]+'" x2="172" y2="'+y+'"/><text class="tpl" x="134" y="'+((Y1[i]+y)/2+(j ? 16 : -7))+'" text-anchor="end">'+p2[i][j]+'</text><text class="dl" x="180" y="'+(y+5)+'" text-anchor="middle">'+nm[j]+'</text><text class="tpl" x="196" y="'+(y+4)+'">'+ends[i*2+j]+'</text>'; });
  });
  return '<svg class="graph dia" viewBox="0 0 300 205" role="img" aria-label="Tree diagram">'+s+'</svg>';
}
function barsSVG(a, b, start){
  var h = v => Math.max(0,(v-start)/(100-start)*120);
  return '<svg class="graph dia" viewBox="0 0 300 170" role="img" aria-label="Bar graph"><line class="ax" x1="50" y1="14" x2="50" y2="140"/><line class="ax" x1="44" y1="140" x2="280" y2="140"/>'+
    '<text class="tpl" x="44" y="144" text-anchor="end">'+start+'</text><text class="tpl" x="44" y="24" text-anchor="end">100</text>'+
    '<rect class="fillA" x="90" y="'+(140-h(a)).toFixed(1)+'" width="60" height="'+h(a).toFixed(1)+'"/><rect class="fillB" x="180" y="'+(140-h(b)).toFixed(1)+'" width="60" height="'+h(b).toFixed(1)+'"/>'+
    '<text class="dl" x="120" y="158" text-anchor="middle">A: '+a+'</text><text class="dl" x="210" y="158" text-anchor="middle">B: '+b+'</text></svg>';
}
// two-way table with totals. c = [[a,b],[c,d]]; o.hide = [row,col] shows a question mark
function tw(R, C, c, o){
  o = o || {};
  var rt = [c[0][0]+c[0][1], c[1][0]+c[1][1]], ct = [c[0][0]+c[1][0], c[0][1]+c[1][1]];
  var cell = (i,j,v) => '<td>'+(o.hide && o.hide[0] === i && o.hide[1] === j ? '<b>?</b>' : v)+'</td>';
  return '<div class="tablewrap"><table class="vals"><tr><th></th><th>'+C[0]+'</th><th>'+C[1]+'</th><th>Total</th></tr>'+
    [0,1].map(i => '<tr><th>'+R[i]+'</th>'+cell(i,0,c[i][0])+cell(i,1,c[i][1])+cell(i,2,rt[i])+'</tr>').join('')+
    '<tr><th>Total</th>'+cell(2,0,ct[0])+cell(2,1,ct[1])+cell(2,2,rt[0]+rt[1])+'</tr></table></div>';
}
var TWC = [
  {R:['Year 9','Year 10'], C:['Walk','Do not walk'], g:['Year 9 students','Year 10 students'], yes:'walk to school', all:'students', rv:'year level', cv:'walking to school', rel:'who', unit:'student', gi:['is in Year 9','is in Year 10'], ys:'walks to school'},
  {R:['Adults','Children'], C:['Swim','Cannot swim'], g:['adults','children'], yes:'can swim', all:'people', rv:'age group', cv:'being able to swim', rel:'who', unit:'person', gi:['is an adult','is a child'], ys:'can swim'},
  {R:['Morning','Afternoon'], C:['Late','On time'], g:['morning trains','afternoon trains'], yes:'were late', all:'trains', rv:'time of day', cv:'running late', rel:'that', unit:'train', gi:['ran in the morning','ran in the afternoon'], ys:'was late'}
];
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
// random table with row percentages that are multiples of 10
function twGen(equal){
  var x = pick(TWC), rts = sample([20,30,40,50,60,80],2), p0 = 10*rnd(2,8), p1 = equal ? p0 : 10*ri(2,8,[p0]);
  var c = [[rts[0]*p0/100, rts[0]*(100-p0)/100],[rts[1]*p1/100, rts[1]*(100-p1)/100]];
  return {x:x, c:c, rt:rts, ct:[c[0][0]+c[1][0], c[0][1]+c[1][1]], T:rts[0]+rts[1], p:[p0,p1]};
}

/* ---------- 7.1 Quartiles and box plots ---------- */
LSN('7.1','Quartiles and box plots',{
  w:sliderW('w71','One unusual value',[['x','Largest value',30,60,1,34]], v => { var out = v.x > 42;
    return boxSVG([{f:[12,17,22,27,v.x], wmax:out ? 30 : undefined, out:out ? [v.x] : []}],10,60,10,5)+
      '<p>The data is 12, 15, 17, 18, 20, 22, 24, 25, 27, 30 and '+v.x+'.</p><p>Range: '+v.x+' − 12 = <b>'+(v.x-12)+'</b>. IQR: 27 − 17 = <b>10</b>.</p>'+
      '<p>'+(out ? v.x+' is more than 27 + 1.5 × 10 = 42, so it is an outlier. It is drawn as a dot, and the whisker stops at 30.' : v.x+' is not more than 27 + 1.5 × 10 = 42, so it is not an outlier.')+' Changing the largest value changes the range but not the IQR.</p>'; }),
  body:w => Pp('A long list of numbers is easier to understand when it is summarised. This lesson covers a summary made of five numbers and a graph that shows it.')+
    sec('The median','The <b>median</b> is the middle value when the data is written in order. For 3, 5, 8, 9, 12 the median is 8. If there are two middle values, the median is halfway between them.',hb('centre'))+
    sec('Quartiles','Quartiles split ordered data into four equal parts. The median splits the data into a lower half and an upper half. The <b>lower quartile</b>, Q1, is the median of the lower half. The <b>upper quartile</b>, Q3, is the median of the upper half.','!For 2, 4, 5, 7, 8, 10, 13 the median is 7. The lower half is 2, 4, 5, so Q1 = 4. The upper half is 8, 10, 13, so Q3 = 10.','When there is an odd number of values, this app leaves the median out of both halves. Some textbooks and calculators use a slightly different method, so their quartiles can differ a little.')+
    sec('The five-number summary','The five-number summary is the minimum, Q1, the median, Q3 and the maximum. The <b>range</b> is the maximum minus the minimum.')+
    sec('The interquartile range','The <b>interquartile range</b>, or IQR, is Q3 − Q1. It measures the spread of the middle half of the data.')+
    sec('Box plots','A box plot is a picture of the five-number summary. The box runs from Q1 to Q3, with a line at the median. The lines at each side, called whiskers, run out to the minimum and the maximum. About a quarter of the data lies in each of the four sections.',boxSVG([{f:[2,4,7,10,13]}],0,14,2,1))+
    sec('Outliers','An <b>outlier</b> is a value that is far from the rest of the data. A commonly used test is this: a value is an outlier if it is more than 1.5 × IQR below Q1 or more than 1.5 × IQR above Q3. On a box plot an outlier is drawn as a separate dot.',w),
  help:['centre','centre','centre','centre','pct','centre'],
  gens:[
    () => { var n = pick([7,11]), lo = rnd(1,20), a = dset(n,lo,lo+(n === 7 ? 20 : 30)), f = five(a), h = (n-1)/2, k = rnd(1,3), nm = ['','lower quartile (Q1)','median','upper quartile (Q3)'][k];
      var pool = w3([f[1],f[2],f[3],a[(h-1)/2+1],a[h+1],a[h+(h+1)/2+1],f[0],f[4]], f[k]);
      return Q('Here are '+n+' values in order: '+a.join(', ')+'. What is the '+nm+'?', N(f[k]), pool.slice(0,3).map(x => N(x)),
        'The median is the middle value, '+f[2]+'. '+(k === 1 ? 'The lower half is '+a.slice(0,h).join(', ')+', and its middle value is '+f[1]+'.' : k === 3 ? 'The upper half is '+a.slice(n-h).join(', ')+', and its middle value is '+f[3]+'.' : 'There are '+h+' values on each side of it.')); },
    () => { var n = pick([7,11]), lo = rnd(1,20), a = dset(n,lo,lo+(n === 7 ? 20 : 30)), f = five(a), h = (n-1)/2, c = f[3]-f[1];
      return Q('Here are '+n+' values in order: '+a.join(', ')+'. What is the interquartile range?', N(c), w3([f[4]-f[0],f[3]-f[2],f[2]-f[1],f[3],f[2]],c).slice(0,3).map(x => N(x)),
        'The lower half is '+a.slice(0,h).join(', ')+', so Q1 = '+f[1]+'. The upper half is '+a.slice(n-h).join(', ')+', so Q3 = '+f[3]+'. IQR = '+f[3]+' − '+f[1]+' = '+c+'.'); },
    () => { var f = f5(), k = rnd(0,4), nm = ['median','range','interquartile range','lower quartile','upper quartile'][k], vals = [f[2],f[4]-f[0],f[3]-f[1],f[1],f[3]], c = vals[k];
      return Q('What is the '+nm+' of the data shown in this box plot?'+boxSVG([{f:f}],0,100,10,5), N(c), w3(vals.concat([f[0],f[4]]),c).slice(0,3).map(x => N(x)),
        ['The line inside the box is at '+c+'.','The whiskers end at '+f[0]+' and '+f[4]+'. '+f[4]+' − '+f[0]+' = '+c+'.','The box runs from '+f[1]+' to '+f[3]+'. '+f[3]+' − '+f[1]+' = '+c+'.','The left end of the box is at '+c+'.','The right end of the box is at '+c+'.'][k]); },
    () => { var q1 = 2*rnd(10,18), iqr = 2*rnd(2,6), q3 = q1+iqr, lo = q1-1.5*iqr, hi = q3+1.5*iqr, up = lo < 6 || Math.random() < 0.6, o = up ? hi+rnd(1,5) : lo-rnd(1,4);
      return Q('A set of data has Q1 = '+q1+' and Q3 = '+q3+'. Using the 1.5 × IQR test, which of these values is an outlier?', N(o), [N(up ? hi-rnd(1,3) : lo+rnd(1,3)), N(up ? lo+rnd(1,3) : hi-rnd(1,3)), N(q1+rnd(1,iqr-1))],
        'IQR = '+q3+' − '+q1+' = '+iqr+', and 1.5 × '+iqr+' = '+(1.5*iqr)+'. Outliers are below '+q1+' − '+(1.5*iqr)+' = '+lo+' or above '+q3+' + '+(1.5*iqr)+' = '+hi+'. Only '+o+' is outside these limits.'); },
    () => { var n = 4*rnd(5,25), k = rnd(0,3), nm = ['below Q1','above the median','between Q1 and Q3','above Q1'][k], c = [n/4,n/2,n/2,3*n/4][k];
      return Q('A box plot shows the marks of '+n+' students. About how many of the students have marks '+nm+'?', N(c), w3([n/4,n/2,3*n/4,n],c).map(x => N(x)),
        'Each of the four sections of a box plot holds about a quarter of the data. '+['One quarter','Two quarters','Two quarters','Three quarters'][k]+' of '+n+' is '+c+'.'); },
    () => { var A = f5(), B = f5(), ia = A[3]-A[1], ib = B[3]-B[1]; if(A[2] === B[2] || ia === ib) return null;
      var o = [['A','A'],['A','B'],['B','A'],['B','B']].map(p => p[0] === p[1] ? 'Set '+p[0]+' has the larger median and the larger IQR' : 'Set '+p[0]+' has the larger median and set '+p[1]+' has the larger IQR'), c = (A[2] > B[2] ? 0 : 2)+(ia > ib ? 0 : 1);
      if(A[2] < B[2]) c = ia > ib ? 2 : 3;
      return Q('The table gives the five-number summaries of two sets of data. Which statement is correct?<div class="tablewrap"><table class="vals"><tr><th></th><th>Min</th><th>Q1</th><th>Median</th><th>Q3</th><th>Max</th></tr><tr><th>A</th>'+A.map(x => '<td>'+x+'</td>').join('')+'</tr><tr><th>B</th>'+B.map(x => '<td>'+x+'</td>').join('')+'</tr></table></div>',
        o[c], o.filter((_,i) => i !== c), 'The medians are '+A[2]+' for A and '+B[2]+' for B. The IQR of A is '+A[3]+' − '+A[1]+' = '+ia+'. The IQR of B is '+B[3]+' − '+B[1]+' = '+ib+'.'); }
  ]});

/* ---------- 7.2 Comparing sets of data ---------- */
LSN('7.2','Comparing sets of data',{
  w:sliderW('w72','Two classes on one scale',[['s','Move B',-15,15,5,5],['k','Spread of B',0.5,1.5,0.25,1]], v => { var A = [40,52,60,68,80], B = A.map(x => 60+v.s+v.k*(x-60)), qb = B[3]-B[1];
    return boxSVG([{lab:'A',f:A},{lab:'B',f:B}],0,120,20,10)+'<p>Median of A: 60. Median of B: '+fmt(B[2])+'.</p><p>IQR of A: 16. IQR of B: '+fmt(qb)+'.</p>'+
      '<p>'+(B[2] > 60 ? 'B has the higher median' : B[2] < 60 ? 'A has the higher median' : 'The medians are equal')+'. '+(qb > 16 ? 'B has the larger IQR, so its marks are more spread out.' : qb < 16 ? 'B has the smaller IQR, so its marks are more consistent.' : 'The IQRs are equal, so the two classes are equally spread out.')+'</p>'; }),
  body:w => Pp('Two sets of data are compared by looking at four things: the centre, the spread, the shape and any outliers.')+
    sec('Centre','The centre is a typical value for the data. The <b>median</b> is the middle value. The <b>mean</b> is the total of the values divided by the number of values.',hb('centre'))+
    sec('Spread','The spread shows how varied the data is. The <b>range</b> covers all of the data. The <b>IQR</b> covers the middle half. A smaller spread means the values are closer together, so the results are more consistent.')+
    sec('Shape','A set of data is <b>symmetric</b> when its two sides look about the same.',histSVG([1,3,6,8,6,3,1]),'It is <b>positively skewed</b> when it has a long tail of high values on the right.',histSVG([3,8,6,4,3,2,1]),'It is <b>negatively skewed</b> when it has a long tail of low values on the left.',histSVG([1,2,3,4,6,8,3]))+
    sec('Choosing the measures','A few very large values pull the mean upward but hardly change the median. For skewed data, or data with outliers, the median and the IQR describe the data better than the mean and the range.')+
    sec('Parallel box plots','Box plots drawn on the same scale make a comparison easy. Compare the positions of the median lines for the centre, and the lengths of the boxes for the spread.',w)+
    sec('Writing a comparison','A good comparison uses numbers and refers to what the data is about. For example: “The median travel time by bus is 8 minutes longer than by train. The bus times are also more spread out, with an IQR of 12 minutes compared with 5 minutes.”'),
  help:['centre','centre',null,'centre','centre','centre'],
  gens:[
    () => { var A = f5(), B = f5(), ia = A[3]-A[1], ib = B[3]-B[1]; if(A[2] === B[2] || ia === ib) return null;
      var o = ['Class A has the higher median and its marks are more spread out','Class A has the higher median and its marks are less spread out','Class B has the higher median and its marks are more spread out','Class B has the higher median and its marks are less spread out'], c = A[2] > B[2] ? (ia > ib ? 0 : 1) : (ib > ia ? 2 : 3);
      return Q('The box plots show the test marks of class A and class B. Which statement is correct?'+boxSVG([{lab:'A',f:A},{lab:'B',f:B}],0,100,10,5), o[c], o.filter((_,i) => i !== c),
        'The medians are '+A[2]+' for A and '+B[2]+' for B. The IQRs are '+ia+' for A and '+ib+' for B. A larger IQR means the marks are more spread out.'); },
    () => { var a = sortN(distinct(4,10,30)), sum = a[0]+a[1]+a[2]+a[3], big = rnd(12,24)*5, d, m, md = a[2]; big += (5-(sum+big)%5)%5; d = a.concat([big]); m = mean(d);
      return Q('A set of data is '+shuffle(d.slice()).join(', ')+'. How much larger is the mean than the median?', N(m-md), w3([m,md,big-md,big-m],m-md).slice(0,3).map(x => N(x)),
        'The total is '+(m*5)+', so the mean is '+(m*5)+' ÷ 5 = '+m+'. In order the data is '+d.join(', ')+', so the median is '+md+'. '+m+' − '+md+' = '+(m-md)+'. The one large value pulls the mean up.'); },
    () => { var k = rnd(0,3), fq = [[1,3,6,8,6,3,1],[3,8,6,4,3,2,1],[1,2,3,4,6,8,3],[5,5,5,5,5,5,5]][k].map(x => k === 3 ? x : x+rnd(0,1)*0.4), o = ['Symmetric: the two sides look about the same','Positively skewed: there is a long tail on the right','Negatively skewed: there is a long tail on the left','Evenly spread: every column is the same height'];
      return Q('Which description fits the shape of this data?'+histSVG(fq), o[k], o.filter((_,i) => i !== k), ['The tallest column is in the middle and the columns fall away evenly on both sides.','Most of the data is on the left, and the columns get shorter toward the right.','Most of the data is on the right, and the columns get shorter toward the left.','All the columns are the same height.'][k]); },
    () => { var nm = sample(NAMES,2), m1 = rnd(12,25), m2 = m1+rnd(2,6), q1 = rnd(2,5), q2 = q1+rnd(2,6);
      return Q('Over a season, '+nm[0]+'’s scores have a median of '+m1+' and an IQR of '+q1+'. '+nm[1]+'’s scores have a median of '+m2+' and an IQR of '+q2+'. Who is the more consistent scorer?', nm[0]+', because an IQR of '+q1+' is smaller than an IQR of '+q2,
        [nm[1]+', because a median of '+m2+' is higher than a median of '+m1, nm[1]+', because an IQR of '+q2+' is larger than an IQR of '+q1, nm[0]+', because a median of '+m1+' is lower than a median of '+m2],
        'Consistent means the scores are close together. The IQR measures spread, and '+nm[0]+' has the smaller IQR. The median measures the centre, not the consistency.'); },
    () => { var m = rnd(20,60), q = rnd(6,18), k = rnd(3,9), dbl = Math.random() < 0.4, o = (a,b) => 'Median '+a+' and IQR '+b;
      return dbl ? Q('A set of data has a median of '+m+' and an IQR of '+q+'. Every value is doubled. What are the new median and IQR?', o(2*m,2*q), [o(2*m,q), o(m,2*q), o(m+2,q+2)], 'Doubling every value doubles the median. It also doubles the gap between any two values, so the IQR doubles too.')
        : Q('A set of data has a median of '+m+' and an IQR of '+q+'. Then '+k+' is added to every value. What are the new median and IQR?', o(m+k,q), [o(m+k,q+k), o(m,q), o(m,q+k)], 'Adding '+k+' to every value moves the median up by '+k+'. The gaps between the values stay the same, so the IQR does not change.'); },
    () => { var A = f5(), B = f5(), ia = A[3]-A[1], ib = B[3]-B[1], useM = Math.random() < 0.5; if(A[2] === B[2] || ia === ib) return null;
      var c = useM ? Math.abs(A[2]-B[2]) : Math.abs(ia-ib), pool = w3([Math.abs(A[2]-B[2]),Math.abs(ia-ib),Math.abs(A[4]-B[4]),Math.abs(A[3]-B[3]),Math.abs(A[1]-B[1]),c+5,c+10],c).filter(x => x > 0);
      return Q('The box plots show the test marks of class A and class B. '+(useM ? 'What is the difference between the two medians?' : 'What is the difference between the two IQRs?')+boxSVG([{lab:'A',f:A},{lab:'B',f:B}],0,100,10,5), N(c), pool.slice(0,3).map(x => N(x)),
        useM ? 'The medians are '+A[2]+' and '+B[2]+'. The difference is '+c+'.' : 'The IQR of A is '+A[3]+' − '+A[1]+' = '+ia+'. The IQR of B is '+B[3]+' − '+B[1]+' = '+ib+'. The difference is '+c+'.'); }
  ]});

/* ---------- 7.3 Scatterplots and lines of good fit ---------- */
var P73 = [[1,3],[2,4.5],[3,4],[4,6],[5,6.5],[6,8],[7,7.5],[8,9.5],[9,10]];
function scat(k){ // k: 0 positive, 1 negative, 2 none, 3 curved
  for(var t = 0; t < 200; t++){ var p = [];
    for(var x = 1; x <= 10; x++){ var e = (Math.random()-0.5)*2.4, y = k === 0 ? 0.9*x+1+e : k === 1 ? 11-0.9*x+e : k === 2 ? 1.5+Math.random()*9 : 10-0.38*(x-5.5)*(x-5.5)+e*0.7; p.push([x,Math.max(0.4,Math.min(11.6,y))]); }
    var r = corr(p); if(k === 0 ? r > 0.85 : k === 1 ? r < -0.85 : k === 2 ? Math.abs(r) < 0.2 : Math.abs(r) < 0.3) return p; }
  return p;
}
var C73 = [{x:'hours of study',y:'test mark',m:[3,6],c:[30,50],xs:[2,9]},{x:'temperature in °C',y:'number of drinks sold',m:[4,8],c:[10,40],xs:[18,35]},{x:'age of a car in years',y:'value of the car in thousands of dollars',m:[-3,-1],c:[30,40],xs:[2,8]}];
LSN('7.3','Scatterplots and lines of good fit',{
  w:sliderW('w73','Fitting a line by eye',[['m','Gradient',0,2,0.1,0.4],['c','y-intercept',0,8,0.5,5]], v => { var up = 0, dn = 0, gap = 0;
    P73.forEach(p => { var d = p[1]-(v.m*p[0]+v.c); gap += Math.abs(d); if(d > 0.05) up++; else if(d < -0.05) dn++; });
    var good = gap/9 < 0.6 && Math.abs(up-dn) <= 2;
    return plotSVG({h:240,x0:0,x1:10,y0:0,y1:12,gx:1,gy:1,lx:2,ly:2,pts:P73.map(p => [p[0],p[1]]),fns:[{f:x => v.m*x+v.c}]})+
      '<p class="rule" style="font-size:18px">y = '+polyH([v.m,v.c])+'</p><p>Points above the line: '+up+'. Points below the line: '+dn+'. Average gap between a point and the line: '+(gap/9).toFixed(2)+'.</p>'+
      '<p class="goal'+(good ? ' done' : '')+'">'+(good ? 'This line follows the points well.' : 'Move the sliders until the line runs through the middle of the points.')+'</p>'; }),
  body:w => Pp('A scatterplot shows whether two numerical quantities are related, such as the temperature each day and the number of drinks a shop sells.')+
    sec('Reading a scatterplot','Each point shows one pair of values. The quantity that might explain the other goes on the horizontal axis. If temperature might affect drink sales, temperature goes on the horizontal axis and sales go on the vertical axis.')+
    sec('Association','When the points rise from left to right, there is a <b>positive association</b>: as one quantity increases, the other tends to increase. When the points fall from left to right, there is a <b>negative association</b>. When the points show no pattern, there is no association. The closer the points are to a straight line, the stronger the association.')+
    sec('A line of good fit','A line of good fit is a straight line drawn through the middle of the points. It follows the direction of the points and has about as many points above it as below it. The line is drawn by eye, so two people may draw slightly different lines.',w,hb('linegraph'))+
    sec('Making predictions','The equation of the line gives predictions. If the line is y = 2x + 3, then for x = 5 the predicted value is 2 × 5 + 3 = 13. A prediction inside the range of the data is called <b>interpolation</b>. A prediction outside the range is called <b>extrapolation</b>. Extrapolation is less reliable, because nobody knows whether the pattern continues.')+
    sec('Association and cause','An association does not show that one quantity causes the other. Ice cream sales and cases of sunburn rise together, but ice cream does not cause sunburn. Hot weather increases both.'),
  help:[null,'subst',null,'linegraph','gradient','subst'],
  gens:[
    () => { var k = rnd(0,3), o = ['Positive: as x increases, y tends to increase','Negative: as x increases, y tends to decrease','No association: the points show no pattern','Not a straight-line pattern: y rises and then falls'];
      return Q('Which description fits this scatterplot?'+plotSVG({h:240,x0:0,x1:11,y0:0,y1:12,gx:1,gy:1,lx:2,ly:2,xl:'x',yl:'y',pts:scat(k)}), o[k], o.filter((_,i) => i !== k),
        ['The points rise from left to right.','The points fall from left to right.','The points are scattered with no direction.','The points rise to a peak near the middle and then fall.'][k]); },
    () => { var x = pick(C73), m = rnd(x.m[0],x.m[1]), c = 5*rnd(x.c[0]/5,x.c[1]/5), v = rnd(x.xs[0],x.xs[1]), ans = m*v+c;
      return Q('A line of good fit for '+x.x+' (x) and '+x.y+' (y) is '+lineH(m,c)+'. What value of y does it predict when x = '+v+'?', N(ans), w3([m*v,m+v+c,(m+c)*v,ans+m],ans).slice(0,3).map(z => N(z)),
        'Put x = '+v+' into the equation: '+num(m)+' × '+v+' + '+c+' = '+num(ans)+'.'); },
    () => { var lo = rnd(2,10), hi = lo+rnd(8,20), xi = rnd(lo+2,hi-2), xo = hi+rnd(10,30);
      return Q('A line of good fit was drawn from data with x-values from '+lo+' to '+hi+'. The line is used to predict y for x = '+xi+' and for x = '+xo+'. Which prediction is more reliable?', 'The prediction for x = '+xi+', because '+xi+' is inside the range of the data',
        ['The prediction for x = '+xo+', because '+xo+' is the larger value', 'Both are equally reliable, because they come from the same line', 'The prediction for x = '+xo+', because '+xo+' is outside the range of the data'],
        'x = '+xi+' is between '+lo+' and '+hi+', so that prediction is an interpolation. x = '+xo+' is beyond the data, so that prediction is an extrapolation, and the pattern may not continue that far.'); },
    () => { var x = pick(C73), m = rnd(x.m[0],x.m[1]), c = 5*rnd(x.c[0]/5,x.c[1]/5), k = rnd(2,5), a = Math.abs(m*k), w = m > 0 ? ['increases','decreases'] : ['decreases','increases'];
      return Q('A line of good fit is '+lineH(m,c)+', where x is the '+x.x+' and y is the '+x.y+'. When x increases by '+k+', what happens to the predicted value of y?', 'It '+w[0]+' by '+a, ['It '+w[1]+' by '+a, 'It '+w[0]+' by '+k, 'It '+w[0]+' by '+(a+c)],
        'The gradient is '+num(m)+', so y changes by '+num(m)+' for each increase of 1 in x. For an increase of '+k+', the change is '+num(m)+' × '+k+' = '+num(m*k)+'.'); },
    () => { var m = ri(-3,4,[0]), x1 = rnd(1,4), d = rnd(2,4), c = rnd(2,15), y1 = m*x1+c, y2 = m*(x1+d)+c;
      return Q('A line of good fit passes through '+pt(x1,y1)+' and '+pt(x1+d,y2)+'. What is its equation?', lineH(m,c), [lineH(y2-y1,c), lineH(m,y1), lineH(-m,c)],
        'Gradient = ('+num(y2)+' − '+num(y1)+') ÷ ('+(x1+d)+' − '+x1+') = '+num(m)+'. Using '+pt(x1,y1)+': '+num(y1)+' = '+num(m)+' × '+x1+' + c, so c = '+c+'.'); },
    () => { var m = rnd(2,5), c = rnd(1,10), x0 = rnd(2,8), d = rnd(1,6), ab = Math.random() < 0.5, pr = m*x0+c, y0 = ab ? pr+d : pr-d;
      return Q('A line of good fit is '+lineH(m,c)+'. One of the data points is '+pt(x0,y0)+'. Where is this point compared with the line?', d+(ab ? ' above the line' : ' below the line'), [d+(ab ? ' below the line' : ' above the line'), 'On the line', (d+c)+(ab ? ' above the line' : ' below the line')],
        'When x = '+x0+' the line gives y = '+m+' × '+x0+' + '+c+' = '+pr+'. The point has y = '+y0+', which is '+d+(ab ? ' more' : ' less')+' than '+pr+'.'); }
  ]});

/* ---------- 7.4 Two-way tables ---------- */
LSN('7.4','Two-way tables',{
  w:sliderW('w74','Comparing two year levels',[['a','Year 9 who walk',0,40,2,24],['b','Year 10 who walk',0,60,3,24]], v => { var pa = v.a/40*100, pb = v.b/60*100, d = Math.abs(pa-pb);
    return tw(['Year 9','Year 10'],['Walk','Do not walk'],[[v.a,40-v.a],[v.b,60-v.b]])+'<p>Year 9: '+v.a+' out of 40 walk, which is '+fmt(r2(pa))+'%.</p><p>Year 10: '+v.b+' out of 60 walk, which is '+fmt(r2(pb))+'%.</p>'+
      '<p class="goal">'+(d < 5 ? 'The percentages are about the same, so this table gives no evidence that walking is related to year level.' : 'The percentages differ by '+fmt(r2(d))+' percentage points, so walking may be related to year level.')+'</p>'; }),
  body:w => Pp('A two-way table sorts people or things by two categories at once, such as year level and how students travel to school.')+
    sec('Reading a two-way table','Each row is one group and each column is another. Each inner cell counts the people who are in both groups. The totals are at the end of each row and at the bottom of each column.',tw(['Year 9','Year 10'],['Walk','Do not walk'],[[24,16],[24,36]]),'!In this table, 24 Year 9 students walk. There are 40 Year 9 students altogether, and 100 students in the whole survey.')+
    sec('Filling in missing numbers','Each row and each column adds to its total, so a missing number is found by subtracting. If 40 Year 9 students were surveyed and 24 walk, then 40 − 24 = 16 do not walk.')+
    sec('Percentages of a group','Be clear about which group a percentage is taken from. The percentage of Year 9 students who walk is 24 out of 40, which is 60%. The percentage of all students who are Year 9 walkers is 24 out of 100, which is 24%.',hb('pctof'))+
    sec('Comparing groups','When the groups are different sizes, compare percentages instead of counts. In the table, the same number of students walk in each year level, 24 and 24. That is 60% of Year 9 but only 40% of Year 10.',w)+
    sec('Possible relationships','If the percentages are very different, the two categories may be related. If the percentages are about the same, the table gives no evidence of a relationship. One survey cannot settle the question, so describe a relationship as possible.'),
  help:[null,'pctof','pctof','pctof','pctof','pct'],
  gens:[
    () => { var t = twGen(false), i = rnd(0,1), j = rnd(0,1), c = t.c[i][j];
      return Q('What number is missing from this table?'+tw(t.x.R,t.x.C,t.c,{hide:[i,j]}), N(c), w3([t.rt[i]+t.c[i][1-j],t.ct[j]+t.c[1-i][j],c+10,t.T-t.rt[i]],c).slice(0,3).map(x => N(x)),
        'The '+t.x.R[i]+' row adds to '+t.rt[i]+'. '+t.rt[i]+' − '+t.c[i][1-j]+' = '+c+'.'); },
    () => { var t = twGen(false), i = rnd(0,1), c = t.p[i];
      return Q('What percentage of the '+t.x.g[i]+' '+t.x.yes+'?'+tw(t.x.R,t.x.C,t.c), pc(c), w3([Math.round(t.c[i][0]/t.ct[0]*100),Math.round(t.c[i][0]/t.T*100),t.c[i][0],100-c],c).slice(0,3).map(x => pc(x)),
        'Use the '+t.x.R[i]+' row only. '+t.c[i][0]+' out of '+t.rt[i]+' is '+t.c[i][0]+' ÷ '+t.rt[i]+' × 100 = '+c+'%.'); },
    () => { var x = pick(TWC), r0 = pick([40,50,60]), p0 = 10*rnd(2,8), p1 = 10*ri(2,8,[p0]), c = [[r0*p0/100,r0*(100-p0)/100],[(100-r0)*p1/100,(100-r0)*(100-p1)/100]], i = rnd(0,1), ans = c[i][0];
      return Q('What percentage of all the '+x.all+' in the table are '+x.g[i]+' '+x.rel+' '+x.yes+'?'+tw(x.R,x.C,c), pc(ans), w3([[p0,p1][i],Math.round(ans/(c[0][0]+c[1][0])*100),c[i][1],c[1-i][0]],ans).slice(0,3).map(z => pc(z)),
        'The table has 100 '+x.all+' altogether, and '+ans+' of them are '+x.g[i]+' '+x.rel+' '+x.yes+'. '+ans+' out of 100 is '+ans+'%.'); },
    () => { var x = pick(TWC), hi = rnd(0,1), lo = 1-hi, rh = pick([20,40]), rw = pick([80,100]), ph = 10*rnd(5,8), pl = ph-10*rnd(1,3), ch = rh*ph/100, cl = rw*pl/100; if(cl <= ch) return null;
      var c = []; c[hi] = [ch,rh-ch]; c[lo] = [cl,rw-cl]; var sh = Math.round(ch/(ch+cl)*100), sl = Math.round(cl/(ch+cl)*100);
      return Q('In which group is the percentage that '+x.yes+' higher?'+tw(x.R,x.C,c), cap(x.g[hi])+': '+ph+'% compared with '+pl+'%', [cap(x.g[lo])+': '+sl+'% compared with '+sh+'%', cap(x.g[lo])+': '+cl+' compared with '+ch, 'Neither: the percentage is the same for both groups'],
        'Work along each row. '+cap(x.g[hi])+': '+ch+' ÷ '+rh+' = '+ph+'%. '+cap(x.g[lo])+': '+cl+' ÷ '+rw+' = '+pl+'%. The '+x.g[lo]+' have the larger count only because there are more of them.'); },
    () => { var eq = Math.random() < 0.4, t = twGen(eq), x = t.x; if(!eq && Math.abs(t.p[0]-t.p[1]) < 20) return null; if(t.c[0][0] === t.c[1][0]) return null;
      var big = t.c[0][0] > t.c[1][0] ? 0 : 1;
      return eq ? Q('Does this table suggest a relationship between '+x.rv+' and '+x.cv+'?'+tw(x.R,x.C,t.c), 'No. '+t.p[0]+'% of each group '+x.yes, ['Yes. '+t.c[big][0]+' '+x.g[big]+' '+x.yes+' but only '+t.c[1-big][0]+' '+x.g[1-big], 'Yes. The two groups are different sizes', 'No. A table with two rows cannot show a relationship'],
          t.c[0][0]+' ÷ '+t.rt[0]+' = '+t.p[0]+'% and '+t.c[1][0]+' ÷ '+t.rt[1]+' = '+t.p[1]+'%. The percentages are equal, so the table gives no evidence of a relationship. The counts differ only because the groups are different sizes.')
        : Q('Does this table suggest a relationship between '+x.rv+' and '+x.cv+'?'+tw(x.R,x.C,t.c), 'Yes. '+t.p[0]+'% of '+x.g[0]+' '+x.yes+', compared with '+t.p[1]+'% of '+x.g[1], ['No. Some of each group '+x.yes, 'No. The two groups are different sizes, so they cannot be compared', 'Yes. More '+x.g[t.rt[0] > t.rt[1] ? 0 : 1]+' than '+x.g[t.rt[0] > t.rt[1] ? 1 : 0]+' are in the table'],
          t.c[0][0]+' ÷ '+t.rt[0]+' = '+t.p[0]+'% and '+t.c[1][0]+' ÷ '+t.rt[1]+' = '+t.p[1]+'%. The percentages are very different, so the two may be related.'); },
    () => { var x = pick(TWC), T = pick([100,150,200,250]), r0 = T*pick([0.2,0.4,0.6]), p = 10*rnd(2,8), c = r0*p/100;
      return Q('A survey covers '+T+' '+x.all+'. Of these, '+r0+' are '+x.g[0]+', and '+p+'% of the '+x.g[0]+' '+x.yes+'. How many '+x.g[0]+' '+x.yes+'?', N(c), w3([T*p/100,r0-c,p,T-r0],c).slice(0,3).map(z => N(z)),
        p+'% of '+r0+' = '+(p/100)+' × '+r0+' = '+c+'. The percentage is taken from the '+r0+' '+x.g[0]+', not from all '+T+' '+x.all+'.'); }
  ]});

/* ---------- 7.5 Checking claims in the media ---------- */
var SAMP = [
  ['A school of 900 students wants to find out its students’ favourite sport.','150 students chosen at random from the school roll',['150 members of the school football club','10 students chosen at random from the school roll','300 people who answer a poll on the football club’s website']],
  ['A town of 20 000 people wants to know whether residents support building a new library.','400 residents chosen at random from the list of voters',['400 people leaving the current library','12 residents chosen at random from the list of voters','1000 people who phone a radio station to give their opinion']],
  ['A company with 2000 workers wants to know how many would like to work from home.','200 workers chosen at random from the staff list',['200 workers from the head office only','8 workers chosen at random from the staff list','500 workers who chose to reply to an email survey']]
];
var CAUSE = [
  ['towns with more playgrounds also have more injuries to children',['More playgrounds cause more injuries','More injuries cause towns to build playgrounds','Closing playgrounds would be certain to reduce injuries']],
  ['students who own more books tend to score higher on reading tests',['Owning books causes higher reading scores','High reading scores cause students to buy books','Giving every student ten books would be certain to raise their scores']],
  ['on days when more ice creams are sold, more people are treated for sunburn',['Eating ice cream causes sunburn','Sunburn causes people to buy ice cream','Banning ice cream would be certain to reduce sunburn']],
  ['suburbs with more cafes also have higher house prices',['Cafes cause house prices to rise','High house prices cause cafes to open','Opening a cafe would be certain to raise nearby house prices']]
];
LSN('7.5','Checking claims in the media',{
  w:sliderW('w75','The same data on different axes',[['s','Axis starts at',0,90,10,0]], v => { var k = (96-v.s)/(92-v.s);
    return barsSVG(92,96,v.s)+'<p>Brand A scores 92 and brand B scores 96. The real difference is 4, which is about 4% more.</p><p><b>With the axis starting at '+v.s+', bar B is drawn '+k.toFixed(k < 1.1 ? 2 : 1)+' times as tall as bar A.</b></p>'; }),
  body:w => Pp('News reports and advertisements use statistics to support claims. This lesson shows what to check before accepting a claim.')+
    sec('Who was asked','A <b>sample</b> is the group that was actually surveyed. A sample is useful only if it is like the whole group it is meant to describe. A sample chosen at random gives everyone the same chance of being included. A sample of volunteers, or of people from one place, is likely to be <b>biased</b>, which means it leans toward one answer.')+
    sec('How many were asked','Small samples give unreliable results. If 10 people are surveyed, each person is 10% of the result, so one or two unusual answers change the result a great deal.')+
    sec('How the question was asked','The wording of a question can push people toward an answer. “Do you agree that the dangerous old bridge should be replaced?” will get more yes answers than “Should the bridge be replaced?”')+
    sec('How the graph is drawn','A graph can exaggerate a difference. If the vertical axis starts at a number other than zero, a small difference between two bars looks large.',w)+
    sec('Which numbers are quoted','“Sales doubled” sounds impressive, but sales may have gone from 2 to 4. Look for the actual numbers behind a percentage. Check also which average is used. A few very high values raise the mean well above the median.',hb('centre'))+
    sec('Association and cause','If two things rise together, a report may claim that one causes the other. The data alone cannot show that. Something else may be causing both.')+
    sec('Collecting data fairly','People who collect data should ask permission, keep personal details private and report all their results, including results they did not expect.'),
  help:[null,null,'pctof','centre','pct',null],
  gens:[
    () => { var s = 10*rnd(2,9), d = pick([2,4,5,10]), k = rnd(2,5), A = s+d, B = s+k*d, real = r2(B/A);
      return Q('A bar graph has a vertical axis that starts at '+s+'. Bar A shows '+A+' and bar B shows '+B+'. How many times as tall as bar A is bar B drawn?', N(k), w3([real,B-A,k+1,k*2],k).slice(0,3).map(x => N(x)),
        'The bars are drawn from '+s+'. Bar A has height '+A+' − '+s+' = '+d+' and bar B has height '+B+' − '+s+' = '+(k*d)+'. '+(k*d)+' ÷ '+d+' = '+k+'. The real values give '+B+' ÷ '+A+' = '+real+', so the graph exaggerates the difference.', {calc:true}); },
    () => { var t = pick(SAMP);
      return Q(t[0]+' Which sample is likely to give the most reliable result?', t[1], t[2], 'A reliable sample is chosen at random from the whole group and is large enough. The other samples are too small, come from one part of the group or include only people who chose to answer.'); },
    () => { var old = 100*rnd(2,9), p = pick([5,10,15,20,25,30,40]), d = old*p/100, nw = old+d;
      return Q('A report says ticket sales rose from '+old+' to '+nw+'. What is the percentage increase?', pc(p), w3([d,r2(d/nw*100),100+p,r2(p/2)],p).slice(0,3).map(x => pc(x)),
        'The increase is '+nw+' − '+old+' = '+d+'. As a percentage of the starting value, '+d+' ÷ '+old+' × 100 = '+p+'%.', {calc:true}); },
    () => { var a = sortN(distinct(4,45,65)), sum = a[0]+a[1]+a[2]+a[3], big = 10*rnd(15,30), d, m; big += (5-(sum+big)%5)%5; d = a.concat([big]); m = mean(d);
      return Q('A company has five workers. Their salaries, in thousands of dollars, are '+shuffle(d.slice()).join(', ')+'. The company advertises an “average salary” of '+m+' thousand dollars, which is the mean. What is the median salary, in thousands of dollars?', N(a[2]), w3([m,big,(a[0]+big)/2,a[1]],a[2]).slice(0,3).map(x => N(x)),
        'In order the salaries are '+d.join(', ')+'. The middle value is '+a[2]+'. Four of the five workers earn less than the advertised mean, because one large salary pulls the mean up.'); },
    () => { var o = pick([[20,[55,60,65]],[25,[52,56,60,64]],[40,[55,60]],[50,[52,54,56,58,60]]]), n = o[0], p = pick(o[1]), a = n*p/100, c = a-(n-a);
      return Q('In a survey of '+n+' people, '+p+'% chose brand A and the rest chose brand B. How many more people chose A than B?', N(c), w3([a,p-(100-p),n-a,c*2],c).slice(0,3).map(x => N(x)),
        p+'% of '+n+' is '+a+' people, so '+(n-a)+' chose B. '+a+' − '+(n-a)+' = '+c+'. A headline saying “'+p+'% prefer A” rests on a lead of only '+c+' '+(c === 1 ? 'person' : 'people')+'.'); },
    () => { var t = pick(CAUSE);
      return Q('A report finds that '+t[0]+'. Which conclusion does the data support?', 'The two are associated, but the data does not show that one causes the other', t[1], 'The data shows that the two go together. It cannot show why. A third factor may be behind both.'); }
  ]});

/* ---------- 7.6 A data investigation ---------- */
var INV = [
  {head:'Do students who sleep longer score higher on a quiz?', steps:['<b>Plan.</b> The two variables are hours of sleep and quiz score. Both are numerical. Ask 30 students chosen at random from the Year 10 roll.','<b>Collect.</b> Record each student’s sleep and score as a pair, such as 7.5 hours and 16 marks.','<b>Display.</b> Two numerical variables go on a scatterplot, with hours of sleep on the horizontal axis.','<b>Analyse.</b> The points rise from left to right, so the association is positive. A line of good fit drawn by eye is score = 2 × hours + 1.','<b>Conclude.</b> In this sample, students who slept longer tended to score higher. The data shows an association. It does not show that sleep causes the higher scores, and it comes from one year level at one school.']},
  {head:'Do Year 10 students react faster than Year 7 students?', steps:['<b>Plan.</b> The variables are year level, which is categorical, and reaction time, which is numerical. Test 25 students chosen at random from each year level.','<b>Collect.</b> Each student catches a dropped ruler three times, and the middle result is recorded.','<b>Display.</b> One numerical variable compared across two groups goes on parallel box plots.','<b>Analyse.</b> The median is 0.31 seconds for Year 10 and 0.38 seconds for Year 7. The IQRs are similar, at 0.06 and 0.07 seconds.','<b>Conclude.</b> In this sample the Year 10 students were faster by a median of 0.07 seconds, with a similar spread. A sample of 25 from each year level at one school is a limit on the conclusion.']},
  {head:'Is playing a musical instrument related to being left-handed?', steps:['<b>Plan.</b> Both variables are categorical: plays an instrument or not, and left-handed or right-handed. Survey 120 students chosen at random.','<b>Collect.</b> Each student answers two questions, and the answers are tallied.','<b>Display.</b> Two categorical variables go in a two-way table.','<b>Analyse.</b> 30% of the left-handed students play an instrument, compared with 32% of the right-handed students.','<b>Conclude.</b> The percentages are about the same, so this sample gives no evidence of a relationship.']}
];
LSN('7.6','A data investigation',{
  w:stepper('w76','An investigation, one step at a time', () => pick(INV)),
  body:w => Pp('A statistical investigation answers a question by collecting and analysing data. This lesson follows the steps for a question about two variables.')+
    sec('Step 1: ask a question','A good question needs data to answer it and names what will be measured. “Is there a relationship between hours of sleep and quiz scores for Year 10 students?” is a question that data can answer.')+
    sec('Step 2: plan and collect','Decide what to record, who to ask and how many to ask. A <b>variable</b> is something that is recorded for each person. A <b>numerical</b> variable is a number, such as height. A <b>categorical</b> variable is a group, such as eye colour. Choose the sample fairly, for example at random from a list.')+
    sec('Step 3: display','The type of data decides the display.','!Two numerical variables: a scatterplot.<br>One numerical variable compared across groups: parallel box plots.<br>Two categorical variables: a two-way table.')+
    sec('Step 4: analyse','Describe what the display shows, using numbers. Use medians and IQRs for box plots, the direction and strength of the association for a scatterplot and percentages for a two-way table.')+
    sec('Step 5: conclude','Answer the original question. Say how sure the data allows you to be, and what limits the conclusion, such as a small sample or a sample from one school.',w),
  help:[null,null,'ratio',null,null,'centre'],
  gens:[
    () => { var T = [['the height and the arm span of 30 students','A scatterplot'],['the reaction times of Year 7 students and of Year 10 students','Parallel box plots'],['whether students own a pet, and whether they live in a house or a unit','A two-way table'],['the hours of training and the race times of 20 runners','A scatterplot'],['the battery life of two brands of phone','Parallel box plots'],['whether people are left-handed, and whether they play an instrument','A two-way table']], t = pick(T), all = ['A scatterplot','Parallel box plots','A two-way table','A single pie chart'];
      return Q('An investigation records '+t[0]+'. Which display suits this data best?', t[1], all.filter(x => x !== t[1]), t[1] === 'A scatterplot' ? 'Both variables are numerical and they are recorded in pairs, so a scatterplot shows whether they are related.' : t[1] === 'Parallel box plots' ? 'One numerical variable is compared across two groups, so parallel box plots show the centre and spread of each group.' : 'Both variables are categorical, so the counts go in a two-way table.'); },
    () => { var num2 = [['height','shoe size'],['hours of sleep','test mark'],['age','time to run 100 m'],['temperature','number of ice creams sold']], cat2 = [['eye colour','favourite sport'],['year level','way of travelling to school'],['left-handed or right-handed','owns a pet or not']], mix = [['height','favourite colour'],['year level','pulse rate'],['brand of phone','battery life in hours']];
      var wantN = Math.random() < 0.5, c = pick(wantN ? num2 : cat2), w = wantN ? sample(mix,2).concat([pick(cat2)]) : sample(mix,2).concat([pick(num2)]), f = p => cap(p[0])+' and '+p[1];
      return Q('In which pair are both variables '+(wantN ? 'numerical' : 'categorical')+'?', f(c), w.map(f), wantN ? 'A numerical variable is a count or a measurement. Both '+c[0]+' and '+c[1]+' are numbers.' : 'A categorical variable sorts people into groups. Both '+c[0]+' and '+c[1]+' are groups, not measurements.'); },
    () => { var T = pick([600,800,1000,1200]), sh = pick([0.1,0.15,0.2,0.25]), Y = Math.round(T*sh), s = 20*rnd(2,6), c = Math.round(s*sh);
      return Q('A school has '+T+' students, and '+Y+' of them are in Year 10. A sample of '+s+' students is chosen so that each year level has the same share of the sample as it has of the school. How many Year 10 students are in the sample?', N(c), w3([2*c,Math.round(s/6),s-c,Y/s],c).slice(0,3).map(x => N(x)),
        'Year 10 is '+Y+' ÷ '+T+' = '+fmt(sh)+' of the school. '+fmt(sh)+' × '+s+' = '+c+'.', {calc:true}); },
    () => { var t = pick([['hours of sleep','quiz marks','students who slept longer tended to score higher','More sleep causes higher marks','Every student who sleeps longer scores higher'],['hours of training','goals scored','players who trained longer tended to score more goals','More training causes more goals','Every player who trains longer scores more goals'],['time spent reading','spelling scores','students who read for longer tended to spell better','More reading causes better spelling','Every student who reads for longer spells better']]);
      return Q('An investigation of 25 students at one school finds a strong positive association between '+t[0]+' and '+t[1]+'. Which conclusion is justified?', 'In this sample, '+t[2], [t[3], t[4], 'The same association holds in every school in Australia'],
        'The data comes from 25 students at one school, so the conclusion is about that sample. An association shows a tendency. It does not show a cause, and it does not hold for every person.'); },
    () => { var good = pick(['Is there a relationship between screen time and hours of sleep for Year 10 students?','Do students who live further from school take longer to get there?','Do taller students tend to have a longer arm span?']), bad = sample(['How many hours did '+pick(NAMES)+' sleep last night?','How tall is the tallest student in Year 10?','What is the most common eye colour in the class?','How many students are in Year 10?','What mark did '+pick(NAMES)+' get on the last test?'],3);
      return Q('Which question needs data on two variables to answer it?', good, bad, 'That question asks how one variable changes with another, so both must be recorded for each student. The other questions are answered by a single value or by one variable.'); },
    () => { var A = distinct(5,10,40), B = distinct(5,15,50), ma = med(A), mb = med(B), c = Math.abs(ma-mb); if(c === 0) return null;
      return Q('Two groups each recorded five results. Group A: '+A.join(', ')+'. Group B: '+B.join(', ')+'. What is the difference between the medians of the two groups?', N(c), w3([Math.abs(A[2]-B[2]),r2(Math.abs(mean(A)-mean(B))),Math.abs(Math.max.apply(null,A)-Math.max.apply(null,B)),c+2,c+5],c).filter(x => x > 0).slice(0,3).map(x => N(x)),
        'In order, group A is '+sortN(A).join(', ')+', so its median is '+ma+'. Group B is '+sortN(B).join(', ')+', so its median is '+mb+'. The difference is '+c+'.'); }
  ]});

/* ---------- 8.1 Experiments with two or three steps ---------- */
function diceTable(){ var s = '<tr><th>+</th>'+[1,2,3,4,5,6].map(i => '<th>'+i+'</th>').join('')+'</tr>';
  for(var i = 1; i <= 6; i++) s += '<tr><th>'+i+'</th>'+[1,2,3,4,5,6].map(j => '<td'+(i+j === 7 ? ' class="hit"' : '')+'>'+(i+j)+'</td>').join('')+'</tr>';
  return '<div class="tablewrap"><table class="vals">'+s+'</table></div>'; }
LSN('8.1','Experiments with two or three steps',{
  w:sliderW('w81','Two counters from a bag',[['r','Red counters',1,5,1,3],['b','Blue counters',1,5,1,2],['p','First counter put back?',0,1,1,0,x => x ? 'yes' : 'no']], v => { var n = v.r+v.b, m = v.p ? n : n-1, r2n = v.p ? v.r : v.r-1, b2n = v.p ? v.b : v.b-1;
    var e = [[v.r*r2n,'RR'],[v.r*v.b,'RB'],[v.b*v.r,'BR'],[v.b*b2n,'BB']];
    return treeSVG(['R','B'],[v.r+'/'+n,v.b+'/'+n],[[r2n+'/'+m,v.b+'/'+m],[v.r+'/'+m,b2n+'/'+m]],e.map(x => x[0]+'/'+(n*m)))+
      '<p>'+(v.p ? 'The first counter is put back, so the second set of branches is the same as the first.' : 'The first counter is kept out, so '+m+' counters are left for the second step.')+'</p>'+
      '<p>Two red: '+frr(e[0][0],n*m)+'. One of each colour: '+frr(e[1][0]+e[2][0],n*m)+'. Two blue: '+frr(e[3][0],n*m)+'.</p>'; }),
  body:w => Pp('Many chance experiments have more than one step, such as tossing two coins or taking two counters from a bag. This lesson shows how to list the outcomes and find their probabilities.')+
    sec('Listing outcomes','Tossing a coin twice has four equally likely outcomes: HH, HT, TH and TT. The probability of two heads is '+fr(1,4)+'. The probability of one head and one tail is '+fr(2,4)+' = '+fr(1,2)+', because HT and TH both count.',hb('prob'))+
    sec('Counting outcomes','When an experiment has two steps, multiply the number of outcomes for each step. A coin and a die give 2 × 6 = 12 outcomes. Three coins give 2 × 2 × 2 = 8 outcomes.')+
    sec('A table for two dice','A table shows all 36 outcomes for two dice. Each cell is the total of the two numbers. A total of 7 appears 6 times, so its probability is '+fr(6,36)+' = '+fr(1,6)+'.',diceTable())+
    sec('Tree diagrams','A tree diagram has a set of branches for each step, with the probability written on each branch. To find the probability of an outcome, multiply along the branches that lead to it. To combine outcomes, add their probabilities.',w,hb('mulfrac'))+
    sec('With and without replacement','<b>With replacement</b> means the first counter is put back before the second is taken, so the probabilities stay the same. <b>Without replacement</b> means it is not put back. There is one fewer counter in the bag, so the probabilities for the second step change.','!A bag has 3 red and 2 blue counters. Without replacement, the probability of two reds is '+fr(3,5)+' × '+fr(2,4)+' = '+fr(6,20)+' = '+fr(3,10)+'.'),
  help:['prob','prob','mulfrac','mulfrac','mulfrac','prob','mulfrac'],
  gens:[
    () => { var k = rnd(0,4), a, b, t;
      if(k === 0){ a = 2; b = 6; t = 'A coin is tossed and a die is rolled.'; } else if(k === 1){ a = rnd(3,5); b = ri(2,6,[a]); t = 'A menu has '+a+' main courses and '+b+' desserts. A meal is one main course and one dessert.'; }
      else if(k === 2){ a = rnd(3,6); b = a; t = 'A spinner with '+a+' equal sections is spun twice.'; } else if(k === 3){ a = 6; b = 6; t = 'Two dice are rolled.'; }
      else return Q('Three coins are tossed. How many different outcomes are possible, counting the order?', N(8), [N(6), N(3), N(9)], 'Each coin has 2 outcomes. 2 × 2 × 2 = 8.');
      return Q(t+' How many different outcomes are possible'+(k === 1 ? '' : ', counting the order')+'?', N(a*b), w3([a+b,2*(a+b),a*b+a,a*b-b],a*b).slice(0,3).map(x => N(x)), 'Multiply the number of outcomes at each step: '+a+' × '+b+' = '+(a*b)+'.'); },
    () => { var s = rnd(3,11), c = 6-Math.abs(7-s), ways = []; for(var i = 1; i <= 6; i++) if(s-i >= 1 && s-i <= 6) ways.push(i+' + '+(s-i));
      return Q('Two dice are rolled and the two numbers are added. What is the probability that the total is '+s+'?', F(c,36), [N(1/11,fr(1,11)), F(c+1,36), F(c,12)], 'There are 36 equally likely outcomes. A total of '+s+' can be made '+c+' ways: '+ways.join(', ')+'. The probability is '+fr(c,36)+(gcd(c,36) > 1 ? ' = '+frr(c,36) : '')+'.'); },
    () => { var r = rnd(2,5), b = rnd(2,5), n = r+b, red = Math.random() < 0.5, k = red ? r : b, col = red ? 'red' : 'blue';
      return Q('A bag holds '+r+' red and '+b+' blue counters. A counter is taken out, its colour is noted and it is put back. Then a second counter is taken out. What is the probability that both are '+col+'?', F(k*k,n*n), [F(k*(k-1),n*(n-1)), F(k,n), F(2*k,n*n)],
        'The counter is put back, so the probability of '+col+' is '+fr(k,n)+' both times. '+fr(k,n)+' × '+fr(k,n)+' = '+fr(k*k,n*n)+(gcd(k*k,n*n) > 1 ? ' = '+frr(k*k,n*n) : '')+'.'); },
    () => { var r = rnd(2,5), b = rnd(2,5), n = r+b, red = Math.random() < 0.5, k = red ? r : b, col = red ? 'red' : 'blue';
      return Q('A bag holds '+r+' red and '+b+' blue counters. Two counters are taken out, one after the other, without replacement. What is the probability that both are '+col+'?', F(k*(k-1),n*(n-1)), [F(k*k,n*n), F(k,n), F(k-1,n-1)],
        'The first is '+col+' with probability '+fr(k,n)+'. Then '+(k-1)+' of the remaining '+(n-1)+' counters '+(k === 2 ? 'is ' : 'are ')+col+'. '+fr(k,n)+' × '+fr(k-1,n-1)+' = '+fr(k*(k-1),n*(n-1))+(gcd(k*(k-1),n*(n-1)) > 1 ? ' = '+frr(k*(k-1),n*(n-1)) : '')+'.'); },
    () => { var r = rnd(2,5), b = rnd(2,5), n = r+b, d = n*(n-1);
      return Q('A bag holds '+r+' red and '+b+' blue counters. Two counters are taken out without replacement. What is the probability of getting one of each colour?', F(2*r*b,d), [F(r*b,d), F(2*r*b,n*n), F(r*b,n*n)],
        'Red then blue: '+fr(r,n)+' × '+fr(b,n-1)+' = '+fr(r*b,d)+'. Blue then red: '+fr(b,n)+' × '+fr(r,n-1)+' = '+fr(r*b,d)+'. Add them: '+fr(2*r*b,d)+(gcd(2*r*b,d) > 1 ? ' = '+frr(2*r*b,d) : '')+'.'); },
    () => { var T = [['exactly one head',3,'HTT, THT, TTH'],['exactly two heads',3,'HHT, HTH, THH'],['three heads',1,'HHH'],['at least one head',7,'every outcome except TTT'],['at least two heads',4,'HHT, HTH, THH, HHH'],['no heads',1,'TTT']], t = pick(T);
      return Q('Three coins are tossed. What is the probability of getting '+t[0]+'?', F(t[1],8), sample([[1,8],[3,8],[1,2],[7,8],[1,4],[5,8],[3,4],[1,3],[2,3]].filter(x => x[0]/x[1] !== t[1]/8),3).map(x => F(x[0],x[1])),
        'There are 2 × 2 × 2 = 8 equally likely outcomes. The outcomes with '+t[0]+' are '+t[2]+'. That is '+t[1]+' out of 8'+(gcd(t[1],8) > 1 ? ', which is '+frr(t[1],8) : '')+'.'); },
    () => { var r = rnd(2,5), b = rnd(2,5), n = r+b;
      return Q('A bag holds '+r+' red and '+b+' blue counters. Two counters are taken out, one after the other. When is the probability that both are red higher: when the first counter is put back, or when it is kept out?', 'When it is put back: '+frr(r*r,n*n)+' compared with '+frr(r*(r-1),n*(n-1)),
        ['When it is kept out: '+frr(r,n-1)+' compared with '+frr(r,n), 'It makes no difference: '+frr(r*r,n*n)+' both times', 'When it is kept out: '+frr(r*r,n*(n-1))+' compared with '+frr(r*r,n*n)],
        'Put back: '+fr(r,n)+' × '+fr(r,n)+' = '+frr(r*r,n*n)+'. Kept out: '+fr(r,n)+' × '+fr(r-1,n-1)+' = '+frr(r*(r-1),n*(n-1))+'. Keeping a red counter out leaves fewer reds for the second step, so that probability is lower.'); }
  ]});

/* ---------- 8.2 Conditional probability ---------- */
var DIE = [['even',[2,4,6]],['odd',[1,3,5]],['greater than 2',[3,4,5,6]],['less than 5',[1,2,3,4]],['greater than 3',[4,5,6]],['a multiple of 3',[3,6]],['less than 3',[1,2]],['a prime number',[2,3,5]]];
LSN('8.2','Conditional probability',{
  w:sliderW('w82','Which group are you looking at?',[['a','Year 9 who walk',2,40,2,24],['b','Year 10 who walk',3,60,3,24]], v =>
    tw(['Year 9','Year 10'],['Walk','Do not walk'],[[v.a,40-v.a],[v.b,60-v.b]])+'<p>One student is chosen at random from the 100.</p><p>Probability that the student walks: '+frr(v.a+v.b,100)+'.</p>'+
    '<p>Probability that the student walks, given that the student is in Year 9: '+frr(v.a,40)+'. This uses the Year 9 row only.</p><p>Probability that the student is in Year 9, given that the student walks: '+frr(v.a,v.a+v.b)+'. This uses the Walk column only.</p>'),
  body:w => Pp('Extra information can change a probability. A conditional probability is the probability of an event when you already know that something else has happened.')+
    sec('The words to look for','The words “given that”, “if” and “knowing that” signal a conditional probability. “The probability that a student walks to school, given that the student is in Year 9” looks only at the Year 9 students.',hb('prob'))+
    sec('Shrinking the group','The condition tells you which group to look at. That group becomes the new total.','!A die is rolled. Given that the number is even, what is the probability that it is greater than 3? The even numbers are 2, 4 and 6. Two of them, 4 and 6, are greater than 3. The probability is '+fr(2,3)+'.')+
    sec('Using a two-way table','In a two-way table the condition picks out one row or one column. The order of the two events matters, as the example below shows.',w)+
    sec('Without replacement','Taking counters without replacement is a conditional situation. A bag has 4 red and 3 blue counters. Given that the first counter taken was red, 3 red counters remain out of 6. The probability that the second is red is '+fr(3,6)+' = '+fr(1,2)+'.')+
    sec('In general','The probability of A given B is the number of outcomes that are in both A and B, divided by the number of outcomes in B.'),
  help:['prob','prob','prob','prob','prob','prob'],
  gens:[
    () => { var t = twGen(false), x = t.x, i = rnd(0,1);
      return Q('One '+x.unit+' from the table is chosen at random. Given that the '+x.unit+' '+x.gi[i]+', what is the probability that the '+x.unit+' '+x.ys+'?'+tw(x.R,x.C,t.c), F(t.c[i][0],t.rt[i]), [F(t.c[i][0],t.T), F(t.c[i][0],t.ct[0]), F(t.rt[i],t.T)],
        'The condition tells you to use the '+x.R[i]+' row only. '+t.c[i][0]+' out of '+t.rt[i]+' is '+frr(t.c[i][0],t.rt[i])+'.'); },
    () => { var t = twGen(false), x = t.x, i = rnd(0,1), k = t.c[i][0], a = frr(k,t.rt[i]), b = frr(k,t.ct[0]), z = frr(k,t.T); if(t.rt[i] === t.ct[0]) return null;
      var o = (p,q) => 'P(A given B) = '+p+' and P(B given A) = '+q;
      return Q('One '+x.unit+' from the table is chosen at random. A is the event “the '+x.unit+' '+x.ys+'”. B is the event “the '+x.unit+' '+x.gi[i]+'”. Which statement is correct?'+tw(x.R,x.C,t.c), o(a,b), [o(b,a), o(z,z), o(a,a)],
        'P(A given B) uses the '+x.R[i]+' row: '+k+' out of '+t.rt[i]+'. P(B given A) uses the '+x.C[0]+' column: '+k+' out of '+t.ct[0]+'. The two are different because the groups are different.'); },
    () => { var p = sample(DIE,2), B = p[0], A = p[1], both = A[1].filter(x => B[1].indexOf(x) >= 0); if(both.length === 0 || both.length === B[1].length) return null;
      return Q('A die is rolled. Given that the number is '+B[0]+', what is the probability that it is '+A[0]+'?', F(both.length,B[1].length), wF([[A[1].length,6],[both.length,6],[B[1].length,6],[both.length,A[1].length]],[both.length,B[1].length]),
        'The numbers that are '+B[0]+' are '+B[1].join(', ')+'. Of these, '+both.join(', ')+(both.length === 1 ? ' is ' : ' are ')+A[0]+'. That is '+both.length+' out of '+B[1].length+(gcd(both.length,B[1].length) > 1 ? ', which is '+frr(both.length,B[1].length) : '')+'.'); },
    () => { var r = rnd(2,6), b = rnd(2,6), n = r+b, fr1 = Math.random() < 0.5, k = fr1 ? r-1 : r;
      return Q('A bag holds '+r+' red and '+b+' blue counters. A counter is taken out and not put back. Given that it was '+(fr1 ? 'red' : 'blue')+', what is the probability that the next counter is red?', F(k,n-1), [F(r,n), F(fr1 ? r : r-1,n-1), F(k,n)],
        'After a '+(fr1 ? 'red' : 'blue')+' counter is removed, '+(n-1)+' counters are left and '+k+' of them are red. The probability is '+fr(k,n-1)+(gcd(k,n-1) > 1 ? ' = '+frr(k,n-1) : '')+'.'); },
    () => { var N0 = rnd(25,32), a = rnd(12,18), s = ri(8,14,[a]), k = rnd(3,6); if(a+s-k > N0) return null;
      return Q('In a class of '+N0+' students, '+a+' play netball, '+s+' play soccer and '+k+' play both. A netball player is chosen at random. What is the probability that this student also plays soccer?', F(k,a), [F(k,N0), F(k,s), F(s,N0)],
        'The condition is that the student plays netball, so the total is the '+a+' netball players. '+k+' of them also play soccer. The probability is '+fr(k,a)+(gcd(k,a) > 1 ? ' = '+frr(k,a) : '')+'.'); },
    () => { var n1 = pick([60,80,100,120]), k1 = n1*pick([0.25,0.5,0.75]), n2 = 200-n1, k2 = n2*pick([0.25,0.5]); if(k1 === k2) return null;
      return Q('A survey covers 200 people. Of the '+n1+' people under 30, '+k1+' own a bike. Of the '+n2+' people aged 30 or over, '+k2+' own a bike. A bike owner is chosen at random. What is the probability that this person is under 30?', F(k1,k1+k2), [F(k1,n1), F(k1,200), F(n1,200)],
        'The condition is that the person owns a bike. There are '+k1+' + '+k2+' = '+(k1+k2)+' bike owners, and '+k1+' of them are under 30. The probability is '+fr(k1,k1+k2)+(gcd(k1,k1+k2) > 1 ? ' = '+frr(k1,k1+k2) : '')+'.'); }
  ]});

/* ---------- 8.3 Independent events ---------- */
var SIM83 = {
  html:'<div class="card"><h3>A simulation of 200 trials</h3><p>A bag holds 3 red and 2 blue counters. Two counters are taken out, one after the other. Each button runs the experiment 200 times.</p><div class="row"><button class="btn plain" id="s83a">First counter put back</button><button class="btn plain" id="s83b">First counter kept out</button></div><div id="s83o" class="wout"><p class="muted">Press a button to run the simulation.</p></div></div>',
  bind:function(){
    function run(rep){ var n = 200, f = 0, s = 0, both = 0;
      for(var i = 0; i < n; i++){ var bag = ['R','R','R','B','B'], a = rnd(0,4), first = bag[a]; if(!rep) bag.splice(a,1); var second = pick(bag);
        if(first === 'R') f++; if(second === 'R') s++; if(first === 'R' && second === 'R') both++; }
      $('#s83o').innerHTML = '<p><b>'+(rep ? 'First counter put back' : 'First counter kept out')+'</b></p><p>Second counter red: '+s+' of 200 trials. Estimated probability: '+(s/n).toFixed(2)+'.</p>'+
        '<p>First counter red: '+f+' trials. In '+both+' of those the second was also red. Estimated probability that the second is red, given that the first was red: '+(f ? (both/f).toFixed(2) : '0')+'.</p>'+
        '<p>'+(rep ? 'In theory both probabilities are 0.6. The first counter makes no difference to the second, so the two events are independent.' : 'In theory the first probability is 0.6 and the second is 0.5. Knowing that the first counter was red changes the probability for the second, so the two events are not independent.')+' The estimates change a little each time the simulation runs.</p>'; }
    $('#s83a').addEventListener('click', function(){ run(true); }); $('#s83b').addEventListener('click', function(){ run(false); });
  }};
var IND = ['Tossing a coin twice: a head on the first toss, and a head on the second toss','Rolling a die and tossing a coin: a 6 on the die, and a tail on the coin','Taking a counter from a bag, putting it back and taking another: red first, and red second','Spinning a spinner twice: red on the first spin, and red on the second spin'];
var DEP = ['Taking two counters from a bag without putting the first one back: red first, and red second','Choosing two students from a class, one after the other: a Year 10 student first, and a Year 10 student second','Dealing two cards from a pack without returning the first: a red card first, and a red card second','Taking two socks from a drawer, one after the other: a blue sock first, and a blue sock second'];
var PF = [[1,4],[1,3],[1,2],[2,3],[3,4],[1,5],[2,5],[3,5],[1,6]];
LSN('8.3','Independent events',{
  w:SIM83,
  body:w => Pp('Two events are independent when one of them happening does not change the probability of the other.')+
    sec('Independent events','A coin toss and a die roll are independent, because the coin does not affect the die. Two tosses of the same coin are also independent. After five heads in a row, the probability of a head on the next toss is still '+fr(1,2)+'.')+
    sec('Events that are not independent','Taking two counters from a bag without replacement gives events that are not independent. The first counter taken changes what is left for the second.')+
    sec('Testing for independence','A and B are independent when the probability of A given B equals the probability of A. Knowing that B happened makes no difference.',w)+
    sec('Multiplying probabilities','For independent events, the probability that both happen is the product of the two probabilities. The probability of a 6 on a die and a head on a coin is '+fr(1,6)+' × '+fr(1,2)+' = '+fr(1,12)+'. This gives a second test: if P(A and B) equals P(A) × P(B), then A and B are independent.',hb('mulfrac'))+
    sec('Simulations','A simulation repeats a chance experiment many times, usually on a computer, and records how often an event happens. The fraction of trials in which the event happens is an estimate of its probability. More trials give a better estimate.'),
  help:['mulfrac',null,'pctof',null,null,'fracdec','prob'],
  gens:[
    () => { var p = sample(PF,2), a = p[0][0], b = p[0][1], c = p[1][0], d = p[1][1], nm = pick(NAMES); if(a*d+c*b >= b*d) return null;
      return Q('The probability that '+nm+'’s bus is late is '+fr(a,b)+'. The probability that it rains is '+fr(c,d)+'. The two events are independent. What is the probability that the bus is late and it rains?', F(a*c,b*d), [F(a*d+c*b,b*d), F(a+c,b+d), F(Math.abs(a*d-c*b),b*d)],
        'For independent events, multiply the probabilities: '+fr(a,b)+' × '+fr(c,d)+' = '+fr(a*c,b*d)+(gcd(a*c,b*d) > 1 ? ' = '+frr(a*c,b*d) : '')+'.'); },
    () => { var pa = rnd(2,6)/10, pb = rnd(2,8)/10, pr = r2(pa*pb), ind = Math.random() < 0.5, pab = ind ? pr : r2(pr+pick([0.1,-0.1,0.05,-0.05])); if(pab <= 0 || pab >= Math.min(pa,pb) || pa === pb) return null;
      var txt = 'For two events, P(A) = '+pa+', P(B) = '+pb+' and P(A and B) = '+pab+'. Are A and B independent?';
      return ind ? Q(txt, 'Yes, because '+pa+' × '+pb+' = '+pr+', which equals P(A and B)', ['No, because '+pa+' + '+pb+' = '+r2(pa+pb)+', which does not equal P(A and B)', 'No, because P(A) and P(B) are different', 'Yes, because both probabilities are between 0 and 1'], 'Independent events satisfy P(A and B) = P(A) × P(B). Here '+pa+' × '+pb+' = '+pr+', which matches.')
        : Q(txt, 'No, because '+pa+' × '+pb+' = '+pr+', which does not equal '+pab, ['Yes, because P(A and B) is smaller than both P(A) and P(B)', 'Yes, because both probabilities are between 0 and 1', 'No, because P(A) and P(B) are different'], 'Independent events satisfy P(A and B) = P(A) × P(B). Here '+pa+' × '+pb+' = '+pr+', but P(A and B) is '+pab+'.'); },
    () => { var eq = Math.random() < 0.45, t = twGen(eq), x = t.x; if(t.c[0][0] === t.c[1][0]) return null;
      var txt = 'One '+x.unit+' from the table is chosen at random. Is the event “the '+x.unit+' '+x.ys+'” independent of the '+x.rv+'?'+tw(x.R,x.C,t.c), ex = t.c[0][0]+' ÷ '+t.rt[0]+' = '+t.p[0]+'% and '+t.c[1][0]+' ÷ '+t.rt[1]+' = '+t.p[1]+'%. ';
      return eq ? Q(txt, 'Yes. The probability is '+t.p[0]+'% in both rows', ['No. The counts '+t.c[0][0]+' and '+t.c[1][0]+' are different', 'No. The two rows have different totals', 'Yes. Events in a two-way table are always independent'], ex+'Knowing the '+x.rv+' does not change the probability, so the events are independent.')
        : Q(txt, 'No. The probability is '+t.p[0]+'% in one row and '+t.p[1]+'% in the other', ['Yes. Both rows include some who '+x.yes, 'Yes. The row totals add to the grand total', 'No. Events in a two-way table are never independent'], ex+'Knowing the '+x.rv+' changes the probability, so the events are not independent.'); },
    () => { var want = Math.random() < 0.5;
      return want ? Q('In which situation are the two events independent?', pick(IND), sample(DEP,3), 'In that situation the first result does not change what can happen the second time. In the other three, the first item is not returned, so the second probability depends on the first result.')
        : Q('In which situation are the two events <b>not</b> independent?', pick(DEP), sample(IND,3), 'In that situation the first item is not returned, so the second probability depends on the first result. In the other three, the first result has no effect on the second.'); },
    () => { var p = pick([0.9,0.8,0.7,0.6]), q = r2(1-p), k = rnd(0,2), nm = pick(NAMES), v = [r2(p*p),r2(q*q),r2(p*q)];
      return Q(nm+' scores from a free throw with probability '+p+'. Each shot is independent of the others. '+nm+' takes two shots. What is the probability that '+nm+' '+['scores both times','misses both times','scores the first and misses the second'][k]+'?', N(v[k]), w3([v[0],v[1],v[2],p,q],v[k]).slice(0,3).map(x => N(x)),
        ['Multiply the two probabilities: '+p+' × '+p+' = '+v[0]+'.','The probability of a miss is 1 − '+p+' = '+q+'. '+q+' × '+q+' = '+v[1]+'.','The probability of a miss is 1 − '+p+' = '+q+'. '+p+' × '+q+' = '+v[2]+'.'][k], {calc:true}); },
    () => { var n = pick([200,400,500,1000]);
      if(Math.random() < 0.5){ var k = Math.round(n*pick([0.12,0.28,0.35,0.44,0.62])), e = k/n; return Q('A simulation runs '+n+' trials. The event happens in '+k+' of them. What is the estimated probability of the event?', N(e), w3([r2(1-e),r2(e/10),r2(k/(n+k)),r2(e/2)],e).slice(0,3).map(x => N(x)), 'Divide the number of times the event happened by the number of trials: '+k+' ÷ '+n+' = '+e+'.', {calc:true}); }
      var p = pick([0.15,0.25,0.3,0.4]), c = Math.round(p*n);
      return Q('The probability of an event is '+p+'. A simulation runs '+n+' trials. About how many times would you expect the event to happen?', N(c), w3([n-c,c/10,p*100,n/2],c).slice(0,3).map(x => N(x)), 'Multiply the probability by the number of trials: '+p+' × '+n+' = '+c+'. The actual count will usually be close to this, not exactly equal.', {calc:true}); },
    () => { var pa = rnd(2,7)/10, same = Math.random() < 0.5, pg = same ? pa : r2(pa+pick([0.2,-0.1,0.1,0.3])); if(pg <= 0 || pg >= 1) return null;
      var txt = 'For two events, P(A) = '+pa+' and P(A given B) = '+pg+'. Which statement is correct?', w = ['A and B cannot both happen', same ? 'B makes A certain to happen' : 'A and B always happen together'];
      return same ? Q(txt, 'A and B are independent, because knowing that B happened leaves the probability of A at '+pa, ['A and B are not independent, because P(A given B) is not zero'].concat(w), 'When P(A given B) equals P(A), knowing about B makes no difference to A. That is what independent means.')
        : Q(txt, 'A and B are not independent, because knowing that B happened changes the probability of A from '+pa+' to '+pg, ['A and B are independent, because both probabilities are between 0 and 1'].concat(w), 'When P(A given B) is different from P(A), knowing about B changes the probability of A, so the events are not independent.'); }
  ]});

/* ---------- background cards for Zones 7 and 8 ---------- */
HELP.centre = {title:'Mean, median and range', btn:'mean, median and range', zone:7,
  html:'<p>These three numbers summarise a set of data.</p><p class="note">Mean: add all the values and divide by how many there are.<br>Median: put the values in order and take the middle one.<br>Range: the largest value minus the smallest value.</p><p>For 3, 9, 4, 8, 6 the total is 30, so the mean is 30 ÷ 5 = 6. In order the values are 3, 4, 6, 8, 9, so the median is 6. The range is 9 − 3 = 6.</p><p>If there are two middle values, the median is halfway between them.</p>',
  gen:() => { var a, m, s, k = rnd(0,2); for(var t = 0; t < 80; t++){ a = distinct(5,2,20); m = mean(a); if(m%1 === 0) break; } if(m%1) return null; s = sortN(a);
    var vals = [m,s[2],s[4]-s[0]], c = vals[k];
    return Q('What is the '+['mean','median','range'][k]+' of '+a.join(', ')+'?', N(c), w3(vals.concat([a[2],s[4],m*5,c+1]),c).slice(0,3).map(x => N(x)),
      ['The total is '+(m*5)+'. '+(m*5)+' ÷ 5 = '+m+'.','In order the values are '+s.join(', ')+'. The middle value is '+s[2]+'.','The largest value is '+s[4]+' and the smallest is '+s[0]+'. '+s[4]+' − '+s[0]+' = '+c+'.'][k]); }};
HELP.pctof = {title:'One number as a percentage of another', btn:'writing a percentage', zone:7,
  html:'<p>To write one number as a percentage of another, divide the first by the second and multiply by 100.</p><p class="note">12 out of 40 is 12 ÷ 40 × 100 = 30%</p><p>The second number is the total of the group you are looking at. Choosing the right total is the main thing to get right.</p>',
  gen:() => { var t = pick([20,25,40,50,80]), p = 10*rnd(1,9), a = t*p/100; if(t === 25 && p%20) a = t*(p = 20*rnd(1,4))/100;
    return Q('What is '+a+' out of '+t+' as a percentage?', pc(p), w3([a,r2(t/a),100-p,p/2],p).slice(0,3).map(x => pc(x)), a+' ÷ '+t+' × 100 = '+p+'%.'); }};
HELP.prob = {title:'The probability of one event', btn:'simple probability', zone:8,
  html:'<p>Probability measures how likely an event is, on a scale from 0 (impossible) to 1 (certain).</p><p class="note">When every outcome is equally likely:<br>probability = number of outcomes you want ÷ total number of outcomes</p><p>A bag has 3 red and 5 blue counters. There are 8 counters, so the probability of taking a red one is '+fr(3,8)+'.</p><p>The probability that an event does not happen is 1 minus the probability that it does. The probability of not red is 1 − '+fr(3,8)+' = '+fr(5,8)+'.</p>',
  gen:() => { var r = rnd(1,6), b = rnd(1,6), g = rnd(1,6), n = r+b+g, not = Math.random() < 0.4;
    return Q('A bag holds '+r+' red, '+b+' blue and '+g+' green counters. One counter is taken out at random. What is the probability that it is '+(not ? 'not red' : 'red')+'?', F(not ? n-r : r,n), [F(not ? r : n-r,n), F(r,b+g), F(1,3)],
      'There are '+n+' counters and '+(not ? (n-r)+' of them are not red' : r+' of them are red')+'. The probability is '+fr(not ? n-r : r,n)+(gcd(not ? n-r : r,n) > 1 ? ' = '+frr(not ? n-r : r,n) : '')+'.'); }};
