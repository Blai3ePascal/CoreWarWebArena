;redcode-94
;name crónica del fuego
;author Sara
;strategy Ensaya STP y LDP en la posición 31 de P-space. Requiere permitir memoria privada en el torneo.
;assert CORESIZE >= 256 && PSPACESIZE >= 128 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio STP.AB #32, #31 ; Guarda el campo A inmediato en la posición indicada de la memoria privada.
LDP.AB #31, dato ; Recupera la memoria privada en el campo B del dato indicado.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
dato DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
