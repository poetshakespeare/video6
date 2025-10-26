import React, { createContext, useContext, useReducer, useEffect } from 'react';
import JSZip from 'jszip';

// CONFIGURACIÓN EMBEBIDA - Generada automáticamente
const EMBEDDED_CONFIG = {
  "version": "2.1.0",
  "prices": {
    "moviePrice": 80,
    "seriesPrice": 300,
    "transferFeePercentage": 10,
    "novelPricePerChapter": 5
  },
  "deliveryZones": [
    {
      "name": "Santiago de Cuba > Vista Hermosa",
      "cost": 400,
      "id": 1759549448776,
      "createdAt": "2025-10-04T03:44:08.776Z",
      "updatedAt": "2025-10-04T03:44:08.776Z"
    },
    {
      "name": "Santiago de Cuba > Antonio Maceo",
      "cost": 400,
      "id": 1759549461376,
      "createdAt": "2025-10-04T03:44:21.376Z",
      "updatedAt": "2025-10-04T03:44:21.376Z"
    },
    {
      "name": "Santiago de Cuba > Centro de la ciudad",
      "cost": 250,
      "id": 1759549473488,
      "createdAt": "2025-10-04T03:44:33.488Z",
      "updatedAt": "2025-10-04T03:44:33.488Z"
    },
    {
      "name": "Santiago de Cuba > Versalles Hasta el Hotel",
      "cost": 500,
      "id": 1759549486736,
      "createdAt": "2025-10-04T03:44:46.736Z",
      "updatedAt": "2025-10-04T03:44:46.736Z"
    },
    {
      "name": "Santiago de Cuba > Carretera del Morro",
      "cost": 300,
      "id": 1759549499552,
      "createdAt": "2025-10-04T03:44:59.552Z",
      "updatedAt": "2025-10-04T03:44:59.552Z"
    },
    {
      "name": "Santiago de Cuba > Altamira",
      "cost": 400,
      "id": 1759549511664,
      "createdAt": "2025-10-04T03:45:11.664Z",
      "updatedAt": "2025-10-04T03:45:11.664Z"
    },
    {
      "name": "Santiago de Cuba > Cangrejitos",
      "cost": 350,
      "id": 1759549521424,
      "createdAt": "2025-10-04T03:45:21.424Z",
      "updatedAt": "2025-10-04T03:45:21.424Z"
    },
    {
      "name": "Santiago de Cuba > Trocha",
      "cost": 250,
      "id": 1759549534560,
      "createdAt": "2025-10-04T03:45:34.560Z",
      "updatedAt": "2025-10-04T03:45:34.560Z"
    },
    {
      "name": "Santiago de Cuba > Veguita de Galo",
      "cost": 300,
      "id": 1759549546912,
      "createdAt": "2025-10-04T03:45:46.912Z",
      "updatedAt": "2025-10-04T03:45:46.912Z"
    },
    {
      "name": "Santiago de Cuba > Plaza de Martes",
      "cost": 250,
      "id": 1759549558000,
      "createdAt": "2025-10-04T03:45:58.000Z",
      "updatedAt": "2025-10-04T03:45:58.000Z"
    },
    {
      "name": "Santiago de Cuba > Portuondo",
      "cost": 300,
      "id": 1759549569112,
      "createdAt": "2025-10-04T03:46:09.112Z",
      "updatedAt": "2025-10-04T03:46:09.112Z"
    },
    {
      "name": "Santiago de Cuba > Sta Barbara",
      "cost": 300,
      "id": 1759549580560,
      "createdAt": "2025-10-04T03:46:20.560Z",
      "updatedAt": "2025-10-04T03:46:20.560Z"
    },
    {
      "name": "Santiago de Cuba > Sueño",
      "cost": 250,
      "id": 1759549592112,
      "createdAt": "2025-10-04T03:46:32.112Z",
      "updatedAt": "2025-10-04T03:46:32.112Z"
    },
    {
      "name": "Santiago de Cuba > San Pedrito",
      "cost": 150,
      "id": 1759549603696,
      "createdAt": "2025-10-04T03:46:43.696Z",
      "updatedAt": "2025-10-04T03:46:43.696Z"
    },
    {
      "name": "Santiago de Cuba > Agüero",
      "cost": 100,
      "id": 1759549615848,
      "createdAt": "2025-10-04T03:46:55.848Z",
      "updatedAt": "2025-10-04T03:46:55.848Z"
    },
    {
      "name": "Santiago de Cuba > Distrito Jose Martí",
      "cost": 150,
      "id": 1759549627504,
      "createdAt": "2025-10-04T03:47:07.504Z",
      "updatedAt": "2025-10-04T03:47:07.504Z"
    },
    {
      "name": "Santiago de Cuba > Los Pinos",
      "cost": 200,
      "id": 1759549638272,
      "createdAt": "2025-10-04T03:47:18.272Z",
      "updatedAt": "2025-10-04T03:47:18.272Z"
    },
    {
      "name": "Santiago de Cuba > Quintero",
      "cost": 500,
      "id": 1759549649480,
      "createdAt": "2025-10-04T03:47:29.480Z",
      "updatedAt": "2025-10-04T03:47:29.480Z"
    },
    {
      "name": "Santiago de Cuba > 30 de noviembre bajo",
      "cost": 400,
      "id": 1759549660904,
      "createdAt": "2025-10-04T03:47:40.904Z",
      "updatedAt": "2025-10-04T03:47:40.904Z"
    },
    {
      "name": "Santiago de Cuba > Rajayoga",
      "cost": 600,
      "id": 1759549668800,
      "createdAt": "2025-10-04T03:47:48.800Z",
      "updatedAt": "2025-10-04T03:47:48.800Z"
    },
    {
      "name": "Santiago de Cuba > Pastorita",
      "cost": 600,
      "id": 1759549676760,
      "createdAt": "2025-10-04T03:47:56.760Z",
      "updatedAt": "2025-10-04T03:47:56.760Z"
    },
    {
      "name": "Santiago de Cuba > Vista Alegre",
      "cost": 300,
      "id": 1759549686896,
      "createdAt": "2025-10-04T03:48:06.896Z",
      "updatedAt": "2025-10-04T03:48:06.896Z"
    },
    {
      "name": "Santiago de Cuba > Caney",
      "cost": 1000,
      "id": 1759549696240,
      "createdAt": "2025-10-04T03:48:16.240Z",
      "updatedAt": "2025-10-04T03:48:16.240Z"
    },
    {
      "name": "Santiago de Cuba > Nuevo Vista Alegre",
      "cost": 100,
      "id": 1759549706888,
      "createdAt": "2025-10-04T03:48:26.888Z",
      "updatedAt": "2025-10-04T03:48:26.888Z"
    },
    {
      "name": "Santiago de Cuba > Marimón",
      "cost": 100,
      "id": 1759549715521,
      "createdAt": "2025-10-04T03:48:35.521Z",
      "updatedAt": "2025-10-04T03:48:35.521Z"
    },
    {
      "name": "Santiago de Cuba > Versalle Edificios",
      "cost": 800,
      "id": 1759549729736,
      "createdAt": "2025-10-04T03:48:49.736Z",
      "updatedAt": "2025-10-04T03:48:49.736Z"
    },
    {
      "name": "Santiago de Cuba > Ferreiro",
      "cost": 300,
      "id": 1759549738720,
      "createdAt": "2025-10-04T03:48:58.720Z",
      "updatedAt": "2025-10-04T03:48:58.720Z"
    },
    {
      "name": "Santiago de Cuba > 30 de noviembre altos",
      "cost": 500,
      "id": 1759549747952,
      "createdAt": "2025-10-04T03:49:07.952Z",
      "updatedAt": "2025-10-04T03:49:07.952Z"
    }
  ],
  "novels": [
    {
      "titulo": "Alaca",
      "genero": "Drama",
      "capitulos": 120,
      "año": 2024,
      "descripcion": "La vida de una joven se ve destrozada cuando le roban un riñón durante un violento secuestro, organizado por su rico padre biológico, que necesita un donante. Mientras busca respuestas, descubre el secreto que cambió su vida y se enfrenta a la traición de Kenan, el amor de su vida, cuyas complicadas lealtades ponen a prueba su vínculo.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/alaca2.jpg",
      "estado": "finalizada",
      "id": 1759547587158,
      "createdAt": "2025-10-04T03:13:07.158Z",
      "updatedAt": "2025-10-12T01:07:19.900Z"
    },
    {
      "titulo": "Salvaje (Yabani)",
      "genero": "Drama",
      "capitulos": 20,
      "año": 2023,
      "descripcion": "Salvaje novela turca, Yaman es un joven que ha vivido en las calles desde que tiene uso de razón. Ha tenido una vida dura, teniendo que luchar para sobrevivir y encontrar comida. Afortunadamente, siempre ha tenido a su lado tres amigos que se convirtieron en su familia, Cesur, Asi y Umut.\n\nSe cruzaron cuando eran apenas unos niños y a partir de ahí no se separaron. De manera inexplicable ninguno sabe nada de su pasado o porque están en la calle, sin importar su pasado o traumas decidieron confiar entre ellos y seguir adelante.\n\nLa gran preocupación del grupo es cumplir con el tratamiento de Umut, quien no puede caminar y el “Doctor milagro” es su única esperanza, pero el médico vive en el extranjero y ve a pocos pacientes una vez al año cuando llega al país. \n\nYaman cometerá el mayor error de su vida, entrando a una mansión que probablemente podría ser la de su familia, pero se le cae la cara de vergüenza ya que ha atacado a quien sería su hermano y apuñalado a su madre. Ahora su familia y la policía lo buscan.\n\nLa vida de Yaman comenzará a dar un giro inesperado cuando se cruce con Ates y su novia Ruya. Estos salían de un club nocturno. A partir de ahí una serie de eventos golpearán la vida de Yaman y lo llevarán al límite. Salvaje serie turca.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/yabani.jpg",
      "estado": "transmision",
      "id": 1759547831629,
      "createdAt": "2025-10-04T03:17:11.629Z",
      "updatedAt": "2025-10-12T01:11:41.187Z"
    },
    {
      "titulo": "El Turco",
      "genero": "Romance",
      "capitulos": 6,
      "año": 2024,
      "descripcion": "Tras ser traicionado y condenado a muerte, logra escapar y es curado por los aldeanos del pintoresco pueblo italiano de Moena, ubicado en los Alpes. A medida que se recupera, Balaban, al que apodan 'El Turco', se convierte en protector del pueblo, resistiendo las opresivas cargas impositivas de su señor feudal. Con el tiempo, la lucha se intensifica y, cuando un antiguo enemigo del protagonista, el implacable caballero Marco, aparece, comienza la batalla decisiva.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/el+turco.jpg",
      "estado": "finalizada",
      "id": 1759547886013,
      "createdAt": "2025-10-04T03:18:06.013Z",
      "updatedAt": "2025-10-12T01:09:31.363Z"
    },
    {
      "titulo": "A.mar, donde el amor teje sus redes",
      "genero": "Romance",
      "capitulos": 90,
      "año": 2025,
      "descripcion": "Estrella, madre soltera, regresa al pequeño pueblo pesquero de su juventud tras la muerte de su padre. Se enamora de Fabián, padre viudo y pescador, y se enfrenta a un huracán de problemas que ponen en riesgo el bienestar de sus familias.",
      "pais": "México",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/A.mar%2C+donde+el+amor+teje+sus+redes.jpg",
      "estado": "finalizada",
      "id": 1759548453473,
      "createdAt": "2025-10-04T03:27:33.473Z",
      "updatedAt": "2025-10-04T03:27:33.473Z"
    },
    {
      "titulo": "Amor en blanco y negro ES (Siyah Beyaz Ask)",
      "genero": "Romance",
      "capitulos": 64,
      "año": 2017,
      "descripcion": "Amor en Blanco y Negro novela turca es protagonizada por Ferhat Aslan, un joven que tiene un empleo que no todos pueden cumplir. Él es un asesino que trabaja para Namik, quien es su tío. Namik es el líder de los Emirham. La otra protagonista de esta serie es Asli Cinar, una neurocirujana que adora su empleo. Un día, no regresará a casa y será secuestrada por sus habilidades con el bisturí. Tendrá que salvarle la vida a un hombre al que Ferhat agredió. Sorprendida por los hechos, se convertirá en testigo de ese crimen, y reconocerá al infame Namik Emirham.\n\nSerá allí cuando Namik desarrolle desconfianza hacia la mujer, y es que además de ser un mafioso, es uno de los benefactores más importantes del hospital en dónde trabaja Asli. Namik le dará la misión a Ferhat de asesinar a la testigo, pero no podrá completarla, y le ofrecerá a Asli la opción de morir o contraer matrimonio con él. Resultará que el hermano de nuestra protagonista es policía, y está investigando casos de corrupción, en los que se incluye a los Emirham. Se llevará a cabo la boda, pero Namik jamás creerá que el amor floreció entre su sobrino y la neurocirujana.\n\nSeguirán con su matrimonio falso en Amor en Blanco y Negro serie turca, y poco a poco, Asli dejará de sentir miedo hacia Ferhat.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/amor+en+blanco+y+negro+2.jpg",
      "estado": "finalizada",
      "id": 1759548589366,
      "createdAt": "2025-10-04T03:29:49.366Z",
      "updatedAt": "2025-10-12T01:07:40.100Z"
    },
    {
      "titulo": "Amor perfecto",
      "genero": "Romance",
      "capitulos": 60,
      "año": 2023,
      "descripcion": "Amor perfecto novela brasileña, Mare es una joven visionaria, regresa a su pueblo natal en 1934 para tomar las riendas del hotel familiar. Sus sueños se ven truncados cuando su padre, cegado por los prejuicios, la obliga a casarse con Gaspar, un hombre malvado y sin escrúpulos. La ambición desmedida de Gilda, la madrastra de Mare, la lleva a conspirar con Gaspar para deshacerse de Leonel, el padre de Mare, y culpar a la joven de su muerte.\n\nMare es encarcelada injustamente y da a luz en la cárcel. Tras ocho años en prisión, finalmente cumple su condena en el año 1942, sale de prisión con un solo objetivo, vengarse de quienes la traicionaron y recuperar a su hijo perdido.\n\nEn su camino, Mare se reencuentra con Orlando, un médico que la amó en el pasado y que ahora está dispuesto a luchar por ella. Juntos, se enfrentan a los poderosos de Sao Jacinto. Mientras tanto Marcelino, es hijo de Orlando y Mare, se ha criado en un monasterio, a cargo de Fray León, quien se ha convertido en una figura paterna para el joven.\n\nGilda se ha convertido en una mujer poderosa e influyente, Mare hará todo en sus manos para recuperar su vida, reencontrarse con su hijo y vengarse de aquellos que le hicieron daño. Amor perfecto telenovela brasileña. ",
      "pais": "Brasil",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Amor+Perfecto.jpg",
      "estado": "finalizada",
      "id": 1759548723639,
      "createdAt": "2025-10-04T03:32:03.639Z",
      "updatedAt": "2025-10-16T07:53:21.464Z"
    },
    {
      "titulo": "Holding",
      "genero": "Drama",
      "capitulos": 20,
      "año": 2024,
      "descripcion": "La campeona mundial de apnea, Aydan Türker, se prepara para una nueva inmersión récord. Aydan no solo es una atleta exitosa; es una mujer emprendedora que ha entregado su corazón a los niños. Todos los ingresos que obtiene de su gran pasión, el buceo, los dedica a mantener en pie las escuelas que fundó, incluyendo aquellas que atienden a niños con necesidades educativas especiales. Uno de esos colegios le traerá a su vida a F?rat y al comisario Kerem. Uno de los principales patrocinadores de Aydan Türker es Alt?nordu Holding, uno de los grupos empresariales más grandes del país. Bajo el liderazgo de Osman Alt?nordu y con el impulso de sus hijas Ebru, Ceyda y Sema, la empresa crece día a día con una imagen impecable. Sin embargo, detrás de ese brillante rostro se esconden luchas de poder, conflictos familiares y un pasado oscuro. Como todo gran poder, Alt?nordu Holding también tiene grandes enemigos. Su adversario más peligroso es Mahir Beyo?lu, cómplice de aquel pasado oscuro. El viejo amigo y compañero de Osman, Zakir, tendrá que jugar con astucia para detener a Mahir. En medio de este caos, Osman descubre que padece una enfermedad incurable. Al borde de una ruptura total, se encuentra frente a la necesidad de enfrentarse al secreto mejor guardado de su vida: su hija, y con ello, a toda su familia. Para esa confrontación, Osman elige el mismo día en que Aydan romperá su nuevo récord. Ese día marcará el inicio de un viaje sin retorno para todos.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Holding.jpg",
      "estado": "finalizada",
      "id": 1759548810927,
      "createdAt": "2025-10-04T03:33:30.927Z",
      "updatedAt": "2025-10-16T07:49:47.713Z"
    },
    {
      "titulo": "La realeza",
      "genero": "Romance",
      "capitulos": 8,
      "año": 2025,
      "descripcion": "'La realeza' presenta una historia romántica que trasciende clichés. La trama gira en torno al encuentro entre Sophia, una empresaria moderna, y Aviraaj, un príncipe con un legado en decadencia. Él posee una mansión ancestral que necesita ser restaurada, pero carece de los fondos necesarios. Ella ve en ese lugar la oportunidad perfecta para lanzar su nueva empresa. Así, ambos deciden colaborar, aunque sus diferencias culturales y personales amenazan con arruinar todo. \n\nEl encantador príncipe Aviraaj conoce a Sofía, una empresaria hecha a sí misma, y los mundos de la realeza y las startups chocan en una apasionada tormenta de romance y ambición",
      "pais": "India",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/la+realeza.jpg",
      "estado": "finalizada",
      "id": 1759548887343,
      "createdAt": "2025-10-04T03:34:47.343Z",
      "updatedAt": "2025-10-12T01:10:39.531Z"
    },
    {
      "titulo": "Valentina, mi amor especial",
      "genero": "Romance",
      "capitulos": 39,
      "año": 2024,
      "descripcion": "En Valentina, mi amor especial, Herrera encarna a una joven en el espectro autista, quien es un genio en el mundo de la tecnología. El papel masculino principal es interpretado por Mauricio Novoa, un actor mexicano en ascenso, conocido por sus actuaciones en las últimas telenovelas producidas en Miami.\n\nValentina ha crecido protegida de la sociedad por su madre adoptiva en el pequeño pueblo de Chiquilistlán, donde destacó académicamente. Mudarse a la gran ciudad de Guadalajara después de que su madre fallece en un accidente será muy difícil, ya que se enfrentará lo peor y lo mejor de la humanidad: se enamorará por primera vez, conocerá nuevos amigos, pero también la envidia y los celos de aquellos que eligen no aceptarla.",
      "pais": "México",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Valentina%2C+mi+amor+especial.jpg",
      "estado": "finalizada",
      "id": 1759549070923,
      "createdAt": "2025-10-04T03:37:50.923Z",
      "updatedAt": "2025-10-16T12:40:22.316Z"
    },
    {
      "titulo": "Bahar",
      "genero": "Drama",
      "capitulos": 109,
      "año": 2024,
      "descripcion": "Hace 20 años, se graduó de la facultad de medicina pero decidió ser ama de casa en lugar de seguir la carrera de medicina. Está casada con el exitoso cirujano Timur Yavuzoglu y ha dedicado su vida a su marido y a sus hijos. La aparentemente feliz familia Yavuzoglu está conmocionada por la enfermedad de Bahar. El médico de Bahar, Evren, está decidido a salvarla y dice que la única solución es un trasplante de hígado. ¡El único hígado compatible de la familia pertenece a Timur! Para la familia Yavuzoglu, que se somete a una prueba con un umbral importante, nada volverá a ser lo mismo…",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Bahar2.jpg",
      "estado": "transmision",
      "id": 1759906090446,
      "createdAt": "2025-10-08T06:48:10.446Z",
      "updatedAt": "2025-10-12T00:58:39.140Z"
    },
    {
      "titulo": "Amanecer",
      "genero": "Romance",
      "capitulos": 67,
      "año": 2025,
      "descripcion": "La telenovela gira en torno a Leonel Carranza (Fernando Colunga), un hombre que vive en Villa Escarlata y es propietario de la hacienda Montoro. Su rutina cambia por completo cuando su esposa (interpretada por Andrea Legarreta) y su mejor amigo desaparecen juntos, dejándolo lleno de ira y desilusión al punto de darlos por muertos, lo cual podría traerle graves consecuencias en el futuro.\n\nAunque intenta rehacer su vida, sufre una nueva tragedia: su hija Paulina pierde la vida en un incendio. Leonel jura vengarse, convencido de que no se trató de un accidente, sino de un acto provocado por la familia Palacios.\n\nPara saciar su sed de revancha, obliga a Alba Palacios (Livia Brito) a casarse con él. Ella accede al matrimonio con tal de apoyar a sus padres, quienes atraviesan una fuerte crisis económica.\n\nPronto, la joven se ve envuelta en una relación sin afecto y bajo las amenazas de Atocha (Ana Belena), la hermana de Leonel. Ella es una mujer despiadada y ambiciosa, que desea quedarse con la hacienda Montoro, sin importar las consecuencias.\n\nA medida que Alba intenta ganarse el respeto de los habitantes de Villa Escarlata y de la finca, Leonel comienza a cuestionar su odio, pues ella parece todo menos culpable de la tragedia que marcó su vida.\n\nLa tensión aumenta con la llegada de Sebastián Peñalosa (Daniel Elbittar), un médico que, bajo el argumento de atender la salud de Leonel, comienza a acercarse a Alba con una fijación peligrosa creando un tríangulo romántico muy potente. Además, él guarda un misterio que podría cambiar el rumbo de la protagonista.\n\nA lo largo de la trama, Leonel y Alba experimentarán una mezcla de dolor, deseo y confusión, que podría evolucionar en una conexión profunda, mientras que quienes los rodean intentarán alimentar el rencor entre ellos.",
      "pais": "México",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Amanecer+2.jpg",
      "estado": "transmision",
      "id": 1759906188156,
      "createdAt": "2025-10-08T06:49:48.156Z",
      "updatedAt": "2025-10-12T00:57:45.117Z"
    },
    {
      "titulo": "Amor y Esperanza",
      "genero": "Drama",
      "capitulos": 106,
      "año": 2022,
      "descripcion": "Cuenta la historia de Ali Tahir, quien nació en Tesalónica en 1893 y cayó mártir en Sakarya en 1921. Sin embargo, ocurrió un evento milagroso cuando Ali abrió los ojos nuevamente. Desde ese día ha vivido 100 años sin envejecer un solo día. Sin embargo, después de todo lo que ha pasado, Ali decide acabar con su vida. \n\nZeynep, que trabajó en condiciones difíciles en Edremit y se preparó para el examen universitario, finalmente se convirtió en la quinta en Turquía y ganó el departamento de derecho de la universidad de su elección. Zeynep, que sueña con mudarse a Estambul con su madre para ir a la universidad, desconoce la desgracia de su madre Gönül.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Amor+y+Esperanza.jpg",
      "estado": "transmision",
      "id": 1759906259323,
      "createdAt": "2025-10-08T06:50:59.323Z",
      "updatedAt": "2025-10-12T00:58:14.693Z"
    },
    {
      "titulo": "Corazón Negro",
      "genero": "Drama",
      "capitulos": 53,
      "año": 2024,
      "descripcion": "A una edad temprana, Sumru abandonó a sus gemelos recién nacidos sin ni siquiera llegar a tenerlos en sus brazos. Se mudó a Capadocia con su madre, Nihayet, donde se casó con Samet ?ansalan, un hombre rico y prominente en la industria del turismo de la ciudad. Tuvieron dos hijos. Samet también tenía un hijo llamado Cihan de su primer matrimonio.\n\nCriados en circunstancias difíciles, los gemelos, Nuh y Melek, alimentados por el odio hacia la madre que los abandonó, descubren la identidad de su madre. Llegan a Capadocia para reclamar lo que creen que les corresponde y enfrentarse a su madre. Sorprendida, Sumru lo niega todo, pero es consciente de que es solo cuestión de tiempo antes de que se revele el secreto que ha escondido. Las cosas también son complicadas en la mansión de los ?ansalan. La cuñada viuda de Sumru, Hikmet, vive en la mansión con su hija Sevilay. Su objetivo es casar a su hija con su sobrino Cihan y asegurar su futuro. Samet, también apoya este plan.\n\nMientras los gemelos persiguen lo que creen que les corresponde de su madre, Melek se cruza en el camino de Cihan, y Nuh encuentra a Sevilay. Desde el primer momento, Cihan se ve profundamente afectado por Melek y no puede sacársela de la cabeza, incluso cuando se encuentra al borde de un matrimonio forzado. Mientras tanto, Sevilay intenta oponerse al matrimonio por su cuenta, y se cruza en su camino Nuh.\n\nAunque Sumru intenta mantener a los hijos que rechazó alejados de su familia, Melek y Nuh gradualmente se infiltrarán tanto en la familia como en los corazones de Cihan y Sevilay. Mientras los problemas de salud de Samet preocupan a toda la familia, su viejo enemigo, Tahsin, espera en la sombra, listo para vengarse del pasado.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/corazon+negro+-+siyah+kalp.jpg",
      "estado": "transmision",
      "id": 1759994099585,
      "createdAt": "2025-10-09T07:14:59.585Z",
      "updatedAt": "2025-10-12T01:08:26.084Z"
    },
    {
      "titulo": "El olor de un niño",
      "genero": "Drama",
      "capitulos": 36,
      "año": 2017,
      "descripcion": "eyno, una joven enfermera en Ámsterdam queda embarazada del hombre al que ama, soñando con formar una familia feliz. Pero un momento de ira cambia su destino para siempre, alejándola de su hijo y entrelazando su vida con la poderosa familia Akba?, líder del sector energético en Turquía. Mientras los conflictos de poder y las tensiones familiares sacuden a los Akba?, Zeyno, marcada por la pérdida, se transforma en una mujer fuerte y decidida. Esta es la historia de una madre que lucha por recuperar a su hijo, de un hombre que enfrenta su conciencia, y de secretos que podrían cambiarlo todo.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/el+olor+de+un+ni%C3%B1o+2.jpg",
      "estado": "finalizada",
      "id": 1759994252937,
      "createdAt": "2025-10-09T07:17:32.937Z",
      "updatedAt": "2025-10-12T01:08:50.076Z"
    },
    {
      "titulo": "Velvet el nuevo imperio",
      "genero": "Drama",
      "capitulos": 38,
      "año": 2025,
      "descripcion": "“Velvet, el nuevo imperio” se centra en Ana Velázquez, una talentosa diseñadora mexicana que llega a la empresa de moda Velvet en Nueva York tras perder a su madre.\n\nAllí, se enamora de Alberto Márquez, heredero de la compañía, pero su relación se ve frustrada por intrigas y un matrimonio por conveniencia con Cristina Ortegui.\n\nEntonces, eventualmente, Alberto desaparece y Ana continúa su carrera mientras espera a su hijo.\n\nTres años después, resulta que el destino los reúne nuevamente. Así, superando mentiras y obstáculos, ambos recuperan su amor y fundan una nueva empresa que celebra el legado de Velvet y su futuro en familia...",
      "pais": "Estados Unidos",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Velvet+el+nuevo+imperio+2.jpg",
      "estado": "transmision",
      "id": 1760000176983,
      "createdAt": "2025-10-09T08:56:16.983Z",
      "updatedAt": "2025-10-12T01:06:34.820Z"
    },
    {
      "titulo": "Kuma la otra esposa",
      "genero": "Drama",
      "capitulos": 81,
      "año": 2025,
      "descripcion": "Una joven acusada injustamente de asesinato debe convertirse en la segunda esposa (Kuma) del hermano de la víctima. Ceylan es una hija amable y cumplidora, pero cuando su padre intenta venderla como segunda esposa o “kuma”, ella huye. En su camino se encuentra con Karan, un joven empresario adinerado que acoge a Ceylan bajo su protección. Ambos se enamoran, pero cuando Ceylan es acusada falsamente del asesinato del hermano de Karan, el amor se transforma en odio. Karan se casa con la viuda de su hermano fallecido y obliga a Ceylan a convertirse en su kuma. Atrapada en una casa donde todos la odian y sin poder regresar a casa, la única esperanza de Ceylan es demostrar su inocencia y, tal vez, recuperar el amor de Karan.\n\n“Kuma” te atrapa de inmediato con una historia impactante: Ceylan, una joven inocente, es acusada injustamente de un asesinato que no cometió. Para escapar de un destino cruel, se ve forzada a casarse con Karan, el hermano de la supuesta víctima, convirtiéndose en su segunda esposa. Desde el primer episodio, la telenovela te sumerge en un torbellino de emociones, donde la lucha por la verdad y la supervivencia se entrelazan. ¿Cómo logrará Ceylan probar su inocencia mientras enfrenta un matrimonio impuesto y un entorno lleno de rechazo?\n\nLa tensión sube cuando Ceylan entra en la vida de Karan y su primera esposa, Sema, quien la desprecia y la considera una rival. Los enfrentamientos entre ellas son solo la punta del iceberg: la familia guarda secretos oscuros que se revelan poco a poco, dejando más preguntas que respuestas. Cada capítulo te mantiene expectante, descubriendo las verdaderas intenciones de los personajes y las traiciones que acechan en cada esquina. ¿Qué enigmas saldrán a la luz y cómo cambiarán el rumbo de la vida de Ceylan?\n\n“Kuma” no solo es drama; también te ofrece una poderosa historia de amor y superación. Mientras Ceylan enfrenta hostilidad y desafíos, encuentra apoyo en los lugares más inesperados y comienza a florecer un romance que desafía todas las probabilidades. A lo largo de la serie, la ves transformarse de una mujer vulnerable a una luchadora decidida, lista para reclamar su lugar en el mundo. ¿Podrá el amor sobrevivir en un entorno tan hostil y llevará a Ceylan a encontrar su verdadera fuerza?\n\nCon los majestuosos paisajes del este de Turquía como telón de fondo, “Kuma” es un espectáculo visual que acompaña una narrativa emocionante. La telenovela combina temas profundos como la injusticia y la resiliencia con giros inesperados que te dejarán ansioso por el próximo episodio. Es una invitación a seguir el viaje de Ceylan hacia la redención, lleno de misterio, pasión y esperanza. Si buscas una historia que te haga sentir, reflexionar y mantenerte al borde del asiento, “Kuma” te está esperando para que descubras qué pasa después. ",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Kuma+La+otra+esposa.jpg",
      "estado": "transmision",
      "id": 1760000320843,
      "createdAt": "2025-10-09T08:58:40.843Z",
      "updatedAt": "2025-10-12T01:03:19.396Z"
    },
    {
      "titulo": "Cautiva por amor",
      "genero": "Drama",
      "capitulos": 70,
      "año": 2025,
      "descripcion": "Jazmín, secuestrada por el terrateniente Remigio Fuentes, sobrevive esclavitud y abusos. Años después, regresa al rancho buscando venganza a través de su hijo Fernando, pero conoce a Santiago, un peón que finge ser policía.",
      "pais": "México",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/cautiva+por+amor.jpg",
      "estado": "finalizada",
      "id": 1760022250390,
      "createdAt": "2025-10-09T15:04:10.390Z",
      "updatedAt": "2025-10-12T01:08:04.036Z"
    },
    {
      "titulo": "La chica del momento",
      "genero": "Romance",
      "capitulos": 21,
      "año": 2023,
      "descripcion": "La trama, ambientada en los años 50, gira en torno a Beatriz (Duda Santos, de Renacer), quien ha crecido creyendo que su madre Clarice (Carol Castro de Huérfanos de su tierra) la abandonó cuando tenía cuatro años. Pero 16 años después descubre el paradero de su madre y se entera de que no la abandonó sino que perdió la memoria en un accidente. Pero Beatriz también descubrirá que otra joven, Bia (Maisa), ha tomado su lugar e iniciará un viaje lleno de obstáculos y de reconciliación con el pasado.",
      "pais": "Brasil",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/la+chica+del+momento.jpg",
      "estado": "transmision",
      "id": 1760022506646,
      "createdAt": "2025-10-09T15:08:26.646Z",
      "updatedAt": "2025-10-12T01:09:52.979Z"
    },
    {
      "titulo": "La encrucijada",
      "genero": "Drama",
      "capitulos": 28,
      "año": 2025,
      "descripcion": "César Bravo vuelve de México, casi treinta años después, a la tierra donde nació cuando ya nadie se acuerda del apellido de su padre ni de las trágicas circunstancias que rodearon su muerte y la de sus abuelos. Aunque su aspecto de turista aventurero no lo delata, tiene muy claro a lo que viene.\n\nNo hallará paz hasta que no consiga hacer justicia y meter en la cárcel a Octavio Oramas, el hombre que se apropió de la historia familiar de su padre y de todo lo que le pertenecía para crear su propio imperio. Con lo que no cuenta César es que en su camino se cruzará Amanda Oramas, la niña de los ojos de su enemigo, de quien se enamorará perdidamente. Un cruce de caminos fortuito que marca un antes y un después en la vida de dos familias rivales. ¿Qué vencerá: el amor o la venganza?[",
      "pais": "España",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/La+encrucijada.jpg",
      "estado": "transmision",
      "id": 1760022601366,
      "createdAt": "2025-10-09T15:10:01.366Z",
      "updatedAt": "2025-10-12T01:03:45.252Z"
    },
    {
      "titulo": "Leyla",
      "genero": "Drama",
      "capitulos": 32,
      "año": 2024,
      "descripcion": "Después de perderlo todo, Leyla renació entre las sombras. La inocencia se quebró el día en que su padre cayó rendido ante los encantos de Nur, la mujer que alguna vez fingió cuidar de su familia… y que ahora, convertida en su madrastra, oculta más de un secreto detrás de su sonrisa. Cuando el amor ciega, la tragedia abre los ojos. Y Leyla lo aprendió demasiado tarde.\n\nAños más tarde, regresa bajo una nueva identidad. Nadie sospecha que esa talentosa chef llamada Ela es en realidad la hija que vio su hogar convertirse en ruinas. Ni siquiera Nur, quien ahora vive rodeada de lujos junto a su nuevo amante, una leyenda caída del fútbol. Pero el destino no olvida… y tampoco perdona.\n\nEl reencuentro con Civan —el hijo adoptivo de Nur y antiguo amor de infancia de Leyla— desata una tormenta de emociones, mentiras y heridas que jamás cerraron. A medida que las piezas del pasado empiezan a encajar, las preguntas se multiplican como cuchillos en la espalda:\n\n¿Puede la venganza sobrevivir al amor? ¿Quién es realmente víctima… y quién el verdadero villano? ¿Hasta dónde está dispuesta a llegar Leyla para hacer justicia… o para destruirse en el intento? En un juego de identidades, pasiones ocultas y verdades peligrosas… nadie sale ileso.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Leyla+Hayat.jpg",
      "estado": "transmision",
      "id": 1760022763950,
      "createdAt": "2025-10-09T15:12:43.950Z",
      "updatedAt": "2025-10-12T01:05:04.308Z"
    },
    {
      "titulo": "Manía de ti",
      "genero": "Drama",
      "capitulos": 111,
      "año": 2024,
      "descripcion": "Narra la historia de Luna (Moreira) y Viola (Gabz), dos chicas que se convierten en amigas cuando la segunda se instala en Angra dos Reis junto a su marido Mavi. Con el tiempo, Viola se destaca en la gastronomía, misma área de Luna y también se involucra con Rudá (Chay Suede), el hombre al que Luna ama. Años después, Viola se ha convertido en una éxitosa chef, mientras Luna perdió todo lo que tenía. Ambas rivales se unen para intentar liberar a Rudá de la cárcel, tras una trampa ocasionada por Mavi.",
      "pais": "Brasil",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/mania+de+ti2.jpg",
      "estado": "finalizada",
      "id": 1760022873950,
      "createdAt": "2025-10-09T15:14:33.950Z",
      "updatedAt": "2025-10-16T07:50:24.024Z"
    },
    {
      "titulo": "Monteverde",
      "genero": "Drama",
      "capitulos": 81,
      "año": 2025,
      "descripcion": "‘Monteverde’ es un melodrama donde los habitantes de este pequeño pueblo vivirán el amor, la traición y la redención mientras descubren el amor y la verdad.\n\nMonteverde' narra la vida de Carolina (África Zavala), que cambiará radicalmente al ser acusada de un fraude que cometió su marido. Por ello debe salir huyendo con su hijo Andrés (Juniel García) y adoptar la identidad de Celeste, su hermana melliza que es monja, para refugiarse en dicho pueblo, pero todo se complicará cuando conoce a Oscar León (Gabriel Soto).\n\nAlejandro Ibarra, Cynthia Klitbo, Mario Morán, Arturo Carmona, Marialicia Delgado, Oscar Bonfiglio, Fernanda Urdapilleta, Aldo Guerra, Ana Patricio Rojo, Christian Ramos, Ara Saldívar, Rodrigo Ríos, Juniel García, Manuel Riguezza, Marcela Guzmán, Ana Karen Parra, Ximena Martínez, Fernanda Bernal y Claudia Acosta complementan el reparto.",
      "pais": "México",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/monte+verde.jpg",
      "estado": "transmision",
      "id": 1760023005510,
      "createdAt": "2025-10-09T15:16:45.510Z",
      "updatedAt": "2025-10-12T01:15:11.459Z"
    },
    {
      "titulo": "El padre (Ben Bu Cihana)",
      "genero": "Drama",
      "capitulos": 224,
      "año": 2022,
      "descripcion": "Cezayir Türk, un asesino del servicio secreto que sirvió a su país, se venga de su hermano, quien fue saboteado. Empieza una nueva vida demostrando que murió por el bien del estado y la seguridad de su familia. A raíz de una lesión sufrida durante una de sus operaciones en el extranjero, conoce a Firuze, uno de los médicos sin fronteras. Aunque extraña a su esposa e hijos, en el fondo de su corazón sabe que volver con ellos es casi imposible; sin embargo, esta palabra no está en su vocabulario. Se enamora de Firuze para formar una familia; mientras tanto, queda expuesto y tiene que regresar a Estambul. Ni su familia secundaria lo sabe, ni la familia original, que lloró y rezó en su cementerio, siguió los recientes acontecimientos que le sucedieron. Estambul, por otro lado, no es el mismo lugar de donde partió. Hará todo lo posible por luchar contra las fuerzas extranjeras, aunque también deberá dividir su energía entre dos mujeres que lo aman.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/el+padre.jpeg",
      "estado": "finalizada",
      "id": 1760023297743,
      "createdAt": "2025-10-09T15:21:37.743Z",
      "updatedAt": "2025-10-12T01:09:15.667Z"
    },
    {
      "titulo": "Karsu",
      "genero": "Drama",
      "capitulos": 215,
      "año": 2025,
      "descripcion": "Karsu, el amor de madre nunca se rinde, una serie turca que cuenta la conmovedora historia de una madre resiliente a la que la vida la pone a prueba cuando cree perder a uno de sus hijos y  cuando sufre la infidelidad de su esposo. Un drama que describe la entereza de una mujer frente a las adversidades y que habla del carácter y valentía de una mujer que consigue ser  independiente para asegurar el bienestar de sus hijos. Una historia de lucha, sacrificio y esperanza.\n\nKarsu, no ha tenido una buena relación con su madre y decide alejarse de su familia para casarse con Reha, un hombre al que no ama, y en donde no encuentra felicidad, sin embargo, lucha por mantener su matrimonio por el bien de sus tres hijos.\n\nLas cosas para Karsu se volverán aún más dramáticas cuando, por un descuido de su madre, su hijo Kuzey desaparece,  debido a esto, la relación con su esposo se convierte en un total infierno, pues ahora el único propósito en su vida es encontrar a su hijo. Pasa el tiempo hasta que tres años después de búsqueda infructuosa, da con su paradero.  Ella, en su amor de madre, hace todo lo posible para traerlo de regreso a casa hasta que finalmente lo logra, pero esto hace que su hijo despierte una intensa ira en contra de ella, pues lo separa de Ozan, quien ha sido el hombre que lo ha cuidado durante estos tres años y a quien considera su padre. ¿Logrará ganarse el amor de su hijo?\n\nParalelo a esta situación, Karsu es engañada por su esposo, sufriendo una terrible decepción que la hace tomar la decisión de abandonar su hogar junto a sus hijos. Desesperada, sin tener un lugar a donde ir, se ve obligada a regresar a la casa de su madre, a quien no ve desde hace años, con el único deseo de reconstruir su vida.\n\nOzan se siente atraído por Karsu y su pasión va creciendo con el pasar de los días, a esto se suma al amor que siente por Kuzey, a quien ve como su hijo.\n\nLas cosas se complicarán más cuando Karsu conoce a Atilla, un mafioso que se presenta como escritor, y que  también se siente atraído por ella. Al mismo tiempo, su marido, Reha, de quien está intentando divorciarse, ha prometido hacerle la vida imposible, dejándola sin apoyo económico, además de negarse  a darle el divorcio. ¿Podrá  encontrar el amor?\n\nLa protagonista de esta historia vivirá un viaje de resiliencia y renovación, mientras enfrenta los desafíos de reconstruir su vida y dejar atrás un pasado agobiante.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Karsu%2C+La+Fuerza+de+Una+Madre.jpg",
      "estado": "transmision",
      "id": 1760023410453,
      "createdAt": "2025-10-09T15:23:30.453Z",
      "updatedAt": "2025-10-12T01:02:54.740Z"
    },
    {
      "titulo": "La esclava madre",
      "genero": "Drama",
      "capitulos": 125,
      "año": 2016,
      "descripcion": "Juliana es fruto de la violencia que su madre, Luena, sufrió durante la travesía oceánica a bordo de un navío mercante que tenía como mercancía esclavos. Al cumplir 18 años y conocer la verdad sobre su pasado, Juliana se jura a si misma que jamás dejará que un hombre blanco la toque. Es en ese preciso momento de desesperación que conoce al joven portugués Miguel, un viajante en búsqueda de respuestas sobre el misterio que involucra a la muerte de sus padres.\n\nMiguel será el gran amor de su vida, pero además despertará el interés de Maria Isabel, hija del coronel Custódio. Con la complicidad de su fiel y sarcástica mucama Esméria, Maria Isabel no medirá sus esfuerzos para perjudicar a Juliana, que jamás aceptará el desacato de una esclava.\n\nJuliana también enfrentará un obstáculo muy poderoso: el Comendador Almeida. Al casarse con Teresa por un acuerdo que permitiría sacar a su familia de la ruina financiera, Almeida se convierte en el nuevo señor del Ingenio del Sol. El casamiento de Teresa y Almeida fue el comienzo de una terrible etapa en la vida de Juliana, ya que su nuevo amo se quedará completamente obcecado por ella.\n\nJuliana y Miguel vivirán juntos una intensa historia de amor, y enfrentarán a enemigos poderosos y obstáculos aparentemente difíciles de sobrellevar, como el prejuicio de una época que vive a la sombra de la esclavitud.",
      "pais": "Brasil",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/la+esclava+madre.jpg",
      "estado": "transmision",
      "id": 1760023539558,
      "createdAt": "2025-10-09T15:25:39.558Z",
      "updatedAt": "2025-10-12T01:10:21.787Z"
    },
    {
      "titulo": "Carpinti",
      "genero": "Romance",
      "capitulos": 4,
      "año": 2025,
      "descripcion": "Tras recibir el corazón de Melike Alkan, Asli se adentra en un mundo de dolor, poder y amor prohibido, mientras todos se preguntan si la muerte de Melike fue accidente o asesinato.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Carpinti.jpeg",
      "estado": "transmision",
      "id": 1760118692800,
      "createdAt": "2025-10-10T17:51:32.800Z",
      "updatedAt": "2025-10-12T01:02:15.180Z"
    },
    {
      "titulo": "Betty la fea,la historia continúa",
      "genero": "Romance",
      "capitulos": 18,
      "año": 2024,
      "descripcion": "Betty la fea,la historia continua novela colombiana, Dos décadas después de conquistar el corazón de Armando Mendoza y transformar el mundo de la moda, Beatriz Pinzón Solano, mejor conocida como \"Betty la fea\", se enfrenta a nuevos desafíos en su vida personal y profesional.\n\nConvertida en una reconocida empresaria y diseñadora de moda, Betty lidera Ecomoda con mano firme, inspirando a las mujeres con sus creaciones y su visión innovadora. Sin embargo, su matrimonio con Armando, aunque lleno de amor, se ve amenazado por las inseguridades del pasado y la aparición de nuevos rivales en el mundo de los negocios.\n\nAl mismo tiempo, Betty debe lidiar con las nuevas generaciones en Ecomoda. Las jóvenes diseñadoras, influenciadas por las tendencias digitales y la cultura del influencer, desafían la visión tradicional de Betty sobre la moda, generando tensiones y debates en la empresa.\n\nEn medio de estos retos, Betty encuentra apoyo en sus fieles amigos, Marcela y Hugo, quienes la acompañan en sus aventuras y le ofrecen consejos sabios. Además, descubre nuevas aliadas en algunas de las jóvenes diseñadoras que, a pesar de sus diferencias, reconocen el talento y la experiencia de Betty. Betty la fea,la historia continúa telenovela colombiana.",
      "pais": "Colombia",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Betty+la+fea%2Cla+historia+contin%C3%BAa+2.png",
      "estado": "finalizada",
      "id": 1760119057180,
      "createdAt": "2025-10-10T17:57:37.180Z",
      "updatedAt": "2025-10-12T01:00:50.220Z"
    },
    {
      "titulo": "La Venganza de Analía 2",
      "genero": "Drama",
      "capitulos": 67,
      "año": 2025,
      "descripcion": "En una jugada maquiavélica, logra salir de la cárcel para volver a la política, su objetivo es claro: castigar a Analía y convertirse en el presidente de Colombia. Para evitar esto y proteger a los suyos, Analía pondrá en riesgo su vida y se enfrentará a Paulina Peña, aliada de Mejía y asesina profesional.",
      "pais": "Colombia",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Venganza-de-Analia-23.jpg",
      "estado": "finalizada",
      "id": 1760119856700,
      "createdAt": "2025-10-10T18:10:56.700Z",
      "updatedAt": "2025-10-12T01:07:05.252Z"
    },
    {
      "titulo": "Leke",
      "genero": "Romance",
      "capitulos": 30,
      "año": 2019,
      "descripcion": "Leke novela turca tiene como personaje principal a Yasemin, quien se mudó a Alemania y tuvo muchos altibajos. A pesar de ello, no tuvo miedo de embarcarse en una aventura. Lograría ingresar en la escuela de leyes, y deberá trabajar medio tiempo para pagar sus estudios.\n\nDescubriremos que tiene un hermano con discapacidad auditiva,y su única meta es lograr recibir la custodia del joven, quien ha tenido que crecer en un orfanato porque sus padres no quisieron hacerse cargo de él. Igualmente, está ahorrando dinero para costear la operación de su hermano. Conoceremos a otro personaje llamado Cem, quien es el mayor de dos hijos de una familia acaudalada. Su infancia fue traumática, ya que fue testigo de un incidente que hizo que sus padres se divorciaran. Ahora es un hombre talentoso para los negocios, pero su vida personal es otra. No confía fácilmente en las personas y tiene cierto recelo con las mujeres. Sin esperar conocerse, tanto Yasemin como Cem tendrán un encuentro que se producirá en un evento que organizó la compañía de este joven apuesto.\n\nNinguno buscaba este encuentro en Leke serie turca, el cual será el desencadenante de una serie de sucesos que debes descubrir.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Leke.jpg",
      "estado": "finalizada",
      "id": 1760120038067,
      "createdAt": "2025-10-10T18:13:58.067Z",
      "updatedAt": "2025-10-12T01:04:39.012Z"
    },
    {
      "titulo": "Mehmed Sultán de las Conquistas",
      "genero": "Acción",
      "capitulos": 15,
      "año": 2024,
      "descripcion": "En esta apasionante producción, nos adentramos en el corazón del Imperio otomano, en una época cargada de conquistas y luchas por la justicia, para ser testigos del viaje triunfal del joven sultán Mehmed II, cuya inteligencia y valentía lo guiarán en su camino hacia la grandeza.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Mehmed+Sultan+of+Conquests+2.jpg",
      "estado": "finalizada",
      "id": 1760128599656,
      "createdAt": "2025-10-10T20:36:39.656Z",
      "updatedAt": "2025-10-12T01:05:32.420Z"
    },
    {
      "titulo": "Represalias",
      "genero": "Acción",
      "capitulos": 10,
      "año": 2024,
      "descripcion": "Ali Resat, un férreo hombre apegado a sus tradiciones, es liberado tras largos años en prisión gracias a una amnistía. Con la esperanza de reconciliarse con su hijo, quien lo desprecia, y con el deseo de hacer pagar a la mafia todo mal que le hizo, Ali Resat irá en busca de redención... y represalias.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Represalias.jpg",
      "estado": "transmision",
      "id": 1760129254327,
      "createdAt": "2025-10-10T20:47:34.327Z",
      "updatedAt": "2025-10-12T01:06:00.932Z"
    },
    {
      "titulo": "Lazos Rotos (Yalan)",
      "genero": "Drama",
      "capitulos": 95,
      "año": 2024,
      "descripcion": "Yalan novela turca, Melike, una mujer fuerte y resiliente, ha sacrificado 20 años de su vida en prisión para proteger a su hija Elif. Acusada injustamente de un crimen que no cometió, Melike ha soportado el dolor y la soledad con la esperanza de un futuro mejor para su pequeña.\n\nAl fin liberada, Melike regresa a un mundo que ya no reconoce. Su hija Elif ha crecido bajo la tutela de otras personas, y Melike debe luchar para recuperar su lugar en la vida de su hija.\n\nSin embargo, la verdad sobre el crimen que la llevó a prisión no tardará en salir a la luz. Melike se verá envuelta en una red de mentiras, engaños y traiciones que amenazan con destruir su vida y la de su hija.\n\nEn medio de la adversidad, Melike encontrará apoyo en Suna, una joven abogada idealista que cree en su inocencia. Juntas, lucharán por desenmascarar a los verdaderos culpables y restaurar el honor de Melike.\n\nA lo largo de su camino, Melike se enfrentará a poderosos enemigos que no se detendrán ante nada para silenciarla. Deberá utilizar su astucia, su valentía y su determinación para proteger a su hija y descubrir la verdad. Yalan serie turca.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Lazos+Rotos.jpg",
      "estado": "finalizada",
      "id": 1760129966562,
      "createdAt": "2025-10-10T20:59:26.562Z",
      "updatedAt": "2025-10-12T01:04:15.828Z"
    },
    {
      "titulo": "Destino roto",
      "genero": "Drama",
      "capitulos": 121,
      "año": 2022,
      "descripcion": "Melike, que sobrevivió en prisión durante 20 años por el bien de su hija, cayó en medio de una gran mentira cuando fue puesta en libertad. Todas las injusticias y el mal que se le han hecho salen al descubierto ante Melike.",
      "pais": "Turquía",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Destino+roto.jpg",
      "estado": "finalizada",
      "id": 1760239390038,
      "createdAt": "2025-10-12T03:23:10.038Z",
      "updatedAt": "2025-10-12T03:23:10.038Z"
    },
    {
      "titulo": "Dinastia Casillas",
      "genero": "Acción",
      "capitulos": 6,
      "año": 2025,
      "descripcion": "Tras la misteriosa desaparición de Aurelio, Ismael Casillas se ve obligado a enfrentar una despiadada batalla por el legado y la familia. Proteger a los suyos le exige alianzas y sacrificios.",
      "pais": "Estados Unidos",
      "imagen": "https://f005.backblazeb2.com/file/tvalacartaplus/tvalacartaplus/Dinastia+casilla.jpg",
      "estado": "transmision",
      "id": 1760601934996,
      "createdAt": "2025-10-16T08:05:34.996Z",
      "updatedAt": "2025-10-16T08:05:34.996Z"
    }
  ],
  "settings": {
    "version": "2.1.0",
    "autoSync": true,
    "syncInterval": 300000,
    "enableNotifications": true,
    "maxNotifications": 100,
    "metadata": {
      "totalOrders": 0,
      "totalRevenue": 0,
      "lastOrderDate": "",
      "systemUptime": "2025-10-04T02:55:36.295Z"
    }
  },
  "syncStatus": {
    "lastSync": "2025-10-04T03:49:03.729Z",
    "isOnline": true,
    "pendingChanges": 1
  },
  "exportDate": "2025-10-04T03:49:10.992Z"
};

// CREDENCIALES DE ACCESO (CONFIGURABLES)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Types
export interface PriceConfig {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  section: string;
  action: string;
  read: boolean;
}

export interface SyncStatus {
  lastSync: string;
  isOnline: boolean;
  pendingChanges: number;
}

export interface SystemConfig {
  version: string;
  lastExport: string;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  settings: {
    autoSync: boolean;
    syncInterval: number;
    enableNotifications: boolean;
    maxNotifications: number;
  };
  metadata: {
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate: string;
    systemUptime: string;
  };
}

export interface AdminState {
  isAuthenticated: boolean;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  notifications: Notification[];
  syncStatus: SyncStatus;
  systemConfig: SystemConfig;
}

type AdminAction = 
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICES'; payload: PriceConfig }
  | { type: 'ADD_DELIVERY_ZONE'; payload: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: number }
  | { type: 'ADD_NOVEL'; payload: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYNC_STATUS'; payload: Partial<SyncStatus> }
  | { type: 'SYNC_STATE'; payload: Partial<AdminState> }
  | { type: 'LOAD_SYSTEM_CONFIG'; payload: SystemConfig }
  | { type: 'UPDATE_SYSTEM_CONFIG'; payload: Partial<SystemConfig> };

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePrices: (prices: PriceConfig) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: number) => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  exportSystemConfig: () => string;
  importSystemConfig: (configJson: string) => boolean;
  exportCompleteSourceCode: () => void;
  syncWithRemote: () => Promise<void>;
  broadcastChange: (change: any) => void;
  syncAllSections: () => Promise<void>;
  getAvailableCountries: () => string[];
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
}

// Initial state with embedded configuration
const initialState: AdminState = {
  isAuthenticated: false,
  prices: EMBEDDED_CONFIG.prices,
  deliveryZones: EMBEDDED_CONFIG.deliveryZones,
  novels: EMBEDDED_CONFIG.novels,
  notifications: [],
  syncStatus: {
    lastSync: new Date().toISOString(),
    isOnline: true,
    pendingChanges: 0,
  },
  systemConfig: EMBEDDED_CONFIG,
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.username === ADMIN_CREDENTIALS.username && action.payload.password === ADMIN_CREDENTIALS.password) {
        return { ...state, isAuthenticated: true };
      }
      return state;

    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    case 'UPDATE_PRICES':
      const updatedConfig = {
        ...state.systemConfig,
        prices: action.payload,
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        prices: action.payload,
        systemConfig: updatedConfig,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_DELIVERY_ZONE':
      const newZone: DeliveryZone = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const configWithNewZone = {
        ...state.systemConfig,
        deliveryZones: [...state.systemConfig.deliveryZones, newZone],
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        deliveryZones: [...state.deliveryZones, newZone],
        systemConfig: configWithNewZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'UPDATE_DELIVERY_ZONE':
      const updatedZones = state.deliveryZones.map(zone =>
        zone.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : zone
      );
      const configWithUpdatedZone = {
        ...state.systemConfig,
        deliveryZones: updatedZones,
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        deliveryZones: updatedZones,
        systemConfig: configWithUpdatedZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'DELETE_DELIVERY_ZONE':
      const filteredZones = state.deliveryZones.filter(zone => zone.id !== action.payload);
      const configWithDeletedZone = {
        ...state.systemConfig,
        deliveryZones: filteredZones,
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        deliveryZones: filteredZones,
        systemConfig: configWithDeletedZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_NOVEL':
      const newNovel: Novel = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const configWithNewNovel = {
        ...state.systemConfig,
        novels: [...state.systemConfig.novels, newNovel],
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        novels: [...state.novels, newNovel],
        systemConfig: configWithNewNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'UPDATE_NOVEL':
      const updatedNovels = state.novels.map(novel =>
        novel.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : novel
      );
      const configWithUpdatedNovel = {
        ...state.systemConfig,
        novels: updatedNovels,
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        novels: updatedNovels,
        systemConfig: configWithUpdatedNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'DELETE_NOVEL':
      const filteredNovels = state.novels.filter(novel => novel.id !== action.payload);
      const configWithDeletedNovel = {
        ...state.systemConfig,
        novels: filteredNovels,
        lastExport: new Date().toISOString(),
      };
      return {
        ...state,
        novels: filteredNovels,
        systemConfig: configWithDeletedNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_NOTIFICATION':
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications].slice(0, state.systemConfig.settings.maxNotifications),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'UPDATE_SYNC_STATUS':
      return {
        ...state,
        syncStatus: { ...state.syncStatus, ...action.payload },
      };

    case 'LOAD_SYSTEM_CONFIG':
      return {
        ...state,
        prices: action.payload.prices,
        deliveryZones: action.payload.deliveryZones,
        novels: action.payload.novels,
        systemConfig: action.payload,
        syncStatus: { ...state.syncStatus, lastSync: new Date().toISOString(), pendingChanges: 0 }
      };

    case 'UPDATE_SYSTEM_CONFIG':
      const newSystemConfig = { ...state.systemConfig, ...action.payload };
      return {
        ...state,
        systemConfig: newSystemConfig,
      };

    case 'SYNC_STATE':
      return {
        ...state,
        ...action.payload,
        syncStatus: { ...state.syncStatus, lastSync: new Date().toISOString(), pendingChanges: 0 }
      };

    default:
      return state;
  }
}

// Context creation
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Real-time sync service
class RealTimeSyncService {
  private listeners: Set<(data: any) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;
  private storageKey = 'admin_system_state';
  private configKey = 'system_config';

  constructor() {
    this.initializeSync();
  }

  private initializeSync() {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, 5000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  private handleStorageChange(event: StorageEvent) {
    if ((event.key === this.storageKey || event.key === this.configKey) && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);
        this.notifyListeners(newState);
      } catch (error) {
        console.error('Error parsing sync data:', error);
      }
    }
  }

  private checkForUpdates() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const config = localStorage.getItem(this.configKey);
      
      if (stored) {
        const storedState = JSON.parse(stored);
        this.notifyListeners(storedState);
      }
      
      if (config) {
        const configData = JSON.parse(config);
        this.notifyListeners({ systemConfig: configData });
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  broadcast(state: AdminState) {
    try {
      const syncData = {
        ...state,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(syncData));
      localStorage.setItem(this.configKey, JSON.stringify(state.systemConfig));
      this.notifyListeners(syncData);
    } catch (error) {
      console.error('Error broadcasting state:', error);
    }
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    this.listeners.clear();
  }
}

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [syncService] = React.useState(() => new RealTimeSyncService());

  // Load system config on startup
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('system_config');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        dispatch({ type: 'LOAD_SYSTEM_CONFIG', payload: config });
      }
      
      const stored = localStorage.getItem('admin_system_state');
      if (stored) {
        const storedState = JSON.parse(stored);
        dispatch({ type: 'SYNC_STATE', payload: storedState });
      }
    } catch (error) {
      console.error('Error loading initial state:', error);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    try {
      localStorage.setItem('admin_system_state', JSON.stringify(state));
      localStorage.setItem('system_config', JSON.stringify(state.systemConfig));
      syncService.broadcast(state);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state, syncService]);

  // Real-time sync listener
  useEffect(() => {
    const unsubscribe = syncService.subscribe((syncedState) => {
      if (JSON.stringify(syncedState) !== JSON.stringify(state)) {
        dispatch({ type: 'SYNC_STATE', payload: syncedState });
      }
    });
    return unsubscribe;
  }, [syncService, state]);

  useEffect(() => {
    return () => {
      syncService.destroy();
    };
  }, [syncService]);

  // Context methods implementation
  const login = (username: string, password: string): boolean => {
    dispatch({ type: 'LOGIN', payload: { username, password } });
    const success = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    if (success) {
      addNotification({
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: 'Bienvenido al panel de administración',
        section: 'Autenticación',
        action: 'login'
      });
    }
    return success;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    addNotification({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente',
      section: 'Autenticación',
      action: 'logout'
    });
  };

  const updatePrices = (prices: PriceConfig) => {
    dispatch({ type: 'UPDATE_PRICES', payload: prices });
    addNotification({
      type: 'success',
      title: 'Precios actualizados',
      message: 'Los precios se han actualizado y sincronizado automáticamente',
      section: 'Precios',
      action: 'update'
    });
    broadcastChange({ type: 'prices', data: prices });
  };

  const addDeliveryZone = (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega agregada',
      message: `Se agregó la zona "${zone.name}" y se sincronizó automáticamente`,
      section: 'Zonas de Entrega',
      action: 'create'
    });
    broadcastChange({ type: 'delivery_zone_add', data: zone });
  };

  const updateDeliveryZone = (zone: DeliveryZone) => {
    dispatch({ type: 'UPDATE_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega actualizada',
      message: `Se actualizó la zona "${zone.name}" y se sincronizó automáticamente`,
      section: 'Zonas de Entrega',
      action: 'update'
    });
    broadcastChange({ type: 'delivery_zone_update', data: zone });
  };

  const deleteDeliveryZone = (id: number) => {
    const zone = state.deliveryZones.find(z => z.id === id);
    dispatch({ type: 'DELETE_DELIVERY_ZONE', payload: id });
    addNotification({
      type: 'warning',
      title: 'Zona de entrega eliminada',
      message: `Se eliminó la zona "${zone?.name || 'Desconocida'}" y se sincronizó automáticamente`,
      section: 'Zonas de Entrega',
      action: 'delete'
    });
    broadcastChange({ type: 'delivery_zone_delete', data: { id } });
  };

  const addNovel = (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela agregada',
      message: `Se agregó la novela "${novel.titulo}" y se sincronizó automáticamente`,
      section: 'Gestión de Novelas',
      action: 'create'
    });
    broadcastChange({ type: 'novel_add', data: novel });
  };

  const updateNovel = (novel: Novel) => {
    dispatch({ type: 'UPDATE_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela actualizada',
      message: `Se actualizó la novela "${novel.titulo}" y se sincronizó automáticamente`,
      section: 'Gestión de Novelas',
      action: 'update'
    });
    broadcastChange({ type: 'novel_update', data: novel });
  };

  const deleteNovel = (id: number) => {
    const novel = state.novels.find(n => n.id === id);
    dispatch({ type: 'DELETE_NOVEL', payload: id });
    addNotification({
      type: 'warning',
      title: 'Novela eliminada',
      message: `Se eliminó la novela "${novel?.titulo || 'Desconocida'}" y se sincronizó automáticamente`,
      section: 'Gestión de Novelas',
      action: 'delete'
    });
    broadcastChange({ type: 'novel_delete', data: { id } });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    addNotification({
      type: 'info',
      title: 'Notificaciones limpiadas',
      message: 'Se han eliminado todas las notificaciones del sistema',
      section: 'Notificaciones',
      action: 'clear'
    });
  };

  const exportSystemConfig = (): string => {
    try {
      addNotification({
        type: 'info',
        title: 'Exportación de configuración iniciada',
        message: 'Generando archivo de configuración JSON...',
        section: 'Sistema',
        action: 'export_config_start'
      });

      // Create comprehensive system configuration
      const completeConfig: SystemConfig = {
        ...state.systemConfig,
        version: '2.1.0',
        lastExport: new Date().toISOString(),
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
        metadata: {
          ...state.systemConfig.metadata,
          totalOrders: state.systemConfig.metadata.totalOrders,
          totalRevenue: state.systemConfig.metadata.totalRevenue,
          lastOrderDate: state.systemConfig.metadata.lastOrderDate,
          systemUptime: state.systemConfig.metadata.systemUptime,
        },
      };

      // Generate JSON file
      const configJson = JSON.stringify(completeConfig, null, 2);

      // Update system config with export timestamp
      dispatch({ 
        type: 'UPDATE_SYSTEM_CONFIG', 
        payload: { lastExport: new Date().toISOString() } 
      });

      addNotification({
        type: 'success',
        title: 'Configuración exportada',
        message: 'La configuración JSON se ha exportado correctamente',
        section: 'Sistema',
        action: 'export_config'
      });

      return configJson;
    } catch (error) {
      console.error('Error exporting system config:', error);
      addNotification({
        type: 'error',
        title: 'Error en la exportación de configuración',
        message: 'No se pudo exportar la configuración JSON',
        section: 'Sistema',
        action: 'export_config_error'
      });
      return '';
    }
  };

  const exportCompleteSourceCode = async () => {
    try {
      addNotification({
        type: 'info',
        title: 'Exportación de código fuente iniciada',
        message: 'Generando sistema completo con código fuente...',
        section: 'Sistema',
        action: 'export_source_start'
      });

      // Importar dinámicamente el generador de código fuente
      try {
        const { generateCompleteSourceCode } = await import('../utils/sourceCodeGenerator');
        await generateCompleteSourceCode(state.systemConfig);
      } catch (importError) {
        console.error('Error importing source code generator:', importError);
        throw new Error('No se pudo cargar el generador de código fuente');
      }

      addNotification({
        type: 'success',
        title: 'Código fuente exportado',
        message: 'El sistema completo se ha exportado como código fuente',
        section: 'Sistema',
        action: 'export_source'
      });
    } catch (error) {
      console.error('Error exporting source code:', error);
      addNotification({
        type: 'error',
        title: 'Error en la exportación de código',
        message: error instanceof Error ? error.message : 'No se pudo exportar el código fuente completo',
        section: 'Sistema',
        action: 'export_source_error'
      });
      throw error;
    }
  };

  const importSystemConfig = (configJson: string): boolean => {
    try {
      const config = JSON.parse(configJson);
      dispatch({ type: 'LOAD_SYSTEM_CONFIG', payload: config });
      addNotification({
        type: 'success',
        title: 'Configuración importada',
        message: 'La configuración del sistema se ha cargado correctamente',
        section: 'Sistema',
        action: 'import'
      });
      return true;
    } catch (error) {
      console.error('Error importing system config:', error);
      addNotification({
        type: 'error',
        title: 'Error en la importación',
        message: 'No se pudo cargar la configuración del sistema',
        section: 'Sistema',
        action: 'import_error'
      });
      return false;
    }
  };

  const syncAllSections = async (): Promise<void> => {
    try {
      addNotification({
        type: 'info',
        title: 'Sincronización completa iniciada',
        message: 'Sincronizando todas las secciones del sistema...',
        section: 'Sistema',
        action: 'sync_all_start'
      });

      // Simulate comprehensive sync of all sections
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update all components with current state
      const updatedConfig: SystemConfig = {
        ...state.systemConfig,
        lastExport: new Date().toISOString(),
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
      };

      dispatch({ type: 'UPDATE_SYSTEM_CONFIG', payload: updatedConfig });
      
      // Broadcast changes to all components
      window.dispatchEvent(new CustomEvent('admin_full_sync', { 
        detail: { 
          config: updatedConfig,
          timestamp: new Date().toISOString()
        } 
      }));

      addNotification({
        type: 'success',
        title: 'Sincronización completa exitosa',
        message: 'Todas las secciones se han sincronizado correctamente',
        section: 'Sistema',
        action: 'sync_all'
      });
    } catch (error) {
      console.error('Error in full sync:', error);
      addNotification({
        type: 'error',
        title: 'Error en sincronización completa',
        message: 'No se pudo completar la sincronización de todas las secciones',
        section: 'Sistema',
        action: 'sync_all_error'
      });
    }
  };

  const broadcastChange = (change: any) => {
    const changeEvent = {
      ...change,
      timestamp: new Date().toISOString(),
      source: 'admin_panel'
    };
    
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { 
        lastSync: new Date().toISOString(),
        pendingChanges: Math.max(0, state.syncStatus.pendingChanges - 1)
      } 
    });

    window.dispatchEvent(new CustomEvent('admin_state_change', { 
      detail: changeEvent 
    }));
  };

  const syncWithRemote = async (): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: true } });
      
      addNotification({
        type: 'info',
        title: 'Sincronización iniciada',
        message: 'Iniciando sincronización con el sistema remoto...',
        section: 'Sistema',
        action: 'sync_start'
      });

      // Simulate remote sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch({ 
        type: 'UPDATE_SYNC_STATUS', 
        payload: { 
          lastSync: new Date().toISOString(),
          pendingChanges: 0
        } 
      });
      
      addNotification({
        type: 'success',
        title: 'Sincronización completada',
        message: 'Todos los datos se han sincronizado correctamente',
        section: 'Sistema',
        action: 'sync'
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: false } });
      addNotification({
        type: 'error',
        title: 'Error de sincronización',
        message: 'No se pudo sincronizar con el servidor remoto',
        section: 'Sistema',
        action: 'sync_error'
      });
    }
  };

  const getAvailableCountries = (): string[] => {
    const countries = new Set<string>();
    
    // Add countries from novels
    state.novels.forEach(novel => {
      if (novel.pais) {
        countries.add(novel.pais);
      }
    });
    
    // Add common countries
    const commonCountries = [
      'Cuba',
      'Turquía',
      'México',
      'Brasil',
      'Colombia',
      'Argentina',
      'España',
      'Estados Unidos',
      'Corea del Sur',
      'India',
      'Reino Unido',
      'Francia',
      'Italia',
      'Alemania',
      'Japón',
      'China',
      'Rusia'
    ];
    
    commonCountries.forEach(country => countries.add(country));
    
    return Array.from(countries).sort();
  };

  const updateSystemConfig = (config: Partial<SystemConfig>) => {
    dispatch({ type: 'UPDATE_SYSTEM_CONFIG', payload: config });
  };

  return (
    <AdminContext.Provider
      value={{
        state,
        login,
        logout,
        updatePrices,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        addNovel,
        updateNovel,
        deleteNovel,
        addNotification,
        markNotificationRead,
        clearNotifications,
        exportSystemConfig,
        importSystemConfig,
        exportCompleteSourceCode,
        syncWithRemote,
        broadcastChange,
        syncAllSections,
        getAvailableCountries,
        updateSystemConfig,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export { AdminContext };