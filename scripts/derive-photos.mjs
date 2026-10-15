/**
 * Dérivées web des photos de bandeau.
 *
 * ⚠️ L'EXPORT STATIQUE SERT LES FICHIERS TELS QUELS. `output: 'export'` désactive
 * l'optimiseur d'images de Next (`images.unoptimized`) : ce que l'on importe est
 * exactement ce que le visiteur télécharge. Les sources de `images/` pèsent entre
 * 750 Ko et 1,4 Mo pièce. Ce script fabrique les seules images que le site a le droit
 * d'importer.
 *
 * UNE SEULE VERSION PAR PHOTO, EN WEBP, sur le modèle de Salons en France
 * (`scripts/photos/preparer-photos.py`, réglé par Alek à l'œil) : les photos accompagnent,
 * le visiteur ne vient pas pour elles, et elles sont sous un voile forêt. 1400 px de large en
 * 16:9, qualité 70 : Alek voyait la différence à 40 sur certaines pages (15/10/2026), 70 reste
 * bien en dessous des 77 à 194 Ko du JPEG 1600 q76 d'avant. Le navigateur étire ou réduit, et
 * `object-fit: cover` finit la coupe ; sous 900px le bandeau est recadré dans la même image.
 *
 * Entrée  : images/<nom>.jpg            (pleine résolution, versionnée, jamais importée)
 * Sortie  : assets/photos/<nom>.webp    (1400×788)
 *
 * Usage : npm run images
 */
import { readdir, mkdir, readdir as lire, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'images';
const CIBLE = 'assets/photos';
const LARGEUR = 1400;
const HAUTEUR = Math.round((LARGEUR * 9) / 16);
const QUALITE = 70;

await mkdir(CIBLE, { recursive: true });

const fichiers = (await readdir(SOURCE)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const produits = new Set();

for (const fichier of fichiers) {
  const nom = `${basename(fichier, extname(fichier))}.webp`;
  const sortie = join(CIBLE, nom);
  produits.add(nom);
  // `fit: cover` recadre au centre : les sources ne sont pas en 16:9 et un
  // redimensionnement sans recadrage les écraserait.
  const info = await sharp(join(SOURCE, fichier))
    .resize(LARGEUR, HAUTEUR, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITE, effort: 6 })
    .toFile(sortie);
  console.log(`${fichier} → ${sortie}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
}

// Les dérivées d'une photo retirée des sources partent avec elle : rien d'orphelin importable.
for (const f of await lire(CIBLE)) {
  if (/\.(webp|jpe?g)$/i.test(f) && !produits.has(f)) {
    await unlink(join(CIBLE, f));
    console.log(`${f} supprimé (plus de source)`);
  }
}
