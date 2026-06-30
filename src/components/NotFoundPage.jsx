import PageHero from "./PageHero.jsx";

export default function NotFoundPage({ navigate, text }) {
  const nav = text?.nav || {};

  return (
    <div className="not-found-page">
      <PageHero
        eyebrow={nav.home || "Accueil"}
        title="Page introuvable"
        intro="La page que vous recherchez n'existe pas ou a été déplacée."
        navigate={navigate}
      />
      <section className="section">
        <div className="container" style={{ textAlign: "center", padding: "2rem 0 4rem" }}>
          <button type="button" className="btn btn-primary" onClick={() => navigate("home")}>
            <span className="material-symbols-outlined">home</span>
            Retour à l&apos;accueil
          </button>
        </div>
      </section>
    </div>
  );
}
