/* TruckFixHub Panta repair-inbox enhancement. Progressive only: the inbox still works without it. */
(function(){
  function parsePanta(context){
    var text=String(context||'');
    var marker='Panta structured complaint:';
    if(text.indexOf(marker)<0)return null;
    var tail=text.split(marker)[1]||'';
    var summary=(tail.split('| System:')[0]||'').trim();
    var system=((tail.split('| System:')[1]||'').split('| Missing info:')[0]||'').trim();
    var missing=((tail.split('| Missing info:')[1]||'').split('| Route:')[0]||'').trim();
    var route=((tail.split('| Route:')[1]||'').trim().split(/\s/)[0]||'');
    return {summary:summary,system:system,missing:missing,route:route};
  }
  function safeRoute(route){
    var allowed=['/repair/semi-truck-air-system-brakes/','/repair/semi-truck-electrical-starting/','/repair/semi-truck-cooling-system/','/repair/semi-truck-transmission-driveline/','/repair/semi-truck-engine-performance/','/repair/semi-truck-aftertreatment/','/semi-truck-fault-code-guide.html','/truck-repair-catalog.html'];
    return allowed.indexOf(route)>=0?route:'/truck-repair-catalog.html';
  }
  function esc(value){
    return String(value||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function card(data){
    if(!data)return '';
    var route=safeRoute(data.route);
    return '<div class="panta-summary"><b>✨ Panta:</b> '+esc(data.summary||'Complaint structured')+
      (data.system?' <span>· '+esc(data.system)+'</span>':'')+
      (data.missing?'<div class="small"><b>Gather next:</b> '+esc(data.missing)+'</div>':'')+
      '<a href="'+route+'" target="_blank" rel="noopener">Open diagnostic route →</a></div>';
  }
  window.TruckFixHubPantaInbox={parse:parsePanta,safeRoute:safeRoute,card:card};
})();