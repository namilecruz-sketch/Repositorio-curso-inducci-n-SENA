import React, { useState } from 'react';
import { X, Send, Sparkles, HelpCircle, BookOpen, Scale, Shield, Award } from 'lucide-react';
import { SenaSymbol } from './SenaLogo';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'sofia';
  text: string;
  reference?: string;
}

const FAQ_KNOWLEDGE_BASE: { keywords: string[]; answer: string; reference: string }[] = [
  {
    keywords: ['inasistencia', 'falta', 'justificar', 'médica', 'incapacidad', 'tiempo', 'días'],
    answer: 'Según el Reglamento del Aprendiz (Acuerdo 007 de 2012, Art. 22), tienes un plazo máximo de tres (3) días hábiles siguientes a la inasistencia para radicar la justificación formal con su debido soporte médico (EPS) o de fuerza mayor ante tu instructor o coordinación.',
    reference: 'Reglamento del Aprendiz, Artículo 22',
  },
  {
    keywords: ['plagio', 'copia', 'copiar', 'código', 'trampa', 'autor'],
    answer: 'El plagio en evidencias o proyectos es calificado como falta grave o gravísima contra la integridad académica. Acarrea llamado de atención escrito, plan de mejoramiento con sustentación individual y puede remitirse al Comité de Evaluación y Seguimiento para suspensión o cancelación de matrícula.',
    reference: 'Acuerdo 007 de 2012, Artículos 10 y 28',
  },
  {
    keywords: ['carné', 'carne', 'identificación', 'ingreso', 'prestar'],
    answer: 'El carné institucional del SENA es personal e intransferible. Es obligatorio portarlo de manera visible en todas las sedes y eventos. Prestarlo a un compañero o usar el de otro aprendiz constituye una falta disciplinaria contra la seguridad institucional.',
    reference: 'Reglamento del Aprendiz, Art. 9 num. 8',
  },
  {
    keywords: ['productiva', 'etapa productiva', 'contrato', 'aprendizaje', 'pasantía', 'monitoría'],
    answer: 'Para iniciar la Etapa Productiva debes haber aprobado todos los resultados de aprendizaje de la Etapa Lectiva. Las modalidades válidas son: Contrato de Aprendizaje (Ley 789/2002 con apoyo económico y ARL/EPS), Vinculación Laboral, Proyecto Productivo (Fondo Emprender), Pasantía institucional o Monitoría en el centro.',
    reference: 'Reglamento del Aprendiz, Artículos 12 al 15',
  },
  {
    keywords: ['símbolo', 'simbolos', 'escudo', 'piñón', 'caduceo', 'café'],
    answer: 'El Escudo del SENA representa los 3 sectores de la economía colombiana: el Piñón simboliza la Industria y Construcción; el Caduceo representa el Comercio y los Servicios; y la Rama de Café representa el Sector Agropecuario. El color blanco de la bandera representa la paz y la transparencia ética.',
    reference: 'Manual de Identidad e Imagen Institucional SENA',
  },
  {
    keywords: ['bienestar', 'apoyo', 'sostenimiento', 'subsidio', 'psicología', 'deporte'],
    answer: 'Bienestar al Aprendiz brinda acompañamiento integral a través de 5 ejes: Salud preventiva, Arte y Cultura, Deporte y Recreación, Liderazgo (representantes de ficha) y Acompañamiento socioeconómico (Apoyos de sostenimiento, convenios de transporte y monitorías).',
    reference: 'Plan Nacional de Bienestar al Aprendiz SENA',
  },
];

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'sofia',
      text: '¡Hola, Aprendiz! Soy SofIA, tu asesora virtual de inducción SENA. ¿Tienes alguna duda sobre el Reglamento del Aprendiz, la etapa productiva, los símbolos o tus derechos?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Answer lookup
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let matched = FAQ_KNOWLEDGE_BASE.find((faq) =>
        faq.keywords.some((kw) => qLower.includes(kw))
      );

      let botResponse: Message;
      if (matched) {
        botResponse = {
          sender: 'sofia',
          text: matched.answer,
          reference: matched.reference,
        };
      } else {
        botResponse = {
          sender: 'sofia',
          text: `Como aprendiz SENA, todo tu proceso formativo se rige por el Acuerdo 007 de 2012 (Reglamento del Aprendiz) y los principios de Formación Profesional Integral. Te recomiendo consultar los módulos de la plataforma o acudir a tu instructor vocero y a la oficina de Bienestar al Aprendiz de tu Centro de Formación.`,
          reference: 'Estatuto de la Formación Profesional Integral SENA',
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-700 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
            <SenaSymbol size={22} color="#007832" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span>SofIA Tutor</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            </h3>
            <p className="text-[10px] text-emerald-100">
              Asistente Normativo e Inducción SENA
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => handleSend('¿Cuántos días tengo para justificar inasistencias?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg whitespace-nowrap hover:border-emerald-500 text-slate-700 dark:text-slate-200 shrink-0"
        >
          Justificar inasistencia
        </button>
        <button
          onClick={() => handleSend('¿Qué alternativas hay para la etapa productiva?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg whitespace-nowrap hover:border-emerald-500 text-slate-700 dark:text-slate-200 shrink-0"
        >
          Etapa productiva
        </button>
        <button
          onClick={() => handleSend('¿Qué significa el escudo y el piñón?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg whitespace-nowrap hover:border-emerald-500 text-slate-700 dark:text-slate-200 shrink-0"
        >
          Símbolos SENA
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200 dark:border-slate-700'
              }`}
            >
              {m.text}
              {m.reference && (
                <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-300">
                  Norma: {m.reference}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Pregunta sobre el reglamento o inducción..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
