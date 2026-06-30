// "AVIS_DATA" reprend la structure visible sur l'ancien portail :
// chaque carte a une catégorie, une date/heure de publication, un titre,
// et optionnellement une indication "mis à jour il y a X mois".

export const AVIS_CATEGORY_LABELS = {
  communiques: {
    fr: "Communiqués",
    ar: "بلاغات",
    en: "Announcements"
  },
  admission: {
    fr: "Admission",
    ar: "القبول",
    en: "Admission"
  },
  stagiaires: {
    fr: "Stagiaires",
    ar: "المتدربون",
    en: "Trainees"
  },
  calendrier: {
    fr: "Calendrier",
    ar: "الجدولة",
    en: "Calendar"
  },
  examens: {
    fr: "Examens",
    ar: "الامتحانات",
    en: "Examinations"
  }
};

export const AVIS_DATA = [
  {
    id: "ouverture-inscriptions-session-2026",
    categoryKey: "communiques",
    date: { fr: "12 Janv. 2026 | 09:00", ar: "12 يناير 2026 | 09:00", en: "Jan 12, 2026 | 9:00 AM" },
    fr: { title: "Ouverture des inscriptions – Session 2026", text: "Les inscriptions pour la session de formation 2026 sont désormais ouvertes. Les candidats sont invités à déposer leur dossier dans les délais impartis auprès du bureau des affaires estudiantines." },
    ar: { title: "فتح باب التسجيل – الدورة 2026", text: "فُتح باب التسجيل برسم دورة التكوين 2026. يُدعى المترشحون إلى إيداع ملفاتهم داخل الآجال المحددة لدى مكتب الشؤون الطلابية." },
    en: { title: "Registration Open – 2026 Session", text: "Registration for the 2026 training session is now open. Candidates are invited to submit their application within the specified deadlines at the student affairs office." },
  },
  {
    id: "avis-concours-acces-niveau-qualification",
    categoryKey: "admission",
    date: { fr: "20 Janv. 2026 | 10:30", ar: "20 يناير 2026 | 10:30", en: "Jan 20, 2026 | 10:30 AM" },
    fr: { title: "Avis de concours d'accès au niveau Qualification", text: "Un concours d'accès au Niveau Qualification (filières Pêche et Machine) sera organisé. Les conditions d'éligibilité et les pièces à fournir sont consultables dans le dossier de candidature." },
    ar: { title: "إعلان عن مباراة الولوج إلى مستوى التأهيل", text: "سيتم تنظيم مباراة للولوج إلى مستوى التأهيل (شعبتا الصيد والميكانيك). شروط الترشيح والوثائق المطلوبة متوفرة ضمن ملف الترشيح." },
    en: { title: "Notice of Competitive Exam – Qualification Level Access", text: "A competitive exam for access to the Qualification Level (Fishery and Engine programs) will be organized. Eligibility conditions and required documents are available in the application file." },
  },
  {
    id: "liste-candidats-convoques-concours",
    categoryKey: "admission",
    date: { fr: "05 Févr. 2026 | 11:15", ar: "05 فبراير 2026 | 11:15", en: "Feb 5, 2026 | 11:15 AM" },
    fr: { title: "Liste des candidats convoqués au concours", text: "La liste des candidats convoqués aux épreuves écrites du concours d'accès est publiée. Les candidats concernés sont priés de se présenter munis de leur carte nationale d'identité et de leur convocation." },
    ar: { title: "لائحة المترشحين المستدعين لإجراء المباراة", text: "تم نشر لائحة المترشحين المستدعين لإجراء الاختبارات الكتابية لمباراة الولوج. يُدعى المترشحون المعنيون للحضور مرفوقين ببطاقتهم الوطنية واستدعائهم." },
    en: { title: "List of Candidates Called for the Competitive Exam", text: "The list of candidates called for the written tests of the entrance exam has been published. Concerned candidates must attend with their national ID card and convocation letter." },
  },
  {
    id: "convocation-entretien-selection",
    categoryKey: "admission",
    date: { fr: "18 Févr. 2026 | 09:00", ar: "18 فبراير 2026 | 09:00", en: "Feb 18, 2026 | 9:00 AM" },
    fr: { title: "Convocation pour entretien de sélection", text: "Les candidats ayant réussi les épreuves écrites sont convoqués pour un entretien oral de sélection. Le calendrier des passages par filière est disponible auprès de l'administration." },
    ar: { title: "استدعاء لإجراء مقابلة الاختيار", text: "يُستدعى المترشحون الناجحون في الاختبارات الكتابية لإجراء مقابلة شفوية للاختيار. جدولة المرور حسب الشعبة متوفرة لدى الإدارة." },
    en: { title: "Convocation for Selection Interview", text: "Candidates who passed the written tests are called for an oral selection interview. The schedule by track is available from the administration." },
  },
  {
    id: "resultats-admission-liste-principale",
    categoryKey: "admission",
    date: { fr: "10 Mars 2026 | 14:00", ar: "10 مارس 2026 | 14:00", en: "Mar 10, 2026 | 2:00 PM" },
    fr: { title: "Résultats d'admission – Liste principale", text: "La liste principale des candidats définitivement admis au titre de la session 2026 est désormais publiée. Les modalités de confirmation d'inscription sont précisées dans l'avis joint." },
    ar: { title: "نتائج القبول – اللائحة الرئيسية", text: "تم نشر اللائحة الرئيسية للمترشحين المقبولين نهائيا برسم دورة 2026. كيفيات تأكيد التسجيل محددة في الإعلان المرفق." },
    en: { title: "Admission Results – Main List", text: "The main list of candidates definitively admitted for the 2026 session has now been published. Registration confirmation procedures are detailed in the attached notice." },
  },
  {
    id: "publication-liste-attente",
    categoryKey: "admission",
    date: { fr: "12 Mars 2026 | 16:20", ar: "12 مارس 2026 | 16:20", en: "Mar 12, 2026 | 4:20 PM" },
    updated: { fr: "maj il y a 2 mois", ar: "آخر تحديث منذ شهرين", en: "updated 2 months ago" },
    fr: { title: "Publication de la liste d'attente", text: "La liste d'attente est publiée et sera actualisée au fur et à mesure des désistements. Les candidats inscrits sur cette liste seront contactés directement par l'administration." },
    ar: { title: "نشر لائحة الانتظار", text: "تم نشر لائحة الانتظار، وسيتم تحديثها تدريجيا حسب حالات التراجع عن التسجيل. سيتم التواصل مباشرة مع المترشحين المسجلين في هذه اللائحة." },
    en: { title: "Publication of the Waiting List", text: "The waiting list has been published and will be updated progressively as withdrawals occur. Candidates on this list will be contacted directly by the administration." },
  },
  {
    id: "avis-reinscription",
    categoryKey: "communiques",
    date: { fr: "25 Mars 2026 | 09:45", ar: "25 مارس 2026 | 09:45", en: "Mar 25, 2026 | 9:45 AM" },
    fr: { title: "Avis de réinscription", text: "Les stagiaires en cours de formation sont invités à procéder à leur réinscription pour l'année en cours selon le calendrier et les pièces exigées, disponibles auprès du service de scolarité." },
    ar: { title: "إعلان بخصوص إعادة التسجيل", text: "يُدعى المتدربون الجاري تكوينهم إلى القيام بإعادة تسجيلهم برسم السنة الجارية وفق الجدولة والوثائق المطلوبة المتوفرة لدى مصلحة الشؤون التربوية." },
    en: { title: "Notice of Re-registration", text: "Trainees currently in training are invited to complete their re-registration for the current year according to the schedule and required documents, available from the academic affairs office." },
  },
  {
    id: "avis-stagiaires-depot-dossier-administratif",
    categoryKey: "stagiaires",
    date: { fr: "08 Avril 2026 | 10:00", ar: "08 أبريل 2026 | 10:00", en: "Apr 8, 2026 | 10:00 AM" },
    fr: { title: "Avis aux stagiaires – Dépôt du dossier administratif", text: "Les stagiaires nouvellement admis doivent déposer leur dossier administratif complet auprès du bureau des affaires estudiantines avant la date limite indiquée." },
    ar: { title: "إعلان لفائدة المتدربين – إيداع الملف الإداري", text: "يتعين على المتدربين الجدد المقبولين إيداع ملفهم الإداري كاملا لدى مكتب الشؤون الطلابية قبل التاريخ المحدد." },
    en: { title: "Notice to Trainees – Submission of Administrative File", text: "Newly admitted trainees must submit their complete administrative file to the student affairs office before the specified deadline." },
  },
  {
    id: "calendrier-rentree-2026-2027",
    categoryKey: "calendrier",
    date: { fr: "20 Avril 2026 | 12:00", ar: "20 أبريل 2026 | 12:00", en: "Apr 20, 2026 | 12:00 PM" },
    fr: { title: "Calendrier de rentrée – Année de formation 2026–2027", text: "Le calendrier officiel de la rentrée pour l'année de formation 2026–2027 est publié, incluant les dates de reprise des cours par filière et par niveau." },
    ar: { title: "جدولة الدخول الدراسي – السنة التكوينية 2026–2027", text: "تم نشر الجدولة الرسمية للدخول الدراسي بالنسبة للسنة التكوينية 2026–2027، متضمنة تواريخ استئناف الدروس حسب الشعبة والمستوى." },
    en: { title: "Back-to-School Calendar – 2026–2027 Training Year", text: "The official calendar for the 2026–2027 training year start has been published, including class resumption dates by program and level." },
  },
  {
    id: "repartition-stagiaires-stages-pratiques",
    categoryKey: "stagiaires",
    date: { fr: "05 Mai 2026 | 13:30", ar: "05 ماي 2026 | 13:30", en: "May 5, 2026 | 1:30 PM" },
    fr: { title: "Répartition des stagiaires aux stages pratiques", text: "La répartition des stagiaires sur les différents sites de stages pratiques est désormais disponible. Chaque stagiaire est invité à consulter son affectation auprès de son encadrant pédagogique." },
    ar: { title: "توزيع المتدربين على فترات التدريب التطبيقي", text: "تم نشر توزيع المتدربين على مختلف مواقع التدريب التطبيقي. يُدعى كل متدرب للاستفسار عن مكان تعيينه لدى مؤطره البيداغوجي." },
    en: { title: "Trainee Allocation for Practical Internships", text: "The allocation of trainees across the various practical internship sites is now available. Each trainee is invited to check their placement with their academic supervisor." },
  },
  {
    id: "calendrier-officiel-examens",
    categoryKey: "calendrier",
    date: { fr: "02 Juin 2026 | 09:30", ar: "02 يونيو 2026 | 09:30", en: "Jun 2, 2026 | 9:30 AM" },
    fr: { title: "Calendrier officiel des examens", text: "Le calendrier officiel des examens de la session normale est publié : dates, horaires, salles et matières concernées pour chaque filière et niveau." },
    ar: { title: "الجدولة الرسمية للامتحانات", text: "تم نشر الجدولة الرسمية لامتحانات الدورة العادية: التواريخ والتوقيت والقاعات والمواد المعنية بالنسبة لكل شعبة ومستوى." },
    en: { title: "Official Examination Schedule", text: "The official examination schedule for the normal session has been published: dates, times, rooms and subjects concerned for each program and level." },
  },
  {
    id: "resultats-examens-session-normale",
    categoryKey: "examens",
    date: { fr: "24 Juin 2026 | 15:00", ar: "24 يونيو 2026 | 15:00", en: "Jun 24, 2026 | 3:00 PM" },
    fr: { title: "Résultats des examens – Session normale", text: "Les résultats des examens de la session normale sont désormais consultables par filière et par niveau auprès du panneau d'affichage et en ligne." },
    ar: { title: "نتائج الامتحانات – الدورة العادية", text: "أصبحت نتائج امتحانات الدورة العادية متوفرة حسب الشعبة والمستوى على لوحة الإعلانات وعبر الموقع الإلكتروني." },
    en: { title: "Examination Results – Normal Session", text: "The results of the normal session exams are now available by program and level on the notice board and online." },
  },
];


export function mergeCmsAvis(staticAvis, cmsAvis = []) {
  if (!cmsAvis.length) return staticAvis;

  const cmsMapped = cmsAvis.map((item) => ({
    id: item.slug || `cms-${item.id}`,
    categoryKey: item.category,
    photos: item.photos || [],
    pdf: item.pdf || null,
    date: {
      fr: item.date?.fr || item.fr?.date || "",
      ar: item.date?.ar || item.ar?.date || "",
      en: item.date?.en || item.en?.date || "",
    },
    updated: {
      fr: item.updated?.fr || item.fr?.updated || "",
      ar: item.updated?.ar || item.ar?.updated || "",
      en: item.updated?.en || item.en?.updated || "",
    },
    fr: { title: item.fr?.title || "", text: item.fr?.text || "" },
    ar: { title: item.ar?.title || "", text: item.ar?.text || "" },
    en: { title: item.en?.title || "", text: item.en?.text || "" },
  }));

  const cmsIds = new Set(cmsMapped.map((a) => a.id));
  return [...cmsMapped, ...staticAvis.filter((a) => !cmsIds.has(a.id))];
}

export function getAllAvis(cmsAvis = []) {
  return mergeCmsAvis(AVIS_DATA, cmsAvis);
}