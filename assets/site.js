/* Shared behaviour for every page: theme, email link, waveguide menu. */
(function(){
  var root=document.documentElement;

  /* theme toggle (remembers choice) */
  try{var saved=localStorage.getItem("theme"); if(saved) root.setAttribute("data-theme",saved);}catch(e){}
  var tb=document.querySelector(".themebtn");
  if(tb) tb.addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dark=cur==="dark"||(!cur&&matchMedia("(prefers-color-scheme: dark)").matches);
    var next=dark?"light":"dark"; root.setAttribute("data-theme",next);
    try{localStorage.setItem("theme",next);}catch(e){}
  });

  /* email assembled at runtime, away from scrapers */
  var addr=["ian.oconnor","ec-lyon.fr"].join("@");
  document.querySelectorAll(".js-mail").forEach(function(a){
    a.href="mailto:"+addr;
    if(a.dataset.show!==undefined) a.textContent=addr;
  });

  /* waveguide menu: light runs from the first ring to the current page */
  var ol=document.querySelector(".guide ol"), pulse=document.querySelector(".guide .pulse"), bus=document.querySelector(".guide .bus");
  function wave(){
    if(!ol) return;
    var links=[].slice.call(ol.querySelectorAll("a")), cur=-1;
    links.forEach(function(a,i){ if(a.getAttribute("aria-current")==="page") cur=i; });
    links.forEach(function(a,i){ a.classList.toggle("passed",i<cur); });
    var first=links[0].querySelector(".ring"), last=links[links.length-1].querySelector(".ring");
    var gr=ol.parentNode.getBoundingClientRect();
    var x0=first.getBoundingClientRect().left-gr.left+first.offsetWidth/2;
    var xl=last.getBoundingClientRect().left-gr.left+last.offsetWidth/2+ol.scrollLeft;
    bus.style.left=x0+"px"; bus.style.right="auto"; bus.style.width=Math.max(0,xl-x0)+"px";
    if(cur>=0){
      var r=links[cur].querySelector(".ring");
      var x=r.getBoundingClientRect().left-gr.left+r.offsetWidth/2;
      pulse.style.left=x0+"px";
      requestAnimationFrame(function(){ pulse.style.width=Math.max(0,x-x0)+"px"; });
      if(window.innerWidth<=960){ ol.scrollLeft=Math.max(0,links[cur].offsetLeft-60); }
    }
  }
  if(ol){
    ol.addEventListener("scroll",function(){ /* keep bus aligned while the menu scrolls on phones */
      var off=-ol.scrollLeft; bus.style.transform=pulse.style.transform="translateX("+off+"px)";
    },{passive:true});
    window.addEventListener("resize",wave);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(wave);
    wave();
  }
})();

/* helper shared by pages that list publications */
window.IOC = {
  esc:function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});},
  authors:function(a){return IOC.esc(a).replace(/I\. O['’]Connor/g,function(m){return "<b>"+m+"</b>";});}
};
