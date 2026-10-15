;redcode-94
;name centinela de las brasas
;author Pascal
;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio JMP.B 0, {128 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.
END inicio ; Cierra el programa y confirma su punto de entrada.
