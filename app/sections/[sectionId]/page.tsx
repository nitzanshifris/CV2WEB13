import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

// This would normally come from a database or CMS
const sections = {
  intro: {
    title: "מבוא למגמות עיצוב מודרניות",
    content: `
      <p>העיצוב המודרני מתאפיין במינימליזם, צבעים נועזים, טיפוגרפיה מרשימה ומרכיבים אינטראקטיביים. בשנת 2025, המגמות המובילות כוללות:</p>
      
      <ul>
        <li><strong>ניאומורפיזם מתקדם</strong>: המשך התפתחות של סגנון הניאומורפיזם עם דגש על נגישות ושימושיות</li>
        <li><strong>גלסמורפיזם (עיצוב זכוכית)</strong>: אפקטים של טשטוש וזכוכית מט</li>
        <li><strong>מכסימליזם מודולרי</strong>: עיצובים עשירים אך מאורגנים היטב, עם דגש על פרטים והיררכיה ויזואלית</li>
        <li><strong>עיצוב פרמטרי</strong>: צורות ודפוסים הנוצרים באמצעות אלגוריתמים</li>
        <li><strong>מיקרו-אינטראקציות</strong>: תגובות קטנות ומדויקות לפעולות משתמש</li>
        <li><strong>טקסטורות תלת-ממדיות</strong>: שילוב אלמנטים עם עומק ופרספקטיבה</li>
        <li><strong>קוסמיזם (Cosmism)</strong>: משחק באלמנטים קוסמיים, גלקטיים וצבעוניות ניאון עם גרדיאנטים עמוקים</li>
        <li><strong>ביומורפיזם</strong>: צורות אורגניות, השראה מהטבע ותנועות זורמות</li>
        <li><strong>חוויות מונוכרומטיות</strong>: שימוש בגוון אחד עם וריאציות עומק וסאטורציה</li>
        <li><strong>עיצוב הוליסטי</strong>: אסתטיקה שתומכת ברווחה נפשית ובריאות דיגיטלית</li>
      </ul>
    `,
    subsections: [
      {
        id: "neomorphism",
        title: "ניאומורפיזם מתקדם",
        content: `
          <p>ניאומורפיזם הוא סגנון עיצוב שמשלב אלמנטים של סקיאומורפיזם (חיקוי אובייקטים מהעולם האמיתי) עם מינימליזם מודרני. הוא מתאפיין בצורות רכות, צללים עדינים ואפקט "בליטה" שיוצר תחושה של אלמנטים שצומחים מתוך המשטח.</p>
          
          <p>בשנת 2025, ניאומורפיזם התפתח לכיוון יותר נגיש ושימושי, עם דגש על:</p>
          
          <ul>
            <li>ניגודיות משופרת בין אלמנטים לרקע</li>
            <li>שילוב חכם עם אלמנטים שטוחים לשיפור השימושיות</li>
            <li>אינטראקטיביות משופרת עם משוב ויזואלי ברור</li>
          </ul>
        `,
      },
      {
        id: "glassmorphism",
        title: "גלסמורפיזם (עיצוב זכוכית)",
        content: `
          <p>גלסמורפיזם הוא סגנון עיצוב שמדמה אפקט של זכוכית מט או חצי-שקופה. הוא מתאפיין בשקיפות חלקית, טשטוש רקע ומסגרת דקה.</p>
          
          <p>מאפיינים עיקריים של גלסמורפיזם:</p>
          
          <ul>
            <li>שקיפות (transparency) - בדרך כלל בין 10% ל-30%</li>
            <li>טשטוש רקע (backdrop-filter: blur)</li>
            <li>גבול דק ובהיר</li>
            <li>צל עדין</li>
          </ul>
        `,
      },
      {
        id: "cosmism",
        title: "קוסמיזם (Cosmism)",
        content: `
          <p>קוסמיזם הוא סגנון עיצוב שמתמקד באסתטיקה קוסמית וחלל חיצון, עם גרדיאנטים עמוקים, צבעי ניאון וטקסטורות שמדמות חלל.</p>
          
          <p>דוגמה לסגנון קוסמיזם:</p>
        `,
      },
    ],
    codeExamples: {
      cosmism: `
.cosmic-element {
  background: linear-gradient(135deg, #0c164d 0%, #190a42 50%, #42094d 100%);
  color: #f7f0ff;
  text-shadow: 0 0 5px #c466ff, 0 0 10px #a359f5;
  box-shadow: 0 0 15px rgba(196, 102, 255, 0.5), 
              0 0 30px rgba(163, 89, 245, 0.3),
              0 0 50px rgba(102, 81, 220, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.cosmic-element::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;
  top: -25%;
  left: -25%;
  opacity: 0.6;
  animation: cosmic-drift 60s linear infinite;
  pointer-events: none;
}

@keyframes cosmic-drift {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
      `,
    },
  },
  variables: {
    title: "משתני CSS ופונקציות מתקדמות",
    content: `
      <p>משתני CSS (Custom Properties) ופונקציות מתקדמות מאפשרים לך ליצור קוד CSS דינמי, גמיש ותחזוקתי יותר.</p>
    `,
    subsections: [
      {
        id: "custom-properties",
        title: "משתני CSS (Custom Properties)",
        content: `
          <p>משתני CSS, הידועים גם כ-Custom Properties, מאפשרים לך להגדיר ערכים שניתן לשימוש חוזר ברחבי גיליון הסגנון שלך.</p>
          
          <p>יתרונות של משתני CSS:</p>
          
          <ul>
            <li>קוד תחזוקתי יותר - שינוי במקום אחד משפיע על כל המקומות שמשתמשים במשתנה</li>
            <li>תמיכה בירושה - משתנים יכולים לרשת ערכים מאלמנטים הוריים</li>
            <li>שינוי דינמי - ניתן לשנות משתנים באמצעות JavaScript</li>
            <li>תמיכה במדיה קווריז - ניתן לשנות ערכי משתנים בהתאם לגודל המסך</li>
          </ul>
        `,
      },
    ],
    codeExamples: {
      "custom-properties": `
:root {
  --primary-color: #3a86ff;
  --secondary-color: #ff006e;
  --accent-color: #8338ec;
  --text-color: #2b2d42;
  --background-color: #f8f9fa;
  
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  --border-radius: 8px;
  --transition-speed: 0.3s;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) ease-in-out;
}

.button:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}
      `,
    },
  },
}

export default function SectionPage({ params }: { params: { sectionId: string } }) {
  const section = sections[params.sectionId as keyof typeof sections]

  if (!section) {
    notFound()
  }

  // Find the index of the current section to determine prev/next
  const sectionIds = Object.keys(sections)
  const currentIndex = sectionIds.indexOf(params.sectionId)
  const prevSection = currentIndex > 0 ? sectionIds[currentIndex - 1] : null
  const nextSection = currentIndex < sectionIds.length - 1 ? sectionIds[currentIndex + 1] : null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{section.title}</h1>
        <Link href="/toc">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            תוכן העניינים
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <Card className="p-4">
              <h2 className="font-bold mb-4">בפרק זה</h2>
              <ul className="space-y-2">
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <Link href={`#${subsection.id}`} className="text-sm text-primary hover:underline">
                      {subsection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3 space-y-12">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          {section.subsections.map((subsection) => (
            <div key={subsection.id} id={subsection.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">{subsection.title}</h2>
              <div
                className="prose prose-lg dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: subsection.content }}
              />

              {/* Code example if available */}
              {section.codeExamples && section.codeExamples[subsection.id] && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">דוגמת קוד:</h3>
                  <CodeBlock code={section.codeExamples[subsection.id]} language="css" />
                </div>
              )}
            </div>
          ))}

          {/* Navigation between sections */}
          <div className="flex justify-between pt-8 border-t mt-12">
            {prevSection ? (
              <Link href={`/sections/${prevSection}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {sections[prevSection as keyof typeof sections].title}
                </Button>
              </Link>
            ) : (
              <div></div>
            )}

            {nextSection ? (
              <Link href={`/sections/${nextSection}`}>
                <Button className="gap-2">
                  {sections[nextSection as keyof typeof sections].title}
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
