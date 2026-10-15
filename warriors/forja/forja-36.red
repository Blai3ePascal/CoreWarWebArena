;redcode-94
;name sol de los caídos
;author Pascal
;strategy Tres instrucciones por ataque. El paso 20 divide el núcleo y la trayectoria evita sus instrucciones activas.
;assert CORESIZE >= 256 && CORESIZE % 20 == 0 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.
ADD.AB #20, puntero ; Aumenta el campo B del puntero con el salto indicado.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #320 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
