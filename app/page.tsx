import { SiteHeader } from "@/components/site-header";
import { OfficeTour } from "@/components/business-world/office-tour";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <OfficeTour />
      </main>
    </>
  );
}
