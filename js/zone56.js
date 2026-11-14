"use strict";
/* Zone 5, Big Wheel (measurement) and Zone 6, Mirror Maze (geometry and networks) */
var PI = Math.PI, RAD = Math.PI/180;
function sinD(a){ return Math.sin(a*RAD); } function cosD(a){ return Math.cos(a*RAD); } function tanD(a){ return Math.tan(a*RAD); }
function U(v,u,dp){ var r = dp === undefined ? Math.round(v*1e4)/1e4 : Math.round(v*Math.pow(10,dp))/Math.pow(10,dp); return N(r, (dp ? r.toFixed(dp) : fmt(r))+' '+u); }
function dg(v){ return N(v, fmt(v)+'°'); }
function b3(d){ d = ((Math.round(d)%360)+360)%360; return {h:('00'+d).slice(-3)+'°', v:'b'+d}; }
var CM2 = 'cm<sup>2</sup>', CM3 = 'cm<sup>3</sup>', M2 = 'm<sup>2</sup>', M3 = 'm<sup>3</sup>';

/* ---------- diagrams ---------- */
function triSVG(o){
  return '<svg class="graph dia" viewBox="0 0 300 190" role="img" aria-label="Right-angled triangle"><path class="fillA" d="M20 160 L215 160 L215 40 Z"/><path class="thin" d="M201 160 v-14 h14"/>'+
    (o.ang ? '<path class="thin" d="M58 160 A38 38 0 0 0 52 140"/><text class="dl" x="64" y="153">'+o.ang+'</text>' : '')+
    (o.adj ? '<text class="dl" x="118" y="178" text-anchor="middle">'+o.adj+'</text>' : '')+(o.opp ? '<text class="dl" x="222" y="104">'+o.opp+'</text>' : '')+
    (o.hyp ? '<text class="dl" x="108" y="92" text-anchor="end">'+o.hyp+'</text>' : '')+'</svg>';
}
function bearSVG(deg, small){
  var cx = 150, cy = 105, R = 80, a = deg*RAD, x = cx+R*Math.sin(a), y = cy-R*Math.cos(a), ar = 30, ax = cx+ar*Math.sin(a), ay = cy-ar*Math.cos(a);
  var acw = small && deg > 180, shown = acw ? 360-deg : deg, mid = (acw ? -(360-deg)/2 : deg/2)*RAD, lr = ar+18;
  return '<svg class="graph dia" viewBox="0 0 300 200" role="img" aria-label="Bearing diagram"><circle cx="150" cy="105" r="80" fill="#fff" stroke="var(--ink-soft)" stroke-width="1.2" stroke-dasharray="3 4"/>'+
    '<line class="thin" x1="150" y1="105" x2="150" y2="16"/><text class="dl" x="150" y="12" text-anchor="middle">N</text><line class="cv" x1="150" y1="105" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'"/>'+
    '<path class="thin" d="M150 '+(105-ar)+' A'+ar+' '+ar+' 0 '+((!acw && deg > 180) ? 1 : 0)+' '+(acw ? 0 : 1)+' '+ax.toFixed(1)+' '+ay.toFixed(1)+'"/>'+
    (small ? '<text class="dl" x="'+(cx+lr*Math.sin(mid)).toFixed(1)+'" y="'+(cy-lr*Math.cos(mid)+4).toFixed(1)+'" text-anchor="middle">'+shown+'°</text>' : '')+
    '<circle class="pt" cx="150" cy="105" r="4"/><text class="dl" x="150" y="124" text-anchor="middle">A</text><circle class="tp" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="5"/><text class="dl" x="'+(x+(x >= 150 ? 9 : -9)).toFixed(1)+'" y="'+(y+4).toFixed(1)+'" text-anchor="'+(x >= 150 ? 'start' : 'end')+'">B</text></svg>';
}
function prismSVG(l,w,h){
  return '<svg class="graph dia" viewBox="0 0 300 170" role="img" aria-label="Rectangular prism"><path class="fillB" d="M50 60 L110 25 L260 25 L200 60 Z"/><path class="fillB" d="M200 60 L260 25 L260 115 L200 150 Z"/><rect class="fillA" x="50" y="60" width="150" height="90"/>'+
    '<text class="dl" x="125" y="166" text-anchor="middle">'+l+'</text><text class="dl" x="238" y="146">'+w+'</text><text class="dl" x="44" y="109" text-anchor="end">'+h+'</text></svg>';
}
function cylSVG(r,h){
  return '<svg class="graph dia" viewBox="0 0 300 180" role="img" aria-label="Cylinder"><path class="fillA" d="M80 45 V140 A70 18 0 0 0 220 140 V45 Z"/><ellipse class="fillB" cx="150" cy="45" rx="70" ry="18"/>'+
    '<line class="thin" x1="150" y1="45" x2="220" y2="45"/><text class="dl" x="228" y="49">'+r+'</text><text class="dl" x="228" y="100">'+h+'</text></svg>';
}
// two parallel lines cut by a transversal. al is the angle at the upper right of each crossing. marks: {U:{NE,NW,SW,SE}, L:{...}}
function parSVG(al, marks){
  var t = al*RAD, yU = 55, yL = 135, dx = 40/Math.tan(t), xU = 150+dx, xL = 150-dx, e = 42, c = Math.cos(t), s = Math.sin(t), out = '';
  var dirs = {NE:al/2, NW:(al+180)/2, SW:180+al/2, SE:270+al/2};
  [['U',xU,yU],['L',xL,yL]].forEach(function(p){ var m = (marks || {})[p[0]] || {};
    for(var k in m){ var d = dirs[k]*RAD, sz = (k === 'NE' || k === 'SW') ? al : 180-al, r = Math.max(22,Math.min(40,14/Math.sin(sz*RAD/2))); out += '<text class="dl" x="'+(p[1]+r*Math.cos(d)).toFixed(1)+'" y="'+(p[2]-r*Math.sin(d)+4).toFixed(1)+'" text-anchor="middle">'+m[k]+'</text>'; } });
  return '<svg class="graph dia" viewBox="0 0 300 190" role="img" aria-label="Two parallel lines and a transversal"><line class="thin" x1="15" y1="'+yU+'" x2="285" y2="'+yU+'"/><line class="thin" x1="15" y1="'+yL+'" x2="285" y2="'+yL+'"/>'+
    '<path class="thin" d="M262 '+(yU-5)+' l8 5 l-8 5 M262 '+(yL-5)+' l8 5 l-8 5"/><line class="cv" x1="'+(xL-e*c).toFixed(1)+'" y1="'+(yL+e*s).toFixed(1)+'" x2="'+(xU+e*c).toFixed(1)+'" y2="'+(yU-e*s).toFixed(1)+'"/>'+out+'</svg>';
}
function triAng(o){
  var A = o.iso ? [60,150] : [40,150], B = o.iso ? [240,150] : [250,150], C = o.iso ? [150,40] : [110,45];
  return '<svg class="graph dia" viewBox="0 0 300 175" role="img" aria-label="Triangle"><path class="fillA" d="M'+A+' L'+B+' L'+C+' Z"/>'+
    (o.ext ? '<line class="thin" x1="'+B[0]+'" y1="150" x2="295" y2="150"/><text class="dl" x="'+(B[0]+12)+'" y="140">'+o.ext+'</text>' : '')+
    (o.iso ? '<path class="thin" d="M100 92 l10 6 M190 98 l10 -6"/>' : '')+
    (o.a ? '<text class="dl" x="'+(A[0]+(o.iso ? 22 : 30))+'" y="143">'+o.a+'</text>' : '')+(o.b ? '<text class="dl" x="'+(B[0]-(o.iso ? 22 : 34))+'" y="143" text-anchor="end">'+o.b+'</text>' : '')+
    (o.c ? '<text class="dl" x="'+(C[0]+(o.iso ? 0 : 12))+'" y="'+(C[1]+32)+'" text-anchor="middle">'+o.c+'</text>' : '')+'</svg>';
}
var NETS = [
  {n:[[60,150,'A'],[240,150,'B'],[150,40,'C']], e:[[0,1],[1,2],[2,0]]},
  {n:[[70,150,'A'],[230,150,'B'],[230,40,'C'],[70,40,'D']], e:[[0,1],[1,2],[2,3],[3,0],[0,2]]},
  {n:[[70,150,'A'],[230,150,'B'],[230,40,'C'],[70,40,'D'],[150,95,'E']], e:[[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]]},
  {n:[[50,95,'A'],[150,95,'B'],[240,40,'C'],[240,150,'D']], e:[[0,1],[1,2],[1,3]]},
  {n:[[80,160,'A'],[220,160,'B'],[220,90,'C'],[80,90,'D'],[150,30,'E']], e:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,2]]}
];
function netInfo(N0){ var deg = N0.n.map(() => 0); N0.e.forEach(e => { deg[e[0]]++; deg[e[1]]++; }); return {v:N0.n.length, e:N0.e.length, f:N0.e.length-N0.n.length+2, deg:deg, odd:deg.filter(d => d%2).length}; }
function netSVG(N0, showDeg){
  var d = netInfo(N0).deg, s = '';
  N0.e.forEach(e => { s += '<line class="thin" x1="'+N0.n[e[0]][0]+'" y1="'+N0.n[e[0]][1]+'" x2="'+N0.n[e[1]][0]+'" y2="'+N0.n[e[1]][1]+'" style="stroke-width:2.5"/>'; });
  N0.n.forEach((p,i) => { s += '<circle class="node" cx="'+p[0]+'" cy="'+p[1]+'" r="13"/><text class="dl" x="'+p[0]+'" y="'+(p[1]+4.5)+'" text-anchor="middle">'+(showDeg ? d[i] : p[2])+'</text>'; });
  return '<svg class="graph dia" viewBox="0 0 300 185" role="img" aria-label="Network diagram">'+s+'</svg>';
}

/* ---------- 5.1 Surface area ---------- */
LSN('5.1','Surface area',{
  w:sliderW('w51','The surface area of a cylinder',[['r','Radius, cm',1,6,1,3],['h','Height, cm',1,12,1,5]], v => { var e = 2*PI*v.r*v.r, c = 2*PI*v.r*v.h;
    return cylSVG('r = '+v.r,'h = '+v.h)+'<p>Two circular ends: 2 × π × '+v.r+'<sup>2</sup> = '+e.toFixed(1)+' '+CM2+'</p><p>Curved surface: 2 × π × '+v.r+' × '+v.h+' = '+c.toFixed(1)+' '+CM2+'</p><p class="rule" style="font-size:18px">Total: '+(e+c).toFixed(1)+' '+CM2+'</p>'; }),
  body:w => Pp('The surface area of a solid is the total area of all its outside faces. It tells you how much paint, paper or sheet metal is needed to cover the solid.')+
    sec('Rectangular prisms','A rectangular prism has six rectangular faces in three matching pairs: top and bottom, front and back, and the two ends.',prismSVG('l','w','h'),'!Surface area = 2(lw + lh + wh). For a box 5 cm by 3 cm by 2 cm: 2(15 + 10 + 6) = 62 '+CM2+'.',hb('area'))+
    sec('Triangular prisms','A triangular prism has two triangular ends and three rectangular faces. Find each area and add them. Each rectangle has one side of the triangle as its width and the length of the prism as its length.')+
    sec('Cylinders','A cylinder has two circular ends, each with area π'+S('r',2)+'. Its curved surface unrolls into a rectangle. The rectangle’s height is the height of the cylinder, and its width is the circumference of the circle, 2πr.','!Surface area = 2π'+S('r',2)+' + 2πrh',w)+
    sec('Composite solids','A composite solid is made of simpler solids joined together. Add the areas of the faces you can see. Faces that are joined together are inside the solid, so they are not counted.','!A cube with 2 cm sides sits on a larger box. The cube covers 4 '+CM2+' of the box’s top, but the cube’s own top adds 4 '+CM2+' back. So the cube adds only its four side faces: 4 × 4 = 16 '+CM2+'.')+
    sec('Units','Area is measured in square units, such as '+CM2+' or '+M2+'. Make sure all the lengths are in the same unit before you start.'),
  help:['area','area','area','area','area','area'],
  gens:[
    () => { var l = rnd(4,10), w = ri(2,8,[l]), h = ri(2,9,[l,w]), A = 2*(l*w+l*h+w*h);
      return Q('A rectangular prism is '+l+' cm long, '+w+' cm wide and '+h+' cm high. What is its surface area?', U(A,CM2), [U(A/2,CM2), U(l*w*h,CM2), U(2*(l+w+h),CM2)], '2 × ('+l+' × '+w+' + '+l+' × '+h+' + '+w+' × '+h+') = 2 × ('+(l*w)+' + '+(l*h)+' + '+(w*h)+') = '+A+' '+CM2+'.'); },
    () => { var r = rnd(3,6), h = rnd(3,12), A = 2*PI*r*r+2*PI*r*h;
      return Q('A closed cylinder has radius '+r+' cm and height '+h+' cm. What is its surface area, to one decimal place?', U(A,CM2,1), [U(PI*r*r*h,CM2,1), U(2*PI*r*h,CM2,1), U(PI*r*r+2*PI*r*h,CM2,1)], 'Two ends: 2 × π × '+r+'<sup>2</sup> = '+(2*PI*r*r).toFixed(1)+'. Curved surface: 2 × π × '+r+' × '+h+' = '+(2*PI*r*h).toFixed(1)+'. Total: '+A.toFixed(1)+' '+CM2+'.', {calc:true}); },
    () => { var r = rnd(3,6), h = rnd(8,15), A = 2*PI*r*h;
      return Q('A tin has radius '+r+' cm and height '+h+' cm. A label covers its curved surface only. What is the area of the label, to one decimal place?', U(A,CM2,1), [U(PI*r*r*h,CM2,1), U(A+2*PI*r*r,CM2,1), U(PI*r*h,CM2,1)], 'The curved surface unrolls into a rectangle '+h+' cm high and 2 × π × '+r+' cm wide. Its area is '+A.toFixed(1)+' '+CM2+'.', {calc:true}); },
    () => { var t = pick([[3,4,5],[6,8,10],[5,12,13]]), L = rnd(5,12), A = t[0]*t[1]+(t[0]+t[1]+t[2])*L;
      return Q('A triangular prism has right-angled triangular ends with sides '+t[0]+' cm, '+t[1]+' cm and '+t[2]+' cm. The prism is '+L+' cm long. What is its surface area?', U(A,CM2), [U(t[0]*t[1]/2*L,CM2), U(t[0]*t[1]/2+(t[0]+t[1]+t[2])*L,CM2), U(t[0]*t[1]+(t[0]+t[1])*L,CM2)],
        'Each triangle has area ½ × '+t[0]+' × '+t[1]+' = '+(t[0]*t[1]/2)+', so the two ends give '+(t[0]*t[1])+'. The three rectangles give ('+t[0]+' + '+t[1]+' + '+t[2]+') × '+L+' = '+((t[0]+t[1]+t[2])*L)+'. Total: '+A+' '+CM2+'.'); },
    () => { var l = rnd(5,9), w = rnd(4,8), h = rnd(2,5), s = rnd(2,Math.min(l,w)-1), A = 2*(l*w+l*h+w*h);
      return Q('A cube with '+s+' cm sides sits on top of a rectangular prism that is '+l+' cm by '+w+' cm by '+h+' cm. What is the total surface area of the solid?', U(A+4*s*s,CM2), [U(A+6*s*s,CM2), U(A+5*s*s,CM2), U(A+2*s*s,CM2)],
        'The prism alone has surface area '+A+' '+CM2+'. The cube hides '+(s*s)+' '+CM2+' of the top, and the cube’s own top replaces it. The cube adds its four side faces: 4 × '+(s*s)+' = '+(4*s*s)+'. Total: '+(A+4*s*s)+' '+CM2+'.'); },
    () => { var l = rnd(3,6), w = rnd(3,5), h = pick([2.4,2.5,3]), A = 2*h*(l+w)+l*w;
      return Q('A room is '+l+' m long, '+w+' m wide and '+h+' m high. The four walls and the ceiling are painted. What area is painted?', U(A,M2), [U(2*h*(l+w),M2), U(2*h*(l+w)+2*l*w,M2), U(l*w*h,M2)],
        'The four walls: 2 × '+h+' × ('+l+' + '+w+') = '+fmt(2*h*(l+w))+'. The ceiling: '+l+' × '+w+' = '+(l*w)+'. Total: '+fmt(A)+' '+M2+'. The floor is not painted.'); }
  ]});

/* ---------- 5.2 Volume of composite solids ---------- */
LSN('5.2','Volume of composite solids',{
  w:sliderW('w52','A round rainwater tank',[['r','Radius, m',0.5,3,0.5,1],['h','Height, m',1,5,0.5,2]], v => { var V = PI*v.r*v.r*v.h;
    return cylSVG('r = '+v.r+' m','h = '+v.h+' m')+'<p>Area of the base: π × '+v.r+'<sup>2</sup> = '+(PI*v.r*v.r).toFixed(2)+' '+M2+'</p><p class="rule" style="font-size:18px">Volume: '+V.toFixed(2)+' '+M3+'</p><p>One cubic metre holds 1000 litres, so the tank holds about '+Math.round(V*1000)+' litres.</p>'; }),
  body:w => Pp('Volume is the amount of space inside a solid. It is measured in cubic units, such as '+CM3+' or '+M3+'.')+
    sec('Prisms and cylinders','A prism has the same cross-section all the way along. Its volume is the area of that cross-section multiplied by its length or height.','!Rectangular prism: V = lwh<br>Triangular prism: V = ½ × base × height of the triangle × length<br>Cylinder: V = π'+S('r',2)+'h',w,hb('volprism'))+
    sec('Adding solids','For a solid made of two parts, find the volume of each part and add them.','!A box 6 cm by 4 cm by 3 cm has a cylinder of radius 2 cm and height 5 cm on top. Box: 6 × 4 × 3 = 72 '+CM3+'. Cylinder: π × '+S(2,2)+' × 5 = 62.8 '+CM3+'. Total: 134.8 '+CM3+'.')+
    sec('Subtracting a hole','If a piece has been removed, subtract its volume.','!A block 10 cm by 8 cm by 5 cm has a round hole of radius 2 cm drilled through its 5 cm height. Block: 400 '+CM3+'. Hole: π × '+S(2,2)+' × 5 = 62.8 '+CM3+'. What is left: 337.2 '+CM3+'.')+
    sec('Capacity','Capacity is the amount of liquid a container holds. 1 '+CM3+' holds 1 millilitre, and 1 '+M3+' holds 1000 litres.'),
  help:['volprism','volprism','volprism','volprism','volprism','volprism'],
  gens:[
    () => { var l = rnd(4,10), w = ri(2,8,[l]), h = ri(2,9,[l,w]);
      return Q('A rectangular prism is '+l+' cm long, '+w+' cm wide and '+h+' cm high. What is its volume?', U(l*w*h,CM3), [U(2*(l*w+l*h+w*h),CM3), U(l*w+l*h+w*h,CM3), U(l*w,CM3)], l+' × '+w+' × '+h+' = '+(l*w*h)+' '+CM3+'.'); },
    () => { var r = rnd(2,6), h = rnd(3,12), V = PI*r*r*h;
      return Q('A cylinder has radius '+r+' cm and height '+h+' cm. What is its volume, to one decimal place?', U(V,CM3,1), [U(2*PI*r*h,CM3,1), U(PI*r*h,CM3,1), U(2*V,CM3,1)], 'π × '+r+'<sup>2</sup> × '+h+' = '+V.toFixed(1)+' '+CM3+'.', {calc:true}); },
    () => { var b = 2*rnd(2,6), t = rnd(3,9), L = rnd(5,12);
      return Q('The end of a triangular prism is a triangle with base '+b+' cm and height '+t+' cm. The prism is '+L+' cm long. What is its volume?', U(b*t/2*L,CM3), [U(b*t*L,CM3), U(b*t/2+L,CM3), U((b+t)*L,CM3)], 'Area of the triangle: ½ × '+b+' × '+t+' = '+(b*t/2)+'. Multiply by the length: '+(b*t/2)+' × '+L+' = '+(b*t/2*L)+' '+CM3+'.'); },
    () => { var l = rnd(5,9), w = rnd(4,8), h = rnd(2,5), r = rnd(1,2), hc = rnd(3,8), V = l*w*h+PI*r*r*hc;
      return Q('A box '+l+' cm by '+w+' cm by '+h+' cm has a cylinder of radius '+r+' cm and height '+hc+' cm standing on top. What is the total volume, to one decimal place?', U(V,CM3,1), [U(l*w*h,CM3,1), U(l*w*h+4*PI*r*r*hc,CM3,1), U(PI*r*r*hc,CM3,1)],
        'Box: '+l+' × '+w+' × '+h+' = '+(l*w*h)+'. Cylinder: π × '+r+'<sup>2</sup> × '+hc+' = '+(PI*r*r*hc).toFixed(1)+'. Total: '+V.toFixed(1)+' '+CM3+'.', {calc:true}); },
    () => { var l = rnd(8,12), w = rnd(6,10), h = rnd(3,8), r = rnd(1,2), B = l*w*h, H = PI*r*r*h;
      return Q('A block '+l+' cm by '+w+' cm by '+h+' cm has a round hole of radius '+r+' cm drilled through its '+h+' cm height. What volume is left, to one decimal place?', U(B-H,CM3,1), [U(B+H,CM3,1), U(B,CM3,1), U(B-2*PI*r*h,CM3,1)],
        'Block: '+B+'. Hole: π × '+r+'<sup>2</sup> × '+h+' = '+H.toFixed(1)+'. What is left: '+(B-H).toFixed(1)+' '+CM3+'.', {calc:true}); },
    () => { var l = pick([1,1.5,2,2.5,3]), w = pick([1,1.5,2]), h = pick([0.5,1,1.5,2]), V = l*w*h;
      return Q('A tank is '+l+' m long, '+w+' m wide and '+h+' m deep. How many litres does it hold?', U(V*1000,'L'), [U(V,'L'), U(V*100,'L'), U(V*10000,'L')], 'Volume: '+l+' × '+w+' × '+h+' = '+fmt(V)+' '+M3+'. Each cubic metre holds 1000 litres, so the tank holds '+fmt(V*1000)+' L.'); }
  ]});

/* ---------- 5.3 Angles of elevation and depression ---------- */
LSN('5.3','Angles of elevation and depression',{
  w:sliderW('w53','Finding a height from a distance and an angle',[['d','Distance, m',10,100,5,40],['a','Angle of elevation, °',5,75,5,35]], v => { var h = v.d*tanD(v.a), s = Math.min(220/v.d,150/h), bx = 50+v.d*s, cy = 170-h*s;
    return '<svg class="graph dia" viewBox="0 0 300 190" role="img" aria-label="Triangle showing the distance and the height"><path class="fillA" d="M50 170 L'+bx.toFixed(1)+' 170 L'+bx.toFixed(1)+' '+cy.toFixed(1)+' Z"/><text class="dl" x="'+((50+bx)/2).toFixed(1)+'" y="186" text-anchor="middle">'+v.d+' m</text><text class="dl" x="'+(bx+6).toFixed(1)+'" y="'+((170+cy)/2).toFixed(1)+'">h</text><text class="dl" x="44" y="172" text-anchor="end">'+v.a+'°</text></svg>'+
      '<p class="rule" style="font-size:18px">h = '+v.d+' × tan '+v.a+'° = '+h.toFixed(1)+' m</p>'; }),
  body:w => Pp('Trigonometry finds heights and distances that cannot be measured directly, such as the height of a tower or the distance to a boat.')+
    sec('The three ratios','In a right-angled triangle, the sides are named from the angle you are using. The <b>opposite</b> side is across from the angle. The <b>adjacent</b> side is next to it. The <b>hypotenuse</b> is the longest side.',triSVG({ang:'θ',adj:'adjacent',opp:'opposite',hyp:'hypotenuse'}),'!sin θ = '+fr('opposite','hypotenuse')+'&nbsp;&nbsp; cos θ = '+fr('adjacent','hypotenuse')+'&nbsp;&nbsp; tan θ = '+fr('opposite','adjacent'),hb('trig'))+
    sec('Angle of elevation','The <b>angle of elevation</b> is the angle you look up through, measured from the horizontal. If you stand 40 m from a tower and look up at 35° to see the top, the height is the opposite side and the 40 m is the adjacent side. So tan 35° = '+fr('h',40)+', which gives h = 40 × tan 35° = 28.0 m.',w)+
    sec('Angle of depression','The <b>angle of depression</b> is the angle you look down through, measured from the horizontal. From the top of a 50 m cliff, a boat is seen at an angle of depression of 20°. The distance d to the boat satisfies tan 20° = '+fr(50,'d')+', so d = 50 ÷ tan 20° = 137.4 m.')+
    sec('The two angles are equal','If you look down at a friend at 35°, your friend looks up at you at 35°. The two horizontal lines are parallel, so the angle of depression and the angle of elevation are alternate angles.')+
    sec('Finding the angle','When you know two sides, use the inverse key on the calculator. A ramp that rises 2 m over a horizontal distance of 10 m makes an angle of '+S('tan',M+'1')+'(2 ÷ 10) = 11.3° with the ground.')+
    sec('Eye height','Angles are measured from eye level. If your eyes are 1.6 m above the ground, add 1.6 m to the height you calculate.'),
  help:['trig','trig','trig',null,'trig','trig'],
  gens:[
    () => { var d = 5*rnd(2,16), a = ri(20,65,[45]), h = d*tanD(a);
      return Q('From a point '+d+' m from the base of a tower, the angle of elevation of the top is '+a+'°. How high is the tower, to one decimal place?'+triSVG({adj:d+' m',opp:'h',ang:a+'°'}), U(h,'m',1), [U(d*sinD(a),'m',1), U(d*cosD(a),'m',1), U(d/tanD(a),'m',1)],
        'The height is opposite the angle and the '+d+' m is adjacent, so use tan. h = '+d+' × tan '+a+'° = '+h.toFixed(1)+' m.', {calc:'trig'}); },
    () => { var h = 10*rnd(2,12), a = ri(15,60,[45]), d = h/tanD(a);
      return Q('From the top of a cliff '+h+' m high, the angle of depression of a boat is '+a+'°. How far is the boat from the base of the cliff, to one decimal place?', U(d,'m',1), [U(h*tanD(a),'m',1), U(h/sinD(a),'m',1), U(h*cosD(a),'m',1)],
        'The angle of elevation from the boat is also '+a+'°. The cliff is opposite that angle and the distance is adjacent, so tan '+a+'° = '+fr(h,'d')+'. d = '+h+' ÷ tan '+a+'° = '+d.toFixed(1)+' m.', {calc:'trig'}); },
    () => { var h = rnd(2,9), d = h+rnd(2,12), a = Math.round(Math.atan(h/d)/RAD);
      return Q('A ramp rises '+h+' m over a horizontal distance of '+d+' m. What angle does it make with the ground, to the nearest degree?', dg(a), [dg(Math.round(Math.asin(h/d)/RAD)), dg(Math.round(Math.atan(d/h)/RAD)), dg(Math.round(Math.acos(h/d)/RAD))],
        'The rise is opposite the angle and the horizontal distance is adjacent, so tan θ = '+fr(h,d)+'. θ = '+S('tan',M+'1')+'('+h+' ÷ '+d+') = '+a+'°.', {calc:'trig'}); },
    () => { var a = ri(20,70,[45,60]), nm = pick(NAMES);
      return Q(nm+' looks down from a window at a car. The angle of depression is '+a+'°. What is the angle of elevation of the window from the car?', dg(a), [dg(90-a), dg(180-a), dg(2*a)], 'The two horizontal lines are parallel, so the angle of depression and the angle of elevation are alternate angles. They are equal.'); },
    () => { var d = rnd(8,40), a = ri(25,60,[45]), e = pick([1.5,1.6,1.7]), nm = pick(NAMES), t = d*tanD(a);
      return Q(nm+' stands '+d+' m from a tree. The angle of elevation of the top of the tree from eye level is '+a+'°, and eye level is '+e+' m above the ground. How tall is the tree, to one decimal place?', U(t+e,'m',1), [U(t,'m',1), U(t-e,'m',1), U(d*sinD(a)+e,'m',1)],
        'Height above eye level: '+d+' × tan '+a+'° = '+t.toFixed(1)+' m. Add the eye height: '+t.toFixed(1)+' + '+e+' = '+(t+e).toFixed(1)+' m.', {calc:'trig'}); },
    () => { var L = rnd(3,10), a = rnd(55,80);
      return Q('A ladder '+L+' m long leans against a wall and makes an angle of '+a+'° with the ground. How high up the wall does it reach, to one decimal place?'+triSVG({hyp:L+' m',opp:'h',ang:a+'°'}), U(L*sinD(a),'m',1), [U(L*cosD(a),'m',1), U(L*tanD(a),'m',1), U(L/sinD(a),'m',1)],
        'The height is opposite the angle and the ladder is the hypotenuse, so use sin. h = '+L+' × sin '+a+'° = '+(L*sinD(a)).toFixed(1)+' m.', {calc:'trig'}); }
  ]});

/* ---------- 5.4 Bearings ---------- */
var COMP = {NE:45, E:90, SE:135, S:180, SW:225, W:270, NW:315};
var COMPN = {NE:'north-east', E:'east', SE:'south-east', S:'south', SW:'south-west', W:'west', NW:'north-west'};
LSN('5.4','Bearings',{
  w:sliderW('w54','A bearing and what it means',[['b','Bearing, °',0,355,5,60]], v => { var n = 10*cosD(v.b), e = 10*sinD(v.b);
    return bearSVG(v.b)+'<p class="rule" style="font-size:18px">Bearing '+b3(v.b).h+'</p><p>After 10 km on this bearing, B is '+Math.abs(n).toFixed(1)+' km '+(n >= 0 ? 'north' : 'south')+' and '+Math.abs(e).toFixed(1)+' km '+(e >= 0 ? 'east' : 'west')+' of A.</p>'; }),
  body:w => Pp('A bearing is a direction given as an angle. Ships, planes and hikers use bearings to say exactly which way to travel.')+
    sec('True bearings','A <b>true bearing</b> is the angle measured clockwise from north. It is written with three digits. North is 000°, east is 090°, south is 180° and west is 270°. A bearing of 045° is north-east.',w)+
    sec('Reading a bearing from a diagram','Start at the north line and turn clockwise until you reach the direction of travel. If a diagram shows an angle of 40° measured anticlockwise from north, the bearing is 360° − 40° = 320°.')+
    sec('Back bearings','The bearing of B from A and the bearing of A from B point in opposite directions. They differ by 180°. If the bearing of B from A is 060°, the bearing of A from B is 240°. If the first bearing is more than 180°, subtract 180° instead of adding it.')+
    sec('Bearings and trigonometry','A boat sails 10 km on a bearing of 060°. Draw a right-angled triangle with the 10 km as the hypotenuse. The distance north is next to the 60° angle, so it is 10 × cos 60° = 5 km. The distance east is opposite the angle, so it is 10 × sin 60° = 8.7 km.',hb('trig'))+
    sec('Finding a bearing','A hiker walks 3 km north and then 4 km east. The angle between north and the line back to the start satisfies tan θ = '+fr(4,3)+', so θ = 53°. The bearing of the finish from the start is 053°.'),
  help:[null,null,null,'trig','trig','trig'],
  gens:[
    () => { var k = pick(Object.keys(COMP)), c = COMP[k], t = pick([45,90,135]), cw = Math.random() < 0.5, raw = c+(cw ? t : -t), nb = (raw+360)%360, other = (c+(cw ? -t : t)+360)%360;
      return Q('A ship is heading '+COMPN[k]+'. It turns '+t+'° '+(cw ? 'clockwise' : 'anticlockwise')+'. What is its new true bearing?', b3(nb), [b3(other), b3(c), b3(((t === 90 ? c : nb)+180)%360)],
        'Heading '+COMPN[k]+' is a bearing of '+b3(c).h+'. '+(cw ? 'A clockwise turn adds' : 'An anticlockwise turn subtracts')+' the angle: '+c+'° '+(cw ? '+' : M)+' '+t+'° = '+(raw < 0 ? M+(-raw) : raw)+'°.'+(raw >= 360 ? ' That is more than a full turn, so subtract 360° to get '+b3(nb).h+'.' : raw < 0 ? ' That is below zero, so add 360° to get '+b3(nb).h+'.' : ' The bearing is '+b3(nb).h+'.')); },
    () => { var d = 10*ri(2,34,[9,18,27]), L = d > 180 ? 360-d : d;
      return Q('The diagram shows the direction from A to B. What is the bearing of B from A?'+bearSVG(d,true), b3(d), d > 180 ? [b3(L), b3(180+L), b3(180-L)] : [b3(360-d), b3(180+d), b3(Math.abs(180-d))],
        d > 180 ? 'The '+L+'° is measured anticlockwise from north. Measured clockwise, the angle is 360° − '+L+'° = '+d+'°.' : 'The angle is measured clockwise from north, so the bearing is '+b3(d).h+'. A bearing always has three digits.'); },
    () => { var d = 5*ri(2,70,[18,36,54]), back = (d+180)%360;
      return Q('The bearing of B from A is '+b3(d).h+'. What is the bearing of A from B?', b3(back), [b3(360-d), b3((d+90)%360), b3(d < 180 ? 180-d : d-90)], 'The return direction is the opposite direction, which differs by 180°. '+(d < 180 ? d+'° + 180° = '+back+'°.' : d+'° − 180° = '+back+'°.')); },
    () => { var d = rnd(5,40), a = ri(10,80,[45]);
      return Q('A boat sails '+d+' km on a bearing of '+b3(a).h+'. How far north of its starting point is it, to one decimal place?', U(d*cosD(a),'km',1), [U(d*sinD(a),'km',1), U(d*tanD(a),'km',1), U(d/cosD(a),'km',1)],
        'The distance north is next to the '+a+'° angle and the '+d+' km is the hypotenuse, so use cos. '+d+' × cos '+a+'° = '+(d*cosD(a)).toFixed(1)+' km.', {calc:'trig'}); },
    () => { var d = rnd(5,40), a = ri(10,80,[45]);
      return Q('A boat sails '+d+' km on a bearing of '+b3(a).h+'. How far east of its starting point is it, to one decimal place?', U(d*sinD(a),'km',1), [U(d*cosD(a),'km',1), U(d*tanD(a),'km',1), U(d/sinD(a),'km',1)],
        'The distance east is opposite the '+a+'° angle and the '+d+' km is the hypotenuse, so use sin. '+d+' × sin '+a+'° = '+(d*sinD(a)).toFixed(1)+' km.', {calc:'trig'}); },
    () => { var a = rnd(2,12), b = ri(2,12,[a]), t = Math.round(Math.atan(b/a)/RAD);
      return Q('A hiker walks '+a+' km north and then '+b+' km east. What is the bearing of the finish from the start, to the nearest degree?', b3(t), [b3(Math.round(Math.atan(a/b)/RAD)), b3(360-t), b3(180-t)],
        'The angle from north satisfies tan θ = '+fr(b,a)+'. θ = '+S('tan',M+'1')+'('+b+' ÷ '+a+') = '+t+'°, so the bearing is '+b3(t).h+'.', {calc:'trig'}); }
  ]});

/* ---------- 5.5 Logarithmic scales ---------- */
function sp(n){ return n.toLocaleString('en-US').replace(/,/g,' '); }
var PH = [['lemon juice',2],['vinegar',3],['tomato juice',4],['black coffee',5],['milk',6],['pure water',7]];
LSN('5.5','Logarithmic scales',{
  w:sliderW('w55','Comparing two earthquakes',[['a','First magnitude',1,9,1,4],['b','Second magnitude',1,9,1,6]], v => { var d = Math.abs(v.b-v.a), big = Math.max(v.a,v.b), sm = Math.min(v.a,v.b);
    return '<p class="rule" style="font-size:18px">'+(d ? 'Difference: '+d+', so '+S(10,d)+' = '+sp(Math.pow(10,d))+' times' : 'The same magnitude')+'</p><p>'+(d ? 'The shaking in a magnitude '+big+' earthquake is '+sp(Math.pow(10,d))+' times as large as in a magnitude '+sm+' earthquake.' : 'Both earthquakes shake the ground by the same amount.')+'</p>'; }),
  body:w => Pp('Some quantities cover an enormous range. The loudest sounds people hear are more than a million million times as intense as the quietest. A logarithmic scale fits such a range into a short list of numbers.')+
    sec('Ordinary scales and logarithmic scales','On an ordinary scale, each step adds the same amount: 10, 20, 30, 40. On a <b>logarithmic scale</b>, each step multiplies by the same amount, usually 10: 1, 10, 100, 1000.',hb('expmean'))+
    sec('Powers of 10','The steps on a logarithmic scale are powers of 10. '+S(10,1)+' = 10, '+S(10,2)+' = 100, '+S(10,3)+' = 1000 and '+S(10,6)+' = 1 000 000. A number such as 4700 lies between '+S(10,3)+' and '+S(10,4)+'.')+
    sec('Earthquakes','On the Richter scale, each whole number means the ground shakes 10 times as much. A magnitude 6 earthquake shakes 10 times as much as a magnitude 5, and 10 × 10 = 100 times as much as a magnitude 4.',w)+
    sec('Sound','Loudness is measured in decibels. Every 10 decibels means the sound is 10 times as intense. A 70 decibel vacuum cleaner is 10 × 10 = 100 times as intense as a 50 decibel conversation.')+
    sec('Acidity','The pH scale measures acidity. Each step down the scale means 10 times as acidic. Lemon juice at pH 2 is 1000 times as acidic as black coffee at pH 5, because 5 − 2 = 3 and '+S(10,3)+' = 1000.')+
    sec('The main idea','A difference of n on a logarithmic scale means the quantity has been multiplied by '+S(10,'n')+'. It does not mean that n has been added.'),
  help:['expmean','expmean','expmean','expmean','expmean','expmean'],
  gens:[
    () => { var a = rnd(2,5), d = rnd(2,4);
      return Q('On the Richter scale, each whole number means 10 times as much shaking. How many times as much does the ground shake in a magnitude '+(a+d)+' earthquake as in a magnitude '+a+' earthquake?', N(Math.pow(10,d),sp(Math.pow(10,d))), [N(d), N(10*d), N(Math.pow(2,d))], 'The difference is '+d+'. Each step multiplies by 10, so the shaking is '+S(10,d)+' = '+sp(Math.pow(10,d))+' times as much.'); },
    () => { var b = 10*rnd(3,6), d = pick([20,30,40]);
      return Q('Every 10 decibels means a sound is 10 times as intense. How many times as intense is a '+(b+d)+' decibel sound as a '+b+' decibel sound?', N(Math.pow(10,d/10),sp(Math.pow(10,d/10))), [N(d), N(d/10), N(d*10)], 'The difference is '+d+' decibels, which is '+(d/10)+' steps of 10. So the sound is '+S(10,d/10)+' = '+sp(Math.pow(10,d/10))+' times as intense.'); },
    () => { var n = rnd(3,7), V = rnd(2,8)*Math.pow(10,n-1)+rnd(1,9)*Math.pow(10,n-2), o = k => S(10,k-1)+' and '+S(10,k);
      return Q('Between which two powers of 10 does '+sp(V)+' lie?', o(n), [o(n-1), o(n+1), o(n+2)], S(10,n-1)+' = '+sp(Math.pow(10,n-1))+' and '+S(10,n)+' = '+sp(Math.pow(10,n))+'. '+sp(V)+' is between them.'); },
    () => { var s = pick([2,3,5,20,50]), k = rnd(2,4), f = v => N(v,sp(v));
      return Q('On a logarithmic scale, each step to the right multiplies by 10. A point is '+k+' steps to the right of '+s+'. What value does it show?', f(s*Math.pow(10,k)), [f(s+k), f(s*k*10), f(s*Math.pow(10,k-1))], 'Multiply by 10 for each step: '+s+' × '+S(10,k)+' = '+sp(s*Math.pow(10,k))+'.'); },
    () => { var p = sample(PH,2).sort((x,y) => x[1]-y[1]), d = p[1][1]-p[0][1]; if(d < 2) return null;
      return Q('Each step down the pH scale means 10 times as acidic. '+p[0][0].charAt(0).toUpperCase()+p[0][0].slice(1)+' has pH '+p[0][1]+' and '+p[1][0]+' has pH '+p[1][1]+'. How many times as acidic is '+p[0][0]+'?', N(Math.pow(10,d),sp(Math.pow(10,d))), [N(d), N(10*d), N(r2(p[1][1]/p[0][1]))],
        'The difference is '+d+' steps. Each step multiplies by 10, so '+p[0][0]+' is '+S(10,d)+' = '+sp(Math.pow(10,d))+' times as acidic.'); },
    () => { var a = rnd(2,6), d = rnd(2,3), m = Math.pow(10,d);
      return Q('A logarithmic scale goes up in powers of 10. A reading rises from '+a+' to '+(a+d)+'. What happens to the quantity being measured?', 'It is multiplied by '+sp(m), ['It increases by '+d, 'It is multiplied by '+d, 'It increases by '+sp(m)], 'A rise of '+d+' on the scale means multiplying by 10 a total of '+d+' times, which is multiplying by '+sp(m)+'.'); }
  ]});

/* ---------- 5.6 Scale and measurement error ---------- */
LSN('5.6','Scale and measurement error',{
  w:sliderW('w56','Scaling a solid',[['k','Scale factor',1,5,0.5,2]], v => { var k = v.k, big = 125;
    return ['Every length is multiplied by '+k,'Every area is multiplied by '+k+'<sup>2</sup> = '+fmt(k*k),'The volume is multiplied by '+k+'<sup>3</sup> = '+fmt(k*k*k)].map((t,i) => '<div class="barrow'+(i === 1 ? ' two' : '')+'"><span>'+t+'</span><i style="width:'+(Math.pow(k,i+1)/big*100)+'%"></i><b>× '+fmt(Math.pow(k,i+1))+'</b></div>').join('')+'<p>A model that is '+k+' times as long in every direction needs '+fmt(k*k)+' times as much paint and '+fmt(k*k*k)+' times as much material.</p>'; }),
  body:w => Pp('Plans, maps and models are scaled copies of real things. This lesson covers how scaling works and how accurate a measurement can be.')+
    sec('Scales on plans and maps','A scale of 1 : 100 means 1 unit on the plan stands for 100 of the same unit in real life. So 1 cm on the plan is 100 cm, or 1 m, in real life.','!On a 1 : 200 plan a wall is 4 cm long. The real wall is 4 × 200 = 800 cm = 8 m.',hb('ratio'))+
    sec('Scale factor, area and volume','When every length of a shape is multiplied by a scale factor k, every area is multiplied by '+S('k',2)+' and the volume is multiplied by '+S('k',3)+'. This matters for 3D printing: a model printed twice as large in every direction uses 8 times as much plastic.',w)+
    sec('Measurement error','No measurement is exact. A length recorded as 12 cm to the nearest centimetre could be anywhere from 11.5 cm to 12.5 cm. The largest possible error is half of the smallest unit on the measuring tool.',hb('round'))+
    sec('Errors in calculations','An error in a measurement carries into anything calculated from it. A square with sides measured as 10 cm to the nearest centimetre has an area between '+S('9.5',2)+' = 90.25 '+CM2+' and '+S('10.5',2)+' = 110.25 '+CM2+'. A small error in the length gives a larger error in the area.'),
  help:['ratio','ratio','sqrt','expmean','round','round'],
  gens:[
    () => { var n = pick([50,100,200,500]), x = rnd(2,12);
      return Q('A plan has a scale of 1 : '+n+'. A wall is '+x+' cm long on the plan. How long is the real wall?', U(x*n/100,'m'), [U(x*n,'m'), U(r2(x/n),'m'), U(x*n/1000,'m')], x+' × '+n+' = '+(x*n)+' cm. Divide by 100 to change to metres: '+fmt(x*n/100)+' m.'); },
    () => { var n = pick([50,100,200,500]), x = rnd(2,12), R = x*n/100;
      return Q('A plan has a scale of 1 : '+n+'. A real fence is '+fmt(R)+' m long. How long is it on the plan?', U(x,'cm'), [U(R*n,'cm'), U(r2(R/n),'cm'), U(x*10,'cm')], fmt(R)+' m = '+(R*100)+' cm. Divide by '+n+': '+x+' cm.'); },
    () => { var A = rnd(10,60), k = rnd(2,5);
      return Q('A shape has an area of '+A+' '+CM2+'. Every length is multiplied by '+k+'. What is the new area?', U(A*k*k,CM2), [U(A*k,CM2), U(A*k*k*k,CM2), U(A+k*k,CM2)], 'Areas are multiplied by the square of the scale factor: '+A+' × '+k+'<sup>2</sup> = '+(A*k*k)+' '+CM2+'.'); },
    () => { var V = rnd(10,50), k = pick([2,4,5]);
      return Q('A model has a volume of '+V+' '+CM3+'. A copy is made with every length multiplied by '+k+'. What is the volume of the copy?', U(V*k*k*k,CM3), [U(V*k,CM3), U(V*k*k,CM3), U(3*V*k,CM3)], 'Volumes are multiplied by the cube of the scale factor: '+V+' × '+k+'<sup>3</sup> = '+(V*k*k*k)+' '+CM3+'.'); },
    () => { var t = rnd(1,3), L, u, e, un;
      if(t === 1){ L = rnd(5,60); u = 1; un = 'cm'; e = 'centimetre'; } else if(t === 2){ L = rnd(20,90)/10; u = 0.1; un = 'cm'; e = 'millimetre'; } else { L = 10*rnd(5,40); u = 10; un = 'm'; e = '10 metres'; }
      var o = (a,b) => 'Between '+fmt(a)+' '+un+' and '+fmt(b)+' '+un;
      return Q('A length is recorded as '+fmt(L)+' '+un+', measured to the nearest '+e+'. Between which values does the true length lie?', o(L-u/2,L+u/2), [o(L-u,L+u), o(L,L+u), o(L-u/10,L+u/10)], 'The largest possible error is half of the unit, which is '+fmt(u/2)+' '+un+'. So the true length is between '+fmt(L-u/2)+' and '+fmt(L+u/2)+' '+un+'.'); },
    () => { var s = rnd(4,12), o = (a,b) => 'Between '+fmt(a)+' and '+fmt(b)+' '+CM2;
      return Q('The side of a square is measured as '+s+' cm to the nearest centimetre. Between which values does its area lie?', o((s-0.5)*(s-0.5),(s+0.5)*(s+0.5)), [o((s-1)*(s-1),(s+1)*(s+1)), o(s*s-0.5,s*s+0.5), o(s*s-0.25,s*s+0.25)],
        'The side is between '+(s-0.5)+' cm and '+(s+0.5)+' cm. Squaring each gives '+fmt((s-0.5)*(s-0.5))+' and '+fmt((s+0.5)*(s+0.5))+' '+CM2+'.'); }
  ]});

/* ---------- 6.1 Geometric reasoning ---------- */
var REASON = ['They are corresponding angles, so they are equal','They are alternate angles, so they are equal','They are co-interior angles, so they add to 180°','They are vertically opposite angles, so they are equal'];
function parCase(t, al, x, y){ // marks for the four relationships, labelled x and y
  return t === 0 ? {U:{NE:x},L:{NE:y}} : t === 1 ? {U:{SW:x},L:{NE:y}} : t === 2 ? {U:{SE:x},L:{NE:y}} : {U:{NE:x,SW:y}};
}
LSN('6.1','Geometric reasoning',{
  w:sliderW('w61','Angles on parallel lines',[['a','Angle, °',35,145,5,65]], v => { var a = v.a+'°', b = (180-v.a)+'°';
    return parSVG(v.a,{U:{NE:a,NW:b,SW:a,SE:b},L:{NE:a,NW:b,SW:a,SE:b}})+'<p>The two lines with arrows are parallel. Every angle is either '+a+' or '+b+'. Angles in the same position at each crossing are equal. An angle between the lines and the one diagonally across from it are equal.</p>'; }),
  body:w => Pp('Geometric reasoning means working out an angle or a length from facts you know, and giving the reason for each step.')+
    sec('Angles at a point','Angles on a straight line add to 180°. Angles around a point add to 360°. When two straight lines cross, the angles opposite each other are equal. These are called <b>vertically opposite</b> angles.',hb('anglefacts'))+
    sec('Angles in a triangle','The three angles of a triangle add to 180°. In an <b>isosceles</b> triangle two sides are equal, and the angles opposite those sides are equal.',triAng({a:'50°',b:'60°',c:'70°'}))+
    sec('The exterior angle','If one side of a triangle is extended, the angle outside the triangle is called an exterior angle. It equals the sum of the two interior angles that are not next to it.',triAng({a:'50°',c:'70°',ext:'120°'}))+
    sec('Angles on parallel lines','A line that crosses two parallel lines makes three kinds of angle pair. <b>Corresponding</b> angles are in the same position at each crossing, and they are equal. <b>Alternate</b> angles are between the parallel lines on opposite sides of the crossing line, and they are equal. <b>Co-interior</b> angles are between the parallel lines on the same side, and they add to 180°.',w)+
    sec('Quadrilaterals','The four angles of a quadrilateral add to 360°, because a quadrilateral can be cut into two triangles.')+
    sec('Giving reasons','In geometry an answer is complete only when it comes with its reason, such as “angles in a triangle add to 180°”.'),
  help:['anglefacts','anglefacts','anglefacts','anglefacts','anglefacts','anglefacts','anglefacts'],
  gens:[
    () => { var a = rnd(30,80), b = rnd(30,70), c = 180-a-b;
      return Q('Find x.'+triAng({a:a+'°',b:b+'°',c:'x'}), dg(c), [dg(180-a), dg(a+b), dg(360-a-b)], 'The angles of a triangle add to 180°. 180 − '+a+' − '+b+' = '+c+'.'); },
    () => { var A = 2*ri(10,65,[30,45]), bs = (180-A)/2;
      return Math.random() < 0.5 ? Q('The triangle is isosceles. The marks show the two equal sides. Find x.'+triAng({iso:1,c:A+'°',a:'x'}), dg(bs), [dg(180-A), dg(A), dg(A/2)], 'The two base angles are equal and the three angles add to 180°. (180 − '+A+') ÷ 2 = '+bs+'.')
        : Q('The triangle is isosceles. The marks show the two equal sides. Find x.'+triAng({iso:1,a:bs+'°',c:'x'}), dg(A), [dg(180-bs), dg(bs), dg(Math.abs(90-bs))], 'The two base angles are both '+bs+'°. 180 − '+bs+' − '+bs+' = '+A+'.'); },
    () => { var t = rnd(1,3), a = ri(25,155,[90]), b = rnd(60,140);
      if(t === 1) return Q('Two angles on a straight line are '+a+'° and x. What is x?', dg(180-a), [dg(360-a), dg(a), dg(Math.abs(90-a))], 'Angles on a straight line add to 180°. 180 − '+a+' = '+(180-a)+'.');
      if(t === 2) return Q('Three angles around a point are '+a+'°, '+b+'° and x. What is x?', dg(360-a-b), [dg(Math.abs(180-a-b)), dg(a+b), dg(360-a)], 'Angles around a point add to 360°. 360 − '+a+' − '+b+' = '+(360-a-b)+'.');
      return Q('Two straight lines cross. One of the angles is '+a+'°. How big is the angle vertically opposite it?', dg(a), [dg(180-a), dg(360-a), dg(Math.abs(90-a))], 'Vertically opposite angles are equal.'); },
    () => { var al = 5*ri(8,28,[18]), t = rnd(0,2), g = t === 2 ? 180-al : al, x = al;
      return Q('The two lines with arrows are parallel. Find x.'+parSVG(al,parCase(t,al,g+'°','x')), dg(x), t === 2 ? [dg(g), dg(Math.abs(90-g)), dg(360-g)] : [dg(180-g), dg(Math.abs(90-g)), dg(360-g)],
        t === 0 ? 'The two angles are in the same position at each crossing. They are corresponding angles, so they are equal.' : t === 1 ? 'The two angles are between the parallel lines on opposite sides of the crossing line. They are alternate angles, so they are equal.' : 'The two angles are between the parallel lines on the same side of the crossing line. They are co-interior angles, so they add to 180°. 180 − '+g+' = '+x+'.'); },
    () => { var al = 5*ri(8,28,[18]), t = rnd(0,3);
      return Q('The two lines with arrows are parallel. Which statement about the angles a and b is correct?'+parSVG(al,parCase(t,al,'a','b')), REASON[t], REASON.filter((_,i) => i !== t),
        ['a and b are in the same position at each crossing.','a and b are between the parallel lines, on opposite sides of the crossing line.','a and b are between the parallel lines, on the same side of the crossing line.','a and b are opposite each other where two lines cross.'][t]); },
    () => { var a = rnd(30,75), b = rnd(35,80);
      return Q('One side of the triangle is extended. Find x.'+triAng({a:a+'°',c:b+'°',ext:'x'}), dg(a+b), [dg(180-a-b), dg(180-a), dg(180-b)], 'The exterior angle equals the sum of the two interior angles that are not next to it. '+a+' + '+b+' = '+(a+b)+'.'); },
    () => { var a = rnd(60,120), b = rnd(60,110), c = rnd(50,100), d = 360-a-b-c;
      return Q('Three angles of a quadrilateral are '+a+'°, '+b+'° and '+c+'°. What is the fourth angle?', dg(d), [dg(Math.abs(180-a-b-c)), dg(360-a-b), dg(d+10)], 'The angles of a quadrilateral add to 360°. 360 − '+a+' − '+b+' − '+c+' = '+d+'.'); }
  ]});

/* ---------- 6.2 Writing a proof ---------- */
var PROOFS = [
  {head:'Prove that the angles of a triangle ABC add to 180°.', steps:['Draw a line through the corner C that is parallel to the side AB.','The angle at A equals the angle between the new line and the side AC. <b>Reason:</b> alternate angles on parallel lines.','The angle at B equals the angle between the new line and the side BC. <b>Reason:</b> alternate angles on parallel lines.','The three angles at C lie along the new line, so they add to 180°. <b>Reason:</b> angles on a straight line.','So angle A + angle B + angle C = 180°. No measurements were used, so this is true for every triangle.']},
  {head:'Two straight lines cross and make the angles a, b, c and d in order. Prove that a = c.', steps:['a + b = 180°. <b>Reason:</b> angles on a straight line.','b + c = 180°. <b>Reason:</b> angles on a straight line.','So a + b = b + c. <b>Reason:</b> both equal 180°.','Subtract b from both sides: a = c. Vertically opposite angles are equal.']},
  {head:'In triangle ABC, AB = AC. M is the midpoint of BC. Prove that angle B = angle C.', steps:['AB = AC. <b>Reason:</b> given.','BM = CM. <b>Reason:</b> M is the midpoint of BC.','AM = AM. <b>Reason:</b> the same side is in both triangles.','Triangles ABM and ACM are congruent. <b>Reason:</b> SSS.','So angle B = angle C. <b>Reason:</b> matching angles of congruent triangles.']}
];
LSN('6.2','Writing a proof',{
  w:stepper('w62','A proof, one step at a time', () => pick(PROOFS)),
  body:w => Pp('A proof is a chain of statements, each with a reason, that shows a result must be true in every case.')+
    sec('Showing and proving','Measuring the angles of twenty triangles and getting 180° each time is evidence. It is not a proof, because there are more triangles than anyone can measure. A proof uses reasoning that works for every triangle at once.')+
    sec('Statements and reasons','Each line of a proof has a statement and the reason it is true. A reason can be something given in the question, a definition or a result that has already been proved.',w)+
    sec('Congruent triangles','Two triangles are <b>congruent</b> when they have exactly the same shape and size. You do not need to check all six sides and angles. Any one of four tests is enough.','!<b>SSS:</b> three pairs of equal sides.<br><b>SAS:</b> two pairs of equal sides and the angle between them equal.<br><b>AAS:</b> two pairs of equal angles and one pair of matching sides equal.<br><b>RHS:</b> a right angle, the hypotenuse and one other side equal.',hb('congruent'))+
    sec('Three equal angles are not enough','Two triangles with the same three angles have the same shape, but one can be larger than the other. They are <b>similar</b>, and they are congruent only if a pair of matching sides is also equal.')+
    sec('Using congruence','Once two triangles are proved congruent, all their matching sides and angles are equal. Matching parts are in the same position in each name: if triangle ABC is congruent to triangle PQR, then AB = PQ and angle B = angle Q.'),
  help:['congruent',null,'anglefacts','congruent','congruent','congruent'],
  gens:[
    () => { var a = rnd(4,9), b = a+rnd(1,4), c = b+rnd(1,3), A = 5*rnd(6,12), B = 5*rnd(5,11), t = rnd(0,4);
      var d = [['AB = '+a+' cm, BC = '+b+' cm and CA = '+c+' cm','PQ = '+a+' cm, QR = '+b+' cm and RP = '+c+' cm','SSS','All three pairs of matching sides are equal. That is the test SSS.'],
        ['AB = '+a+' cm, BC = '+b+' cm and angle B = '+A+'°','PQ = '+a+' cm, QR = '+b+' cm and angle Q = '+A+'°','SAS','Two pairs of sides are equal, and so is the angle between them. That is the test SAS.'],
        ['angle A = '+A+'°, angle B = '+B+'° and BC = '+a+' cm','angle P = '+A+'°, angle Q = '+B+'° and QR = '+a+' cm','AAS','Two pairs of angles are equal, and so is one pair of matching sides. That is the test AAS.'],
        ['a right angle at B, AC = '+c+' cm and AB = '+a+' cm','a right angle at Q, PR = '+c+' cm and PQ = '+a+' cm','RHS','Each triangle has a right angle. AC and PR are the sides opposite the right angles, so they are the hypotenuses, and one other pair of sides is equal. That is the test RHS.'],
        ['angle A = '+A+'°, angle B = '+B+'° and angle C = '+(180-A-B)+'°','angle P = '+A+'°, angle Q = '+B+'° and angle R = '+(180-A-B)+'°','None of the tests. The triangles may be different sizes','Equal angles give the same shape but say nothing about size. No side lengths are known, so no congruence test applies.']][t];
      var names = ['SSS','SAS','AAS','RHS','None of the tests. The triangles may be different sizes'];
      return Q('Triangle ABC has '+d[0]+'. Triangle PQR has '+d[1]+'. Which test shows that the triangles are congruent?', d[2], sample(names.filter(x => x !== d[2]),3), d[3]); },
    () => { var T = pick([['measures the angles of 20 triangles and finds that each set adds to 180°','the angles of every triangle add to 180°'],['draws 15 pairs of crossing lines and finds that the opposite angles are equal each time','vertically opposite angles are always equal'],['folds 10 paper isosceles triangles and finds that the base angles match each time','the base angles of every isosceles triangle are equal']]), nm = pick(NAMES), n = T[0].match(/\d+/)[0];
      return Q(nm+' '+T[0]+'. Has '+nm+' proved that '+T[1]+'?', 'No. The examples support the result, but a proof must cover every case', ['Yes. '+n+' examples are enough to be sure', 'Yes. Careful measuring counts as a proof', 'No. '+nm+' needed to check at least 100 examples'],
        'However many examples are checked, there are always more. A proof uses reasoning that applies to every case at once.'); },
    () => { var T = pick([['AB is parallel to CD and a line crosses both. The two angles between the parallel lines, on opposite sides of the crossing line, are equal.',1],['AB is parallel to CD and a line crosses both. The two angles in the same position at each crossing are equal.',0],['Two straight lines cross. The two angles opposite each other are equal.',3],['AB is parallel to CD and a line crosses both. The two angles between the parallel lines, on the same side of the crossing line, add to 180°.',2]]), R = ['Corresponding angles on parallel lines','Alternate angles on parallel lines','Co-interior angles on parallel lines','Vertically opposite angles'];
      return Q('A proof contains this statement. Which reason supports it?<br><br>'+T[0], R[T[1]], R.filter((_,i) => i !== T[1]), 'The position of the two angles shows which fact applies: '+R[T[1]].toLowerCase()+'.'); },
    () => { var v = sample(['A','B','C'],3);
      return Q('In triangle ABC, the sides '+v[0]+v[1]+' and '+v[0]+v[2]+' are equal. Which conclusion can be proved?', 'Angle '+v[1]+' = angle '+v[2], ['Angle '+v[0]+' = angle '+v[1], v[1]+v[2]+' = '+v[0]+v[1], 'Angle '+v[0]+' = 60°'],
        'The equal sides meet at '+v[0]+', so the triangle is isosceles and the angles opposite the equal sides, at '+v[1]+' and '+v[2]+', are equal.'); },
    () => { var a = ['A','B','C'], p = sample(['P','Q','R'],3), side = Math.random() < 0.5, i = rnd(0,2), j = (i+1)%3, k = (i+2)%3;
      return side ? Q('Triangle ABC is congruent to triangle '+p.join('')+', with the corners matched in that order. Which side equals '+a[i]+a[j]+'?', p[i]+p[j], [p[j]+p[k], p[i]+p[k], 'None of them'], 'Matching corners are in the same position in each name. '+a[i]+' matches '+p[i]+' and '+a[j]+' matches '+p[j]+', so '+a[i]+a[j]+' = '+p[i]+p[j]+'.')
        : Q('Triangle ABC is congruent to triangle '+p.join('')+', with the corners matched in that order. Which angle equals angle '+a[i]+'?', 'Angle '+p[i], ['Angle '+p[j], 'Angle '+p[k], 'None of them'], 'Matching corners are in the same position in each name. '+a[i]+' is in position '+(i+1)+', and so is '+p[i]+'.'); },
    () => { var k = rnd(2,4);
      return Q('Two triangles have the same three angles. Every side of the second triangle is '+k+' times as long as the matching side of the first. How are the triangles related?', 'They are similar but not congruent', ['They are congruent', 'They are neither similar nor congruent', 'They are congruent by AAS'], 'Equal angles give the same shape, so the triangles are similar. Their sizes differ, so they are not congruent.'); }
  ]});

/* ---------- 6.3 Networks ---------- */
LSN('6.3','Networks',{
  w:sliderW('w63','Five networks and their numbers',[['n','Network',1,5,1,2]], v => { var N0 = NETS[v.n-1], I = netInfo(N0);
    return netSVG(N0,true)+'<p class="small muted">The number in each node is its degree.</p><div class="tablewrap"><table class="vals"><tr><th>Nodes</th><th>Edges</th><th>Faces</th><th>Odd nodes</th></tr><tr><td>'+I.v+'</td><td>'+I.e+'</td><td>'+I.f+'</td><td>'+I.odd+'</td></tr></table></div>'+
      '<p>'+I.v+' − '+I.e+' + '+I.f+' = 2. '+(I.odd === 0 ? 'No node has an odd degree, so the network can be traced in one go, starting and finishing at the same node.' : I.odd === 2 ? 'Exactly two nodes have an odd degree, so the network can be traced in one go, starting at one of those nodes and finishing at the other.' : I.odd+' nodes have an odd degree, so the network cannot be traced in one go.')+'</p>'; }),
  body:w => Pp('A network is a set of points joined by lines. Networks describe road maps, train lines, friendships and computer connections.')+
    sec('Nodes and edges','The points are called <b>nodes</b> and the lines are called <b>edges</b>. The <b>degree</b> of a node is the number of edge ends that meet at it. A network is <b>connected</b> when you can get from any node to any other node along the edges.',netSVG(NETS[1]))+
    sec('Counting faces','When a network is drawn with no edges crossing, it divides the page into regions called <b>faces</b>. The region outside the network counts as a face. The square with one diagonal above has 3 faces: two triangles and the outside.')+
    sec('Euler’s formula','For any connected network drawn with no edges crossing: nodes − edges + faces = 2. For the square with one diagonal, 4 − 5 + 3 = 2.',w)+
    sec('Degrees and edges','Every edge has two ends, so adding up the degrees of all the nodes gives twice the number of edges.')+
    sec('Tracing a network','Can you draw a network without lifting your pen and without going along any edge twice? It depends on the number of nodes with an odd degree. If there are none, you can, and you finish where you started. If there are exactly two, you can, but you must start at one of them and finish at the other. If there are more than two, you cannot.','!The city of Königsberg had seven bridges joining four areas of land. People tried to find a walk that crossed every bridge once. All four areas had an odd number of bridges, so no such walk exists.'),
  help:[null,null,null,null,null,null],
  gens:[
    () => { var N0 = pick(NETS), I = netInfo(N0), ed = Math.random() < 0.5, c = ed ? I.e : I.v, o = ed ? I.v : I.e, w = [o,c+1,c-1,c+2].filter((x,i,a) => x !== c && x > 0 && a.indexOf(x) === i).slice(0,3);
      return Q('How many '+(ed ? 'edges' : 'nodes')+' does this network have?'+netSVG(N0), N(c), w.map(x => N(x)), (ed ? 'The edges are the lines. Count each line once. There are ' : 'The nodes are the points. There are ')+c+'.'); },
    () => { var N0 = pick(NETS), I = netInfo(N0), i = rnd(0,N0.n.length-1), d = I.deg[i];
      return Q('What is the degree of node '+N0.n[i][2]+'?'+netSVG(N0), N(d), [N(d+1), N(d === 1 ? 4 : d-1), N(I.e === d ? d+2 : I.e)], 'Count the edges that meet at '+N0.n[i][2]+'. There are '+d+'.'); },
    () => { var v = rnd(4,9), e = v-1+rnd(0,5), f = e-v+2;
      return Q('A connected network is drawn with no edges crossing. It has '+v+' nodes and '+e+' edges. How many faces does it have, counting the region outside?', N(f), [N(e-v), N(e+v-2), N(e-v+1)], 'nodes − edges + faces = 2, so '+v+' − '+e+' + faces = 2. That gives faces = '+f+'.'); },
    () => { var N0 = pick(NETS), I = netInfo(N0), o = ['Yes, because no node has an odd degree','Yes, because exactly two nodes have an odd degree','No, because four nodes have an odd degree','Yes, because every network can be drawn this way'], ans = I.odd === 0 ? 0 : I.odd === 2 ? 1 : 2;
      return Q('Can this network be drawn without lifting the pen and without going along any edge twice?'+netSVG(N0), o[ans], o.filter((_,i) => i !== ans), 'The degrees of the nodes are '+I.deg.join(', ')+'. '+I.odd+' of them are odd.'); },
    () => { var e = rnd(4,15);
      return Q('A network has '+e+' edges. What is the sum of the degrees of all its nodes?', N(2*e), [N(e), N(e+2), N(e*e)], 'Every edge has two ends, and each end adds 1 to the degree of a node. 2 × '+e+' = '+(2*e)+'.'); },
    () => { var t = sample(['A','B','C','D','E'],5), hub = t[0], ed = [[hub,t[1]],[hub,t[2]],[hub,t[3]],[t[3],t[4]]];
      return Q('Five towns are joined by these roads: '+shuffle(ed).map(x => x.slice().sort().join('–')).join(', ')+'. Which town has the most roads meeting at it?', hub, [t[1], t[3], t[4]], hub+' is at the end of 3 roads. No other town has more than 2.'); }
  ]});

/* ---------- background cards for Zones 5 and 6 ---------- */
HELP.area = {title:'Areas of rectangles, triangles and circles', btn:'area formulas', zone:5,
  html:'<p>Area is the amount of flat surface inside a shape. It is measured in square units.</p><p class="note">Rectangle: length × width<br>Triangle: ½ × base × height<br>Circle: π × r × r, where r is the radius</p><p>The height of a triangle is measured straight up from the base, at a right angle to it. The radius of a circle is half of its diameter.</p>',
  gen:() => { var t = rnd(1,3), a = rnd(3,12), b = 2*rnd(2,6);
    if(t === 1) return Q('What is the area of a rectangle '+a+' cm long and '+b+' cm wide?', U(a*b,CM2), [U(2*(a+b),CM2), U(a+b,CM2), U(a*b/2,CM2)], a+' × '+b+' = '+(a*b)+' '+CM2+'.');
    if(t === 2) return Q('What is the area of a triangle with base '+b+' cm and height '+a+' cm?', U(a*b/2,CM2), [U(a*b,CM2), U(a+b,CM2), U(a*b*2,CM2)], '½ × '+b+' × '+a+' = '+(a*b/2)+' '+CM2+'.');
    return Q('What is the area of a circle with radius '+a+' cm, to one decimal place?', U(PI*a*a,CM2,1), [U(2*PI*a,CM2,1), U(PI*a,CM2,1), U(PI*a*a*4,CM2,1)], 'π × '+a+' × '+a+' = '+(PI*a*a).toFixed(1)+' '+CM2+'.'); }};
HELP.volprism = {title:'Volumes of prisms and cylinders', btn:'volume formulas', zone:5,
  html:'<p>A prism is a solid with the same shape all the way along. That shape is its cross-section.</p><p class="note">Volume = area of the cross-section × length</p><p>For a box, the cross-section is a rectangle, so the volume is length × width × height. For a cylinder, the cross-section is a circle, so the volume is π × r × r × height.</p>',
  gen:() => { var A = rnd(5,30), L = rnd(3,12);
    return Q('A prism has a cross-section with area '+A+' '+CM2+' and is '+L+' cm long. What is its volume?', U(A*L,CM3), [U(A+L,CM3), U(A*L/2,CM3), U(2*(A+L),CM3)], 'Multiply the area of the cross-section by the length: '+A+' × '+L+' = '+(A*L)+' '+CM3+'.'); }};
HELP.trig = {title:'Sine, cosine and tangent', btn:'sin, cos and tan', zone:5,
  html:'<p>In a right-angled triangle, the sides are named from the angle you are working with. The opposite side is across from the angle. The adjacent side is next to the angle. The hypotenuse is the longest side, across from the right angle.</p>'+triSVG({ang:'θ',adj:'adjacent',opp:'opposite',hyp:'hypotenuse'})+
       '<p class="note">sin θ = '+fr('opposite','hypotenuse')+'&nbsp;&nbsp; cos θ = '+fr('adjacent','hypotenuse')+'&nbsp;&nbsp; tan θ = '+fr('opposite','adjacent')+'</p><p>To find a side, choose the ratio that uses the side you know and the side you want.</p>',
  gen:() => { var t = pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]), r = pick(['sin','cos','tan']), f = (a,b) => N(a/b, fr(a,b)), c = r === 'sin' ? [t[0],t[2]] : r === 'cos' ? [t[1],t[2]] : [t[0],t[1]];
    var all = [[t[0],t[2]],[t[1],t[2]],[t[0],t[1]],[t[1],t[0]]].filter(x => x[0]/x[1] !== c[0]/c[1]);
    return Q('In this triangle, what is '+r+' θ?'+triSVG({ang:'θ',adj:''+t[1],opp:''+t[0],hyp:''+t[2]}), f(c[0],c[1]), all.slice(0,3).map(x => f(x[0],x[1])), r+' θ = '+(r === 'sin' ? 'opposite ÷ hypotenuse' : r === 'cos' ? 'adjacent ÷ hypotenuse' : 'opposite ÷ adjacent')+' = '+fr(c[0],c[1])+'.'); }};
HELP.anglefacts = {title:'Angle facts', btn:'angle facts', zone:6,
  html:'<p class="note">Angles on a straight line add to 180°.<br>Angles around a point add to 360°.<br>The angles of a triangle add to 180°.<br>Vertically opposite angles are equal.</p><p>A right angle is 90°. An angle smaller than 90° is acute. An angle between 90° and 180° is obtuse.</p>',
  gen:() => { var a = rnd(25,85), b = rnd(30,70);
    return Math.random() < 0.5 ? Q('Two angles of a triangle are '+a+'° and '+b+'°. What is the third angle?', dg(180-a-b), [dg(a+b), dg(360-a-b), dg(180-a)], 'The angles of a triangle add to 180°. 180 − '+a+' − '+b+' = '+(180-a-b)+'.')
      : Q('Two angles on a straight line are '+a+'° and x. What is x?', dg(180-a), [dg(90-a > 0 ? 90-a : a+90), dg(360-a), dg(a)], 'Angles on a straight line add to 180°. 180 − '+a+' = '+(180-a)+'.'); }};
HELP.congruent = {title:'Congruent and similar shapes', btn:'congruent and similar shapes', zone:6,
  html:'<p>Two shapes are <b>congruent</b> when they are exactly the same shape and the same size. One would fit exactly on top of the other, although it may need to be turned or flipped first.</p><p>Two shapes are <b>similar</b> when they are the same shape but can be different sizes. One is an enlargement of the other. Their angles are equal and their sides are in the same ratio.</p>',
  gen:() => { var a = rnd(3,8), k = rnd(2,4);
    return Q('A triangle has sides '+a+' cm, '+(a+1)+' cm and '+(a+2)+' cm. A second triangle has the same angles and sides '+(a*k)+' cm, '+((a+1)*k)+' cm and '+((a+2)*k)+' cm. How are they related?', 'Similar, because they are the same shape but different sizes', ['Congruent, because their angles are equal', 'Congruent, because they are both triangles', 'Neither similar nor congruent'], 'Each side of the second triangle is '+k+' times the matching side of the first. Same shape, different size, so they are similar.'); }};
