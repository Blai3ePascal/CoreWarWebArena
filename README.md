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
- Ligas de todos contra todos y eliminatorias, de 2 a 12 guerreros; 2, 4, 8 o 16 rondas por duelo. Cada par comparte posiciones y alterna quién empieza. Resultados, rondas reproducibles y exportación.
- Tres temas, colores de guerreros, texto de 16 a 22 px, contraste y reducción de animaciones.
- Sin cuentas. Datos locales y copias JSON para trasladar progreso entre navegadores.

## Motor

Ambos puntos de carga se sortean independientemente mediante una distribución válida de distancias circulares. Se evita el solapamiento, incluso al envolver el límite del núcleo. Una semilla reproduce posiciones, turno inicial y resultado. El primer turno se sortea o se puede elegir.

El ensamblador admite etiquetas (sin distinguir mayúsculas), expresiones enteras, EQU, ORG, END, FOR/ROF y PIN. Rechaza símbolos desconocidos, divisiones por cero, programas vacíos, configuraciones inválidas y expansiones excesivas. No ejecuta expresiones como JavaScript.

El motor dispone de las instrucciones DAT, MOV, ADD, SUB, MUL, DIV, MOD, JMP, JMZ, JMN, DJN, SEQ/CMP, SNE, SLT, SPL, NOP, LDP y STP; ocho modos de direccionamiento y siete modificadores. El contador mostrado mide instrucciones ejecutadas por ambos guerreros, etiquetadas como **turnos**. Una victoria exige que el rival pierda todos sus procesos; ocupar más memoria no rompe empates.

P-space: los PIN iguales comparten posiciones distintas de cero; la posición cero mantiene el resultado de cada guerrero de forma independiente. Cada partida y cada ronda de torneo comienza con P-space nuevo. No se afirma compatibilidad completa con todas las extensiones del ensamblador pMARS.

Los torneos se ejecutan en un Web Worker. Detenerlo descarta los resultados parciales. En eliminatorias empatadas, el avance se decide por sorteo reproducible con la semilla, indicado en el enfrentamiento. En ligas se ordena por puntos, victorias y nombre para presentar empates en puntos.

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

Las pruebas cubren el motor, generación diaria, biblioteca, ejecución del Worker y flujos de interacción con un arnés DOM. El arnés no comprueba disposición visual, lectores de pantalla ni compatibilidad real de todos los navegadores. No se realizó una revisión visual en navegador durante esta entrega.

## Publicación

GitHub Pages sirve la raíz de `main`, conservando la dirección del proyecto original. `.nojekyll` permite servir directamente los archivos. No se necesitan secretos, servicios externos, CDN ni un servidor de usuarios.

## Referencias

- [ICWS ’94](https://corewars.org/docs/94spec.html), referencia de operandos y ejecución.
- [pMARS](https://github.com/akosela/pmars), consulta de semántica de instrucciones.
- [lichess](https://github.com/lichess-org/lila), referencia de organización del aprendizaje, puzles y competición; esta interfaz se ha implementado específicamente para OGUN, sin incorporar código ni recursos gráficos de lichess.

Los guerreros históricos conservados mantienen el texto de su autoría en Redcode. La nueva presentación acredita a Sara y Pascal.
