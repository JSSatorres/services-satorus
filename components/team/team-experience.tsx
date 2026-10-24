"use client";

import { useState } from "react";
import type { MemberId } from "@/lib/team";
import { scrollToProfiles } from "./scroll-to-profiles";
import { TeamHero } from "./team-hero";
import { TeamProfiles } from "./team-profiles";
import { TeamRelay } from "./team-relay";

/** Las polaroids de la portada abren el perfil correspondiente más abajo. */
export function TeamExperience() {
  const [selected, setSelected] = useState<MemberId>("juan");

  function openProfile(id: MemberId) {
    setSelected(id);
    scrollToProfiles();
  }

  return (
    <>
      <TeamHero onOpen={openProfile} />
      <TeamProfiles selected={selected} onSelect={setSelected} />
      <TeamRelay />
    </>
  );
}
