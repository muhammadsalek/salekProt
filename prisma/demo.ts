// Demo content so the portfolio can be previewed before real content is entered.
//   npm run db:demo            load demo content (refuses if content already exists)
//   npm run db:demo -- --reset replace ALL content with the demo content
//   npm run db:demo -- --clear delete ALL content (the admin login is kept)
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const DEMO_VENUE = "Example Journal (demo entry)";

async function clearAll() {
  await db.$transaction([
    db.publication.deleteMany(),
    db.tutorial.deleteMany(),
    db.researchArea.deleteMany(),
    db.award.deleteMany(),
    db.education.deleteMany(),
    db.skill.deleteMany(),
    db.profile.deleteMany(),
  ]);
}

async function loadDemo() {
  await db.profile.create({
    data: {
      id: 1,
      name: "Salek",
      title: "Undergraduate Researcher in Statistics",
      department: "Department of Statistics",
      institution: "Shahjalal University of Science and Technology",
      location: "Sylhet, Bangladesh",
      focus:
        "Using Demographic and Health Survey data to measure sexual, reproductive and mental health burdens that often go unrecognised.",
      shortBio:
        "I am a final-year Statistics undergraduate at SUST and a member of the Biostatistics, Epidemiology and Public Health Research Group. I analyse nationally representative survey data from South Asia and sub-Saharan Africa.",
      longBio: [
        "I am a final-year undergraduate in the Department of Statistics at Shahjalal University of Science and Technology (SUST), Sylhet, and a member of the Biostatistics, Epidemiology and Public Health Research Group.",
        "My work is secondary analysis of Demographic and Health Survey (DHS) data from Bangladesh, Nepal, Lesotho, Zambia and Mozambique. I use survey-weighted models to produce population estimates of sexual, reproductive and mental health burdens that rarely appear in routine statistics.",
        "I am preparing to apply for graduate study in biostatistics and epidemiology, and I welcome conversations about collaboration and research opportunities.",
      ].join("\n\n"),
      email: "salek@example.com",
      address:
        "Department of Statistics\nShahjalal University of Science and Technology\nSylhet 3114, Bangladesh",
      photoUrl: "/images/profile.jpg",
      scholarUrl: "https://scholar.google.com/citations?user=oV99NYoAAAAJ&hl=en",
    },
  });

  await db.researchArea.createMany({
    data: [
      {
        order: 1,
        title: "Sexual and reproductive health",
        summary:
          "Estimating the prevalence and correlates of reproductive health outcomes among women of reproductive age, and how they differ across regions, wealth and education.",
      },
      {
        order: 2,
        title: "Mental health",
        summary:
          "Measuring depressive and anxiety symptoms recorded in recent DHS rounds, and their links with intimate partner violence and household circumstances.",
      },
      {
        order: 3,
        title: "Survey methods",
        summary:
          "Applying complex survey design, sampling weights and multilevel models correctly, so that estimates from DHS data represent the national population.",
      },
    ],
  });

  const pubs = [
    {
      title:
        "Prevalence and correlates of depressive symptoms among women in Nepal: evidence from a national survey",
      year: 2026,
      status: "UNDER_REVIEW",
      featured: true,
      tags: ["Mental health"],
      countries: ["Nepal"],
    },
    {
      title: "Intimate partner violence and mental health among women in Lesotho and Zambia",
      year: 2026,
      status: "IN_PREPARATION",
      featured: true,
      tags: ["Mental health", "Intimate partner violence"],
      countries: ["Lesotho", "Zambia"],
    },
    {
      title: "Regional inequalities in unmet need for family planning in Bangladesh",
      year: 2025,
      status: "PUBLISHED",
      featured: true,
      tags: ["Reproductive health"],
      countries: ["Bangladesh"],
      bibtex:
        "@article{salek2025unmet,\n  title   = {Regional inequalities in unmet need for family planning in Bangladesh},\n  author  = {Salek and Co-author, A.},\n  journal = {Example Journal (demo entry)},\n  year    = {2025}\n}",
    },
    {
      title:
        "Sexually transmitted infection symptoms among women in Mozambique: a survey-weighted analysis",
      year: 2025,
      status: "PREPRINT",
      featured: false,
      tags: ["Reproductive health"],
      countries: ["Mozambique"],
    },
    {
      title: "Adolescent childbearing and its determinants in Bangladesh and Nepal",
      year: 2024,
      status: "PUBLISHED",
      featured: false,
      tags: ["Reproductive health"],
      countries: ["Bangladesh", "Nepal"],
    },
  ] as const;

  await db.publication.createMany({
    data: pubs.map((p) => ({
      ...p,
      tags: [...p.tags],
      countries: [...p.countries],
      authors: "Salek, Co-author A, Co-author B, Supervisor C",
      venue: DEMO_VENUE,
      type: "JOURNAL" as const,
    })),
  });

  // Placeholder videos from a public statistics channel, marked "Demo:" so they get replaced.
  await db.tutorial.createMany({
    data: [
      {
        title: "Demo: The essence of linear regression",
        videoUrl: "https://www.youtube.com/watch?v=aFDOzpTeg0s",
        date: new Date("2026-09-20"),
        description: "Demo entry using a public video. Replace it with one of your own tutorials.",
      },
      {
        title: "Demo: False discovery rates, clearly explained",
        videoUrl: "https://youtu.be/L3nlGfSyHV0",
        date: new Date("2026-08-14"),
        description: "Demo entry using a public video. Replace it with one of your own tutorials.",
      },
      {
        title: "Demo: Naive Bayes, concepts and code",
        videoUrl: "https://www.youtube.com/watch?v=u_9OA3WRHgo",
        date: new Date("2026-07-02"),
        description: "Demo entry using a public video. Replace it with one of your own tutorials.",
      },
    ],
  });

  await db.education.create({
    data: {
      degree: "BSc (Honours) in Statistics",
      institution: "Shahjalal University of Science and Technology, Sylhet",
      startYear: 2022,
      endYear: 2026,
      details: "Final-year undergraduate. Thesis on survey-weighted analysis of DHS data.",
      order: 1,
    },
  });

  await db.skill.createMany({
    data: [
      { name: "R (survey, lme4, tidyverse)", category: "Software", order: 1 },
      { name: "Stata", category: "Software", order: 2 },
      { name: "Python", category: "Software", order: 3 },
      { name: "Survey-weighted regression", category: "Methods", order: 1 },
      { name: "Multilevel models", category: "Methods", order: 2 },
      { name: "Complex survey design", category: "Methods", order: 3 },
      { name: "DHS data processing", category: "Data", order: 1 },
      { name: "English", category: "Languages", order: 1 },
      { name: "Bangla", category: "Languages", order: 2 },
    ],
  });

  await db.award.create({
    data: {
      title: "Academic merit award (demo entry)",
      issuer: "Shahjalal University of Science and Technology",
      year: 2025,
      description: "Replace with real awards and scholarships.",
    },
  });
}

async function main() {
  const flag = process.argv[2];
  if (flag === "--clear") {
    await clearAll();
    console.log("All content deleted. The admin login is unchanged.");
    return;
  }
  const existing = (await db.profile.count()) + (await db.publication.count());
  if (existing && flag !== "--reset") {
    console.log("Content already exists. Use --reset to replace it with demo content.");
    return;
  }
  await clearAll();
  await loadDemo();
  console.log("Demo content loaded.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
