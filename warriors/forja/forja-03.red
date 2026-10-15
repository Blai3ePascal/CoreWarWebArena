;redcode-94
;name marcha de los titanes
;author Pascal
;strategy Una cadena de 3 instrucciones conserva por delante sus próximas copias.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
MOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
MOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.
END inicio ; Cierra el programa y confirma su punto de entrada.
