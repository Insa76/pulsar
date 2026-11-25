export type Person = {
  id: string;
  name: string;
  age: number;
  profile: string;
  wristband: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string[];
  medication: string[];
  medicalNotes: string;
  benefits: string[];
  status: "active" | "review" | "blocked";
  access: string[];
};

export const people: Person[] = [
  {
    id: "TR-004281",
    name: "Sofía Benítez",
    age: 9,
    profile: "Niña",
    wristband: "TIA-8F31-A920",
    emergencyContact: "Laura Benítez · madre",
    emergencyPhone: "+54 379 555 0182",
    allergies: ["Alergia grave a la penicilina"],
    medication: ["Autoinyector indicado por su equipo médico (dato de ejemplo)"],
    medicalNotes: "En caso de emergencia, contactar a su responsable. Información ficticia.",
    benefits: ["Apoyo escolar"],
    status: "active",
    access: ["Centro comunitario"]
  },
  {
    id: "TR-007152",
    name: "Carlos Fernández",
    age: 42,
    profile: "Adulto",
    wristband: "TIA-3C72-B114",
    emergencyContact: "Mariana Fernández · contacto elegido",
    emergencyPhone: "+54 379 555 0231",
    allergies: ["Alergia conocida a antiinflamatorios (ejemplo)"],
    medication: ["Medicación habitual declarada (ejemplo)"],
    medicalNotes: "Antecedente declarado. Confirmar con personal sanitario.",
    benefits: ["Módulo alimentario", "Asistencia escolar familiar"],
    status: "active",
    access: ["Centro comunitario"]
  },
  {
    id: "TR-009804",
    name: "Elena Gómez",
    age: 73,
    profile: "Adulto mayor",
    wristband: "TIA-9A20-C441",
    emergencyContact: "Roberto Gómez · hijo",
    emergencyPhone: "+54 379 555 0319",
    allergies: ["Sin alergias declaradas"],
    medication: ["Tratamiento habitual declarado (ejemplo)"],
    medicalNotes: "Puede requerir asistencia para comunicarse. Información ficticia.",
    benefits: ["Módulo alimentario", "Programa de acompañamiento"],
    status: "active",
    access: ["Centro de día"]
  },
  {
    id: "TR-002610",
    name: "Miguel Acosta",
    age: 56,
    profile: "Adulto",
    wristband: "TIA-5D18-D702",
    emergencyContact: "Contacto de emergencia registrado",
    emergencyPhone: "+54 379 555 0440",
    allergies: [],
    medication: [],
    medicalNotes: "Sin información médica adicional cargada.",
    benefits: ["Módulo alimentario"],
    status: "review",
    access: []
  }
];

export const programs = [
  { id: "food", name: "Módulo alimentario", description: "Entrega de mercadería mensual", neighborhood: "Barrio San Martín" },
  { id: "school", name: "Apoyo escolar", description: "Kit de útiles escolares", neighborhood: "Centro comunitario" },
  { id: "senior", name: "Programa de acompañamiento", description: "Servicios para adultos mayores", neighborhood: "Centro de día" }
];

export const initialDeliveries = [
  { id: "OP-1001", personId: "TR-007152", person: "Carlos Fernández", program: "Módulo alimentario", date: "25/11/2026", operator: "Agente M. Ruiz", status: "synced" as const }
];