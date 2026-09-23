# 🚗 CARVLAK AUTOMOTORES | Documento Estratégico & Operativo
## Implementación del Sistema de Peritaje & Tasación en Vivo de Patio

---

> **Dirigido a:** Dirección General (**Jonathan Kaitazoff**) y Equipo Comercial/Tasaciones (**Maximiliano Irujo, Marcos Martínez, Bruno Di Giovanni**).  
> **Propósito:** Evaluar y formalizar el impacto operativo, financiero y comercial de la digitalización del proceso de inspección y compra de vehículos en el local de CARVLAK.

---

# PARTE 1: RESUMEN EJECUTIVO (Executive Summary)

### 1.1 El Problema Actual en el Patio
En el modelo tradicional de compra de vehículos usados en automotora, cuando un cliente ingresa al local con su auto para venderlo o entregarlo como parte de pago:
- **Pérdida de tiempo y fricción interna:** El tasador en patio debe llamar o enviar múltiples audios de WhatsApp dispersos a Jonathan ("*Tiene unos rayones*", "*Me parece que fuma un poco*", "*Pide 11 palos, ¿qué hacemos?*").
- **Preguntas repetitivas:** La dirección necesita consultar una y otra vez datos críticos: *¿Tiene choque de chasis? ¿Qué cubiertas tiene? ¿Cuántas piezas están repintadas? ¿Qué debe de patente y multas? ¿Libreta en mano? ¿Mandame fotos.*
- **Demora en el cierre (Fuga de clientes):** El cliente espera 20 a 40 minutos en el salón mientras se triangula la información. Si la oferta tarda, el cliente se va a otra automotora o se enfría la operación.
- **Riesgo financiero por vicios ocultos:** Una pieza repintada no detectada cuesta entre **USD $90 y $120** de taller. Un auto con **puntas de chasis o largueros tocados** comprado por error deprecia el vehículo en **USD $2.000 a $4.000**, o lo vuelve invendible y legalmente riesgoso.

---

### 1.2 La Solución: App CARVLAK Tasación en Vivo
Una herramienta web progresiva (PWA) de uso táctil en el teléfono del tasador, diseñada bajo la premisa de **"Cero llamadas, cero preguntas pendientes, oferta en 10 segundos"**.

En menos de **3 minutos de inspección física**, el tasador releva:
1. **Ficha técnica y documentación completa** (incluyendo deudas SUCIVE y titulares).
2. **Alerta de Daño Estructural** (Chasis, largueros, parallamas, airbags).
3. **Mapa Interactivo de Carrocería SVG** con estado pieza por pieza (Original, Repintada, Masilla, Golpeada).
4. **Mecánica, Testigos de Tablero, A/A y Desgaste de Neumáticos.**
5. **Fotos en vivo con compresión automática** en ranuras estandarizadas.
6. **Cálculo matemático de reventa, deducción de reacondicionamiento y oferta recomendada.**

---

### 1.3 Cuadro Comparativo de Impacto Operativo

| Indicador Clave | Proceso Tradicional (Audios / Teléfono) | Proceso con CARVLAK Tasación en Vivo | Beneficio / Impacto |
| :--- | :--- | :--- | :--- |
| **Tiempo total de respuesta al cliente** | 25 a 45 minutos | **5 a 7 minutos** | **-80% de tiempo de espera** |
| **Fricción de comunicación con Jonathan** | 4 a 8 mensajes/preguntas ida y vuelta | **1 solo mensaje consolidado** | **100% libre de idas y vueltas** |
| **Tiempo de decisión de la Dirección** | 10 a 15 minutos indagando detalles | **10 a 15 segundos** de lectura limpia | **Decisión ejecutiva instantánea** |
| **Detección de Daño Estructural** | Visual subjetiva, a veces no reportada | **Alerta roja obligatoria con checklist** | **Blindaje total contra compras invendibles** |
| **Cálculo de Taller y Reacondicionamiento** | A "ojo de buen cubero" | **Cálculo automático x pieza + taller** | **Margen asegurado y protegido** |
| **Percepción del Cliente en el Salón** | Vendedor disperso escribiendo audios | **Peritaje técnico digital y transparente** | **Imagen premium, seria y profesional** |
| **Registro y Trazabilidad** | Se pierde en el chat de WhatsApp | **Historial digital indexado local** | **Auditoría para cuando el cliente vuelve** |

---

### 1.4 Retorno de Inversión (ROI) Estimado para CARVLAK
Para una automotora con un ingreso promedio de **15 a 30 vehículos peritados por semana**:
- **Ahorro de capital por prevención de vicios ocultos:** Evitar **1 sola compra** de un vehículo con daño estructural o defectos mecánicos graves ahorra entre **USD $2.500 y $4.000** netos.
- **Optimización de costos de reacondicionamiento:** Cotizar con exactitud las piezas repintadas o gastadas permite descontar en promedio **USD $300 a $600** extras en la oferta al cliente sin margen de error.
- **Incremento en tasa de cierre:** Responder una oferta formal y fundamentada en menos de 7 minutos mientras el cliente está parado frente al auto aumenta la conversión de compra directa o permuta entre un **20% y 35%**.

---

# PARTE 2: EXPLICACIÓN EN DETALLE DE LOS BENEFICIOS

```
[ Auto ingresa al Patio CARVLAK ]
               │
               ▼
[ Tasador abre App en su teléfono (3 min) ]
               │
               ▼
[ Relevamiento: Datos + Mapa Paneles + Mecánica + Fotos ]
               │
               ▼
[ Algoritmo: Valor Plaza - Taller - Deudas - Margen ]
               │
               ▼
[ 1 Clic: Reporte Estructurado a WhatsApp de Jonathan ]
               │
               ▼
[ Jonathan lee en 10 seg y responde: "Ofrecele USD X.XXX" ]
               │
               ▼
[ Oferta fundamentada y Cierre con el Cliente ]
```

---

## 2.1 Eje Operativo: Eliminación Total del "Ping-Pong" Interno

### El problema de la dispersión de datos
Cuando un tasador manda audios largos, Jonathan tiene que:
- Escucharlos mientras está reunido, manejando o atendiendo a otro cliente importante.
- Recordar si el auto tenía 60.000 o 160.000 km.
- Reclamar fotos del interior o del tablero porque el vendedor mandó sólo una foto borrosa de afuera.

### Cómo lo resuelve la App:
La aplicación genera un mensaje de WhatsApp redactado con **estilo ejecutivo, con sangrías, viñetas, emojis estandarizados y categorías cerradas**:
- **Bloque Vehículo:** Marca, Modelo, Año, KM exactos, Matrícula, Transmisión, Llaves y Services.
- **Bloque Estructura:** Indica explícitamente `❌ NO TIENE DAÑO ESTRUCTURAL` o activa la alarma `🚨 SÍ TIENE: Puntas de chasis / Largueros`.
- **Bloque Carrocería:** Lista textual exacta de paneles intervenidos (`2 piezas: Guardabarros Del. Izq (REPINTADA), Paragolpes Tras (DAÑADA)`).
- **Bloque Mecánica:** Sonido de motor, humos, pérdidas, testigos de tablero, aire acondicionado y porcentaje real de cubiertas (Delanteras, Traseras, Auxilio).
- **Bloque Documentación:** Libreta, titularidad, deuda SUCIVE y multas discriminadas.
- **Bloque Financiero:** Valor de plaza, gastos estimados, pretensión del cliente y **Oferta Recomendada en mano**.

> **Resultado:** Jonathan abre el chat, lee el resumen en un golpe de vista de 10 segundos, no tiene nada más que preguntar, y responde con una sola cifra: *"Metéle USD 10.200 y cerramos"*.

---

## 2.2 Eje Financiero: Protección del Margen y Costos de Taller

### La trampa del "Parece que está lindo"
En la compra de usados, la ganancia de la automotora **se hace al comprar, no al vender**. Si un vehículo se compra caro creyendo que "solo necesita una lustrada", y al ingresar al taller requiere:
- 2 piezas de pintura: **USD $200**
- 2 cubiertas nuevas: **USD $220**
- Deuda de patente no verificada: **USD $180**
- Service y pastillas: **USD $150**
- **Total imprevisto:** **USD $750 que se comen el margen neto de CARVLAK.**

### La Calculadora Integrada de la App:
La aplicación cuenta con una calculadora dinámica que:
1. Toma el **Valor Estimado de Reventa en Plaza (USD)**.
2. Calcula automáticamente el gasto de chapa y pintura multiplicando las piezas marcadas en el plano SVG por el costo estándar de taller de CARVLAK (USD $90 por pieza, configurable).
3. Suma costos de cubiertas, mecánica y deudas SUCIVE / multas informadas.
4. Aplica el **Margen Mínimo Deseado CARVLAK** (ej. USD $1.500).
5. Arroja el **Rango de Oferta Máxima Recomendada en Mano**.
6. **Semáforo de Viabilidad en Tiempo Real:**
   - 🟢 *Negocio Muy Favorable:* El cliente pide menos o igual a la oferta recomendada.
   - 🟡 *Negociable en Patio:* Diferencia menor a USD $800 con la pretensión del cliente.
   - 🔴 *Pretensión Alta:* El cliente pide muy por encima de los números seguros de CARVLAK.

---

## 2.3 Eje Técnico: El Mapa Interactivo de Carrocería y Alerta Estructural

```
                     [ FRENTE ]
             +-----------------------+
             |  Paragolpes Delantero |
             +-----------------------+
             |         Capó          |
             +-----------------------+
   Guardab.  |      Parabrisas       | Guardab.
   Del. Izq. |-----------------------| Del. Der.
             |                       |
   Puerta    |         TECHO         | Puerta
   Del. Izq. |                       | Del. Der.
             |-----------------------|
   Puerta    |     Luneta Trasera    | Puerta
   Tras. Izq.|-----------------------| Tras. Der.
             |     Baúl / Portón     |
   Guardab.  +-----------------------+ Guardab.
   Tras. Izq.|  Paragolpes Trasero   | Tras. Der.
             +-----------------------+
                     [ ATRÁS ]
```

### Funcionalidades clave del mapa:
1. **Inspección Visual Táctil:** El tasador camina alrededor del auto. Si ve que la puerta delantera derecha fue repintada, simplemente toca la puerta en el plano interactivo.
2. **Ciclo de Estados con Código de Color Universal:**
   - 🟢 **Original de Fábrica:** Pintura virgen de fábrica.
   - 🟡 **Repintada:** Buen acabado, repintada estética.
   - 🟠 **Masilla / Reparación Gruesa:** Pieza cargada con masilla o reparación pesada.
   - 🔴 **Dañada / Golpe Actual:** Pieza abollada, rayada profundamente o rota para reparar o sustituir.
3. **Conteo en Vivo:** La app contabiliza automáticamente: *"3 piezas intervenidas"* y actualiza el costo estimado de chapa y pintura de forma transparente.
4. **Alerta Roja de Daño Estructural:**
   - Si el auto tiene daño en puntas de chasis, largueros, parallamas, piso de baúl cortado o airbags disparados, se activa una alarma roja que encabeza el mensaje de WhatsApp.
   - Esto evita que CARVLAK compre vehículos siniestrados que luego son imposibles de garantizar o vender con financiación bancaria.

---

## 2.4 Eje Comercial y Experiencia del Cliente

### Transformar una "discusión de precio" en una "tasación profesional"
Cuando un cliente trae su auto, suele sobreestimar su valor sentimental: *"Mi auto está impecable, no tiene nada"*.
Si el tasador le tira un precio bajo sin fundamento, el cliente se ofende y desconfía.

### Con la App en la mano:
- **Autoridad Técnica:** El cliente observa al tasador utilizando un sistema digital oficial de CARVLAK, revisando sistemáticamente el vehículo, sacando fotos del tablero encendido, motor y papeles.
- **Oferta fundamentada en datos duros:** El tasador puede mostrarle la pantalla o argumentar con precisión:  
  *"Carlos, tu auto está cotizado en plaza en USD 12.000. Pero como verificamos juntos, tenemos dos cubiertas delanteras para cambio, el paragolpes trasero raspado para pintar y una cuota pendiente de patente. Nuestra oferta formal al contado en mano es de USD 10.000 limpios hoy mismo."*
- **Aceleración del cierre:** El cliente percibe que el precio ofrecido no es un capricho del vendedor, sino el resultado de un peritaje técnico auditado por la dirección.

---

## 2.5 Eje de Fotografía y Tecnología Móvil (PWA)

### El problema de las fotos pesadas por WhatsApp
Subir 8 a 10 fotos en alta resolución desde un smartphone de última generación suele pesar **30 MB a 50 MB**, tardando minutos en cargar si la señal 4G en el patio es inestable, y llenando de fotos desordenadas la memoria del teléfono de Jonathan.

### Innovaciones implementadas:
1. **Ranuras Guiadas (Plantilla de Peritaje):**
   - Frente 3/4
   - Lateral Izquierdo
   - Lateral Derecho
   - Trasera 3/4
   - Interior / Butacas
   - Tablero encendido (KM + Testigos)
   - Vano Motor
   - Libreta de Propiedad / Documentos
   - Fotos extras de detalles específicos (rayones, repintados)
2. **Motor de Compresión en el Navegador (Canvas):** Reduce automáticamente imágenes de 10 MB a ~150 KB en microsegundos sin perder nitidez de lectura en kilometraje o detalles de chapa.
3. **Web Share API nativa:** Permite con 1 toque en iPhone (Safari) o Android (Chrome) abrir el selector nativo y enviar el pack completo de fotos al chat de Jonathan.
4. **Modo Offline:** Si se corta la señal en el subsuelo o fondo del patio, la app sigue funcionando al 100% y permite guardar el peritaje en el almacenamiento local.

---

## 2.6 Eje de Archivo, Auditoría e Impresión

1. **Historial de Patio (Base de Datos Local):**
   - Cada peritaje realizado queda archivado en el teléfono o computadora con fecha, hora, tasador responsable, vehículo y oferta realizada.
   - Si el cliente se fue a recorrer otras automotoras y vuelve 10 días después diciendo *"Ustedes me ofrecían 11 mil"*, el tasador abre el **Historial (📁)** y comprueba: *"No Carlos, acá tenemos registrado que el 11 de septiembre peritamos tu Gol y la oferta en mano fue de USD 10.200 con el paragolpes a pintar"*.
2. **Ficha Oficial Imprimible / Exportable a PDF:**
   - Con el atajo de impresión (`Ctrl + P` o botón *Exportar/Imprimir*), la app genera automáticamente una **Ficha Técnica Oficial CARVLAK** formateada en blanco y negro de alta calidad, con membrete, detalle de daños, desglose de números y línea de firma para inspector y dirección.

---

# PARTE 3: PLAN DE ACCIÓN Y ADOPCIÓN EN LA AUTOMOTORA

Para maximizar el provecho del sistema desde el primer día:

1. **Instalación en los Teléfonos del Equipo (2 minutos):**
   - Maximiliano, Marcos y Bruno agregan la app a la pantalla de inicio de sus iPhones/Androids mediante el link oficial.
   - Queda fijada como ícono de app nativa con acceso directo.
2. **Ajuste de Parámetros en Configuración (⚙️):**
   - Teléfono de Jonathan guardado por defecto: `+598 99 267 964`.
   - Costo promedio de pintura por panel acordado con el taller de chapa de confianza (ej. USD $90 - $100).
   - Margen mínimo estándar de reventa de la empresa (ej. USD $1.500).
3. **Regla Operativa de Patio:**
   - **"Auto que entra a tasarse, auto que se perita con la app"**.
   - No se pasan números verbales a la dirección sin el mensaje consolidado de la aplicación.

---

# PARTE 4: CONCLUSIÓN

La implementación de **CARVLAK | Tasación & Peritaje en Vivo** no es solamente una mejora tecnológica; es un **estándar de calidad y profesionalismo** que:
- **Protege el tiempo de Jonathan**, transformándolo de un receptor de dudas a un tomador de decisiones instantáneo.
- **Empodera al equipo comercial**, dándoles una herramienta sólida para revisar y fundamentar precios frente a los clientes.
- **Blinda la rentabilidad de la automotora**, erradicando sorpresas de taller, vicios ocultos y compras mal costeadas.
- **Posiciona a CARVLAK como una automotora moderna, ágil y confiable**, capaz de cerrar compras al contado o permutas en tiempo récord.
