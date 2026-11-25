import { KropsHero } from "./KropsHero";
import { KropsHow } from "./KropsHow";
import { KropsTech } from "./KropsTech";
import { KropsTeam } from "./KropsTeam";
import { KropsBuiltFor } from "./KropsBuiltFor";
import { KropsNextPlan } from "./KropsNextPlan";
import { KropsCloser } from "./KropsCloser";
import { KropsContactModal } from "./KropsContactModal";
import { MobileMenu } from "./base/MobileMenu";
import { Nav } from "./base/Nav";
import { Preloader } from "./base/Preloader";
import { ScrollProgress } from "./base/ScrollProgress";
import { SvgFilters } from "./base/SvgFilters";

export function KropsPage() {
  return (
    <>
      <SvgFilters />
      <div className="min-h-screen bg-bg text-text">
        <Preloader />
        {" "}
        <Nav />
        {" "}
        <MobileMenu />
        {" "}
        <ScrollProgress />
        {" "}
        <main data-meno-label="Main" className="min-h-screen bg-bg text-text">
          <KropsHero />
          {" "}
          <KropsHow />
          {" "}
          <KropsTech />
          {" "}
          <KropsBuiltFor />
          {" "}
          <KropsNextPlan />
          {" "}
          <KropsTeam />
          {" "}
          <KropsCloser />
        </main>
        {" "}
        <KropsContactModal />
      </div>
    </>
  );
}
