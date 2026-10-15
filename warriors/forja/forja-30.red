;redcode-94
;name rastreador del vacío
;author Pascal
;strategy Examina la memoria con salto 293 y responde con una ráfaga de 8 bombas.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.
JMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.
ADD.AB #293, puntero ; Aumenta el campo B del puntero con el salto indicado.
MOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.
ADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
atacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
SLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
MOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #2 ; Munición: al ejecutarla, el proceso que la recibe termina.
vacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.
END inicio ; Cierra el programa y confirma su punto de entrada.
