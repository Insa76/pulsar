import { useState } from "react";
import { AlertTriangle, Phone, QrCode, ShieldCheck, Stethoscope, UserRound, LockKeyhole, ArrowRight } from "lucide-react";
import type { Person } from "../../data/demoData";
import { Panel, Pill, SectionTitle } from "../../components/Panel";

export default function EmergencyDemo({ person, credentialId, credentialBlocked }: { person: Person; credentialId: string; credentialBlocked: boolean }) {
  const [qrVisible, setQrVisible] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [showMedical, setShowMedical] = useState(false);

  return <div className="module">
    <SectionTitle eyebrow="ESCENARIO 01 · ASISTENCIA" title="Identificación para emergencias"
      description="Dos niveles de consulta: información esencial mediante QR y registro ampliado con acceso protegido." />
    <div className="two-col">
      <Panel>
        <div className="panel-heading"><div><span className="eyebrow">PERFIL SELECCIONADO</span><h3>{person.name}</h3></div><Pill tone="success">{person.profile}</Pill></div>
        <div className="person-line"><div className="avatar">{person.name.split(" ").map(x => x[0]).slice(0,2).join("")}</div><div><strong>{person.age} años</strong><small>Credencial {person.id}</small></div></div>
        <div className="wristband-card">
          <div className="wristband-visual"><div className="band-loop"><span>TRANSITIA</span><b>NFC</b></div></div>
          <div><small>IDENTIFICADOR DE CREDENCIAL</small><strong>{credentialId}</strong></div>
        </div>
        <div className="action-stack">
          <button className="button button-primary" onClick={() => { setQrVisible(true); setShowMedical(false); }}>
            <QrCode size={17}/> Simular lectura del QR
          </button>
          <button className="button button-dark" disabled={credentialBlocked} onClick={() => { setQrVisible(false); setAuthorized(false); setShowMedical(true); }}>
            <Stethoscope size={17}/> Simular consulta sanitaria NFC
          </button>
        </div>
        {credentialBlocked && <div className="privacy-note warning"><AlertTriangle size={17}/> La credencial NFC está revocada. La ficha QR de emergencia sigue visible en esta simulación; en una implementación real, la vigencia del QR y la exposición de datos deben poder revocarse y controlarse por separado.</div>}
        <p className="helper">La lectura se simula en pantalla. No se utiliza la cámara ni el NFC físico del dispositivo.</p>
      </Panel>
      <Panel className="result-panel">
        {!qrVisible && !showMedical && <div className="empty-state"><ShieldCheck size={42}/><h3>Esperando lectura</h3><p>Elegí QR para ver la ficha pública o NFC para iniciar la consulta sanitaria protegida.</p></div>}
        {qrVisible && <div className="record">
          <div className="result-head"><Pill tone="success">Ficha pública de emergencia</Pill><span className="live-dot">● Visible</span></div>
          <h3>{person.name}</h3>
          <p className="muted">Información esencial para una primera asistencia.</p>
          <div className="data-row"><AlertTriangle size={18}/><div><small>ALERGIAS</small><strong>{person.allergies.length ? person.allergies.join(" · ") : "Sin alergias declaradas"}</strong></div></div>
          <div className="data-row"><Stethoscope size={18}/><div><small>MEDICACIÓN RELEVANTE</small><strong>{person.medication.length ? person.medication.join(" · ") : "Sin medicación declarada"}</strong></div></div>
          <div className="data-row"><Phone size={18}/><div><small>CONTACTO DE EMERGENCIA</small><strong>{person.emergencyContact}</strong><strong>{person.emergencyPhone}</strong></div></div>
          <div className="privacy-note"><ShieldCheck size={17}/> No se muestran domicilio, DNI completo ni historial clínico.</div>
        </div>}
        {showMedical && <div className="record">
          <div className="result-head"><Pill tone="warning">Registro ampliado · acceso protegido</Pill><LockKeyhole size={18}/></div>
          {!authorized ? <>
            <h3>Verificación del profesional</h3><p className="muted">El NFC identifica la credencial, pero no autentica al profesional.</p>
            <label className="field-label">Perfil de acceso</label>
            <select className="select-control"><option>Personal sanitario autorizado</option><option>Servicio de emergencia</option></select>
            <label className="field-label">Motivo de consulta</label>
            <select className="select-control"><option>Atención de emergencia</option><option>Continuidad asistencial</option></select>
            <button className="button button-primary full" onClick={() => setAuthorized(true)}>Simular autenticación y autorización <ArrowRight size={16}/></button>
          </> : <>
            <h3>Registro médico de {person.name}</h3>
            <div className="privacy-note"><ShieldCheck size={17}/> Acceso autorizado simulado. Consulta registrada en auditoría.</div>
            <div className="data-row"><Stethoscope size={18}/><div><small>ANTECEDENTES / NOTAS</small><strong>{person.medicalNotes}</strong></div></div>
            <div className="data-row"><AlertTriangle size={18}/><div><small>ALERGIAS</small><strong>{person.allergies.join(" · ") || "No declaradas"}</strong></div></div>
            <div className="data-row"><UserRound size={18}/><div><small>CONTACTO REGISTRADO</small><strong>{person.emergencyContact} · {person.emergencyPhone}</strong></div></div>
            <button className="button button-secondary full" onClick={() => setAuthorized(false)}>Cerrar consulta protegida</button>
          </>}
        </div>}
      </Panel>
    </div>
    <div className="info-strip"><ShieldCheck size={18}/><span><strong>Principio de privacidad:</strong> el QR muestra solo lo necesario para asistir. La consulta ampliada requiere identidad, permisos y auditoría.</span></div>
  </div>;
}