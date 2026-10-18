import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type, x-panta-bridge-key","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"content-type":"application/json","cache-control":"no-store"}});
async function sha256(value:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("")}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"POST required"},405);
 const expected=(Deno.env.get("PANTA_BRIDGE_KEY_SHA256")||"").trim().toLowerCase();
 const supplied=(req.headers.get("x-panta-bridge-key")||"").trim();
 if(!expected)return json({error:"Bridge credential is not configured"},503);
 if(!supplied||(await sha256(supplied))!==expected)return json({error:"Invalid bridge credential"},401);
 const base=Deno.env.get("SUPABASE_URL")||"",serviceRole=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
 if(!base||!serviceRole)return json({error:"TruckFixHub backend unavailable"},503);
 const body=await req.json().catch(()=>({}));
 const prompt=typeof body?.prompt==="string"?body.prompt.trim():"";
 if(!prompt)return json({error:"prompt is required"},400);
 if(prompt.length>4000)return json({error:"prompt exceeds 4000 characters"},413);
 const requestId=crypto.randomUUID();
 try{
  const upstream=await fetch(base+"/functions/v1/tfh-openai-panta-gateway",{method:"POST",headers:{"apikey":serviceRole,"authorization":"Bearer "+serviceRole,"content-type":"application/json"},body:JSON.stringify({prompt})});
  const raw=await upstream.text();let data:any;try{data=JSON.parse(raw)}catch{data={error:"Unreadable TruckFixHub Panta response"}}
  if(!upstream.ok)return json({error:"TruckFixHub Panta request failed",upstream_status:upstream.status,request_id:requestId},502);
  return json({bridge:"TruckFixHub Panta Bridge",bridge_version:1,request_id:requestId,answer:data.answer,model:data.model,evidence_count:data.evidence_count,retrieved_knowledge_count:data.retrieved_knowledge_count,retrieval_status:data.retrieval_status});
 }catch{return json({error:"Unable to reach TruckFixHub Panta",request_id:requestId},502)}
});