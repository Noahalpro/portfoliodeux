import Scene1 from '../composants/scene1'; // OK comme ça
import TexteDefilant from '../composants/TexteDefilant'; // OK comme ça

export default function Home() {
  return (
    <main className="relative z-10 text-black">
      <Scene1 />
      <TexteDefilant />
    </main>
  );
}