# OGUN

**Operaciones de Guerreros en un Núcleo**. Plataforma de Core War en castellano, creada por **Sara y Pascal**.

## Jugar

https://blai3epascal.github.io/CoreWarWebArena/

- Portada con una batalla animada y un puzle diario interactivo.
- Tres retos por fecha de Madrid, archivo por fecha y entrenamiento ilimitado. Cinco familias de ejercicios con parámetros generados mediante semillas; se verifica el objetivo ejecutando Redcode.
- Nueve lecciones con ejercicios y una referencia de instrucciones, modificadores y direccionamiento.
- Arena con dos editores, importación y exportación `.red`, validación, velocidades, pausa, avance por turnos, inspector numérico y visual, historial y repetición.
- Doce guerreros, incluidos los cuatro guerreros avanzados conservados del proyecto original. Biblioteca personal y búsqueda.
- Partidas exportables como JSON y compartibles mediante un enlace con código, reglas y semilla.
- Torneos de 2 a 32 guerreros subidos como `.red` o `.rc`, con selección múltiple y arrastre de archivos. Se valida cada guerrero contra las reglas y se explica cada rechazo. También se pueden incluir guerreros de la biblioteca.
- Suizo, liga, eliminatoria y emparejamientos aleatorios por jornadas. Partidas por duelo, jornadas, núcleo, límite de ejecución, procesos, longitud, distancia, P-space e instrucciones prohibidas configurables.
- Puntuación por duelo configurable, descansos para campos impares, Buchholz, Sonneborn–Berger, número de victorias o igualdad en puntos. Eliminatorias con pares extra y sorteo reproducible como último desempate.
- Cada par de partidas comparte posiciones y alterna quién comienza. Resultados y reproducción exacta de cada partida, incluidos los desempates opcionales al límite.
- Núcleo cuadrado por defecto, con celdas cuadradas, redondeadas o circulares; alternativa panorámica, tamaño, separación, color de memoria, estelas y actualización en directo configurables.
- Anuncio central de victoria con el nombre del guerrero o de empate. Controles independientes para arena y torneo: estilo, duración (0 = cierre manual), tamaño, colores, oscuridad del fondo, brillo, intensidad y partículas. En torneos se puede mostrar el final, cada duelo o cada partida.
- Fondo de retícula u órbitas con intensidad y velocidad ajustables, apagado independiente y opción para detener todo el movimiento. Tres temas, texto de 16 a 22 px, contraste y reducción de animaciones.
- Sin cuentas. Preferencias visuales y reglas en **cookies de sesión**, sin Expires ni Max-Age, con SameSite=Lax y Secure sobre HTTPS; los archivos del torneo en sessionStorage de la pestaña. Guerreros guardados, progreso e historial en localStorage. Las copias JSON incluyen las preferencias vigentes.

## La forja de guerreros · 1.3.0

Disponible en [Taller](https://blai3epascal.github.io/CoreWarWebArena/#workshop). No necesita cuentas ni servicios externos.

- Bloques conectables con catálogo por categorías y búsqueda, arrastre, botones para mover, duplicar y eliminar, deshacer y rehacer. Los segmentos FOR/ROF se mueven, duplican o eliminan completos.
- Todas las instrucciones implementadas: DAT, MOV, ADD, SUB, MUL, DIV, MOD, JMP, JMZ, JMN, DJN, CMP/SEQ, SNE, SLT, SPL, NOP, LDP y STP. Los ocho direccionamientos, los siete modificadores y su selección automática están disponibles.
- Etiquetas, expresiones, EQU, ORG, END, FOR/ROF anidados, PIN, `;assert`, nombre, autoría, estrategia, versión y comentarios. Pulsar el título o ? abre una explicación con el significado concreto de los modos y modificadores del bloque. Incluye las particularidades de LDP/STP del motor.
- Bloques y código son dos vistas del mismo Redcode. Las líneas no modificadas conservan su texto; las líneas no reconocidas permanecen como bloques de texto editables, incluidas las que contienen errores. No se descarta código al convertir. Se puede importar y descargar incluso un borrador inválido para recuperarlo después.
- Ensayo aislado, sin un rival oculto: el programa se carga en @0, y ORG/END determinan su primera instrucción. Memoria de 8.000 celdas con ventana cuadrada de 64 celdas, seguimiento de procesos, origen/destino, inspector de cualquier dirección, programa compilado y últimos pasos. La memoria muestra lo que ejecuta el motor, incluida la automodificación. La animación puede desactivarse, respeta reducción de movimiento y pausa cada 64 pasos; hay reproducción, paso a paso y reinicio.
- El editor de la arena incluye el mismo laboratorio y permite elegir A o B. Se puede llevar el código de la arena al taller o enviar el guerrero del taller a A con las reglas de la forja.
- El borrador se guarda en localStorage y en la copia general JSON. Vista, seguimiento y cálculo/animación automáticos se conservan en cookies de sesión. Guardar incorpora el guerrero a la biblioteca; `.red` permite trasladarlo.

### Puntuación OGUN-1

Un Worker independiente ensaya la supervivencia sin rival durante hasta 20.000 pasos propios y ejecuta **10 combates contra cada uno de los 12 guerreros originales**: 120 combates, cinco pares por rival con las mismas posiciones reproducibles y turnos iniciales alternos. La carga se sortea; no se usa la posición fija del ensayo. Los combates tienen núcleo 8.000, límite 20.000 turnos totales, 256 procesos, longitud máxima 300, distancia mínima 100 y P-space 512. El límite conserva el empate. Cada combate reinicia la memoria y P-space.

La nota es `round(1000 × (victorias + empates / 2) / combates)`, entre 0 y 1.000. Los rangos son Chispa de la forja (0–249), Aprendiz de guerra (250–399), Guardián de la forja (400–549), Conquistador de hierro (550–699), Señor del núcleo (700–849) y Avatar de Ogún (850–1.000), acompañados de una valoración en lenguaje corriente. Es rendimiento frente a esta batería, no Elo ni una garantía de victoria universal. Los guerreros personales compatibles también reciben diez combates, con sus resultados por separado; no cambian la nota de referencia. Los incompatibles se enumeran con el motivo.

«Se autodestruye» significa que han desaparecido **todos** sus procesos en el ensayo sin rival. No se deduce de perder un combate ni de la muerte de un solo proceso. «Sobrevive» se limita al intervalo observado. El código y los bloques usan exactamente el mismo evaluador. Al editar se invalidan las notas anteriores, se termina el Worker activo y se espera una pausa de 900 ms antes del siguiente cálculo. Se puede detener o desactivar el cálculo automático. Las revisiones de cada petición impiden mostrar resultados antiguos tras una edición, cancelación o cambio de página.

`blocks.js` contiene el modelo de bloques, `rating.js` el protocolo de evaluación, `rating-worker.js` su entrada independiente y `workshop.js` el taller y laboratorio compartido. `trace:false` omite el historial y las marcas visuales en los combates de evaluación; las pruebas comprueban que conserva memoria, colas, P-space y resultados. El ensayo reutiliza las mismas operaciones del motor y no introduce una implementación alternativa de las instrucciones.

## Puzles y banco de la forja · 1.4.0

El generador diario anterior tenía cinco familias con un espacio pequeño de parámetros; un ejercicio tenía siempre la misma respuesta. Se conserva para los ejercicios de las lecciones y el entrenamiento antiguo. Los tres retos diarios usan ahora **doce mecánicas**: copia de campos, suma, resta, multiplicación modular, bombardeo directo, salto a un refugio, dos procesos, comparación, direccionamiento indirecto, DJN, P-space y campos cruzados.

Cada fecha válida entre los años 0001 y 9999 y cada uno de sus tres turnos diarios se asigna a una coordenada diferente mediante una permutación entera inyectiva. Sus dos componentes participan en la construcción del programa o en su objetivo: no es simplemente un identificador diferente sobre un ejercicio idéntico. Se generan la disposición, los operandos, el objetivo, la respuesta recomendada, la pista y su explicación. El generador ejecuta esa respuesta en el motor antes de admitir el reto. Se comprueba el estado resultante, no solo la coincidencia con un número guardado; las respuestas alternativas que cumplen el objetivo también son válidas. La fecha depende de Europe/Madrid, con cambio automático a medianoche y reproducción estable al volver al archivo. Los identificadores v2 evitan mezclar soluciones antiguas con los nuevos problemas.

### Cincuenta guerreros nuevos

La biblioteca conserva los doce originales y añade **50 guerreros de la forja** con nombres épicos en minúsculas y autoría asignada de forma pseudoaleatoria y estable a Pascal o Sara. Cada instrucción y directiva tiene un comentario en castellano. Hay replicadores iniciales, centinelas, bombarderos acotados, barridos, escáneres, bombarderos rápidos, memoria privada, estrategias con dos procesos y replicadores de asalto. Estos últimos adaptan el patrón de copia del sabio oscuro, cambian su fase de traslado y añaden ataques; su descripción reconoce esa relación.

Los 50 han ejecutado 500.000 pasos propios en ensayos sin rival, con núcleos de 800 y 8.000 celdas y un máximo de 256 procesos. Ninguno perdió todos sus procesos. También se prueban con los valores predeterminados del motor y su límite mayor de procesos. Esto describe el intervalo y las reglas comprobadas, no una prueba de supervivencia infinita bajo cualquier configuración. Algunas estrategias exigen que el tamaño del núcleo sea divisible por su salto; esas condiciones están en `;assert`. Cuatro requieren permitir P-space en los torneos.

Cada guerrero tiene 20 partidas medidas contra el sabio oscuro, en diez pares con posiciones comunes y primer turno alterno, con las reglas de combate OGUN-2. Las tarjetas muestran victorias, empates y derrotas reales. Hay victorias verificadas en el banco; por ejemplo, «nexo del apocalipsis» obtuvo 1 victoria, 19 empates y 0 derrotas en esta batería. No se afirma que un guerrero venza siempre a ese rival. El filtro «Con victorias ante el sabio» facilita encontrar los resultados positivos.

Los fuentes `.red` están en `warriors/forja/`. `warriors/forja-validation.json` contiene parámetros, posiciones, semillas, turnos y resultados de las 1.000 partidas, además de los ensayos y los hashes SHA-256 de sus fuentes. Las pruebas reproducen las victorias con el motor. `node scripts/generate-bank.cjs --verify` reconstruye el banco y vuelve a ejecutar sus verificaciones; se conserva la autoría asignada por la semilla. El fichero data.js incluye la colección para que la página y los Workers compartan exactamente el mismo banco, sin descargas adicionales durante una evaluación.

### Biblioteca, evaluación y torneos grandes

La biblioteca se pagina en grupos de doce y filtra por nombre, estrategia, nivel, colección y autoría. Cada guerrero puede descargarse como `.red`, cargarse en A/B o abrirse directamente en bloques. Los comentarios se conservan al convertirlo.

La evaluación compartida de código y bloques pasa a **OGUN-2**, con 10 partidas contra cada uno de los 62 guerreros incluidos: **620 combates**. La fórmula y las reglas de combate permanecen; cambia la batería y, por tanto, su versión. Las notas OGUN-1 no deben compararse directamente con OGUN-2. Los rivales personales siguen recibiendo diez combates separados sin alterar esa nota.

Los seis formatos de torneo admiten de 2 a 64 participantes. Los cuadros y las tablas se desplazan dentro de regiones delimitadas, y se pueden buscar participantes o añadir el banco compatible de una vez. La selección de biblioteca se conserva durante la sesión. Las pruebas completan torneos con los cincuenta guerreros en todos los formatos, incluida una liga de 1.225 duelos, y comprueban un cuadro completo de 64. La recuperación admite el número de resultados de esas ligas.

### Anuncios con confirmación

Por defecto, el cartel de victoria, empate o final de torneo espera a **Continuar**. No lo cierran el tiempo, Escape ni el fondo, y la emisión del torneo se detiene mientras está abierto. En Personalización puede desactivarse esa espera y usarse cierre automático o duración cero. Las preferencias antiguas que no tenían esta opción adoptan la espera manual.

Se añaden Nova del núcleo, Forja de acero y Corona de victoria a los efectos existentes, con ritmo, intensidad, partículas, brillo, tamaño, fondo y colores configurables. La reducción de movimiento conserva una presentación estática. Todos estos ajustes se guardan en las cookies de sesión.

La batería de la versión 1.4.0 contiene 621 pruebas. Se comprueban las soluciones y la no repetición del programa/objetivo durante un año completo, fechas inválidas y cambios horarios de Madrid, código y bloques de los cincuenta guerreros, supervivencia, reproducción de las victorias, los seis formatos grandes, recuperación, la evaluación de 620 combates en un hilo separado y el bloqueo de la emisión hasta confirmar un resultado. Los flujos de interfaz se prueban con el arnés DOM: no constituyen revisión visual de navegador. Este entorno no dispone del control de navegador necesario para esa revisión.

## Motor

Ambos puntos de carga se sortean independientemente mediante una distribución válida de distancias circulares. Se evita el solapamiento, incluso al envolver el límite del núcleo. Una semilla reproduce posiciones, turno inicial y resultado. El primer turno se sortea o se puede elegir.

El ensamblador admite etiquetas (sin distinguir mayúsculas), expresiones enteras, EQU, ORG, END, FOR/ROF, PIN y condiciones `;assert` sobre las constantes del núcleo. Admite comparación y lógica entera en expresiones. Rechaza símbolos desconocidos, divisiones por cero, programas vacíos, configuraciones inválidas y expansiones excesivas. No ejecuta expresiones como JavaScript.

El motor dispone de las instrucciones DAT, MOV, ADD, SUB, MUL, DIV, MOD, JMP, JMZ, JMN, DJN, SEQ/CMP, SNE, SLT, SPL, NOP, LDP y STP; ocho modos de direccionamiento y siete modificadores. El contador mostrado mide instrucciones ejecutadas por ambos guerreros, etiquetadas como **turnos**. Por defecto, una victoria exige que el rival pierda todos sus procesos. Al alcanzar el límite con ambos vivos, se puede elegir empate clásico, más celdas escritas o más procesos vivos; estas dos últimas son variantes opcionales.

P-space: los PIN iguales comparten posiciones distintas de cero; la posición cero mantiene el resultado de cada guerrero de forma independiente. Cada partida y cada ronda de torneo comienza con P-space nuevo. No se afirma compatibilidad completa con todas las extensiones del ensamblador pMARS.

Los torneos se ejecutan en un Web Worker. Detenerlo descarta los resultados parciales. La admisión se verifica de nuevo dentro del Worker antes de ejecutar partidas.

El suizo agrupa por puntuación y busca mediante retroceso un emparejamiento completo sin repetir rivales. Si no existe, permite revanchas y las indica. Para campos impares, prioriza a quienes han recibido menos descansos y después a quienes tienen menos puntos. El emparejamiento aleatorio también evita repeticiones cuando es posible. Las jornadas se limitan al número de rivales disponibles (n−1 para n par; n para n impar) y se ajustan cuando se reduce el campo.

Buchholz suma los puntos actuales de los rivales enfrentados; Sonneborn–Berger suma los puntos de rivales vencidos y la mitad de los rivales empatados. Los descansos no cuentan como partidas jugadas ni como rivales para estos desempates. Los nombres ordenan la presentación cuando persiste una igualdad deportiva; no conceden el título. En eliminatoria, los empates pueden generar pares extra, hasta el máximo elegido, y finalmente un sorteo reproducible.

Los avisos de resultados no interrumpen el cálculo del torneo. Se conservan hasta 128 avisos pendientes, priorizando los más recientes si se supera ese número; «Cerrar anuncios» descarta la cola. El resultado final queda en la clasificación aunque se desactiven los avisos.

## Torneo en directo · 1.2.0

1. Subir los `.red`, seleccionar participantes y configurar las reglas y el formato.
2. Elegir cuántos pasan a la fase final si hay una liguilla, suizo o jornadas aleatorias. «Sin fase final» termina por puntos.
3. Pulsar **Validar y dibujar el cuadro**. No se resuelve ninguna partida al prepararlo; los huecos BYE sí se propagan automáticamente.
4. Pulsar **Comenzar espectáculo**, o elegir el botón de un cruce listo. La cuenta atrás, escenario, color, velocidad, anuncios, pausa entre duelos y avance automático son configurables dentro de Torneos. La memoria muestra la ejecución real, no una animación grabada.
5. **Pausar** para intervenir desde Control del organizador. Se pueden corregir marcadores, decidir quién avanza en un empate manual, cambiar nombres, ajustar puntos con un motivo y deshacer cambios. Un resultado anterior corregido invalida únicamente los cruces cuyo emparejamiento deja de ser válido. El registro conserva el motivo y los resultados sustituidos.

Formatos disponibles en directo:

- Eliminatoria con un cuadro de potencia de dos, BYE distribuidos entre los mejores puestos iniciales y avance automático.
- Doble eliminación con cuadro de ganadores, cuadro de recuperación y gran final. Si vence el finalista de recuperación, se juega una final definitiva: para quedar eliminado hay que perder dos duelos.
- Grupos de cuatro con apertura, duelo de ganadores, recuperación y duelo decisivo; avanzan hasta dos por grupo a la fase final.
- Liguilla, suizo y emparejamientos aleatorios con puntuación configurable y fase final opcional de 2, 4, 8, 16 o 32 clasificados. Si faltan participantes para cubrir el cuadro elegido, se usa el número disponible y se resuelven los BYE. En empates que afectan a la clasificación, se aplica el desempate deportivo elegido y, si persiste, un sorteo reproducible con la semilla del torneo.

Siempre se muestran clasificación e historial. En las competiciones con fase previa, la tabla de puntos de esa fase permanece visible durante las eliminatorias. Los BYE de liguilla tienen los puntos configurados; los BYE de eliminatoria conceden un pase, sin fingir una partida jugada. El modo proyector ocupa la pantalla completa cuando el navegador lo permite, mantiene los anuncios visibles y ofrece una alternativa dentro de la página.

El director guarda el torneo completo en `ogun_live_v1`, con una copia anterior cuando hay espacio. **Guardar torneo JSON** permite descargar el estado en cualquier momento; **Cargar torneo JSON** lo valida y recupera en pausa. La exportación general también incluye el torneo abierto. Se conservan las partidas terminadas del duelo en curso; una partida interrumpida se repite desde su inicio con la misma semilla y posiciones. Las reglas de combate quedan ligadas al cuadro preparado. Los ajustes del formulario corresponden al siguiente cuadro.

El estado y el cuadro se calculan en `live-tournament.js`. La emisión usa el mismo motor que la arena y avanza en lotes acotados entre fotogramas; el Worker de cálculo completo se conserva para compatibilidad y pruebas. La persistencia en el navegador no sincroniza organizadores en equipos distintos: el traslado se realiza mediante JSON.

## Ejecutar y comprobar

La aplicación no necesita dependencias ni compilación. Servir la carpeta con un servidor HTTP estático; los torneos requieren HTTP/HTTPS para cargar el Worker.

```sh
python3 -m http.server 8000
```

Con Node 22 o posterior:

```sh
npm run check
npm test
```

La versión 1.1.1 corrige la exportación del motor: se expone en `globalThis`, disponible tanto en la página como en un Worker. La exportación anterior dependía de `window`, que no existe en Workers.

La batería de la versión 1.1.1 contenía 175 pruebas. La versión 1.2.0 añade la progresión de cuadros y los controles de emisión, para un total de 281 pruebas. La versión 1.3.0 amplía la batería a 495 pruebas, con cobertura del catálogo completo, conversión sin pérdida, FOR anidados, ensayo sin rival, semántica sin trazas, fórmula de puntuación, emparejamiento de las diez partidas, rivales personales, revisión/cancelación y los flujos del taller. El Worker de puntuación también se carga desde cero y se comprueban sus 120 combates reales en un hilo separado. Los torneos cargan `worker.js`, `engine.js` y `competition.js` desde cero en un contexto sin `window` ni `module`; ningún test les proporciona un motor precargado. Se incluyen 84 combinaciones de formatos, número de participantes y reglas de empate, y 17 arranques de hilos separados para comprobar aislamiento, concurrencia y cancelación. Los hilos Node ejecutan un adaptador de `importScripts`; no equivalen a una revisión de navegador. Una prueba negativa reproduce el fallo con la exportación anterior.

Las pruebas cubren el motor, generación diaria, admisión de archivos, reglas, sistemas de emparejamiento, descansos, clasificación, cookies de sesión, anuncios, geometría cuadrada, ejecución del Worker y flujos de interacción con un arnés DOM. El arnés no comprueba disposición visual, lectores de pantalla ni compatibilidad real de todos los navegadores. No se realizó una revisión visual en navegador durante esta entrega.

## Publicación

GitHub Pages sirve la raíz de `main`, conservando la dirección del proyecto original. `.nojekyll` permite servir directamente los archivos. No se necesitan secretos, servicios externos, CDN ni un servidor de usuarios.

## Referencias

- [ICWS ’94](https://corewars.org/docs/94spec.html), referencia de operandos y ejecución.
- [pMARS](https://github.com/akosela/pmars), consulta de semántica de instrucciones.
- [lichess](https://github.com/lichess-org/lila), referencia de organización del aprendizaje, puzles y competición; esta interfaz se ha implementado específicamente para OGUN, sin incorporar código ni recursos gráficos de lichess.

Los guerreros históricos conservados mantienen el texto de su autoría en Redcode. La nueva presentación acredita a Sara y Pascal.
