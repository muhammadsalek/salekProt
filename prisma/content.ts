// Starting content taken from Md Salek Miah's CV, so the portfolio launches with real data.
// After this he maintains everything in the admin.
//   npm run db:content            load (refuses if content already exists)
//   npm run db:content -- --reset replace ALL content with this
//   npm run db:content -- --clear delete ALL content (the admin login is kept)
//   npm run db:content -- --projects add the CV projects only (skipped if any projects exist)
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const gh = (repo: string) => `https://github.com/muhammadsalek/${repo}`;

// From the CV's "Open Science, Software Development & Reproducibility" section, in CV order.
const projects = [
  {
    title: "TB-XAI: Explainable tuberculosis lesion analysis from chest X-rays",
    description:
      "An end-to-end pipeline that classifies single versus multiple TB lesions with a calibrated ConvNeXt-Tiny model, explains its predictions with Grad-CAM and Grad-CAM++, and localises lesions with YOLO, including failure, subgroup and calibration analyses.",
    technologies: [
      "Python",
      "Deep learning",
      "Explainable AI",
      "Medical imaging",
      "YOLO",
      "Streamlit",
    ],
    demoUrl: "https://tb-xai-salek.streamlit.app/",
    githubUrl: gh("TB-XAI"),
  },
  {
    title: "AcousticBiomarker-GH: AI-powered respiratory screening dashboard",
    description:
      "A cloud-hosted app that assesses respiratory risk from a cough recording, using a quantised MobileNetV2 model built for low-resource settings. It runs real-time TensorFlow Lite inference on log-mel spectrograms, explains results visually and applies rule-based clinical triage.",
    technologies: ["Python", "TensorFlow Lite", "Explainable AI", "Digital health", "Streamlit"],
    demoUrl: "https://acoustic-biomarker-gh-salek05.streamlit.app/",
    githubUrl: gh("AcousticBiomarker-GH"),
  },
  {
    title: "PolicyShift: counterfactual policy simulator",
    description:
      "A simulator for evidence-based public health decisions in low- and middle-income countries. Survey-weighted random forest models drive interactive policy sliders, with subgroup results by residence and wealth quintile and individual-level counterfactual explanations.",
    technologies: ["R Shiny", "Random forest", "Counterfactual simulation", "Plotly"],
    demoUrl: "https://salek.shinyapps.io/policyshift/",
    githubUrl: gh("policyshift"),
  },
  {
    title: "AquaLens: water quality intelligence platform",
    description:
      "A real-time water quality dashboard for the Buriganga River that uses the Water Quality Index and maps to identify and track pollution hotspots.",
    technologies: ["R Shiny", "GIS", "Water Quality Index"],
    demoUrl: "https://salek.shinyapps.io/aqualens/",
    githubUrl: null,
  },
  {
    title: "Interactive statistical calculator",
    description:
      "A web tool for designing epidemiological studies, with modules for statistical distributions, hypothesis testing, power analysis and sample size calculation.",
    technologies: ["R Shiny", "Statistical computing"],
    demoUrl: "https://qa8m8h-md0salek-miah.shinyapps.io/calculator/",
    githubUrl: null,
  },
  {
    title: "Academic Design Studio (ADS)",
    description:
      "A document automation platform for academic work that generates CVs, research proposals, theses, lab reports, posters and assignments, with live preview and Word export.",
    technologies: ["Python", "Streamlit", "python-docx", "Matplotlib"],
    demoUrl: "https://ads-app-salek.streamlit.app/",
    githubUrl: gh("ads-streamlit"),
  },
  {
    title: "Handwritten digit recognition (MNIST)",
    description:
      "An interactive web app that recognises digits drawn on screen in real time, using a deep learning model with OpenCV image preprocessing.",
    technologies: ["Python", "TensorFlow", "OpenCV", "Streamlit"],
    demoUrl: "https://mnist-digit-recognition-salek.streamlit.app/",
    githubUrl: gh("mnist-digit-recognition"),
  },
  {
    title: "League Pro database management system",
    description:
      "A relational sports database with SQL analyses of player ratings, game scores and disciplinary records, using nested subqueries, aggregates and multi-table joins, and indexes that speed up large queries.",
    technologies: ["SQL", "Relational databases", "Database design"],
    demoUrl: null,
    githubUrl: gh("SportsDB-Database-Analysis/blob/main/README.md"),
  },
];

async function loadProjects() {
  await db.project.createMany({ data: projects.map((p, i) => ({ ...p, order: i + 1 })) });
}

async function clearAll() {
  await db.$transaction([
    db.publication.deleteMany(),
    db.tutorial.deleteMany(),
    db.galleryEvent.deleteMany(),
    db.project.deleteMany(),
    db.experience.deleteMany(),
    db.researchArea.deleteMany(),
    db.award.deleteMany(),
    db.education.deleteMany(),
    db.skill.deleteMany(),
    db.profile.deleteMany(),
  ]);
}

async function load() {
  await db.profile.create({
    data: {
      id: 1,
      name: "Md Salek Miah",
      title: "Statistics undergraduate and GBD Collaborator",
      department: "Department of Statistics",
      institution: "Shahjalal University of Science and Technology",
      location: "Sylhet, Bangladesh",
      focus:
        "Sexual and reproductive health, women's mental health and health equity, studied through nationally representative survey data.",
      shortBio:
        "I am a final-year Statistics undergraduate at Shahjalal University of Science and Technology and a collaborator on the IHME Global Burden of Disease Study. I analyse Demographic and Health Survey data on women's mental health, reproductive health and health inequalities across South Asia and sub-Saharan Africa.",
      longBio: [
        "I am a final-year BSc (Honours) Statistics student at Shahjalal University of Science and Technology (SUST), Sylhet, Bangladesh, expecting to graduate in April 2027. I am a research assistant in the Biostatistics, Epidemiology and Public Health Research Group at SUST and a biostatistician at the Manuco Research Center.",
        "My research uses Demographic and Health Survey data from Bangladesh, Nepal, Zambia, Mozambique, Lesotho and Burkina Faso to study sexual and reproductive health, women's mental health, maternal and child health, and health inequalities. I combine survey-weighted regression, spatial analysis and explainable machine learning, and I publish the code for my analyses on GitHub.",
        "I am a collaborator in the Global Burden of Disease (GBD) network at the Institute for Health Metrics and Evaluation, University of Washington, and a peer reviewer for journals published by Cambridge University Press, Springer Nature, Wiley and PLOS.",
        "Through Salek Data Lab, my Bangla-language YouTube channel, I teach R, Stata, SPSS and research methods to students and early-career researchers.",
      ].join("\n\n"),
      email: "saleksta@gmail.com",
      address:
        "Department of Statistics\nShahjalal University of Science and Technology\nSylhet 3114, Bangladesh",
      photoUrl: "/images/profile.jpg",
      youtubeUrl: "https://www.youtube.com/@SalekResearch",
      scholarUrl: "https://scholar.google.com/citations?user=oV99NYoAAAAJ&hl=en",
      orcidUrl: "https://orcid.org/0009-0005-5973-461X",
      githubUrl: "https://github.com/muhammadsalek",
      linkedinUrl: "https://www.linkedin.com/in/md-salek-miah/",
    },
  });

  await db.researchArea.createMany({
    data: [
      {
        order: 1,
        title: "Sexual and reproductive health",
        summary:
          "Unmet need for family planning, contraceptive method choice, pregnancy loss and fertility among women in Bangladesh, using the 2022 Bangladesh Demographic and Health Survey.",
      },
      {
        order: 2,
        title: "Women's mental health",
        summary:
          "Depression and anxiety among women in Zambia, Mozambique, Lesotho and Bangladesh, and their links with intimate partner violence, empowerment, decision-making autonomy and digital connectivity.",
      },
      {
        order: 3,
        title: "Maternal and child health",
        summary:
          "Skilled birth attendance in Burkina Faso, studied with explainable machine learning, and household water and handwashing facilities in relation to early childhood education in Nepal.",
      },
      {
        order: 4,
        title: "Global burden of disease",
        summary:
          "Contributions as a GBD Collaborator to GBD 2023 analyses of dementia, diet-attributable disease burden and dengue.",
      },
      {
        order: 5,
        title: "Health data science and equity",
        summary:
          "Survey-weighted and spatial methods that show where health burdens concentrate, with open, reproducible code for every analysis.",
      },
    ],
  });

  type Pub = {
    title: string;
    authors: string;
    venue: string;
    year: number;
    status?: "PUBLISHED" | "ACCEPTED" | "UNDER_REVIEW";
    doi?: string;
    codeUrl?: string;
    featured?: boolean;
    tags: string[];
    countries: string[];
  };
  const pubs: Pub[] = [
    {
      title:
        "Explainable machine learning analysis of factors associated with skilled birth attendance in Burkina Faso",
      authors: "Miah MS",
      venue: "Scientific Reports",
      year: 2026,
      codeUrl: gh("SBA-BurkinaFaso-ML-DHS"),
      featured: true,
      tags: ["Maternal health", "Machine learning"],
      countries: ["Burkina Faso"],
    },
    {
      title:
        "Intimate partner violence and the dual burden of anxiety and depression among women in Zambia: spatial inequalities and implications for the Sustainable Development Goals",
      authors: "Miah MS, Uddin MS",
      venue: "Cambridge Prisms: Global Mental Health",
      year: 2026,
      doi: "10.1017/gmh.2026.10261",
      featured: true,
      tags: ["Mental health", "Intimate partner violence"],
      countries: ["Zambia"],
    },
    {
      title:
        "Stratified and geographic patterns of depression and anxiety in Mozambican women: mental health policy implications",
      authors: "Miah MS",
      venue: "PLOS ONE",
      year: 2026,
      doi: "10.1371/journal.pone.0356265",
      codeUrl: gh("mozambique-mental-health-analysis"),
      featured: true,
      tags: ["Mental health"],
      countries: ["Mozambique"],
    },
    {
      title:
        "Association between women's empowerment and mental health in sub-Saharan Africa and South Asia: evidence from the Survey-based Women's Empowerment (SWPER) Index",
      authors: "Miah MS, et al.",
      venue: "Cambridge Prisms: Global Mental Health",
      year: 2026,
      status: "ACCEPTED",
      doi: "10.1017/gmh.2026.10323",
      codeUrl: gh("SWPER-Depression-Anxiety-Multi-country"),
      tags: ["Mental health", "Women's empowerment"],
      countries: [],
    },
    {
      title:
        "Associations of internet use and pregnancy loss with depression and anxiety among women in Bangladesh: evidence from the 2022 BDHS",
      authors: "Ullah MO, Miah MS",
      venue: "BMC Women's Health",
      year: 2025,
      doi: "10.1186/s12905-025-04166-4",
      codeUrl: gh("Pregnancy-Loss-Internet-Use-Mental-Health-DHS-2022"),
      tags: ["Mental health", "Reproductive health"],
      countries: ["Bangladesh"],
    },
    {
      title:
        "Association between internet use and unmet need for family planning among currently pregnant women in Bangladesh: evidence from BDHS 2022",
      authors: "Miah MS, Uddin MJ",
      venue: "BMC Women's Health",
      year: 2026,
      doi: "10.1186/s12905-026-04788-2",
      codeUrl: gh("BDHS-Unmet-Need-Analysis"),
      tags: ["Reproductive health"],
      countries: ["Bangladesh"],
    },
    {
      title:
        "Digital connectivity and mental health symptoms among women in Bangladesh: a rural–urban perspective",
      authors: "Miah MS, Uddin MJ",
      venue: "Discover Mental Health",
      year: 2026,
      doi: "10.1007/s44192-026-00591-5",
      codeUrl: gh("digital-connectivity-mental-health-bangladesh-women"),
      tags: ["Mental health"],
      countries: ["Bangladesh"],
    },
    {
      title:
        "Decision-making autonomy and depressive symptoms among women in Lesotho: rural–urban differences",
      authors: "Miah MS, et al.",
      venue: "Journal of Affective Disorders Reports",
      year: 2026,
      doi: "10.1016/j.jadr.2026.101080",
      codeUrl: gh("Rural-Urban-Inequalities-in-Depression-among-Ever-Married-Women-in-Lesotho"),
      tags: ["Mental health", "Women's empowerment"],
      countries: ["Lesotho"],
    },
    {
      title:
        "Risk factors for anxiety and depression among ever-married women in Zambia: evidence from the 2023–24 Demographic and Health Survey",
      authors: "Miah MS",
      venue: "Journal of Affective Disorders Reports",
      year: 2026,
      doi: "10.1016/j.jadr.2026.101168",
      tags: ["Mental health"],
      countries: ["Zambia"],
    },
    {
      title:
        "Household water and handwashing facilities and early childhood education participation in Nepal",
      authors: "Miah MS, et al.",
      venue: "Health Science Reports",
      year: 2026,
      status: "ACCEPTED",
      doi: "10.1002/hsr2.72254",
      codeUrl: gh("Nepal_ECE_Analysis"),
      tags: ["Child health", "WASH"],
      countries: ["Nepal"],
    },
    {
      title:
        "Beyond use and non-use: determinants of contraceptive method choice in Bangladesh: evidence from BDHS 2022 using multinomial logistic regression",
      authors: "Miah MS, et al.",
      venue: "Contraception and Reproductive Medicine",
      year: 2026,
      doi: "10.1186/s40834-026-00466-8",
      tags: ["Reproductive health"],
      countries: ["Bangladesh"],
    },
    {
      title:
        "Parental education and children ever born among women in Bangladesh: evidence from a nationally representative survey",
      authors: "Miah MS, et al.",
      venue: "Public Health Challenges",
      year: 2026,
      doi: "10.1002/puh2.70366",
      tags: ["Reproductive health"],
      countries: ["Bangladesh"],
    },
    {
      // The CV gives no year for this one; 2026 inferred from the DOI sequence. Check before launch.
      title:
        "Pregnancy loss and women's mental health in Zambia: a cross-sectional population-based and spatial analysis using 2023–2024 Zambia Demographic and Health Survey data",
      authors: "Miah MS, et al.",
      venue: "Health Science Reports",
      year: 2026,
      doi: "10.1002/hsr2.73339",
      tags: ["Mental health", "Reproductive health"],
      countries: ["Zambia"],
    },
    {
      title:
        "Global, regional, and national burden of Alzheimer's disease and other dementias in 204 countries and territories, 1990–2023, with forecasts to 2050: a systematic analysis for the Global Burden of Disease Study 2023",
      authors: "Miah MS, GBD 2023 Alzheimer's Disease and Other Dementias Collaborators",
      venue: "The Lancet",
      year: 2026,
      status: "UNDER_REVIEW",
      tags: ["Global burden of disease"],
      countries: [],
    },
    {
      title:
        "Global, regional, and national disease burden attributable to dietary risks among adults 25 years and older, 1990–2023: a systematic analysis for the Global Burden of Disease Study 2023",
      authors: "Miah MS, GBD 2023 Diet Collaborators",
      venue: "The Lancet Public Health",
      year: 2026,
      status: "UNDER_REVIEW",
      tags: ["Global burden of disease"],
      countries: [],
    },
    {
      title:
        "Global, regional, and national dengue burden, 1990–2023: a systematic analysis from the Global Burden of Disease Study 2023",
      authors: "Miah MS, GBD 2023 Dengue Collaborators",
      venue: "The Lancet Infectious Diseases",
      year: 2026,
      status: "UNDER_REVIEW",
      tags: ["Global burden of disease"],
      countries: [],
    },
  ];
  await db.publication.createMany({
    data: pubs.map((p) => ({
      ...p,
      status: p.status ?? "PUBLISHED",
      type: "JOURNAL" as const,
      featured: p.featured ?? false,
    })),
  });

  type Exp = {
    category: "RESEARCH" | "FUNDED_PROJECT" | "TEACHING" | "PEER_REVIEW" | "LEADERSHIP";
    role: string;
    organization: string;
    location?: string;
    start: [number, number?];
    end?: [number, number?];
    points: string[];
    link?: string;
  };
  const experience: Exp[] = [
    // Research positions
    {
      category: "RESEARCH",
      role: "Biostatistician",
      organization:
        "Manuco Research Center, Department of Health Data Science and Computational Epidemiology",
      location: "Bangladesh / Remote",
      start: [2026, 9],
      points: [
        "Provide biostatistical support for multidisciplinary public-health and epidemiological research, including study design, sample-size planning, statistical analysis and interpretation of findings.",
      ],
      link: "https://manucoresearch.org/people",
    },
    {
      category: "RESEARCH",
      role: "GBD Collaborator",
      organization:
        "Global Burden of Disease Collaborator Network, Institute for Health Metrics and Evaluation (IHME), University of Washington",
      location: "Seattle, USA / Remote",
      start: [2026],
      points: [
        "Inducted into the GBD Collaborator Network by invitation of the GBD Secretariat.",
        "Invited contributor to GBD 2023 papers on dementia, dietary risks and dengue, working with senior IHME researchers.",
        "Contribute through manuscript review, methodological feedback on covariates and modelling approaches, and the annual GBD estimation cycle.",
        "Completed the Introduction to GBD course with a score of 80%.",
      ],
      link: "https://www.ihme.washington.edu/",
    },
    {
      category: "RESEARCH",
      role: "Research Assistant",
      organization: "Biostatistics, Epidemiology and Public Health Research Group, SUST",
      location: "Sylhet, Bangladesh",
      start: [2024, 1],
      points: [
        "Lead multi-country DHS data analysis for peer-reviewed publications on maternal and child health, mental health and WASH.",
      ],
    },
    {
      category: "RESEARCH",
      role: "Research Assistant",
      organization: "ELITE Research Lab",
      location: "Remote",
      start: [2026, 1],
      points: [
        "Conduct research on artificial intelligence, machine learning and data analytics for public health and biomedical applications.",
      ],
      link: "https://elitelab.ai/team/research",
    },
    {
      category: "RESEARCH",
      role: "Research Assistant",
      organization: "Cognitive Solution Bangladesh (CSBD)",
      location: "Remote",
      start: [2025, 1],
      end: [2026, 6],
      points: [
        "Analysed nationally representative Bangladesh Demographic and Health Survey (BDHS) data using Stata and R to support public health, epidemiological and health systems research.",
        "Completed the internship under national and international mentors, including collaborators from the University of British Columbia, Canada.",
      ],
      link: "https://www.teamcsbd.com/",
    },
    {
      category: "RESEARCH",
      role: "Research Intern",
      organization: "DataKothon Research Lab",
      location: "Remote",
      start: [2025, 6],
      end: [2025, 8],
      points: [
        "Hands-on experience in research methodology, DHS survey data analysis, R programming, statistical modelling, reproducible research and scientific writing.",
      ],
    },
    {
      category: "RESEARCH",
      role: "Research Intern",
      organization: "Pioneering Health Research and Learning Center (PHRLC)",
      location: "Dhaka, Bangladesh (Remote)",
      start: [2024, 7],
      end: [2024, 12],
      points: [
        "Six-month structured research internship with advanced training, hands-on workshops and skill-building in public health, research methodology, data analysis and bioinformatics.",
      ],
      link: "https://www.linkedin.com/in/md-salek-miah/details/certifications/1740480791524",
    },
    {
      category: "RESEARCH",
      role: "Field Research Team Leader, Qualitative and Participatory Research",
      organization:
        "Bangladesh Academy for Rural Development (BARD) and Department of Statistics, SUST",
      location: "Cumilla, Bangladesh",
      start: [2026],
      end: [2026],
      points: [
        "Led a 10-member field team for the qualitative study “Impact of International Migration on Migrant Households: A Qualitative Study from Cumilla, Bangladesh”.",
        "Directed community-based data collection using focus group discussions, participatory rural appraisal, household interviews, transect walks, social and resource mapping, and problem ranking.",
        "Designed a digital data-collection workflow, conducted thematic analysis and framed the findings within SDGs 3, 5, 8 and 10.",
        "Presented the findings at SUST (course assessment 3.75/4.00).",
      ],
      link: "https://www.researchgate.net/publication/404186503_Impact_of_International_Migration_on_Migrant_Households_A_Qualitative_Study_from_Cumilla_Bangladesh",
    },

    // Funded research projects
    {
      category: "FUNDED_PROJECT",
      role: "Research Assistant",
      organization: "SUST Research Centre, Shahjalal University of Science and Technology",
      location: "Sylhet, Bangladesh",
      start: [2024, 12],
      points: [
        "Project: “Impact of Pesticides Use on Farmers’ Health in the North-Eastern Part of Bangladesh”, funded by the SUST Research Centre.",
        "Principal investigator: Professor Dr. Ohid Ullah, Department of Statistics, SUST.",
        "Data collection, study design, research methodology development, questionnaire design and data analysis.",
      ],
      link: "https://www.sust.edu/centers/research-center",
    },
    {
      category: "FUNDED_PROJECT",
      role: "Research Assistant",
      organization: "SUST Research Centre, Shahjalal University of Science and Technology",
      location: "Sylhet, Bangladesh",
      start: [2025, 7],
      end: [2025, 12],
      points: [
        "Project: “Maternal and Newborn Healthcare Services in the Haor Region of Bangladesh: Status and Determinants” (PS/2024/2/31), sponsored by the SUST Research Centre.",
        "Principal investigator: Dr. Md Zakir Hossain, Professor, Department of Statistics, SUST.",
        "Field visits and respondent identification, structured interviews with mothers and healthcare service recipients, questionnaire administration, data organisation, field reports and data analysis.",
      ],
    },
    {
      category: "FUNDED_PROJECT",
      role: "Research Assistant",
      organization: "SUST Research Centre, Shahjalal University of Science and Technology",
      location: "Sylhet, Bangladesh",
      start: [2024, 7],
      end: [2026, 6],
      points: [
        "Project: “Quality of Life among Geriatric People in Sylhet Region of Bangladesh: Impact of International Migration” (PS/2024/2/32), funded by the SUST Research Centre.",
        "Principal investigator: Professor Dr. Sabina Islam, Department of Statistics, SUST.",
        "Data collection, questionnaire administration, data management, statistical analysis and research reporting.",
      ],
    },

    // Teaching & training
    {
      category: "TEACHING",
      role: "Instructor, Applied Data Science and Machine Learning with R for Public Health",
      organization: "Center for Bio Health Research (CBHR)",
      location: "Online",
      start: [2026],
      points: [
        "Designed and delivered hands-on training in R programming, data science, machine learning, reproducible research and public health data analysis.",
        "Covered data preprocessing, exploratory data analysis, statistical modelling, predictive machine learning, visualisation and automated reporting with R Markdown.",
        "Live class recordings are available in Bengali.",
      ],
      link: "https://drive.google.com/drive/folders/1lTspQFv0JwzuXDurClebh12aHRVSBccp?usp=sharing",
    },
    {
      category: "TEACHING",
      role: "Instructor",
      organization: "Bangladesh Institute of Innovative Health Research (BIIHR)",
      location: "Bangladesh",
      start: [2026],
      points: [
        "Deliver training in health research methodology, biostatistics and data-driven public health.",
        "Lead hands-on training in R and IBM SPSS Statistics: data management, statistical modelling, hypothesis testing and interpretation.",
        "Mentor early-career researchers, graduate students and health professionals in epidemiological methods using real-world health data.",
      ],
      link: "https://www.facebook.com/biihr.bd",
    },
    {
      category: "TEACHING",
      role: "Workshop Facilitator",
      organization: "Bangladesh Institute of Innovative Health Research (BIIHR)",
      location: "Dhaka, Bangladesh",
      start: [2026, 5],
      end: [2026, 5],
      points: [
        "Delivered the international workshop “Applied Statistical Analysis in Health Research using Survey Data (DHS Data): A Hands-On Training with R”.",
        "Three-hour bilingual (Bengali–English) session on DHS data management, descriptive statistics, logistic regression, interpretation and reproducible analysis in R.",
      ],
      link: "https://youtu.be/CCAXtI4Sz1c",
    },
    {
      category: "TEACHING",
      role: "Independent Academic Mentor (STEM)",
      organization: "English and Bengali medium college students",
      location: "Sylhet, Bangladesh",
      start: [2023],
      points: [
        "Delivered over 1,000 hours of mentorship in advanced mathematics, physics, chemistry and ICT.",
      ],
    },

    // Peer review
    {
      category: "PEER_REVIEW",
      role: "Invited Peer Reviewer",
      organization: "Cambridge University Press & Assessment",
      location: "Cambridge, UK / Remote",
      start: [2026, 3],
      points: [
        "Invited reviewer for Cambridge Prisms: Global Mental Health.",
        "Peer-review activity verified through Web of Science.",
      ],
      link: "https://www.webofscience.com/wos/author/record/PII-8481-2026",
    },
    {
      category: "PEER_REVIEW",
      role: "Peer Reviewer",
      organization: "Springer Nature",
      location: "Remote",
      start: [2026, 6],
      points: [
        "Reviewer for BMC Public Health, BMC Pediatrics, BMC Women's Health and Contraception and Reproductive Medicine.",
        "Evaluate study design, statistical methodology, reporting quality and interpretation across reproductive, maternal and child health research.",
      ],
    },
    {
      category: "PEER_REVIEW",
      role: "Peer Reviewer",
      organization: "Wiley",
      location: "Remote",
      start: [2026, 6],
      points: [
        "Reviewer for Wiley journals including Discrete Dynamics in Nature and Society.",
        "Reviewer activity verified through Web of Science.",
      ],
    },
    {
      category: "PEER_REVIEW",
      role: "Peer Reviewer",
      organization: "PLOS ONE",
      location: "Remote",
      start: [2026],
      points: [
        "Review manuscripts for methodological rigour, statistical validity, reproducibility and clarity of reporting.",
      ],
      link: "https://www.webofscience.com/wos/author/record/PII-8481-2026",
    },

    // Leadership & outreach
    {
      category: "LEADERSHIP",
      role: "Founder and Content Creator, Salek Data Lab",
      organization: "Bangla-language research, statistics and public health education channel",
      location: "Online",
      start: [2026],
      points: [
        "Live-coding tutorials and masterclasses in R, Stata and SPSS: DHS data management, survey-weighted analysis, regression, machine learning and publication-ready workflows.",
        "Maintain open teaching repositories: R for Public Health (DHS), SPSS for Research, DHS Data Analysis with Stata and DHS Machine Learning Lab.",
      ],
      link: "https://www.youtube.com/@SalekResearch",
    },
    {
      category: "LEADERSHIP",
      role: "Founder and Content Creator, Research Diary",
      organization: "Research, statistics, data science and higher-study education platform",
      location: "Online",
      start: [2026],
      points: [
        "Share practical content on research, statistics, R programming, data science, machine learning and higher study for students and early-career researchers.",
      ],
      link: "https://www.facebook.com/profile.php?id=61592785365591",
    },
    {
      category: "LEADERSHIP",
      role: "Coordinator, Youth Neglected Tropical Diseases (NTD) Taskforce",
      organization: "Nymat Global, IMSEN Bangladesh and NTD Alliance Bangladesh",
      location: "Bangladesh",
      start: [2026, 9],
      points: [
        "Support youth-led public health engagement on neglected tropical diseases, health equity and community action.",
        "Represent the Department of Statistics, SUST, in collaborative youth public health activities.",
      ],
      link: "https://www.facebook.com/TBFreeWorld2030",
    },
  ];
  await db.experience.createMany({
    data: experience.map((e) => ({
      category: e.category,
      role: e.role,
      organization: e.organization,
      location: e.location ?? null,
      startYear: e.start[0],
      startMonth: e.start[1] ?? null,
      endYear: e.end?.[0] ?? null,
      endMonth: e.end?.[1] ?? null,
      description: e.points.join("\n"),
      link: e.link ?? null,
    })),
  });

  // His latest videos from youtube.com/@SalekResearch.
  const videos: [string, string, string][] = [
    ["Zrj0chHvO9Y", "2026-10-07", "Python for Data Science: Class 02, Part 01"],
    [
      "ch-mNIjcQoY",
      "2026-10-02",
      "Python for Data Science: Python basics, NumPy, Pandas and Google Colab (Class 01)",
    ],
    [
      "72Ky3jQVuR0",
      "2026-09-29",
      "How to write a strong research paper introduction: the 5-paragraph model",
    ],
    [
      "nIWbyyh7ikc",
      "2026-09-26",
      "Statistical inference explained: p-value, confidence interval and effect size",
    ],
    [
      "o8OMirrNINs",
      "2026-09-24",
      "Descriptive statistics for research: data, variables and confounders",
    ],
    ["fJLWNAQKBHc", "2026-09-14", "How to generate research ideas from everyday problems"],
    [
      "b7XCsEghGh0",
      "2026-09-13",
      "R for Public Health, Class 04: simple, grouped and stacked bar charts in R",
    ],
    ["KcnT08jbzEo", "2026-09-01", "R for Public Health, Class 03: t-test and ANOVA"],
    [
      "ApFCnp4tw_E",
      "2026-08-28",
      "SPSS Class 02: chi-square, odds ratio and binary logistic regression",
    ],
  ];
  await db.tutorial.createMany({
    data: videos.map(([id, date, title]) => ({
      title,
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      date: new Date(date),
    })),
  });

  await loadProjects();

  await db.education.create({
    data: {
      degree: "BSc (Honours) in Statistics",
      institution: "Shahjalal University of Science and Technology (SUST), Sylhet",
      startYear: 2023,
      details: "Final-year undergraduate. Expected graduation: April 2027.",
      order: 1,
    },
  });

  const skills: [string, string[]][] = [
    [
      "Statistical software",
      [
        "RStudio",
        "Stata",
        "IBM SPSS Statistics",
        "SAS",
        "ArcGIS Pro",
        "DAGitty",
        "Microsoft Excel",
      ],
    ],
    ["Programming", ["R", "Python", "SQL", "LaTeX", "Git"]],
    [
      "Research methods",
      [
        "Survey data analysis (DHS)",
        "Data cleaning and management",
        "Reproducible research",
        "Scientific writing",
        "Systematic literature review",
      ],
    ],
    ["Tools", ["GitHub", "Overleaf", "Canva", "Google Docs"]],
  ];
  await db.skill.createMany({
    data: skills.flatMap(([category, names]) =>
      names.map((name, i) => ({ name, category, order: i + 1 })),
    ),
  });

  await db.award.createMany({
    data: [
      {
        title: "First Place, DNA Day Essay Writing Contest",
        issuer: "International Society for Computational Biology (ISCB) RSG-Bangladesh",
        year: 2025,
        description: "Award for scientific writing and communication in computational biology.",
      },
      {
        title: "Runner-Up, Poster Presentation",
        issuer: "6th Economic Summit, University of Dhaka",
        year: 2024,
        description:
          "Cardiovascular disease classification and survival analysis: a Cox proportional hazards model for CVD risk prediction (C-index 0.989).",
      },
      {
        title: "Top 5 Performer, Data Hackathon, IT Fest 2024",
        issuer: "Comilla University",
        year: 2024,
        description: "Recognised for applied data analysis and problem-solving.",
      },
      {
        title: "Merit Scholarship (Top 20)",
        issuer: "Aftab Uddin–Khudeja Banu Welfare Trust, UK",
        description: "Awarded for outstanding academic performance.",
      },
      {
        title: "Merit Scholarship",
        issuer: "Khandoker Trust International",
        description: "Recognised for academic excellence.",
      },
    ],
  });
}

async function main() {
  const flag = process.argv[2];
  if (flag === "--clear") {
    await clearAll();
    console.log("All content deleted. The admin login is unchanged.");
    return;
  }
  if (flag === "--projects") {
    if (await db.project.count()) {
      console.log("Projects already exist — nothing added.");
      return;
    }
    await loadProjects();
    console.log(`Added ${projects.length} projects from the CV.`);
    return;
  }
  const existing = (await db.profile.count()) + (await db.publication.count());
  if (existing && flag !== "--reset") {
    console.log("Content already exists. Use --reset to replace it.");
    return;
  }
  await clearAll();
  await load();
  console.log("CV content loaded.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
