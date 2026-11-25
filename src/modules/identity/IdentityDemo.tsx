import { useState } from "react";
import { BadgeCheck, Ban, Check, Fingerprint, Plus, ShieldCheck, Watch } from "lucide-react";
import type { Person } from "../../data/demoData";
import { Panel, Pill, SectionTitle } from "../../components/Panel";

type Props = {
  people: Person[];
  blockedCredentials: string[];
  credentialByPerson: Record<string, string>;
  onToggleBlocked: (credentialId: string) => void;
  onReplaceCredential: (personId: string, newCredentialId: string) => void;
};

export default function IdentityDemo({ people, blockedCredentials, credentialByPerson, onToggleBlocked, onReplaceCredential }: Props) {
  const [personId, setPersonId] = useState(people[0].id);
  const [replacementCount, setReplacementCount] = useState<Record<string, number>>({});
  const person = people.find(p => p.id === personId)!;
  const credentialId = credentialByPerson[person.id] ?? person.wristband;
  const isBlocked = blockedCredentials.includes(credentialId);
  const services = [
    { name: "Emergencias", detail: "Ficha QR y registro sanitario protegido", active: true },
    { name: "Beneficios sociales", detail: person.benefits.join(" · ") || "Sin programas asignados", active: person.benefits.length > 0 },
    { name: "Accesos institucionales", detail: person.access.join(" · ") || "Sin accesos asignados", active: person.access.length > 0 }
  ];

  function replaceCredential() {
    const next = (replacementCount[person.id] ?? 0) + 1;
    setReplacementCount(old => ({ ...old, [person.id]: next }));
    onReplaceCredential(person.id, `TIA-RPL-${person.id.slice(-4)}-${String(next).padStart(2, "0")}`);
  }

  return <div className="module">
    <SectionTitle eyebrow="ESCENARIO 04 · IDENTIDAD ÚNICA" title="Una pulsera, múltiples servicios"
      description="La identidad de la persona permanece; la credencial física puede bloquearse, reemplazarse y volver a vincularse." />
    <div className="two-col">
      <Panel>
        <span className="eyebrow">IDENTIDAD CIUDADANA</span><h3>Perfil de la persona</h3>
        <label className="field-label">Seleccionar persona</label>
        <select className="select-control" value={personId} onChange={e => setPersonId(e.target.value)}>{people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <div className="identity-card">
          <div className="identity-avatar"><Fingerprint size={32}/></div>
          <div><small>IDENTIDAD TRANSITIA</small><h3>{person.name}</h3><span>{person.id} · {person.profile}</span></div>
        </div>
        <div className="wristband-card large">
          <div className="band-loop"><span>TRANSITIA</span><b>NFC</b></div>
          <div><small>CREDENCIAL ASOCIADA</small><strong>{credentialId}</strong><Pill tone={isBlocked ? "danger" : "success"}>{isBlocked ? "Bloqueada" : "Activa"}</Pill></div>
        </div>
        <div className="action-stack">
          <button className={`button ${isBlocked ? "button-primary" : "button-danger"}`} onClick={() => onToggleBlocked(credentialId)}>
            <Ban size={16}/>{isBlocked ? "Reactivar credencial (demo)" : "Bloquear pulsera"}
          </button>
          <button className="button button-secondary" disabled={!isBlocked} onClick={replaceCredential}><Plus size={16}/> Emitir pulsera de reemplazo</button>
        </div>
        <p className="helper">El reemplazo revoca la credencial anterior y vincula una nueva a la misma identidad. Los módulos de beneficios y accesos reconocen el cambio.</p>
      </Panel>
      <Panel>
        <div className="panel-heading"><div><span className="eyebrow">SERVICIOS VINCULADOS</span><h3>Aplicaciones habilitadas</h3></div><BadgeCheck size={23}/></div>
        <div className="service-list">{services.map(s => <div className="service-row" key={s.name}><div className={`service-check ${s.active ? "active" : ""}`}>{s.active ? <Check size={16}/> : <span>–</span>}</div><div><strong>{s.name}</strong><small>{s.detail}</small></div><Pill tone={s.active ? "success" : "neutral"}>{s.active ? "Activo" : "No asignado"}</Pill></div>)}</div>
        <div className="privacy-note"><ShieldCheck size={17}/> Cada servicio consulta únicamente los datos y permisos necesarios. La pulsera no contiene el historial completo.</div>
        <div className="architecture-note"><Watch size={19}/><div><strong>Identidad ≠ pulsera física</strong><p>Bloquear una credencial no elimina la identidad ni sus registros. Una nueva pulsera hereda únicamente los permisos que correspondan a esa persona.</p></div></div>
      </Panel>
    </div>
  </div>;
}
