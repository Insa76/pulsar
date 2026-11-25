import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, Building2, HeartPulse, HandHeart, LayoutDashboard, ShieldCheck, Watch, Wifi, Menu, X } from "lucide-react";
import { people } from "./data/demoData";
import EmergencyDemo from "./modules/emergency/EmergencyDemo";
import SocialBenefitsDemo from "./modules/social/SocialBenefitsDemo";
import InstitutionalAccessDemo from "./modules/access/InstitutionalAccessDemo";
import IdentityDemo from "./modules/identity/IdentityDemo";
import { Pill } from "./components/Panel";

type Tab = "overview" | "emergency" | "social" | "access" | "identity";

const navigation = [
  { id: "overview" as Tab, label: "Resumen", icon: LayoutDashboard },
  { id: "emergency" as Tab, label: "Emergencias", icon: HeartPulse },
  { id: "social" as Tab, label: "Beneficios sociales", icon: HandHeart },
  { id: "access" as Tab, label: "Accesos", icon: Building2 },
  { id: "identity" as Tab, label: "Credencial única", icon: Watch }
];

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [personId, setPersonId] = useState(people[0].id);
  const [mobileNav, setMobileNav] = useState(false);
  const [blockedCredentials, setBlockedCredentials] = useState<string[]>([]);
  const [credentialByPerson, setCredentialByPerson] = useState<Record<string, string>>(() =>
    Object.fromEntries(people.map(person => [person.id, person.wristband]))
  );
  const person = useMemo(() => people.find(p=>p.id===personId)!, [personId]);

  function navigate(id: Tab) { setTab(id); setMobileNav(false); }
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Activity size={22}/></div><div><strong>TRANSITIA</strong><small>Credencial ciudadana</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X/></button></div>
      <div className="workspace-label">PLATAFORMA DEMO</div>
      <nav>{navigation.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${tab===item.id?"active":""}`} onClick={()=>navigate(item.id)}><Icon size={18}/><span>{item.label}</span>{item.id==="overview"&&<ArrowUpRight size={14} className="nav-arrow"/>}</button>})}</nav>
      <div className="sidebar-bottom"><div className="demo-indicator"><span/> Entorno de demostración</div><small>TransitIA · Prototipo conceptual<br/>Datos ficticios · v1.1</small></div>
    </aside>
    {mobileNav&&<button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Cerrar menú"/>}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu/></button>
        <div className="breadcrumb">TransitIA <span>/</span> {navigation.find(n=>n.id===tab)?.label}</div>
        <div className="topbar-right"><Pill tone="info">DEMO INTERACTIVA</Pill><div className="operator"><div className="operator-avatar">MR</div><span><strong>María Ruiz</strong><small>Operadora municipal</small></span></div></div>
      </header>
      <div className="content">
        {tab==="overview" && <div className="module">
          <div className="hero">
            <div className="hero-copy"><div className="eyebrow light">IDENTIDAD · ASISTENCIA · GESTIÓN</div><h1>Una pulsera.<br/><em>Múltiples servicios.</em></h1><p>Una credencial ciudadana que conecta identificación, asistencia ante emergencias, programas sociales y accesos institucionales, con permisos diferenciados.</p><button className="button button-light" onClick={()=>navigate("identity")}>Explorar credencial <ArrowUpRight size={16}/></button></div>
            <div className="hero-art"><div className="hero-ring"><div className="hero-band"><span>TRANSITIA</span><b>NFC</b></div></div><div className="hero-caption"><ShieldCheck size={16}/> Credencial multipropósito</div></div>
          </div>
          <div className="overview-heading"><div><span className="eyebrow">APLICACIONES</span><h2>Cuatro escenarios de uso</h2><p>Seleccioná un escenario para iniciar una demostración interactiva.</p></div><div className="fiction-note">Todos los registros son ficticios</div></div>
          <div className="scenario-grid">
            <button className="scenario-card green" onClick={()=>navigate("emergency")}><div className="scenario-icon"><HeartPulse/></div><span className="eyebrow">01 · ASISTENCIA</span><h3>Emergencias</h3><p>QR de consulta rápida y registro sanitario protegido.</p><span className="scenario-link">Abrir escenario <ArrowUpRight size={15}/></span></button>
            <button className="scenario-card amber" onClick={()=>navigate("social")}><div className="scenario-icon"><HandHeart/></div><span className="eyebrow">02 · GESTIÓN SOCIAL</span><h3>Beneficios sociales</h3><p>Identificación, verificación del padrón y trazabilidad de entregas.</p><span className="scenario-link">Abrir escenario <ArrowUpRight size={15}/></span></button>
            <button className="scenario-card blue" onClick={()=>navigate("access")}><div className="scenario-icon"><Building2/></div><span className="eyebrow">03 · INSTITUCIONES</span><h3>Accesos</h3><p>Permisos por dependencia, sector y perfil de usuario.</p><span className="scenario-link">Abrir escenario <ArrowUpRight size={15}/></span></button>
            <button className="scenario-card violet" onClick={()=>navigate("identity")}><div className="scenario-icon"><Watch/></div><span className="eyebrow">04 · IDENTIDAD</span><h3>Credencial única</h3><p>Servicios vinculados, bloqueo y reemplazo de la pulsera.</p><span className="scenario-link">Abrir escenario <ArrowUpRight size={15}/></span></button>
          </div>
          <div className="bottom-callout"><ShieldCheck size={21}/><div><strong>Un principio común: acceso según necesidad.</strong><p>La pulsera identifica a la persona. Cada servicio consulta únicamente los datos y permisos que necesita.</p></div></div>
        </div>}
        {tab==="emergency"&&<><div className="person-toolbar"><span>Persona para la demostración</span><select className="select-control compact" value={personId} onChange={e=>setPersonId(e.target.value)}>{people.map(p=><option key={p.id} value={p.id}>{p.name} · {p.profile}</option>)}</select></div><EmergencyDemo person={person} credentialId={credentialByPerson[person.id]} credentialBlocked={blockedCredentials.includes(credentialByPerson[person.id])}/></>}
        {tab==="social"&&<SocialBenefitsDemo people={people} blockedCredentials={blockedCredentials} credentialByPerson={credentialByPerson}/>}
        {tab==="access"&&<InstitutionalAccessDemo people={people} blockedCredentials={blockedCredentials} credentialByPerson={credentialByPerson}/>}
        {tab==="identity"&&<IdentityDemo people={people} blockedCredentials={blockedCredentials} credentialByPerson={credentialByPerson} onToggleBlocked={credentialId=>setBlockedCredentials(old=>old.includes(credentialId)?old.filter(id=>id!==credentialId):[...old,credentialId])} onReplaceCredential={(personId,newCredentialId)=>{const oldCredentialId=credentialByPerson[personId] ?? people.find(person=>person.id===personId)!.wristband;setBlockedCredentials(old=>old.includes(oldCredentialId)?old:[...old,oldCredentialId]);setCredentialByPerson(old=>({...old,[personId]:newCredentialId}));}}/>}
      </div>
      <footer className="footer"><span>TRANSITIA · CREDENCIAL CIUDADANA MULTIPROPÓSITO</span><span><Wifi size={13}/> Simulación local · Sin conexión a sistemas externos</span></footer>
    </main>
  </div>;
}