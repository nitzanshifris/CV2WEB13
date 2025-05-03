import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TableOfContentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">תוכן העניינים</h1>

      <div className="space-y-8">
        {tableOfContents.map((section) => (
          <Card key={section.id} id={section.id} className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.subsections.map((subsection, index) => (
                  <li key={index}>
                    <Link href={`/sections/${section.id}#${subsection.id}`} className="text-primary hover:underline">
                      {subsection.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{subsection.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const tableOfContents = [
  {
    id: "intro",
    title: "מבוא למגמות עיצוב מודרניות",
    description: "סקירה של מגמות העיצוב העדכניות ביותר ב-CSS",
    subsections: [
      {
        id: "neomorphism",
        title: "ניאומורפיזם מתקדם",
        description: "המשך התפתחות של סגנון הניאומורפיזם עם דגש על נגישות ושימושיות",
      },
      {
        id: "glassmorphism",
        title: "גלסמורפיזם (עיצוב זכוכית)",
        description: "אפקטים של טשטוש וזכוכית מט",
      },
      {
        id: "cosmism",
        title: "קוסמיזם (Cosmism)",
        description: "משחק באלמנטים קוסמיים, גלקטיים וצבעוניות ניאון עם גרדיאנטים עמוקים",
      },
    ],
  },
  {
    id: "variables",
    title: "משתני CSS ופונקציות מתקדמות",
    description: "שימוש במשתני CSS ופונקציות מתקדמות לעיצוב דינמי",
    subsections: [
      {
        id: "custom-properties",
        title: "משתני CSS (Custom Properties)",
        description: "הגדרה ושימוש במשתני CSS לקוד מודולרי יותר",
      },
      {
        id: "calc",
        title: "פונקציות calc(), min(), max() ו-clamp()",
        description: "שימוש בפונקציות חישוב לערכים דינמיים",
      },
      {
        id: "env",
        title: "הפונקציה env()",
        description: "שימוש בפונקציית env() לגישה למשתני סביבה",
      },
    ],
  },
  {
    id: "animations",
    title: "אנימציות ומעברים יצירתיים",
    description: "טכניקות ליצירת אנימציות ומעברים מרשימים",
    subsections: [
      {
        id: "property-api",
        title: "@property API לאנימציות חלקות",
        description: "שימוש ב-@property API לאנימציות של תכונות מותאמות אישית",
      },
      {
        id: "keyframes",
        title: "אנימציות מתקדמות עם @keyframes",
        description: "יצירת אנימציות מורכבות עם @keyframes",
      },
      {
        id: "transitions",
        title: "מעברים יצירתיים",
        description: "שימוש במעברים מתקדמים לאינטראקציות חלקות",
      },
    ],
  },
  {
    id: "grid",
    title: "גריד ופלקסבוקס מתקדמים",
    description: "טכניקות מתקדמות לפריסת אלמנטים",
    subsections: [
      {
        id: "dynamic-grid",
        title: "מבנה גריד דינמי",
        description: "יצירת מבני גריד דינמיים שמסתגלים לתוכן",
      },
      {
        id: "advanced-flex",
        title: "פלקסבוקס מתקדם",
        description: "טכניקות פלקסבוקס מתקדמות לפריסות מורכבות",
      },
    ],
  },
  {
    id: "selectors",
    title: "סלקטורים וקומבינטורים חדישים",
    description: "סלקטורים מודרניים לקוד CSS יעיל יותר",
    subsections: [
      {
        id: "advanced-selectors",
        title: "סלקטורים מתקדמים",
        description: "שימוש בסלקטורים כמו :is(), :where() ו-:has()",
      },
      {
        id: "attribute-selectors",
        title: "Attribute Selectors מתקדמים",
        description: "שימוש בסלקטורים מבוססי מאפיינים",
      },
    ],
  },
  {
    id: "responsive",
    title: "טכניקות לעיצוב רספונסיבי",
    description: "שיטות מתקדמות לעיצוב רספונסיבי",
    subsections: [
      {
        id: "container-queries",
        title: "Container Queries",
        description: "שימוש ב-Container Queries לעיצוב רספונסיבי מתקדם",
      },
      {
        id: "media-features",
        title: "Media Features החדשות",
        description: "שימוש במאפייני מדיה חדשים לחוויית משתמש משופרת",
      },
    ],
  },
  {
    id: "filters",
    title: "פילטרים ואפקטים ויזואליים",
    description: "אפקטים ויזואליים מתקדמים עם CSS",
    subsections: [
      {
        id: "advanced-filters",
        title: "פילטרים מתקדמים",
        description: "שימוש בפילטרים מתקדמים ליצירת אפקטים ויזואליים",
      },
      {
        id: "blend-modes",
        title: "Blend Modes",
        description: "שימוש ב-blend modes לאפקטים ויזואליים מורכבים",
      },
    ],
  },
  {
    id: "patterns",
    title: "דפוסי עיצוב חדשניים",
    description: "דפוסי עיצוב מודרניים ליצירת ממשקים ייחודיים",
    subsections: [
      {
        id: "scroll-animations",
        title: "Scroll-linked Animations",
        description: "אנימציות המקושרות לגלילת המשתמש",
      },
      {
        id: "overscroll",
        title: "Overscroll Behaviors",
        description: "שליטה בהתנהגות הגלילה מעבר לגבולות האלמנט",
      },
      {
        id: "unconventional",
        title: "מבנים לא-קונבנציונליים",
        description: "יצירת מבנים ייחודיים עם CSS",
      },
    ],
  },
  {
    id: "typography",
    title: "גופנים וטיפוגרפיה מתקדמת",
    description: "טכניקות מתקדמות לעבודה עם טקסט וגופנים",
    subsections: [
      {
        id: "variable-fonts",
        title: "גופנים משתנים (Variable Fonts)",
        description: "שימוש בגופנים משתנים לחוויית טיפוגרפיה עשירה",
      },
      {
        id: "typography-features",
        title: "מאפיינים טיפוגרפיים מתקדמים",
        description: "שימוש במאפיינים טיפוגרפיים מתקדמים לשיפור הקריאות",
      },
      {
        id: "custom-fonts",
        title: "גופנים מותאמים ו-font-display",
        description: "טעינה אופטימלית של גופנים מותאמים",
      },
    ],
  },
  {
    id: "performance",
    title: "ביצועים ואופטימיזציה",
    description: "טכניקות לשיפור ביצועי CSS",
    subsections: [
      {
        id: "content-visibility",
        title: "Content Visibility",
        description: "שימוש ב-content-visibility לשיפור ביצועי רינדור",
      },
      {
        id: "aspect-ratio",
        title: "Aspect Ratio",
        description: "שימוש ב-aspect-ratio לשמירה על יחסי גובה-רוחב",
      },
      {
        id: "resources",
        title: "טעינת משאבים",
        description: "אופטימיזציה של טעינת משאבים",
      },
    ],
  },
  {
    id: "accessibility",
    title: "נגישות ודפוסי עיצוב אינקלוסיביים",
    description: "יצירת עיצובים נגישים לכולם",
    subsections: [
      {
        id: "focus-contrast",
        title: "פונקציות focus וקונטרסט",
        description: "שיפור נגישות עם פונקציות focus וקונטרסט",
      },
      {
        id: "accessibility-patterns",
        title: "תבניות לשיפור נגישות",
        description: "דפוסי עיצוב לשיפור נגישות",
      },
    ],
  },
  {
    id: "dark-mode",
    title: "ממשקי משתמש הפוכים (Dark Mode)",
    description: "יישום מצב כהה באתרים",
    subsections: [
      {
        id: "dark-mode-solution",
        title: "פתרון מקיף ל-Dark Mode",
        description: "יישום מקיף של מצב כהה באתר",
      },
      {
        id: "shadows-colors",
        title: "צללים וצבעים במצב כהה",
        description: "התאמת צללים וצבעים למצב כהה",
      },
    ],
  },
  {
    id: "layers",
    title: "CSS Layers ומודולריות מתקדמת",
    description: "ארגון קוד CSS עם שכבות",
    subsections: [
      {
        id: "cascade-layers",
        title: "שימוש ב-CSS Cascade Layers",
        description: "ארגון קוד CSS עם שכבות מפל",
      },
      {
        id: "code-organization",
        title: "מודולים מתקדמים וארגון קוד",
        description: "טכניקות לארגון קוד CSS מודולרי",
      },
    ],
  },
  {
    id: "borders",
    title: "מודלים מתקדמים לסגירה ועיצוב גבולות",
    description: "טכניקות מתקדמות לעיצוב גבולות",
    subsections: [
      {
        id: "complex-borders",
        title: "צורות גבול מורכבות",
        description: "יצירת גבולות מורכבים עם CSS",
      },
      {
        id: "animated-borders",
        title: "גבולות אנימטיביים ומסגרות",
        description: "יצירת גבולות אנימטיביים ומסגרות מעניינות",
      },
    ],
  },
  {
    id: "tools",
    title: "כלים ומשאבים מומלצים",
    description: "כלים ומשאבים לפיתוח CSS מודרני",
    subsections: [
      {
        id: "frameworks",
        title: "מסגרות CSS מודרניות",
        description: "מסגרות CSS מומלצות לפיתוח מודרני",
      },
      {
        id: "dev-tools",
        title: "כלי פיתוח ועזרים",
        description: "כלים לפיתוח CSS יעיל יותר",
      },
      {
        id: "ui-libraries",
        title: "ספריות UI מומלצות",
        description: "ספריות UI מומלצות לפיתוח מהיר",
      },
    ],
  },
]
