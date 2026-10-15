;redcode-94
;name flecha de la tormenta
;author Sara
;strategy Bombardeo con salto 293 y aritmética que protege la zona de su propio código.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.
ADD.AB #293, puntero ; Aumenta el campo B del puntero con el salto indicado.
MOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.
ADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
puntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.
bomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
