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
      const auth=await sb.auth.getSession();
      if(auth.error) throw auth.error;
      const session=auth.data&&auth.data.session;
      if(!session||!session.user) throw new Error('Please sign in before creating a private Repair Job');
      if(msg) msg.textContent='Saving your new Repair Job…';
      const mileage=p.mileage?Number(String(p.mileage).replace(/[^0-9]/g,'')):null;
      const result=await sb.rpc('tfh_create_repair_job',{
        p_unit_number:p.unit||null,
        p_vin:p.vin||null,
        p_engine:p.engine||null,
        p_engine_serial:p.esn||null,
        p_mileage:Number.isFinite(mileage)?mileage:null,
        p_fault_code:p.code||null,
        p_system_problem:p.system||null,
        p_symptoms:p.symptoms||null,
        p_safety_status:p.safety||null
      });
      if(result.error) throw result.error;
      const saved=Array.isArray(result.data)?result.data[0]:result.data;
      if(!saved||!saved.id) throw new Error('Repair Job save did not return a record');
      if(p.recent||p.diagnosticRoute){
        const context=await sb.from('tfh_repair_jobs').update({recent_context:p.recent||null,diagnostic_route:p.diagnosticRoute||null}).eq('id',saved.id).eq('owner_id',session.user.id).select('id').single();
        if(context.error) throw context.error;
      }
      sessionStorage.removeItem('tfhNewRepair');
      location.replace('repair-inbox.html?saved='+encodeURIComponent(saved.job_number));
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