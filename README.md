# AulaQuiz 🎓🚀 (Alternativa Propia a Quizizz)

Plataforma educativa de cuestionarios interactivos en tiempo real con dinámica **"Ritmo del Alumno"** y **subida ilimitada de imágenes**, sin planes de pago ni restricciones.

---

## ✨ Características Principales

1. **Subida Ilimitada de Imágenes:**
   - Arrastra y suelta imágenes directamente en las preguntas (o pega URLs).
   - Compresión automática en cliente: máxima nitidez y rendimiento óptimo sin necesitar servicios de pago externos.

2. **Dinámica a Ritmo del Alumno (como Quizizz):**
   - Los alumnos no están forzados a esperar que el profesor pase la diapositiva.
   - Cada estudiante lee, reflexiona y responde a su propio ritmo.
   - Feedback instantáneo con sonido, animaciones y multiplicador de rachas (🔥 x2, x3...).

3. **Panel Docente y Pantalla de Clase:**
   - Creación, edición, duplicación y exportación/importación en formato JSON.
   - Lanzamiento de sala con **código PIN de 6 dígitos** y **código QR automático** para proyectar en el aula.
   - Clasificación en directo con barra de progreso individual por alumno y podio final interactivo con confeti.

4. **100% Listo para Desplegar en Vercel:**
   - Construido con **Next.js (App Router)** y **Tailwind CSS**.
   - No depende de servidores WebSocket con estado persistente bloqueante; utiliza sincronización ultra-ligera ideal para entornos Serverless como Vercel, Netlify o Railway.

---

## 🚀 Cómo ejecutarlo en local

```bash
cd /Users/jose/.gemini/antigravity/scratch/quiz-app
npm run build
npm start
```

Abre tu navegador en:
- **Pantalla principal y entrada de alumnos:** [http://localhost:3000](http://localhost:3000)
- **Panel del Docente:** [http://localhost:3000/teacher](http://localhost:3000/teacher)

*(Si tienes alumnos con móviles conectados a la misma red WiFi, pueden entrar a la IP que muestra la consola, por ejemplo `http://192.168.68.105:3000`)*.

---

## ☁️ Cómo desplegarlo en Vercel (Gratis)

1. Sube esta carpeta a un repositorio de GitHub (o GitLab / Bitbucket).
2. Entra en [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New Project"** e importa el repositorio `quiz-app`.
4. Deja la configuración por defecto (Next.js) y pulsa **Deploy**.
5. ¡Listo! Vercel te dará una URL pública tipo `https://tu-aulaquiz.vercel.app` para compartir con profesores y alumnos.
