import PageHero from "./PageHero.jsx";

const ADMISSION_DOCS = {
  trainers: {
    fr: {
      eyebrow: "Formation / Admission / Effectifs formateurs",
      title: "Effectifs des formateurs 2025-2026",
      intro: "L'excellence pédagogique au service de l'ambition maritime. Découvrez le corps professoral qui accompagne les candidats et stagiaires du CQPM Nador.",
      fileName: "Corps_Professoral_CQPM_Nador_2025.pdf",
      fileMeta: "PDF - 2.4 MB - Mis à jour le 15/01/2025",
      documentTitle: "Liste Officielle des Formateurs",
      documentText: "Consultez le document officiel détaillant les qualifications, l'expertise et le parcours académique du corps professoral pour l'année 2025-2026.",
      back: "Retour au dashboard admission",
      view: "Visualiser",
      download: "Télécharger PDF",
      print: "Imprimer",
      preview: "Aperçu PDF",
      infoCards: [
        { icon: "groups", title: "Encadrement", text: "Formateurs qualifiés pour les filières pêche, machine et sécurité maritime." },
        { icon: "workspace_premium", title: "Expertise", text: "Profils pédagogiques et professionnels alignés sur les besoins du secteur." },
        { icon: "support_agent", title: "Contact", text: "Contactez notre bureau des admissions au +212 536 60 87 27." },
      ],
    },
    ar: {
      eyebrow: "التكوين / القبول / أعداد المكونين",
      title: "أعداد المكونين 2025-2026",
      intro: "التميز البيداغوجي في خدمة الطموح البحري. اكتشفوا الهيئة التدريسية التي ترافق المترشحين والمتدربين في المركز.",
      fileName: "Corps_Professoral_CQPM_Nador_2025.pdf",
      fileMeta: "PDF - 2.4 ميغابايت - آخر تحديث 15/01/2025",
      documentTitle: "اللائحة الرسمية للمكونين",
      documentText: "اطلعوا على الوثيقة الرسمية التي تفصل مؤهلات وخبرات ومسار الهيئة التدريسية لسنة 2025-2026.",
      back: "العودة إلى فضاء القبول",
      view: "عرض",
      download: "تحميل PDF",
      print: "طباعة",
      preview: "معاينة PDF",
      infoCards: [
        { icon: "groups", title: "التأطير", text: "مكونون مؤهلون لشعب الصيد والميكانيك والسلامة البحرية." },
        { icon: "workspace_premium", title: "الخبرة", text: "ملفات بيداغوجية ومهنية متوافقة مع احتياجات القطاع." },
        { icon: "support_agent", title: "الاتصال", text: "اتصلوا بمكتب القبول على +212 536 60 87 27." },
      ],
    },
    en: {
      eyebrow: "Training / Admission / Trainer headcounts",
      title: "Trainer headcounts 2025-2026",
      intro: "Pedagogical excellence serving maritime ambition. Discover the teaching staff supporting CQPM Nador candidates and trainees.",
      fileName: "Corps_Professoral_CQPM_Nador_2025.pdf",
      fileMeta: "PDF - 2.4 MB - Updated Jan 15, 2025",
      documentTitle: "Official Trainer List",
      documentText: "View the official document detailing qualifications, expertise and academic background of the teaching staff for 2025-2026.",
      back: "Back to admission hub",
      view: "View",
      download: "Download PDF",
      print: "Print",
      preview: "PDF preview",
      infoCards: [
        { icon: "groups", title: "Supervision", text: "Qualified trainers for fishery, engine and maritime safety programs." },
        { icon: "workspace_premium", title: "Expertise", text: "Teaching and professional profiles aligned with sector needs." },
        { icon: "support_agent", title: "Contact", text: "Contact our admissions office at +212 536 60 87 27." },
      ],
    },
    heroImage: "https://i.pinimg.com/originals/09/a3/3a/09a33a7643b42c46ece4ae03fd539404.gif",
  },
  convocations: {
    fr: {
      eyebrow: "Formation / Admission / Convocations",
      title: "Liste de Convocations 2025-2026",
      intro: "Retrouvez la liste officielle des candidats convoqués aux examens d'admission et les consignes de présence.",
      fileName: "Liste_Convocations_2025_2026.pdf",
      fileMeta: "PDF - Document inséré par l'administration",
      documentTitle: "Liste officielle de convocations",
      documentText: "Les candidats doivent se présenter 30 minutes avant l'heure indiquée munis de leur CIN originale et de la convocation imprimée.",
      notice: "Les candidats doivent se présenter 30 minutes avant l'heure indiquée munis de leur CIN originale.",
      back: "Retour au dashboard admission",
      view: "Visualiser",
      download: "Télécharger PDF",
      print: "Imprimer",
      preview: "Aperçu PDF",
      infoCards: [
        { icon: "location_on", title: "Lieu du Concours", text: "Centre de Qualification Professionnelle Maritime, Nador." },
        { icon: "description", title: "Pièces à Fournir", text: "CIN originale, convocation imprimée et matériel d'écriture complet." },
        { icon: "support_agent", title: "Assistance", text: "Contactez notre bureau des admissions au +212 536 60 87 27." },
      ],
    },
    ar: {
      eyebrow: "التكوين / القبول / الاستدعاءات",
      title: "لائحة الاستدعاءات 2025-2026",
      intro: "اعثروا على اللائحة الرسمية للمترشحين المستدعين لامتحانات القبول وتعليمات الحضور.",
      fileName: "Liste_Convocations_2025_2026.pdf",
      fileMeta: "PDF - وثيقة مرفوعة من الإدارة",
      documentTitle: "اللائحة الرسمية للاستدعاءات",
      documentText: "يجب على المترشحين الحضور قبل 30 دقيقة من الموعد المحدد حاملين البطاقة الوطنية الأصلية والاستدعاء المطبوع.",
      notice: "يجب على المترشحين الحضور قبل 30 دقيقة من الموعد المحدد حاملين البطاقة الوطنية الأصلية.",
      back: "العودة إلى فضاء القبول",
      view: "عرض",
      download: "تحميل PDF",
      print: "طباعة",
      preview: "معاينة PDF",
      infoCards: [
        { icon: "location_on", title: "مكان المباراة", text: "مركز التأهيل المهني البحري، الناظور." },
        { icon: "description", title: "الوثائق المطلوبة", text: "البطاقة الوطنية الأصلية والاستدعاء المطبوع ولوازم الكتابة الكاملة." },
        { icon: "support_agent", title: "المساعدة", text: "اتصلوا بمكتب القبول على +212 536 60 87 27." },
      ],
    },
    en: {
      eyebrow: "Training / Admission / Convocations",
      title: "Convocation List 2025-2026",
      intro: "Find the official list of candidates called for admission exams and attendance instructions.",
      fileName: "Liste_Convocations_2025_2026.pdf",
      fileMeta: "PDF - Document uploaded by administration",
      documentTitle: "Official convocation list",
      documentText: "Candidates must arrive 30 minutes before the indicated time with their original ID card and printed convocation.",
      notice: "Candidates must arrive 30 minutes before the indicated time with their original ID card.",
      back: "Back to admission hub",
      view: "View",
      download: "Download PDF",
      print: "Print",
      preview: "PDF preview",
      infoCards: [
        { icon: "location_on", title: "Exam location", text: "Maritime Professional Qualification Center, Nador." },
        { icon: "description", title: "Required documents", text: "Original ID card, printed convocation and complete writing materials." },
        { icon: "support_agent", title: "Assistance", text: "Contact our admissions office at +212 536 60 87 27." },
      ],
    },
    heroImage:"https://i.pinimg.com/originals/09/a3/3a/09a33a7643b42c46ece4ae03fd539404.gif",
  },
  admitted: {
    fr: {
      eyebrow: "Formation / Admission / Liste des admis",
      title: "Liste des Admis Concours 2026",
      intro: "Félicitations aux nouveaux admis du CQPM Nador. Bienvenue à bord de l'excellence maritime.",
      fileName: "Liste_Admis_Definitifs_Concours_2026.pdf",
      fileMeta: "PDF - 2.4 MB - Publié le 24 Juin 2026",
      documentTitle: "Liste Officielle des Admis Définitifs",
      documentText: "Consultez les résultats définitifs du concours 2026 et les modalités administratives d'inscription.",
      back: "Retour au dashboard admission",
      view: "Visualiser",
      download: "Télécharger PDF",
      print: "Imprimer",
      preview: "Aperçu PDF",
      infoCards: [
        { icon: "calendar_today", title: "Prochaines Étapes", text: "Le calendrier d'intégration commence dès la semaine prochaine." },
        { icon: "folder_shared", title: "Dossier d'Inscription", text: "Copie certifiée du Bac, certificat médical et photos d'identité." },
        { icon: "support_agent", title: "Assistance", text: "Contactez notre bureau des admissions au +212 536 60 87 27." },
      ],
    },
    ar: {
      eyebrow: "التكوين / القبول / لائحة المقبولين",
      title: "لائحة المقبولين في المباراة 2026",
      intro: "تهانينا للمقبولين الجدد في المركز. مرحبا بكم على متن التميز البحري.",
      fileName: "Liste_Admis_Definitifs_Concours_2026.pdf",
      fileMeta: "PDF - 2.4 ميغابايت - نشر في 24 يونيو 2026",
      documentTitle: "اللائحة الرسمية للمقبولين النهائيين",
      documentText: "اطلعوا على النتائج النهائية لمباراة 2026 والإجراءات الإدارية للتسجيل.",
      back: "العودة إلى فضاء القبول",
      view: "عرض",
      download: "تحميل PDF",
      print: "طباعة",
      preview: "معاينة PDF",
      infoCards: [
        { icon: "calendar_today", title: "الخطوات القادمة", text: "يبدأ برنامج الاندماج ابتداء من الأسبوع المقبل." },
        { icon: "folder_shared", title: "ملف التسجيل", text: "نسخة مصادق عليها من الباكالوريا وشهادة طبية وصور شخصية." },
        { icon: "support_agent", title: "المساعدة", text: "اتصلوا بمكتب القبول على +212 536 60 87 27." },
      ],
    },
    en: {
      eyebrow: "Training / Admission / Admitted list",
      title: "Admitted List — 2026 Competition",
      intro: "Congratulations to CQPM Nador's new admits. Welcome aboard maritime excellence.",
      fileName: "Liste_Admis_Definitifs_Concours_2026.pdf",
      fileMeta: "PDF - 2.4 MB - Published June 24, 2026",
      documentTitle: "Official Final Admitted List",
      documentText: "View final 2026 competition results and administrative registration procedures.",
      back: "Back to admission hub",
      view: "View",
      download: "Download PDF",
      print: "Print",
      preview: "PDF preview",
      infoCards: [
        { icon: "calendar_today", title: "Next steps", text: "The integration schedule begins next week." },
        { icon: "folder_shared", title: "Registration file", text: "Certified copy of baccalaureate, medical certificate and ID photos." },
        { icon: "support_agent", title: "Assistance", text: "Contact our admissions office at +212 536 60 87 27." },
      ],
    },
    heroImage: "https://i.pinimg.com/originals/09/a3/3a/09a33a7643b42c46ece4ae03fd539404.gif",
  },
  waitlist: {
    fr: {
      eyebrow: "Formation / Admission / Liste d'attente",
      title: "Liste d'Attente Concours 2026",
      intro: "Consultez le classement des candidats en liste d'attente pour le cycle actuel.",
      fileName: "Liste_Attente_Concours_2026.pdf",
      fileMeta: "PDF - 1.2 MB - Direction des Études",
      documentTitle: "Liste Officielle d'Attente",
      documentText: "Les candidats figurant sur cette liste seront contactés par ordre de mérite en cas de désistement dans la liste principale.",
      back: "Retour au dashboard admission",
      view: "Visualiser",
      download: "Télécharger PDF",
      print: "Imprimer",
      preview: "Aperçu PDF",
      infoCards: [
        { icon: "info", title: "Instructions", text: "Restez joignables via le téléphone et l'email fournis lors de l'inscription." },
        { icon: "update", title: "Mises à jour", text: "Une mise à jour hebdomadaire sera effectuée jusqu'à la fermeture des inscriptions." },
        { icon: "support_agent", title: "Assistance", text: "Contactez notre bureau des admissions au +212 536 60 87 27." },
      ],
    },
    ar: {
      eyebrow: "التكوين / القبول / لائحة الانتظار",
      title: "لائحة الانتظار للمباراة 2026",
      intro: "اطلعوا على ترتيب المترشحين في لائحة الانتظار للدورة الحالية.",
      fileName: "Liste_Attente_Concours_2026.pdf",
      fileMeta: "PDF - 1.2 ميغابايت - مديرية الدراسات",
      documentTitle: "اللائحة الرسمية للانتظار",
      documentText: "سيتم الاتصال بالمترشحين المدرجين في هذه اللائحة حسب الترتيب في حالة انسحاب من اللائحة الرئيسية.",
      back: "العودة إلى فضاء القبول",
      view: "عرض",
      download: "تحميل PDF",
      print: "طباعة",
      preview: "معاينة PDF",
      infoCards: [
        { icon: "info", title: "التعليمات", text: "ابقوا متاحين عبر الهاتف والبريد الإلكتروني المقدمين عند التسجيل." },
        { icon: "update", title: "التحديثات", text: "سيتم إجراء تحديث أسبوعي حتى إغلاق التسجيلات." },
        { icon: "support_agent", title: "المساعدة", text: "اتصلوا بمكتب القبول على +212 536 60 87 27." },
      ],
    },
    en: {
      eyebrow: "Training / Admission / Waiting list",
      title: "Waiting List — 2026 Competition",
      intro: "View the ranking of candidates on the waiting list for the current cycle.",
      fileName: "Liste_Attente_Concours_2026.pdf",
      fileMeta: "PDF - 1.2 MB - Academic Affairs",
      documentTitle: "Official Waiting List",
      documentText: "Candidates on this list will be contacted in merit order if spots open on the main list.",
      back: "Back to admission hub",
      view: "View",
      download: "Download PDF",
      print: "Print",
      preview: "PDF preview",
      infoCards: [
        { icon: "info", title: "Instructions", text: "Stay reachable via the phone and email provided during registration." },
        { icon: "update", title: "Updates", text: "A weekly update will be made until registrations close." },
        { icon: "support_agent", title: "Assistance", text: "Contact our admissions office at +212 536 60 87 27." },
      ],
    },
    heroImage:"https://i.pinimg.com/originals/09/a3/3a/09a33a7643b42c46ece4ae03fd539404.gif",
  },
};

const SLUG_BY_TYPE = {
  trainers: "formation/admission/effectifs-formateurs",
  convocations: "formation/admission/convocations",
  admitted: "formation/admission/admis",
  waitlist: "formation/admission/liste-attente",
};

export default function AdmissionDocumentPage({ type = "admitted", navigate, lang = "fr", cmsPages = {} }) {
  const entry = ADMISSION_DOCS[type] || ADMISSION_DOCS.admitted;
  const doc = entry[lang] || entry.fr;
  const slug = SLUG_BY_TYPE[type] || SLUG_BY_TYPE.admitted;
  const locale = cmsPages[slug]?.content?.[lang] || cmsPages[slug]?.content?.fr;
  const pdfUrl = locale?.pdf ? (locale.pdf.startsWith("http") ? locale.pdf : `/storage/${locale.pdf.replace(/^\/+/, "")}`) : null;
  const heroImage = cmsPages[slug]?.hero_image || entry.heroImage;

  return (
    <div className="admission-document-page">
      <PageHero
        eyebrow={locale?.eyebrow || doc.eyebrow}
        title={locale?.title || doc.title}
        intro={locale?.intro || doc.intro}
        image={heroImage}
        navigate={navigate}
      />

      <section className="section admission-document-section">
        <div className="container">
          <button type="button" className="admission-back-link" onClick={() => navigate("formation/admission")}>
            <span className="material-symbols-outlined">arrow_back</span>
            {doc.back}
          </button>

          {doc.notice ? (
            <div className="admission-notice">
              <span className="material-symbols-outlined">info</span>
              <p>{doc.notice}</p>
            </div>
          ) : null}

          <div className="admission-document-card">
            <div className="admission-pdf-preview">
              <span className="material-symbols-outlined admission-pdf-icon">picture_as_pdf</span>
              <span>{doc.preview}</span>
            </div>
            <div className="admission-document-copy">
              <h2>{doc.documentTitle}</h2>
              <p>{doc.documentText}</p>
              <div className="admission-file-row">
                <span className="material-symbols-outlined">description</span>
                <div>
                  <strong>{doc.fileName}</strong>
                  <small>{doc.fileMeta}</small>
                </div>
              </div>
              <div className="admission-actions">
                {pdfUrl ? (
                  <>
                    <a className="btn btn-primary" href={pdfUrl} target="_blank" rel="noreferrer">
                      <span className="material-symbols-outlined">visibility</span>
                      {doc.view}
                    </a>
                    <a className="btn admission-outline-button" href={pdfUrl} download>
                      <span className="material-symbols-outlined">download</span>
                      {doc.download}
                    </a>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-primary">
                      <span className="material-symbols-outlined">visibility</span>
                      {doc.view}
                    </button>
                    <button type="button" className="btn admission-outline-button">
                      <span className="material-symbols-outlined">download</span>
                      {doc.download}
                    </button>
                  </>
                )}
                <button type="button" className="btn admission-outline-button">
                  <span className="material-symbols-outlined">print</span>
                  {doc.print}
                </button>
              </div>
            </div>
          </div>

          <div className="admission-info-grid">
            {doc.infoCards.map((card) => (
              <article key={card.title}>
                <span className="material-symbols-outlined">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
