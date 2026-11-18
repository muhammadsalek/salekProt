import type { Metadata } from "next";
import Link from "next/link";
import { getPublications } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Research & Scientific Contributions",
  description:
    "Epidemiology, biostatistics, clinical research, survey methods and funded population health research by Md Salek Miah.",
};

const researchThemes = [
  {
    number: "01",
    title: "Clinical & Translational Epidemiology",
    description:
      "Clinical outcomes, patient-reported quality of life, prospective cohort design and longitudinal analysis planning.",
  },
  {
    number: "02",
    title: "Maternal, Reproductive & Mental Health",
    description:
      "Healthcare access, pregnancy-related outcomes, depression, anxiety and inequalities across population groups.",
  },
  {
    number: "03",
    title: "Biostatistics & Complex Survey Methods",
    description:
      "Design-aware inference, survey-weighted regression, sampling weights, missing data and predictive validation.",
  },
  {
    number: "04",
    title: "Explainable AI & Health Equity",
    description:
      "Interpretable machine learning, SHAP/LIME, spatial disparities and reproducible population health analysis.",
  },
];

const fundedProjects = [
  {
    title: "Occupational Health & Pesticide Exposure",
    subtitle: "SUST Research Centre · PS/2025/1/31 · Dec 2024–Oct 2026",
    investigator: "PI: Prof. Mohammad Ohid Ullah",
    sample: "399 farmers",
    contribution:
      "Contributed to questionnaire design, fieldwork, logistic regression, machine-learning analyses and SHAP-based interpretation of pesticide exposure and health outcomes.",
  },
  {
    title: "Maternal & Newborn Health in Bangladesh’s Haor Region",
    subtitle: "SUST Research Centre · PS/2024/2/31 · Jul–Dec 2025",
    investigator: "PI: Prof. Md Zakir Hossain",
    sample: "800 women · 40 Union Parishads",
    contribution:
      "Supported sampling, field interviews, data cleaning and quality assurance. Led predictive modelling and SHAP/LIME interpretation for a related published study on pregnancy danger-sign knowledge.",
  },
  {
    title: "Geriatric Quality of Life & Migration",
    subtitle: "SUST Research Centre · PS/2024/2/32 · Jul 2024–Jun 2026",
    investigator: "PI: Prof. Sabina Islam",
    sample: "1,200 older adults · 1,094 in analytic models",
    contribution:
      "Applied PCA, exploratory factor analysis, hierarchical regression, HC3 robust inference and sensitivity analyses; contributed to the university-funded final report.",
  },
];

const currentStudies = [
  {
    status: "Planning stage · Lead Research Assistant",
    title: "Prospective Post-Stroke Disability & Quality-of-Life Cohort",
    description:
      "Supporting protocol development, questionnaire design, recruitment planning and longitudinal-analysis planning in collaboration with clinical researchers. The cohort has not yet been reported as completed.",
  },
  {
    status: "PROSPERO-registered methodological review",
    title: "Best Practices for Machine Learning with Complex Survey Data",
    description:
      "Contributed to methodological work covering survey design, sampling weights, missing data, predictive validation and bias assessment.",
    registry: "CRD420261399081",
  },
];

const methodGroups = [
  {
    heading: "Study Design & Inference",
    items: "Observational epidemiology · Prospective cohort planning · DAG-informed confounder selection · Sensitivity analyses",
  },
  {
    heading: "Statistical Analysis",
    items: "Complex survey-weighted regression · Generalized linear models · Multilevel modelling · PCA/EFA · HC3-robust inference",
  },
  {
    heading: "Prediction & Interpretation",
    items: "Random Forest · XGBoost · SVM · Cross-validation · SHAP/LIME · Model calibration",
  },
  {
    heading: "Reproducibility & Spatial Analysis",
    items: "R · Stata · Python · SQL · Git/GitHub · GIS and spatial health-disparity analysis",
  },
];

// Group publication records by country without exposing inconsistent raw dataset labels.
// The publication database is NOT modified; this is presentation-only normalization.
const standardCountries = [
  "Bangladesh",
  "Burkina Faso",
  "Zambia",
  "Lesotho",
  "Mozambique",
  "Nepal",
];

export default async function ResearchPage() {
  // Keep the existing query integration and preserve access to live publications.
  const publications = await getPublications();

  const observedCountries = standardCountries.filter((country) =>
    publications.some((publication) =>
      (Array.isArray(publication.countries)
        ? publication.countries
        : publication.countries ? [publication.countries] : []).some((raw) =>
        String(raw).toLowerCase().includes(country.toLowerCase()) ||
        (country === "Bangladesh" && /\b(bdhs|haor)\b/i.test(String(raw))) ||
        (country === "Zambia" && /\bzdhs\b/i.test(String(raw))) ||
        (country === "Lesotho" && /\bldhs\b/i.test(String(raw))) ||
        (country === "Mozambique" && /\bmdhs\b/i.test(String(raw))) ||
        (country === "Nepal" && /\bndhs\b/i.test(String(raw)))
      )
    )
  );

  return (
    <main className="pb-20">
      <header className="border-border border-b py-12 md:py-16">
        <p className="text-accent-strong text-xs font-semibold uppercase tracking-[0.18em]">
          Research portfolio
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Research & Scientific Contributions
        </h1>
        <p className="text-muted mt-6 max-w-3xl text-base leading-8">
          My work combines field-based epidemiology, complex survey analysis and
          interpretable statistical learning to investigate healthcare access,
          clinical outcomes and health inequalities. The projects below distinguish
          completed funded studies from current methodological and clinical research.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/publications" className="bg-accent text-accent-foreground hover:bg-accent-strong rounded-md px-5 py-2.5 text-sm font-semibold transition-colors">
            View Publications
          </Link>
          <Link href="/experience" className="border-border hover:border-accent rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors">
            Research Appointments
          </Link>
        </div>
      </header>

      <section className="py-12" aria-labelledby="research-themes">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 id="research-themes" className="font-serif text-2xl font-semibold">Research Focus</h2>
          <span className="text-muted text-xs">Four interconnected areas</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {researchThemes.map((theme) => (
            <article key={theme.number} className="border-border rounded-lg border p-6">
              <span className="text-accent-strong text-xs font-semibold">{theme.number}</span>
              <h3 className="mt-3 font-serif text-xl font-semibold">{theme.title}</h3>
              <p className="text-muted mt-3 text-sm leading-7">{theme.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-border border-t py-12" aria-labelledby="funded-projects">
        <div className="mb-7">
          <p className="text-accent-strong text-xs font-semibold uppercase tracking-wider">Completed research</p>
          <h2 id="funded-projects" className="mt-2 font-serif text-2xl font-semibold">SUST Research Centre–Funded Projects</h2>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Three completed university-funded projects. The project records below highlight
            study scope and methodological contributions; full appointment histories are on the Experience page.
          </p>
        </div>
        <div className="space-y-4">
          {fundedProjects.map((project, index) => (
            <article key={project.title} className="border-border grid gap-4 rounded-lg border p-6 md:grid-cols-[5rem_1fr]">
              <p className="text-accent-strong font-serif text-3xl font-semibold">0{index + 1}</p>
              <div>
                <h3 className="font-serif text-xl font-semibold">{project.title}</h3>
                <p className="text-muted mt-2 text-sm">{project.subtitle}</p>
                <p className="mt-3 text-sm font-medium">{project.investigator} · {project.sample}</p>
                <p className="text-muted mt-3 text-sm leading-7">{project.contribution}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-border border-t py-12" aria-labelledby="ongoing-research">
        <h2 id="ongoing-research" className="font-serif text-2xl font-semibold">Current Research Initiatives</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {currentStudies.map((study) => (
            <article key={study.title} className="border-border rounded-lg border p-6">
              <p className="text-accent-strong text-xs font-semibold uppercase tracking-wide">{study.status}</p>
              <h3 className="mt-3 font-serif text-xl font-semibold">{study.title}</h3>
              <p className="text-muted mt-3 text-sm leading-7">{study.description}</p>
              {study.registry && (
                <p className="mt-4 text-sm font-medium">Registration: {study.registry}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="border-border border-t py-12" aria-labelledby="methodology">
        <h2 id="methodology" className="font-serif text-2xl font-semibold">Methods & Research Practice</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {methodGroups.map((group) => (
            <div key={group.heading} className="border-border border-l-2 pl-5">
              <h3 className="font-serif text-lg font-semibold">{group.heading}</h3>
              <p className="text-muted mt-3 text-sm leading-7">{group.items}</p>
            </div>
          ))}
        </div>
      </section>

      {observedCountries.length > 0 && (
        <section className="border-border border-t py-12" aria-labelledby="geography">
          <h2 id="geography" className="font-serif text-2xl font-semibold">Research Geography</h2>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Countries represented in my publication database. Dataset aliases are
            consolidated here for clarity; browse the Publications page for individual study details.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {observedCountries.map((country) => (
              <li key={country}>
                <Link href="/publications" className="border-border hover:border-accent inline-flex rounded-md border px-4 py-2 text-sm transition-colors">
                  {country}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-border border-t py-12">
        <h2 className="font-serif text-2xl font-semibold">Research Outputs</h2>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          Peer-reviewed articles, collaborative manuscripts and research software are
          listed in their dedicated sections to avoid duplicating full citations here.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/publications" className="border-border hover:border-accent rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors">
            Publications
          </Link>
          <Link href="/projects" className="border-border hover:border-accent rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors">
            Research Software & Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
