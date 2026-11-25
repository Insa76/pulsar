# TransitIA — Demo de credencial ciudadana multipropósito

Demo autónoma para presentar cuatro usos de una misma pulsera:

1. Emergencias: ficha pública limitada mediante QR y registro ampliado protegido (simulado).
2. Beneficios sociales: verificación de beneficiarios y registro de entregas.
3. Accesos institucionales: permisos por edificio, sector y horario.
4. Credencial multipropósito: servicios asociados, bloqueo y reemplazo de pulsera.

## Requisitos

- Windows 10/11
- Node.js 20 o superior
- npm

## Instalación y ejecución

Abrir PowerShell en la carpeta del proyecto y ejecutar:

```powershell
npm install
npm run dev
```

Abrir la dirección que indique Vite, normalmente:

`http://localhost:5173`

Para comprobar la compilación:

```powershell
npm run build
```

## Alcance de esta demo

- Todos los datos son ficticios.
- Las lecturas NFC y QR son simulaciones mediante botones.
- No se conecta a sistemas municipales, bases de datos ni servicios de salud.
- No utiliza lectores físicos ni accede al NFC real del teléfono.
- El modo offline representa una copia local simulada y una sincronización posterior.
- El bloqueo y reemplazo de una pulsera se comparte entre módulos: beneficios y accesos rechazan la credencial revocada. La identidad de la persona se conserva.
- En emergencias, la simulación mantiene visible el QR público aunque la credencial NFC esté revocada; el flujo NFC protegido queda deshabilitado. En una implementación real, la vigencia del QR debe poder revocarse por separado.
- La autenticación sanitaria y los permisos se representan como flujo conceptual, no como controles de seguridad productivos.

## Estructura

```text
src/
  components/       Componentes reutilizables
  data/             Datos ficticios de demostración
  modules/
    emergency/      Emergencias
    social/         Beneficios sociales
    access/         Accesos institucionales
    identity/       Credencial multipropósito
  App.tsx            Navegación y estado de la demo
  main.tsx           Punto de entrada
  styles.css         Diseño visual
```

## Nota para presentaciones

La propuesta representa una arquitectura objetivo. La selección de chip, lectores, mecanismos criptográficos, integración municipal, protección de datos y operación offline deben definirse y validarse antes de cualquier implementación real.
