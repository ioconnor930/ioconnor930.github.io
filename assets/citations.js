/* ======== EDIT HERE ========
   Copy the numbers from your Google Scholar profile.
   byYear: citations per year, from the bar chart on Scholar (hover each bar).
   The chart appears automatically once byYear has values. */
window.SCHOLAR = {
  updated: "15 November 2026",
  profile: "https://scholar.google.fr/citations?user=SDTr6iEAAAAJ&hl=en",
  since: 2021,
  all:   {citations: 4326, h: 30, i10: 105},
  recent:{citations: 1651, h: 20, i10: 38},
  partialYear: 2026,   /* current year, drawn lighter because it is not complete */
  byYear: [
    [2003,18],[2004,31],[2005,28],[2006,47],[2007,52],[2008,91],[2009,109],[2010,104],
    [2011,153],[2012,228],[2013,221],[2014,252],[2015,217],[2016,233],[2017,241],[2018,214],
    [2019,203],[2020,176],[2021,212],[2022,261],[2023,259],[2024,337],[2025,318],[2026,261]
  ]
};
/* ======== no need to edit below ======== */
(function(){
  var S=window.SCHOLAR, box=document.getElementById("citations");
  if(!box) return;
  var t='<table class="metrics"><thead><tr><th></th><th>All</th><th>Since '+S.since+'</th></tr></thead><tbody>'+
    '<tr><th>Citations</th><td>'+S.all.citations.toLocaleString("en")+'</td><td>'+S.recent.citations.toLocaleString("en")+'</td></tr>'+
    '<tr><th>h-index</th><td>'+S.all.h+'</td><td>'+S.recent.h+'</td></tr>'+
    '<tr><th>i10-index</th><td>'+S.all.i10+'</td><td>'+S.recent.i10+'</td></tr></tbody></table>';
  var chart="";
  var d=(S.byYear||[]).filter(function(r){return r&&r.length===2;}).sort(function(a,b){return a[0]-b[0];});
  if(d.length){
    var W=560,H=210,L=34,B=24,T=16,max=Math.max.apply(null,d.map(function(r){return r[1];}));
    var step=Math.pow(10,Math.floor(Math.log10(max)))/ (max/Math.pow(10,Math.floor(Math.log10(max)))<2.5?4:2);
    var top=Math.ceil(max/step)*step, bw=(W-L)/d.length, g="";
    for(var v=0;v<=top;v+=step){ var y=H-B-(v/top)*(H-B-T);
      g+='<line class="grid" x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'"/><text class="axis" x="'+(L-6)+'" y="'+(y+4)+'" text-anchor="end">'+v+'</text>'; }
    d.forEach(function(r,i){
      var h=(r[1]/top)*(H-B-T), x=L+i*bw+bw*0.18, w=bw*0.64, y=H-B-h;
      g+='<rect class="bar'+(r[0]===S.partialYear?' part':'')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"><title>'+r[0]+': '+r[1]+' citations'+(r[0]===S.partialYear?' (year to date)':'')+'</title></rect>';
      if(d.length<=14 || i%2===d.length%2) g+='<text class="axis" x="'+(x+w/2)+'" y="'+(H-6)+'" text-anchor="middle">'+(d.length>10?"’"+String(r[0]).slice(2):r[0])+'</text>';
    });
    chart='<div class="citechart"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Citations per year, '+d[0][0]+' to '+d[d.length-1][0]+'">'+g+'</svg></div>';
  }
  box.innerHTML=t+chart+'<p class="note">Citations per year. Source: <a href="'+S.profile+'">Google Scholar</a>, '+S.updated+(S.partialYear?'; '+S.partialYear+' is the year to date':'')+'.</p>';
})();
