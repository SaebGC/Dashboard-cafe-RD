# ☕ AllDayCafe Dashboard — Frontend

**AllDayCafe Dashboard** es una plataforma SaaS de gestión operativa y financiera diseñada especialmente para cafeterías de especialidad y negocios gastronómicos artesanales. Desarrollada con **React 19**, **TypeScript**, **Tailwind CSS v4** y **Vite**, ofrece una experiencia de usuario rápida, reactiva y elegante con una estética visual cálida y profesional.

---

## 🎨 Identidad Visual y Estilo Artesanal

La aplicación implementa una paleta de diseño inspirada en la cultura del café de especialidad y materiales orgánicos:

| Token / Color | Código Hex | Uso Principal |
| :--- | :--- | :--- |
| **Warm Cream Canvas** | `#F9F7F2` | Fondo general de la aplicación y canvas de trabajo |
| **Deep Forest Green** | `#0F281E` / `#183D2F` | Superficies principales, barra lateral, botones primarios y encabezados |
| **Warm Gold / Amber** | `#C8963E` / `#FEF3D6` | Acentos visuales, bordes destacados, anillos de foco, insignias y métricas clave |
| **Card Border & White** | `#EBE6DC` / `#FFFFFF` | Tarjetas con ligera elevación, bordes suaves y estilo *glassmorphism* |
| **Semantic Badges** | Verde (`#E6F4EA`), Ámbar (`#FEF3D6`), Rojo (`#FDE8E6`) | Indicadores de estado de pagos, turnos y alertas |

---

## 🚀 Estado Actual del Proyecto y Módulos Implementados

### 1. 🔐 Autenticación y Gestión de Sesión (`AuthContext` & `LoginView`)
- **Pantalla de Inicio de Sesión (`LoginView.tsx`)**:
  - Encabezado con identidad de marca, logotipo con anillo dorado y estado operativo de terminal.
  - **Reloj en vivo** y detector automático de turno de trabajo (*Turno Matutino*, *Turno Tarde*, *Turno Vespertino / Cierre*).
  - **Acceso Rápido Demo 1-Clic**: Selector interactivo de tarjetas para los 3 perfiles (`empleado`, `admin`, `jefe`) que autocompleta credenciales o ingresa directamente con un clic.
  - Formulario con campos de correo (`Mail`), contraseña con opción de ver/ocultar (`Lock`, `Eye`/`EyeOff`), validaciones integradas y banner de alerta (`AlertCircle`).
  - Botón de envío con estado de carga animado (*"Verificando credenciales..."*).
- **Contexto de Autenticación (`AuthContext.tsx`)**:
  - Manejo del estado `user: UserSession | null`, `isAuthenticated` y `isLoading`.
  - Persistencia de sesión en el navegador (`localStorage.getItem('alldaycafe_user_session')`).
  - Métodos `login(email, password)`, `loginAsDemo(role)`, `logout()` y `switchRole(role)`.
- **Integración con el Layout**:
  - La barra lateral ([`Sidebar.tsx`](src/components/layout/Sidebar.tsx)) muestra el nombre del usuario conectado, su correo, iniciales en avatar y botón de **Cerrar Sesión** (`LogOut`).
  - Sincronización transparente con `RoleContext` cumpliendo con las pautas de React 19 (cero efectos secundarios síncronos).

---

### 2. 🛡️ Control de Acceso Basado en Roles (RBAC)
La aplicación adapta dinámicamente sus vistas, menús y permisos según el rol del usuario conectado:

```
Usuario Autenticado
├── ☕ 'empleado' (Personal de Barra / Cajero)
│    └── Terminal POS Simplificada (Solo venta diaria, sin acceso a métricas globales ni nómina)
├── 🛡️ 'admin' (Administrador de Tienda)
│    ├── Visión General del Local (KPIs, flujo de caja, distribución)
│    ├── Punto de Venta y Catálogo Diario
│    ├── Menú de Productos y Márgenes de Ganancia
│    ├── Gastos Operativos Dinámicos
│    └── Nómina de Empleados y Abonos
└── 👑 'jefe' (Gerencia General / Propietario)
     ├── Dashboard Ejecutivo Multimétrica
     ├── Auditoría de Nómina y Deuda Salarial Global
     └── Auditoría de Gastos Operativos
```

- **Guardas síncronas de navegación**: Si un usuario intenta acceder a una vista no permitida para su rol, el sistema lo redirige automáticamente a su vista autorizada por defecto sin parpadeos ni fugas de datos.

---

### 3. 📊 Dashboard de Visión General (`OverviewView`)
- **Tarjetas KPI en Tiempo Real**:
  - **Ingresos de Hoy**: Suma de las ventas brutas registradas en el día.
  - **Egresos Pagados**: Desglose del dinero egresado físicamente (Gastos pagados + Nóminas abonadas).
  - **Egresos Pendientes**: Pasivos y compromisos inmediatos (Facturas pendientes + Deuda salarial acumulada).
  - **Balance en Caja**: Dinero líquido real disponible en caja (`Ingresos - Egresos Pagados`). Si los gastos superan los ingresos, emite una advertencia visual de saldo negativo.
- **Gráfico de Distribución del Flujo de Caja**: Barra dinámica multicolor que representa qué porcentaje de los ingresos se destina a gastos fijos, a nómina y cuánto permanece como beneficio disponible.

---

### 4. 🛒 Punto de Venta Interactivo (`SalesEntryView` & `EmpleadoPosView`)
- **Catálogo Visual de Productos**: Organizado en tarjetas con imágenes, categorías (*Café Caliente*, *Bebidas Frías*, *Repostería*, *Salados*).
- **Steppers Ergonómicos (+ / -)**: Incremento o reducción de unidades vendidas al instante con un solo clic.
- **Precio Unitario Editable en Vivo**: Flexibilidad para ajustar precios durante promociones u horarios especiales.
- **Buscador en Tiempo Real y Chips de Categoría**: Filtrado instantáneo por nombre y categoría.
- **Botón de Reinicio Seguro de Jornada**: Permite volver las ventas diarias a cero al cierre del local, protegido por modal de confirmación.

---

### 5. 🧾 Gastos Dinámicos (`ExpensesView` / `AdminExpensesView`)
- **Directorio de Egresos Operativos**: Control de electricidad, agua potable, renta de local, gas, internet y mantenimiento.
- **Interruptor de Estado Inmediato**: Alternancia entre `Por Pagar` y `Pagado`.
  - Al marcar como `Pagado`, deduce automáticamente el importe del balance libre de caja.
  - Al retornar a `Por Pagar`, el importe se reincorpora al saldo disponible.
- **Edición en Línea y Eliminación Protegida**: Actualización inmediata de conceptos y montos, con confirmación previa antes de borrar.

---

### 6. 👥 Nómina y Deuda Salarial (`EmployeesView` / `JefePayrollView`)
- **Seguimiento Individual de Colaboradores**: Monitoreo de monto total pactado, importe abonado y balance pendiente por cobrar.
- **Chips de Abono Rápido**: Botones inteligentes (`+RD$ 200`, `+RD$ 500`, `+RD$ 1000` o `Completar Restante`) para registrar pagos en segundos.
- **Historial Transaccional Auditable**: Cada abono registra fecha, hora exacta y monto.
- **Reversión Individual de Abonos**: Se puede anular un abono específico; el dinero abonado regresa automáticamente a la caja general y la deuda del colaborador se restablece.
- **Reinicio de Nómina**: Opción para reiniciar el ciclo de pagos del empleado.

---

### 7. 🏷️ Catálogo de Productos y Márgenes (`AdminMenuView`)
- Control de precios de venta vs. costo de ingredientes por unidad.
- Cálculo automático de **Margen de Ganancia (%)** por producto para identificar los artículos más rentables de la barra.

---

## 🔒 Blindaje Financiero y Calidad de Código

1. **Blindaje contra Errores Matemáticos (`formatDOP`)**: Todo valor numérico pasa por una normalización rigurosa (`Number(valor) || 0`), garantizando que jamás aparezca el error `RD$ NaN`. Formateado oficial para República Dominicana (`RD$ #,##0.00`).
2. **Sistema Universal de Confirmación (`ConfirmModal`)**: Toda acción con impacto destructivo o irreversible (borrar venta, eliminar gasto, suprimir abono a empleado o reiniciar caja) exige confirmación explícita mediante un modal accesible.
3. **Pautas de React 19**: Estado derivado sin llamadas síncronas a `setState` en efectos (`react-hooks/set-state-in-effect`), logrando 0 warnings en ESLint y compilaciones instantáneas.

---

## 🔑 Credenciales de Prueba (Cuentas Demo)

Puedes acceder a la plataforma utilizando cualquiera de las cuentas demo preconfiguradas:

| Rol | Correo Demo | Contraseña Demo | Vista Inicial | Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **Personal de Barra** | `caja@allday.cafe` | `caja123` | Terminal POS | Solo registro de ventas diarias |
| **Administrador** | `admin@allday.cafe` | `admin123` | Visión General | POS, Menú, Gastos, Nómina, Balance |
| **Gerente General** | `gerencia@allday.cafe` | `jefe123` | Dashboard Ejecutivo | Auditoría ejecutiva, nómina total, gastos |

*Tip: En la pantalla de login puedes pulsar directamente sobre cualquiera de los botones de **"Entrar directo"** para ingresar sin escribir credenciales.*

---

## 📁 Estructura del Código Fuente

```text
cafe-front/
├── src/
│   ├── assets/               # Logotipos e imágenes (cafe-logo-all.jpg)
│   ├── components/
│   │   ├── layout/           # Sidebar y Topbar adaptables a roles y sesión
│   │   ├── ui/               # Componentes atómicos (ConfirmModal, Card, Button, Input)
│   │   └── views/            # Vistas del sistema:
│   │       ├── LoginView.tsx        # Pantalla de autenticación artesanal
│   │       ├── OverviewView.tsx     # Dashboard principal de KPIs
│   │       ├── SalesEntryView.tsx   # POS interactivo de ventas
│   │       ├── ExpensesView.tsx     # Gestión de gastos operativos
│   │       ├── EmployeesView.tsx    # Nómina transaccional y abonos
│   │       ├── MenuView.tsx         # Catálogo de precios y márgenes
│   │       ├── ServicesView.tsx     # Vista de servicios auxiliares
│   │       ├── empleado/            # Vistas específicas para cajeros
│   │       ├── admin/               # Vistas específicas para administradores
│   │       └── jefe/                # Vistas específicas para directivos
│   ├── constants/
│   │   └── navigation.ts     # Configuración de ítems de menú y permisos RBAC
│   ├── context/
│   │   ├── AuthContext.tsx   # Sesión de usuario, login/logout, persistencia
│   │   ├── FinancialContext.tsx # Finanzas, ventas, nóminas, caja en tiempo real
│   │   └── RoleContext.tsx   # Contexto y sincronización de rol activo
│   ├── data/                 # Datos iniciales mock (productos, empleados, gastos)
│   ├── lib/                  # Funciones de utilidad (formatDOP, classNames)
│   ├── types.ts              # Tipos TypeScript globales (UserSession, UserRole, etc.)
│   ├── App.tsx               # Orquestador principal de autenticación y vistas
│   ├── index.css             # Design tokens y configuración de Tailwind CSS v4
│   └── main.tsx              # Entrada de la aplicación React
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev

# Validar tipos TypeScript y compilar bundle de producción
npm run build

# Ejecutar el linter (ESLint con reglas de React 19)
npm run lint

# Previsualizar el bundle de producción
npm run preview
```
