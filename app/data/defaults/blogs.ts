import type { FallbackBlogDetail } from "./types";

export const fallbackBlogs: FallbackBlogDetail[] = [
  {
    slug: "why-did-they-pay-me",
    date: "2026-04-24",
    title: {
      en: "Did they pay me for them to learn, or just to pass?",
      es: "¿Me pagaron para aprender o para aprobar?",
      ca: "Em van pagar per aprendre o per aprovar?",
    },
    shortDescription: {
      en: "A look at my first Android classes and how the need to explain code helped me consolidate my own knowledge.",
      es: "Una mirada a mis primeras clases de Android y cómo la necesidad de explicar el código me ayudó a consolidar mis propios conocimientos.",
      ca: "Una mirada a les meves primeres classes d'Android i com la necessitat d'explicar el codi em va ajudar a consolidar els meus propis coneixements.",
    },
    description: {
      en: "A look at my first Android classes and how the need to explain code helped me consolidate my own knowledge.",
      es: "Una mirada a mis primeras clases de Android y cómo la necesidad de explicar el código me ayudó a consolidar mis propios conocimientos.",
      ca: "Una mirada a les meves primeres classes d'Android i com la necessitat d'explicar el codi em va ajudar a consolidar els meus propis coneixements.",
    },
    content: {
      en: `I've always wanted to teach. There's something very comforting about understanding a subject well enough to motivate someone to learn alongside me. Perhaps, due to the insecurity I've carried since childhood, this serves as a push to finally cement my own confidence in the subject.

While I was studying, two students asked me for private Android classes. I didn't feel great about charging them, but my diet of pre-made cannelloni and ham sandwiches had to be sustained somehow. The key problem I saw with the system was that some professors earned a salary for teaching the subject and delivered class hours that were simply neither sufficient nor productive — not for them, nor for most of the classroom.

> It felt almost paradoxical that my students would rush me to finish the project when they'd already paid me a flat rate.

I don't remember exactly, but it was maybe 20 euros for what was supposed to be an hour and a half; yet I'd spend four hours with them, making sure they understood every step we took through Android Studio, fixing xml files and adjusting [Adapters](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter) and [RecyclerViews](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView).

I don't blame them — I think they really just wanted to pass the course. For them, programming was nothing more than wrestling with an assignment from Institut Montilivi. But for me, those projects were the best: I could get lost in fine-tuning anything, understanding how everything worked under the hood, and learning a ton.

Now that I'm speaking from a present where [LLMs](https://en.wikipedia.org/wiki/Large_language_model) are blowing up, I feel like those *developers* who used to code with a plain text editor and a separate compiler, without an **IDE** to speed up their work with autocomplete, *warnings*, and other great but RAM-hungry features (this one's for you, **Android Studio** 🔥).

They were good years that, with time, are clearly *deprecated* — but they always bring a smile to my face.

---

In the end, this blog is a bit like those four-hour classes: a place where I'm not looking for shortcuts or quick answers, but rather to understand the why behind each piece. Technology moves at a pace where it's easy to feel overwhelmed, but sharing the process remains my best tool for reinforcing knowledge. I hope what you read here serves you at least half as much as writing it serves me.

Here's a database schema I can no longer place in time:
![A database schema](https://api.xavierarbat.com/uploads/blogs/esquema_bdd.jpg)
`,
      es: `Siempre he querido dedicarme a enseñar. Encuentro algo muy reconfortante en la idea de entender un tema lo suficientemente bien como para motivar a alguien a aprender conmigo. Quizá, por la falta de seguridad que acarreo desde pequeño, esto me sirve como impulso para acabar de asentar mi propia confianza sobre la materia.

Cuando estaba estudiando, hubo dos alumnos que me pidieron clases privadas de Android. No me sentía muy bien cobrándoles, pero mi dieta a base de canelones preparados y bocadillos de jamón debía sustentarse de alguna forma. El problema clave que le veía a ese sistema era que algunos profesores cobraban un sueldo por enseñar la asignatura e impartieron unas horas de clase que sencillamente no eran suficientes ni productivas, ni para ellos ni para gran parte del aula.

> Me parecía casi paradójico que mis alumnos me metieran prisa por acabar el proyecto cuando ya me habían pagado una tarifa fija.

No lo recuerdo exactamente, pero quizá eran 20 euros por lo que en teoría iba a ser una hora y media de clase; sin embargo, me pasaba cuatro horas con ellos, asegurándome de que entendían todos los pasos que dábamos por ese Android Studio, arreglando archivos xml, y ajustando [Adapters](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter) y [RecyclerViews](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView).

No los culpo, creo que en realidad solo querían sacarse la asignatura. Para ellos, programar no era más que pelearse con un trabajo del Institut Montilivi. Pero para mí, esos proyectos fueron los mejores: podía perderme en afinar cualquier cosa, entender cómo funcionaba todo por debajo y aprender un montón.

Ahora que hablo desde una actualidad donde los [LLM](https://es.wikipedia.org/wiki/Modelo_extenso_de_lenguaje) lo están petando, me siento como aquellos *developers* que desarrollaban con un editor de texto plano y un compilador aparte, sin un **IDE** que les agilizara el trabajo con autocompletado, *warnings* y otros grandes, pero útiles, consumidores de RAM (va por ti, **Android Studio** 🔥).

Fueron buenos años que, con el tiempo, quedan claramente *deprecados*, pero que siempre me sacan una sonrisa.

---

Al final, este blog es un poco como aquellas clases de cuatro horas: un lugar donde no busco atajos ni respuestas rápidas, sino entender el porqué de cada pieza. La tecnología avanza a un ritmo en el que es fácil sentirse abrumado, pero compartir el proceso sigue siendo mi mejor herramienta para afianzar el conocimiento. Espero que lo que leas aquí te sirva, al menos, la mitad de lo que a mí me sirve escribirlo.

Adjunto un esquema de una base de datos que ya no logro contextualizar en el tiempo:
![Esquema de una base de datos](https://api.xavierarbat.com/uploads/blogs/esquema_bdd.jpg)`,
      ca: `Sempre he volgut dedicar-me a ensenyar. Trobo quelcom molt reconfortant en la idea d'entendre un tema prou bé com per motivar algú a aprendre amb mi. Potser, per la falta de seguretat que arrossego des de petit, això em serveix com a impuls per acabar d'assentar la meva pròpia confiança sobre la matèria.

Quan estudiava, dos alumnes em van demanar classes privades d'Android. No em sentia gaire bé cobrant-los, però la meva dieta a base de canelons preparats i entrepans de pernil s'havia de sustentar d'alguna manera. El problema clau que li veia a aquell sistema era que alguns professors cobraven un sou per ensenyar l'assignatura i van impartir unes hores de classe que senzillament no eren suficients ni productives, ni per a ells ni per a gran part de l'aula.

> Em semblava gairebé paradoxal que els meus alumnes em fessin pressa per acabar el projecte quan ja m'havien pagat una tarifa fixa.

No ho recordo exactament, però potser eren 20 euros pel que en teoria havia de ser una hora i mitja de classe; tanmateix, em passava quatre hores amb ells, assegurant-me que entenien tots els passos que fèiem per aquell Android Studio, arreglant arxius xml i ajustant [Adapters](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter) i [RecyclerViews](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView).

No els culpo, crec que en realitat només volien treure's l'assignatura. Per a ells, programar no era més que barallar-se amb un treball de l'Institut Montilivi. Però per a mi, aquells projectes van ser els millors: podia perdre'm en afinar qualsevol cosa, entendre com funcionava tot per sota i aprendre molt.

Ara que parlo des d'una actualitat on els [LLM](https://ca.wikipedia.org/wiki/Model_de_llenguatge_extens) ho estan petant, em sento com aquells *developers* que desenvolupaven amb un editor de text pla i un compilador a part, sense un **IDE** que els agilitzés la feina amb autocompletat, *warnings* i altres grans, però útils, consumidors de RAM (va per tu, **Android Studio** 🔥).

Van ser bons anys que, amb el temps, queden clarament *deprecats*, però que sempre em treuen un somriure.

---

Al final, aquest blog és una mica com aquelles classes de quatre hores: un lloc on no busco dreceres ni respostes ràpides, sinó entendre el perquè de cada peça. La tecnologia avança a un ritme en què és fàcil sentir-se aclaparat, però compartir el procés segueix sent la meva millor eina per afermar el coneixement. Espero que el que llegeixis aquí et serveixi, almenys, la meitat del que a mi em serveix escriure-ho.

Adjunto un esquema d'una base de dades que ja no aconsegueixo contextualitzar en el temps:
![Esquema d'una base de dades](https://api.xavierarbat.com/uploads/blogs/esquema_bdd.jpg)
`,
    },
  },
];
