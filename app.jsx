const { useEffect, useMemo, useRef, useState } = React;
const Engine = window.CoreWarEngine;

const WARRIOR_LIBRARY = {
  newWarrior: {
    label: 'Nuevo guerrero',
    source: `;redcode-94
;name Nuevo Guerrero
;author 
;strategy 
ORG start

start   MOV 0, 1
        END start`,
  },
  imp: {
    label: 'Imp',
    source: `;redcode-94
;name Imp
;author A.K. Dewdney
MOV 0, 1`,
  },
  dwarf: {
    label: 'Dwarf',
    source: `;redcode-94
;name Dwarf
;author Example
ADD #4, 3
MOV 2, @2
JMP -2
DAT 0, 0`,
  },
  silkMini: {
    label: 'Silk Mini',
    source: `;redcode-94
;name Silk Mini
;author Demo
SPL 1
MOV }-1, >-1
JMP -2`,
  },
  stoneMini: {
    label: 'Stone Mini',
    source: `;redcode-94
;name Stone Mini
;author Demo
STEP EQU 5
loop  MOV bomb, @ptr
      ADD #STEP, ptr
      JMP loop
ptr   DAT 0, 20
bomb  DAT 0, 0`,
  },
  scanner: {
    label: 'Tiny Scanner',
    source: `;redcode-94
;name Tiny Scanner
;author Demo
step   EQU 12
scan   SEQ.I step, step+4
       JMP hit
       ADD #step, scan
       JMP scan
hit    MOV bomb, @scan
       JMP scan
bomb   DAT 0, 0`,
  },
  impRing: {
    label: 'Imp Ring',
    source: `;redcode-94
;name Imp Ring
;author Demo
MOV.I 0, 1`,
  },
  daredevil: { label: 'DAREDEVIL', source: ";redcode-94b\n;assert 1\n;name DAREDEVIL\n;strategy EMPATAR\n;date 2022-Feb-25\n;version 1\n\t\torg main\n\ndare:\t\tdat #0, #5\ncero:\t\tdat #0, #0\ncounter: \tdat #0, #500\n\nimp:\t\tmov 0, 1\n\nmain:\t\tmov imp, @counter\n\t\tspl @counter-1\n\t\tadd #800, counter\n\t\tadd #1, cero\n\t\tseq @dare, @cero\n\t\tjmp main\n" },
  motherland: { label: 'MOTHERLAND', source: ";redcode-94b\n;assert 1\n;name MOTHERLAND\n;strategy kill_the_opponent\n;date 2022-Feb-25\n;version 1\n\n\torg loop\n\nbomb: \tdat #0, #12\n\nloop:\tadd #121, bomb\n\tmov bomb, @bomb\n\tjmp loop\n" },
  magoReal: { label: 'MAGO DEL TIEMPO R', source: ";redcode\n;name MAGO DEL TIEMPO R\n;version 2\n\ngate equ -10\nstep equ 1252\ntime equ 1930\n\ncoso   spl  0,     <gate+1\n       mov  coso, @2\n       add #step,   1\n       mov  patapum, <1 - (step*time)\n       jmp  -3,     0\n       mov  1,     <coso-16\n       \npatapum  dat <gate-2, <gate-3\nend coso\n" },
  sabioOscuro: { label: 'EL SABIO OSCURO', source: ";redcode-94b\n;assert 1\n;name EL SABIO OSCURO\n;kill <NEW_WARRIOR>\n;strategy kill_the_opponent\n;date 2019-Feb-06\n;version 1\n\n\nSRC\tmov\t FIX,\t-1\t;set up the SouRCe counter (and do bonus attack)\nCPY\tmov\t@SRC-1,\t<DST\t;fat, unrolled loop to copy...\n\tmov\t<SRC-1,\t<DST\t;does it in 15 cycles\n\tmov\t<SRC-1,\t<DST\n\tmov\t<SRC-1,\t<DST\n\tdjn\t CPY,\t SRC-1\nDST\tspl\t @DST,\t 5000\t;activate new copy\nHNT\tjmz\t HNT,\t<DST\t;search for a new spot...\n\tjmp\t SRC\t\t;copy again\nFIX\tdat\t #0,\t #12\t;this is the starting value for SRC-1\n\tdat\t #0,\t #0\t;death-dealin' data\n\tdat\t #0,\t #1\n\tend\t SRC\n" },
};

const BATTLE_PRESETS = {
  impVsDwarf: { label: 'Imp vs Dwarf', a: 'imp', b: 'dwarf' },
  silkVsStone: { label: 'Silk Mini vs Stone Mini', a: 'silkMini', b: 'stoneMini' },
  scannerVsImp: { label: 'Tiny Scanner vs Imp Ring', a: 'scanner', b: 'impRing' },
  dareVsMother: { label: 'DAREDEVIL vs MOTHERLAND', a: 'daredevil', b: 'motherland' },
  magoVsSabio: { label: 'MAGO DEL TIEMPO R vs EL SABIO OSCURO', a: 'magoReal', b: 'sabioOscuro' },
};

const THEME_PRESETS = {
  nebula: {
    label: 'Nebula',
    ui: { bg:'#07111f', bg2:'#0d1728', panel:'#101b30', panel2:'#14233f', line:'#253759', text:'#edf4ff', muted:'#9bb0ce', accent:'#7dd3fc', win:'#34d399', draw:'#fbbf24', danger:'#f87171' },
    core: { empty:'#182235', dat:'#253041', ownerA:'#155e75', ownerB:'#9a3412', writeA:'#16b6d4', writeB:'#fb923c', readA:'#cffafe', readB:'#ffedd5', execA:'#8be9fd', execB:'#fdba74', ipA:'#67e8f9', ipB:'#fed7aa', ipBoth:'#ffffff', hover:'#ffffff' },
  },
  matrix: {
    label: 'Matrix',
    ui: { bg:'#05110a', bg2:'#0b1a11', panel:'#0f1812', panel2:'#122117', line:'#1f4630', text:'#e8fff1', muted:'#95c7a5', accent:'#86efac', win:'#4ade80', draw:'#facc15', danger:'#f87171' },
    core: { empty:'#0d1711', dat:'#1d2d23', ownerA:'#0e9f6e', ownerB:'#65a30d', writeA:'#34d399', writeB:'#a3e635', readA:'#d1fae5', readB:'#ecfccb', execA:'#6ee7b7', execB:'#bef264', ipA:'#a7f3d0', ipB:'#d9f99d', ipBoth:'#ffffff', hover:'#ffffff' },
  },
  ember: {
    label: 'Ember',
    ui: { bg:'#16090b', bg2:'#231014', panel:'#2a1218', panel2:'#351720', line:'#5a2634', text:'#fff1f3', muted:'#e4b2bb', accent:'#fda4af', win:'#fb7185', draw:'#fbbf24', danger:'#f43f5e' },
    core: { empty:'#2a1519', dat:'#402127', ownerA:'#7c3aed', ownerB:'#ea580c', writeA:'#a78bfa', writeB:'#fb923c', readA:'#ede9fe', readB:'#ffedd5', execA:'#c4b5fd', execB:'#fdba74', ipA:'#ddd6fe', ipB:'#fed7aa', ipBoth:'#ffffff', hover:'#ffffff' },
  },
};

const UI_COLOR_FIELDS = [
  ['bg','Fondo'], ['bg2','Fondo 2'], ['panel','Panel'], ['panel2','Control'], ['line','Borde'], ['text','Texto'], ['muted','Texto suave'], ['accent','Acento'], ['win','Victoria'], ['draw','Empate'], ['danger','Derrota']
];
const CORE_COLOR_FIELDS = [
  ['empty','Vacío'], ['dat','DAT'], ['ownerA','Propietario A'], ['ownerB','Propietario B'], ['writeA','Escritura A'], ['writeB','Escritura B'], ['readA','Lectura A'], ['readB','Lectura B'], ['execA','Exec A'], ['execB','Exec B'], ['ipA','IP A'], ['ipB','IP B'], ['ipBoth','IP ambos'], ['hover','Hover']
];

function cloneTheme(theme) {
  return { label: theme.label, ui: {...theme.ui}, core: {...theme.core} };
}
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function summarizeQueue(queue) { if (!queue.length) return 'vacía'; const p = queue.slice(0, 12).join(', '); return queue.length > 12 ? `${p}…` : p; }
function settingsFrom(maxCycles) { return { ...Engine.DEFAULT_SETTINGS, maxCycles: clamp(Number(maxCycles) || Engine.DEFAULT_SETTINGS.maxCycles, 1, 500000) }; }
function safeParse(value, fallback) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function readStoredTheme() {
  try {
    const preset = localStorage.getItem('corewar.themePreset') || 'nebula';
    const custom = safeParse(localStorage.getItem('corewar.themeCustom'), null);
    if (custom?.ui && custom?.core) return { preset, theme: custom };
  } catch {}
  return { preset: 'nebula', theme: cloneTheme(THEME_PRESETS.nebula) };
}
function readStoredText(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : v; } catch { return fallback; } }
function buildFilename(source, fallback) {
  const nameLine = source.split(/\r?\n/).find((line) => /^\s*;\s*name\s+/i.test(line));
  const raw = nameLine ? nameLine.replace(/^\s*;\s*name\s+/i, '').trim() : fallback;
  const safe = raw.toLowerCase().replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '');
  return `${safe || fallback}.red`;
}
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function validateSource(source, settings) {
  try { return { ok: true, compiled: Engine.compileWarrior(source, settings) }; }
  catch (error) { return { ok: false, error: error?.message || String(error) }; }
}
function buildValidationView(result) {
  if (!result) return null;
  if (!result.ok) return { ok:false, error: result.error };
  const c = result.compiled;
  return { ok:true, name:c.metadata.name || 'Nameless', author:c.metadata.author || '—', length:c.length, entryPoint:c.entryPoint, pin:c.pin == null ? '—' : c.pin, labels:Object.keys(c.labels || {}).length };
}
function countOwnership(core) {
  let a = 0, b = 0;
  for (const cell of core) {
    if (cell.owner === 'A') a += 1;
    else if (cell.owner === 'B') b += 1;
  }
  return { A: a, B: b };
}
function createNewWarriorTemplate(side) {
  const n = side === 'A' ? 'Nuevo Guerrero A' : 'Nuevo Guerrero B';
  return `;redcode-94\n;name ${n}\n;author \n;strategy \nORG start\n\nstart   MOV 0, 1\n        END start`;
}

function LineNumberEditor({ value, onChange, ariaLabel }) {
  const gutterRef = useRef(null);
  const textRef = useRef(null);
  const lineNumbers = useMemo(() => Array.from({ length: Math.max(1, value.split(/\n/).length) }, (_, i) => i + 1).join('\n'), [value]);
  function syncScroll() {
    if (gutterRef.current && textRef.current) gutterRef.current.scrollTop = textRef.current.scrollTop;
  }
  return (
    <div className="code-editor-wrap">
      <pre ref={gutterRef} className="line-gutter" aria-hidden="true">{lineNumbers}</pre>
      <textarea ref={textRef} className="code-textarea" spellCheck="false" value={value} aria-label={ariaLabel} onScroll={syncScroll} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CollapsiblePanel({ title, children, defaultOpen=false, right=null, className='' }) {
  return (
    <details className={`panel collapsible ${className}`} open={defaultOpen}>
      <summary className="panel-summary">
        <span className="summary-title">{title}</span>
        <span className="summary-right">{right}<span className="summary-chevron">▾</span></span>
      </summary>
      <div className="panel-body">{children}</div>
    </details>
  );
}

function App() {
  const storedTheme = useMemo(() => readStoredTheme(), []);
  const defaultBattle = BATTLE_PRESETS.impVsDwarf;
  const [themePreset, setThemePreset] = useState(storedTheme.preset);
  const [theme, setTheme] = useState(storedTheme.theme);
  const [battlePresetKey, setBattlePresetKey] = useState('impVsDwarf');
  const [warriorPresetA, setWarriorPresetA] = useState(defaultBattle.a);
  const [warriorPresetB, setWarriorPresetB] = useState(defaultBattle.b);
  const [codeA, setCodeA] = useState(() => readStoredText('corewar.draft.A', WARRIOR_LIBRARY[defaultBattle.a].source));
  const [codeB, setCodeB] = useState(() => readStoredText('corewar.draft.B', WARRIOR_LIBRARY[defaultBattle.b].source));
  const [maxCycles, setMaxCycles] = useState(80000);
  const [runDelay, setRunDelay] = useState(8);
  const [running, setRunning] = useState(false);
  const [turboActive, setTurboActive] = useState(false);
  const [tieBreakByCore, setTieBreakByCore] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [notice, setNotice] = useState('Listo. Valida A+B, compila y ejecuta.');
  const [validationA, setValidationA] = useState(null);
  const [validationB, setValidationB] = useState(null);
  const [validatedOk, setValidatedOk] = useState(false);
  const [compiledOk, setCompiledOk] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerModalData, setWinnerModalData] = useState(null);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputARef = useRef(null);
  const fileInputBRef = useRef(null);
  const previousHaltedRef = useRef(false);

  const [sim, setSim] = useState(() => {
    const settings = settingsFrom(80000);
    const compiledA = Engine.compileWarrior(WARRIOR_LIBRARY[defaultBattle.a].source, settings);
    const compiledB = Engine.compileWarrior(WARRIOR_LIBRARY[defaultBattle.b].source, settings);
    return { ...Engine.createBattle(compiledA, compiledB, settings) };
  });

  function markDirty(message='Cambios pendientes. Valida A+B para continuar.') {
    setValidatedOk(false);
    setCompiledOk(false);
    setRunning(false);
    setNotice(message);
  }

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.ui).forEach(([key, value]) => root.style.setProperty(`--${key}`, value));
    try {
      localStorage.setItem('corewar.themePreset', themePreset);
      localStorage.setItem('corewar.themeCustom', JSON.stringify(theme));
    } catch {}
  }, [theme, themePreset]);

  useEffect(() => {
    try {
      localStorage.setItem('corewar.draft.A', codeA);
      localStorage.setItem('corewar.draft.B', codeB);
    } catch {}
  }, [codeA, codeB]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    const delay = turboActive ? 1 : clamp(Number(runDelay) || 8, 1, 1000);
    timerRef.current = setInterval(() => {
      setSim((prev) => {
        const next = turboActive ? Engine.runSteps(prev, 120) : Engine.stepBattle(prev);
        return { ...next };
      });
    }, delay);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running, turboActive, runDelay]);

  useEffect(() => { if (sim.halted) setRunning(false); }, [sim.halted]);

  const hoverCell = useMemo(() => hoverIndex == null ? null : sim.core[hoverIndex] || null, [hoverIndex, sim]);
  const currentIPs = useMemo(() => { const s = new Set(); sim.queues.A.forEach((v) => s.add(`A:${v}`)); sim.queues.B.forEach((v) => s.add(`B:${v}`)); return s; }, [sim]);
  const ownership = useMemo(() => countOwnership(sim.core), [sim.core, sim.version, sim.cycle]);

  const resolvedOutcome = useMemo(() => {
    let resolvedWinner = sim.winner;
    let reason = sim.winReason || sim.message;
    if (tieBreakByCore && sim.halted && sim.winner === 'Empate') {
      if (ownership.A !== ownership.B) {
        resolvedWinner = ownership.A > ownership.B ? 'A' : 'B';
        reason = `Desempate por núcleo: A=${ownership.A} · B=${ownership.B}.`;
      } else if (sim.queues.A.length !== sim.queues.B.length) {
        resolvedWinner = sim.queues.A.length > sim.queues.B.length ? 'A' : 'B';
        reason = `Desempate por procesos vivos: A=${sim.queues.A.length} · B=${sim.queues.B.length}.`;
      } else {
        resolvedWinner = 'A';
        reason = 'Desempate determinista final a favor de A.';
      }
    }
    const winnerWarrior = resolvedWinner === 'A' ? sim.warriors?.[0] : resolvedWinner === 'B' ? sim.warriors?.[1] : null;
    return { resolvedWinner, reason, winnerWarrior };
  }, [sim, tieBreakByCore, ownership]);

  const outcome = useMemo(() => {
    const aliveA = sim.queues.A.length;
    const aliveB = sim.queues.B.length;
    const names = { A: sim.warriors?.[0]?.name || 'Guerrero A', B: sim.warriors?.[1]?.name || 'Guerrero B' };
    if (!sim.halted) return { className:'outcome-live', overline:'Combate en curso', title:`${names.A} vs ${names.B}`, subtitle: sim.message || 'Batalla preparada.', emblem:'⚔️', details:`Procesos vivos — A: ${aliveA} · B: ${aliveB} · Núcleo — A: ${ownership.A} · B: ${ownership.B}` };
    if (resolvedOutcome.resolvedWinner === 'A') return { className:'outcome-a', overline:'Victoria total', title:`${names.A} gana`, subtitle: resolvedOutcome.reason || 'B ha desaparecido completamente.', emblem:'A', details:`Autoría: ${sim.warriors?.[0]?.author || 'no indicada'}` };
    if (resolvedOutcome.resolvedWinner === 'B') return { className:'outcome-b', overline:'Victoria total', title:`${names.B} gana`, subtitle: resolvedOutcome.reason || 'A ha desaparecido completamente.', emblem:'B', details:`Autoría: ${sim.warriors?.[1]?.author || 'no indicada'}` };
    return { className:'outcome-draw', overline:'Empate', title:'Empate', subtitle: resolvedOutcome.reason || 'La batalla terminó sin ganador.', emblem:'═', details:`Núcleo — A: ${ownership.A} · B: ${ownership.B}` };
  }, [sim, ownership, resolvedOutcome]);

  useEffect(() => {
    if (sim.halted && !previousHaltedRef.current) {
      setWinnerModalData({
        winner: resolvedOutcome.resolvedWinner,
        title: outcome.title,
        reason: outcome.subtitle,
        author: resolvedOutcome.winnerWarrior?.author || 'Autoría no indicada',
        warriorName: resolvedOutcome.winnerWarrior?.name || 'Empate',
      });
      setShowWinnerModal(true);
    }
    previousHaltedRef.current = sim.halted;
  }, [sim.halted, outcome, resolvedOutcome]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cols = 100;
    const rows = Math.ceil(sim.settings.coreSize / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme.ui.bg;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < sim.core.length; i += 1) {
      const cell = sim.core[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellW;
      const y = row * cellH;
      let fill = theme.core.empty;
      if (cell.owner === 'A') fill = theme.core.ownerA;
      if (cell.owner === 'B') fill = theme.core.ownerB;
      if (!cell.owner && cell.op === 'DAT') fill = theme.core.dat;
      const lastExec = sim.visual.lastExecBy[i];
      const lastWrite = sim.visual.lastWriteBy[i];
      const lastRead = sim.visual.lastReadBy[i];
      if (lastWrite === 'A') fill = theme.core.writeA;
      if (lastWrite === 'B') fill = theme.core.writeB;
      if (lastExec === 'A') fill = theme.core.execA;
      if (lastExec === 'B') fill = theme.core.execB;
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, Math.max(1, cellW - 1), Math.max(1, cellH - 1));
      if (lastRead) {
        ctx.fillStyle = lastRead === 'A' ? theme.core.readA : theme.core.readB;
        ctx.fillRect(x + cellW * 0.33, y + cellH * 0.33, Math.max(1, cellW * 0.22), Math.max(1, cellH * 0.22));
      }
      const hasA = currentIPs.has(`A:${i}`);
      const hasB = currentIPs.has(`B:${i}`);
      if (hasA || hasB) {
        ctx.strokeStyle = hasA && hasB ? theme.core.ipBoth : hasA ? theme.core.ipA : theme.core.ipB;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(x + 0.5, y + 0.5, Math.max(1, cellW - 2), Math.max(1, cellH - 2));
      }
      if (hoverIndex === i) {
        ctx.strokeStyle = theme.core.hover;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 0.5, y + 0.5, Math.max(1, cellW - 2), Math.max(1, cellH - 2));
      }
    }
  }, [sim, hoverIndex, currentIPs, theme]);

  function handleCanvasMove(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cols = 100;
    const rows = Math.ceil(sim.settings.coreSize / cols);
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const col = clamp(Math.floor(x / cellW), 0, cols - 1);
    const row = clamp(Math.floor(y / cellH), 0, rows - 1);
    const index = row * cols + col;
    if (index < sim.settings.coreSize) setHoverIndex(index);
  }

  function setThemeFromPreset(key) { setThemePreset(key); setTheme(cloneTheme(THEME_PRESETS[key])); }
  function updateUiColor(field, value) { setTheme((prev) => ({ ...prev, ui: { ...prev.ui, [field]: value } })); }
  function updateCoreColor(field, value) { setTheme((prev) => ({ ...prev, core: { ...prev.core, [field]: value } })); }

  function validateBoth() {
    const settings = settingsFrom(maxCycles);
    const resultA = validateSource(codeA, settings);
    const resultB = validateSource(codeB, settings);
    setValidationA(buildValidationView(resultA));
    setValidationB(buildValidationView(resultB));
    const ok = resultA.ok && resultB.ok;
    setValidatedOk(ok);
    setCompiledOk(false);
    setNotice(ok ? 'Validación correcta para A y B.' : `Errores: ${[resultA.ok ? null : `A: ${resultA.error}`, resultB.ok ? null : `B: ${resultB.error}`].filter(Boolean).join(' | ')}`);
    return { resultA, resultB, ok };
  }

  function compileBattle() {
    const settings = settingsFrom(maxCycles);
    const resultA = validateSource(codeA, settings);
    const resultB = validateSource(codeB, settings);
    setValidationA(buildValidationView(resultA));
    setValidationB(buildValidationView(resultB));
    if (!resultA.ok || !resultB.ok) {
      setValidatedOk(false);
      setCompiledOk(false);
      setRunning(false);
      setNotice(`Error de compilación: ${[resultA.ok ? null : `A: ${resultA.error}`, resultB.ok ? null : `B: ${resultB.error}`].filter(Boolean).join(' | ')}`);
      return;
    }
    const battle = Engine.createBattle(resultA.compiled, resultB.compiled, settings);
    setSim({ ...battle });
    setValidatedOk(true);
    setCompiledOk(true);
    setRunning(false);
    setShowWinnerModal(false);
    previousHaltedRef.current = false;
    setNotice('Compilación correcta. Batalla preparada.');
  }

  function loadBattlePreset(key) {
    const preset = BATTLE_PRESETS[key];
    setBattlePresetKey(key);
    setWarriorPresetA(preset.a);
    setWarriorPresetB(preset.b);
    setCodeA(WARRIOR_LIBRARY[preset.a].source);
    setCodeB(WARRIOR_LIBRARY[preset.b].source);
    setValidationA(null);
    setValidationB(null);
    markDirty(`Preset cargado: ${preset.label}.`);
  }

  function loadWarriorPreset(side, key) {
    const source = key === 'newWarrior' ? createNewWarriorTemplate(side) : WARRIOR_LIBRARY[key].source;
    if (side === 'A') { setWarriorPresetA(key); setCodeA(source); setValidationA(null); }
    else { setWarriorPresetB(key); setCodeB(source); setValidationB(null); }
    markDirty(`Guerrero ${side} actualizado.`);
  }

  function updateSource(side, value) {
    if (side === 'A') setCodeA(value); else setCodeB(value);
    markDirty(`Cambios en guerrero ${side}. Vuelve a validar.`);
  }

  function newWarrior(side) {
    if (side === 'A') { setWarriorPresetA('newWarrior'); setCodeA(createNewWarriorTemplate(side)); setValidationA(null); }
    else { setWarriorPresetB('newWarrior'); setCodeB(createNewWarriorTemplate(side)); setValidationB(null); }
    markDirty(`Plantilla nueva creada para ${side}.`);
  }

  function exportWarrior(side) {
    const source = side === 'A' ? codeA : codeB;
    downloadTextFile(buildFilename(source, `warrior-${side.toLowerCase()}`), source);
    setNotice(`Guerrero ${side} exportado.`);
  }

  function importWarrior(side, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      if (side === 'A') { setCodeA(text); setValidationA(null); setWarriorPresetA('newWarrior'); }
      else { setCodeB(text); setValidationB(null); setWarriorPresetB('newWarrior'); }
      markDirty(`Guerrero ${side} importado desde ${file.name}.`);
      event.target.value = '';
    };
    reader.onerror = () => { setNotice(`No se pudo importar el archivo para ${side}.`); event.target.value = ''; };
    reader.readAsText(file, 'utf-8');
  }

  function stepOnce() { if (!compiledOk) return; setRunning(false); setSim((prev) => ({ ...Engine.stepBattle(prev) })); }
  function stepBatch(count) { if (!compiledOk) return; setRunning(false); setSim((prev) => ({ ...Engine.runSteps(prev, count) })); }
  function toggleRun() { if (!compiledOk) return; if (sim.halted) compileBattle(); else setRunning((v) => !v); }
  function resetBattle() { compileBattle(); }

  const activeMessage = notice ? `${notice}${sim.message ? ` · ${sim.message}` : ''}` : sim.message;

  return (
    <div className="app-shell">
      <main className="workspace-grid">
        <section className="left-zone">
          <CollapsiblePanel title="Núcleo" defaultOpen={true} right={<span className="panel-micro">Siempre visible</span>}>
            <canvas ref={canvasRef} width="1400" height="980" className="core-canvas" onMouseMove={handleCanvasMove} onMouseLeave={() => setHoverIndex(null)} />
            <div className="legend-row">
              <span><i className="swatch" style={{ background: theme.core.ownerA }}></i>A</span>
              <span><i className="swatch" style={{ background: theme.core.ownerB }}></i>B</span>
              <span><i className="swatch" style={{ background: theme.core.readA }}></i>Lectura</span>
              <span><i className="swatch" style={{ background: theme.core.execA }}></i>Ejecución/IP</span>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Editor de Corewar" defaultOpen={true} right={<span className="panel-micro">Guerrero A y Guerrero B</span>}>
            <div className="editor-grid">
              <div className="editor-card">
                <div className="editor-header">
                  <strong>Guerrero A</strong>
                  <span className="chip chip-a">A</span>
                </div>
                <div className="editor-toolbar compact-grid">
                  <select value={warriorPresetA} onChange={(e) => loadWarriorPreset('A', e.target.value)}>
                    {Object.entries(WARRIOR_LIBRARY).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
                  </select>
                  <button onClick={() => newWarrior('A')}>Nuevo guerrero</button>
                  <button onClick={() => fileInputARef.current?.click()}>Importar</button>
                  <button onClick={() => exportWarrior('A')}>Exportar</button>
                  <input ref={fileInputARef} type="file" accept=".red,.txt,text/plain" style={{display:'none'}} onChange={(e) => importWarrior('A', e)} />
                </div>
                <LineNumberEditor value={codeA} onChange={(value) => updateSource('A', value)} ariaLabel="Editor de guerrero A" />
                <div className={`validation-card ${validationA ? validationA.ok ? 'validation-ok' : 'validation-error' : ''}`}>
                  {validationA ? validationA.ok ? <><strong>{validationA.name}</strong><span>Longitud: {validationA.length} · ORG: {validationA.entryPoint} · PIN: {validationA.pin}</span></> : <><strong>Error</strong><span>{validationA.error}</span></> : <span>Sin validar.</span>}
                </div>
              </div>
              <div className="editor-card">
                <div className="editor-header">
                  <strong>Guerrero B</strong>
                  <span className="chip chip-b">B</span>
                </div>
                <div className="editor-toolbar compact-grid">
                  <select value={warriorPresetB} onChange={(e) => loadWarriorPreset('B', e.target.value)}>
                    {Object.entries(WARRIOR_LIBRARY).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
                  </select>
                  <button onClick={() => newWarrior('B')}>Nuevo guerrero</button>
                  <button onClick={() => fileInputBRef.current?.click()}>Importar</button>
                  <button onClick={() => exportWarrior('B')}>Exportar</button>
                  <input ref={fileInputBRef} type="file" accept=".red,.txt,text/plain" style={{display:'none'}} onChange={(e) => importWarrior('B', e)} />
                </div>
                <LineNumberEditor value={codeB} onChange={(value) => updateSource('B', value)} ariaLabel="Editor de guerrero B" />
                <div className={`validation-card ${validationB ? validationB.ok ? 'validation-ok' : 'validation-error' : ''}`}>
                  {validationB ? validationB.ok ? <><strong>{validationB.name}</strong><span>Longitud: {validationB.length} · ORG: {validationB.entryPoint} · PIN: {validationB.pin}</span></> : <><strong>Error</strong><span>{validationB.error}</span></> : <span>Sin validar.</span>}
                </div>
              </div>
            </div>
          </CollapsiblePanel>
        </section>

        <aside className="right-zone">
          <CollapsiblePanel title="Estado" defaultOpen={true} right={<span className="panel-micro">Siempre visible</span>}>
            <div className={`outcome-hero ${outcome.className}`}>
              <div className="outcome-emblem">{outcome.emblem}</div>
              <div>
                <div className="outcome-overline">{outcome.overline}</div>
                <div className="outcome-title">{outcome.title}</div>
                <div className="outcome-subtitle">{outcome.subtitle}</div>
                <div className="outcome-details">{outcome.details}</div>
              </div>
            </div>
            <div className="stats-grid four">
              <div className="stat-card"><span>Ciclo</span><strong>{sim.cycle}</strong></div>
              <div className="stat-card"><span>Procesos A</span><strong>{sim.queues.A.length}</strong></div>
              <div className="stat-card"><span>Procesos B</span><strong>{sim.queues.B.length}</strong></div>
              <div className="stat-card"><span>Resultado</span><strong>{sim.halted ? (resolvedOutcome.resolvedWinner || 'Empate') : 'En curso'}</strong></div>
            </div>
            <div className="result-box">
              <div className="result-title">Resolución</div>
              <div>{resolvedOutcome.reason || 'La batalla sigue abierta.'}</div>
            </div>
            <div className="queue-box">
              <div><strong>Cola A:</strong> {summarizeQueue(sim.queues.A)}</div>
              <div><strong>Cola B:</strong> {summarizeQueue(sim.queues.B)}</div>
              <div><strong>Núcleo ocupado:</strong> A: {ownership.A} · B: {ownership.B}</div>
            </div>
          </CollapsiblePanel>

          <div className="panel control-panel fixed-panel">
            <div className="button-stack">
              <div className="button-row primary-row">
                <button className={`status-button ${validatedOk ? 'ok' : ''}`} onClick={validateBoth}>Validar A-B</button>
                <button className={`status-button ${compiledOk ? 'ok' : ''}`} onClick={compileBattle} disabled={!validatedOk}>Compilar</button>
                <button className={`status-button run-button ${running ? 'running' : ''}`} onClick={toggleRun} disabled={!compiledOk}>{running ? 'Run funcionando' : 'Run'}</button>
                <button onClick={stepOnce} disabled={!compiledOk || running}>Step</button>
                <button onClick={() => stepBatch(100)} disabled={!compiledOk || running}>Step x100</button>
              </div>
              <div className="button-row secondary-row">
                <button className={`toggle-button ${turboActive ? 'active' : ''}`} onClick={() => setTurboActive((v) => !v)}>Turbo</button>
                <button className={`toggle-button ${tieBreakByCore ? 'active' : ''}`} onClick={() => setTieBreakByCore((v) => !v)}>Desempate por núcleo</button>
                <button onClick={resetBattle}>Reset batalla</button>
              </div>
            </div>
            <div className="message-banner">{activeMessage || 'Listo.'}</div>
          </div>

          <CollapsiblePanel title="Opciones avanzadas de batalla" defaultOpen={false} right={<span className="panel-micro">Preset, ciclos y delay</span>}>
            <div className="advanced-grid">
              <div>
                <label className="label">Preset</label>
                <select value={battlePresetKey} onChange={(e) => loadBattlePreset(e.target.value)}>
                  {Object.entries(BATTLE_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Máx. ciclos</label>
                <input type="number" min="1" max="500000" value={maxCycles} onChange={(e) => { setMaxCycles(e.target.value); markDirty('Cambiaste los ciclos máximos. Vuelve a validar.'); }} />
              </div>
              <div>
                <label className="label">Delay ms</label>
                <input type="number" min="1" max="1000" value={runDelay} onChange={(e) => setRunDelay(e.target.value)} />
              </div>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Paletas" defaultOpen={false} right={<span className="panel-micro">Reducida</span>}>
            <div className="advanced-grid">
              <div>
                <label className="label">Preset visual</label>
                <select value={themePreset} onChange={(e) => setThemeFromPreset(e.target.value)}>
                  {Object.entries(THEME_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}
                </select>
              </div>
            </div>
            <div className="palette-columns">
              <div>
                <div className="mini-title">General</div>
                <div className="color-grid">
                  {UI_COLOR_FIELDS.map(([field, label]) => (
                    <label key={field} className="color-item"><span>{label}</span><input type="color" value={theme.ui[field]} onChange={(e) => updateUiColor(field, e.target.value)} /></label>
                  ))}
                </div>
              </div>
              <div>
                <div className="mini-title">Core</div>
                <div className="color-grid">
                  {CORE_COLOR_FIELDS.map(([field, label]) => (
                    <label key={field} className="color-item"><span>{label}</span><input type="color" value={theme.core[field]} onChange={(e) => updateCoreColor(field, e.target.value)} /></label>
                  ))}
                </div>
              </div>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Memoria e inspector" defaultOpen={false} right={<span className="panel-micro">Reducida</span>}>
            <div className="inspector-grid">
              <div className="inspect-box">
                <div className="inspect-label">Celda</div>
                {hoverCell ? (
                  <div>
                    <div><strong>#</strong> {hoverIndex}</div>
                    <div><strong>Instr:</strong> {Engine.formatInstruction(hoverCell)}</div>
                    <div><strong>Owner:</strong> {hoverCell.owner || 'ninguno'}</div>
                    <div><strong>Fuente:</strong> {hoverCell.source || 'memoria / modificada'}</div>
                  </div>
                ) : <div>Mueve el cursor sobre el núcleo.</div>}
              </div>
              <div className="inspect-box">
                <div className="inspect-label">Última ejecución</div>
                {sim.lastStep ? (
                  <div>
                    <div><strong>Ciclo:</strong> {sim.lastStep.cycle}</div>
                    <div><strong>Guerrero:</strong> {sim.lastStep.warrior}</div>
                    <div><strong>IP:</strong> {sim.lastStep.ip}</div>
                    <div><strong>Instr:</strong> {sim.lastStep.instruction}</div>
                    <div><strong>Src/Dst:</strong> {sim.lastStep.sourceAddr} / {sim.lastStep.destAddr}</div>
                    <div><strong>Resultado:</strong> {sim.lastStep.summary}</div>
                  </div>
                ) : <div>Aún no hay pasos ejecutados.</div>}
              </div>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Depurador" defaultOpen={false} right={<span className="panel-micro">Reducido</span>}>
            <div className="debug-log">
              {sim.debugLog.length === 0 && <div className="debug-row empty">Sin trazas todavía.</div>}
              {sim.debugLog.map((entry, idx) => (
                <div key={`${entry.cycle}-${idx}`} className={`debug-row ${entry.warrior === 'A' ? 'debug-a' : entry.warrior === 'B' ? 'debug-b' : ''}`}>
                  <div className="debug-top"><span>#{entry.cycle}</span><span>{entry.warrior}</span><span>@{entry.ip}</span></div>
                  <div className="debug-instr">{entry.instruction}</div>
                  <div className="debug-summary">{entry.summary}</div>
                </div>
              ))}
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Soporte del motor" defaultOpen={false} right={<span className="panel-micro">Reducido</span>}>
            <div className="notes-panel">
              <ul>
                <li>Opcodes: DAT, MOV, ADD, SUB, MUL, DIV, MOD, JMP, JMZ, JMN, DJN, SEQ/CMP, SNE, SLT, SPL, NOP, LDP y STP.</li>
                <li>Modos: #, $, @, *, &lt;, &gt;, {'{'} y {'}'}.</li>
                <li>Modificadores: .A, .B, .AB, .BA, .F, .X, .I.</li>
                <li>Parser con etiquetas, EQU, ORG, END, FOR/ROF y PIN.</li>
                <li>P-space básico con LDP/STP.</li>
              </ul>
            </div>
          </CollapsiblePanel>
        </aside>
      </main>

      {showWinnerModal && winnerModalData && (
        <div className="modal-backdrop" onClick={() => setShowWinnerModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-glow ${winnerModalData.winner === 'A' ? 'win-a' : winnerModalData.winner === 'B' ? 'win-b' : 'win-draw'}`}></div>
            <div className="modal-overline">Resultado final</div>
            <div className="modal-title">{winnerModalData.title}</div>
            <div className="modal-warrior">{winnerModalData.warriorName}</div>
            <div className="modal-reason">{winnerModalData.reason}</div>
            <div className="modal-author">Autoría: {winnerModalData.author || 'no indicada'}</div>
            <button className="modal-close" onClick={() => setShowWinnerModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
