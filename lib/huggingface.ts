import { HfInference } from "@huggingface/inference"

// Initialize the Hugging Face inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export type InterviewQuestion = {
  id: string
  question: string
  category: "technical" | "behavioral" | "experience" | "general"
  difficulty: "beginner" | "intermediate" | "advanced"
  language?: string
}

export type InterviewFeedback = {
  score: number // 1-10
  strengths: string[]
  improvements: string[]
  overallFeedback: string
  toneAnalysis?: ToneAnalysis
}

export type ToneAnalysis = {
  confidence: number // 0-100
  clarity: number // 0-100
  enthusiasm: number // 0-100
  professionalism: number // 0-100
  dominantTone: string
  toneInsights: string
}

// Common interview questions by category
export const interviewQuestions: InterviewQuestion[] = [
  // Original English questions
  {
    id: "1",
    question: "Tell me about yourself and your experience.",
    category: "general",
    difficulty: "beginner",
    language: "en",
  },
  {
    id: "2",
    question: "What are your greatest strengths and weaknesses?",
    category: "behavioral",
    difficulty: "beginner",
    language: "en",
  },
  {
    id: "3",
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    category: "experience",
    difficulty: "intermediate",
    language: "en",
  },
  {
    id: "4",
    question: "How do you handle stress and pressure?",
    category: "behavioral",
    difficulty: "intermediate",
    language: "en",
  },
  {
    id: "5",
    question: "Explain the difference between REST and GraphQL APIs.",
    category: "technical",
    difficulty: "intermediate",
    language: "en",
  },
  {
    id: "6",
    question: "How would you optimize a slow-loading website?",
    category: "technical",
    difficulty: "advanced",
    language: "en",
  },
  {
    id: "7",
    question: "Describe your experience with agile development methodologies.",
    category: "experience",
    difficulty: "intermediate",
    language: "en",
  },
  {
    id: "8",
    question: "Where do you see yourself in five years?",
    category: "general",
    difficulty: "beginner",
    language: "en",
  },
  {
    id: "9",
    question: "How do you stay updated with the latest industry trends?",
    category: "general",
    difficulty: "intermediate",
    language: "en",
  },
  {
    id: "10",
    question: "Explain a complex technical concept in simple terms.",
    category: "technical",
    difficulty: "advanced",
    language: "en",
  },

  // Hebrew questions
  {
    id: "he-1",
    question: "ספר/י לי על עצמך ועל הניסיון שלך.",
    category: "general",
    difficulty: "beginner",
    language: "he",
  },
  {
    id: "he-2",
    question: "מהן החוזקות והחולשות העיקריות שלך?",
    category: "behavioral",
    difficulty: "beginner",
    language: "he",
  },
  {
    id: "he-3",
    question: "תאר/י פרויקט מאתגר שעבדת עליו וכיצד התגברת על מכשולים.",
    category: "experience",
    difficulty: "intermediate",
    language: "he",
  },
  {
    id: "he-4",
    question: "כיצד את/ה מתמודד/ת עם לחץ ומתח?",
    category: "behavioral",
    difficulty: "intermediate",
    language: "he",
  },
  {
    id: "he-5",
    question: "הסבר/י את ההבדל בין ממשקי REST ו-GraphQL.",
    category: "technical",
    difficulty: "intermediate",
    language: "he",
  },
  {
    id: "he-6",
    question: "כיצד היית מייעל/ת אתר אינטרנט שנטען לאט?",
    category: "technical",
    difficulty: "advanced",
    language: "he",
  },
  {
    id: "he-7",
    question: "תאר/י את הניסיון שלך עם מתודולוגיות פיתוח אג'יליות.",
    category: "experience",
    difficulty: "intermediate",
    language: "he",
  },
  {
    id: "he-8",
    question: "איפה את/ה רואה את עצמך בעוד חמש שנים?",
    category: "general",
    difficulty: "beginner",
    language: "he",
  },
  {
    id: "he-9",
    question: "כיצד את/ה נשאר/ת מעודכן/ת עם מגמות התעשייה האחרונות?",
    category: "general",
    difficulty: "intermediate",
    language: "he",
  },
  {
    id: "he-10",
    question: "הסבר/י מושג טכני מורכב במונחים פשוטים.",
    category: "technical",
    difficulty: "advanced",
    language: "he",
  },
]

// Generate follow-up questions based on the answer
export async function generateFollowUpQuestion(
  originalQuestion: string,
  answer: string,
  language = "en",
): Promise<string> {
  try {
    let prompt = ""

    if (language === "he") {
      prompt = `
שאלת ראיון מקורית: "${originalQuestion}"
תשובת המועמד: "${answer}"

בהתבסס על תשובת המועמד, צור שאלת המשך רלוונטית שתישאל בראיון אמיתי. שאלת ההמשך צריכה לחקור עמוק יותר את הניסיון או הידע שלהם.

שאלת המשך:
`
    } else {
      prompt = `
Original interview question: "${originalQuestion}"
Candidate's answer: "${answer}"

Based on the candidate's answer, generate a relevant follow-up question that would be asked in a real interview. The follow-up should probe deeper into their experience or knowledge.

Follow-up question:
`
    }

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
      },
    })

    return response.generated_text.trim()
  } catch (error) {
    console.error("Error generating follow-up question:", error)
    return language === "he"
      ? "האם תוכל/י להרחיב יותר על התשובה הקודמת שלך?"
      : "Could you elaborate more on your previous answer?"
  }
}

// Analyze the tone of the answer
export async function analyzeTone(answer: string, language = "en"): Promise<ToneAnalysis> {
  try {
    let prompt = ""

    if (language === "he") {
      prompt = `
תשובת המועמד בראיון: "${answer}"

נתח את הטון והסגנון של התשובה. התייחס לביטחון, בהירות, התלהבות ומקצועיות. 
הערך כל קטגוריה בסולם של 0-100 והסבר את הניתוח שלך.

תבנית התשובה (JSON):
{
  "confidence": [ציון מספרי],
  "clarity": [ציון מספרי],
  "enthusiasm": [ציון מספרי],
  "professionalism": [ציון מספרי],
  "dominantTone": "[הטון הדומיננטי]",
  "toneInsights": "[תובנות מפורטות על הטון והסגנון]"
}
`
    } else {
      prompt = `
Interview candidate's answer: "${answer}"

Analyze the tone and style of this answer. Consider confidence, clarity, enthusiasm, and professionalism.
Rate each category on a scale of 0-100 and explain your analysis.

Format your response as JSON:
{
  "confidence": [numeric score],
  "clarity": [numeric score],
  "enthusiasm": [numeric score],
  "professionalism": [numeric score],
  "dominantTone": "[the dominant tone]",
  "toneInsights": "[detailed insights about tone and style]"
}
`
    }

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
      },
    })

    // Extract the JSON from the response
    const jsonMatch = response.generated_text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }

    const toneAnalysis = JSON.parse(jsonMatch[0]) as ToneAnalysis
    return toneAnalysis
  } catch (error) {
    console.error("Error analyzing tone:", error)
    return {
      confidence: 50,
      clarity: 50,
      enthusiasm: 50,
      professionalism: 50,
      dominantTone: language === "he" ? "ניטרלי" : "Neutral",
      toneInsights:
        language === "he"
          ? "לא ניתן היה לנתח את הטון באופן מדויק. נסה שוב עם תשובה ארוכה יותר."
          : "Could not analyze tone accurately. Try again with a longer answer.",
    }
  }
}

// Analyze the answer and provide feedback with tone analysis
export async function analyzeAnswer(question: string, answer: string, language = "en"): Promise<InterviewFeedback> {
  try {
    // First get the tone analysis
    const toneAnalysis = await analyzeTone(answer, language)

    let prompt = ""

    if (language === "he") {
      prompt = `
שאלת ראיון: "${question}"
תשובת המועמד: "${answer}"

נתח את תשובת המועמד וספק משוב מפורט עם הפרטים הבאים:
1. ציון (1-10)
2. חוזקות (רשימה של 2-3 נקודות)
3. תחומים לשיפור (רשימה של 2-3 נקודות)
4. משוב כללי (2-3 משפטים)

פרמט את התשובה שלך כ-JSON:
{
  "score": מספר,
  "strengths": ["נקודה1", "נקודה2", ...],
  "improvements": ["נקודה1", "נקודה2", ...],
  "overallFeedback": "טקסט"
}
`
    } else {
      prompt = `
Interview question: "${question}"
Candidate's answer: "${answer}"

Analyze the candidate's answer and provide detailed feedback with the following:
1. Score (1-10)
2. Strengths (list 2-3 points)
3. Areas for improvement (list 2-3 points)
4. Overall feedback (2-3 sentences)

Format your response as JSON:
{
  "score": number,
  "strengths": ["point1", "point2", ...],
  "improvements": ["point1", "point2", ...],
  "overallFeedback": "text"
}
`
    }

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
      },
    })

    // Extract the JSON from the response
    const jsonMatch = response.generated_text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }

    const feedback = JSON.parse(jsonMatch[0]) as InterviewFeedback

    // Add the tone analysis to the feedback
    feedback.toneAnalysis = toneAnalysis

    return feedback
  } catch (error) {
    console.error("Error analyzing answer:", error)

    if (language === "he") {
      return {
        score: 5,
        strengths: ["ניסיון טוב בניסוח תשובה"],
        improvements: ["שקול/י לספק דוגמאות ספציפיות יותר", "בנה/י את התשובה שלך בצורה ברורה יותר"],
        overallFeedback: "התשובה שלך מראה פוטנציאל אך דורשת יותר פירוט ומבנה.",
      }
    } else {
      return {
        score: 5,
        strengths: ["Good attempt at answering the question"],
        improvements: ["Consider providing more specific examples", "Structure your answer more clearly"],
        overallFeedback: "Your answer shows potential but needs more detail and structure.",
      }
    }
  }
}

// Generate custom interview questions based on resume data and job description
export async function generateCustomQuestions(
  resumeData: any,
  jobDescription: string,
  count = 5,
  language = "en",
): Promise<InterviewQuestion[]> {
  try {
    // Format resume data for the prompt
    const skills = resumeData.skills.map((s: any) => s.name).join(", ")
    const experience = resumeData.experience.map((e: any) => `${e.title} at ${e.company}: ${e.description}`).join("\n")

    let prompt = ""

    if (language === "he") {
      prompt = `
בהתבסס על מידע קורות החיים הבא ותיאור המשרה, צור ${count} שאלות ראיון רלוונטיות שמראיין עשוי לשאול את המועמד הזה. כלול תמהיל של שאלות טכניות, התנהגותיות ושאלות מבוססות ניסיון.

כישורים מקורות החיים: ${skills}

ניסיון מקורות החיים:
${experience}

תיאור משרה:
${jobDescription}

צור ${count} שאלות ראיון בפורמט JSON:
[
  {
    "id": "1",
    "question": "טקסט השאלה",
    "category": "technical|behavioral|experience|general",
    "difficulty": "beginner|intermediate|advanced",
    "language": "he"
  },
  ...
]
`
    } else {
      prompt = `
Based on the following resume information and job description, generate ${count} relevant interview questions that an interviewer might ask this candidate. Include a mix of technical, behavioral, and experience-based questions.

Resume Skills: ${skills}

Resume Experience:
${experience}

Job Description:
${jobDescription}

Generate ${count} interview questions in JSON format:
[
  {
    "id": "1",
    "question": "question text",
    "category": "technical|behavioral|experience|general",
    "difficulty": "beginner|intermediate|advanced",
    "language": "en"
  },
  ...
]
`
    }

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
      },
    })

    // Extract the JSON from the response
    const jsonMatch = response.generated_text.match(/\[[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response")
    }

    const questions = JSON.parse(jsonMatch[0]) as InterviewQuestion[]
    return questions
  } catch (error) {
    console.error("Error generating custom questions:", error)
    // Return some default questions if the API call fails
    return interviewQuestions.filter((q) => q.language === language).slice(0, count)
  }
}

// Detect language of text
export async function detectLanguage(text: string): Promise<string> {
  try {
    const prompt = `
Detect the language of the following text and respond with just the ISO language code (e.g., "en" for English, "he" for Hebrew, etc.):

"${text}"

Language code:
`

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      },
    })

    const languageCode = response.generated_text.trim().toLowerCase()

    // Basic validation - if we get something that's not a 2-letter code, default to English
    if (languageCode.length !== 2) {
      return "en"
    }

    return languageCode
  } catch (error) {
    console.error("Error detecting language:", error)
    return "en" // Default to English on error
  }
}
