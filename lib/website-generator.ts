import type { ParsedResume } from "./resume-parser"

export interface WebsiteConfig {
  template: string
  colorScheme: string
  fontFamily: string
  sections: string[]
  customizations: Record<string, any>
}

export interface GeneratedWebsite {
  html: string
  css: string
  assets: string[]
  config: WebsiteConfig
}

const defaultConfig: WebsiteConfig = {
  template: "minimal",
  colorScheme: "blue",
  fontFamily: "Inter, sans-serif",
  sections: ["header", "about", "experience", "education", "skills", "projects", "contact"],
  customizations: {},
}

/**
 * Generates a website based on resume data and configuration
 */
export async function generateWebsite(
  resumeData: ParsedResume,
  config: Partial<WebsiteConfig> = {},
): Promise<GeneratedWebsite> {
  // Merge with default config
  const fullConfig: WebsiteConfig = {
    ...defaultConfig,
    ...config,
  }

  // Get the template generator based on the selected template
  const templateGenerator = getTemplateGenerator(fullConfig.template)

  // Generate the website content
  const generated = await templateGenerator(resumeData, fullConfig)

  return {
    ...generated,
    config: fullConfig,
  }
}

/**
 * Returns the appropriate template generator function
 */
function getTemplateGenerator(templateName: string) {
  const templates: Record<
    string,
    (data: ParsedResume, config: WebsiteConfig) => Promise<Omit<GeneratedWebsite, "config">>
  > = {
    minimal: generateMinimalTemplate,
    professional: generateProfessionalTemplate,
    creative: generateCreativeTemplate,
  }

  return templates[templateName] || templates.minimal
}

/**
 * Generates the minimal template
 */
async function generateMinimalTemplate(
  data: ParsedResume,
  config: WebsiteConfig,
): Promise<Omit<GeneratedWebsite, "config">> {
  // In a real implementation, this would generate actual HTML and CSS
  // For now, we'll return placeholder content

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personalInfo.name} - ${data.personalInfo.title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="minimal-template">
  <header>
    <div class="container">
      <h1>${data.personalInfo.name}</h1>
      <p class="title">${data.personalInfo.title}</p>
      <div class="contact-info">
        <p>${data.personalInfo.email}</p>
        ${data.personalInfo.phone ? `<p>${data.personalInfo.phone}</p>` : ""}
        ${data.personalInfo.location ? `<p>${data.personalInfo.location}</p>` : ""}
        ${data.personalInfo.website ? `<p><a href="${data.personalInfo.website}">${data.personalInfo.website}</a></p>` : ""}
      </div>
    </div>
  </header>
  
  <main>
    <div class="container">
      ${
        data.personalInfo.summary
          ? `
      <section id="about">
        <h2>About</h2>
        <p>${data.personalInfo.summary}</p>
      </section>
      `
          : ""
      }
      
      <section id="experience">
        <h2>Experience</h2>
        <div class="timeline">
          ${data.experience
            .map(
              (exp) => `
          <div class="timeline-item">
            <div class="timeline-header">
              <h3>${exp.position}</h3>
              <p class="company">${exp.company}</p>
              <p class="date">${exp.startDate} - ${exp.endDate || "Present"}</p>
            </div>
            <p>${exp.description}</p>
            ${
              exp.highlights && exp.highlights.length > 0
                ? `
            <ul>
              ${exp.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            `
                : ""
            }
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      
      <section id="education">
        <h2>Education</h2>
        <div class="timeline">
          ${data.education
            .map(
              (edu) => `
          <div class="timeline-item">
            <div class="timeline-header">
              <h3>${edu.degree}${edu.field ? `, ${edu.field}` : ""}</h3>
              <p class="institution">${edu.institution}</p>
              <p class="date">${edu.startDate} - ${edu.endDate || "Present"}</p>
            </div>
            ${edu.description ? `<p>${edu.description}</p>` : ""}
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      
      <section id="skills">
        <h2>Skills</h2>
        <div class="skills-grid">
          ${data.skills
            .map(
              (skill) => `
          <div class="skill-item">
            <h3>${skill.name}</h3>
            ${skill.level ? `<div class="skill-level" data-level="${skill.level}"></div>` : ""}
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      
      ${
        data.projects && data.projects.length > 0
          ? `
      <section id="projects">
        <h2>Projects</h2>
        <div class="projects-grid">
          ${data.projects
            .map(
              (project) => `
          <div class="project-item">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            ${project.url ? `<p><a href="${project.url}" target="_blank">View Project</a></p>` : ""}
            ${
              project.highlights && project.highlights.length > 0
                ? `
            <ul>
              ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            `
                : ""
            }
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }
      
      ${
        data.certifications && data.certifications.length > 0
          ? `
      <section id="certifications">
        <h2>Certifications</h2>
        <div class="certifications-grid">
          ${data.certifications
            .map(
              (cert) => `
          <div class="certification-item">
            <h3>${cert.name}</h3>
            <p>${cert.issuer}${cert.date ? ` - ${cert.date}` : ""}</p>
            ${cert.url ? `<p><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ""}
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }
      
      ${
        data.languages && data.languages.length > 0
          ? `
      <section id="languages">
        <h2>Languages</h2>
        <div class="languages-grid">
          ${data.languages
            .map(
              (lang) => `
          <div class="language-item">
            <h3>${lang.language}</h3>
            ${lang.proficiency ? `<p>${lang.proficiency}</p>` : ""}
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }
    </div>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${data.personalInfo.name}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
  `

  const css = `
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  --background-color: #ffffff;
  --section-bg-color: #f9fafb;
  --border-color: #e5e7eb;
  --font-family: ${config.fontFamily};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header .title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.contact-info p {
  margin: 0;
}

.contact-info a {
  color: white;
  text-decoration: none;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.7);
}

main {
  padding: 3rem 0;
}

section {
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: var(--section-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.timeline-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.timeline-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-header {
  margin-bottom: 1rem;
}

.timeline-header h3 {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.company, .institution {
  font-weight: 500;
  color: var(--secondary-color);
}

.date {
  font-size: 0.9rem;
  color: #6b7280;
}

ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

.skills-grid, .projects-grid, .certifications-grid, .languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-item, .project-item, .certification-item, .language-item {
  padding: 1rem;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skill-level {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
  position: relative;
}

.skill-level::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}

.skill-level[data-level="1"]::after { width: 20%; }
.skill-level[data-level="2"]::after { width: 40%; }
.skill-level[data-level="3"]::after { width: 60%; }
.skill-level[data-level="4"]::after { width: 80%; }
.skill-level[data-level="5"]::after { width: 100%; }

footer {
  background-color: #f3f4f6;
  padding: 2rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  header {
    padding: 3rem 0;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  header .title {
    font-size: 1.2rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  section {
    padding: 1.5rem;
  }
  
  .skills-grid, .projects-grid, .certifications-grid, .languages-grid {
    grid-template-columns: 1fr;
  }
}
  `

  return {
    html,
    css,
    assets: [],
  }
}

/**
 * Generates the professional template
 */
async function generateProfessionalTemplate(
  data: ParsedResume,
  config: WebsiteConfig,
): Promise<Omit<GeneratedWebsite, "config">> {
  // Professional template implementation
  // This would be similar to the minimal template but with a different design

  // For brevity, returning placeholder content
  return {
    html: `<!-- Professional template HTML -->`,
    css: `/* Professional template CSS */`,
    assets: [],
  }
}

/**
 * Generates the creative template
 */
async function generateCreativeTemplate(
  data: ParsedResume,
  config: WebsiteConfig,
): Promise<Omit<GeneratedWebsite, "config">> {
  // Creative template implementation
  // This would be similar to the minimal template but with a different design

  // For brevity, returning placeholder content
  return {
    html: `<!-- Creative template HTML -->`,
    css: `/* Creative template CSS */`,
    assets: [],
  }
}
