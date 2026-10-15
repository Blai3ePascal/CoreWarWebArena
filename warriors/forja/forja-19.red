;redcode-94
;name marea de cenizas
;author Pascal
;strategy Lanza 1 bombas seguidas antes de comprobar el límite de su franja de ataque.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.
SLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
MOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
