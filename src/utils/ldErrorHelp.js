/**
 * Error categories of the Living Dictionaries bridge (docs/LD-ROADMAP.md section 5), explained
 * in Spanish with what to do. Used by the Sincronización page and the entry forms.
 */
export const LD_ERROR_HELP = {
  auth: {
    title: 'Clave no válida',
    help: 'La clave LD_API_KEY de .env.local falta, caducó o no es de este diccionario. Pide una nueva en Living Dictionaries y cámbiala en .env.local.'
  },
  validation: {
    title: 'Datos rechazados',
    help: 'Living Dictionaries no aceptó algún campo (por ejemplo una categoría o un dominio desconocido). Abre la palabra, corrige el campo que dice el mensaje y vuelve a enviar.'
  },
  not_found: {
    title: 'No existe en Living Dictionaries',
    help: 'La palabra o la oración ya no está allí (quizá la borraron). Trae los cambios de LD para ver qué pasó.'
  },
  conflict: {
    title: 'Cambiado en los dos lados',
    help: 'Living Dictionaries tiene otro valor para un campo que enviaste. Trae los cambios de LD y elige en la ficha qué valor queda.'
  },
  duplicate: {
    title: 'Ya existe',
    help: 'Ya hay una entrada igual. Busca la palabra en la tabla antes de crearla otra vez.'
  },
  rate_limited: {
    title: 'Demasiadas peticiones',
    help: 'Living Dictionaries pidió esperar. El envío se detuvo para no molestar: inténtalo de nuevo más tarde.'
  },
  network: {
    title: 'Sin conexión',
    help: 'No se pudo llegar a Living Dictionaries. Revisa la conexión a internet y reintenta los fallidos.'
  },
  server: {
    title: 'Error de Living Dictionaries',
    help: 'Su servidor tuvo un problema. Espera un rato y reintenta los fallidos; si se repite, avísales con su formulario de comentarios.'
  },
  media_too_big: {
    title: 'Archivo demasiado grande',
    help: 'El audio puede tener hasta 25 MB y la imagen hasta 10 MB. Recórtalo o comprímelo.'
  },
  media_format: {
    title: 'Formato no admitido',
    help: 'Usa audio mp3, wav, m4a, ogg o webm, e imágenes jpg, png, gif o webp.'
  },
  speaker_missing: {
    title: 'Hablante desconocido',
    help: 'El hablante del audio no está registrado en el diccionario. Añádelo en Living Dictionaries y trae los cambios.'
  },
  source_missing: {
    title: 'Fuente desconocida',
    help: 'La fuente citada no existe en el diccionario. Créala primero (npm run ld:source).'
  },
  cloudinary: {
    title: 'Error de Cloudinary',
    help: 'No se pudo copiar el audio a Cloudinary. Revisa las claves de Cloudinary en .env.local.'
  },
  unknown: {
    title: 'Error sin clasificar',
    help: 'Lee el mensaje; si no está claro, reintenta y, si se repite, anótalo en docs/REVIEW-LOG.md.'
  }
}

export const errorHelp = (category) => LD_ERROR_HELP[category] || LD_ERROR_HELP.unknown
