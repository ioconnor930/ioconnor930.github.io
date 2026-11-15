/* Zoomable, draggable timeline.
   Usage: IOCTimeline(element, {lanes:[{id,label,color}], items:[...], from, to, view:[y0,y1], presets:[[label,y0,y1],...]})
   Item fields: lane, label, s ("YYYY" or "YYYY-MM"), e (same, or null = ongoing), pt (true = single event),
                wp (true = drawn as outline, e.g. work-package role), role, detail */
(function(){
  var NOW=(function(){var d=new Date();return d.getFullYear()+d.getMonth()/12+d.getDate()/365;})();
  function num(v){ if(v==null) return null; if(typeof v==="number") return v;
    var m=String(v).split("-"); return +m[0]+(m[1]?(+m[1]-1)/12:0); }
  function fmt(v){ if(v==null) return "present"; var m=String(v).split("-");
    if(!m[1]) return m[0]; var mo=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m[1]-1]; return mo+" "+m[0]; }
  var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};

  window.IOCTimeline=function(el,cfg){
    var items=cfg.items.map(function(it,i){
      var s=num(it.s), e=it.pt?s:(it.e==null?NOW:num(it.e)+(String(it.e).indexOf("-")<0?1:1/12));
      if(!it.pt && String(it.s).indexOf("-")<0 && it.e!=null && num(it.e)===s) e=s+0.75;
      return Object.assign({},it,{_i:i,_s:s,_e:e,_open:!it.pt&&(it.e==null||num(it.e)>NOW)});
    });
    var from=cfg.from, to=cfg.to, lanesOn={};
    cfg.lanes.forEach(function(l){lanesOn[l.id]=true;});
    var ppy=cfg.ppy||64, MIN=14, MAX=260, ROW=28, PAD=10;

    el.classList.add("tl");
    el.innerHTML=
      '<div class="tl-controls">'+
        (cfg.lanes.length>1?'<div class="grp" role="group" aria-label="Show or hide rows">'+cfg.lanes.map(function(l){
          var n=items.filter(function(i){return i.lane===l.id;}).length;
          return '<button type="button" class="chip" data-lane="'+l.id+'" aria-pressed="true"><span class="sw" style="background:var('+l.color+')"></span>'+esc(l.label)+'<span class="c">'+n+'</span></button>';}).join("")+'</div>':'')+
        '<div class="grp" role="group" aria-label="Zoom">'+
          '<button type="button" class="ibtn" data-z="out" aria-label="Zoom out">−</button>'+
          '<button type="button" class="ibtn" data-z="in" aria-label="Zoom in">+</button>'+
          (cfg.presets||[]).map(function(p,i){return '<button type="button" class="chip" data-p="'+i+'" aria-pressed="false">'+esc(p[0])+'</button>';}).join("")+
        '</div>'+
      '</div>'+
      '<div class="tl-frame"><div class="tl-labels" aria-hidden="true"></div><div class="tl-scroll" tabindex="0" aria-label="Timeline, scroll horizontally"><div class="tl-track"></div></div></div>'+
      '<div class="tl-detail" aria-live="polite"><p class="muted">'+esc(cfg.hint||"Select an item to see its details.")+'</p></div>'+
      '<p class="tl-hint">Drag the timeline sideways or use the scroll bar. Zoom with − and +, or Ctrl + mouse wheel.</p>';
    var labels=el.querySelector(".tl-labels"), scroller=el.querySelector(".tl-scroll"), track=el.querySelector(".tl-track"), detail=el.querySelector(".tl-detail");
    var sel=-1;

    function X(y){return (y-from)*ppy;}
    function render(){
      var W=Math.round((to-from)*ppy), html="", lhtml="";
      // axis
      var step=ppy>=70?1:ppy>=34?2:5, ax='<div class="tl-axis" style="width:'+W+'px">';
      for(var y=Math.ceil(from/step)*step;y<=to;y+=step){ if(X(y)>14&&X(y)<W-14) ax+='<span style="left:'+X(y)+'px">'+y+'</span>'; html+='<div class="tl-grid" style="left:'+X(y)+'px"></div>'; }
      if(NOW>from&&NOW<to) ax+='<b class="tl-today" style="left:'+X(NOW)+'px">Today</b>';
      ax+='</div>';
      cfg.lanes.forEach(function(l){
        if(!lanesOn[l.id]) return;
        var its=items.filter(function(i){return i.lane===l.id;}).sort(function(a,b){return a._s-b._s||b._e-a._e;});
        var rows=[], out="";
        its.forEach(function(it){
          var x=X(it._s), bw=it.pt?16:Math.max(5,X(it._e)-x), lw=it.label.length*6.4+12;
          var inside=!it.pt&&bw>=lw+6, ext=inside?bw:bw+lw;
          var r=0; while(rows[r]!=null && rows[r]+8>x) r++;
          rows[r]=x+ext;
          var cls="tl-item"+(it.pt?" pt":"")+(it.wp?" wp":"")+(it._open?" open":"")+(inside?" inside":"")+(it._i===sel?" sel":"");
          out+='<button type="button" class="'+cls+'" data-i="'+it._i+'" style="left:'+(it.pt?x-8:x)+'px;top:'+(PAD/2+r*ROW+3)+'px;--c:var('+l.color+')" aria-label="'+esc(it.label+", "+when(it))+'">'+
               '<span class="b" style="'+(it.pt?'':'width:'+bw+'px')+'"></span><span class="t">'+esc(it.label)+'</span></button>';
        });
        var h=Math.max(1,rows.length)*ROW+PAD;
        html+='<div class="tl-lane" style="height:'+h+'px">'+out+'</div>';
        lhtml+='<div style="height:'+h+'px"><span class="sw" style="background:var('+l.color+')"></span>'+esc(l.label)+'</div>';
      });
      if(NOW>from&&NOW<to) html+='<div class="tl-now" style="left:'+X(NOW)+'px"></div>';
      track.style.width=W+"px";
      track.innerHTML=ax+'<div class="tl-body" style="position:relative">'+html+'</div>';
      // grid lines span the body only
      labels.innerHTML=lhtml||'<div style="height:40px">Nothing selected</div>';
    }
    function when(it){
      if(it.pt) return fmt(it.s);
      var a=fmt(it.s), b=it.e==null?"present":fmt(it.e);
      return a===b?a:a+" – "+b;
    }
    function show(i){
      sel=i; var it=items[i];
      detail.innerHTML='<p class="when">'+esc(when(it))+(it.role?' · '+esc(it.role):'')+'</p><h3>'+esc(it.full||it.label)+'</h3>'+(it.detail?'<p>'+esc(it.detail)+'</p>':'');
      track.querySelectorAll(".tl-item.sel").forEach(function(b){b.classList.remove("sel");});
      var b=track.querySelector('[data-i="'+i+'"]'); if(b) b.classList.add("sel");
    }
    function zoomTo(newppy,centerYear){
      var c=centerYear!=null?centerYear:from+(scroller.scrollLeft+scroller.clientWidth/2)/ppy;
      ppy=Math.max(MIN,Math.min(MAX,newppy)); render();
      scroller.scrollLeft=X(c)-scroller.clientWidth/2;
    }
    function view(y0,y1){ ppy=Math.max(MIN,Math.min(MAX,scroller.clientWidth/(y1-y0))); render(); scroller.scrollLeft=X(y0); }

    el.querySelector(".tl-controls").addEventListener("click",function(e){
      var b=e.target.closest("button"); if(!b) return;
      if(b.dataset.lane){ lanesOn[b.dataset.lane]=!lanesOn[b.dataset.lane]; b.setAttribute("aria-pressed",lanesOn[b.dataset.lane]); render(); }
      else if(b.dataset.z){ zoomTo(ppy*(b.dataset.z==="in"?1.5:1/1.5)); }
      else if(b.dataset.p!=null){ var p=cfg.presets[+b.dataset.p]; view(p[1],p[2]);
        el.querySelectorAll("[data-p]").forEach(function(c){c.setAttribute("aria-pressed",c===b);}); }
    });
    track.addEventListener("click",function(e){ if(moved) return; var b=e.target.closest(".tl-item"); if(b) show(+b.dataset.i); });
    // drag to pan
    var down=false,sx=0,sl=0,moved=false;
    scroller.addEventListener("pointerdown",function(e){ if(e.pointerType!=="mouse") return; down=true;moved=false;sx=e.clientX;sl=scroller.scrollLeft; });
    window.addEventListener("pointermove",function(e){ if(!down) return; var dx=e.clientX-sx; if(Math.abs(dx)>4){moved=true;scroller.classList.add("drag");} scroller.scrollLeft=sl-dx; });
    window.addEventListener("pointerup",function(){ if(!down) return; down=false; scroller.classList.remove("drag"); setTimeout(function(){moved=false;},0); });
    scroller.addEventListener("wheel",function(e){ if(!e.ctrlKey) return; e.preventDefault();
      var rect=scroller.getBoundingClientRect(), c=from+(scroller.scrollLeft+e.clientX-rect.left)/ppy;
      var before=e.clientX-rect.left; ppy=Math.max(MIN,Math.min(MAX,ppy*(e.deltaY<0?1.15:1/1.15))); render(); scroller.scrollLeft=X(c)-before; },{passive:false});
    scroller.addEventListener("keydown",function(e){
      if(e.key==="+"||e.key==="="){zoomTo(ppy*1.5);} else if(e.key==="-"){zoomTo(ppy/1.5);} });
    /* keep labels of long bars readable when their start is scrolled out of view */
    var tick=false;
    function stick(){
      var sl=scroller.scrollLeft;
      track.querySelectorAll(".tl-item.inside").forEach(function(b){
        var left=b.offsetLeft, w=b.firstChild.offsetWidth, t=b.lastChild, tw=t.offsetWidth;
        var dx=Math.max(0,Math.min(sl-left,w-tw-4)); t.style.transform=dx?"translateX("+dx+"px)":"";
      });
      tick=false;
    }
    scroller.addEventListener("scroll",function(){ if(!tick){tick=true;requestAnimationFrame(stick);} },{passive:true});
    var _render=render; render=function(){ _render(); stick(); };
    var lastW=0;
    window.addEventListener("resize",function(){ if(Math.abs(window.innerWidth-lastW)>40){ lastW=window.innerWidth; render(); } });

    lastW=window.innerWidth;
    var v=cfg.view||[from,to];
    if(window.innerWidth<700 && cfg.mobileView) v=cfg.mobileView;
    view(v[0],v[1]);
    if(cfg.select!=null){ var k=items.findIndex(function(it){return it.label===cfg.select;}); if(k>-1) show(k); }
  };
})();
