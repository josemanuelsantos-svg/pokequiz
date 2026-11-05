import { Quiz } from './types';

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-lengua-4primaria',
    title: 'Gimnasio de Lengua 4º: Gramática y Ortografía 📚⚡',
    description: 'Repaso de 4º de Primaria: acentuación (agudas, llanas y esdrújulas), tipos de palabras, prefijos, hiatos, reglas de la B/V y sujeto/predicado.',
    category: 'Lengua • 4º Primaria',
    coverImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png',
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000,
    questions: [
      {
        id: 'len4_1',
        text: 'Pikachu ha lanzado un «RELÁMPAGO». Según la posición de su sílaba tónica (re-LÁM-pa-go), ¿qué tipo de palabra es?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        timeLimit: 20,
        points: 1000,
        explanation: '«Relámpago» lleva la fuerza de voz en la antepenúltima sílaba, por lo que es una palabra esdrújula y siempre lleva tilde.',
        options: [
          { id: 'l1_o1', text: 'Aguda 🔥', isCorrect: false },
          { id: 'l1_o2', text: 'Llana 💧', isCorrect: false },
          { id: 'l1_o3', text: 'Esdrújula ⚡', isCorrect: true },
          { id: 'l1_o4', text: 'Monosílaba 🍃', isCorrect: false }
        ]
      },
      {
        id: 'len4_2',
        text: 'En la oración: «El veloz Charizard vuela sobre el volcán», ¿qué clase de palabra es «veloz»?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
        timeLimit: 20,
        points: 1000,
        explanation: '«Veloz» es un adjetivo calificativo porque nos dice una cualidad de cómo es el sustantivo (Charizard).',
        options: [
          { id: 'l2_o1', text: 'Un sustantivo común', isCorrect: false },
          { id: 'l2_o2', text: 'Un adjetivo calificativo 🔥', isCorrect: true },
          { id: 'l2_o3', text: 'Un verbo en presente', isCorrect: false },
          { id: 'l2_o4', text: 'Un artículo determinado', isCorrect: false }
        ]
      },
      {
        id: 'len4_3',
        text: 'Alakazam estudia los prefijos. ¿Cuál de estas palabras lleva un PREFIJO que significa «volver a hacer»?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'El prefijo «re-» se añade delante de «cargar» (re-cargar) para indicar repetición.',
        options: [
          { id: 'l3_o1', text: 'Recargar 🔮', isCorrect: true },
          { id: 'l3_o2', text: 'Panadero', isCorrect: false },
          { id: 'l3_o3', text: 'Pequenito', isCorrect: false },
          { id: 'l3_o4', text: 'Rápidamente', isCorrect: false }
        ]
      },
      {
        id: 'len4_4',
        text: 'Snorlax escribe en su diario del pasado. ¿Cuál de estas oraciones está escrita CORRECTAMENTE según la regla de la B y la V?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'Todas las formas verbales del pasado acabadas en -aba, -abas, -ábamos, -aban (como «entrenábamos» y «saltaban») se escriben SIEMPRE con B.',
        options: [
          { id: 'l4_o1', text: 'Ayer entrenávamos y saltavan', isCorrect: false },
          { id: 'l4_o2', text: 'Ayer entrenábamos y saltaban 💤', isCorrect: true },
          { id: 'l4_o3', text: 'Ayer entrenábamos y saltavan', isCorrect: false },
          { id: 'l4_o4', text: 'Ayer entrenávamos y saltaban', isCorrect: false }
        ]
      },
      {
        id: 'len4_5',
        text: 'Lapras navega por el mar. ¿Cuál de estas palabras contiene un HIATO (dos vocales juntas que se separan en sílabas distintas)?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png',
        timeLimit: 25,
        points: 1000,
        explanation: '«Océano» (o-cé-a-no) tiene dos vocales abiertas juntas (e-a), por lo que forman un hiato y van en sílabas separadas.',
        options: [
          { id: 'l5_o1', text: 'Agua (a-gua)', isCorrect: false },
          { id: 'l5_o2', text: 'Fuego (fue-go)', isCorrect: false },
          { id: 'l5_o3', text: 'Océano (o-cé-a-no) 🌊', isCorrect: true },
          { id: 'l5_o4', text: 'Aire (ai-re)', isCorrect: false }
        ]
      },
      {
        id: 'len4_6',
        text: 'En la oración: «Los entrenadores de cuarto de primaria ganaron la medalla», ¿cuál es el SUJETO?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'El sujeto indica quién realiza la acción del verbo («ganaron»): «Los entrenadores de cuarto de primaria».',
        options: [
          { id: 'l6_o1', text: 'Ganaron la medalla', isCorrect: false },
          { id: 'l6_o2', text: 'Los entrenadores de cuarto de primaria 🏅', isCorrect: true },
          { id: 'l6_o3', text: 'La medalla', isCorrect: false },
          { id: 'l6_o4', text: 'Cuarto de primaria', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-mates-4primaria',
    title: 'Gimnasio de Matemáticas 4º: Cálculo, Fracciones y Problemas 🔢🔥',
    description: 'Repaso de 4º de Primaria: problemas de varias operaciones, fracciones, división, números decimales con euros, ángulos y números romanos.',
    category: 'Matemáticas • 4º Primaria',
    coverImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png',
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000,
    questions: [
      {
        id: 'mat4_1',
        text: 'El Profesor Oak tiene 6 cajas con 24 Poké Balls en cada una, y además le regalan 15 Super Balls sueltas. ¿Cuántas Balls tiene en total?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png',
        timeLimit: 30,
        points: 1000,
        explanation: 'Primero multiplicamos 6 × 24 = 144 Poké Balls. Después sumamos las 15 sueltas: 144 + 15 = 159 en total.',
        options: [
          { id: 'm1_o1', text: '144 Balls', isCorrect: false },
          { id: 'm1_o2', text: '159 Balls 🔴', isCorrect: true },
          { id: 'm1_o3', text: '169 Balls', isCorrect: false },
          { id: 'm1_o4', text: '45 Balls', isCorrect: false }
        ]
      },
      {
        id: 'mat4_2',
        text: 'Squirtle y sus amigos parten una empanada de bayas en 8 trozos iguales y se comen 3 trozos. ¿Qué fracción de empanada QUEDA en la bandeja?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'Si había 8 octavos (8/8) y se comen 3 octavos (3/8), quedan 8 - 3 = 5 octavos (5/8) sin comer.',
        options: [
          { id: 'm2_o1', text: '3/8 (Tres octavos)', isCorrect: false },
          { id: 'm2_o2', text: '5/8 (Cinco octavos) 🍕', isCorrect: true },
          { id: 'm2_o3', text: '8/5 (Ocho quintos)', isCorrect: false },
          { id: 'm2_o4', text: '5/3 (Cinco tercios)', isCorrect: false }
        ]
      },
      {
        id: 'mat4_3',
        text: 'Queremos repartir 240 puntos de energía en partes iguales entre un equipo de 6 Pokémon. ¿Cuántos puntos recibirá cada Pokémon?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'Dividimos 240 entre 6: como 24 ÷ 6 = 4, entonces 240 ÷ 6 = 40 puntos para cada uno.',
        options: [
          { id: 'm3_o1', text: '40 puntos ⚡', isCorrect: true },
          { id: 'm3_o2', text: '30 puntos', isCorrect: false },
          { id: 'm3_o3', text: '45 puntos', isCorrect: false },
          { id: 'm3_o4', text: '24 puntos', isCorrect: false }
        ]
      },
      {
        id: 'mat4_4',
        text: 'En la Tienda Pokémon una Poción cuesta 2,40 € y una Cuerda Huida cuesta 1,35 €. Si pagas con un billete de 5 €, ¿cuánto dinero te devuelven?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png',
        timeLimit: 30,
        points: 1000,
        explanation: 'El gasto total es 2,40 € + 1,35 € = 3,75 €. Al pagar con 5,00 €, te devuelven 5,00 - 3,75 = 1,25 €.',
        options: [
          { id: 'm4_o1', text: '3,75 €', isCorrect: false },
          { id: 'm4_o2', text: '1,25 € 💰', isCorrect: true },
          { id: 'm4_o3', text: '2,25 €', isCorrect: false },
          { id: 'm4_o4', text: '1,35 €', isCorrect: false }
        ]
      },
      {
        id: 'mat4_5',
        text: 'Scyther coloca sus brazos formando un ángulo que mide 120° (más abierto que un ángulo recto de 90°). ¿Cómo se llama este tipo de ángulo?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'Los ángulos menores de 90° son agudos, el de 90° es recto, y los que miden entre 90° y 180° son ángulos OBTUSOS.',
        options: [
          { id: 'm5_o1', text: 'Ángulo agudo', isCorrect: false },
          { id: 'm5_o2', text: 'Ángulo recto', isCorrect: false },
          { id: 'm5_o3', text: 'Ángulo obtuso 📐', isCorrect: true },
          { id: 'm5_o4', text: 'Ángulo llano', isCorrect: false }
        ]
      },
      {
        id: 'mat4_6',
        text: 'En el templo legendario de Regirock está grabado el número romano «XLIV». ¿Qué número es en nuestro sistema decimal?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/377.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'XL es 40 (50 menos 10) e IV es 4 (5 menos 1). Por tanto, XLIV = 44.',
        options: [
          { id: 'm6_o1', text: '64', isCorrect: false },
          { id: 'm6_o2', text: '44 🏛️', isCorrect: true },
          { id: 'm6_o3', text: '46', isCorrect: false },
          { id: 'm6_o4', text: '54', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-ingles-4primaria',
    title: 'Pokémon English Gym 4th Grade: Grammar & Vocabulary 🇬🇧💧',
    description: '4th Grade English review: Present Simple vs Continuous, Comparatives & Superlatives, There is/are, Prepositions and Modal Can.',
    category: 'Inglés (English) • 4º Primaria',
    coverImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
    createdAt: Date.now() - 3000,
    updatedAt: Date.now() - 3000,
    questions: [
      {
        id: 'eng4_1',
        text: 'Look at Jigglypuff right now! Listen! She _______________ a beautiful song.',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'With "right now" and "Listen!", we use the Present Continuous: verb TO BE (is) + verb with -ING (singing).',
        options: [
          { id: 'e1_o1', text: 'sing', isCorrect: false },
          { id: 'e1_o2', text: 'is singing 🎤', isCorrect: true },
          { id: 'e1_o3', text: 'are singing', isCorrect: false },
          { id: 'e1_o4', text: 'sings', isCorrect: false }
        ]
      },
      {
        id: 'eng4_2',
        text: 'Compare these two Pokémon: Onix is _____________ than Pikachu!',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'To compare two things with a short adjective (big) + "than", we add -er and double the consonant: "bigger than".',
        options: [
          { id: 'e2_o1', text: 'more big', isCorrect: false },
          { id: 'e2_o2', text: 'the biggest', isCorrect: false },
          { id: 'e2_o3', text: 'bigger 🪨', isCorrect: true },
          { id: 'e2_o4', text: 'big', isCorrect: false }
        ]
      },
      {
        id: 'eng4_3',
        text: 'Daily routine: Ash usually wakes up ______ 7 o’clock ______ the morning.',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'We use "AT" with clock times (at 7 o’clock) and "IN" with parts of the day (in the morning).',
        options: [
          { id: 'e3_o1', text: 'on / at', isCorrect: false },
          { id: 'e3_o2', text: 'at / in ⏰', isCorrect: true },
          { id: 'e3_o3', text: 'in / on', isCorrect: false },
          { id: 'e3_o4', text: 'at / on', isCorrect: false }
        ]
      },
      {
        id: 'eng4_4',
        text: 'Eevee loves sweet berries, but she _____________ like spicy food.',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'In the Present Simple negative for He / She / It, we use "doesn’t" + base verb (doesn’t like).',
        options: [
          { id: 'e4_o1', text: 'don’t', isCorrect: false },
          { id: 'e4_o2', text: 'isn’t', isCorrect: false },
          { id: 'e4_o3', text: 'doesn’t 🦊', isCorrect: true },
          { id: 'e4_o4', text: 'not', isCorrect: false }
        ]
      },
      {
        id: 'eng4_5',
        text: '_____________ three Water-type Pokémon in the lake, but there aren’t _____________ Fire-type Pokémon.',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'We use "There are" for pluralaffirmative (three Pokémon) and "any" in negative plural sentences.',
        options: [
          { id: 'e5_o1', text: 'There is / some', isCorrect: false },
          { id: 'e5_o2', text: 'There are / any 💧', isCorrect: true },
          { id: 'e5_o3', text: 'There are / a', isCorrect: false },
          { id: 'e5_o4', text: 'There is / any', isCorrect: false }
        ]
      },
      {
        id: 'eng4_6',
        text: 'Dragonite has got two wings and is very strong. What can he do?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'After modal verb "can", we always use the infinitive without "to": "He can fly very fast!".',
        options: [
          { id: 'e6_o1', text: 'He can flies very fast', isCorrect: false },
          { id: 'e6_o2', text: 'He can fly very fast! 🐉', isCorrect: true },
          { id: 'e6_o3', text: 'He cans fly very fast', isCorrect: false },
          { id: 'e6_o4', text: 'He is can fly', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-reto-global-4primaria',
    title: 'Gran Torneo 4º Primaria: Reto Multidisciplinar 🏆🌟',
    description: 'Prueba combinada de Lengua, Matemáticas e Inglés de 4º de Primaria para repasar jugando en equipo o individualmente.',
    category: 'Especial Mixto • 4º Primaria',
    coverImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 4000,
    questions: [
      {
        id: 'mix4_1',
        text: '[LENGUA] ¿Por qué la palabra «ÁRBOL» lleva tilde en la A?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        timeLimit: 20,
        points: 1000,
        explanation: '«Ár-bol» es una palabra LLANA (fuerza en la penúltima sílaba) que termina en consonante distinta de N o S (termina en L).',
        options: [
          { id: 'mx1_o1', text: 'Porque es aguda terminada en L', isCorrect: false },
          { id: 'mx1_o2', text: 'Porque es llana y no termina ni en N, ni en S, ni en vocal 🍃', isCorrect: true },
          { id: 'mx1_o3', text: 'Porque es esdrújula', isCorrect: false },
          { id: 'mx1_o4', text: 'Porque todas las palabras con R llevan tilde', isCorrect: false }
        ]
      },
      {
        id: 'mix4_2',
        text: '[MATEMÁTICAS] Un gimnasio Pokémon tiene forma rectangular y mide 20 metros de largo y 10 metros de ancho. ¿Cuál es su PERÍMETRO total?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'El perímetro es la suma de los 4 lados del rectángulo: 20 + 10 + 20 + 10 = 60 metros.',
        options: [
          { id: 'mx2_o1', text: '30 metros', isCorrect: false },
          { id: 'mx2_o2', text: '200 metros', isCorrect: false },
          { id: 'mx2_o3', text: '60 metros 📏', isCorrect: true },
          { id: 'mx2_o4', text: '40 metros', isCorrect: false }
        ]
      },
      {
        id: 'mix4_3',
        text: '[ENGLISH] Choose the correct superlative: Mewtwo is _________________ Pokémon in the laboratory!',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'For long adjectives like "powerful", the superlative is formed with "the most + adjective": "the most powerful".',
        options: [
          { id: 'mx3_o1', text: 'more powerful', isCorrect: false },
          { id: 'mx3_o2', text: 'the most powerful 🔮', isCorrect: true },
          { id: 'mx3_o3', text: 'the powerfulest', isCorrect: false },
          { id: 'mx3_o4', text: 'most powerful than', isCorrect: false }
        ]
      },
      {
        id: 'mix4_4',
        text: '[LENGUA] ¿Cuál de estos grupos contiene ÚNICAMENTE verbos en infinitivo (1ª, 2ª y 3ª conjugación)?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
        timeLimit: 20,
        points: 1000,
        explanation: 'Los infinitivos terminan en -AR (1ª conjugación: saltar), -ER (2ª: correr) e -IR (3ª: vivir).',
        options: [
          { id: 'mx4_o1', text: 'Saltar, correr y vivir ⚡', isCorrect: true },
          { id: 'mx4_o2', text: 'Rápido, fuerte y valiente', isCorrect: false },
          { id: 'mx4_o3', text: 'Gimnasio, medalla y entrenador', isCorrect: false },
          { id: 'mx4_o4', text: 'Ayer, hoy y mañana', isCorrect: false }
        ]
      },
      {
        id: 'mix4_5',
        text: '[MATEMÁTICAS] Un combate empieza a las 16:45 h y dura 35 minutos. ¿A qué hora termina el combate?',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
        timeLimit: 25,
        points: 1000,
        explanation: 'De las 16:45 a las 17:00 van 15 minutos, y sumando los 20 minutos restantes llegamos a las 17:20 h.',
        options: [
          { id: 'mx5_o1', text: 'A las 17:10 h', isCorrect: false },
          { id: 'mx5_o2', text: 'A las 17:20 h 🕔', isCorrect: true },
          { id: 'mx5_o3', text: 'A las 17:35 h', isCorrect: false },
          { id: 'mx5_o4', text: 'A las 16:80 h', isCorrect: false }
        ]
      },
      {
        id: 'mix4_6',
        text: '[ENGLISH] Where is Gengar hiding? "He is hiding _________ the sofa!" (detrás del sofá)',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
        timeLimit: 15,
        points: 1000,
        explanation: '"Behind" means "detrás de", "under" means "debajo de", "between" means "entre", and "in front of" means "delante de".',
        options: [
          { id: 'mx6_o1', text: 'under', isCorrect: false },
          { id: 'mx6_o2', text: 'in front of', isCorrect: false },
          { id: 'mx6_o3', text: 'behind 👻', isCorrect: true },
          { id: 'mx6_o4', text: 'between', isCorrect: false }
        ]
      }
    ]
  }
];
