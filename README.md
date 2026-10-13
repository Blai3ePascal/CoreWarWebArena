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

## Motor

Ambos puntos de carga se sortean independientemente mediante una distribución válida de distancias circulares. Se evita el solapamiento, incluso al envolver el límite del núcleo. Una semilla reproduce posiciones, turno inicial y resultado. El primer turno se sortea o se puede elegir.

El ensamblador admite etiquetas (sin distinguir mayúsculas), expresiones enteras, EQU, ORG, END, FOR/ROF, PIN y condiciones `;assert` sobre las constantes del núcleo. Admite comparación y lógica entera en expresiones. Rechaza símbolos desconocidos, divisiones por cero, programas vacíos, configuraciones inválidas y expansiones excesivas. No ejecuta expresiones como JavaScript.

El motor dispone de las instrucciones DAT, MOV, ADD, SUB, MUL, DIV, MOD, JMP, JMZ, JMN, DJN, SEQ/CMP, SNE, SLT, SPL, NOP, LDP y STP; ocho modos de direccionamiento y siete modificadores. El contador mostrado mide instrucciones ejecutadas por ambos guerreros, etiquetadas como **turnos**. Por defecto, una victoria exige que el rival pierda todos sus procesos. Al alcanzar el límite con ambos vivos, se puede elegir empate clásico, más celdas escritas o más procesos vivos; estas dos últimas son variantes opcionales.

P-space: los PIN iguales comparten posiciones distintas de cero; la posición cero mantiene el resultado de cada guerrero de forma independiente. Cada partida y cada ronda de torneo comienza con P-space nuevo. No se afirma compatibilidad completa con todas las extensiones del ensamblador pMARS.

Los torneos se ejecutan en un Web Worker. Detenerlo descarta los resultados parciales. La admisión se verifica de nuevo dentro del Worker antes de ejecutar partidas.

El suizo agrupa por puntuación y busca mediante retroceso un emparejamiento completo sin repetir rivales. Si no existe, permite revanchas y las indica. Para campos impares, prioriza a quienes han recibido menos descansos y después a quienes tienen menos puntos. El emparejamiento aleatorio también evita repeticiones cuando es posible. Las jornadas se limitan al número de rivales disponibles (n−1 para n par; n para n impar) y se ajustan cuando se reduce el campo.

Buchholz suma los puntos actuales de los rivales enfrentados; Sonneborn–Berger suma los puntos de rivales vencidos y la mitad de los rivales empatados. Los descansos no cuentan como partidas jugadas ni como rivales para estos desempates. Los nombres ordenan la presentación cuando persiste una igualdad deportiva; no conceden el título. En eliminatoria, los empates pueden generar pares extra, hasta el máximo elegido, y finalmente un sorteo reproducible.

Los avisos de resultados no interrumpen el cálculo del torneo. Se conservan hasta 128 avisos pendientes, priorizando los más recientes si se supera ese número; «Cerrar anuncios» descarta la cola. El resultado final queda en la clasificación aunque se desactiven los avisos.

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

La batería actual contiene 175 pruebas. Los torneos cargan `worker.js`, `engine.js` y `competition.js` desde cero en un contexto sin `window` ni `module`; ningún test les proporciona un motor precargado. Se incluyen 84 combinaciones de formatos, número de participantes y reglas de empate, y 17 arranques de hilos separados para comprobar aislamiento, concurrencia y cancelación. Los hilos Node ejecutan un adaptador de `importScripts`; no equivalen a una revisión de navegador. Una prueba negativa reproduce el fallo con la exportación anterior.

Las pruebas cubren el motor, generación diaria, admisión de archivos, reglas, sistemas de emparejamiento, descansos, clasificación, cookies de sesión, anuncios, geometría cuadrada, ejecución del Worker y flujos de interacción con un arnés DOM. El arnés no comprueba disposición visual, lectores de pantalla ni compatibilidad real de todos los navegadores. No se realizó una revisión visual en navegador durante esta entrega.

## Publicación

GitHub Pages sirve la raíz de `main`, conservando la dirección del proyecto original. `.nojekyll` permite servir directamente los archivos. No se necesitan secretos, servicios externos, CDN ni un servidor de usuarios.

## Referencias

- [ICWS ’94](https://corewars.org/docs/94spec.html), referencia de operandos y ejecución.
- [pMARS](https://github.com/akosela/pmars), consulta de semántica de instrucciones.
- [lichess](https://github.com/lichess-org/lila), referencia de organización del aprendizaje, puzles y competición; esta interfaz se ha implementado específicamente para OGUN, sin incorporar código ni recursos gráficos de lichess.

Los guerreros históricos conservados mantienen el texto de su autoría en Redcode. La nueva presentación acredita a Sara y Pascal.
