import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, CloudOff, Database, History, Radio, RefreshCw, ScanLine, ShieldAlert, Wifi } from "lucide-react";
import type { Person } from "../../data/demoData";
import { initialDeliveries, programs } from "../../data/demoData";
import { Metric, Panel, Pill, SectionTitle } from "../../components/Panel";

type Delivery = { id: string; personId: string; person: string; program: string; date: string; operator: string; status: "local" | "synced" };

type Props = { people: Person[]; blockedCredentials: string[]; credentialByPerson: Record<string, string> };

export default function SocialBenefitsDemo({ people, blockedCredentials, credentialByPerson }: Props) {
  const [selectedProgram, setSelectedProgram] = useState(programs[0].id);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [offline, setOffline] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const program = programs.find(p => p.id === selectedProgram)!;
  const eligible = selectedPerson?.benefits.includes(program.name) ?? false;
  const requiresReview = selectedPerson?.status === "review";
  const credentialId = selectedPerson ? (credentialByPerson[selectedPerson.id] ?? selectedPerson.wristband) : "";
  const blocked = selectedPerson ? selectedPerson.status === "blocked" || blockedCredentials.includes(credentialId) : false;
  const alreadyDelivered = selectedPerson ? deliveries.some(d => d.personId === selectedPerson.id && d.program === program.name) : false;
  const pending = useMemo(() => deliveries.filter(d => d.status === "local").length, [deliveries]);

  function scan(person: Person) { setSelectedPerson(person); setScanned(true); }
  function register() {
    if (!selectedPerson || !eligible || alreadyDelivered || blocked || requiresReview) return;
    setDeliveries(old => [{ id: `OP-${1000 + old.length + 1}`, personId: selectedPerson.id, person: selectedPerson.name, program: program.name, date: "25/11/2026", operator: "Agente M. Ruiz", status: offline ? "local" : "synced" }, ...old]);
  }

  return <div className="module">
    <SectionTitle eyebrow="ESCENARIO 02 · GESTIÓN SOCIAL" title="Verificación de beneficios sociales"
      description="La pulsera identifica al beneficiario. La plataforma consulta el padrón municipal y registra la prestación." />
    <div className="toolbar">
      <div className="connection-state">{offline ? <><CloudOff size={17}/> Modo offline · padrón sincronizado</> : <><Wifi size={17}/> Conectado · consulta municipal</>}</div>
      <button className={`button ${offline ? "button-warning" : "button-secondary"}`} onClick={() => { setOffline(!offline); setSelectedPerson(null); setScanned(false); }}>
        {offline ? <Wifi size={16}/> : <CloudOff size={16}/>} {offline ? "Volver a conectar" : "Simular falta de conexión"}
      </button>
    </div>
    {offline && <div className="privacy-note warning"><CloudOff size={17}/> Se utiliza una copia local del padrón, descargada previamente. No refleja cambios, bloqueos ni entregas registradas en otros dispositivos después de la última sincronización.</div>}
    <div className="three-metrics">
      <Metric label="Entregas registradas" value={deliveries.length} detail="En este operativo"/>
      <Metric label="Pendientes de sincronizar" value={offline ? pending : 0} detail="En este dispositivo"/>
      <Metric label="Beneficiarios del padrón" value={people.length} detail="Datos ficticios"/>
    </div>
    <div className="two-col">
      <Panel>
        <span className="eyebrow">OPERATIVO MUNICIPAL</span>
        <h3>Entrega de asistencia</h3>
        <p className="muted">Barrio San Martín · Corrientes</p>
        <label className="field-label">Seleccionar programa</label>
        <select className="select-control" value={selectedProgram} onChange={e => { setSelectedProgram(e.target.value); setSelectedPerson(null); setScanned(false); }}>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="program-card"><ClipboardList size={22}/><div><strong>{program.name}</strong><small>{program.description} · {program.neighborhood}</small></div></div>
        <div className="scan-area">
          <div className="scan-icon"><ScanLine size={30}/></div>
          <strong>Identificar beneficiario</strong>
          <p>Seleccioná una pulsera para simular su lectura NFC.</p>
          <div className="person-select-list">
            {people.map(p => <button key={p.id} className={`person-option ${selectedPerson?.id === p.id ? "selected" : ""}`} onClick={() => scan(p)}>
              <span className="mini-avatar">{p.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><span><strong>{p.name}</strong><small>{credentialByPerson[p.id] ?? p.wristband}{blockedCredentials.includes(credentialByPerson[p.id] ?? p.wristband) ? " · BLOQUEADA" : ""}</small></span><Radio size={16}/>
            </button>)}
          </div>
        </div>
      </Panel>
      <Panel>
        <span className="eyebrow">RESULTADO DE VERIFICACIÓN</span>
        {!scanned || !selectedPerson ? <div className="empty-state"><Database size={40}/><h3>Esperando identificación</h3><p>Al leer una pulsera, TransitIA consultará la habilitación para el programa seleccionado.</p></div> :
          <div className="record">
            <div className="result-head"><Pill tone={blocked || !eligible ? "danger" : requiresReview || alreadyDelivered ? "warning" : "success"}>{blocked ? "Credencial bloqueada" : !eligible ? "No habilitado" : requiresReview ? "Requiere revisión" : alreadyDelivered ? "Prestación ya registrada" : "Beneficiario habilitado"}</Pill><small>{offline ? "Copia local" : "Padrón municipal"}</small></div>
            <h3>{selectedPerson.name}</h3>
            <p className="muted">ID {selectedPerson.id} · {selectedPerson.profile}</p>
            <div className="data-row"><ClipboardList size={18}/><div><small>PROGRAMA SELECCIONADO</small><strong>{program.name}</strong></div></div>
            <div className="data-row"><Database size={18}/><div><small>ESTADO EN EL PADRÓN</small><strong>{blocked ? "Credencial bloqueada" : requiresReview ? "Registro observado · requiere revisión del área responsable" : !eligible ? "No figura habilitado para esta prestación" : alreadyDelivered ? "Ya existe una entrega registrada" : "Habilitado · entrega pendiente"}</strong></div></div>
            {eligible && !requiresReview && !blocked && !alreadyDelivered && <button className="button button-primary full" onClick={register}><CheckCircle2 size={17}/> Confirmar entrega</button>}
            {(blocked || requiresReview || !eligible) && <div className="privacy-note warning"><ShieldAlert size={17}/> No se registra la entrega. El operador debe derivar el caso al área responsable; TransitIA no modifica la elegibilidad.</div>}
            {alreadyDelivered && <div className="privacy-note warning"><ShieldAlert size={17}/> Se detectó una entrega previa para este programa en la demo.</div>}
            {alreadyDelivered && deliveries.some(d=>d.personId===selectedPerson.id && d.program===program.name && d.status==="local") && <div className="privacy-note warning"><CloudOff size={17}/> La entrega está guardada en este dispositivo y todavía requiere sincronización.</div>}
          </div>}
        <div className="sync-footer">
          <div><small>Sincronización</small><strong>{offline ? `${pending} operación(es) local(es)` : "Conectado con padrón (simulado)"}</strong></div>
          <button className="button button-secondary" disabled={!offline || pending === 0} onClick={() => { setDeliveries(old => old.map(d => d.status === "local" ? { ...d, status: "synced" as const } : d)); setOffline(false); }}><RefreshCw size={15}/> Sincronizar</button>
        </div>
      </Panel>
    </div>
    <Panel>
      <div className="panel-heading"><div><span className="eyebrow">TRAZABILIDAD</span><h3>Registro de entregas</h3></div><Pill tone="info">{deliveries.length} operaciones</Pill></div>
      <div className="table-wrap"><table><thead><tr><th>Beneficiario</th><th>Programa</th><th>Fecha</th><th>Operador</th><th>Estado</th></tr></thead><tbody>
        {deliveries.map(d=><tr key={d.id}><td><strong>{d.person}</strong><small>{d.personId}</small></td><td>{d.program}</td><td>{d.date}</td><td>{d.operator}</td><td><Pill tone={d.status === "local" ? "warning" : "success"}>{d.status === "local" ? "Pendiente de sincronizar" : "Sincronizada"}</Pill></td></tr>)}
      </tbody></table></div>
      <p className="helper"><History size={14}/> Los movimientos son ficticios y se conservan únicamente mientras la demo está abierta.</p>
    </Panel>
  </div>;
}