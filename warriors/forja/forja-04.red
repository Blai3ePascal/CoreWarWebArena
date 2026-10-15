;redcode-94
;name legión del amanecer
;author Sara
;strategy Una cadena de 4 instrucciones conserva por delante sus próximas copias.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
MOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
MOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
MOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
END inicio ; Cierra el programa y confirma su punto de entrada.
