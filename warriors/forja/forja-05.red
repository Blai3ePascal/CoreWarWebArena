;redcode-94
;name juramento eterno
;author Sara
;strategy El bucle mínimo para comprender qué significa seguir vivo.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio JMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.
END inicio ; Cierra el programa y confirma su punto de entrada.
