# Documentación del Proyecto: AllDayCafe Dashboard (V2.0)

## 1. Visión General
El **AllDayCafe Dashboard** es una aplicación web financiera de arquitectura "frontend-only" (sin servidor) diseñada específicamente para facilitar la administración económica diaria de una cafetería. Su objetivo principal es registrar ventas diarias mediante un Punto de Venta ágil, controlar los egresos (gastos operativos) y administrar de manera sumamente detallada la nómina de empleados. Todo se refleja en un flujo de caja en tiempo real.

---

## 2. Tecnologías Clave Utilizadas
* **React**: Motor central interactivo de la aplicación.
* **Vite**: Entorno de desarrollo para un rendimiento ultrarrápido.
* **Tailwind CSS**: Herramienta de estilos utilizada para diseñar la estética "premium" de la aplicación (modo oscuro en `bg-slate-900`, tarjetas de vidrio, colores de alto contraste como el esmeralda, ámbar y cyan).
* **Lucide React**: Biblioteca para la iconografía intuitiva en cada botón.
* **LocalStorage**: Mecanismo de almacenamiento del navegador que asegura que ningún dato financiero se pierda al recargar la página.

---

## 3. Seguridad y Prevención de Errores
Esta versión incluye arquitecturas avanzadas para que sea imposible romper las matemáticas o eliminar datos accidentalmente:
1. **Blindaje Financiero (`formatDOP`)**: Todo el sistema usa un parseo estricto (`Number(valor) || 0`) que previene de forma absoluta la aparición del error `"RD$ NaN"`.
2. **Sistema Universal de Confirmación (`ConfirmModal`)**: Se integró un modal de alerta visual (una ventana emergente oscura). A partir de ahora, toda acción "destructiva" (borrar una venta, eliminar un gasto, reiniciar la caja o eliminar un pago a un empleado) te pedirá que confirmes tu decisión antes de proceder.

---

## 4. Vistas y Módulos Principales (Paso a Paso)

### 📊 1. Dashboard de Visión General (`OverviewView`)
Es el panel de control principal. Contiene tarjetas con los indicadores vitales del negocio:
* **Ingresos de Hoy**: Sumatoria total y en vivo de las ventas brutas generadas.
* **Egresos Pagados**: Desglose del dinero que ya ha salido físicamente de la caja (Gastos Pagados + Nómina Pagada).
* **Egresos Pendientes *(Nueva Función)***: Calcula y muestra exactamente a cuánto ascienden tus compromisos futuros (Gastos sin pagar + Dinero que aún le debes a los empleados).
* **Balance en Caja**: El dinero real disponible (Caja Libre). Si los gastos pagados superan las ventas, la tarjeta se torna roja como advertencia visual.
* **Distribución de Dinero**: Una barra multicolor que mapea qué porción de tus ganancias se fue en nómina, en gastos o si quedó libre.

### 🛒 2. Catálogo Interactivo POS (`SalesEntryView`)
Evolucionó de un simple formulario a un avanzado **Punto de Venta (POS)** tipo catálogo interactivo.
* **Buscador y Filtros en Vivo**: Una barra superior donde puedes escribir el nombre de un producto y filtrar la lista en tiempo real. También posee "Píldoras/Chips" para filtrar por categorías (Ej. *Café Caliente*, *Repostería*).
* **Tarjetas Interactivas de Producto**:
  * **Precio Editable**: Permite cambiar el precio por unidad del producto en vivo.
  * **Botones Ergonómicos (+ y -)**: En vez de escribir, usas botones circulares grandes para sumar ventas tan rápido como el cliente las ordene. El total generado se recalcula al instante.
* **Botón "Reiniciar Día"**: Permite devolver todas las ventas de todos los productos a 0 cuando finaliza la jornada laboral (Protegido por el Modal de Confirmación).

### 🧾 3. Gastos Dinámicos (`ExpensesView`)
Registro detallado de los pagos fijos.
* Formularios para ingresar el nombre del servicio (Luz, Agua, Local) y su costo.
* **Selector de Pago**: Un selector desplegable que alterna entre "Por Pagar" y "Pagado". Al marcarse como pagado, deduce el costo automáticamente de la caja.
* **Borrado Seguro**: Al eliminar un gasto de la lista, salta el Modal de Confirmación. Si el gasto estaba pagado, la aplicación es tan inteligente que devuelve ese dinero automáticamente al balance disponible.

### 👥 4. Nómina Transaccional de Empleados (`EmployeesView`)
El módulo más avanzado del proyecto, diseñado para controlar el pago a plazos de tus 4 empleados fijos.
* **Monto a Pagar (Deuda Editable)**: Permite re-negociar el pago total de un empleado de manera fluida.
* **Abonos Súper Rápidos (Chips)**: Presenta botones con sumas predefinidas (`+RD$ 200`, `+RD$ 500`, `+RD$ 1000` o "Completar Restante"). Abonas con un simple clic sin usar el teclado.
* **Historial de Pagos y Auditoría *(Nueva Función)***:
  * Al fondo de la tarjeta aparece un registro minucioso con cada abono realizado (fecha, hora y monto).
  * **Control de Eliminación Individual**: Puedes pasar el ratón por un abono en el historial y darle al botón de eliminar (basurero rojo). Al confirmar en el modal, **ese abono específico se elimina, la deuda del empleado crece y el dinero vuelve a la caja**.
  * **Botón "Reiniciar Pagos"**: Borra todo el historial del empleado y devuelve el 100% del dinero abonado a la caja general del negocio, de forma completamente transparente y auditable.

---

## 5. Conclusión
El **AllDayCafe Dashboard** es ahora una solución de grado profesional que permite a la cafetería operar el flujo de su dinero con la agilidad de un Punto de Venta real. Es completamente resistente a errores gracias al `ConfirmModal` y rastrea hasta el último centavo de la nómina y los gastos sin requerir bases de datos lentas ni conexión al servidor.
