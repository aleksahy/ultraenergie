import Hero from '@/components/Hero';
import Profils from '@/components/Profils';
import Etapes from '@/components/Etapes';
import Travaux from '@/components/Travaux';
import Comparatif from '@/components/Comparatif';
import Partenaires from '@/components/Partenaires';
import Ressources from '@/components/Ressources';
import Faq from '@/components/Faq';
import AppelFinal from '@/components/AppelFinal';

export default function Accueil() {
  return (
    <main>
      <Hero />
      <Profils />
      <Etapes />
      <Travaux />
      <Comparatif />
      <Partenaires />
      <Ressources />
      <Faq />
      <AppelFinal />
    </main>
  );
}
