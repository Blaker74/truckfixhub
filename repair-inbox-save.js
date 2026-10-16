(function(){
  async function saveQueuedRepair(){
    const raw=sessionStorage.getItem('tfhNewRepair');
    if(!raw || !window.supabase) return;
    const msg=document.getElementById('msg');
    try{
      const p=JSON.parse(raw);
      const scripts=[...document.scripts];
      const inboxScript=scripts.find(s=>s.textContent&&s.textContent.includes('SUPABASE_KEY'));
      if(!inboxScript) throw new Error('Repair connection unavailable');
      const text=inboxScript.textContent;
      const url=(text.match(/SUPABASE_URL='([^']+)'/)||[])[1];
      const key=(text.match(/SUPABASE_KEY='([^']+)'/)||[])[1];
      if(!url||!key) throw new Error('Repair connection unavailable');
      const sb=window.supabase.createClient(url,key);
      const sessionResult=await sb.auth.getSession();
      if(sessionResult.error) throw sessionResult.error;
      const session=sessionResult.data&&sessionResult.data.session;
      if(!session||!session.user) throw new Error('Please sign in before creating a private Repair Job');
      const user=session.user;
      if(msg) msg.textContent='Saving your new Repair Job…';
      const result=await sb.from('tfh_repair_jobs').insert({
        owner_id:user.id,
        job_number:Date.now(),
        status:'reported',
        unit_number:p.unit||null,
        vin:p.vin||null,
        engine:p.engine||null,
        engine_serial:p.esn||null,
        mileage:p.mileage?Number(String(p.mileage).replace(/[^0-9]/g,'')):null,
        fault_code:p.code||null,
        system_problem:p.system||null,
        symptoms:p.symptoms||null,
        safety_status:p.safety||null
      }).select('id,job_number').single();
      if(result.error) throw result.error;
      sessionStorage.removeItem('tfhNewRepair');
      location.replace('repair-inbox.html?saved='+encodeURIComponent(result.data.job_number));
    }catch(e){
      if(msg) msg.textContent='Repair Job was not saved: '+(e.message||'Please try again.');
    }
  }
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(window.supabase){clearInterval(timer);saveQueuedRepair();}
    else if(tries>80) clearInterval(timer);
  },100);
})();