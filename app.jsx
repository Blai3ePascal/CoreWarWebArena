
const { useEffect, useMemo, useRef, useState } = React;
const Engine = window.CoreWarEngine;
const PRESETS = {
  impVsDwarf: { label: "Imp comentado vs Dwarf comentado", a: `;redcode-94
;name Imp básico comentado
;author Entrenamiento Web
;strategy Recorre el núcleo copiándose una celda adelante.
ORG inicio                  ; El punto de entrada será la etiqueta inicio.
inicio  MOV.I 0, 1          ; Copia esta misma instrucción una celda hacia delante.
END inicio                  ; Indica al ensamblador dónde empieza la ejecución.
`, b: `;redcode-94
;name Dwarf básico comentado
;author Entrenamiento Web
;strategy Bombardero pequeño que va dejando DAT por el núcleo.
ORG loop                    ; Empezamos en el bucle del bombardero.
loop    ADD.AB #4, puntero  ; Avanza el puntero de bombardeo de cuatro en cuatro.
        MOV.I bomba, @puntero ; Copia la bomba en la dirección apuntada por puntero.
        JMP loop            ; Repite el ataque una y otra vez.
puntero DAT.F #0, #20       ; Guarda el desplazamiento actual usado por el bombardeo.
bomba   DAT.F #0, #0        ; La bomba mortal: si un proceso la ejecuta, muere.
END loop                    ; Fija el punto de entrada en loop.
` },
  silkVsStone: { label: "Silk mini vs Stone mini", a: `;redcode-94
;name Silk mini
;author Entrenamiento Web
;strategy Pequeño replicador que se extiende usando SPL y MOV.
ORG inicio                  ; Empezamos en la primera copia.
inicio  SPL 1, <200         ; Crea un proceso extra para acelerar la expansión.
        MOV.I }-1, >-1      ; Copia instrucciones desde detrás hacia delante.
        JMP inicio          ; Repite para seguir replicándose.
END inicio                  ; Entrada del guerrero.
`, b: `;redcode-94
;name Stone mini
;author Entrenamiento Web
;strategy Stone compacto que bombardea con un paso fijo.
paso    EQU 97              ; Distancia entre impactos consecutivos.
ORG ciclo                   ; La ejecución comienza en ciclo.
puntero DAT.F #0, #100      ; Acumula el desplazamiento del siguiente disparo.
ciclo   MOV.I bomba, @puntero ; Deposita la bomba en el objetivo indirecto.
        ADD.AB #paso, puntero ; Mueve el puntero para el próximo disparo.
        JMP ciclo           ; Repite sin parar.
bomba   DAT.F #0, #0        ; Bomba letal estándar.
END ciclo                   ; Punto de entrada.
` },
  scannerVsImp: { label: "Scanner mini vs Imp ring", a: `;redcode-94
;name Scanner mini
;author Entrenamiento Web
;strategy Busca actividad y, si la detecta, deja una bomba.
paso    EQU 24              ; Distancia entre sondeos.
ORG scan                    ; Arrancamos en la rutina de escaneo.
scan    SEQ.I paso, paso+6  ; Compara dos celdas separadas para detectar cambios.
        JMP golpe           ; Si parecen iguales, salta a la rutina de golpeo.
        ADD.AB #paso, scan  ; Desplaza la ventana de escaneo.
        JMP scan            ; Vuelve a comprobar.
golpe   MOV.I bomba, @scan  ; Escribe una bomba donde cree haber encontrado al rival.
        JMP scan            ; Retoma la búsqueda.
bomba   DAT.F #0, #0        ; Bomba usada por el scanner.
END scan                    ; Fin del guerrero.
`, b: `;redcode-94
;name Imp ring 2667
;author Entrenamiento Web
;strategy Imp clásico con salto de anillo para repartir copias.
paso    EQU 2667            ; Salto clásico que reparte bien el anillo de 8000 celdas.
ORG inicio                  ; Comenzamos en la rutina principal.
inicio  MOV.I 0, paso       ; Copiamos la instrucción completa a 2667 celdas.
END inicio                  ; Fin del programa.
` },
  forLoopDemo: { label: "FOR/ROF demo", a: `;redcode-94
;name Demo FOR ROF
;author Entrenamiento Web
;strategy Ejemplo sencillo que además prueba el preprocesador.
paso    EQU 10              ; Distancia entre impactos.
ORG inicio                  ; Punto de entrada.
inicio  MOV.I bomba, @puntero ; Deja una bomba en la dirección apuntada.
        ADD.AB #paso, puntero ; Avanza el puntero del bombardeo.
        JMP inicio          ; Repite el bucle principal.
bomba   DAT.F #0, #0        ; Bomba base.
FOR 3                       ; Inserta tres celdas de relleno.
        DAT.F #0, #0        ; Relleno generado por el FOR.
ROF                         ; Fin del bloque repetido.
puntero DAT.F #0, #50       ; Puntero usado por el MOV indirecto.
END inicio                  ; Fin del programa.
`, b: `;redcode-94
;name EQU y etiquetas
;author Entrenamiento Web
;strategy Pequeño guerrero didáctico con constantes y etiquetas.
paso    EQU 17              ; Constante reutilizable del programa.
arranque EQU inicio         ; Alias simbólico de la etiqueta principal.
ORG arranque                ; Se puede arrancar usando la constante.
puntero DAT.F #0, #45       ; Base del bombardeo.
inicio  MOV.I bomba, @puntero ; Escribe la bomba en el objetivo indirecto.
        ADD.AB #paso, puntero ; Cambia la zona atacada.
        JMP inicio          ; Sigue en bucle.
bomba   DAT.F #0, #0        ; Bomba mortal.
END arranque                ; Cierre usando el alias.
` },
  daredevilVsMotherland: { label: "DAREDEVIL vs MOTHERLAND", a: `;redcode-94b
;assert 1
;name DAREDEVIL
;strategy Intenta poblar el núcleo con imps y jugar a tablas o desgaste.
ORG main                    ; El programa arranca en la etiqueta main.
dare    DAT #0, #5          ; Referencia usada por el SEQ para comparar patrones.
cero    DAT #0, #0          ; Celda auxiliar que va cambiando con el tiempo.
counter DAT #0, #500        ; Puntero indirecto desde el que se van lanzando copias.
imp     MOV 0, 1            ; Imp mínimo que se copia una celda hacia delante.
main    MOV imp, @counter   ; Escribe un imp en la posición apuntada por counter.
        SPL @counter-1      ; Lanza un nuevo proceso cerca de la copia recién hecha.
        ADD #800, counter   ; Desplaza el puntero para repartir las copias.
        ADD #1, cero        ; Modifica la celda auxiliar para la comparación.
        SEQ @dare, @cero    ; Compara dos referencias indirectas para decidir el flujo.
        JMP main            ; Vuelve al inicio del ciclo principal.
END main                    ; Entrada declarada del guerrero.
`, b: `;redcode-94b
;assert 1
;name MOTHERLAND
;strategy Bombardero compacto que recorre el núcleo con un paso fijo.
ORG loop                    ; El programa empieza en loop.
bomb    DAT #0, #12         ; La bomba también guarda el paso inicial del puntero.
loop    ADD #121, bomb      ; Incrementa el campo que actúa como puntero de ataque.
        MOV bomb, @bomb     ; Copia la bomba en la dirección apuntada por ella misma.
        JMP loop            ; Repite el bombardeo continuamente.
END loop                    ; Punto de entrada.
` },
  magoVsSabio: { label: "MAGO DEL TIEMPO R vs EL SABIO OSCURO", a: `;redcode
;name MAGO DEL TIEMPO R
;strategy Stone extraño con auto-modificación y bomba desplazada.
gate    EQU -10             ; Desplazamiento base usado como referencia de puerta.
step    EQU 1252            ; Paso de avance del patrón ofensivo.
time    EQU 1930            ; Factor usado para calcular un gran desplazamiento.
ORG coso                    ; La ejecución arranca en coso.
coso    SPL 0, <gate+1      ; Duplica el proceso y toca la referencia cercana a gate.
        MOV coso, @2        ; Copia la instrucción coso a una referencia indirecta cercana.
        ADD #step, 1        ; Auto-modifica la instrucción siguiente para mover el patrón.
        MOV patapum, <1-(step*time) ; Lanza la bomba muy lejos usando la expresión calculada.
        JMP -3, 0           ; Vuelve al tramo central del bucle ofensivo.
        MOV 1, <coso-16     ; Deja una copia adicional algo más atrás.
patapum DAT <gate-2, <gate-3 ; Bomba con predecremento en ambos operandos.
END coso                    ; Punto de entrada.
`, b: `;redcode-94b
;assert 1
;name EL SABIO OSCURO
;strategy Replicador agresivo que copia su cuerpo y activa la nueva copia.
ORG SRC                     ; El programa arranca en SRC.
SRC     MOV FIX, -1         ; Prepara el contador fuente y de paso deja un ataque extra.
CPY     MOV @SRC-1, <DST    ; Primera copia del bloque desde la fuente hacia el destino.
        MOV <SRC-1, <DST    ; Copia otra celda decreciendo ambos punteros.
        MOV <SRC-1, <DST    ; Sigue copiando el bloque principal.
        MOV <SRC-1, <DST    ; Última copia del tramo desenrollado.
        DJN CPY, SRC-1      ; Repite la copia hasta que el contador se agote.
DST     SPL @DST, 5000      ; Activa la nueva copia lanzando un proceso hacia ella.
HNT     JMZ HNT, <DST       ; Espera o busca una nueva zona libre para replicarse.
        JMP SRC             ; Reinicia el proceso de copia desde el origen.
FIX     DAT #0, #12         ; Valor inicial usado para SRC-1.
        DAT #0, #0          ; Celda mortal de apoyo.
        DAT #0, #1          ; Otra celda de relleno útil para el cuerpo copiado.
END SRC                     ; Punto de entrada.
` },
};

const WARRIOR_LIBRARY = {
  01_imp_basico: { label: "01 · Imp básico comentado", code: `;redcode-94
;name Imp básico comentado
;author Entrenamiento Web
;strategy Recorre el núcleo copiándose una celda adelante.
ORG inicio                  ; El punto de entrada será la etiqueta inicio.
inicio  MOV.I 0, 1          ; Copia esta misma instrucción una celda hacia delante.
END inicio                  ; Indica al ensamblador dónde empieza la ejecución.
` },
  02_imp_paso_dos: { label: "02 · Imp paso dos", code: `;redcode-94
;name Imp paso dos
;author Entrenamiento Web
;strategy Variante del imp que avanza de dos en dos.
paso    EQU 2               ; Definimos el salto del imp.
ORG inicio                  ; La ejecución arranca en inicio.
inicio  MOV.I 0, paso       ; Copia la instrucción actual dos celdas más allá.
END inicio                  ; Cierra el programa y fija la entrada.
` },
  03_imp_ring_2667: { label: "03 · Imp ring 2667", code: `;redcode-94
;name Imp ring 2667
;author Entrenamiento Web
;strategy Imp clásico con salto de anillo para repartir copias.
paso    EQU 2667            ; Salto clásico que reparte bien el anillo de 8000 celdas.
ORG inicio                  ; Comenzamos en la rutina principal.
inicio  MOV.I 0, paso       ; Copiamos la instrucción completa a 2667 celdas.
END inicio                  ; Fin del programa.
` },
  04_dwarf_basico: { label: "04 · Dwarf básico comentado", code: `;redcode-94
;name Dwarf básico comentado
;author Entrenamiento Web
;strategy Bombardero pequeño que va dejando DAT por el núcleo.
ORG loop                    ; Empezamos en el bucle del bombardero.
loop    ADD.AB #4, puntero  ; Avanza el puntero de bombardeo de cuatro en cuatro.
        MOV.I bomba, @puntero ; Copia la bomba en la dirección apuntada por puntero.
        JMP loop            ; Repite el ataque una y otra vez.
puntero DAT.F #0, #20       ; Guarda el desplazamiento actual usado por el bombardeo.
bomba   DAT.F #0, #0        ; La bomba mortal: si un proceso la ejecuta, muere.
END loop                    ; Fija el punto de entrada en loop.
` },
  05_dwarf_paso_ocho: { label: "05 · Dwarf paso ocho", code: `;redcode-94
;name Dwarf paso ocho
;author Entrenamiento Web
;strategy Igual que un dwarf, pero con una cadencia distinta de ataque.
paso    EQU 8               ; Tamaño del salto del patrón de bombardeo.
ORG loop                    ; Entramos en loop.
loop    ADD.AB #paso, puntero ; Mueve el objetivo del siguiente disparo.
        MOV.I bomba, @puntero ; Escribe una bomba DAT en la posición apuntada.
        JMP loop            ; Sigue sembrando bombas.
puntero DAT.F #0, #40       ; Puntero indirecto usado por el MOV.
bomba   DAT.F #0, #0        ; Bomba básica de destrucción.
END loop                    ; Fin del guerrero.
` },
  06_bomber_lineal: { label: "06 · Bombero lineal", code: `;redcode-94
;name Bombero lineal
;author Entrenamiento Web
;strategy Bombardeo simple con un puntero explícito.
ORG ataque                  ; La rutina principal empieza en ataque.
puntero DAT.F #0, #60       ; Aquí se guarda el desplazamiento del próximo objetivo.
ataque  MOV.I bomba, @puntero ; Lanza una bomba hacia la dirección indicada.
        ADD.AB #23, puntero ; Cambia el objetivo para no golpear siempre el mismo sitio.
        JMP ataque          ; Continúa el bombardeo.
bomba   DAT.F #0, #0        ; Carga mortal que mata al enemigo al ejecutarla.
END ataque                  ; Entrada del programa.
` },
  07_stone_mini: { label: "07 · Stone mini", code: `;redcode-94
;name Stone mini
;author Entrenamiento Web
;strategy Stone compacto que bombardea con un paso fijo.
paso    EQU 97              ; Distancia entre impactos consecutivos.
ORG ciclo                   ; La ejecución comienza en ciclo.
puntero DAT.F #0, #100      ; Acumula el desplazamiento del siguiente disparo.
ciclo   MOV.I bomba, @puntero ; Deposita la bomba en el objetivo indirecto.
        ADD.AB #paso, puntero ; Mueve el puntero para el próximo disparo.
        JMP ciclo           ; Repite sin parar.
bomba   DAT.F #0, #0        ; Bomba letal estándar.
END ciclo                   ; Punto de entrada.
` },
  08_stone_con_clear: { label: "08 · Stone con clear", code: `;redcode-94
;name Stone con clear
;author Entrenamiento Web
;strategy Primero bombardea y luego barre una zona del núcleo.
paso    EQU 111             ; Salto de bombardeo.
vueltas EQU 18              ; Número de iteraciones antes de pasar al clear.
ORG inicio                  ; Arranque del guerrero.
puntero DAT.F #0, #150      ; Puntero de ataque del stone.
contador DAT.F #0, #vueltas ; Lleva la cuenta de los bombardeos iniciales.
inicio  MOV.I bomba, @puntero ; Lanza una bomba al objetivo actual.
        ADD.AB #paso, puntero ; Cambia el objetivo del siguiente ataque.
        DJN.B inicio, contador ; Repite mientras queden vueltas de apertura.
clear   MOV.I bomba, >limpia ; Empieza a limpiar secuencialmente una zona.
        DJN.F clear, >limpia ; Sigue limpiando mientras avanza el puntero.
limpia  DAT.F #0, #40       ; Base usada por el clear secuencial.
bomba   DAT.F #0, #0        ; Bomba reutilizada por ambas fases.
END inicio                  ; Entrada del programa.
` },
  09_scanner_mini: { label: "09 · Scanner mini", code: `;redcode-94
;name Scanner mini
;author Entrenamiento Web
;strategy Busca actividad y, si la detecta, deja una bomba.
paso    EQU 24              ; Distancia entre sondeos.
ORG scan                    ; Arrancamos en la rutina de escaneo.
scan    SEQ.I paso, paso+6  ; Compara dos celdas separadas para detectar cambios.
        JMP golpe           ; Si parecen iguales, salta a la rutina de golpeo.
        ADD.AB #paso, scan  ; Desplaza la ventana de escaneo.
        JMP scan            ; Vuelve a comprobar.
golpe   MOV.I bomba, @scan  ; Escribe una bomba donde cree haber encontrado al rival.
        JMP scan            ; Retoma la búsqueda.
bomba   DAT.F #0, #0        ; Bomba usada por el scanner.
END scan                    ; Fin del guerrero.
` },
  10_scanner_con_bomba: { label: "10 · Scanner con bomba", code: `;redcode-94
;name Scanner con bomba
;author Entrenamiento Web
;strategy Scanner que alterna sondeo y bombardeo sobre un puntero.
paso    EQU 31              ; Paso del escaneo.
ORG scan                    ; Entrada del programa.
puntero DAT.F #0, #80       ; Puntero base del área que se va revisando.
scan    SNE.I @puntero, *puntero ; Comprueba si dos referencias indirectas difieren.
        JMP siguiente       ; Si no detecta nada claro, continúa escaneando.
        MOV.I bomba, @puntero ; Si hay diferencia, deja una bomba en el objetivo.
siguiente ADD.AB #paso, puntero ; Desplaza el puntero del escáner.
        JMP scan            ; Sigue buscando.
bomba   DAT.F #0, #0        ; Bomba letal.
END scan                    ; Punto de entrada.
` },
  11_silk_mini: { label: "11 · Silk mini", code: `;redcode-94
;name Silk mini
;author Entrenamiento Web
;strategy Pequeño replicador que se extiende usando SPL y MOV.
ORG inicio                  ; Empezamos en la primera copia.
inicio  SPL 1, <200         ; Crea un proceso extra para acelerar la expansión.
        MOV.I }-1, >-1      ; Copia instrucciones desde detrás hacia delante.
        JMP inicio          ; Repite para seguir replicándose.
END inicio                  ; Entrada del guerrero.
` },
  12_paper_simple: { label: "12 · Paper simple", code: `;redcode-94
;name Paper simple
;author Entrenamiento Web
;strategy Replica el cuerpo y deja una pequeña defensa durante la copia.
ORG inicio                  ; Punto de entrada.
inicio  SPL 1, <300         ; Lanza otro proceso que ayudará a copiar.
        MOV.I }-1, >-1      ; Copia el bloque del programa a otra zona del núcleo.
        MOV.I bomba, >200   ; Deja una bomba algo más lejos para molestar al rival.
        JMP -2              ; Sigue copiando y bombardeando.
bomba   DAT.F #0, #0        ; Bomba defensiva de apoyo.
END inicio                  ; Fin del programa.
` },
  13_spl_carpet: { label: "13 · SPL carpet", code: `;redcode-94
;name SPL carpet
;author Entrenamiento Web
;strategy Satura el planificador creando muchos procesos.
ORG inicio                  ; La ejecución comienza aquí.
inicio  SPL 1, 0            ; Duplica el proceso una vez.
        SPL 1, 0            ; Duplica otra vez para ganar presencia.
        SPL 1, 0            ; Tercera división del flujo.
        MOV.I bomba, >100   ; Mientras tanto deja una bomba por delante.
        JMP -1              ; Se mantiene insistiendo en la misma rutina.
bomba   DAT.F #0, #0        ; Bomba usada por el tapiz de procesos.
END inicio                  ; Entrada del guerrero.
` },
  14_gate_keeper: { label: "14 · Gate keeper", code: `;redcode-94
;name Gate keeper
;author Entrenamiento Web
;strategy Intenta cerrar una zona y limpiarla de forma controlada.
ORG inicio                  ; Empezamos en la rutina principal.
puerta  DAT.F #0, #20       ; Esta celda sirve de base para el gate.
inicio  MOV.I bomba, >puerta ; Va dejando bombas tras la puerta.
        DJN.F inicio, >puerta ; Avanza y repite mientras decrementa el contador.
bomba   DAT.F >5, >7        ; Bomba con campos no triviales para desordenar al rival.
END inicio                  ; Entrada del guerrero.
` },
  15_core_clear_basico: { label: "15 · Core clear básico", code: `;redcode-94
;name Core clear básico
;author Entrenamiento Web
;strategy Barre una franja del núcleo con DAT.
ORG clear                   ; El programa arranca en clear.
bomba   DAT.F #0, #0        ; Patrón mortal que se copiará muchas veces.
clear   MOV.I bomba, >ptr   ; Copia la bomba en la siguiente posición a limpiar.
        DJN.F clear, >ptr   ; Sigue avanzando y limpiando en cadena.
ptr     DAT.F #0, #30       ; Referencia del clear secuencial.
END clear                   ; Punto de entrada.
` },
  16_djn_clear: { label: "16 · DJN clear", code: `;redcode-94
;name DJN clear
;author Entrenamiento Web
;strategy Usa un contador decreciente para limpiar por tandas.
vueltas EQU 25              ; Número de escrituras del clear.
ORG inicio                  ; Entrada del programa.
cont    DAT.F #0, #vueltas  ; Contador del bucle de limpieza.
puntero DAT.F #0, #90       ; Base usada para la escritura secuencial.
inicio  MOV.I bomba, >puntero ; Escribe una bomba en la siguiente celda.
        DJN.B inicio, cont  ; Repite mientras el contador no llegue a cero.
        JMP inicio          ; Cuando acaba, reinicia la secuencia desde el principio.
bomba   DAT.F #0, #0        ; Bomba copiada por el clear.
END inicio                  ; Fin del programa.
` },
  17_vampiro_mini: { label: "17 · Vampiro mini", code: `;redcode-94
;name Vampiro mini
;author Entrenamiento Web
;strategy Intenta convertir al enemigo en un salto a un pozo.
paso    EQU 29              ; Distancia entre ataques del vampiro.
ORG inicio                  ; Entrada del programa.
pozo    JMP pozo, 0         ; Si el enemigo cae aquí, queda atrapado girando.
puntero DAT.F #0, #70       ; Puntero de búsqueda del objetivo.
inicio  MOV.I pozo, @puntero ; Escribe el salto al pozo sobre el rival.
        ADD.AB #paso, puntero ; Cambia el objetivo del siguiente ataque.
        JMP inicio          ; Sigue cazando víctimas.
END inicio                  ; Fin del guerrero.
` },
  18_paper_imp_mini: { label: "18 · Paper imp mini", code: `;redcode-94
;name Paper imp mini
;author Entrenamiento Web
;strategy Mezcla una copia simple con un pequeño imp auxiliar.
paso    EQU 2667            ; Salto del imp auxiliar.
ORG arranque                ; Arranque principal.
imp     MOV.I 0, paso       ; Núcleo del imp que recorre el anillo.
arranque SPL copia          ; Crea un proceso para iniciar la copia.
         JMP imp            ; Lanza otro proceso hacia el imp.
copia   MOV.I }-1, >-1      ; Copia el programa a una nueva zona.
         SPL imp            ; Añade más presión lanzando otro proceso al imp.
         JMP copia          ; Mantiene viva la replicación.
END arranque                ; Entrada del programa.
` },
  19_oneshot_mini: { label: "19 · One-shot mini", code: `;redcode-94
;name One-shot mini
;author Entrenamiento Web
;strategy Escanea y dispara una sola rutina de castigo cuando detecta algo.
ORG scan                    ; Entrada del programa.
puntero DAT.F #0, #120      ; Posición base del escaneo.
scan    SNE.I *puntero, @puntero ; Busca diferencias entre dos referencias indirectas.
        JMP sigue           ; Si no hay señal clara, continúa.
        MOV.I bomba, @puntero ; Si detecta actividad, planta una bomba.
sigue   ADD.AB #41, puntero ; Mueve la zona de sondeo.
        JMP scan            ; Vuelve a empezar.
bomba   DAT.F #0, #0        ; Bomba empleada por el one-shot.
END scan                    ; Fin del guerrero.
` },
  20_forrof_demo: { label: "20 · Demo FOR ROF", code: `;redcode-94
;name Demo FOR ROF
;author Entrenamiento Web
;strategy Ejemplo sencillo que además prueba el preprocesador.
paso    EQU 10              ; Distancia entre impactos.
ORG inicio                  ; Punto de entrada.
inicio  MOV.I bomba, @puntero ; Deja una bomba en la dirección apuntada.
        ADD.AB #paso, puntero ; Avanza el puntero del bombardeo.
        JMP inicio          ; Repite el bucle principal.
bomba   DAT.F #0, #0        ; Bomba base.
FOR 3                       ; Inserta tres celdas de relleno.
        DAT.F #0, #0        ; Relleno generado por el FOR.
ROF                         ; Fin del bloque repetido.
puntero DAT.F #0, #50       ; Puntero usado por el MOV indirecto.
END inicio                  ; Fin del programa.
` },
  21_equ_y_etiquetas: { label: "21 · EQU y etiquetas", code: `;redcode-94
;name EQU y etiquetas
;author Entrenamiento Web
;strategy Pequeño guerrero didáctico con constantes y etiquetas.
paso    EQU 17              ; Constante reutilizable del programa.
arranque EQU inicio         ; Alias simbólico de la etiqueta principal.
ORG arranque                ; Se puede arrancar usando la constante.
puntero DAT.F #0, #45       ; Base del bombardeo.
inicio  MOV.I bomba, @puntero ; Escribe la bomba en el objetivo indirecto.
        ADD.AB #paso, puntero ; Cambia la zona atacada.
        JMP inicio          ; Sigue en bucle.
bomba   DAT.F #0, #0        ; Bomba mortal.
END arranque                ; Cierre usando el alias.
` },
  22_daredevil_comentado: { label: "22 · DAREDEVIL", code: `;redcode-94b
;assert 1
;name DAREDEVIL
;strategy Intenta poblar el núcleo con imps y jugar a tablas o desgaste.
ORG main                    ; El programa arranca en la etiqueta main.
dare    DAT #0, #5          ; Referencia usada por el SEQ para comparar patrones.
cero    DAT #0, #0          ; Celda auxiliar que va cambiando con el tiempo.
counter DAT #0, #500        ; Puntero indirecto desde el que se van lanzando copias.
imp     MOV 0, 1            ; Imp mínimo que se copia una celda hacia delante.
main    MOV imp, @counter   ; Escribe un imp en la posición apuntada por counter.
        SPL @counter-1      ; Lanza un nuevo proceso cerca de la copia recién hecha.
        ADD #800, counter   ; Desplaza el puntero para repartir las copias.
        ADD #1, cero        ; Modifica la celda auxiliar para la comparación.
        SEQ @dare, @cero    ; Compara dos referencias indirectas para decidir el flujo.
        JMP main            ; Vuelve al inicio del ciclo principal.
END main                    ; Entrada declarada del guerrero.
` },
  23_motherland_comentado: { label: "23 · MOTHERLAND", code: `;redcode-94b
;assert 1
;name MOTHERLAND
;strategy Bombardero compacto que recorre el núcleo con un paso fijo.
ORG loop                    ; El programa empieza en loop.
bomb    DAT #0, #12         ; La bomba también guarda el paso inicial del puntero.
loop    ADD #121, bomb      ; Incrementa el campo que actúa como puntero de ataque.
        MOV bomb, @bomb     ; Copia la bomba en la dirección apuntada por ella misma.
        JMP loop            ; Repite el bombardeo continuamente.
END loop                    ; Punto de entrada.
` },
  24_mago_del_tiempo_r_comentado: { label: "24 · MAGO DEL TIEMPO R", code: `;redcode
;name MAGO DEL TIEMPO R
;strategy Stone extraño con auto-modificación y bomba desplazada.
gate    EQU -10             ; Desplazamiento base usado como referencia de puerta.
step    EQU 1252            ; Paso de avance del patrón ofensivo.
time    EQU 1930            ; Factor usado para calcular un gran desplazamiento.
ORG coso                    ; La ejecución arranca en coso.
coso    SPL 0, <gate+1      ; Duplica el proceso y toca la referencia cercana a gate.
        MOV coso, @2        ; Copia la instrucción coso a una referencia indirecta cercana.
        ADD #step, 1        ; Auto-modifica la instrucción siguiente para mover el patrón.
        MOV patapum, <1-(step*time) ; Lanza la bomba muy lejos usando la expresión calculada.
        JMP -3, 0           ; Vuelve al tramo central del bucle ofensivo.
        MOV 1, <coso-16     ; Deja una copia adicional algo más atrás.
patapum DAT <gate-2, <gate-3 ; Bomba con predecremento en ambos operandos.
END coso                    ; Punto de entrada.
` },
  25_el_sabio_oscuro_comentado: { label: "25 · EL SABIO OSCURO", code: `;redcode-94b
;assert 1
;name EL SABIO OSCURO
;strategy Replicador agresivo que copia su cuerpo y activa la nueva copia.
ORG SRC                     ; El programa arranca en SRC.
SRC     MOV FIX, -1         ; Prepara el contador fuente y de paso deja un ataque extra.
CPY     MOV @SRC-1, <DST    ; Primera copia del bloque desde la fuente hacia el destino.
        MOV <SRC-1, <DST    ; Copia otra celda decreciendo ambos punteros.
        MOV <SRC-1, <DST    ; Sigue copiando el bloque principal.
        MOV <SRC-1, <DST    ; Última copia del tramo desenrollado.
        DJN CPY, SRC-1      ; Repite la copia hasta que el contador se agote.
DST     SPL @DST, 5000      ; Activa la nueva copia lanzando un proceso hacia ella.
HNT     JMZ HNT, <DST       ; Espera o busca una nueva zona libre para replicarse.
        JMP SRC             ; Reinicia el proceso de copia desde el origen.
FIX     DAT #0, #12         ; Valor inicial usado para SRC-1.
        DAT #0, #0          ; Celda mortal de apoyo.
        DAT #0, #1          ; Otra celda de relleno útil para el cuerpo copiado.
END SRC                     ; Punto de entrada.
` },
};

function summarizeQueue(queue) {
  if (!queue.length) return 'vacía';
  const preview = queue.slice(0, 10).join(', ');
  return queue.length > 10 ? `${preview}…` : preview;
}
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function buildTemplate(side) {
  return `;redcode-94
;name Nuevo guerrero ${side}
;author Tu nombre
;strategy Describe aquí la idea del guerrero
ORG inicio
inicio  MOV.I 0, 1    ; Ejemplo base: imp mínimo
END inicio`;
}
function extractMeta(source) {
  const meta = { name: 'Sin nombre', author: 'No indicado' };
  source.split(/\r?\n/).forEach((line) => {
    const lower = line.toLowerCase().trim();
    if (lower.startsWith(';name')) meta.name = line.slice(5).trim() || meta.name;
    if (lower.startsWith(';author')) meta.author = line.slice(7).trim() || meta.author;
  });
  return meta;
}
function App() {
  const [presetKey, setPresetKey] = useState('impVsDwarf');
  const [libraryKeyA, setLibraryKeyA] = useState('');
  const [libraryKeyB, setLibraryKeyB] = useState('');
  const [codeA, setCodeA] = useState(PRESETS.impVsDwarf.a);
  const [codeB, setCodeB] = useState(PRESETS.impVsDwarf.b);
  const [validationA, setValidationA] = useState(null);
  const [validationB, setValidationB] = useState(null);
  const [maxCycles, setMaxCycles] = useState(80000);
  const [runDelay, setRunDelay] = useState(8);
  const [running, setRunning] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputARef = useRef(null);
  const fileInputBRef = useRef(null);

  const [sim, setSim] = useState(() => {
    const settings = { ...Engine.DEFAULT_SETTINGS, maxCycles: 80000 };
    const compiledA = Engine.compileWarrior(PRESETS.impVsDwarf.a, settings);
    const compiledB = Engine.compileWarrior(PRESETS.impVsDwarf.b, settings);
    return { ...Engine.createBattle(compiledA, compiledB, settings) };
  });

  function currentSettings() {
    return { ...Engine.DEFAULT_SETTINGS, maxCycles: clamp(Number(maxCycles) || 80000, 1, 500000) };
  }
  function validateSide(side) {
    try {
      const code = side === 'A' ? codeA : codeB;
      const compiled = Engine.compileWarrior(code, currentSettings());
      const meta = extractMeta(code);
      const result = { ok: true, name: meta.name, author: meta.author, length: compiled.length, entry: compiled.entryPoint, pin: compiled.pin == null ? '—' : compiled.pin };
      if (side === 'A') setValidationA(result); else setValidationB(result);
      return true;
    } catch (error) {
      const result = { ok: false, error: error.message };
      if (side === 'A') setValidationA(result); else setValidationB(result);
      return false;
    }
  }
  function validateBoth() {
    const okA = validateSide('A');
    const okB = validateSide('B');
    return okA && okB;
  }
  function compileBattle(keepRunning = false) {
    try {
      const settings = currentSettings();
      const compiledA = Engine.compileWarrior(codeA, settings);
      const compiledB = Engine.compileWarrior(codeB, settings);
      const battle = Engine.createBattle(compiledA, compiledB, settings);
      setSim({ ...battle });
      setRunning(keepRunning);
      setValidationA({ ok: true, name: compiledA.metadata.name || 'Sin nombre', author: compiledA.metadata.author || 'No indicado', length: compiledA.length, entry: compiledA.entryPoint, pin: compiledA.pin == null ? '—' : compiledA.pin });
      setValidationB({ ok: true, name: compiledB.metadata.name || 'Sin nombre', author: compiledB.metadata.author || 'No indicado', length: compiledB.length, entry: compiledB.entryPoint, pin: compiledB.pin == null ? '—' : compiledB.pin });
    } catch (error) {
      setRunning(false);
      setSim((prev) => ({
        ...prev,
        halted: true,
        winner: null,
        winReason: '',
        message: `Error de compilación: ${error.message}`,
        debugLog: [{ cycle: prev.cycle, warrior: '-', ip: '-', instruction: 'compile', sourceAddr: '-', destAddr: '-', summary: error.message, died: false, queueSize: 0 }, ...prev.debugLog].slice(0, 200),
      }));
    }
  }
  function loadPreset(key) {
    setPresetKey(key);
    setLibraryKeyA('');
    setLibraryKeyB('');
    setCodeA(PRESETS[key].a);
    setCodeB(PRESETS[key].b);
    setValidationA(null);
    setValidationB(null);
    setRunning(false);
  }
  function loadLibraryWarrior(side, key) {
    if (!key) return;
    const warrior = WARRIOR_LIBRARY[key];
    if (!warrior) return;
    if (side === 'A') { setLibraryKeyA(key); setCodeA(warrior.code); setValidationA(null); }
    else { setLibraryKeyB(key); setCodeB(warrior.code); setValidationB(null); }
    setRunning(false);
  }
  function newWarrior(side) {
    const code = buildTemplate(side);
    if (side === 'A') { setLibraryKeyA(''); setCodeA(code); setValidationA(null); }
    else { setLibraryKeyB(''); setCodeB(code); setValidationB(null); }
    setRunning(false);
  }
  function exportWarrior(side) {
    const code = side === 'A' ? codeA : codeB;
    const meta = extractMeta(code);
    const name = (meta.name || `warrior_${side}`).replace(/[^a-z0-9._-]+/gi, '_');
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.red`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function importWarrior(side, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      if (side === 'A') { setLibraryKeyA(''); setCodeA(text); setValidationA(null); }
      else { setLibraryKeyB(''); setCodeB(text); setValidationB(null); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
  function stepOnce() { setRunning(false); setSim((prev) => ({ ...Engine.stepBattle(prev) })); }
  function stepBatch(count) { setRunning(false); setSim((prev) => ({ ...Engine.runSteps(prev, count) })); }

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => setSim((prev) => ({ ...Engine.stepBattle(prev) })), clamp(Number(runDelay) || 8, 1, 1000));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running, runDelay]);
  useEffect(() => { if (sim.halted) setRunning(false); }, [sim.halted]);
  const hoverCell = useMemo(() => hoverIndex == null ? null : (sim.core[hoverIndex] || null), [hoverIndex, sim]);
  const currentIPs = useMemo(() => {
    const set = new Set();
    sim.queues.A.forEach((v) => set.add(`A:${v}`));
    sim.queues.B.forEach((v) => set.add(`B:${v}`));
    return set;
  }, [sim]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width, height = canvas.height;
    const cols = 100;
    const rows = Math.ceil(sim.settings.coreSize / cols);
    const cellW = width / cols, cellH = height / rows;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#07111f';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < sim.core.length; i += 1) {
      const cell = sim.core[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellW;
      const y = row * cellH;
      let fill = '#182235';
      if (cell.owner === 'A') fill = '#155e75';
      if (cell.owner === 'B') fill = '#9a3412';
      if (!cell.owner && cell.op === 'DAT') fill = '#253041';
      const lastExec = sim.visual.lastExecBy[i];
      const lastWrite = sim.visual.lastWriteBy[i];
      const lastRead = sim.visual.lastReadBy[i];
      if (lastWrite === 'A') fill = '#16b6d4';
      if (lastWrite === 'B') fill = '#fb923c';
      if (lastExec === 'A') fill = '#8be9fd';
      if (lastExec === 'B') fill = '#fdba74';
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, cellW - 1, cellH - 1);
      if (lastRead) {
        ctx.fillStyle = lastRead === 'A' ? '#cffafe' : '#ffedd5';
        ctx.fillRect(x + cellW * 0.33, y + cellH * 0.33, Math.max(1, cellW * 0.22), Math.max(1, cellH * 0.22));
      }
      if (currentIPs.has(`A:${i}`) || currentIPs.has(`B:${i}`)) {
        ctx.strokeStyle = currentIPs.has(`A:${i}`) && currentIPs.has(`B:${i}`) ? '#ffffff' : (currentIPs.has(`A:${i}`) ? '#67e8f9' : '#fed7aa');
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 0.5, y + 0.5, cellW - 2, cellH - 2);
      }
      if (hoverIndex === i) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 0.5, y + 0.5, cellW - 2, cellH - 2);
      }
    }
  }, [sim, hoverIndex, currentIPs]);

  function handleCanvasMove(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cols = 100;
    const rows = Math.ceil(sim.settings.coreSize / cols);
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const col = clamp(Math.floor(x / cellW), 0, cols - 1);
    const row = clamp(Math.floor(y / cellH), 0, rows - 1);
    const index = row * cols + col;
    if (index < sim.settings.coreSize) setHoverIndex(index);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-simple">
          <div>
            <h1>Core War Web Arena v8</h1>
            <p className="hero-note">Biblioteca integrada de 25 guerreros comentados en castellano, importación y exportación directa.</p>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="left-column">
          <div className="panel controls-panel">
            <div className="row wrap gap">
              <div>
                <label className="label">Preset</label>
                <select value={presetKey} onChange={(e) => loadPreset(e.target.value)}>
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>{preset.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Máx. ciclos</label>
                <input type="number" min="1" max="500000" value={maxCycles} onChange={(e) => setMaxCycles(e.target.value)} />
              </div>
              <div>
                <label className="label">Delay ms</label>
                <input type="number" min="1" max="1000" value={runDelay} onChange={(e) => setRunDelay(e.target.value)} />
              </div>
            </div>
            <div className="row wrap gap action-row">
              <button onClick={validateBoth}>Validar A+B</button>
              <button onClick={() => compileBattle(false)}>Compilar</button>
              <button onClick={() => { if (sim.halted) compileBattle(true); else setRunning((v) => !v); }}>{running ? 'Pausar' : 'Run'}</button>
              <button onClick={stepOnce}>Step</button>
              <button onClick={() => stepBatch(100)}>Step x100</button>
              <button onClick={() => compileBattle(false)}>Reset batalla</button>
            </div>
            <div className="message-banner">{sim.message}</div>
          </div>

          <div className="panel editors-panel">
            <div className="editor-grid">
              <div>
                <div className="editor-header"><strong>Guerrero A</strong><span className="chip chip-a">A</span></div>
                <div className="editor-select">
                  <select value={libraryKeyA} onChange={(e) => loadLibraryWarrior('A', e.target.value)}>
                    <option value="">Biblioteca de guerreros…</option>
                    {Object.entries(WARRIOR_LIBRARY).map(([key, warrior]) => (
                      <option key={key} value={key}>{warrior.label}</option>
                    ))}
                  </select>
                </div>
                <textarea value={codeA} onChange={(e) => { setLibraryKeyA(''); setCodeA(e.target.value); setValidationA(null); }} spellCheck="false" />
                <div className="editor-actions">
                  <button onClick={() => newWarrior('A')}>Nuevo</button>
                  <button onClick={() => validateSide('A')}>Validar</button>
                  <button onClick={() => exportWarrior('A')}>Exportar</button>
                  <button onClick={() => fileInputARef.current?.click()}>Importar</button>
                  <input ref={fileInputARef} type="file" accept=".red,.txt,.rc,*/*" hidden onChange={(e) => importWarrior('A', e)} />
                </div>
                {validationA && (
                  <div className={`validation-card ${validationA.ok ? 'validation-ok' : 'validation-error'}`}>
                    {validationA.ok ? (
                      <>
                        <strong>{validationA.name}</strong>
                        <div>Autor: {validationA.author}</div>
                        <div>Longitud: {validationA.length}</div>
                        <div>Entrada: {validationA.entry}</div>
                        <div>PIN: {validationA.pin}</div>
                      </>
                    ) : (
                      <>
                        <strong>No compila</strong>
                        <div>{validationA.error}</div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="editor-header"><strong>Guerrero B</strong><span className="chip chip-b">B</span></div>
                <div className="editor-select">
                  <select value={libraryKeyB} onChange={(e) => loadLibraryWarrior('B', e.target.value)}>
                    <option value="">Biblioteca de guerreros…</option>
                    {Object.entries(WARRIOR_LIBRARY).map(([key, warrior]) => (
                      <option key={key} value={key}>{warrior.label}</option>
                    ))}
                  </select>
                </div>
                <textarea value={codeB} onChange={(e) => { setLibraryKeyB(''); setCodeB(e.target.value); setValidationB(null); }} spellCheck="false" />
                <div className="editor-actions">
                  <button onClick={() => newWarrior('B')}>Nuevo</button>
                  <button onClick={() => validateSide('B')}>Validar</button>
                  <button onClick={() => exportWarrior('B')}>Exportar</button>
                  <button onClick={() => fileInputBRef.current?.click()}>Importar</button>
                  <input ref={fileInputBRef} type="file" accept=".red,.txt,.rc,*/*" hidden onChange={(e) => importWarrior('B', e)} />
                </div>
                {validationB && (
                  <div className={`validation-card ${validationB.ok ? 'validation-ok' : 'validation-error'}`}>
                    {validationB.ok ? (
                      <>
                        <strong>{validationB.name}</strong>
                        <div>Autor: {validationB.author}</div>
                        <div>Longitud: {validationB.length}</div>
                        <div>Entrada: {validationB.entry}</div>
                        <div>PIN: {validationB.pin}</div>
                      </>
                    ) : (
                      <>
                        <strong>No compila</strong>
                        <div>{validationB.error}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="panel core-panel">
            <div className="panel-title-row">
              <h2>Core</h2>
              <div className="legend">
                <span><i className="swatch swatch-a"></i>A</span>
                <span><i className="swatch swatch-b"></i>B</span>
                <span><i className="swatch swatch-read"></i>Read</span>
                <span><i className="swatch swatch-exec"></i>Exec/IP</span>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width="1000"
              height="800"
              className="core-canvas"
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setHoverIndex(null)}
            />
            <div className="inspector-grid">
              <div className="inspect-box">
                <div className="inspect-label">Inspector</div>
                {hoverCell ? (
                  <div>
                    <div><strong>Celda:</strong> {hoverIndex}</div>
                    <div><strong>Instrucción:</strong> {Engine.formatInstruction(hoverCell)}</div>
                    <div><strong>Owner:</strong> {hoverCell.owner || 'ninguno'}</div>
                    <div><strong>Fuente:</strong> {hoverCell.source || 'memoria / modificada'}</div>
                  </div>
                ) : (
                  <div>Mueve el ratón sobre el core.</div>
                )}
              </div>
              <div className="inspect-box">
                <div className="inspect-label">Última ejecución</div>
                {sim.lastStep ? (
                  <div>
                    <div><strong>Ciclo:</strong> {sim.lastStep.cycle}</div>
                    <div><strong>Guerrero:</strong> {sim.lastStep.warrior}</div>
                    <div><strong>IP:</strong> {sim.lastStep.ip}</div>
                    <div><strong>Instr:</strong> {sim.lastStep.instruction}</div>
                    <div><strong>Src/Dst:</strong> {sim.lastStep.sourceAddr} / {sim.lastStep.destAddr}</div>
                    <div><strong>Resultado:</strong> {sim.lastStep.summary}</div>
                  </div>
                ) : (
                  <div>Aún no hay pasos ejecutados.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="right-column">
          <div className="panel status-panel">
            <h2>Estado</h2>
            <div className="stats-grid">
              <div className="stat-card"><span>Ciclo</span><strong>{sim.cycle}</strong></div>
              <div className="stat-card"><span>Procesos A</span><strong>{sim.queues.A.length}</strong></div>
              <div className="stat-card"><span>Procesos B</span><strong>{sim.queues.B.length}</strong></div>
              <div className="stat-card"><span>Resultado</span><strong>{sim.winner || 'En curso'}</strong></div>
            </div>
            <div className={`result-box ${sim.winner === 'A' ? 'result-a' : sim.winner === 'B' ? 'result-b' : sim.winner === 'Empate' ? 'result-draw' : ''}`}>
              <div className="result-title">Resolución</div>
              <div>{sim.winReason || 'La batalla sigue abierta.'}</div>
            </div>
            <div className="queue-box">
              <div><strong>Cola A:</strong> {summarizeQueue(sim.queues.A)}</div>
              <div><strong>Cola B:</strong> {summarizeQueue(sim.queues.B)}</div>
            </div>
          </div>

          <div className="panel debugger-panel">
            <h2>Depurador</h2>
            <div className="debug-log">
              {sim.debugLog.length === 0 && <div className="debug-row empty">Sin trazas todavía.</div>}
              {sim.debugLog.map((entry, idx) => (
                <div key={`${entry.cycle}-${idx}`} className={`debug-row ${entry.warrior === 'A' ? 'debug-a' : entry.warrior === 'B' ? 'debug-b' : ''}`}>
                  <div className="debug-top">
                    <span>#{entry.cycle}</span>
                    <span>{entry.warrior}</span>
                    <span>@{entry.ip}</span>
                  </div>
                  <div className="debug-instr">{entry.instruction}</div>
                  <div className="debug-summary">{entry.summary}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel notes-panel">
            <h2>Biblioteca integrada</h2>
            <ul>
              <li>25 guerreros comentados en castellano integrados directamente en los selectores de A y B.</li>
              <li>Tus cuatro guerreros están incluidos sin autoría visible en la cabecera del código.</li>
              <li>Puedes cargar desde la biblioteca, editar, validar, compilar, exportar o importar desde archivo.</li>
              <li>Si el ZIP no se descarga bien, usa <code>index-standalone.html</code>, que contiene todo en un único archivo.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
