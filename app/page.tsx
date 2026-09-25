import { SiteHeader } from "@/components/site-header";
import { MissingPieceHome } from "@/components/missing-piece/missing-piece-home";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <MissingPieceHome />
      </main>
    </>
  );
}
