import { NextResponse } from 'next/server';
import { Question } from '@/lib/types';

// Curated educational topics and knowledge base for instant offline & smart generation
const TEMPLATES: Record<string, Partial<Question>[]> = {
  pokemon: [
    {
      text: '¿Qué objeto se necesita para evolucionar a Pikachu en Raichu?',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
      timeLimit: 20,
      points: 1000,
      explanation: 'Pikachu necesita entrar en contacto con una Piedra Trueno para evolucionar en Raichu.',
      options: [
        { id: 'o1', text: 'Piedra Trueno ⚡', isCorrect: true },
        { id: 'o2', text: 'Piedra Fuego 🔥', isCorrect: false },
        { id: 'o3', text: 'Subir al nivel 36 📈', isCorrect: false },
        { id: 'o4', text: 'Amistad máxima ❤️', isCorrect: false }
      ]
    },
    {
      text: '¿Cuál de los siguientes es un Pokémon inicial de Tipo Planta de la región de Kanto?',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      timeLimit: 15,
      points: 1000,
      explanation: 'Bulbasaur es el número 0001 de la Pokédex Nacional y el inicial de tipo Planta/Veneno.',
      options: [
        { id: 'o1', text: 'Chikorita', isCorrect: false },
        { id: 'o2', text: 'Bulbasaur 🍃', isCorrect: true },
        { id: 'o3', text: 'Treecko', isCorrect: false },
        { id: 'o4', text: 'Turtwig', isCorrect: false }
      ]
    },
    {
      text: '¿Qué tipo de efectividad tiene un ataque de Tipo Fuego contra un Pokémon de Tipo Bicho o Planta?',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      timeLimit: 20,
      points: 1000,
      explanation: 'El fuego quema la vegetación y es súper efectivo contra Planta, Bicho, Hielo y Acero.',
      options: [
        { id: 'o1', text: 'Súper Efectivo (x2 daño) 💥', isCorrect: true },
        { id: 'o2', text: 'Poco Efectivo (x0.5 daño)', isCorrect: false },
        { id: 'o3', text: 'No tiene efecto (Inmune)', isCorrect: false },
        { id: 'o4', text: 'Daño normal (x1)', isCorrect: false }
      ]
    }
  ],
  ciencias: [
    {
      text: '¿Cómo se llama el proceso por el cual las plantas producen su propio alimento utilizando la luz solar?',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      timeLimit: 20,
      points: 1000,
      explanation: 'La fotosíntesis convierte agua, dióxido de carbono y luz en glucosa y oxígeno.',
      options: [
        { id: 'o1', text: 'Fotosíntesis 🌿', isCorrect: true },
        { id: 'o2', text: 'Respiración celular', isCorrect: false },
        { id: 'o3', text: 'Evaporación', isCorrect: false },
        { id: 'o4', text: 'Germinación', isCorrect: false }
      ]
    },
    {
      text: '¿Qué estado de la materia se caracteriza por no tener forma fija pero sí un volumen constante?',
      image: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=800&auto=format&fit=crop&q=80',
      timeLimit: 20,
      points: 1000,
      explanation: 'Los líquidos adoptan la forma del recipiente que los contiene manteniendo su volumen.',
      options: [
        { id: 'o1', text: 'Líquido 💧', isCorrect: true },
        { id: 'o2', text: 'Sólido 🧊', isCorrect: false },
        { id: 'o3', text: 'Gaseoso 💨', isCorrect: false },
        { id: 'o4', text: 'Plasma ⚡', isCorrect: false }
      ]
    }
  ],
  historia: [
    {
      text: '¿En qué año llegó Cristóbal Colón por primera vez a América?',
      image: 'https://images.unsplash.com/photo-1599732434449-317180f9dbca?w=800&auto=format&fit=crop&q=80',
      timeLimit: 20,
      points: 1000,
      explanation: 'El 12 de octubre de 1492 la expedición llegó a la isla de Guanahani.',
      options: [
        { id: 'o1', text: '1492 ⛵', isCorrect: true },
        { id: 'o2', text: '1789', isCorrect: false },
        { id: 'o3', text: '1914', isCorrect: false },
        { id: 'o4', text: '1212', isCorrect: false }
      ]
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const cleanTopic = (topic || '').toLowerCase();

    let questionsToReturn: Partial<Question>[] = [];

    if (cleanTopic.includes('poke') || cleanTopic.includes('gimnasio')) {
      questionsToReturn = TEMPLATES.pokemon;
    } else if (cleanTopic.includes('cien') || cleanTopic.includes('natu') || cleanTopic.includes('bio')) {
      questionsToReturn = TEMPLATES.ciencias;
    } else if (cleanTopic.includes('hist') || cleanTopic.includes('social')) {
      questionsToReturn = TEMPLATES.historia;
    } else {
      // Dynamic questions based on topic keywords
      questionsToReturn = [
        {
          text: `¿Cuál de las siguientes afirmaciones describe mejor el concepto de ${topic}?`,
          timeLimit: 20,
          points: 1000,
          explanation: `Esta es la definición clave a recordar sobre ${topic}.`,
          options: [
            { id: 'o1', text: `Definición principal y correcta de ${topic} ✨`, isCorrect: true },
            { id: 'o2', text: `Concepto secundario o distractor A`, isCorrect: false },
            { id: 'o3', text: `Concepto erróneo habitual`, isCorrect: false },
            { id: 'o4', text: `Ninguna de las anteriores`, isCorrect: false }
          ]
        },
        {
          text: `En relación con ${topic}, ¿qué elemento resulta fundamental para su comprensión?`,
          timeLimit: 20,
          points: 1000,
          explanation: `El elemento fundamental es la base del tema.`,
          options: [
            { id: 'o1', text: `El elemento fundamental correcto 🎯`, isCorrect: true },
            { id: 'o2', text: `Un factor irrelevante`, isCorrect: false },
            { id: 'o3', text: `Una excepción a la regla`, isCorrect: false },
            { id: 'o4', text: `Un dato opuesto al objetivo`, isCorrect: false }
          ]
        }
      ];
    }

    const generated = questionsToReturn.map((q, idx) => ({
      ...q,
      id: 'gen_' + Date.now() + '_' + idx,
      options: q.options?.map(o => ({
        ...o,
        id: 'opt_' + Math.random().toString(36).substring(2, 7)
      }))
    }));

    return NextResponse.json({ success: true, data: generated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al generar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
