import Scene1 from '../composants/scene1'; // OK comme ça
import TexteDefilant from '../composants/TexteDefilant'; // OK comme ça
import Projets from '../composants/projets'; // OK comme ça<<<<<<<
import Contact from '../app/contact/page' // OK comme ça<<<<<<<
import Experieces from '../composants/experiences' // OK comme ça<<<<<<<

export default function Home() {
  return (
    <main className="relative">
      
      <TexteDefilant />
      <Scene1 />
      <div id="projets-section">
      <Experieces />
      <Contact />
      <Projets />
</div>
    </main>
  );
}