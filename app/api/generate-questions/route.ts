import { NextResponse } from 'next/server';
import { Question } from '@/lib/types';

const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const uid = () => 'q_' + Math.random().toString(36).substring(2, 9);
const oid = () => 'opt_' + Math.random().toString(36).substring(2, 7);

function buildMathQuestions(count: number, topicLower: string): Question[] {
  const qs: Question[] = [];
  const pokeIds = [25, 6, 9, 133, 150, 448, 143, 94, 149, 130];

  for (let i = 0; i < count; i++) {
    const mode = topicLower.includes('fracci')
      ? 3
      : topicLower.includes('divis')
        ? 1
        : topicLower.includes('tabla') || topicLower.includes('multi')
          ? 0
          : i % 4;

    const pokeImg = art(pokeIds[i % pokeIds.length]);

    if (mode === 0) {
      // Multiplication
      const a = Math.floor(4 + Math.random() * 15);
      const b = Math.floor(3 + Math.random() * 8);
      const ans = a * b;
      const distractors = [ans + b, ans - a, ans + 10].map((v) => Math.max(1, v));
      qs.push({
        id: uid(),
        text: `En el gimnasio hay ${a} entrenadores y cada uno lleva ${b} Pokéballs. ¿Cuántas Pokéballs hay en total?`,
        image: pokeImg,
        timeLimit: 25,
        points: 1000,
        explanation: `Multiplicamos ${a} × ${b} = ${ans} Pokéballs en total.`,
        options: [
          { id: oid(), text: `${ans} Pokéballs`, isCorrect: true },
          { id: oid(), text: `${distractors[0]} Pokéballs`, isCorrect: false },
          { id: oid(), text: `${distractors[1]} Pokéballs`, isCorrect: false },
          { id: oid(), text: `${distractors[2]} Pokéballs`, isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      });
    } else if (mode === 1) {
      // Exact division
      const divisor = Math.floor(3 + Math.random() * 7);
      const quotient = Math.floor(4 + Math.random() * 12);
      const dividend = divisor * quotient;
      qs.push({
        id: uid(),
        text: `Queremos repartir ${dividend} bayas en partes iguales entre ${divisor} Pokémon. ¿Cuántas bayas recibe cada uno?`,
        image: pokeImg,
        timeLimit: 25,
        points: 1000,
        explanation: `Dividimos ${dividend} ÷ ${divisor} = ${quotient} bayas para cada Pokémon.`,
        options: [
          { id: oid(), text: `${quotient} bayas`, isCorrect: true },
          { id: oid(), text: `${quotient + 1} bayas`, isCorrect: false },
          { id: oid(), text: `${Math.max(1, quotient - 1)} bayas`, isCorrect: false },
          { id: oid(), text: `${quotient + 2} bayas`, isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      });
    } else if (mode === 2) {
      // Combined operations / mental calculation
      const base = Math.floor(10 + Math.random() * 40);
      const multA = Math.floor(2 + Math.random() * 5);
      const multB = Math.floor(3 + Math.random() * 6);
      const ans = base + multA * multB;
      const wrongOrder = (base + multA) * multB;
      qs.push({
        id: uid(),
        text: `Resuelve respetando el orden de las operaciones: ${base} + ${multA} × ${multB} =`,
        image: pokeImg,
        timeLimit: 25,
        points: 1000,
        explanation: `Primero multiplicamos (${multA} × ${multB} = ${multA * multB}) y luego sumamos ${base}: ${base} + ${multA * multB} = ${ans}.`,
        options: [
          { id: oid(), text: `${ans}`, isCorrect: true },
          { id: oid(), text: `${wrongOrder}`, isCorrect: false },
          { id: oid(), text: `${ans + 10}`, isCorrect: false },
          { id: oid(), text: `${Math.max(1, ans - 5)}`, isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      });
    } else {
      // Fractions
      const den = [4, 5, 6, 8, 10][i % 5];
      const num = Math.floor(1 + Math.random() * (den - 1));
      const mult = Math.floor(3 + Math.random() * 8);
      const total = den * mult;
      const part = num * mult;
      qs.push({
        id: uid(),
        text: `Un equipo tiene ${total} cartas Pokémon y ${num}/${den} de ellas son brillantes. ¿Cuántas cartas brillantes hay?`,
        image: pokeImg,
        timeLimit: 30,
        points: 1000,
        explanation: `Calculamos ${num}/${den} de ${total}: dividimos ${total} ÷ ${den} = ${mult}, y multiplicamos por ${num}: ${mult} × ${num} = ${part} cartas.`,
        options: [
          { id: oid(), text: `${part} cartas`, isCorrect: true },
          { id: oid(), text: `${mult} cartas`, isCorrect: false },
          { id: oid(), text: `${part + den} cartas`, isCorrect: false },
          { id: oid(), text: `${Math.max(1, total - part)} cartas`, isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      });
    }
  }
  return qs;
}

const TEMPLATES: Record<string, Omit<Question, 'id'>[]> = {
  pokemon: [
    {
      text: '¿Qué objeto se necesita para evolucionar a Pikachu en Raichu?',
      image: art(26),
      timeLimit: 20,
      points: 1000,
      explanation: 'Pikachu necesita entrar en contacto con una Piedra Trueno para evolucionar en Raichu.',
      options: [
        { id: 'o1', text: 'Piedra Trueno ⚡', isCorrect: true },
        { id: 'o2', text: 'Piedra Fuego 🔥', isCorrect: false },
        { id: 'o3', text: 'Subir al nivel 36 📈', isCorrect: false },
        { id: 'o4', text: 'Amistad máxima ❤️', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál de los siguientes es un Pokémon inicial de Tipo Planta de la región de Kanto?',
      image: art(1),
      timeLimit: 15,
      points: 1000,
      explanation: 'Bulbasaur es el número 0001 de la Pokédex Nacional y el inicial de tipo Planta/Veneno.',
      options: [
        { id: 'o1', text: 'Chikorita', isCorrect: false },
        { id: 'o2', text: 'Bulbasaur 🍃', isCorrect: true },
        { id: 'o3', text: 'Treecko', isCorrect: false },
        { id: 'o4', text: 'Turtwig', isCorrect: false },
      ],
    },
    {
      text: '¿Qué tipo de efectividad tiene un ataque de Tipo Fuego contra un Pokémon de Tipo Planta o Bicho?',
      image: art(6),
      timeLimit: 20,
      points: 1000,
      explanation: 'El fuego es súper efectivo (x2 daño) contra Planta, Bicho, Hielo y Acero.',
      options: [
        { id: 'o1', text: 'Súper Efectivo (x2 daño) 💥', isCorrect: true },
        { id: 'o2', text: 'Poco Efectivo (x0.5 daño)', isCorrect: false },
        { id: 'o3', text: 'No tiene efecto (Inmune)', isCorrect: false },
        { id: 'o4', text: 'Daño normal (x1)', isCorrect: false },
      ],
    },
    {
      text: '¿Cuántas evoluciones diferentes puede tener Eevee en total (las llamadas Eeveeluciones)?',
      image: art(133),
      timeLimit: 20,
      points: 1000,
      explanation: 'Eevee tiene 8 evoluciones: Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon y Sylveon.',
      options: [
        { id: 'o1', text: '3 evoluciones', isCorrect: false },
        { id: 'o2', text: '5 evoluciones', isCorrect: false },
        { id: 'o3', text: '8 evoluciones', isCorrect: true },
        { id: 'o4', text: '10 evoluciones', isCorrect: false },
      ],
    },
    {
      text: '¿Qué Pokémon legendario es conocido como el ancestro de todos los Pokémon y posee el ADN de todos?',
      image: art(151),
      timeLimit: 20,
      points: 1000,
      explanation: 'Mew es un Pokémon singular de tipo Psíquico capaz de aprender casi cualquier movimiento.',
      options: [
        { id: 'o1', text: 'Mew', isCorrect: true },
        { id: 'o2', text: 'Dragonite', isCorrect: false },
        { id: 'o3', text: 'Lucario', isCorrect: false },
        { id: 'o4', text: 'Gengar', isCorrect: false },
      ],
    },
  ],
  lengua: [
    {
      text: '¿Cuál de estas palabras es ESDRÚJULA y lleva tilde obligatoria?',
      image: art(145),
      timeLimit: 20,
      points: 1000,
      explanation: 'Todas las palabras esdrújulas (fuerza en la antepenúltima sílaba) llevan siempre tilde: Brú-ju-la.',
      options: [
        { id: 'o1', text: 'Brújula', isCorrect: true },
        { id: 'o2', text: 'Montaña', isCorrect: false },
        { id: 'o3', text: 'Corazón', isCorrect: false },
        { id: 'o4', text: 'Cristal', isCorrect: false },
      ],
    },
    {
      text: '¿Qué clase de palabra es "VALIENTE" en la oración "El valiente Lucario protegió al grupo"?',
      image: art(448),
      timeLimit: 20,
      points: 1000,
      explanation: '"Valiente" es un adjetivo calificativo porque expresa una cualidad del sustantivo Lucario.',
      options: [
        { id: 'o1', text: 'Sustantivo', isCorrect: false },
        { id: 'o2', text: 'Verbo', isCorrect: false },
        { id: 'o3', text: 'Adjetivo', isCorrect: true },
        { id: 'o4', text: 'Pronombre', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál de las siguientes palabras está escrita CORRECTAMENTE según las reglas de la H?',
      image: art(144),
      timeLimit: 20,
      points: 1000,
      explanation: 'Todas las palabras que empiezan por "hie-" o "hue-" se escriben siempre con H (hielo, huella, huevo, hierba).',
      options: [
        { id: 'o1', text: 'Huella', isCorrect: true },
        { id: 'o2', text: 'Uella', isCorrect: false },
        { id: 'o3', text: 'Ielo', isCorrect: false },
        { id: 'o4', text: 'Uevo', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál es el antónimo de "GENEROSO"?',
      image: art(52),
      timeLimit: 20,
      points: 1000,
      explanation: 'Los antónimos tienen significados opuestos: lo contrario de generoso es tacaño o egoísta.',
      options: [
        { id: 'o1', text: 'Amable', isCorrect: false },
        { id: 'o2', text: 'Tacaño / Egoísta', isCorrect: true },
        { id: 'o3', text: 'Solidario', isCorrect: false },
        { id: 'o4', text: 'Simpático', isCorrect: false },
      ],
    },
    {
      text: '¿Qué tiempo verbal indica que la acción YA OCURRIÓ antes de ahora?',
      image: art(149),
      timeLimit: 20,
      points: 1000,
      explanation: 'El pretérito o pasado expresa acciones que ya han sucedido (ej. "ayer entrené").',
      options: [
        { id: 'o1', text: 'Presente', isCorrect: false },
        { id: 'o2', text: 'Futuro', isCorrect: false },
        { id: 'o3', text: 'Pasado (Pretérito)', isCorrect: true },
        { id: 'o4', text: 'Infinitivo', isCorrect: false },
      ],
    },
  ],
  ingles: [
    {
      text: 'Complete the sentence: "Look! Bulbasaur ___ water right now!"',
      image: art(1),
      timeLimit: 20,
      points: 1000,
      explanation: 'Present Continuous for actions happening right now: "is drinking".',
      options: [
        { id: 'o1', text: 'is drinking', isCorrect: true },
        { id: 'o2', text: 'drinks', isCorrect: false },
        { id: 'o3', text: 'are drinking', isCorrect: false },
        { id: 'o4', text: 'drink', isCorrect: false },
      ],
    },
    {
      text: 'Which word is the comparative form of "BIG"?',
      image: art(143),
      timeLimit: 20,
      points: 1000,
      explanation: '"Bigger" (double G + -er) is the comparative form of "big".',
      options: [
        { id: 'o1', text: 'biggest', isCorrect: false },
        { id: 'o2', text: 'bigger', isCorrect: true },
        { id: 'o3', text: 'more big', isCorrect: false },
        { id: 'o4', text: 'biger', isCorrect: false },
      ],
    },
    {
      text: 'How do you say "las siete y cuarto" (07:15) in English?',
      image: art(164),
      timeLimit: 20,
      points: 1000,
      explanation: '07:15 is "It’s quarter past seven".',
      options: [
        { id: 'o1', text: 'It’s half past seven', isCorrect: false },
        { id: 'o2', text: 'It’s quarter to seven', isCorrect: false },
        { id: 'o3', text: 'It’s quarter past seven', isCorrect: true },
        { id: 'o4', text: 'It’s seven o’clock', isCorrect: false },
      ],
    },
    {
      text: 'Choose the correct option: "Yesterday, Misty and Brock ___ at the beach."',
      image: art(7),
      timeLimit: 20,
      points: 1000,
      explanation: 'For plural subjects (Misty and Brock = They) in the Past Simple, we use "were".',
      options: [
        { id: 'o1', text: 'was', isCorrect: false },
        { id: 'o2', text: 'were', isCorrect: true },
        { id: 'o3', text: 'are', isCorrect: false },
        { id: 'o4', text: 'is', isCorrect: false },
      ],
    },
    {
      text: 'Where do you go to see wild animals like lions, giraffes and elephants?',
      image: art(59),
      timeLimit: 20,
      points: 1000,
      explanation: 'You see wild animals at the "zoo".',
      options: [
        { id: 'o1', text: 'The bakery', isCorrect: false },
        { id: 'o2', text: 'The library', isCorrect: false },
        { id: 'o3', text: 'The zoo', isCorrect: true },
        { id: 'o4', text: 'The hospital', isCorrect: false },
      ],
    },
  ],
  ciencias: [
    {
      text: '¿Cómo se llama el proceso por el cual las plantas fabrican su propio alimento gracias a la luz solar?',
      image: art(1),
      timeLimit: 20,
      points: 1000,
      explanation: 'La fotosíntesis convierte agua, sales minerales, CO₂ y luz solar en nutrientes y oxígeno.',
      options: [
        { id: 'o1', text: 'Fotosíntesis 🌿', isCorrect: true },
        { id: 'o2', text: 'Evaporación', isCorrect: false },
        { id: 'o3', text: 'Germinación', isCorrect: false },
        { id: 'o4', text: 'Digestión', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál es el planeta más grande del Sistema Solar?',
      image: art(150),
      timeLimit: 20,
      points: 1000,
      explanation: 'Júpiter es un gigante gaseoso y el planeta de mayor tamaño del Sistema Solar.',
      options: [
        { id: 'o1', text: 'Marte', isCorrect: false },
        { id: 'o2', text: 'Saturno', isCorrect: false },
        { id: 'o3', text: 'Júpiter', isCorrect: true },
        { id: 'o4', text: 'Tierra', isCorrect: false },
      ],
    },
    {
      text: '¿Qué grupo de animales vertebrados tiene el cuerpo cubierto de plumas y respira por pulmones?',
      image: art(18),
      timeLimit: 20,
      points: 1000,
      explanation: 'Las aves son vertebrados ovíparos con pico, alas y plumas.',
      options: [
        { id: 'o1', text: 'Las aves', isCorrect: true },
        { id: 'o2', text: 'Los anfibios', isCorrect: false },
        { id: 'o3', text: 'Los reptiles', isCorrect: false },
        { id: 'o4', text: 'Los mamíferos', isCorrect: false },
      ],
    },
    {
      text: '¿Qué órgano del cuerpo humano bombea la sangre por todo el aparato circulatorio?',
      image: art(113),
      timeLimit: 20,
      points: 1000,
      explanation: 'El corazón es el músculo encargado de impulsar la sangre a través de arterias y venas.',
      options: [
        { id: 'o1', text: 'Los pulmones', isCorrect: false },
        { id: 'o2', text: 'El estómago', isCorrect: false },
        { id: 'o3', text: 'El corazón', isCorrect: true },
        { id: 'o4', text: 'El hígado', isCorrect: false },
      ],
    },
    {
      text: '¿En qué estado de la materia las partículas tienen forma fija y volumen constante (como el hielo)?',
      image: art(144),
      timeLimit: 20,
      points: 1000,
      explanation: 'Los sólidos mantienen tanto su forma como su volumen propios.',
      options: [
        { id: 'o1', text: 'Sólido 🧊', isCorrect: true },
        { id: 'o2', text: 'Líquido 💧', isCorrect: false },
        { id: 'o3', text: 'Gaseoso 💨', isCorrect: false },
        { id: 'o4', text: 'Vapor', isCorrect: false },
      ],
    },
  ],
  geografia_historia: [
    {
      text: '¿En qué año llegó Cristóbal Colón por primera vez a América?',
      image: art(131),
      timeLimit: 20,
      points: 1000,
      explanation: 'El 12 de octubre de 1492 la expedición llegó a América, marcando el inicio de la Edad Moderna.',
      options: [
        { id: 'o1', text: '1492 ⛵', isCorrect: true },
        { id: 'o2', text: '1789', isCorrect: false },
        { id: 'o3', text: '1914', isCorrect: false },
        { id: 'o4', text: '1212', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál es el río más caudaloso del mundo?',
      image: art(130),
      timeLimit: 20,
      points: 1000,
      explanation: 'El río Amazonas, en América del Sur, es el más caudaloso del planeta.',
      options: [
        { id: 'o1', text: 'El Nilo', isCorrect: false },
        { id: 'o2', text: 'El Amazonas', isCorrect: true },
        { id: 'o3', text: 'El Tajo', isCorrect: false },
        { id: 'o4', text: 'El Danubio', isCorrect: false },
      ],
    },
    {
      text: '¿Cuál es el océano más grande de la Tierra?',
      image: art(382),
      timeLimit: 20,
      points: 1000,
      explanation: 'El océano Pacífico cubre aproximadamente un tercio de la superficie terrestre.',
      options: [
        { id: 'o1', text: 'Océano Atlántico', isCorrect: false },
        { id: 'o2', text: 'Océano Índico', isCorrect: false },
        { id: 'o3', text: 'Océano Pacífico', isCorrect: true },
        { id: 'o4', text: 'Océano Ártico', isCorrect: false },
      ],
    },
    {
      text: '¿Cómo se llaman las grandes elevaciones de terreno con laderas inclinadas y cima?',
      image: art(95),
      timeLimit: 20,
      points: 1000,
      explanation: 'Las montañas son formas del relieve con gran altitud; varias juntas forman una sierra o cordillera.',
      options: [
        { id: 'o1', text: 'Llanuras', isCorrect: false },
        { id: 'o2', text: 'Valles', isCorrect: false },
        { id: 'o3', text: 'Montañas', isCorrect: true },
        { id: 'o4', text: 'Cabos', isCorrect: false },
      ],
    },
    {
      text: '¿Qué civilización antigua construyó las grandes pirámides de Guiza junto al río Nilo?',
      image: art(201),
      timeLimit: 20,
      points: 1000,
      explanation: 'El Antiguo Egipto desarrolló su civilización a orillas del río Nilo y construyó las pirámides.',
      options: [
        { id: 'o1', text: 'Los romanos', isCorrect: false },
        { id: 'o2', text: 'Los egipcios', isCorrect: true },
        { id: 'o3', text: 'Los griegos', isCorrect: false },
        { id: 'o4', text: 'Los vikingos', isCorrect: false },
      ],
    },
  ],
};

export async function POST(req: Request) {
  try {
    const { topic, count = 5 } = await req.json();
    const cleanTopic = (topic || '').toLowerCase().trim();
    const safeCount = Math.min(10, Math.max(1, Number(count) || 5));

    let generated: Question[] = [];

    if (
      cleanTopic.includes('mate') ||
      cleanTopic.includes('calcul') ||
      cleanTopic.includes('tabla') ||
      cleanTopic.includes('multi') ||
      cleanTopic.includes('divis') ||
      cleanTopic.includes('fracci') ||
      cleanTopic.includes('sum') ||
      cleanTopic.includes('rest') ||
      cleanTopic.includes('numer')
    ) {
      generated = buildMathQuestions(safeCount, cleanTopic);
    } else if (
      cleanTopic.includes('lengua') ||
      cleanTopic.includes('ortograf') ||
      cleanTopic.includes('gramat') ||
      cleanTopic.includes('verbo') ||
      cleanTopic.includes('tilde') ||
      cleanTopic.includes('palabra')
    ) {
      generated = TEMPLATES.lengua.slice(0, safeCount).map((q) => ({
        ...q,
        id: uid(),
        options: q.options.map((o) => ({ ...o, id: oid() })),
      }));
    } else if (
      cleanTopic.includes('ingl') ||
      cleanTopic.includes('english') ||
      cleanTopic.includes('vocab')
    ) {
      generated = TEMPLATES.ingles.slice(0, safeCount).map((q) => ({
        ...q,
        id: uid(),
        options: q.options.map((o) => ({ ...o, id: oid() })),
      }));
    } else if (
      cleanTopic.includes('cien') ||
      cleanTopic.includes('natu') ||
      cleanTopic.includes('bio') ||
      cleanTopic.includes('plant') ||
      cleanTopic.includes('animal') ||
      cleanTopic.includes('cuerpo') ||
      cleanTopic.includes('solar') ||
      cleanTopic.includes('planeta') ||
      cleanTopic.includes('universo') ||
      cleanTopic.includes('fotosint')
    ) {
      generated = TEMPLATES.ciencias.slice(0, safeCount).map((q) => ({
        ...q,
        id: uid(),
        options: q.options.map((o) => ({ ...o, id: oid() })),
      }));
    } else if (
      cleanTopic.includes('hist') ||
      cleanTopic.includes('geog') ||
      cleanTopic.includes('social') ||
      cleanTopic.includes('espa') ||
      cleanTopic.includes('rio') ||
      cleanTopic.includes('mapa') ||
      cleanTopic.includes('egipt')
    ) {
      generated = TEMPLATES.geografia_historia.slice(0, safeCount).map((q) => ({
        ...q,
        id: uid(),
        options: q.options.map((o) => ({ ...o, id: oid() })),
      }));
    } else if (
      cleanTopic.includes('poke') ||
      cleanTopic.includes('gimnasio') ||
      cleanTopic.includes('pikachu') ||
      cleanTopic.includes('eevee')
    ) {
      generated = TEMPLATES.pokemon.slice(0, safeCount).map((q) => ({
        ...q,
        id: uid(),
        options: q.options.map((o) => ({ ...o, id: oid() })),
      }));
    } else {
      // Mixed educational sampler if topic is generic
      const mixedPool = [
        ...TEMPLATES.ciencias,
        ...TEMPLATES.lengua,
        ...TEMPLATES.geografia_historia,
        ...TEMPLATES.pokemon,
      ];
      generated = mixedPool
        .sort(() => Math.random() - 0.5)
        .slice(0, safeCount)
        .map((q) => ({
          ...q,
          id: uid(),
          options: q.options.map((o) => ({ ...o, id: oid() })),
        }));
    }

    return NextResponse.json({ success: true, data: generated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al generar preguntas';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
