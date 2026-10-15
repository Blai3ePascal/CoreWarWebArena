;redcode-94
;name verdugo de las sombras
;author Sara
;strategy Dispersa copias en lotes de 2 instrucciones con salto 997 y lanza 1 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.
;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.
ORG inicio ; Elige la etiqueta donde empieza el primer proceso.
inicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.
copia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.
MOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.
DJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.
destino SPL.B @destino, 997 ; Arranca otro proceso en el comienzo de la copia recién escrita.
ADD.AB #997, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.
MOV.I bomba, >destino ; Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.
JMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.
origen DAT.F #0, #12 ; Longitud total del programa; se usa para reiniciar el contador de copia.
bomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.
DAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.
DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.
END inicio ; Cierra el programa y confirma su punto de entrada.
