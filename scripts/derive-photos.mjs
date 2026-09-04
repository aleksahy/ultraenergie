/**
 * Dérivées web des photos d'articles.
 *
 * ⚠️ L'EXPORT STATIQUE SERT LES FICHIERS TELS QUELS. `output: 'export'` désactive
 * l'optimiseur d'images de Next (`images.unoptimized`) : ce que l'on importe est
 * exactement ce que le visiteur télécharge. Les sources de `images/` pèsent entre
 * 750 Ko et 1,4 Mo pièce, soit 3,4 Mo pour trois vignettes de 800 px de large.
 * Ce script fabrique les seules images que le site a le droit d'importer.
 *
 * Entrée  : images/<nom>.jpg          (pleine résolution, versionnée, jamais importée)
 * Sortie  : assets/photos/<nom>.jpg   (800x450, qualité 78, importée par les composants)
 *
 * Usage : npm run images
 */
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'images';
const CIBLE = 'assets/photos';
const LARGEUR = 800;
const HAUTEUR = 450;
const QUALITE = 78;

await mkdir(CIBLE, { recursive: true });

const fichiers = (await readdir(SOURCE)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const fichier of fichiers) {
  const nom = `${basename(fichier, extname(fichier))}.jpg`;
  const sortie = join(CIBLE, nom);
  // `fit: cover` recadre au centre : les sources ne sont pas en 16:9 et un
  // redimensionnement sans recadrage les écraserait.
  const info = await sharp(join(SOURCE, fichier))
    .resize(LARGEUR, HAUTEUR, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: QUALITE, mozjpeg: true })
    .toFile(sortie);
  console.log(`${fichier} → ${sortie}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
}
