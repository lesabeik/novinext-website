const map = {
  "#/public":"home", "#/public/technology":"home", "#/public/need":"home", "#/public/patients":"home", "#/public/stage":"home", "#/public/contact":"home", "#/public/platform":"home", "#/public/faq":"home", "#/public/privacy":"home",
  "#/preview/patient/dashboard":"patient-dashboard", "#/preview/patient/my-tests":"patient-tests", "#/preview/patient/my-results":"patient-results", "#/preview/patient/history":"patient-history", "#/preview/patient/profile":"patient-profile",
  "#/preview/clinician/dashboard":"clinician-dashboard", "#/preview/clinician/patients":"clinician-patients", "#/preview/clinician/review-queue":"clinician-queue", "#/preview/clinician/reports":"clinician-reports",
  "#/preview/admin/overview":"admin-overview", "#/preview/admin/users":"admin-users", "#/preview/admin/clinicians":"admin-clinicians", "#/preview/admin/tests-kits":"admin-kits", "#/preview/admin/enquiries":"admin-enquiries", "#/preview/admin/content":"admin-content", "#/preview/admin/audit":"admin-audit",
  "#/patient/dashboard":"patient-dashboard", "#/patient/my-tests":"patient-tests", "#/patient/my-results":"patient-results", "#/patient/history":"patient-history", "#/patient/profile":"patient-profile",
  "#/clinician/dashboard":"clinician-dashboard", "#/clinician/patients":"clinician-patients", "#/clinician/review-queue":"clinician-queue", "#/clinician/reports":"clinician-reports",
  "#/admin/overview":"admin-overview", "#/admin/users":"admin-users", "#/admin/clinicians":"admin-clinicians", "#/admin/tests-kits":"admin-kits", "#/admin/enquiries":"admin-enquiries", "#/admin/content":"admin-content", "#/admin/audit":"admin-audit",
  "#/login":"auth-chooser", "#/login/patient":"auth-patient-login", "#/login/clinician":"auth-clinician-login", "#/login/admin":"auth-admin-login", "#/register":"auth-patient-register", "#/register/patient":"auth-patient-register", "#/register/clinician":"auth-clinician-register"
};
const titles = {
  "patient-dashboard":"NOVINEXT | Patient dashboard", "patient-tests":"NOVINEXT | Patient dashboard", "patient-results":"NOVINEXT | Patient dashboard", "patient-history":"NOVINEXT | Patient dashboard", "patient-profile":"NOVINEXT | Patient dashboard",
  "clinician-dashboard":"NOVINEXT | Clinician dashboard", "clinician-patients":"NOVINEXT | Clinician dashboard", "clinician-queue":"NOVINEXT | Clinician dashboard", "clinician-reports":"NOVINEXT | Clinician dashboard",
  "admin-overview":"NOVINEXT | Admin dashboard", "admin-users":"NOVINEXT | Admin dashboard", "admin-clinicians":"NOVINEXT | Admin dashboard", "admin-kits":"NOVINEXT | Admin dashboard", "admin-enquiries":"NOVINEXT | Admin dashboard", "admin-content":"NOVINEXT | Admin dashboard", "admin-audit":"NOVINEXT | Admin dashboard",
  "auth-chooser":"NOVINEXT | Sign in or register", "auth-patient-login":"NOVINEXT | Patient sign in", "auth-clinician-login":"NOVINEXT | Clinician sign in", "auth-admin-login":"NOVINEXT | Admin sign in", "auth-patient-register":"NOVINEXT | patient registration", "auth-clinician-register":"NOVINEXT | clinician registration", "home":"NOVINEXT | Urine-based molecular research"
};
const anchorMap = {"#/public/technology":"technology","#/public/need":"need","#/public/patients":"patients","#/public/stage":"stage","#/public/contact":"contact","#/public/platform":"platform","#/public/faq":"faq","#/public/privacy":"privacy"};

const SUPABASE_URL = "https://vnkmhkjdjbfjzndqjbfs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HUSvgVfRpvSjPWkH_XrOww_PTqPYDhF";
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
let currentSession = null;
let currentProfile = null;

function isOperationalHash(hash){ return /^#\/(patient|clinician|admin)\//.test(hash); }
function operationalRole(hash){ const m=hash.match(/^#\/(patient|clinician|admin)\//); return m ? m[1] : null; }
function safe(v){ return String(v ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
function prettyStatus(v){ return String(v||"").replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase()); }
function dateText(v){ if(!v) return "—"; try{return new Date(v).toLocaleString();}catch{return String(v);} }

async function getProfile(){
  if(!sb || !currentSession?.user) return null;
  const {data,error}=await sb.from("profiles").select("user_id,email,full_name,app_role,approval_status,assigned_clinician_id").eq("user_id",currentSession.user.id).single();
  if(error){ console.error(error); return null; }
  currentProfile=data; return data;
}

async function guardOperationalRoute(hash){
  if(!isOperationalHash(hash)) return true;
  if(!currentSession){ location.hash="#/login"; return false; }
  const p=currentProfile || await getProfile();
  const role=operationalRole(hash);
  if(!p || p.approval_status!=="approved"){
    alert("Your account is awaiting administrator approval.");
    location.hash="#/public"; return false;
  }
  if(p.app_role!==role){
    location.hash=`#/${p.app_role}/${p.app_role==="admin"?"overview":"dashboard"}`;
    return false;
  }
  return true;
}

function setOperationalChrome(el, role){
  const banner=el.querySelector(".workspace-banner"); if(banner) banner.style.display="none";
  const note=el.querySelector(".preview-note"); if(note) note.style.display="none";
  el.querySelectorAll(`a[href^="#/preview/${role}/"]`).forEach(a=>a.href=a.getAttribute("href").replace(`#/preview/${role}/`,`#/${role}/`));
}

async function renderPatient(page){
  const {data:kits}=await sb.from("kits").select("id,kit_code,status,registered_at,created_at,updated_at").order("created_at",{ascending:false});
  const {data:subs}=await sb.from("submissions").select("id,kit_id,status,submitted_at,reviewed_at,note").order("submitted_at",{ascending:false});
  const k=kits||[], s=subs||[];
  if(page.id==="page-patient-dashboard"){
    const vals=page.querySelectorAll(".stats .value"); if(vals.length>=4){ vals[0].textContent=k.length; vals[1].textContent=k.filter(x=>x.status==="assigned").length; vals[2].textContent=k.filter(x=>["submitted","under_review"].includes(x.status)).length; vals[3].textContent=0; }
    const welcome=page.querySelector("h1 + .muted"); if(welcome) welcome.textContent=`Welcome${currentProfile?.full_name ? ", "+currentProfile.full_name : ""}.`;
  }
  if(["page-patient-dashboard","page-patient-tests"].includes(page.id)){
    const tb=page.querySelector("tbody"); if(tb) tb.innerHTML=k.length?k.map(x=>`<tr><td>${safe(x.kit_code)}</td><td>—</td><td>—</td><td>${safe(prettyStatus(x.status))}</td></tr>`).join(""):`<tr><td colspan="4">No assigned kits yet.</td></tr>`;
  }
  if(page.id==="page-patient-history"){
    const tb=page.querySelector("tbody"); if(tb) tb.innerHTML=s.length?s.map(x=>`<tr><td>submission</td><td>${safe(prettyStatus(x.status))}</td><td>${safe(dateText(x.submitted_at))}</td></tr>`).join(""):`<tr><td colspan="3">No activity yet.</td></tr>`;
  }
  if(page.id==="page-patient-profile"){
    const ps=page.querySelectorAll(".grid2 .card p"); if(ps.length>=4){ps[0].textContent=currentProfile?.full_name||"—";ps[1].textContent=currentProfile?.email||currentSession.user.email||"—";ps[2].textContent=currentProfile?.assigned_clinician_id?"Assigned":"Not assigned";ps[3].textContent="Recorded at account creation";}
  }
}

async function renderClinician(page){
  const {data:kits}=await sb.from("kits").select("id,kit_code,patient_id,status,updated_at").order("updated_at",{ascending:false});
  const {data:subs}=await sb.from("submissions").select("id,kit_id,patient_id,status,submitted_at,reviewed_at,note").order("submitted_at",{ascending:false});
  const k=kits||[],s=subs||[];
  const vals=page.querySelectorAll(".stats .value"); if(vals.length){vals[0].textContent=new Set(k.map(x=>x.patient_id)).size; if(vals[1]) vals[1].textContent=s.filter(x=>x.status==="submitted").length;}
  const tb=page.querySelector("tbody");
  if(tb && page.id==="page-clinician-patients") tb.innerHTML=k.length?k.map(x=>`<tr><td>${safe(x.patient_id)}</td><td>${safe(x.kit_code)}</td><td>${safe(prettyStatus(x.status))}</td></tr>`).join(""):`<tr><td colspan="3">No assigned patients yet.</td></tr>`;
  if(tb && page.id==="page-clinician-queue") tb.innerHTML=s.length?s.map(x=>`<tr><td>${safe(x.patient_id)}</td><td>${safe(x.kit_id)}</td><td>${safe(prettyStatus(x.status))}</td><td>${safe(dateText(x.submitted_at))}</td></tr>`).join(""):`<tr><td colspan="4">No submissions in the review queue.</td></tr>`;
}

async function renderAdmin(page){
  const [{data:profiles},{data:kits},{data:enquiries},{data:reqs}] = await Promise.all([
    sb.from("profiles").select("user_id,email,full_name,app_role,approval_status,created_at").order("created_at",{ascending:false}),
    sb.from("kits").select("id,kit_code,patient_id,status,updated_at").order("updated_at",{ascending:false}),
    sb.from("enquiries").select("id,name,email,category,message,created_at").order("created_at",{ascending:false}),
    sb.from("access_requests").select("id,user_id,requested_role,status,created_at").order("created_at",{ascending:false})
  ]);
  const p=profiles||[],k=kits||[],e=enquiries||[],r=reqs||[];
  if(page.id==="page-admin-overview"){
    const vals=page.querySelectorAll(".stats .value"); if(vals.length>=4){vals[0].textContent=p.length;vals[1].textContent=p.filter(x=>x.app_role==="clinician").length;vals[2].textContent=k.length;vals[3].textContent=e.length;}
  }
  if(page.id==="page-admin-users"){
    const tbs=page.querySelectorAll("tbody");
    if(tbs[0]) tbs[0].innerHTML=p.filter(x=>x.approval_status==="pending").map(x=>`<tr><td>${safe(x.full_name||x.app_role)}</td><td>${safe(x.email)}</td><td>${safe(prettyStatus(x.approval_status))}</td></tr>`).join("")||`<tr><td colspan="3">No accounts awaiting approval.</td></tr>`;
    if(tbs[1]) tbs[1].innerHTML=p.map(x=>`<tr><td>${safe((x.full_name||"")+" "+x.app_role)}</td><td>${safe(x.email)}</td><td>${safe(prettyStatus(x.approval_status))}</td></tr>`).join("")||`<tr><td colspan="3">No accounts yet.</td></tr>`;
  }
  if(page.id==="page-admin-kits"){
    const tb=page.querySelector("tbody"); if(tb) tb.innerHTML=k.map(x=>`<tr><td>${safe(x.kit_code)}</td><td>${safe(x.patient_id)}</td><td>${safe(dateText(x.updated_at))}</td><td>${safe(prettyStatus(x.status))}</td></tr>`).join("")||`<tr><td colspan="4">No kits yet.</td></tr>`;
  }
  if(page.id==="page-admin-enquiries"){
    const tb=page.querySelector("tbody"); if(tb) tb.innerHTML=e.map(x=>`<tr><td>${safe(dateText(x.created_at))}</td><td>${safe(x.name||x.email)}</td><td>${safe(x.category||"General")}</td><td>New</td></tr>`).join("")||`<tr><td colspan="4">No enquiries yet.</td></tr>`;
  }
  if(page.id==="page-admin-clinicians"){
    const tb=page.querySelector("tbody"); if(tb) tb.innerHTML=p.filter(x=>x.app_role==="clinician" || r.some(q=>q.user_id===x.user_id && q.requested_role==="clinician")).map(x=>`<tr><td>${safe(x.full_name||"—")}</td><td>${safe(x.email)}</td><td>${safe(prettyStatus(x.approval_status))}</td></tr>`).join("")||`<tr><td colspan="3">No clinician accounts yet.</td></tr>`;
  }
}

async function hydrateOperationalPage(hash, el){
  if(!isOperationalHash(hash) || !currentSession || !currentProfile) return;
  const role=operationalRole(hash); setOperationalChrome(el,role);
  try{
    if(role==="patient") await renderPatient(el);
    if(role==="clinician") await renderClinician(el);
    if(role==="admin") await renderAdmin(el);
  }catch(e){ console.error("NOVINEXT data load failed",e); }
}

async function route(){
  let hash=location.hash||"#/public";
  if(!(await guardOperationalRoute(hash))) return;
  const page=map[hash]||"home";
  document.querySelectorAll(".route-page").forEach(x=>x.classList.remove("active"));
  const el=document.getElementById("page-"+page); if(el) el.classList.add("active");
  document.title=titles[page]||titles.home;
  const target=anchorMap[hash];
  requestAnimationFrame(()=>{ if(target){const a=document.getElementById(target);if(a)a.scrollIntoView({block:"start"});}else window.scrollTo(0,0); });
  if(el) await hydrateOperationalPage(hash,el);
}

function authRedirect(){ return /^https?:$/.test(location.protocol) ? `${location.origin}${location.pathname}` : undefined; }
async function sendMagicLink(pageId, role, create){
  if(!sb) return alert("Supabase client could not load.");
  const page=document.getElementById(pageId); const input=page?.querySelector(".auth-input"); const email=input?.value.trim();
  if(!email) return alert("Enter your email address.");
  const options={shouldCreateUser:create, data:{requested_role:role}}; const redir=authRedirect(); if(redir) options.emailRedirectTo=redir;
  const {error}=await sb.auth.signInWithOtp({email,options});
  if(error) return alert(error.message);
  alert("Check your email for the one-time sign-in link.");
}
function wireAuthInputs(){
  const defs=[
    ["page-auth-patient-login","patient",false], ["page-auth-clinician-login","clinician",false], ["page-auth-admin-login","admin",false],
    ["page-auth-patient-register","patient",true], ["page-auth-clinician-register","clinician",true]
  ];
  defs.forEach(([id,role,create])=>{
    const input=document.getElementById(id)?.querySelector(".auth-input");
    if(input) input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();sendMagicLink(id,role,create);}});
  });
}

async function routeForSession(){
  if(!currentSession) return;
  const p=await getProfile(); if(!p) return;
  if(p.approval_status!=="approved") return;
  const dest=p.app_role==="admin"?"#/admin/overview":`#/${p.app_role}/dashboard`;
  if(location.hash.startsWith("#/login") || location.hash.startsWith("#/register") || !location.hash) location.hash=dest;
}

window.addEventListener("hashchange",()=>route());
window.addEventListener("DOMContentLoaded",async()=>{
  wireAuthInputs();
  if(sb){
    const {data}=await sb.auth.getSession(); currentSession=data.session;
    if(currentSession) await getProfile();
    sb.auth.onAuthStateChange(async(_event,session)=>{currentSession=session; currentProfile=null; if(session) await routeForSession(); await route();});
  }
  await route();
});
