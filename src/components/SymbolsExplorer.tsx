import React, { useState, useEffect, useRef } from 'react';
import { SenaEscudoSvg, SenaSymbol, SenaFlagSvg } from './SenaLogo';
import { SENA_HYMN_STANZAS } from '../data/senaData';
import { Play, Pause, RotateCcw, Volume2, Sparkles, BookOpen, Music, Shield, Flag } from 'lucide-react';

export const SymbolsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'escudo' | 'logo' | 'bandera' | 'himno'>('escudo');
  const [highlightedPart, setHighlightedPart] = useState<'pinon' | 'caduceo' | 'cafe' | null>('pinon');

  // Hymn Audio & Karaoke state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStanzaIdx, setActiveStanzaIdx] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Play marching patriotic melody for the SENA hymn via Web Audio API
  const playHymnMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Note frequencies (G major anthem marching style)
      // Notes: G4, B4, D5, D5, C5, B4, A4, G4, A4, B4, G4
      const notes = [
        { f: 392.00, d: 0.35 }, // G4
        { f: 493.88, d: 0.35 }, // B4
        { f: 587.33, d: 0.50 }, // D5
        { f: 587.33, d: 0.50 }, // D5
        { f: 523.25, d: 0.35 }, // C5
        { f: 493.88, d: 0.35 }, // B4
        { f: 440.00, d: 0.50 }, // A4
        { f: 392.00, d: 0.35 }, // G4
        { f: 440.00, d: 0.35 }, // A4
        { f: 493.88, d: 0.50 }, // B4
        { f: 392.00, d: 0.80 }, // G4
      ];

      let startTime = ctx.currentTime + 0.1;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d - 0.05);

        osc.start(startTime);
        osc.stop(startTime + n.d);
        startTime += n.d;
      });
    } catch {
      // Audio fallback
    }
  };

  const toggleHymnPlayback = () => {
    if (isPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playHymnMelody();

      // Cycle stanzas smoothly to simulate karaoke performance
      timerRef.current = window.setInterval(() => {
        setActiveStanzaIdx((prev) => (prev + 1) % SENA_HYMN_STANZAS.length);
      }, 5000);
    }
  };

  const resetHymn = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setActiveStanzaIdx(0);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Imagen e Identidad Institucional SENA
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explorador interactivo de los símbolos sagrados que identifican a la familia SENA en todo el territorio colombiano.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('escudo')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'escudo'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Escudo</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'logo'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Logo-Símbolo</span>
          </button>

          <button
            onClick={() => setActiveTab('bandera')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'bandera'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bandera</span>
          </button>

          <button
            onClick={() => setActiveTab('himno')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'himno'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-emerald-600" />
            <span>Himno</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Escudo interactivo */}
      {activeTab === 'escudo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          {/* Visual Display Left */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 min-h-[360px] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="text-center">
                <img
                  src="/escudo-sena.png"
                  alt="Escudo Oficial SENA"
                  className="w-28 h-auto object-contain drop-shadow-md mx-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-1.5 font-semibold">
                  Emblema Oficial
                </span>
              </div>
              <div className="text-center">
                <SenaEscudoSvg size={130} highlightedPart={highlightedPart} />
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-1.5 font-semibold">
                  Inspector de Sectores
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs mx-auto">
              Haz clic en los sectores a la derecha para inspeccionar el significado de cada elemento heráldico.
            </p>
          </div>

          {/* Interactive Breakdown Right */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                HERÁLDICA INSTITUCIONAL
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Los Tres Sectores de la Economía Colombiana
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                El Escudo del SENA refleja las tres grandes ramas de la actividad económica del país que la entidad atiende a través de la Formación Profesional Integral.
              </p>
            </div>

            {/* Interactive Selector Buttons */}
            <div className="space-y-3">
              {/* Sector 1: Piñón */}
              <div
                onClick={() => setHighlightedPart('pinon')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  highlightedPart === 'pinon'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      El Piñón o Rueda Dentada
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    Sector Industria y Construcción
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Representa el impulso de la manufactura, la metalmecánica, la mecatrónica, el desarrollo de software y las obras civiles. Simboliza el trabajo engranado, la fuerza creadora y la transformación tecnológica.
                </p>
              </div>

              {/* Sector 2: Caduceo */}
              <div
                onClick={() => setHighlightedPart('caduceo')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  highlightedPart === 'caduceo'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      El Caduceo de Mercurio
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                    Sector Comercio y Servicios
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Vara alada con serpientes entrelazadas originaria de la mitología griega, asociada al dios Hermes/Mercurio protector del intercambio comercial, la logística, la banca, la administración y la hospitalidad.
                </p>
              </div>

              {/* Sector 3: Café */}
              <div
                onClick={() => setHighlightedPart('cafe')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  highlightedPart === 'cafe'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      La Rama de Café con Frutos
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                    Sector Agropecuario y Primario
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  El cultivo insignia de Colombia. Simboliza la fertilidad de los campos, la producción agrícola, pecuaria, forestal y agroindustrial que alimenta a la nación y genera riqueza rural campesina (SENA Emprende Rural).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logo-Símbolo */}
      {activeTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 min-h-[360px]">
            <SenaSymbol size={180} color="#39A900" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-mono font-bold">
              Color Oficial: Verde SENA (#39A900)
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              IDENTIDAD VISUAL
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              El Sendero del Aprendiz Hacia el Futuro
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El logo-símbolo del SENA es una síntesis gráfica moderna y humanista creada para proyectar la institución hacia el siglo XXI. Se compone de dos elementos estructurales:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>La Figura Humana Erguida (El Aprendiz)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  El círculo superior representa la mente y el conocimiento; la barra horizontal con extremos levemente inclinados representa los brazos abiertos listos para el trabajo solidario, la técnica y la acogida de la sociedad colombiana.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Las Tres Franjas Escalonadas (El Sendero)</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Las tres barras horizontales en la base representan los peldaños de la formación: el punto de partida en la educación, la adquisición de competencias profesionales, y el ascenso hacia la productividad y la movilidad social.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bandera */}
      {activeTab === 'bandera' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 min-h-[360px]">
            <SenaFlagSvg size={240} />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
              Pabellón institucional que ondea en todos los 118 centros de formación del país.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              SÍMBOLO DE SOBERANÍA EDUCATIVA
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              La Bandera Oficial del SENA
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La bandera del Servicio Nacional de Aprendizaje fue diseñada para acompañar la bandera de la República de Colombia en todos los actos cívicos, protocolares y ceremonias de grado.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  El Fondo Blanco
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Simboliza la paz, la tranquilidad, la libertad y la transparencia ética en la gestión pública y en la convivencia de la comunidad educativa.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  El Escudo Central Verde
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Ubicado en el centro del lienzo blanco, destaca el escudo institucional en verde SENA, color de la esperanza, los campos colombianos y la juventud trabajadora.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Himno del SENA con reproductor y karaoke */}
      {activeTab === 'himno' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          {/* Player Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                MARCHA SOLEMNE INSTITUCIONAL
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Himno del Servicio Nacional de Aprendizaje
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Música: Daniel Marles Puyana · Letra: Jesús Maya Alfaro
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={resetHymn}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Reiniciar reproducción"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleHymnPlayback}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pausar Marcha</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Reproducir Melodía</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Karaoke lyrics stanzas grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SENA_HYMN_STANZAS.map((stanza, idx) => {
              const isActive = isPlaying && activeStanzaIdx === idx;

              return (
                <div
                  key={stanza.number}
                  onClick={() => setActiveStanzaIdx(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {stanza.title}
                    </span>
                    {isActive && <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">
                    {stanza.verses.map((verse, vIdx) => (
                      <p key={vIdx} className={isActive ? 'font-medium text-slate-900 dark:text-white' : ''}>
                        {verse}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            * Se entona de pie con respeto y la cabeza descubierta en todas las ceremonias de inducción y graduación del SENA.
          </p>
        </div>
      )}
    </div>
  );
};
