(function(){
const w = (id,name,type,description,code,level='Inicial')=>({id,name,type,description,code:`;redcode-94\n;name ${name}\n;author Sara y Pascal\n${code}`,level});
const warriors=[
w('imp','Imp','Replicador','Una sola instrucción que avanza copiándose.','MOV.I 0, 1'),
w('dwarf','Dwarf','Bombardero','Recorre el núcleo dejando instrucciones DAT.','ORG loop\nloop ADD.AB #4, bomb\n     MOV.I bomb, @bomb\n     JMP loop\nbomb DAT.F #0, #0'),
w('stone','Piedra','Bombardero','Salta de siete en siete para cubrir otros patrones.','ORG loop\nloop ADD.AB #7, ptr\n     MOV.I bomb, @ptr\n     JMP loop\nptr DAT.F #0, #20\nbomb DAT.F #0, #0'),
w('gate','Centinela','Defensivo','Mantiene una puerta de decremento para frenar copias.','ORG gate\ngate JMP.B gate, <gate-4','Intermedio'),
w('twins','Gemelos','Multiproceso','Abre dos frentes de replicación.','SPL 2\nMOV.I 0, 1\nMOV.I 0, 1','Intermedio'),
w('scanner','Explorador','Escáner','Compara dos celdas y bombardea donde encuentra actividad.','ORG scan\nscan SEQ.I 12, 16\n     JMP hit\n     ADD.F step, scan\n     JMP scan\nhit MOV.I bomb, @scan\n    ADD.F step, scan\n    JMP scan\nstep DAT #12, #12\nbomb DAT #0, #0','Avanzado'),
w('spiral','Espiral','Bombardero','Bombardea con un salto amplio y un contador indirecto.','ORG loop\nloop ADD.AB #121, ptr\n     MOV.I bomb, @ptr\n     JMP loop\nptr DAT #0, #12\nbomb DAT #0, #0','Intermedio'),
w('silk','Seda','Replicador','Explora la copia indirecta y la creación de procesos.','SPL 1\nMOV.I }-1, >-1\nJMP -2','Avanzado')
];
warriors.push({"id": "daredevil", "name": "DAREDEVIL", "type": "Colección original", "description": "Guerrero conservado de la arena original.", "code": ";redcode-94b\n;assert 1\n;name DAREDEVIL\n;strategy EMPATAR\n;date 2022-Feb-25\n;version 1\n\t\torg main\n\ndare:\t\tdat #0, #5\ncero:\t\tdat #0, #0\ncounter: \tdat #0, #500\n\nimp:\t\tmov 0, 1\n\nmain:\t\tmov imp, @counter\n\t\tspl @counter-1\n\t\tadd #800, counter\n\t\tadd #1, cero\n\t\tseq @dare, @cero\n\t\tjmp main\n", "level": "Avanzado"},{"id": "motherland", "name": "MOTHERLAND", "type": "Colección original", "description": "Guerrero conservado de la arena original.", "code": ";redcode-94b\n;assert 1\n;name MOTHERLAND\n;strategy kill_the_opponent\n;date 2022-Feb-25\n;version 1\n\n\torg loop\n\nbomb: \tdat #0, #12\n\nloop:\tadd #121, bomb\n\tmov bomb, @bomb\n\tjmp loop\n", "level": "Avanzado"},{"id": "magoReal", "name": "MAGO DEL TIEMPO R", "type": "Colección original", "description": "Guerrero conservado de la arena original.", "code": ";redcode\n;name MAGO DEL TIEMPO R\n;version 2\n\ngate equ -10\nstep equ 1252\ntime equ 1930\n\ncoso   spl  0,     <gate+1\n       mov  coso, @2\n       add #step,   1\n       mov  patapum, <1 - (step*time)\n       jmp  -3,     0\n       mov  1,     <coso-16\n       \npatapum  dat <gate-2, <gate-3\nend coso\n", "level": "Avanzado"},{"id": "sabioOscuro", "name": "EL SABIO OSCURO", "type": "Colección original", "description": "Guerrero conservado de la arena original.", "code": ";redcode-94b\n;assert 1\n;name EL SABIO OSCURO\n;kill <NEW_WARRIOR>\n;strategy kill_the_opponent\n;date 2019-Feb-06\n;version 1\n\n\nSRC\tmov\t FIX,\t-1\t;set up the SouRCe counter (and do bonus attack)\nCPY\tmov\t@SRC-1,\t<DST\t;fat, unrolled loop to copy...\n\tmov\t<SRC-1,\t<DST\t;does it in 15 cycles\n\tmov\t<SRC-1,\t<DST\n\tmov\t<SRC-1,\t<DST\n\tdjn\t CPY,\t SRC-1\nDST\tspl\t @DST,\t 5000\t;activate new copy\nHNT\tjmz\t HNT,\t<DST\t;search for a new spot...\n\tjmp\t SRC\t\t;copy again\nFIX\tdat\t #0,\t #12\t;this is the starting value for SRC-1\n\tdat\t #0,\t #0\t;death-dealin' data\n\tdat\t #0,\t #1\n\tend\t SRC\n", "level": "Avanzado"});
// BEGIN FORJA BANK
warriors.push(...[
  {
    "id": "forja-01",
    "name": "chispa del alba",
    "author": "Sara",
    "type": "Replicador",
    "level": "Inicial",
    "description": "Una instrucción basta para avanzar por toda la memoria.",
    "collection": "forja",
    "code": ";redcode-94\n;name chispa del alba\n;author Sara\n;strategy Una instrucción basta para avanzar por toda la memoria.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I 0, 1 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 17,
        "losses": 3,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "3ed6e9c767b2de76a8fbbb6e8d02d2758f7ddd1a47bce506575f8669420b0d16"
    }
  },
  {
    "id": "forja-02",
    "name": "sendero de hierro",
    "author": "Pascal",
    "type": "Replicador",
    "level": "Inicial",
    "description": "Una cadena de 2 instrucciones conserva por delante sus próximas copias.",
    "collection": "forja",
    "code": ";redcode-94\n;name sendero de hierro\n;author Pascal\n;strategy Una cadena de 2 instrucciones conserva por delante sus próximas copias.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I 0, 2 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 2 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 12,
        "losses": 8,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "7d65d0d2c3d68e724abdbda6b2442d42f73748504bee3570566af9becd6bfa49"
    }
  },
  {
    "id": "forja-03",
    "name": "marcha de los titanes",
    "author": "Pascal",
    "type": "Replicador",
    "level": "Inicial",
    "description": "Una cadena de 3 instrucciones conserva por delante sus próximas copias.",
    "collection": "forja",
    "code": ";redcode-94\n;name marcha de los titanes\n;author Pascal\n;strategy Una cadena de 3 instrucciones conserva por delante sus próximas copias.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 3 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 8,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "a1bc6c0623ab4910b573342d5aa8a2347337183e7f15418199f811b169499bd3"
    }
  },
  {
    "id": "forja-04",
    "name": "legión del amanecer",
    "author": "Sara",
    "type": "Replicador",
    "level": "Inicial",
    "description": "Una cadena de 4 instrucciones conserva por delante sus próximas copias.",
    "collection": "forja",
    "code": ";redcode-94\n;name legión del amanecer\n;author Sara\n;strategy Una cadena de 4 instrucciones conserva por delante sus próximas copias.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nMOV.I 0, 4 ; Copia esta instrucción hacia delante; las copias permiten continuar la marcha.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 2,
        "losses": 18,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "c130a082807452e7498b31f26e0e30d7d11fd6562cf107fad3365b1bded95852"
    }
  },
  {
    "id": "forja-05",
    "name": "juramento eterno",
    "author": "Sara",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "El bucle mínimo para comprender qué significa seguir vivo.",
    "collection": "forja",
    "code": ";redcode-94\n;name juramento eterno\n;author Sara\n;strategy El bucle mínimo para comprender qué significa seguir vivo.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 18,
        "losses": 2,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "994131d37b49a4e8b75192d9b3e37efe7eef668f0518c3d2a6c9bd63e0fb3012"
    }
  },
  {
    "id": "forja-06",
    "name": "vigía de obsidiana",
    "author": "Sara",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.",
    "collection": "forja",
    "code": ";redcode-94\n;name vigía de obsidiana\n;author Sara\n;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, <64 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 18,
        "losses": 2,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "6f4a3c611204e11a82ab5612a612ad4caa87b503437cf9a3553d109aed1a9d2b"
    }
  },
  {
    "id": "forja-07",
    "name": "guardián del umbral",
    "author": "Pascal",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.",
    "collection": "forja",
    "code": ";redcode-94\n;name guardián del umbral\n;author Pascal\n;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, >96 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 16,
        "losses": 4,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "5619e5d8034b1ab9fdb556acef2499171cf38765b89afc99daa3d42b56787b63"
    }
  },
  {
    "id": "forja-08",
    "name": "centinela de las brasas",
    "author": "Pascal",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.",
    "collection": "forja",
    "code": ";redcode-94\n;name centinela de las brasas\n;author Pascal\n;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, {128 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 18,
        "losses": 2,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "92425fd564a1edc7f837f9bd08e7534ab153647c839bfb672dbd1ad271d4046f"
    }
  },
  {
    "id": "forja-09",
    "name": "custodio del eclipse",
    "author": "Sara",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.",
    "collection": "forja",
    "code": ";redcode-94\n;name custodio del eclipse\n;author Sara\n;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, }160 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 18,
        "losses": 2,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "a1b025acb0eddd83fd773de35a5fc4049109b5926cb9f69fcdb106941eeaf187"
    }
  },
  {
    "id": "forja-10",
    "name": "baluarte de la aurora",
    "author": "Sara",
    "type": "Defensivo",
    "level": "Inicial",
    "description": "Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.",
    "collection": "forja",
    "code": ";redcode-94\n;name baluarte de la aurora\n;author Sara\n;strategy Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio JMP.B 0, <192 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 18,
        "losses": 2,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "66e8856b0607ca044d4c299786f8e20f72dd4bb4acb098459db9314381e2861b"
    }
  },
  {
    "id": "forja-11",
    "name": "martillo del trueno",
    "author": "Pascal",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 7 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name martillo del trueno\n;author Pascal\n;strategy Bombardeo con salto 7 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #7, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 4,
        "draws": 4,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "528809e01ef3fd883e73b8be48dd8f4dab0084dc58332ee70787e2893c080a38"
    }
  },
  {
    "id": "forja-12",
    "name": "lanza del firmamento",
    "author": "Pascal",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 13 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name lanza del firmamento\n;author Pascal\n;strategy Bombardeo con salto 13 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #13, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 8,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "85a6bdc14c33ecc9d49b4f630dc434bbcb058fb002759b6f23efc405f4d967a6"
    }
  },
  {
    "id": "forja-13",
    "name": "ira del volcán",
    "author": "Pascal",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 37 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name ira del volcán\n;author Pascal\n;strategy Bombardeo con salto 37 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #37, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 6,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "51a4f7ebb3c82f6462c5bb0a2d06c7e06e933f17f260c2714e38ef3e89b333d1"
    }
  },
  {
    "id": "forja-14",
    "name": "colmillo de bronce",
    "author": "Sara",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 73 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name colmillo de bronce\n;author Sara\n;strategy Bombardeo con salto 73 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #73, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 2,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "539b0e2f15427d19dd19bea5cb84e29598ebaa5e056aa15fa04fbbe78fbe7892"
    }
  },
  {
    "id": "forja-15",
    "name": "hacha del destino",
    "author": "Pascal",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 121 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name hacha del destino\n;author Pascal\n;strategy Bombardeo con salto 121 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #121, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "789540e39e040ad971a10eb3aa3d4cbc142f9d31f645e526595bb9081ad67eb0"
    }
  },
  {
    "id": "forja-16",
    "name": "flecha de la tormenta",
    "author": "Sara",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 293 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name flecha de la tormenta\n;author Sara\n;strategy Bombardeo con salto 293 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #293, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 6,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "528e583172e09be41ee69187a3d379b0c7a7af4e56312c4702863547b4c4ff6b"
    }
  },
  {
    "id": "forja-17",
    "name": "garra del infinito",
    "author": "Sara",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 509 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name garra del infinito\n;author Sara\n;strategy Bombardeo con salto 509 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #509, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 11,
        "losses": 9,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "c56d61999c389795be615ce6966fb33bbb6bc475d1bf3d92941f8eac69970c31"
    }
  },
  {
    "id": "forja-18",
    "name": "puño de la montaña",
    "author": "Sara",
    "type": "Bombardero",
    "level": "Intermedio",
    "description": "Bombardeo con salto 1279 y aritmética que protege la zona de su propio código.",
    "collection": "forja",
    "code": ";redcode-94\n;name puño de la montaña\n;author Sara\n;strategy Bombardeo con salto 1279 y aritmética que protege la zona de su propio código.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #1279, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 4,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "c011755cf69ea828452ca09677ac42e8335e38e7631bc7d058974a0c8859aed2"
    }
  },
  {
    "id": "forja-19",
    "name": "marea de cenizas",
    "author": "Pascal",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 1 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name marea de cenizas\n;author Pascal\n;strategy Lanza 1 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "3d67bc2166798398b8354f91f1caaad160006175aec12067fed2e3c4998ad5b3"
    }
  },
  {
    "id": "forja-20",
    "name": "avalancha de acero",
    "author": "Sara",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 2 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name avalancha de acero\n;author Sara\n;strategy Lanza 2 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "ed7470e7ae49437777341e73550a8c1dc961ef6b72cd56d7a33c43912d39b7a7"
    }
  },
  {
    "id": "forja-21",
    "name": "río de las espadas",
    "author": "Pascal",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 3 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name río de las espadas\n;author Pascal\n;strategy Lanza 3 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 2,
        "losses": 18,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "c214221f3b6429a40510ed10e42e7d3edb380ddc03e9508c102dbcb1c03d27f9"
    }
  },
  {
    "id": "forja-22",
    "name": "cascada del abismo",
    "author": "Pascal",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 4 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name cascada del abismo\n;author Pascal\n;strategy Lanza 4 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "c4315f266e0dff8bfcb6db9587f259fe93b6258e830d05c107b45498316d7882"
    }
  },
  {
    "id": "forja-23",
    "name": "vendaval de la forja",
    "author": "Sara",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 6 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name vendaval de la forja\n;author Sara\n;strategy Lanza 6 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 1,
        "losses": 19,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "bb48153be49ae278bab843f7434a72f3140a6fe3f4e537c62f8b78478fec03a1"
    }
  },
  {
    "id": "forja-24",
    "name": "torbellino de ónice",
    "author": "Sara",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 8 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name torbellino de ónice\n;author Sara\n;strategy Lanza 8 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 8,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "b4e11e435cee850fa5d7c2cd4d48b8be46ccdcb1a14750e0dd76f6e9913a2d5a"
    }
  },
  {
    "id": "forja-25",
    "name": "oleada de los reyes",
    "author": "Sara",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 12 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name oleada de los reyes\n;author Sara\n;strategy Lanza 12 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 1,
        "draws": 3,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "5a24c6d10c893802c09011681d963412bffe71981cb76ca8966aa71b18a8ae36"
    }
  },
  {
    "id": "forja-26",
    "name": "tempestad del ocaso",
    "author": "Sara",
    "type": "Barrido",
    "level": "Intermedio",
    "description": "Lanza 16 bombas seguidas antes de comprobar el límite de su franja de ataque.",
    "collection": "forja",
    "code": ";redcode-94\n;name tempestad del ocaso\n;author Sara\n;strategy Lanza 16 bombas seguidas antes de comprobar el límite de su franja de ataque.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #96, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #96 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "2f2f41c53aa940d6697e94981d764451c704f62eee26fa41150a5639fb45d0f7"
    }
  },
  {
    "id": "forja-27",
    "name": "ojo del dragón",
    "author": "Sara",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 1 y responde con una ráfaga de 2 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name ojo del dragón\n;author Sara\n;strategy Examina la memoria con salto 1 y responde con una ráfaga de 2 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #1, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #2 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "dbce2e8fb59afd4708382da268b0e9c7e0da55483499213d18ee118f6fa8b58a"
    }
  },
  {
    "id": "forja-28",
    "name": "oráculo de las sombras",
    "author": "Pascal",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 13 y responde con una ráfaga de 4 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name oráculo de las sombras\n;author Pascal\n;strategy Examina la memoria con salto 13 y responde con una ráfaga de 4 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #13, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 14,
        "losses": 6,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "076ec4e049bbda4d581b7757e93b61f9fabf3bd2ec87615662f155a2a1d2d6f3"
    }
  },
  {
    "id": "forja-29",
    "name": "halcón de medianoche",
    "author": "Pascal",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 73 y responde con una ráfaga de 6 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name halcón de medianoche\n;author Pascal\n;strategy Examina la memoria con salto 73 y responde con una ráfaga de 6 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #73, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 7,
        "losses": 13,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "ae3cb88bd8e4d4d4ff8c6d3ab48cc0460663c63241f02cf55036c3c2f1e69609"
    }
  },
  {
    "id": "forja-30",
    "name": "rastreador del vacío",
    "author": "Pascal",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 293 y responde con una ráfaga de 8 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name rastreador del vacío\n;author Pascal\n;strategy Examina la memoria con salto 293 y responde con una ráfaga de 8 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #293, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #2 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 14,
        "losses": 6,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "14aa62c66acccdcdc4af0c61fcf96f901db0e2b7545e0302a9830f0670017964"
    }
  },
  {
    "id": "forja-31",
    "name": "lince del inframundo",
    "author": "Pascal",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 509 y responde con una ráfaga de 10 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name lince del inframundo\n;author Pascal\n;strategy Examina la memoria con salto 509 y responde con una ráfaga de 10 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #509, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "5697399c0dd66e28093796fe89ec7becd93e7996732e41321abcba2e3c6d007d"
    }
  },
  {
    "id": "forja-32",
    "name": "faro del fin del mundo",
    "author": "Sara",
    "type": "Escáner",
    "level": "Avanzado",
    "description": "Examina la memoria con salto 1279 y responde con una ráfaga de 12 bombas.",
    "collection": "forja",
    "code": ";redcode-94\n;name faro del fin del mundo\n;author Sara\n;strategy Examina la memoria con salto 1279 y responde con una ráfaga de 12 bombas.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio SEQ.I vacio, @puntero ; Compara una instrucción con memoria vacía; si coincide, omite el ataque.\nJMP atacar ; Vuelve a la etiqueta indicada para repetir la estrategia.\nADD.AB #1279, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\natacar MOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nMOV.I bomba, >puntero ; Copia una bomba y después avanza una celda el campo B de puntero.\nSLT.AB #(CORESIZE-96), puntero ; Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\nMOV.AB #128, puntero ; Restaura el campo B del puntero al inicio de la zona segura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nvacio DAT.F $0, $0 ; Patrón de memoria vacía que usa el escáner para comparar.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 4,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "ba4b1d6528d13f187894d29633b8a6dc87692112d0ec1750876ae97d4f2a7c4a"
    }
  },
  {
    "id": "forja-33",
    "name": "meteorito de hierro",
    "author": "Pascal",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 4 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name meteorito de hierro\n;author Pascal\n;strategy Tres instrucciones por ataque. El paso 4 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 4 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #4, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #64 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 8,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "f53ca2ac5634fcd06242e622e29aa56d7e4bd409389a7b8cb73a6dc0b89f9e6b"
    }
  },
  {
    "id": "forja-34",
    "name": "cometa de las almas",
    "author": "Sara",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 8 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name cometa de las almas\n;author Sara\n;strategy Tres instrucciones por ataque. El paso 8 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 8 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #8, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 4,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "7d65228d4671bf0bb042b4985fd7724c8a07faffaacfc4746f774148d5143d57"
    }
  },
  {
    "id": "forja-35",
    "name": "estrella del asedio",
    "author": "Sara",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 16 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name estrella del asedio\n;author Sara\n;strategy Tres instrucciones por ataque. El paso 16 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 16 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #16, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #256 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 6,
        "losses": 12,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "230ed46f30556faf8b10dd538f524fe9a2f6a48872864c2cf650dbcc99ab6521"
    }
  },
  {
    "id": "forja-36",
    "name": "sol de los caídos",
    "author": "Pascal",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 20 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name sol de los caídos\n;author Pascal\n;strategy Tres instrucciones por ataque. El paso 20 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 20 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #20, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #320 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 6,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "15213363f2bad0b1a2a2a5c1fa141b0dfd0fc89123e85a5c469ceafa07fed381"
    }
  },
  {
    "id": "forja-37",
    "name": "luna de los guerreros",
    "author": "Pascal",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 25 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name luna de los guerreros\n;author Pascal\n;strategy Tres instrucciones por ataque. El paso 25 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 25 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #25, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #400 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 5,
        "losses": 15,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "fc8cd9be86eed981bbd85ffa8771c3c5086e717efd94b6e64038bf69dd0f9251"
    }
  },
  {
    "id": "forja-38",
    "name": "corazón de la fortaleza",
    "author": "Sara",
    "type": "Bombardero rápido",
    "level": "Avanzado",
    "description": "Tres instrucciones por ataque. El paso 40 divide el núcleo y la trayectoria evita sus instrucciones activas.",
    "collection": "forja",
    "code": ";redcode-94\n;name corazón de la fortaleza\n;author Sara\n;strategy Tres instrucciones por ataque. El paso 40 divide el núcleo y la trayectoria evita sus instrucciones activas.\n;assert CORESIZE >= 256 && CORESIZE % 40 == 0 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #40, puntero ; Aumenta el campo B del puntero con el salto indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #640 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 6,
        "losses": 14,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "d26a3fdfe9e86c270ef8467843e6f3d2eb57df0e2a80760d345f557f78c65c7d"
    }
  },
  {
    "id": "forja-39",
    "name": "memoria de los antiguos",
    "author": "Pascal",
    "type": "Memoria privada",
    "level": "Intermedio",
    "description": "Ensaya STP y LDP en la posición 1 de P-space. Requiere permitir memoria privada en el torneo.",
    "collection": "forja",
    "code": ";redcode-94\n;name memoria de los antiguos\n;author Pascal\n;strategy Ensaya STP y LDP en la posición 1 de P-space. Requiere permitir memoria privada en el torneo.\n;assert CORESIZE >= 256 && PSPACESIZE >= 128 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio STP.AB #2, #1 ; Guarda el campo A inmediato en la posición indicada de la memoria privada.\nLDP.AB #1, dato ; Recupera la memoria privada en el campo B del dato indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\ndato DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "df466918b7979cc9a82a607763188ee5b92b770b959c2ed43f439635bb76baf0"
    }
  },
  {
    "id": "forja-40",
    "name": "sello del oráculo",
    "author": "Sara",
    "type": "Memoria privada",
    "level": "Intermedio",
    "description": "Ensaya STP y LDP en la posición 7 de P-space. Requiere permitir memoria privada en el torneo.",
    "collection": "forja",
    "code": ";redcode-94\n;name sello del oráculo\n;author Sara\n;strategy Ensaya STP y LDP en la posición 7 de P-space. Requiere permitir memoria privada en el torneo.\n;assert CORESIZE >= 256 && PSPACESIZE >= 128 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio STP.AB #8, #7 ; Guarda el campo A inmediato en la posición indicada de la memoria privada.\nLDP.AB #7, dato ; Recupera la memoria privada en el campo B del dato indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\ndato DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "a22f70c6094305d89ee61cddb46d662bd8d579fab429bb5ef8e6872cf896de9a"
    }
  },
  {
    "id": "forja-41",
    "name": "crónica del fuego",
    "author": "Sara",
    "type": "Memoria privada",
    "level": "Intermedio",
    "description": "Ensaya STP y LDP en la posición 31 de P-space. Requiere permitir memoria privada en el torneo.",
    "collection": "forja",
    "code": ";redcode-94\n;name crónica del fuego\n;author Sara\n;strategy Ensaya STP y LDP en la posición 31 de P-space. Requiere permitir memoria privada en el torneo.\n;assert CORESIZE >= 256 && PSPACESIZE >= 128 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio STP.AB #32, #31 ; Guarda el campo A inmediato en la posición indicada de la memoria privada.\nLDP.AB #31, dato ; Recupera la memoria privada en el campo B del dato indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\ndato DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "5994859ea9baec89be50aaf21b6b64d5111bb9b141ab27893506c9e3098d912e"
    }
  },
  {
    "id": "forja-42",
    "name": "runa del renacer",
    "author": "Sara",
    "type": "Memoria privada",
    "level": "Intermedio",
    "description": "Ensaya STP y LDP en la posición 127 de P-space. Requiere permitir memoria privada en el torneo.",
    "collection": "forja",
    "code": ";redcode-94\n;name runa del renacer\n;author Sara\n;strategy Ensaya STP y LDP en la posición 127 de P-space. Requiere permitir memoria privada en el torneo.\n;assert CORESIZE >= 256 && PSPACESIZE >= 128 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio STP.AB #128, #127 ; Guarda el campo A inmediato en la posición indicada de la memoria privada.\nLDP.AB #127, dato ; Recupera la memoria privada en el campo B del dato indicado.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\ndato DAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 4,
        "losses": 16,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "6bdd6de7f8801d679d4f33f30f3914b6eb4d6dbefe296f01a4940588a0eda201"
    }
  },
  {
    "id": "forja-43",
    "name": "heraldo de dos mundos",
    "author": "Pascal",
    "type": "Multiproceso",
    "level": "Avanzado",
    "description": "Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.",
    "collection": "forja",
    "code": ";redcode-94\n;name heraldo de dos mundos\n;author Pascal\n;strategy Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG entrada ; Elige la etiqueta donde empieza el primer proceso.\nentrada SPL.B inicio, $0 ; Abre una rama en la etiqueta indicada y conserva el proceso original.\nJMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #13, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND entrada ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 2
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 2
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 10,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "cb6a4855a5c6f1e6f32293deda2bc3cd1cad1c9d9e5b0816763ef60363f5b7da"
    }
  },
  {
    "id": "forja-44",
    "name": "gemelos del relámpago",
    "author": "Pascal",
    "type": "Multiproceso",
    "level": "Avanzado",
    "description": "Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.",
    "collection": "forja",
    "code": ";redcode-94\n;name gemelos del relámpago\n;author Pascal\n;strategy Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG entrada ; Elige la etiqueta donde empieza el primer proceso.\nentrada SPL.B inicio, $0 ; Abre una rama en la etiqueta indicada y conserva el proceso original.\nJMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #37, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND entrada ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 2
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 2
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 14,
        "losses": 6,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "a0c2625e8fc9521a94d74e2c2c768ca9c954e0f209dd03ff50d5b718fc9d42df"
    }
  },
  {
    "id": "forja-45",
    "name": "pacto de las dos lunas",
    "author": "Pascal",
    "type": "Multiproceso",
    "level": "Avanzado",
    "description": "Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.",
    "collection": "forja",
    "code": ";redcode-94\n;name pacto de las dos lunas\n;author Pascal\n;strategy Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG entrada ; Elige la etiqueta donde empieza el primer proceso.\nentrada SPL.B inicio, $0 ; Abre una rama en la etiqueta indicada y conserva el proceso original.\nJMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #73, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND entrada ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 2
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 2
        }
      ],
      "vsSabio": {
        "wins": 2,
        "draws": 8,
        "losses": 10,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "192104166dce972c8019adcbbd6c198e77ff1594d26c7fdb03d53f6d17ad5c92"
    }
  },
  {
    "id": "forja-46",
    "name": "alianza de los inmortales",
    "author": "Pascal",
    "type": "Multiproceso",
    "level": "Avanzado",
    "description": "Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.",
    "collection": "forja",
    "code": ";redcode-94\n;name alianza de los inmortales\n;author Pascal\n;strategy Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG entrada ; Elige la etiqueta donde empieza el primer proceso.\nentrada SPL.B inicio, $0 ; Abre una rama en la etiqueta indicada y conserva el proceso original.\nJMP.B 0, $0 ; Mantiene este proceso en un bucle seguro sobre su propia instrucción.\ninicio MOV.I bomba, @puntero ; Copia la bomba a la dirección calculada con el campo B de puntero.\nADD.AB #509, puntero ; Aumenta el campo B del puntero con el salto indicado.\nMOD.AB #(CORESIZE-256), puntero ; Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.\nADD.AB #128, puntero ; Desplaza el resultado a la franja segura, lejos del código propio.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\npuntero DAT.F #0, #128 ; Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.\nbomba DAT.F #0, #0 ; Munición: al ejecutarla, el proceso que la recibe termina.\nEND entrada ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 2
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 2
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 12,
        "losses": 8,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      },
      "sourceSha256": "2601d670d12787184da243d7b22c154f0df734577ff3052b5c8ca93edaa6778d"
    }
  },
  {
    "id": "forja-47",
    "name": "verdugo de las sombras",
    "author": "Sara",
    "type": "Replicador de asalto",
    "level": "Avanzado",
    "description": "Dispersa copias en lotes de 2 instrucciones con salto 997 y lanza 1 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.",
    "collection": "forja",
    "code": ";redcode-94\n;name verdugo de las sombras\n;author Sara\n;strategy Dispersa copias en lotes de 2 instrucciones con salto 997 y lanza 1 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.\ncopia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nDJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.\ndestino SPL.B @destino, 997 ; Arranca otro proceso en el comienzo de la copia recién escrita.\nADD.AB #997, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.\nMOV.I bomba, >destino ; Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\norigen DAT.F #0, #12 ; Longitud total del programa; se usa para reiniciar el contador de copia.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nDAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "sourceSha256": "fa3b37c5f661cefd2f28028ade9ffe81a4be89f80d08e9c5837e8ca335150d25",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 4
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 256
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 20,
        "losses": 0,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      }
    }
  },
  {
    "id": "forja-48",
    "name": "espada del último juicio",
    "author": "Pascal",
    "type": "Replicador de asalto",
    "level": "Avanzado",
    "description": "Dispersa copias en lotes de 4 instrucciones con salto 997 y lanza 1 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.",
    "collection": "forja",
    "code": ";redcode-94\n;name espada del último juicio\n;author Pascal\n;strategy Dispersa copias en lotes de 4 instrucciones con salto 997 y lanza 1 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.\ncopia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nDJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.\ndestino SPL.B @destino, 997 ; Arranca otro proceso en el comienzo de la copia recién escrita.\nADD.AB #997, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.\nMOV.I bomba, >destino ; Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\norigen DAT.F #0, #16 ; Longitud total del programa; se usa para reiniciar el contador de copia.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nDAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "sourceSha256": "56a2e8b935647249f370cddf9f0ad40ef50daf60038e0b2d1275fbf71ce13176",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 256
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 20,
        "losses": 0,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      }
    }
  },
  {
    "id": "forja-49",
    "name": "nexo del apocalipsis",
    "author": "Pascal",
    "type": "Replicador de asalto",
    "level": "Avanzado",
    "description": "Dispersa copias en lotes de 4 instrucciones con salto 997 y lanza 2 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.",
    "collection": "forja",
    "code": ";redcode-94\n;name nexo del apocalipsis\n;author Pascal\n;strategy Dispersa copias en lotes de 4 instrucciones con salto 997 y lanza 2 bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.\ncopia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nDJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.\ndestino SPL.B @destino, 997 ; Arranca otro proceso en el comienzo de la copia recién escrita.\nADD.AB #997, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.\nMOV.I bomba, >destino ; Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.\nMOV.I bomba, >destino ; Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\norigen DAT.F #0, #16 ; Longitud total del programa; se usa para reiniciar el contador de copia.\nbomba DAT.F #0, #1 ; Munición: al ejecutarla, el proceso que la recibe termina.\nDAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "sourceSha256": "481441166a38af41b0d78388b88f6aac685f9ef4241038c22cef24464461549b",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 1
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 1
        }
      ],
      "vsSabio": {
        "wins": 1,
        "draws": 19,
        "losses": 0,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      }
    }
  },
  {
    "id": "forja-50",
    "name": "trono de la eternidad",
    "author": "Sara",
    "type": "Replicador de asalto",
    "level": "Avanzado",
    "description": "Dispersa su programa completo con salto 6283. Sustituye la búsqueda del sabio oscuro por nuevas réplicas; apuesta por la supervivencia de sus procesos.",
    "collection": "forja",
    "code": ";redcode-94\n;name trono de la eternidad\n;author Sara\n;strategy Dispersa su programa completo con salto 6283. Sustituye la búsqueda del sabio oscuro por nuevas réplicas; apuesta por la supervivencia de sus procesos.\n;assert CORESIZE >= 256 ; Reglas necesarias para mantener segura esta estrategia.\nORG inicio ; Elige la etiqueta donde empieza el primer proceso.\ninicio MOV.I origen, -1 ; Coloca antes del programa el contador con la longitud de la nueva copia.\ncopia MOV.I @inicio-1, <destino ; Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.\nMOV.I <inicio-1, <destino ; Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.\nDJN.B copia, inicio-1 ; Resta uno al contador de copia y repite el lote mientras queden instrucciones.\ndestino SPL.B @destino, 6283 ; Arranca otro proceso en el comienzo de la copia recién escrita.\nADD.AB #6283, destino ; Desplaza el destino de la siguiente réplica con el salto elegido.\nJMP inicio ; Vuelve a la etiqueta indicada para repetir la estrategia.\norigen DAT.F #0, #10 ; Longitud total del programa; se usa para reiniciar el contador de copia.\nDAT.F #0, #0 ; Reserva dos valores; un proceso que llegue aquí termina.\nDAT.F #0, #1 ; Reserva dos valores; un proceso que llegue aquí termina.\nEND inicio ; Cierra el programa y confirma su punto de entrada.\n",
    "validation": {
      "version": "forja-1",
      "sourceSha256": "841c15ac1535b3ff6987cc997445daf28e896cc83b0a867d82480abdb05f54f3",
      "profiles": [
        {
          "coreSize": 800,
          "steps": 500000,
          "processes": 5
        },
        {
          "coreSize": 8000,
          "steps": 500000,
          "processes": 255
        }
      ],
      "vsSabio": {
        "wins": 0,
        "draws": 20,
        "losses": 0,
        "total": 20
      },
      "rules": {
        "coreSize": 8000,
        "maxCycles": 20000,
        "maxProcesses": 256,
        "maxLength": 300,
        "minDistance": 100,
        "pSpaceSize": 512,
        "trace": false
      }
    }
  }
]);
// END FORJA BANK
const lessons=[
{title:'El campo de batalla',tag:'01 · Conceptos',text:'Core War enfrenta programas llamados guerreros dentro de una memoria circular compartida. Cada celda contiene una instrucción. No hay un tablero propio: ambos pueden leer y modificar cualquier celda. Gana el guerrero que conserva procesos cuando el rival pierde el último. Si ambos sobreviven al límite de turnos, empatan.',extra:'En un núcleo de 800 celdas, después de la 799 viene la 0. Las direcciones son relativas: en la celda 20, el operando 3 apunta a la 23. Las posiciones iniciales se sortean en cada partida.',kind:0},
{title:'Tu primer Imp',tag:'02 · Copiar',text:'MOV copia información. MOV.I copia la instrucción completa. El Imp usa MOV.I 0, 1: copia su propia instrucción a la celda siguiente y luego la ejecuta. Así se desplaza por el núcleo sin necesitar un salto.',extra:'El modificador .I significa instrucción completa. Cambiar el destino a 2 rompe este Imp: la siguiente celda seguiría siendo DAT y su proceso moriría.',kind:0},
{title:'DAT y los bombarderos',tag:'03 · Atacar',text:'DAT guarda datos, pero al ejecutarse mata el proceso actual. Un bombardero copia instrucciones DAT sobre posiciones del rival. El territorio coloreado no concede la victoria: solo importa que queden procesos capaces de ejecutarse.',extra:'Una bomba es una instrucción DAT. MOV.I bomb, destino copia esa bomba. El atacante debe continuar por una ruta segura para no ejecutar su propia bomba.',kind:1},
{title:'Saltar sin caer',tag:'04 · Flujo',text:'JMP cambia la próxima posición de ejecución. JMP 0 repite su propia instrucción. JMP 2 evita la celda siguiente. Cada operando se calcula desde la celda donde se encuentra la instrucción que lo utiliza.',extra:'Elige una ruta que atraviese NOP y evite DAT. NOP no altera el flujo: pasa a la siguiente instrucción.',kind:2},
{title:'Aritmética y campos',tag:'05 · Datos',text:'Cada instrucción tiene un campo A y un campo B. ADD.AB suma el campo A de origen al campo B de destino. El modo # indica un valor inmediato. ADD.AB #4, contador incrementa en cuatro el campo B de contador.',extra:'La aritmética se envuelve en el tamaño del núcleo. En un núcleo de 800, 799 + 4 equivale a 3. Una etiqueta representa la distancia entre su celda y la instrucción actual.',kind:3},
{title:'Multiplicar procesos',tag:'06 · SPL',text:'SPL crea otro proceso. Primero se encola la continuación del proceso original y después la nueva rama. Los procesos del mismo guerrero se alternan en una cola. DAT elimina un proceso, no necesariamente al guerrero completo.',extra:'Si alcanzas el máximo de procesos, SPL mantiene la continuación pero no crea otra rama. Dos bucles seguros sobreviven; una rama dirigida a DAT desaparece.',kind:4},
{title:'Direccionamiento indirecto',tag:'07 · Punteros',text:'$ es dirección directa; # es inmediato; @ usa el campo B de la celda apuntada; * usa su campo A. < y { decrementan el puntero antes de leer; > y } lo incrementan después de capturar el operando.',extra:'En MOV.I bomba, @puntero, primero se localiza puntero y después se suma su campo B para hallar el destino final. Los operandos A y B se evalúan en ese orden. Prueba Dwarf en la arena con el inspector.',kind:1},
{title:'Comparar y decidir',tag:'08 · Condiciones',text:'SEQ salta una instrucción si los campos elegidos son iguales; SNE lo hace si difieren; SLT si el origen es menor. JMZ salta si el destino vale cero; JMN si no es cero. DJN decrementa y salta mientras el resultado no sea cero.',extra:'Las comparaciones .I incluyen opcode, modificador, modos y valores. Un escáner busca diferencias en memoria antes de lanzar bombas: necesita turnos para localizar a su rival.',kind:2},
{title:'Diseñar y competir',tag:'09 · Estrategia',text:'Combina bombas, copias, escáneres y procesos. Una estrategia puede vencer a otra y perder contra una tercera. Evalúa varias rondas con distintas posiciones iniciales, intercambiando quién comienza. Una única victoria no demuestra que un guerrero sea mejor.',extra:'En los torneos, victoria = 3 puntos y empate = 1. Cada enfrentamiento usa pares de rondas con idénticas posiciones y distinto primer turno. Conserva la semilla para repetirlo en la arena.',kind:4}
];
globalThis.OgunData={warriors,lessons};
})();
