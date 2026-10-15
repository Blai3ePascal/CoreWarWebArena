;redcode-94
;name chispa del alba
;author Sara
;strategy Una instrucción basta para avanzar por toda la memoria.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I 0, 1 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
END inicio ; Cierra el programa y confirma su punto de entrada.
