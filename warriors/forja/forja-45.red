;redcode-94
;name pacto de las dos lunas
;author Pascal
;strategy Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG entrada ; Elige la etiqueta donde empieza el primer proceso.
entrada SPL.B inicio, $0 ; Abre una rama en la etiqueta indicada y conserva el proceso original.
JMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.
inicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.
ADD.AB #73, puntero ; Aumenta el campo B del puntero con el salto indicado.
MOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.
ADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.
END entrada ; Cierra el programa y confirma su punto de entrada.
