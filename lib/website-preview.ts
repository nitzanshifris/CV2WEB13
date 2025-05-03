import type { ParsedResume } from "./resume-parser"
import { generateWebsite, type WebsiteConfig } from "./website-generator"

export interface PreviewOptions {
  width: number
  height: number
  scale: number
}

const defaultPreviewOptions: PreviewOptions = {
  width: 1200,
  height: 800,
  scale: 0.5,
}

/**
 * Generates a preview of the website
 */
export async function generateWebsitePreview(
  resumeData: ParsedResume,
  config: Partial<WebsiteConfig> = {},
  options: Partial<PreviewOptions> = {},
): Promise<string> {
  // Generate the website
  const website = await generateWebsite(resumeData, config)

  // Create a preview HTML that includes the website content
  const previewHtml = createPreviewHtml(website.html, website.css, {
    ...defaultPreviewOptions,
    ...options,
  })

  return previewHtml
}

/**
 * Creates HTML for the preview iframe
 */
function createPreviewHtml(html: string, css: string, options: PreviewOptions): string {
  // Extract the body content from the HTML
  const bodyContent = extractBodyContent(html)

  // Create a preview HTML with iframe
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Preview</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    
    .preview-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f0f0;
    }
    
    .preview-frame {
      width: ${options.width}px;
      height: ${options.height}px;
      transform: scale(${options.scale});
      transform-origin: center top;
      border: 1px solid #ccc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: white;
    }
    
    .preview-content {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-frame">
      <div class="preview-content">
        <style>${css}</style>
        ${bodyContent}
      </div>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Extracts the body content from HTML
 */
function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return bodyMatch ? bodyMatch[1] : html
}
