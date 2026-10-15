/**
 * Dérivées web des photos d'articles.
 *
 * ⚠️ L'EXPORT STATIQUE SERT LES FICHIERS TELS QUELS. `output: 'export'` désactive
 * l'optimiseur d'images de Next (`images.unoptimized`) : ce que l'on importe est
 * exactement ce que le visiteur télécharge. Les sources de `images/` pèsent entre
 * 750 Ko et 1,4 Mo pièce, soit 3,4 Mo pour trois vignettes de 800 px de large.
 * Ce script fabrique les seules images que le site a le droit d'importer.
 *
 * Entrée  : images/<nom>.jpg               (pleine résolution, versionnée, jamais importée)
 * Sorties : assets/photos/<nom>.jpg        (800x450, qualité 78 : vignettes d'articles)
 *           assets/photos/<nom>-1600.jpg   (1600x900, qualité 76 : héros et bandeaux)
 *
 * Usage : npm run images
 */
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'images';
const CIBLE = 'assets/photos';
/* Deux tailles : la vignette (16:9 en 800) et le bandeau (16:9 en 1600). Un héros en 1440 de
   large servi en 800 serait flou ; une vignette servie en 1600 pèserait quatre fois trop. */
const TAILLES = [
  { suffixe: '', largeur: 800, hauteur: 450, qualite: 78 },
  { suffixe: '-1600', largeur: 1600, hauteur: 900, qualite: 76 },
];

await mkdir(CIBLE, { recursive: true });

const fichiers = (await readdir(SOURCE)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const fichier of fichiers) {
  for (const t of TAILLES) {
    const nom = `${basename(fichier, extname(fichier))}${t.suffixe}.jpg`;
    const sortie = join(CIBLE, nom);
    // `fit: cover` recadre au centre : les sources ne sont pas en 16:9 et un
    // redimensionnement sans recadrage les écraserait.
    const info = await sharp(join(SOURCE, fichier))
      .resize(t.largeur, t.hauteur, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: t.qualite, mozjpeg: true })
      .toFile(sortie);
    console.log(`${fichier} → ${sortie}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
  }
}
