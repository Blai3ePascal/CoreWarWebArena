(function () {
  const DEFAULT_SETTINGS = {
    coreSize: 8000,
    maxCycles: 80000,
    maxProcesses: 8000,
    maxLength: 300,
    minDistance: 100,
    pSpaceSize: 512,
    warriors: 2,
  };

  const OPCODES = new Set([
    'DAT', 'MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD', 'JMP', 'JMZ', 'JMN', 'DJN',
    'CMP', 'SEQ', 'SNE', 'SLT', 'SPL', 'NOP', 'LDP', 'STP'
  ]);

  const PSEUDO_OPS = new Set(['ORG', 'END', 'EQU', 'FOR', 'ROF', 'PIN']);
  const MODIFIERS = new Set(['A', 'B', 'AB', 'BA', 'F', 'X', 'I']);
  const MODES = new Set(['#', '$', '@', '*', '<', '>', '{', '}']);
  const WARRIOR_IDS = ['A', 'B'];

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function cloneInstruction(cell) {
    return {
      op: cell.op,
      mod: cell.mod,
      aMode: cell.aMode,
      aVal: cell.aVal,
      bMode: cell.bMode,
      bVal: cell.bVal,
      owner: cell.owner || null,
      source: cell.source || null,
    };
  }

  function makeEmptyInstruction() {
    return {
      op: 'DAT',
      mod: 'F',
      aMode: '$',
      aVal: 0,
      bMode: '$',
      bVal: 0,
      owner: null,
      source: null,
    };
  }

  function formatInstruction(inst) {
    const op = `${inst.op}.${inst.mod}`;
    return `${op} ${inst.aMode}${inst.aVal}, ${inst.bMode}${inst.bVal}`;
  }

  function parseMetadata(source) {
    const meta = {
      name: 'Nameless',
      author: '',
      strategy: [],
      standard: '94',
    };

    source.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith(';')) return;
      const lower = trimmed.toLowerCase();
      if (lower.startsWith(';name')) meta.name = trimmed.slice(5).trim() || meta.name;
      if (lower.startsWith(';author')) meta.author = trimmed.slice(7).trim() || meta.author;
      if (lower.startsWith(';strategy')) meta.strategy.push(trimmed.slice(9).trim());
      if (lower.startsWith(';redcode-')) meta.standard = trimmed.slice(9).trim();
    });

    return meta;
  }

  function stripComment(line) {
    const semi = line.indexOf(';');
    return semi >= 0 ? line.slice(0, semi) : line;
  }

  function tokenizeWords(line) {
    return line.trim().split(/\s+/).filter(Boolean);
  }

  function normalizeLabelToken(token) {
    return token ? token.replace(/:$/, '') : token;
  }

  function splitOpcodeModifier(token) {
    const [opRaw, modRaw] = token.split('.');
    return {
      opcode: opRaw ? opRaw.toUpperCase() : '',
      modifier: modRaw ? modRaw.toUpperCase() : null,
    };
  }

  function safeEvalExpression(expression, resolver) {
    let expr = expression.trim();
    if (!expr) return 0;

    expr = expr.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (name) => {
      const value = resolver(name);
      if (value === undefined || value === null || Number.isNaN(value)) {
        throw new Error(`Símbolo no resuelto: ${name}`);
      }
      return String(value);
    });

    if (!/^[0-9+\-*/%()\s.]+$/.test(expr)) {
      throw new Error(`Expresión inválida: ${expression}`);
    }

    const value = Function(`"use strict"; return (${expr});`)();
    if (!Number.isFinite(value)) {
      throw new Error(`Expresión no finita: ${expression}`);
    }
    return Math.trunc(value);
  }

  function preprocessForLoops(rawLines, constantsResolver) {
    let index = 0;

    function parseBlock(loopVar) {
      const output = [];
      while (index < rawLines.length) {
        const original = rawLines[index++];
        const uncommented = stripComment(original).trim();
        if (!uncommented) {
          output.push(original);
          continue;
        }

        const tokens = tokenizeWords(uncommented);
        const first = tokens[0] ? normalizeLabelToken(tokens[0]).toUpperCase() : '';
        const second = tokens[1] ? tokens[1].toUpperCase() : '';

        if (first === 'ROF') {
          return output;
        }

        const isFor = first === 'FOR' || second === 'FOR';
        if (isFor) {
          const localVar = first === 'FOR' ? null : normalizeLabelToken(tokens[0]);
          const expr = first === 'FOR' ? tokens.slice(1).join(' ') : tokens.slice(2).join(' ');
          const count = Math.max(0, safeEvalExpression(expr, constantsResolver));
          const inner = parseBlock(localVar);
          for (let i = 1; i <= count; i += 1) {
            inner.forEach((line) => {
              let expanded = line;
              if (localVar) {
                const re = new RegExp(`&${localVar}`, 'gi');
                expanded = expanded.replace(re, String(i));
              }
              if (loopVar) {
                const reParent = new RegExp(`&${loopVar}`, 'gi');
                expanded = expanded.replace(reParent, String(i));
              }
              output.push(expanded);
            });
          }
          continue;
        }

        output.push(original);
      }
      return output;
    }

    return parseBlock(null);
  }

  function compileWarrior(source, userSettings = {}) {
    const settings = { ...DEFAULT_SETTINGS, ...userSettings };
    const metadata = parseMetadata(source);
    const rawLines = source.replace(/\t/g, ' ').split(/\r?\n/);
    const constants = {
      CORESIZE: settings.coreSize,
      MAXCYCLES: settings.maxCycles,
      MAXPROCESSES: settings.maxProcesses,
      WARRIORS: settings.warriors,
      MAXLENGTH: settings.maxLength,
      MINDISTANCE: settings.minDistance,
      PSPACESIZE: settings.pSpaceSize,
      VERSION: 94,
    };

    const preprocessed = preprocessForLoops(rawLines, (name) => {
      if (Object.prototype.hasOwnProperty.call(constants, name.toUpperCase())) return constants[name.toUpperCase()];
      return 0;
    });

    const equs = {};
    const filtered = [];
    let pinValue = null;

    for (let lineNumber = 0; lineNumber < preprocessed.length; lineNumber += 1) {
      const original = preprocessed[lineNumber];
      const code = stripComment(original).trim();
      if (!code) continue;
      const tokens = tokenizeWords(code);
      if (!tokens.length) continue;
      const first = normalizeLabelToken(tokens[0]);
      const firstUpper = first.toUpperCase();
      const secondUpper = tokens[1] ? tokens[1].toUpperCase() : '';

      if (secondUpper === 'EQU') {
        equs[first] = tokens.slice(2).join(' ');
        continue;
      }
      if (firstUpper === 'PIN') {
        pinValue = tokens.slice(1).join(' ') || '0';
        continue;
      }
      if (secondUpper === 'PIN') {
        pinValue = tokens.slice(2).join(' ') || '0';
        continue;
      }
      filtered.push({ original, code, lineNumber: lineNumber + 1 });
    }

    const labels = {};
    const parsedLines = [];
    let address = 0;
    let entryExpr = null;

    for (let i = 0; i < filtered.length; i += 1) {
      const { original, code, lineNumber } = filtered[i];
      const tokens = tokenizeWords(code);
      let cursor = 0;
      let label = null;
      const first = normalizeLabelToken(tokens[0]);
      const firstUpper = first.toUpperCase();
      const firstSplit = splitOpcodeModifier(firstUpper);

      if (!OPCODES.has(firstSplit.opcode) && !PSEUDO_OPS.has(firstUpper)) {
        label = first;
        if (labels[label] !== undefined) throw new Error(`Etiqueta duplicada: ${label} (línea ${lineNumber})`);
        labels[label] = address;
        cursor = 1;
      }

      if (cursor >= tokens.length) continue;
      const opcodeToken = tokens[cursor];
      const { opcode, modifier } = splitOpcodeModifier(opcodeToken.toUpperCase());
      const operandText = code.split(/\s+/).slice(cursor + 1).join(' ').trim();

      if (opcode === 'ORG' || opcode === 'END') {
        if (operandText) entryExpr = operandText;
        if (opcode === 'END') break;
        continue;
      }

      if (!OPCODES.has(opcode)) {
        throw new Error(`Opcode o pseudo-op no soportado en línea ${lineNumber}: ${opcodeToken}`);
      }

      parsedLines.push({
        lineNumber,
        original,
        label,
        address,
        opcode,
        modifier,
        operandText,
      });
      address += 1;
    }

    if (parsedLines.length > settings.maxLength) {
      throw new Error(`El guerrero excede MAXLENGTH (${settings.maxLength}).`);
    }

    function symbolResolver(name, currentAddress, depth = 0) {
      if (depth > 20) throw new Error(`Resolución recursiva excesiva en símbolo: ${name}`);
      const upper = name.toUpperCase();
      if (Object.prototype.hasOwnProperty.call(constants, upper)) return constants[upper];
      if (Object.prototype.hasOwnProperty.call(labels, name)) return labels[name] - currentAddress;
      if (Object.prototype.hasOwnProperty.call(labels, upper)) return labels[upper] - currentAddress;
      if (Object.prototype.hasOwnProperty.call(equs, name)) {
        return safeEvalExpression(equs[name], (inner) => symbolResolver(inner, currentAddress, depth + 1));
      }
      if (Object.prototype.hasOwnProperty.call(equs, upper)) {
        return safeEvalExpression(equs[upper], (inner) => symbolResolver(inner, currentAddress, depth + 1));
      }
      return undefined;
    }

    function parseOperand(text, defaultMode) {
      const trimmed = (text || '').trim();
      if (!trimmed) return { mode: defaultMode, expr: '0' };
      const maybeMode = trimmed[0];
      if (MODES.has(maybeMode)) {
        return { mode: maybeMode, expr: trimmed.slice(1).trim() || '0' };
      }
      return { mode: defaultMode, expr: trimmed };
    }

    function defaultModifier(op, aMode, bMode) {
      const aImmediate = aMode === '#';
      const bImmediate = bMode === '#';
      if (op === 'DAT' || op === 'NOP') return 'F';
      if (['MOV', 'CMP', 'SEQ', 'SNE'].includes(op)) {
        if (aImmediate) return 'AB';
        if (bImmediate) return 'B';
        return 'I';
      }
      if (['ADD', 'SUB', 'MUL', 'DIV', 'MOD'].includes(op)) {
        if (aImmediate) return 'AB';
        if (bImmediate) return 'B';
        return 'F';
      }
      if (['SLT', 'LDP', 'STP'].includes(op)) {
        if (aImmediate) return 'AB';
        return 'B';
      }
      return 'B';
    }

    const program = parsedLines.map((line) => {
      const parts = line.operandText ? line.operandText.split(',') : [];
      const allowSingle = ['DAT', 'JMP', 'SPL', 'NOP'].includes(line.opcode);
      if (!allowSingle && parts.length < 2) {
        throw new Error(`Falta operando B en línea ${line.lineNumber}`);
      }
      const aDefaultMode = line.opcode === 'DAT' ? '#' : '$';
      const bDefaultMode = line.opcode === 'DAT' ? '#' : '$';
      let aText = parts[0] || '';
      let bText = parts[1] || '';
      if (line.opcode === 'DAT' && parts.length === 1) {
        aText = '0';
        bText = parts[0] || '0';
      }
      const a = parseOperand(aText, aDefaultMode);
      const b = parseOperand(bText, bDefaultMode);
      const modifier = line.modifier || defaultModifier(line.opcode, a.mode, b.mode);

      if (!MODIFIERS.has(modifier)) {
        throw new Error(`Modificador inválido en línea ${line.lineNumber}: ${modifier}`);
      }

      const aVal = mod(safeEvalExpression(a.expr || '0', (name) => symbolResolver(name, line.address)), settings.coreSize);
      const bVal = mod(safeEvalExpression(b.expr || '0', (name) => symbolResolver(name, line.address)), settings.coreSize);

      return {
        op: line.opcode === 'CMP' ? 'SEQ' : line.opcode,
        mod: modifier,
        aMode: a.mode,
        aVal,
        bMode: b.mode,
        bVal,
        owner: null,
        source: line.original.trim(),
      };
    });

    let entryPoint = 0;
    if (entryExpr) {
      entryPoint = mod(safeEvalExpression(entryExpr, (name) => symbolResolver(name, 0)), program.length || 1);
    }

    let pin = null;
    if (pinValue !== null) {
      pin = mod(safeEvalExpression(pinValue, (name) => symbolResolver(name, 0)), settings.pSpaceSize);
    }

    return {
      metadata,
      labels,
      equs,
      program,
      entryPoint,
      pin,
      length: program.length,
      source,
    };
  }

  function pickLoadPoints(settings, lenA, lenB) {
    const max = settings.coreSize;
    const minDist = settings.minDistance;
    const startA = Math.floor(Math.random() * max);
    let startB = mod(startA + Math.floor(max / 2), max);
    if (Math.abs(startB - startA) < minDist) {
      startB = mod(startA + minDist + lenA, max);
    }
    return [startA, startB];
  }

  function createBattle(compiledA, compiledB, userSettings = {}) {
    const settings = { ...DEFAULT_SETTINGS, ...userSettings };
    const core = Array.from({ length: settings.coreSize }, makeEmptyInstruction);
    const [startA, startB] = pickLoadPoints(settings, compiledA.length, compiledB.length);

    const warriors = [compiledA, compiledB].map((compiled, index) => {
      const id = WARRIOR_IDS[index];
      const start = index === 0 ? startA : startB;
      return {
        id,
        name: compiled.metadata.name || `Warrior ${id}`,
        author: compiled.metadata.author || '',
        strategy: compiled.metadata.strategy || [],
        pin: compiled.pin,
        pSpace: null,
        start,
        entry: mod(start + compiled.entryPoint, settings.coreSize),
        program: compiled.program,
        length: compiled.length,
      };
    });

    const sharedSpaces = new Map();
    warriors.forEach((warrior) => {
      const key = warrior.pin == null ? `${warrior.id}-${Math.random()}` : `pin-${warrior.pin}`;
      if (!sharedSpaces.has(key)) {
        const pSpace = Array.from({ length: settings.pSpaceSize }, (_, i) => (i === 0 ? settings.coreSize - 1 : 0));
        sharedSpaces.set(key, pSpace);
      }
      warrior.pSpace = sharedSpaces.get(key);
    });

    warriors.forEach((warrior) => {
      warrior.program.forEach((inst, offset) => {
        const addr = mod(warrior.start + offset, settings.coreSize);
        core[addr] = { ...cloneInstruction(inst), owner: warrior.id };
      });
    });

    return {
      settings,
      core,
      warriors,
      queues: {
        A: [warriors[0].entry],
        B: [warriors[1].entry],
      },
      cycle: 0,
      turn: 0,
      halted: false,
      winner: null,
      winReason: '',
      message: 'Batalla preparada.',
      version: 0,
      lastStep: null,
      debugLog: [],
      visual: {
        lastExecBy: new Array(settings.coreSize).fill(null),
        lastReadBy: new Array(settings.coreSize).fill(null),
        lastWriteBy: new Array(settings.coreSize).fill(null),
        lastTouchedCycle: new Array(settings.coreSize).fill(-1),
      },
    };
  }

  function getWarrior(state, id) {
    return state.warriors.find((w) => w.id === id);
  }

  function recordTouch(state, addr, type, warriorId) {
    if (addr == null) return;
    state.visual.lastTouchedCycle[addr] = state.cycle;
    if (type === 'exec') state.visual.lastExecBy[addr] = warriorId;
    if (type === 'read') state.visual.lastReadBy[addr] = warriorId;
    if (type === 'write') state.visual.lastWriteBy[addr] = warriorId;
  }

  function resolveOperand(state, ip, ir, side, warriorId) {
    const mode = side === 'A' ? ir.aMode : ir.bMode;
    const value = side === 'A' ? ir.aVal : ir.bVal;
    const core = state.core;

    if (mode === '#') {
      const register = side === 'A' ? cloneInstruction(ir) : cloneInstruction(core[ip]);
      recordTouch(state, ip, 'read', warriorId);
      return {
        addr: ip,
        register,
        immediate: true,
        pointerAddr: ip,
      };
    }

    const pointerAddr = mod(ip + value, state.settings.coreSize);
    recordTouch(state, pointerAddr, 'read', warriorId);

    function applyPre(field) {
      core[pointerAddr][field] = mod(core[pointerAddr][field] - 1, state.settings.coreSize);
      recordTouch(state, pointerAddr, 'write', warriorId);
    }

    function applyPost(field) {
      core[pointerAddr][field] = mod(core[pointerAddr][field] + 1, state.settings.coreSize);
      recordTouch(state, pointerAddr, 'write', warriorId);
    }

    let finalAddr = pointerAddr;
    switch (mode) {
      case '$':
        finalAddr = pointerAddr;
        break;
      case '*':
        finalAddr = mod(pointerAddr + core[pointerAddr].aVal, state.settings.coreSize);
        break;
      case '@':
        finalAddr = mod(pointerAddr + core[pointerAddr].bVal, state.settings.coreSize);
        break;
      case '{':
        applyPre('aVal');
        finalAddr = mod(pointerAddr + core[pointerAddr].aVal, state.settings.coreSize);
        break;
      case '<':
        applyPre('bVal');
        finalAddr = mod(pointerAddr + core[pointerAddr].bVal, state.settings.coreSize);
        break;
      case '}':
        finalAddr = mod(pointerAddr + core[pointerAddr].aVal, state.settings.coreSize);
        applyPost('aVal');
        break;
      case '>':
        finalAddr = mod(pointerAddr + core[pointerAddr].bVal, state.settings.coreSize);
        applyPost('bVal');
        break;
      default:
        finalAddr = pointerAddr;
        break;
    }

    recordTouch(state, finalAddr, 'read', warriorId);

    return {
      addr: finalAddr,
      register: cloneInstruction(core[finalAddr]),
      immediate: false,
      pointerAddr,
    };
  }

  function fieldPairs(modifier) {
    switch (modifier) {
      case 'A': return [['aVal', 'aVal']];
      case 'B': return [['bVal', 'bVal']];
      case 'AB': return [['aVal', 'bVal']];
      case 'BA': return [['bVal', 'aVal']];
      case 'F':
      case 'I':
        return [['aVal', 'aVal'], ['bVal', 'bVal']];
      case 'X':
        return [['aVal', 'bVal'], ['bVal', 'aVal']];
      default:
        return [['bVal', 'bVal']];
    }
  }

  function singleFieldForControl(modifier) {
    switch (modifier) {
      case 'A':
      case 'BA':
        return ['aVal'];
      case 'B':
      case 'AB':
        return ['bVal'];
      default:
        return ['aVal', 'bVal'];
    }
  }

  function compareFullInstruction(a, b) {
    return a.op === b.op && a.mod === b.mod && a.aMode === b.aMode && a.aVal === b.aVal && a.bMode === b.bMode && a.bVal === b.bVal;
  }

  function queuePush(state, warriorId, addr) {
    const queue = state.queues[warriorId];
    if (queue.length < state.settings.maxProcesses) queue.push(mod(addr, state.settings.coreSize));
  }

  function finalizeBattleState(state) {
    const aliveA = state.queues.A.length > 0;
    const aliveB = state.queues.B.length > 0;

    if (!aliveA && !aliveB) {
      state.halted = true;
      state.winner = 'Empate';
      state.winReason = 'Ambos guerreros desaparecieron completamente.';
      state.message = state.winReason;
      return state;
    }
    if (!aliveA) {
      state.halted = true;
      state.winner = 'B';
      state.winReason = 'A ha desaparecido completamente.';
      state.message = `Gana B. ${state.winReason}`;
      return state;
    }
    if (!aliveB) {
      state.halted = true;
      state.winner = 'A';
      state.winReason = 'B ha desaparecido completamente.';
      state.message = `Gana A. ${state.winReason}`;
      return state;
    }
    if (state.cycle >= state.settings.maxCycles) {
      state.halted = true;
      state.winner = 'Empate';
      state.winReason = `Empate por límite de ${state.settings.maxCycles} ciclos.`;
      state.message = state.winReason;
      return state;
    }
    return state;
  }

  function executeWarriorTurn(state, warriorId) {
    const queue = state.queues[warriorId];
    if (!queue.length) return null;

    const warrior = getWarrior(state, warriorId);
    const ip = queue.shift();
    const ir = cloneInstruction(state.core[ip]);
    recordTouch(state, ip, 'exec', warriorId);
    const src = resolveOperand(state, ip, ir, 'A', warriorId);
    const dst = resolveOperand(state, ip, ir, 'B', warriorId);
    const nextAddr = mod(ip + 1, state.settings.coreSize);
    let summary = '';
    let died = false;

    function writeDest(mutator) {
      mutator(state.core[dst.addr]);
      state.core[dst.addr].owner = warriorId;
      recordTouch(state, dst.addr, 'write', warriorId);
    }

    switch (ir.op) {
      case 'DAT':
        died = true;
        summary = 'ejecuta DAT y el proceso muere';
        break;

      case 'NOP':
        queuePush(state, warriorId, nextAddr);
        summary = 'ejecuta NOP';
        break;

      case 'MOV': {
        if (ir.mod === 'I') {
          state.core[dst.addr] = { ...cloneInstruction(src.register), owner: warriorId };
          recordTouch(state, dst.addr, 'write', warriorId);
        } else {
          writeDest((cell) => {
            fieldPairs(ir.mod).forEach(([sf, df]) => {
              cell[df] = src.register[sf];
            });
          });
        }
        queuePush(state, warriorId, nextAddr);
        summary = `copia ${formatInstruction(src.register)} en ${dst.addr}`;
        break;
      }

      case 'ADD':
      case 'SUB':
      case 'MUL':
      case 'DIV':
      case 'MOD': {
        const effectiveMod = ir.mod === 'I' ? 'F' : ir.mod;
        let divisionByZero = false;
        writeDest((cell) => {
          fieldPairs(effectiveMod).forEach(([sf, df]) => {
            const s = src.register[sf];
            const d = cell[df];
            let value = d;
            if (ir.op === 'ADD') value = mod(d + s, state.settings.coreSize);
            if (ir.op === 'SUB') value = mod(d - s, state.settings.coreSize);
            if (ir.op === 'MUL') value = mod(d * s, state.settings.coreSize);
            if (ir.op === 'DIV') {
              if (s === 0) {
                divisionByZero = true;
                value = d;
              } else {
                value = mod(Math.trunc(d / s), state.settings.coreSize);
              }
            }
            if (ir.op === 'MOD') {
              if (s === 0) {
                divisionByZero = true;
                value = d;
              } else {
                value = mod(d % s, state.settings.coreSize);
              }
            }
            cell[df] = value;
          });
        });
        if (divisionByZero) {
          died = true;
          summary = `${ir.op} con división por cero`; 
        } else {
          queuePush(state, warriorId, nextAddr);
          summary = `ejecuta ${ir.op}`;
        }
        break;
      }

      case 'JMP':
        queuePush(state, warriorId, src.addr);
        summary = `salta a ${src.addr}`;
        break;

      case 'SPL': {
        queuePush(state, warriorId, nextAddr);
        const before = state.queues[warriorId].length;
        queuePush(state, warriorId, src.addr);
        const after = state.queues[warriorId].length;
        summary = after > before ? `divide proceso hacia ${src.addr}` : 'intenta dividir, pero alcanzó MAXPROCESSES';
        break;
      }

      case 'JMZ': {
        const vals = singleFieldForControl(ir.mod).map((field) => dst.register[field]);
        const cond = vals.every((v) => v === 0);
        queuePush(state, warriorId, cond ? src.addr : nextAddr);
        summary = cond ? `salta a ${src.addr} porque B es cero` : 'no salta';
        break;
      }

      case 'JMN': {
        const vals = singleFieldForControl(ir.mod).map((field) => dst.register[field]);
        const cond = vals.some((v) => v !== 0);
        queuePush(state, warriorId, cond ? src.addr : nextAddr);
        summary = cond ? `salta a ${src.addr} porque B no es cero` : 'no salta';
        break;
      }

      case 'DJN': {
        const fields = singleFieldForControl(ir.mod);
        writeDest((cell) => {
          fields.forEach((field) => {
            cell[field] = mod(cell[field] - 1, state.settings.coreSize);
          });
        });
        const cond = fields.some((field) => state.core[dst.addr][field] !== 0);
        queuePush(state, warriorId, cond ? src.addr : nextAddr);
        summary = cond ? `decrementa y salta a ${src.addr}` : 'decrementa y no salta';
        break;
      }

      case 'SEQ': {
        let cond = false;
        if (ir.mod === 'I') {
          cond = compareFullInstruction(src.register, dst.register);
        } else {
          cond = fieldPairs(ir.mod).every(([sf, df]) => src.register[sf] === dst.register[df]);
        }
        queuePush(state, warriorId, mod(ip + (cond ? 2 : 1), state.settings.coreSize));
        summary = cond ? 'encuentra igualdad y salta la siguiente instrucción' : 'no encuentra igualdad';
        break;
      }

      case 'SNE': {
        let cond = false;
        if (ir.mod === 'I') {
          cond = !compareFullInstruction(src.register, dst.register);
        } else {
          cond = fieldPairs(ir.mod).some(([sf, df]) => src.register[sf] !== dst.register[df]);
        }
        queuePush(state, warriorId, mod(ip + (cond ? 2 : 1), state.settings.coreSize));
        summary = cond ? 'detecta diferencia y salta la siguiente instrucción' : 'no detecta diferencia';
        break;
      }

      case 'SLT': {
        const effectiveMod = ir.mod === 'I' ? 'F' : ir.mod;
        const cond = fieldPairs(effectiveMod).every(([sf, df]) => src.register[sf] < dst.register[df]);
        queuePush(state, warriorId, mod(ip + (cond ? 2 : 1), state.settings.coreSize));
        summary = cond ? 'cumple SLT y salta la siguiente instrucción' : 'no cumple SLT';
        break;
      }

      case 'LDP': {
        const effectiveMod = ['F', 'X', 'I'].includes(ir.mod) ? 'B' : ir.mod;
        const pSpace = warrior.pSpace;
        writeDest((cell) => {
          fieldPairs(effectiveMod).forEach(([sf, df]) => {
            const pIndex = mod(src.register[sf], state.settings.pSpaceSize);
            cell[df] = mod(pSpace[pIndex], state.settings.coreSize);
          });
        });
        queuePush(state, warriorId, nextAddr);
        summary = 'carga desde P-space';
        break;
      }

      case 'STP': {
        const effectiveMod = ['F', 'X', 'I'].includes(ir.mod) ? 'B' : ir.mod;
        const pSpace = warrior.pSpace;
        fieldPairs(effectiveMod).forEach(([sf, df]) => {
          const pIndex = mod(dst.register[df], state.settings.pSpaceSize);
          if (pIndex !== 0) pSpace[pIndex] = mod(src.register[sf], state.settings.coreSize);
        });
        queuePush(state, warriorId, nextAddr);
        summary = 'guarda en P-space';
        break;
      }

      default:
        died = true;
        summary = `encuentra opcode no soportado: ${ir.op}`;
        break;
    }

    const stepInfo = {
      cycle: state.cycle,
      warrior: warriorId,
      ip,
      instruction: formatInstruction(ir),
      sourceAddr: src.addr,
      destAddr: dst.addr,
      summary,
      died,
      queueSize: state.queues[warriorId].length,
    };

    state.lastStep = stepInfo;
    state.debugLog.unshift(stepInfo);
    if (state.debugLog.length > 200) state.debugLog.pop();
    return stepInfo;
  }

  function stepBattle(inputState) {
    const state = inputState;
    if (state.halted) return state;

    let tries = 0;
    let executed = null;
    while (tries < state.warriors.length) {
      const warriorId = WARRIOR_IDS[state.turn % state.warriors.length];
      state.turn = (state.turn + 1) % state.warriors.length;
      if (state.queues[warriorId].length > 0) {
        executed = executeWarriorTurn(state, warriorId);
        break;
      }
      tries += 1;
    }

    state.cycle += 1;
    state.version += 1;
    finalizeBattleState(state);

    if (executed) {
      state.message = `[${executed.cycle}] ${executed.warrior} @${executed.ip}: ${executed.summary}`;
    }

    return state;
  }

  function runSteps(state, count) {
    for (let i = 0; i < count; i += 1) {
      if (state.halted) break;
      stepBattle(state);
    }
    return state;
  }

  const api = {
    DEFAULT_SETTINGS,
    compileWarrior,
    createBattle,
    stepBattle,
    runSteps,
    formatInstruction,
    cloneInstruction,
    makeEmptyInstruction,
  };

  if (typeof window !== "undefined") window.CoreWarEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
