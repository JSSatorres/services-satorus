import { SiteHeader } from "@/components/site-header";
import { BusinessJourney } from "@/components/business-world/business-journey";
import { allProjects } from "@/lib/project-catalog";

export default function Home() {
  const projects = ["goblintrader", "enrolla2", "pidoteca"]
    .flatMap((slug) => allProjects.filter((project) => project.slug === slug))
    .map(
      ({ slug, name, eyebrow, status, challenge, href, image, imageAlt }) => ({
        slug,
        name,
        eyebrow,
        status,
        challenge,
        href,
        image,
        imageAlt,
      }),
    );
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <BusinessJourney projects={projects} />
      </main>
    </>
  );
}
