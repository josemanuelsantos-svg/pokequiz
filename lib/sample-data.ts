import { Quiz } from './types';

const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

interface RawQuiz {
  id: string;
  title: string;
  description: string;
  category?: string;
  coverImage?: string;
  createdAt: number;
  questions: {
    id: string;
    text: string;
    imageUrl?: string;
    timeLimit: number;
    points: number;
    correctOptionId: string;
    explanation?: string;
    options: { id: string; text: string }[];
  }[];
}

const RAW_QUIZZES: RawQuiz[] = [
  // ============================================================================
  // 1. LENGUA CASTELLANA - 4º DE PRIMARIA (20 PREGUNTAS)
  // ============================================================================
  {
    id: 'quiz-lengua-4primaria',
    title: 'Gimnasio de Lengua 4º: Gramática y Ortografía 📚⚡',
    description:
      '20 retos de Lengua Castellana para 4º de Primaria: acentuación, sustantivos, adjetivos, verbos, prefijos, determinantes, sujeto/predicado y ortografía.',
    coverImage: art(25), // Pikachu
    createdAt: Date.now() - 86400000 * 4,
    questions: [
      {
        id: 'len-4p-1',
        text: '¿Cuál de estas palabras es AGUDA y lleva tilde correctamente?',
        imageUrl: art(25), // Pikachu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Las palabras agudas tienen la sílaba tónica en la última sílaba y llevan tilde cuando terminan en vocal, -n o -s (Ca-mión).',
        options: [
          { id: 'opt-1', text: 'Relámpago' },
          { id: 'opt-2', text: 'Entrenador' },
          { id: 'opt-3', text: 'Camión' },
          { id: 'opt-4', text: 'Medalla' },
        ],
      },
      {
        id: 'len-4p-2',
        text: 'En la oración: "Pikachu vive en un bosque frondoso", ¿cuál es el SUSTANTIVO COMÚN?',
        imageUrl: art(1), // Bulbasaur
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '"Bosque" es un sustantivo común porque nombra cualquier lugar de ese tipo en general. "Pikachu" es sustantivo propio y "frondoso" es un adjetivo.',
        options: [
          { id: 'opt-1', text: 'Pikachu' },
          { id: 'opt-2', text: 'bosque' },
          { id: 'opt-3', text: 'vive' },
          { id: 'opt-4', text: 'frondoso' },
        ],
      },
      {
        id: 'len-4p-3',
        text: '¿Qué palabra de la frase "El rápido Arcanine saltó la roca gris" son ADJETIVOS?',
        imageUrl: art(59), // Arcanine
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Los adjetivos calificativos nos dicen cómo son o cómo están los sustantivos: "rápido" (describe a Arcanine) y "gris" (describe a la roca).',
        options: [
          { id: 'opt-1', text: 'rápido y gris' },
          { id: 'opt-2', text: 'Arcanine y roca' },
          { id: 'opt-3', text: 'El y la' },
          { id: 'opt-4', text: 'saltó y roca' },
        ],
      },
      {
        id: 'len-4p-4',
        text: '¿En qué tiempo verbal está el verbo de la oración: "Mañana ganaremos la medalla del gimnasio"?',
        imageUrl: art(6), // Charizard
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '"Ganaremos" expresa una acción que sucederá después de ahora, por lo tanto está en tiempo FUTURO (1ª persona del plural: nosotros).',
        options: [
          { id: 'opt-1', text: 'Pasado (Pretérito)' },
          { id: 'opt-2', text: 'Presente' },
          { id: 'opt-3', text: 'Futuro' },
          { id: 'opt-4', text: 'Infinitivo' },
        ],
      },
      {
        id: 'len-4p-5',
        text: 'Identifica el SUJETO en la oración: "Los entrenadores de Kanto viajan en barco".',
        imageUrl: art(131), // Lapras
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'El sujeto indica quién realiza la acción del verbo (¿quiénes viajan en barco? -> "Los entrenadores de Kanto").',
        options: [
          { id: 'opt-1', text: 'viajan en barco' },
          { id: 'opt-2', text: 'Los entrenadores de Kanto' },
          { id: 'opt-3', text: 'en barco' },
          { id: 'opt-4', text: 'viajan' },
        ],
      },
      {
        id: 'len-4p-6',
        text: 'Regla de ortografía de la B y la V: ¿Cuál de estas parejas de palabras está BIEN escrita?',
        imageUrl: art(9), // Blastoise
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Se escriben siempre con B las sílabas con "br-" y "bl-" (brillante, blanco, abrazo, pueblo) y los verbos en pasado terminados en "-aba" (cantaba).',
        options: [
          { id: 'opt-1', text: 'Vrillante y vlanco' },
          { id: 'opt-2', text: 'Brillante y vlanco' },
          { id: 'opt-3', text: 'CantaVa y jugaba' },
          { id: 'opt-4', text: 'Brillante y cantaba' },
        ],
      },
      {
        id: 'len-4p-7',
        text: '¿Cuál de las siguientes palabras es ESDRÚJULA?',
        imageUrl: art(145), // Zapdos
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Las palabras esdrújulas tienen la sílaba tónica en la antepenúltima sílaba (Re-lám-pa-go) y SIEMPRE llevan tilde.',
        options: [
          { id: 'opt-1', text: 'Relámpago' },
          { id: 'opt-2', text: 'Volcán' },
          { id: 'opt-3', text: 'Césped' },
          { id: 'opt-4', text: 'Pokéball' },
        ],
      },
      {
        id: 'len-4p-8',
        text: '¿Por qué la palabra "ÁRBOL" lleva tilde?',
        imageUrl: art(185), // Sudowoodo
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '"Ár-bol" es una palabra LLANA (fuerza en la penúltima sílaba) y las llanas llevan tilde cuando NO terminan ni en vocal, ni en -n, ni en -s.',
        options: [
          { id: 'opt-1', text: 'Porque es aguda y termina en consonante.' },
          { id: 'opt-2', text: 'Porque es llana y no termina en vocal, -n ni -s.' },
          { id: 'opt-3', text: 'Porque es esdrújula.' },
          { id: 'opt-4', text: 'Porque empieza por la vocal A.' },
        ],
      },
      {
        id: 'len-4p-9',
        text: '¿Cuál es un SINÓNIMO (significado igual o muy parecido) de la palabra "VELOZ"?',
        imageUrl: art(135), // Jolteon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Los sinónimos son palabras que significan lo mismo o algo muy parecido: "veloz" y "rápido" son sinónimos.',
        options: [
          { id: 'opt-1', text: 'Lento' },
          { id: 'opt-2', text: 'Pesado' },
          { id: 'opt-3', text: 'Rápido' },
          { id: 'opt-4', text: 'Tranquilo' },
        ],
      },
      {
        id: 'len-4p-10',
        text: '¿Cuál es el ANTÓNIMO (significado contrario) de la palabra "VALIENTE"?',
        imageUrl: art(448), // Lucario
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Los antónimos son palabras con significados opuestos: lo contrario de "valiente" es "miedoso" o "cobarde".',
        options: [
          { id: 'opt-1', text: 'Atrevido' },
          { id: 'opt-2', text: 'Miedoso' },
          { id: 'opt-3', text: 'Fuerte' },
          { id: 'opt-4', text: 'Heroico' },
        ],
      },
      {
        id: 'len-4p-11',
        text: '¿Cuál de estas palabras contiene un PREFIJO?',
        imageUrl: art(150), // Mewtwo
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Los prefijos son partículas que se añaden DELANTE de una palabra para formar otra nueva: "des-" + "hacer" = "deshacer".',
        options: [
          { id: 'opt-1', text: 'Jardinero' },
          { id: 'opt-2', text: 'Casita' },
          { id: 'opt-3', text: 'Panadería' },
          { id: 'opt-4', text: 'Deshacer' },
        ],
      },
      {
        id: 'len-4p-12',
        text: 'Si decimos "Squirtle es un Pokémon pequeñito", la palabra "pequeñito" lleva un sufijo...',
        imageUrl: art(7), // Squirtle
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Los sufijos "-ito / -ita / -illo / -illa" son sufijos DIMINUTIVOS porque indican tamaño pequeño o cariño.',
        options: [
          { id: 'opt-1', text: 'Diminutivo' },
          { id: 'opt-2', text: 'Aumentativo' },
          { id: 'opt-3', text: 'Prefijo' },
          { id: 'opt-4', text: 'Gentilicio' },
        ],
      },
      {
        id: 'len-4p-13',
        text: 'En "LAS medallas están en EL estuche", las palabras "LAS" y "EL" son...',
        imageUrl: art(133), // Eevee
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '"El, la, los, las" son determinantes artículos determinados porque acompañan a sustantivos conocidos.',
        options: [
          { id: 'opt-1', text: 'Verbos' },
          { id: 'opt-2', text: 'Adjetivos' },
          { id: 'opt-3', text: 'Determinantes artículos determinados' },
          { id: 'opt-4', text: 'Sustantivos propios' },
        ],
      },
      {
        id: 'len-4p-14',
        text: '¿Qué determinante demostrativo indica CERCANÍA en la frase: "___ Pokéball que tengo en la mano es mía"?',
        imageUrl: art(100), // Voltorb
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Los demostrativos de cercanía son: este, esta, estos, estas. Distancia media: ese/esa. Lejanía: aquel/aquella.',
        options: [
          { id: 'opt-1', text: 'Esta' },
          { id: 'opt-2', text: 'Esa' },
          { id: 'opt-3', text: 'Aquella' },
          { id: 'opt-4', text: 'Aquel' },
        ],
      },
      {
        id: 'len-4p-15',
        text: 'Sustituye el sujeto por un PRONOMBRE PERSONAL: "Misty y yo entrenamos en el gimnasio".',
        imageUrl: art(121), // Starmie
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '"Misty y yo" equivale al pronombre personal de 1ª persona del plural: "Nosotros / Nosotras".',
        options: [
          { id: 'opt-1', text: 'Vosotros' },
          { id: 'opt-2', text: 'Nosotros / Nosotras' },
          { id: 'opt-3', text: 'Ellos' },
          { id: 'opt-4', text: 'Tú' },
        ],
      },
      {
        id: 'len-4p-16',
        text: '¿A qué conjugación pertenece el verbo "COMPARTIR"?',
        imageUrl: art(175), // Togepi
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '1ª conjugación: verbos terminados en -AR. 2ª conjugación: terminados en -ER. 3ª conjugación: terminados en -IR (como compartir).',
        options: [
          { id: 'opt-1', text: '1ª conjugación (-ar)' },
          { id: 'opt-2', text: '2ª conjugación (-er)' },
          { id: 'opt-3', text: '3ª conjugación (-ir)' },
          { id: 'opt-4', text: 'No tiene conjugación' },
        ],
      },
      {
        id: 'len-4p-17',
        text: 'Regla de la G y la J: Todas las palabras que terminan en "-AJE" (como viaje o equipaje) se escriben con...',
        imageUrl: art(18), // Pidgeot
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Se escriben con J todas las palabras terminadas en "-aje" y "-eje" (viaje, equipaje, paisaje, coraje).',
        options: [
          { id: 'opt-1', text: 'Con G' },
          { id: 'opt-2', text: 'Con J' },
          { id: 'opt-3', text: 'Con GU' },
          { id: 'opt-4', text: 'Con H intercalada' },
        ],
      },
      {
        id: 'len-4p-18',
        text: 'Ortografía de la H: ¿Cuál de estas series de palabras está escrita CORRECTAMENTE?',
        imageUrl: art(144), // Articuno
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Se escriben siempre con H inicial todas las palabras que empiezan por "hie-" y "hue-" (hielo, hierba, huevo, huella, hueso).',
        options: [
          { id: 'opt-1', text: 'Ielo, huella y hierba' },
          { id: 'opt-2', text: 'Hielo, uella y ierba' },
          { id: 'opt-3', text: 'Hielo, uevo y hueso' },
          { id: 'opt-4', text: 'Hielo, huella y huevo' },
        ],
      },
      {
        id: 'len-4p-19',
        text: '¿Cuál de las siguientes palabras es una PALABRA COMPUESTA (formada por la unión de dos palabras simples)?',
        imageUrl: art(26), // Raichu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          '"Pararrayos" es una palabra compuesta formada por el verbo "parar" + el sustantivo "rayos".',
        options: [
          { id: 'opt-1', text: 'Pararrayos' },
          { id: 'opt-2', text: 'Montaña' },
          { id: 'opt-3', text: 'Electricidad' },
          { id: 'opt-4', text: 'Camiseta' },
        ],
      },
      {
        id: 'len-4p-20',
        text: 'Según la actitud del hablante, la oración "¡Qué alegría ver a Mew en el cielo!" es una oración...',
        imageUrl: art(151), // Mew
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Es una oración EXCLAMATIVA porque expresa emociones como alegría, sorpresa o admiración y va entre signos de exclamación (¡ !).',
        options: [
          { id: 'opt-1', text: 'Interrogativa' },
          { id: 'opt-2', text: 'Enunciativa negativa' },
          { id: 'opt-3', text: 'Exclamativa' },
          { id: 'opt-4', text: 'Imperativa (de orden)' },
        ],
      },
    ],
  },

  // ============================================================================
  // 2. MATEMÁTICAS - 4º DE PRIMARIA (20 PREGUNTAS)
  // ============================================================================
  {
    id: 'quiz-mates-4primaria',
    title: 'Gimnasio de Matemáticas 4º: Cálculo, Fracciones y Problemas 🔢🔥',
    description:
      '20 desafíos matemáticos de 4º de Primaria: multiplicación, división, fracciones, decimales, unidades de medida, polígonos, ángulos y problemas.',
    coverImage: art(6), // Charizard
    createdAt: Date.now() - 86400000 * 3,
    questions: [
      {
        id: 'mat-4p-1',
        text: 'El Profesor Oak tiene 24 cajas con 5 Pokéballs en cada caja. ¿Cuántas Pokéballs tiene en total?',
        imageUrl: art(100), // Voltorb
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Multiplicamos 24 cajas × 5 Pokéballs = 120 Pokéballs en total (20 × 5 = 100 y 4 × 5 = 20 -> 100 + 20 = 120).',
        options: [
          { id: 'opt-1', text: '100 Pokéballs' },
          { id: 'opt-2', text: '120 Pokéballs' },
          { id: 'opt-3', text: '115 Pokéballs' },
          { id: 'opt-4', text: '140 Pokéballs' },
        ],
      },
      {
        id: 'mat-4p-2',
        text: 'Queremos repartir 63 bayas en partes iguales entre 7 Pokémon. ¿Cuántas bayas recibirá cada uno?',
        imageUrl: art(133), // Eevee
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Dividimos 63 ÷ 7 = 9 bayas para cada Pokémon, porque 7 × 9 = 63 (división exacta con resto 0).',
        options: [
          { id: 'opt-1', text: '7 bayas' },
          { id: 'opt-2', text: '8 bayas' },
          { id: 'opt-3', text: '6 bayas' },
          { id: 'opt-4', text: '9 bayas' },
        ],
      },
      {
        id: 'mat-4p-3',
        text: 'Snorlax ha dividido una pizza en 8 trozos iguales y se ha comido 3 trozos. ¿Qué FRACCIÓN de la pizza se ha comido?',
        imageUrl: art(143), // Snorlax
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'El denominador (abajo) son las 8 partes iguales en que se divide la pizza y el numerador (arriba) son las 3 partes que come: 3/8 (tres octavos).',
        options: [
          { id: 'opt-1', text: '3/8 (Tres octavos)' },
          { id: 'opt-2', text: '8/3 (Ocho tercios)' },
          { id: 'opt-3', text: '5/8 (Cinco octavos)' },
          { id: 'opt-4', text: '3/5 (Tres quintos)' },
        ],
      },
      {
        id: 'mat-4p-4',
        text: 'El campo de entrenamiento Pokémon es un CUADRADO y cada lado mide 9 metros. ¿Cuál es su PERÍMETRO total?',
        imageUrl: art(448), // Lucario
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'El perímetro es la suma de todos los lados. Como un cuadrado tiene 4 lados iguales: 9 m × 4 = 36 metros.',
        options: [
          { id: 'opt-1', text: '18 metros' },
          { id: 'opt-2', text: '27 metros' },
          { id: 'opt-3', text: '36 metros' },
          { id: 'opt-4', text: '81 metros' },
        ],
      },
      {
        id: 'mat-4p-5',
        text: 'Un Onix mide 3 metros y 45 centímetros de largo. ¿Cuántos CENTÍMETROS mide en total?',
        imageUrl: art(95), // Onix
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Como 1 metro equivale a 100 centímetros, 3 metros son 300 cm. Sumamos: 300 cm + 45 cm = 345 cm.',
        options: [
          { id: 'opt-1', text: '3.045 cm' },
          { id: 'opt-2', text: '345 cm' },
          { id: 'opt-3', text: '75 cm' },
          { id: 'opt-4', text: '34,5 cm' },
        ],
      },
      {
        id: 'mat-4p-6',
        text: '¿Cómo se llama el ángulo que mide exactamente 90 grados (como la esquina de una pizarra)?',
        imageUrl: art(137), // Porygon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Un ángulo de 90° es un ángulo RECTO. Si mide menos de 90° es agudo, y si mide más de 90° (y menos de 180°) es obtuso.',
        options: [
          { id: 'opt-1', text: 'Ángulo Agudo' },
          { id: 'opt-2', text: 'Ángulo Recto' },
          { id: 'opt-3', text: 'Ángulo Obtuso' },
          { id: 'opt-4', text: 'Ángulo Llano' },
        ],
      },
      {
        id: 'mat-4p-7',
        text: 'En el número 45.829, ¿qué valor en unidades tiene la cifra 5?',
        imageUrl: art(65), // Alakazam
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'El 5 ocupa la posición de las Unidades de Millar (UM), por lo que vale 5.000 unidades.',
        options: [
          { id: 'opt-1', text: '50 unidades' },
          { id: 'opt-2', text: '500 unidades' },
          { id: 'opt-3', text: '5.000 unidades' },
          { id: 'opt-4', text: '50.000 unidades' },
        ],
      },
      {
        id: 'mat-4p-8',
        text: 'Si aproximamos (redondeamos) el número 684 a la CENTENA más cercana, ¿qué número obtenemos?',
        imageUrl: art(149), // Dragonite
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '684 está entre 600 y 700. Como la cifra de las decenas es 8 (mayor o igual que 5), redondeamos hacia arriba: 700.',
        options: [
          { id: 'opt-1', text: '600' },
          { id: 'opt-2', text: '650' },
          { id: 'opt-3', text: '680' },
          { id: 'opt-4', text: '700' },
        ],
      },
      {
        id: 'mat-4p-9',
        text: '¿Qué número representa el número romano "XLIV"?',
        imageUrl: art(138), // Omanyte
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'En números romanos, XL es 40 (50 - 10) e IV es 4 (5 - 1). Por tanto, XLIV = 44.',
        options: [
          { id: 'opt-1', text: '44' },
          { id: 'opt-2', text: '64' },
          { id: 'opt-3', text: '46' },
          { id: 'opt-4', text: '54' },
        ],
      },
      {
        id: 'mat-4p-10',
        text: 'Resuelve respetando el orden de las operaciones: 10 + 4 × 5 =',
        imageUrl: art(82), // Magneton
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'En las operaciones combinadas sin paréntesis, PRIMERO se hace la multiplicación (4 × 5 = 20) y luego la suma (10 + 20 = 30).',
        options: [
          { id: 'opt-1', text: '70' },
          { id: 'opt-2', text: '30' },
          { id: 'opt-3', text: '50' },
          { id: 'opt-4', text: '25' },
        ],
      },
      {
        id: 'mat-4p-11',
        text: 'Si repartimos 29 pociones entre 4 entrenadores en partes iguales, ¿cuántas recibe cada uno y cuántas sobran (resto)?',
        imageUrl: art(113), // Chansey
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '29 ÷ 4 tiene cociente 7 (porque 4 × 7 = 28) y resto 1 (29 - 28 = 1 poción sobrante).',
        options: [
          { id: 'opt-1', text: 'Cociente 6 y resto 5' },
          { id: 'opt-2', text: 'Cociente 7 y resto 0' },
          { id: 'opt-3', text: 'Cociente 7 y resto 1' },
          { id: 'opt-4', text: 'Cociente 8 y resto 1' },
        ],
      },
      {
        id: 'mat-4p-12',
        text: 'En una tienda hay 80 Pokéballs y 1/4 (un cuarto) de ellas son Superballs. ¿Cuántas Superballs hay?',
        imageUrl: art(120), // Staryu
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Para calcular 1/4 de 80, dividimos 80 entre el denominador (4): 80 ÷ 4 = 20 Superballs.',
        options: [
          { id: 'opt-1', text: '20 Superballs' },
          { id: 'opt-2', text: '40 Superballs' },
          { id: 'opt-3', text: '10 Superballs' },
          { id: 'opt-4', text: '25 Superballs' },
        ],
      },
      {
        id: 'mat-4p-13',
        text: 'Suma de números decimales: Pikachu pesa 6,2 kg y Eevee pesa 6,5 kg. ¿Cuánto pesan los dos juntos?',
        imageUrl: art(25), // Pikachu
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Alineamos las comas decimales: 6,2 + 6,5 = 12,7 kg.',
        options: [
          { id: 'opt-1', text: '12,3 kg' },
          { id: 'opt-2', text: '11,7 kg' },
          { id: 'opt-3', text: '13,7 kg' },
          { id: 'opt-4', text: '12,7 kg' },
        ],
      },
      {
        id: 'mat-4p-14',
        text: 'Un saco de comida Pokémon pesa 2 kilos y medio (2,5 kg). ¿Cuántos GRAMOS son?',
        imageUrl: art(68), // Machamp
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '1 kilogramo son 1.000 gramos y medio kilo son 500 gramos: 2.000 g + 500 g = 2.500 gramos.',
        options: [
          { id: 'opt-1', text: '250 gramos' },
          { id: 'opt-2', text: '2.500 gramos' },
          { id: 'opt-3', text: '25.000 gramos' },
          { id: 'opt-4', text: '2.050 gramos' },
        ],
      },
      {
        id: 'mat-4p-15',
        text: 'Squirtle llena una garrafa de 2 litros con botellas pequeñas de un cuarto de litro (1/4 L). ¿Cuántas botellas pequeñas necesita?',
        imageUrl: art(7), // Squirtle
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'En 1 litro caben 4 cuartos de litro. Por tanto, en 2 litros caben 2 × 4 = 8 cuartos de litro.',
        options: [
          { id: 'opt-1', text: '4 botellas' },
          { id: 'opt-2', text: '6 botellas' },
          { id: 'opt-3', text: '8 botellas' },
          { id: 'opt-4', text: '10 botellas' },
        ],
      },
      {
        id: 'mat-4p-16',
        text: 'El torneo Pokémon empieza a las 10:15 de la mañana y termina a las 11:00. ¿Cuántos MINUTOS ha durado?',
        imageUrl: art(164), // Noctowl
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Una hora tiene 60 minutos. Desde las 10:15 hasta las 11:00 van 60 - 15 = 45 minutos (tres cuartos de hora).',
        options: [
          { id: 'opt-1', text: '30 minutos' },
          { id: 'opt-2', text: '45 minutos' },
          { id: 'opt-3', text: '50 minutos' },
          { id: 'opt-4', text: '85 minutos' },
        ],
      },
      {
        id: 'mat-4p-17',
        text: '¿Cómo se llama el polígono que tiene 6 lados y 6 vértices (como las celdas de una colmena de Combee)?',
        imageUrl: art(415), // Combee
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Un polígono de 6 lados es un HEXÁGONO (5 lados = pentágono, 7 lados = heptágono, 8 lados = octógono).',
        options: [
          { id: 'opt-1', text: 'Pentágono' },
          { id: 'opt-2', text: 'Octógono' },
          { id: 'opt-3', text: 'Hexágono' },
          { id: 'opt-4', text: 'Cuadrilátero' },
        ],
      },
      {
        id: 'mat-4p-18',
        text: 'Según sus lados, ¿cómo se llama el triángulo que tiene sus 3 LADOS IGUALES?',
        imageUrl: art(121), // Starmie
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Equilátero = 3 lados iguales; Isósceles = 2 lados iguales; Escaleno = 3 lados desiguales.',
        options: [
          { id: 'opt-1', text: 'Triángulo Equilátero' },
          { id: 'opt-2', text: 'Triángulo Isósceles' },
          { id: 'opt-3', text: 'Triángulo Escaleno' },
          { id: 'opt-4', text: 'Triángulo Obtusángulo' },
        ],
      },
      {
        id: 'mat-4p-19',
        text: 'Dos líneas rectas que van en la misma dirección y NUNCA se cortan por mucho que se alarguen (como las vías del tren) son...',
        imageUrl: art(50), // Diglett
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Las rectas que nunca se cruzan son rectas PARALELAS. Si se cruzan en un punto son secantes (y si forman 4 ángulos de 90° son perpendiculares).',
        options: [
          { id: 'opt-1', text: 'Rectas Secantes' },
          { id: 'opt-2', text: 'Rectas Paralelas' },
          { id: 'opt-3', text: 'Rectas Perpendiculares' },
          { id: 'opt-4', text: 'Rectas Curvas' },
        ],
      },
      {
        id: 'mat-4p-20',
        text: 'Compras una gorra de la Liga Pokémon que cuesta 12,50 € y pagas con un billete de 20 €. ¿Cuánto dinero te devuelven?',
        imageUrl: art(52), // Meowth
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Restamos 20,00 € - 12,50 € = 7,50 € de cambio.',
        options: [
          { id: 'opt-1', text: '8,50 €' },
          { id: 'opt-2', text: '6,50 €' },
          { id: 'opt-3', text: '7,00 €' },
          { id: 'opt-4', text: '7,50 €' },
        ],
      },
    ],
  },

  // ============================================================================
  // 3. INGLÉS (ENGLISH) - 4º DE PRIMARIA (20 PREGUNTAS)
  // ============================================================================
  {
    id: 'quiz-ingles-4primaria',
    title: 'Pokémon English Gym 4th Grade: Grammar & Vocabulary 🇬🇧💧',
    description:
      '20 English challenges for 4th Grade Primary: Present Simple & Continuous, Comparatives & Superlatives, Prepositions, Time, Past To Be & Vocabulary.',
    coverImage: art(7), // Squirtle
    createdAt: Date.now() - 86400000 * 2,
    questions: [
      {
        id: 'eng-4p-1',
        text: 'Choose the correct PRESENT CONTINUOUS sentence: "Look! Snorlax ___ under the tree right now."',
        imageUrl: art(143), // Snorlax
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'For actions happening right now we use Present Continuous: verb To Be (is) + verb with -ing (is sleeping).',
        options: [
          { id: 'opt-1', text: 'sleep' },
          { id: 'opt-2', text: 'is sleeping' },
          { id: 'opt-3', text: 'are sleeping' },
          { id: 'opt-4', text: 'sleeping' },
        ],
      },
      {
        id: 'eng-4p-2',
        text: 'Comparative Adjectives: "Jolteon is ___ than Slowpoke."',
        imageUrl: art(135), // Jolteon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'To compare two things with a short adjective like "fast", we add "-er" + than: "faster than".',
        options: [
          { id: 'opt-1', text: 'fast' },
          { id: 'opt-2', text: 'fastest' },
          { id: 'opt-3', text: 'faster' },
          { id: 'opt-4', text: 'more fast' },
        ],
      },
      {
        id: 'eng-4p-3',
        text: 'There is / There are: "___ four Pokéballs on the table."',
        imageUrl: art(133), // Eevee
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'We use "There is" for singular (1) and "There are" for plural (2 or more: four Pokéballs).',
        options: [
          { id: 'opt-1', text: 'There is' },
          { id: 'opt-2', text: 'There are' },
          { id: 'opt-3', text: 'Is there' },
          { id: 'opt-4', text: 'There isn’t' },
        ],
      },
      {
        id: 'eng-4p-4',
        text: 'Prepositions of Place: Where is Diglett hiding? "Diglett is ___ the ground (debajo de la tierra)."',
        imageUrl: art(50), // Diglett
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '"Under" means debajo de. ("On" = encima de, "Behind" = detrás de, "Next to" = al lado de).',
        options: [
          { id: 'opt-1', text: 'on' },
          { id: 'opt-2', text: 'behind' },
          { id: 'opt-3', text: 'between' },
          { id: 'opt-4', text: 'under' },
        ],
      },
      {
        id: 'eng-4p-5',
        text: 'Daily Routines (Present Simple): "Every morning, Ash ___ up at seven o’clock."',
        imageUrl: art(25), // Pikachu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'In the Present Simple, for 3rd person singular (He / She / It -> Ash), we add "-s" to the verb: "gets up".',
        options: [
          { id: 'opt-1', text: 'gets' },
          { id: 'opt-2', text: 'get' },
          { id: 'opt-3', text: 'getting' },
          { id: 'opt-4', text: 'got' },
        ],
      },
      {
        id: 'eng-4p-6',
        text: 'Abilities (Can / Can’t): "Charizard ___ fly high in the sky, but it ___ breathe underwater."',
        imageUrl: art(6), // Charizard
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '"Can" expresses ability (puede volar) and "can’t" expresses lack of ability (no puede respirar bajo el agua).',
        options: [
          { id: 'opt-1', text: 'can’t / can' },
          { id: 'opt-2', text: 'is / isn’t' },
          { id: 'opt-3', text: 'can / can’t' },
          { id: 'opt-4', text: 'has / hasn’t' },
        ],
      },
      {
        id: 'eng-4p-7',
        text: 'Superlative Adjectives: "Wailord is the ___ Pokémon in the ocean!"',
        imageUrl: art(321), // Wailord
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'For superlatives (el más grande de todos), we use "the" + adjective ending in "-est": "the biggest" (double G).',
        options: [
          { id: 'opt-1', text: 'bigger' },
          { id: 'opt-2', text: 'biggest' },
          { id: 'opt-3', text: 'big' },
          { id: 'opt-4', text: 'most big' },
        ],
      },
      {
        id: 'eng-4p-8',
        text: 'Telling the Time: Look at the digital clock showing 09:30. What time is it?',
        imageUrl: art(164), // Noctowl
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '09:30 (las nueve y media) is "It’s half past nine" in English.',
        options: [
          { id: 'opt-1', text: 'It’s nine o’clock.' },
          { id: 'opt-2', text: 'It’s quarter past nine.' },
          { id: 'opt-3', text: 'It’s quarter to nine.' },
          { id: 'opt-4', text: 'It’s half past nine.' },
        ],
      },
      {
        id: 'eng-4p-9',
        text: 'Past Simple (Verb To Be): "Yesterday, Pikachu ___ very tired after the tournament."',
        imageUrl: art(172), // Pichu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'In the Past Simple of "To Be", we use "was" for I / He / She / It (Pikachu was) and "were" for You / We / They.',
        options: [
          { id: 'opt-1', text: 'was' },
          { id: 'opt-2', text: 'were' },
          { id: 'opt-3', text: 'is' },
          { id: 'opt-4', text: 'are' },
        ],
      },
      {
        id: 'eng-4p-10',
        text: 'Short Answers (Present Simple): "Does Misty like Water Pokémon?"',
        imageUrl: art(116), // Horsea
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'When a question starts with "Does she...", the affirmative short answer is "Yes, she does."',
        options: [
          { id: 'opt-1', text: 'Yes, she is.' },
          { id: 'opt-2', text: 'Yes, she can.' },
          { id: 'opt-3', text: 'Yes, she does.' },
          { id: 'opt-4', text: 'Yes, she like.' },
        ],
      },
      {
        id: 'eng-4p-11',
        text: 'Have got / Has got: "Machamp ___ four very strong arms."',
        imageUrl: art(68), // Machamp
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'For 3rd person singular (He / She / It -> Machamp), we use "has got" instead of "have got".',
        options: [
          { id: 'opt-1', text: 'have got' },
          { id: 'opt-2', text: 'has got' },
          { id: 'opt-3', text: 'is got' },
          { id: 'opt-4', text: 'can got' },
        ],
      },
      {
        id: 'eng-4p-12',
        text: 'Weather Vocabulary: "Take your umbrella and raincoat! Today it is ___."',
        imageUrl: art(270), // Lotad
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'You need an umbrella and raincoat when it is "rainy" (lluvioso).',
        options: [
          { id: 'opt-1', text: 'rainy' },
          { id: 'opt-2', text: 'sunny' },
          { id: 'opt-3', text: 'hot' },
          { id: 'opt-4', text: 'dry' },
        ],
      },
      {
        id: 'eng-4p-13',
        text: 'School Subjects: "In ___ class, we learn about numbers, fractions and shapes."',
        imageUrl: art(65), // Alakazam
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Numbers, fractions and geometric shapes are studied in "Maths" (Mathematics).',
        options: [
          { id: 'opt-1', text: 'History' },
          { id: 'opt-2', text: 'Music' },
          { id: 'opt-3', text: 'Maths' },
          { id: 'opt-4', text: 'P.E. (Physical Education)' },
        ],
      },
      {
        id: 'eng-4p-14',
        text: 'Places in Town: "You go to the ___ to read and borrow books in silence."',
        imageUrl: art(199), // Slowking
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '"Library" means biblioteca (where you borrow books). Watch out: "bookshop" is librería (where you buy books).',
        options: [
          { id: 'opt-1', text: 'cinema' },
          { id: 'opt-2', text: 'supermarket' },
          { id: 'opt-3', text: 'bakery' },
          { id: 'opt-4', text: 'library' },
        ],
      },
      {
        id: 'eng-4p-15',
        text: 'Jobs & Professions: "Nurse Joy works at the Pokémon Hospital. She helps sick Pokémon. She is a ___."',
        imageUrl: art(113), // Chansey
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Someone who takes care of sick animals or Pokémon at a clinic/hospital is a "nurse" or "vet" (veterinarian).',
        options: [
          { id: 'opt-1', text: 'firefighter' },
          { id: 'opt-2', text: 'nurse / vet' },
          { id: 'opt-3', text: 'chef' },
          { id: 'opt-4', text: 'pilot' },
        ],
      },
      {
        id: 'eng-4p-16',
        text: 'Adverbs of Frequency: "Psyduck ___ has a headache (100% of the time - siempre)."',
        imageUrl: art(54), // Psyduck
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          '"Always" means siempre (100%). "Sometimes" = a veces (50%), "Never" = nunca (0%).',
        options: [
          { id: 'opt-1', text: 'always' },
          { id: 'opt-2', text: 'sometimes' },
          { id: 'opt-3', text: 'never' },
          { id: 'opt-4', text: 'hardly ever' },
        ],
      },
      {
        id: 'eng-4p-17',
        text: 'Some / Any (Food & Drinks): "Is there ___ milk in the fridge for Meowth?"',
        imageUrl: art(52), // Meowth
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'We use "some" in affirmative sentences and "any" in negative sentences and QUESTIONS ("Is there any milk?").',
        options: [
          { id: 'opt-1', text: 'some' },
          { id: 'opt-2', text: 'any' },
          { id: 'opt-3', text: 'a' },
          { id: 'opt-4', text: 'many' },
        ],
      },
      {
        id: 'eng-4p-18',
        text: 'Question Words: "___ do you live? — I live in Pallet Town."',
        imageUrl: art(1), // Bulbasaur
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '"Where" asks about a place (¿Dónde vives?). "When" = cuándo, "Who" = quién, "Why" = por qué.',
        options: [
          { id: 'opt-1', text: 'Who' },
          { id: 'opt-2', text: 'When' },
          { id: 'opt-3', text: 'Where' },
          { id: 'opt-4', text: 'What' },
        ],
      },
      {
        id: 'eng-4p-19',
        text: 'Clothes & Seasons: "In winter, when it’s snowy and cold, I wear a warm ___ around my neck."',
        imageUrl: art(471), // Glaceon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'A "scarf" (bufanda) is worn around your neck when it is cold in winter.',
        options: [
          { id: 'opt-1', text: 'swimsuit' },
          { id: 'opt-2', text: 'sandals' },
          { id: 'opt-3', text: 'shorts' },
          { id: 'opt-4', text: 'scarf' },
        ],
      },
      {
        id: 'eng-4p-20',
        text: 'Future Plans (Going to): "Tomorrow we ___ visit the Pokémon Science Museum!"',
        imageUrl: art(151), // Mew
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'For future plans with "We", we use "are going to" + verb: "we are going to visit".',
        options: [
          { id: 'opt-1', text: 'are going to' },
          { id: 'opt-2', text: 'is going to' },
          { id: 'opt-3', text: 'am going to' },
          { id: 'opt-4', text: 'going' },
        ],
      },
    ],
  },

  // ============================================================================
  // 4. GRAN TORNEO MULTIDISCIPLINAR - 4º DE PRIMARIA (20 PREGUNTAS)
  // ============================================================================
  {
    id: 'quiz-reto-global-4primaria',
    title: 'Gran Torneo 4º Primaria: Reto Multidisciplinar 🏆🌟',
    description:
      '¡La Liga de Campeones de 4º de Primaria! 20 preguntas combinadas de Lengua, Matemáticas e Inglés para poner a prueba a toda la clase.',
    coverImage: art(151), // Mew
    createdAt: Date.now() - 86400000,
    questions: [
      {
        id: 'mix-4p-1',
        text: '[LENGUA] ¿Cuántas sílabas tiene la palabra "ME-DA-LLA" y qué tipo de palabra es según su acento?',
        imageUrl: art(25), // Pikachu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '"Me-da-lla" tiene 3 sílabas (trisílaba) y la fuerza de voz recae en la penúltima sílaba ("da"), por lo que es LLANA.',
        options: [
          { id: 'opt-1', text: '4 sílabas y es aguda' },
          { id: 'opt-2', text: '3 sílabas y es llana' },
          { id: 'opt-3', text: '3 sílabas y es esdrújula' },
          { id: 'opt-4', text: '2 sílabas y es llana' },
        ],
      },
      {
        id: 'mix-4p-2',
        text: '[MATES] Si compras 3 Pociones que cuestan 15 monedas cada una y una Superball de 20 monedas, ¿cuánto pagas en total?',
        imageUrl: art(133), // Eevee
        timeLimit: 25,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '3 pociones × 15 monedas = 45 monedas. Luego sumamos la Superball: 45 + 20 = 65 monedas en total.',
        options: [
          { id: 'opt-1', text: '55 monedas' },
          { id: 'opt-2', text: '60 monedas' },
          { id: 'opt-3', text: '65 monedas' },
          { id: 'opt-4', text: '75 monedas' },
        ],
      },
      {
        id: 'mix-4p-3',
        text: '[ENGLISH] Superlative Adjectives: "Rayquaza is the ___ Pokémon in the sky!"',
        imageUrl: art(384), // Rayquaza
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'For superlatives (el más largo de todos), we use "the" + short adjective + "-est": "the longest".',
        options: [
          { id: 'opt-1', text: 'longest' },
          { id: 'opt-2', text: 'longer' },
          { id: 'opt-3', text: 'long' },
          { id: 'opt-4', text: 'more long' },
        ],
      },
      {
        id: 'mix-4p-4',
        text: '[LENGUA] ¿Cuál de estas palabras pertenece a la misma FAMILIA DE PALABRAS que "MAR"?',
        imageUrl: art(131), // Lapras
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '"Marinero" comparte la raíz de la palabra primitiva "mar" y está relacionada con su significado (mar, marino, marea, marinero).',
        options: [
          { id: 'opt-1', text: 'Martillo' },
          { id: 'opt-2', text: 'Martes' },
          { id: 'opt-3', text: 'Mariposa' },
          { id: 'opt-4', text: 'Marinero' },
        ],
      },
      {
        id: 'mix-4p-5',
        text: '[MATES] ¿Cómo se llama el polígono que tiene exactamente 5 lados y 5 vértices?',
        imageUrl: art(120), // Staryu
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Un polígono de 5 lados se llama PENTÁGONO (Hexágono = 6 lados, Octógono = 8 lados).',
        options: [
          { id: 'opt-1', text: 'Hexágono' },
          { id: 'opt-2', text: 'Pentágono' },
          { id: 'opt-3', text: 'Cuadrilátero' },
          { id: 'opt-4', text: 'Octógono' },
        ],
      },
      {
        id: 'mix-4p-6',
        text: '[ENGLISH] Past Simple (To Be): "Yesterday, Ash and Pikachu ___ at the Pokémon Center."',
        imageUrl: art(151), // Mew
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Since "Ash and Pikachu" is plural (They), we use "were" for the Past Simple of the verb To Be.',
        options: [
          { id: 'opt-1', text: 'was' },
          { id: 'opt-2', text: 'are' },
          { id: 'opt-3', text: 'were' },
          { id: 'opt-4', text: 'is' },
        ],
      },
      {
        id: 'mix-4p-7',
        text: '[LENGUA] Regla ortográfica: Antes de P y B siempre se escribe...',
        imageUrl: art(39), // Jigglypuff
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Antes de P y B SIEMPRE se escribe M y nunca N (ejemplos: campeón, siempre, tambor, combate).',
        options: [
          { id: 'opt-1', text: 'Siempre M (como en "campeón" y "combate")' },
          { id: 'opt-2', text: 'Siempre N (como en "canpeón")' },
          { id: 'opt-3', text: 'Siempre R' },
          { id: 'opt-4', text: 'Da igual poner M o N' },
        ],
      },
      {
        id: 'mix-4p-8',
        text: '[MATES] Si tienes una tableta de chocolate dividida en 4 partes iguales y te comes las 4 partes (4/4), ¿qué cantidad te has comido?',
        imageUrl: art(143), // Snorlax
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Cuando el numerador y el denominador son iguales (4/4), la fracción es igual a la UNIDAD entera (1 tableta entera).',
        options: [
          { id: 'opt-1', text: 'Media tableta' },
          { id: 'opt-2', text: 'Cuatro tabletas' },
          { id: 'opt-3', text: '1 tableta entera (la unidad)' },
          { id: 'opt-4', text: 'Un cuarto de tableta' },
        ],
      },
      {
        id: 'mix-4p-9',
        text: '[ENGLISH] Present Simple Negative: "Bulbasaur is a Grass Pokémon. It ___ like fire attacks!"',
        imageUrl: art(1), // Bulbasaur
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'In the Present Simple negative for 3rd person singular (He / She / It), we use "doesn’t" + base verb ("doesn’t like").',
        options: [
          { id: 'opt-1', text: 'don’t' },
          { id: 'opt-2', text: 'doesn’t' },
          { id: 'opt-3', text: 'isn’t' },
          { id: 'opt-4', text: 'not' },
        ],
      },
      {
        id: 'mix-4p-10',
        text: '[LENGUA] En la frase "Ash ganó TRES medallas", la palabra "TRES" es un determinante...',
        imageUrl: art(6), // Charizard
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '"Tres" expresa una cantidad exacta (uno, dos, tres, cuatro...), por lo que es un determinante NUMERAL CARDINAL.',
        options: [
          { id: 'opt-1', text: 'Posesivo' },
          { id: 'opt-2', text: 'Demostrativo' },
          { id: 'opt-3', text: 'Numeral ordinal (orden)' },
          { id: 'opt-4', text: 'Numeral cardinal (cantidad exacta)' },
        ],
      },
      {
        id: 'mix-4p-11',
        text: '[MATES] Cálculo mental rápido: ¿Cuánto es 48 × 100?',
        imageUrl: art(135), // Jolteon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Para multiplicar un número natural por 100, añadimos dos ceros a la derecha del número: 48 × 100 = 4.800.',
        options: [
          { id: 'opt-1', text: '480' },
          { id: 'opt-2', text: '4.800' },
          { id: 'opt-3', text: '48.000' },
          { id: 'opt-4', text: '408' },
        ],
      },
      {
        id: 'mix-4p-12',
        text: '[ENGLISH] Months of the Year & Ordinals: "January is the first (1st) month. Which is the FIFTH (5th) month of the year?"',
        imageUrl: art(196), // Espeon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          '1st January, 2nd February, 3rd March, 4th April, 5th MAY!',
        options: [
          { id: 'opt-1', text: 'March' },
          { id: 'opt-2', text: 'April' },
          { id: 'opt-3', text: 'May' },
          { id: 'opt-4', text: 'June' },
        ],
      },
      {
        id: 'mix-4p-13',
        text: '[LENGUA] ¿Qué signo de puntuación debemos usar para separar los elementos de una enumeración (por ejemplo: "Tengo a Pikachu___ Bulbasaur___ Squirtle y Charmander")?',
        imageUrl: art(4), // Charmander
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'La COMA (,) se utiliza para separar las palabras de una enumeración, salvo delante de la última si lleva "y".',
        options: [
          { id: 'opt-1', text: 'La coma (,)' },
          { id: 'opt-2', text: 'El punto y final (.)' },
          { id: 'opt-3', text: 'Los signos de interrogación (¿?)' },
          { id: 'opt-4', text: 'El guion (-)' },
        ],
      },
      {
        id: 'mix-4p-14',
        text: '[MATES] Si Charmander tiene 15 puntos de energía y al evolucionar consigue el TRIPLE de puntos, ¿cuántos puntos tendrá?',
        imageUrl: art(5), // Charmeleon
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          'Para calcular el TRIPLE de un número lo multiplicamos por 3: 15 × 3 = 45 puntos.',
        options: [
          { id: 'opt-1', text: '30 puntos' },
          { id: 'opt-2', text: '18 puntos' },
          { id: 'opt-3', text: '35 puntos' },
          { id: 'opt-4', text: '45 puntos' },
        ],
      },
      {
        id: 'mix-4p-15',
        text: '[ENGLISH] Giving Directions: What does "Turn left at the Pokémon Gym" mean in Spanish?',
        imageUrl: art(59), // Arcanine
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          '"Turn left" means gira a la izquierda. ("Turn right" = gira a la derecha, "Go straight on" = sigue todo recto).',
        options: [
          { id: 'opt-1', text: 'Sigue todo recto por el gimnasio' },
          { id: 'opt-2', text: 'Gira a la izquierda en el gimnasio' },
          { id: 'opt-3', text: 'Gira a la derecha en el gimnasio' },
          { id: 'opt-4', text: 'Cruza el puente del gimnasio' },
        ],
      },
      {
        id: 'mix-4p-16',
        text: '[LENGUA] ¿Cuáles de estas formas verbales están en INFINITIVO (la forma que usamos para nombrar al verbo)?',
        imageUrl: art(18), // Pidgeot
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-3',
        explanation:
          'Los verbos en infinitivo son los que terminan en -AR, -ER, -IR sin conjugar (volar, correr, combatir).',
        options: [
          { id: 'opt-1', text: 'Voló, corría, combatiremos' },
          { id: 'opt-2', text: 'Volando, corriendo, combatiendo' },
          { id: 'opt-3', text: 'Volar, correr, combatir' },
          { id: 'opt-4', text: 'Vuelo, corro, combato' },
        ],
      },
      {
        id: 'mix-4p-17',
        text: '[MATES] Comparación de números decimales: ¿Cuál de estos números es MAYOR?',
        imageUrl: art(9), // Blastoise
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-1',
        explanation:
          'Al comparar 4,8 y 4,75 nos fijamos primero en las décimas: 8 décimas (4,80) es mayor que 7 décimas (4,75).',
        options: [
          { id: 'opt-1', text: '4,8' },
          { id: 'opt-2', text: '4,75' },
          { id: 'opt-3', text: '4,09' },
          { id: 'opt-4', text: '4,7' },
        ],
      },
      {
        id: 'mix-4p-18',
        text: '[ENGLISH] Body Parts & Descriptions: "Gengar is a Ghost Pokémon. It has got two red ___ and a big mouth."',
        imageUrl: art(94), // Gengar
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-4',
        explanation:
          '"Eyes" means ojos (two red eyes = dos ojos rojos).',
        options: [
          { id: 'opt-1', text: 'noses' },
          { id: 'opt-2', text: 'heads' },
          { id: 'opt-3', text: 'tails' },
          { id: 'opt-4', text: 'eyes' },
        ],
      },
      {
        id: 'mix-4p-19',
        text: '[LENGUA] Las palabras "fútbol, baloncesto, natación y tenis" pertenecen todas al mismo...',
        imageUrl: art(106), // Hitmonlee
        timeLimit: 20,
        points: 1000,
        correctOptionId: 'opt-2',
        explanation:
          'Un CAMPO SEMÁNTICO es un grupo de palabras de la misma categoría (sustantivos) que comparten un tema común (los deportes), aunque no tengan la misma raíz.',
        options: [
          { id: 'opt-1', text: 'Familia de palabras' },
          { id: 'opt-2', text: 'Campo semántico (de los deportes)' },
          { id: 'opt-3', text: 'Grupo de verbos' },
          { id: 'opt-4', text: 'Palabras compuestas' },
        ],
      },
      {
        id: 'mix-4p-20',
        text: '[MATES - GRAN FINAL] Si cada gimnasio que ganas te da 150 puntos y ya has ganado 6 gimnasios, ¿cuántos puntos te faltan para llegar a 1.000 puntos?',
        imageUrl: art(150), // Mewtwo
        timeLimit: 30,
        points: 1500,
        correctOptionId: 'opt-3',
        explanation:
          'Primero multiplicamos 150 puntos × 6 gimnasios = 900 puntos conseguidos. Para llegar a 1.000 puntos faltan: 1.000 - 900 = 100 puntos.',
        options: [
          { id: 'opt-1', text: '200 puntos' },
          { id: 'opt-2', text: '150 puntos' },
          { id: 'opt-3', text: '100 puntos' },
          { id: 'opt-4', text: '50 puntos' },
        ],
      },
    ],
  },
];

export const INITIAL_QUIZZES: Quiz[] = RAW_QUIZZES.map((q) => ({
  id: q.id,
  title: q.title,
  description: q.description,
  category:
    q.id.includes('lengua')
      ? 'Lengua 4º Primaria'
      : q.id.includes('mates')
        ? 'Matemáticas 4º Primaria'
        : q.id.includes('ingles')
          ? 'Inglés 4º Primaria'
          : 'Torneo 4º Primaria',
  coverImage: q.coverImage,
  createdAt: q.createdAt,
  updatedAt: q.createdAt,
  questions: q.questions.map((quest) => ({
    id: quest.id,
    text: quest.text,
    image: quest.imageUrl,
    timeLimit: quest.timeLimit,
    points: quest.points,
    explanation: quest.explanation,
    options: quest.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      isCorrect: opt.id === quest.correctOptionId,
    })),
  })),
}));
