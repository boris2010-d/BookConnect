// Local-only personal library. No database writes or payment processing.
const personalLibrary = (() => {
  const key = () => "bookconnect.personal.v1." + (currentUser?.id || "guest");
  const fresh = () => ({favorites:[],recent:[],reviews:{},goals:{},finished:{},premiumUntil:0});
  function read() {
    try {
      const v=JSON.parse(localStorage.getItem(key()));
      if (!v || typeof v!=="object") return fresh();
      const ids=a=>Array.isArray(a)?[...new Set(a.filter(x=>typeof x==="string"))]:[];
      return {...fresh(),favorites:ids(v.favorites),recent:ids(v.recent).slice(0,10),
        reviews:v.reviews&&typeof v.reviews==="object"&&!Array.isArray(v.reviews)?v.reviews:{},
        goals:v.goals&&typeof v.goals==="object"?v.goals:{},
        finished:v.finished&&typeof v.finished==="object"?v.finished:{},
        premiumUntil:Number.isFinite(v.premiumUntil)?v.premiumUntil:0};
    } catch { return fresh(); }
  }
  function change(fn) {
    const state=read(); fn(state);
    try { localStorage.setItem(key(),JSON.stringify(state)); return true; }
    catch { showNotice(language==="bg"?"Локалното запазване е недостъпно.":"Local storage is unavailable."); return false; }
  }
  const id=b=>String(b.id);
  const favorite=b=>read().favorites.includes(id(b));
  function toggle(b) { return change(s=>{s.favorites=s.favorites.includes(id(b))?s.favorites.filter(x=>x!==id(b)):[...s.favorites,id(b)];}); }
  function visit(b) { return change(s=>{s.recent=[id(b),...s.recent.filter(x=>x!==id(b))].slice(0,10);}); }
  function recommendations(items) {
    const s=read(), weights=new Map();
    for(const b of items) {
      const weight=(s.favorites.includes(id(b))?3:0)+(s.recent.includes(id(b))?1:0);
      if(weight) weights.set(b.genre,(weights.get(b.genre)||0)+weight);
    }
    return items.filter(b=>!s.favorites.includes(id(b))&&!s.recent.includes(id(b))&&remainingCopies(b)>0)
      .map((b,i)=>({b,i,score:weights.get(b.genre)||0}))
      .sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,4).map(x=>x.b);
  }
  return {read,change,id,favorite,toggle,visit,recommendations};
})();
