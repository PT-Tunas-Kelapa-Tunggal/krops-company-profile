import { assetUrl } from "@/lib/assets";

export function Preloader() {
  return (
    <div id="krops-preloader" className="preloader" data-state="loading" data-astro-cid-whrugjgn="">
      <div className="preloader__mark" data-astro-cid-whrugjgn="">
        <img className="preloader__logo" src={assetUrl("/assets/logo/krops-lockup-oranye.svg")} alt="Krops" width="153" height="44" fetchPriority="high" decoding="async" data-astro-cid-whrugjgn="" />
      </div>
    </div>
  );
}
