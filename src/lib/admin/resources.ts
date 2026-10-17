import type { Field } from "@/lib/admin/fields";

export type ResourceConfig = {
  /** URL segment under /admin; also the cache tag public pages should use. */
  key: string;
  label: string;
  singular: string;
  description: string;
  fields: readonly Field[];
  /** Field names shown as table columns (the first one links to the edit page). */
  columns: readonly string[];
};

export const publicationType = [
  { value: "JOURNAL", label: "Journal article" },
  { value: "CONFERENCE", label: "Conference paper" },
  { value: "PREPRINT", label: "Preprint" },
  { value: "THESIS", label: "Thesis" },
  { value: "OTHER", label: "Other" },
];

export const publicationStatus = [
  { value: "PUBLISHED", label: "Published" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "PREPRINT", label: "Preprint" },
  { value: "IN_PREPARATION", label: "In preparation" },
];

const displayOrder: Field = {
  name: "order",
  label: "Display order",
  type: "number",
  help: "Lower numbers appear first.",
};

export const resources = [
  {
    key: "publications",
    label: "Publications",
    singular: "Publication",
    description: "Papers, preprints and theses. Mark up to three as featured for the home page.",
    columns: ["title", "year", "status", "featured"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "authors",
        label: "Authors",
        type: "text",
        required: true,
        placeholder: "Rahman M, Akter S, Hossain A",
        help: "In the order they appear on the paper.",
      },
      {
        name: "venue",
        label: "Journal or conference",
        type: "text",
        placeholder: "BMC Public Health",
      },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "type", label: "Type", type: "select", required: true, options: publicationType },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: publicationStatus,
        help: "Update this when a paper moves from review to published.",
      },
      { name: "featured", label: "Feature on the home page", type: "checkbox" },
      { name: "doi", label: "DOI", type: "text", placeholder: "10.1186/s12889-024-12345-6" },
      { name: "url", label: "Link to paper", type: "url" },
      {
        name: "pdfUrl",
        label: "PDF link",
        type: "url",
        help: "Only share PDFs the publisher allows you to post.",
      },
      { name: "codeUrl", label: "Code or data link", type: "url" },
      {
        name: "tags",
        label: "Topics",
        type: "list",
        placeholder: "Mental health, Reproductive health",
        help: "Separate with commas.",
      },
      {
        name: "countries",
        label: "Countries / datasets",
        type: "list",
        placeholder: "Bangladesh, Nepal",
        help: "Separate with commas.",
      },
      { name: "abstract", label: "Abstract", type: "textarea", rows: 6 },
      {
        name: "bibtex",
        label: "BibTeX",
        type: "textarea",
        rows: 6,
        help: "Optional. Visitors can copy this citation.",
      },
    ],
  },
  {
    key: "tutorials",
    label: "Tutorials",
    singular: "Tutorial",
    description:
      "Your YouTube tutorials. Visitors click a thumbnail or title to watch it on the page.",
    columns: ["title", "date"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "videoUrl",
        label: "YouTube video link",
        type: "youtube",
        required: true,
        placeholder: "https://www.youtube.com/watch?v=…",
        help: "Open the video on YouTube and copy the link from the address bar or the Share button.",
      },
      {
        name: "thumbnailUrl",
        label: "Thumbnail",
        type: "upload",
        upload: "image",
        help: "Optional. If you leave this empty, the video's YouTube thumbnail is used.",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
        help: "Newest tutorials are shown first.",
      },
      {
        name: "description",
        label: "Short description",
        type: "textarea",
        rows: 3,
        help: "Optional. One or two sentences shown under the title.",
      },
    ],
  },
  {
    key: "research",
    label: "Research areas",
    singular: "Research area",
    description: "The main themes of your work, shown on the Research page.",
    columns: ["title", "order"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 5 },
      {
        name: "imageUrl",
        label: "Image",
        type: "upload",
        upload: "image",
        help: "Optional. JPG, PNG or WebP, up to 5 MB.",
      },
      displayOrder,
    ],
  },
  {
    key: "awards",
    label: "Awards",
    singular: "Award",
    description: "Scholarships, prizes and honours.",
    columns: ["title", "issuer", "year"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Awarded by", type: "text" },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "education",
    label: "Education",
    singular: "Education entry",
    description: "Degrees, shown on the About page.",
    columns: ["degree", "institution", "startYear", "endYear"],
    fields: [
      {
        name: "degree",
        label: "Degree",
        type: "text",
        required: true,
        placeholder: "BSc in Statistics",
      },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "startYear", label: "Start year", type: "number", required: true },
      { name: "endYear", label: "End year", type: "number", help: "Leave empty if ongoing." },
      {
        name: "details",
        label: "Details",
        type: "textarea",
        rows: 3,
        placeholder: "CGPA, thesis title…",
      },
      displayOrder,
    ],
  },
  {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    description: "Software and methods, e.g. R, Stata, survey-weighted regression.",
    columns: ["name", "category", "order"],
    fields: [
      { name: "name", label: "Skill", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "Software / Methods / Languages",
      },
      displayOrder,
    ],
  },
] as const satisfies readonly ResourceConfig[];

export type ResourceKey = (typeof resources)[number]["key"];

export function getResource(key: string): (ResourceConfig & { key: ResourceKey }) | undefined {
  return resources.find((r) => r.key === key);
}

export const profileFields: readonly Field[] = [
  { name: "name", label: "Full name", type: "text", required: true, section: "About you" },
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Undergraduate Researcher, Statistics",
  },
  {
    name: "department",
    label: "Department",
    type: "text",
    placeholder: "Department of Statistics",
  },
  {
    name: "institution",
    label: "Institution",
    type: "text",
    placeholder: "Shahjalal University of Science and Technology",
  },
  { name: "location", label: "Location", type: "text", placeholder: "Sylhet, Bangladesh" },
  {
    name: "focus",
    label: "One-line research focus",
    type: "text",
    help: "Shown under your name in the home page banner.",
  },
  { name: "shortBio", label: "Short bio (about 50 words)", type: "textarea", rows: 3 },
  { name: "longBio", label: "Full bio (about 300 words)", type: "textarea", rows: 8 },
  {
    name: "photoUrl",
    label: "Banner photo",
    type: "upload",
    upload: "image",
    section: "Photo & CV",
    help: "Shown in the home page banner. JPG, PNG or WebP, up to 5 MB. A square-ish photo at least 1200 px wide looks best.",
  },
  {
    name: "cvUrl",
    label: "CV (PDF)",
    type: "upload",
    upload: "pdf",
    help: "PDF up to 10 MB. The public link /cv always points to the latest one.",
  },
  {
    name: "email",
    label: "Public email",
    type: "email",
    section: "Contact",
    help: "Shown on the Contact page. This is not your login email.",
  },
  {
    name: "address",
    label: "Office address",
    type: "textarea",
    rows: 3,
    placeholder: "Department of Statistics, SUST, Sylhet 3114, Bangladesh",
  },
  {
    name: "youtubeUrl",
    label: "YouTube channel",
    type: "url",
    section: "YouTube tutorials",
    placeholder: "https://www.youtube.com/@yourchannel",
    help: 'Optional. Adds a "See all videos on YouTube" button to the Tutorials page.',
  },
  {
    name: "scholarUrl",
    label: "Google Scholar",
    type: "url",
    section: "Profile links",
    help: "Full links starting with https://. Leave empty to hide.",
  },
  { name: "orcidUrl", label: "ORCID", type: "url" },
  { name: "researchGateUrl", label: "ResearchGate", type: "url" },
  { name: "githubUrl", label: "GitHub", type: "url" },
  { name: "linkedinUrl", label: "LinkedIn", type: "url" },
  { name: "xUrl", label: "X / Bluesky", type: "url" },
];
