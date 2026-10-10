# ☕ AllDayCafe Dashboard

**AllDayCafe Dashboard** es una aplicación web financiera de arquitectura *"frontend-only"* diseñada para facilitar la administración económica de una cafetería de manera ágil y visual.

Sin necesidad de servidores ni bases de datos complejas, esta herramienta permite llevar un control exacto de las ventas, los gastos fijos y la nómina de empleados directamente desde el navegador. Todos los datos están seguros y persisten gracias al almacenamiento local (`localStorage`).

---

## 🚀 Características Principales

### 1. Panel de Control Global (Overview)
- **Indicadores Clave en Vivo**: Visualiza instantáneamente tus ingresos de hoy, el total de dinero que ha salido (egresos pagados) y el que está comprometido (egresos pendientes).
- **Balance en Caja Seguro**: Calcula automáticamente el dinero real disponible con protección contra errores matemáticos (adiós al temido `RD$ NaN`).
- **Distribución Gráfica**: Una barra que mapea de manera visual cómo fluye tu dinero entre ventas, nómina y gastos operativos.

### 2. Punto de Venta Interactivo (POS)
- **Catálogo Dinámico**: Crea tarjetas interactivas de tus productos en segundos.
- **Venta Ágil**: Utiliza botones `+` y `-` para registrar ventas sin necesidad de escribir números, todo se calcula automáticamente.
- **Filtros en Tiempo Real**: Usa la barra de búsqueda y las "píldoras" de categorías para encontrar el producto exacto en un catálogo grande.

### 3. Gestión de Gastos Operativos
- **CRUD Dinámico**: Crea y administra gastos fijos como Agua, Luz, Internet o Alquiler.
- **Estados Rápidos**: Alterna entre "Por Pagar" y "Pagado" usando un selector. Al marcar un pago como completado, el dinero se deduce instantáneamente de tu balance en caja.

### 4. Nómina de Empleados Transaccional
- **Auditoría Individual**: Registra y visualiza el historial específico de abonos de cada empleado con fecha, hora y monto.
- **Abonos por Chips**: Botones preconfigurados (+RD$ 200, +RD$ 500, Completar Restante) para agilizar los pagos sin tocar el teclado.
- **Cálculo de Deuda (Restante)**: El administrador puede establecer la meta salarial de cada empleado y visualizar con una barra de progreso cuánto falta por pagarle.

---

## 🛡️ Seguridad y Diseño UX/UI

- **Modo Oscuro Premium**: Paleta de alto contraste utilizando sombras suaves y elementos translúcidos sobre fondos oscuros (`slate-900`).
- **Sistema de Confirmación Universal (`ConfirmModal`)**: Toda acción de borrado, reinicio o eliminación dispara una alerta pidiendo confirmación. Es **imposible** perder datos por un clic accidental.
- **Gestión de Errores Numéricos**: Todos los valores están formateados bajo el estándar Dominicano (`RD$`) con protección matemática estricta incorporada en el contexto del código.

---

## 🛠️ Tecnologías Utilizadas

- **[React 18](https://reactjs.org/)** (Librería UI y Manejo de Estados con Context API).
- **[Vite](https://vitejs.dev/)** (Entorno de desarrollo ultrarrápido).
- **[Tailwind CSS](https://tailwindcss.com/)** (Sistema para construir diseños de nivel profesional).
- **[Lucide React](https://lucide.dev/)** (Iconografía elegante e intuitiva).

---

## ⚙️ Instalación y Uso Local

Para levantar este proyecto en tu computadora de manera local, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/SaebGC/Dashboard-cafe-RD.git
   ```

2. **Ingresa a la carpeta del proyecto:**
   ```bash
   cd Dashboard-cafe-RD
   ```

3. **Instala las dependencias necesarias:**
   ```bash
   npm install
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre en tu navegador:**
   Visita la dirección local que Vite te mostrará en la consola (usualmente `http://localhost:5173/`).

---

> **Nota:** Al ser un proyecto *"Frontend-only"*, toda tu contabilidad y registros se guardan en la memoria de tu navegador (`localStorage`). Esto significa que todo fluye súper rápido y sin internet, pero ten en cuenta que borrar la caché o los datos del navegador reseteará el dashboard a sus valores por defecto.
