import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { WebsitePreview } from "@/components/website-preview"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CursorEffects } from "@/components/cursor-effects"

// מידע לדוגמה
const sampleResumeData = {
  personalInfo: {
    name: "ישראל ישראלי",
    title: "מפתח Full Stack",
    email: "israel@example.com",
    phone: "050-1234567",
    location: "תל אביב, ישראל",
    website: "https://example.com",
    summary: "מפתח Full Stack עם ניסיון של 5 שנים בפיתוח אפליקציות ואתרים. מומחה ב-React, Node.js ו-TypeScript.",
  },
  experience: [
    {
      position: "מפתח Full Stack",
      company: 'חברת טכנולוגיה בע"מ',
      startDate: "2020",
      endDate: "היום",
      description: "פיתוח ותחזוקה של אפליקציות ואתרים בסביבת React ו-Node.js.",
      highlights: ["הובלת צוות פיתוח", "שיפור ביצועים ב-50%", "יישום CI/CD"],
    },
    {
      position: "מפתח Front-end",
      company: "סטארט-אפ חדשני",
      startDate: "2018",
      endDate: "2020",
      description: "פיתוח ממשקי משתמש מתקדמים באמצעות React ו-TypeScript.",
      highlights: ["עיצוב ופיתוח UI/UX", "אופטימיזציה לביצועים"],
    },
  ],
  education: [
    {
      degree: "תואר ראשון",
      field: "מדעי המחשב",
      institution: "אוניברסיטת תל אביב",
      startDate: "2015",
      endDate: "2018",
      description: "התמחות בפיתוח תוכנה ואלגוריתמים.",
    },
  ],
  skills: [
    { name: "JavaScript", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "React", level: 5 },
    { name: "Node.js", level: 4 },
    { name: "HTML/CSS", level: 5 },
    { name: "SQL", level: 3 },
  ],
  languages: [
    { language: "עברית", proficiency: "שפת אם" },
    { language: "אנגלית", proficiency: "שליטה מלאה" },
  ],
  projects: [
    {
      name: "מערכת ניהול לקוחות",
      description: "פיתוח מערכת CRM מתקדמת עם React ו-Node.js.",
      url: "https://example.com/crm",
      highlights: ["React", "Node.js", "MongoDB"],
    },
    {
      name: "אפליקציית מובייל",
      description: "פיתוח אפליקציה היברידית עם React Native.",
      url: "https://example.com/app",
      highlights: ["React Native", "Firebase"],
    },
  ],
}

export default function WebsitePreviewPage() {
  return (
    <div className="container py-8 relative">
      <ScrollReveal>
        <h1 className="text-3xl font-bold mb-8 gradient-text">תצוגה מקדימה של האתר</h1>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <p className="text-muted-foreground mb-8">
          להלן תצוגה מקדימה של אתר ה-CV שלך. ניתן לראות כיצד האתר ייראה במכשירים שונים ולערוך את התוכן לפי הצורך.
        </p>
      </ScrollReveal>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[600px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <WebsitePreview
          resumeData={sampleResumeData}
          templateId="professional"
          onEdit={() => console.log("Edit clicked")}
          onCustomize={() => console.log("Customize clicked")}
        />
      </Suspense>

      <ScrollReveal delay={400}>
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">טיפים לשיפור האתר שלך</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>הוסף תמונת פרופיל איכותית להגברת האמינות והמקצועיות.</li>
            <li>וודא שהתיאור האישי שלך ממוקד ומדגיש את היתרונות הייחודיים שלך.</li>
            <li>הוסף קישורים לפרויקטים ועבודות קודמות כדי להציג את היכולות שלך.</li>
            <li>התאם את הצבעים והעיצוב כך שישקפו את האישיות המקצועית שלך.</li>
            <li>בדוק את האתר במכשירים שונים כדי לוודא שהוא מגיב כראוי.</li>
          </ul>
        </div>
      </ScrollReveal>

      {/* אפקט עכבר מותאם אישית */}
      <CursorEffects
        cursorSize={24}
        cursorColor="rgba(59, 130, 246, 0.2)"
        cursorBorderColor="rgba(59, 130, 246, 0.5)"
        trailEffect={true}
        rippleEffect={true}
        rippleColor="rgba(59, 130, 246, 0.3)"
      />
    </div>
  )
}
