/**
 * Where a recording or picture of the dictionary admin is played or shown from: the Cloudinary
 * copy when there is one, else the Living Dictionaries media host, else the local file that is
 * waiting to be sent. The rule is in src/utils/mediaRules.js; the addresses in
 * src/config/external.js.
 */
import { CLOUDINARY_BASE, LD_MEDIA_BASE, LD_PENDING_MEDIA_BASE } from '@/config/external'
import { mediaUrlFor } from '@/utils/mediaRules'

/** URL of an `audio` or `photo` item of a record, or null when it has no file anywhere. */
export const ldMediaUrl = (media) =>
  mediaUrlFor(media, {
    cloudinaryBase: CLOUDINARY_BASE,
    ldMediaBase: LD_MEDIA_BASE,
    localBase: LD_PENDING_MEDIA_BASE
  })
