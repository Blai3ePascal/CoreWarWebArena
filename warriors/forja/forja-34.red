;redcode-94
;name cometa de las almas
;author Sara
;strategy Tres instrucciones por ataque. El paso 8 divide el núcleo y la trayectoria evita sus instrucciones activas.
;assert CORESIZE >= 256 && CORESIZE % 8 == 0 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.
ADD.AB #8, puntero ; Aumenta el campo B del puntero con el salto indicado.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
