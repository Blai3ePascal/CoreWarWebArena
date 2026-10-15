;redcode-94
;name trono de la eternidad
;author Sara
;strategy Dispersa su programa completo con salto 6283. Sustituye la búsqueda del sabio oscuro por nuevas réplicas; apuesta por la supervivencia de sus procesos.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.
copia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.
MOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.
DJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.
destino SPL.B @destino, 6283 ; Arranca otro proceso en el comienzo de la copia recién escrita.
ADD.AB #6283, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
origen DAT.F #0, #10 ; Longitud total del programa; se usa para reiniciar el contador de copia.
DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.
DAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
