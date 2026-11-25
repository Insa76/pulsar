import { useState } from "react";
import { Building2, CheckCircle2, Clock3, DoorClosed, DoorOpen, ShieldX, UserRound } from "lucide-react";
import type { Person } from "../../data/demoData";
import { Panel, Pill, SectionTitle } from "../../components/Panel";

const doors = [
  { id: "municipal", name: "Edificio municipal", area: "Acceso principal" },
  { id: "community", name: "Centro comunitario", area: "Ingreso general" },
  { id: "archive", name: "Archivo administrativo", area: "Sector restringido" },
  { id: "day", name: "Centro de día", area: "Acceso de usuarios" }
];

type Props = { people: Person[]; blockedCredentials: string[]; credentialByPerson: Record<string, string> };

export default function InstitutionalAccessDemo({ people, blockedCredentials, credentialByPerson }: Props) {
  const [personId, setPersonId] = useState(people[1].id);
  const [doorId, setDoorId] = useState(doors[0].id);
  const [logs, setLogs] = useState<{ person: string; door: string; allowed: boolean; time: string }[]>([]);
  const person = people.find(p => p.id === personId)!;
  const door = doors.find(d => d.id === doorId)!;
  const credentialId = credentialByPerson[person.id] ?? person.wristband;
  const credentialBlocked = blockedCredentials.includes(credentialId);
  const allowed = !credentialBlocked && person.access.some(a => door.name.includes(a) || (door.id === "community" && a === "Centro comunitario") || (door.id === "day" && a === "Centro de día"));
  function attempt() {
    setLogs(old => [{ person: person.name, door: door.name, allowed, time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) }, ...old]);
  }
  return <div className="module">
    <SectionTitle eyebrow="ESCENARIO 03 · CONTROL DE ACCESO" title="Accesos institucionales"
      description="Una misma credencial permite habilitar distintos espacios según el perfil, los permisos y las reglas de acceso." />
    <div className="two-col">
      <Panel>
        <span className="eyebrow">SIMULADOR DE ACCESO</span><h3>Validar una credencial</h3>
        <label className="field-label">Persona</label>
        <select className="select-control" value={personId} onChange={e=>setPersonId(e.target.value)}>{people.map(p=><option key={p.id} value={p.id}>{p.name} · {p.profile}</option>)}</select>
        <label className="field-label">Dependencia / sector</label>
        <div className="door-list">{doors.map(d=><button key={d.id} className={`door-option ${doorId===d.id?"selected":""}`} onClick={()=>setDoorId(d.id)}><Building2 size={19}/><span><strong>{d.name}</strong><small>{d.area}</small></span></button>)}</div>
        <button className="button button-primary full" onClick={attempt}><DoorOpen size={17}/> Simular lectura de pulsera</button>
      </Panel>
      <Panel className="access-result">
        <span className="eyebrow">CONTROLADOR DE ACCESO</span>
        <div className={`access-indicator ${allowed ? "granted" : "denied"}`}>{allowed ? <CheckCircle2 size={44}/> : <ShieldX size={44}/>}<strong>{allowed ? "ACCESO AUTORIZADO" : "ACCESO NO AUTORIZADO"}</strong><span>{person.name} · {door.name}</span></div>
        <div className="data-row"><UserRound size={18}/><div><small>CREDENCIAL</small><strong>{credentialId}</strong></div></div>
        {credentialBlocked && <div className="privacy-note warning"><ShieldX size={17}/> Esta credencial fue bloqueada o revocada. El acceso se rechaza aunque la persona tenga permisos asignados.</div>}
        <div className="data-row"><Clock3 size={18}/><div><small>REGLA APLICADA</small><strong>Permisos asignados a la credencial (demo)</strong></div></div>
        <p className="helper">La decisión de acceso se simula con permisos ficticios. Un sistema real requiere lector, controlador y reglas horarias configuradas.</p>
      </Panel>
    </div>
    <Panel>
      <div className="panel-heading"><div><span className="eyebrow">AUDITORÍA</span><h3>Últimos intentos</h3></div><Pill tone="info">{logs.length} registros</Pill></div>
      {logs.length===0 ? <div className="empty-inline"><DoorClosed size={18}/> Todavía no hay intentos registrados.</div> :
        <div className="table-wrap"><table><thead><tr><th>Hora</th><th>Persona</th><th>Dependencia</th><th>Resultado</th></tr></thead><tbody>{logs.map((l,i)=><tr key={i}><td>{l.time}</td><td>{l.person}</td><td>{l.door}</td><td><Pill tone={l.allowed?"success":"danger"}>{l.allowed?"Autorizado":"Rechazado"}</Pill></td></tr>)}</tbody></table></div>}
    </Panel>
  </div>;
}