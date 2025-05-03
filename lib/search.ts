import type { SearchResult } from "@/components/search-dialog"

// This is a mock search index that would typically be generated from your content
// In a real application, you might use a library like Lunr.js or Fuse.js for better search
const searchIndex = [
  {
    title: "ניאומורפיזם מתקדם",
    section: "מבוא למגמות עיצוב מודרניות",
    content:
      "ניאומורפיזם הוא סגנון עיצוב שמשלב אלמנטים של סקיאומורפיזם עם מינימליזם מודרני. הוא מתאפיין בצורות רכות, צללים עדינים ואפקט בליטה.",
    url: "/sections/intro#neomorphism",
  },
  {
    title: "גלסמורפיזם (עיצוב זכוכית)",
    section: "מבוא למגמות עיצוב מודרניות",
    content:
      "גלסמורפיזם הוא סגנון עיצוב שמדמה אפקט של זכוכית מט או חצי-שקופה. הוא מתאפיין בשקיפות חלקית, טשטוש רקע ומסגרת דקה.",
    url: "/sections/intro#glassmorphism",
  },
  {
    title: "קוסמיזם (Cosmism)",
    section: "מבוא למגמות עיצוב מודרניות",
    content:
      "קוסמיזם הוא סגנון עיצוב שמתמקד באסתטיקה קוסמית וחלל חיצון, עם גרדיאנטים עמוקים, צבעי ניאון וטקסטורות שמדמות חלל.",
    url: "/sections/intro#cosmism",
  },
  {
    title: "משתני CSS (Custom Properties)",
    section: "משתני CSS ופונקציות מתקדמות",
    content:
      "משתני CSS, הידועים גם כ-Custom Properties, מאפשרים לך להגדיר ערכים שניתן לשימוש חוזר ברחבי גיליון הסגנון שלך.",
    url: "/sections/variables#custom-properties",
  },
  {
    title: "פונקציות calc(), min(), max() ו-clamp()",
    section: "משתני CSS ופונקציות מתקדמות",
    content:
      "פונקציות אלו מאפשרות לבצע חישובים מתמטיים ולבחור ערכים מינימליים או מקסימליים בזמן ריצה, מה שמאפשר עיצוב דינמי ורספונסיבי.",
    url: "/sections/variables#calc",
  },
  {
    title: "@property API לאנימציות חלקות",
    section: "אנימציות ומעברים יצירתיים",
    content:
      "ה-@property API מאפשר להגדיר תכונות מותאמות אישית עם טיפוסי נתונים, ערכים התחלתיים וירושה, מה שמאפשר אנימציות חלקות יותר.",
    url: "/sections/animations#property-api",
  },
  {
    title: "אנימציות מתקדמות עם @keyframes",
    section: "אנימציות ומעברים יצירתיים",
    content: "שימוש ב-@keyframes מאפשר יצירת אנימציות מורכבות עם שליטה מדויקת בכל שלב של האנימציה.",
    url: "/sections/animations#keyframes",
  },
  {
    title: "מבנה גריד דינמי",
    section: "גריד ופלקסבוקס מתקדמים",
    content:
      "גריד דינמי מאפשר יצירת פריסות שמסתגלות אוטומטית לתוכן ולגודל המסך, עם שימוש בפונקציות כמו auto-fit ו-minmax.",
    url: "/sections/grid#dynamic-grid",
  },
  {
    title: "סלקטורים מתקדמים",
    section: "סלקטורים וקומבינטורים חדישים",
    content: "סלקטורים מתקדמים כמו :is(), :where() ו-:has() מאפשרים בחירה מדויקת יותר של אלמנטים ומפשטים את הקוד.",
    url: "/sections/selectors#advanced-selectors",
  },
  {
    title: "Container Queries",
    section: "טכניקות לעיצוב רספונסיבי",
    content:
      "Container Queries מאפשרים לעצב אלמנטים בהתאם לגודל המכיל שלהם, ולא רק לגודל החלון, מה שמאפשר עיצוב רספונסיבי ברמת הרכיב.",
    url: "/sections/responsive#container-queries",
  },
  {
    title: "פתרון מקיף ל-Dark Mode",
    section: "ממשקי משתמש הפוכים (Dark Mode)",
    content: "יישום מקיף של מצב כהה באתר, כולל שימוש במשתני CSS, media queries ותמיכה בהעדפות משתמש.",
    url: "/sections/dark-mode#dark-mode-solution",
  },
  {
    title: "שימוש ב-CSS Cascade Layers",
    section: "CSS Layers ומודולריות מתקדמת",
    content: "CSS Cascade Layers מאפשרות שליטה טובה יותר בקדימויות של סגנונות, מה שמאפשר ארגון קוד מודולרי יותר.",
    url: "/sections/layers#cascade-layers",
  },
  {
    title: "צורות גבול מורכבות",
    section: "מודלים מתקדמים לסגירה ועיצוב גבולות",
    content:
      "יצירת גבולות מורכבים ולא רגילים באמצעות טכניקות CSS מתקדמות כמו clip-path, border-image ו-background-image.",
    url: "/sections/borders#complex-borders",
  },
  {
    title: "Content Visibility",
    section: "ביצועים ואופטימיזציה",
    content: "שימוש ב-content-visibility לשיפור ביצועי רינדור על ידי דחיית רינדור של תוכן שאינו נראה למשתמש.",
    url: "/sections/performance#content-visibility",
  },
  {
    title: "פונקציות focus וקונטרסט",
    section: "נגישות ודפוסי עיצוב אינקלוסיביים",
    content: "שיפור נגישות עם פונקציות focus וקונטרסט, כולל שימוש ב-:focus-visible ושיפור ניגודיות צבעים.",
    url: "/sections/accessibility#focus-contrast",
  },
]

export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim() === "") {
    return []
  }

  const normalizedQuery = query.trim().toLowerCase()

  return searchIndex.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.content.toLowerCase().includes(normalizedQuery) ||
      item.section.toLowerCase().includes(normalizedQuery)
    )
  })
}
