"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sparkles,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  MessageSquare,
  Save,
  Loader2,
  Video,
  VideoOff,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  interviewQuestions,
  generateFollowUpQuestion,
  analyzeAnswer,
  generateCustomQuestions,
  detectLanguage,
  type InterviewQuestion,
  type InterviewFeedback,
  type ToneAnalysis,
} from "@/lib/huggingface"

interface AiInterviewerProps {
  resumeData: any
  onSaveFeedback: (feedback: any) => void
}

export function AiInterviewer({ resumeData, onSaveFeedback }: AiInterviewerProps) {
  const [activeTab, setActiveTab] = useState("prepare")
  const [isLoading, setIsLoading] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<InterviewQuestion[]>([])
  const [customQuestions, setCustomQuestions] = useState<InterviewQuestion[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>(interviewQuestions)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [interviewInProgress, setInterviewInProgress] = useState(false)
  const [interviewPaused, setInterviewPaused] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<InterviewFeedback | null>(null)
  const [allFeedback, setAllFeedback] = useState<Record<string, InterviewFeedback>>({})
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [interviewSettings, setInterviewSettings] = useState({
    timePerQuestion: 2, // minutes
    followUpQuestions: true,
    autoFeedback: true,
    recordSession: false,
    toneAnalysis: true,
  })
  const [remainingTime, setRemainingTime] = useState(interviewSettings.timePerQuestion * 60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

  // Filter questions based on selected category, difficulty, and language
  useEffect(() => {
    let filtered = [...interviewQuestions]

    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter)
    }

    if (languageFilter !== "all") {
      filtered = filtered.filter((q) => q.language === languageFilter)
    }

    setFilteredQuestions(filtered)
  }, [categoryFilter, difficultyFilter, languageFilter])

  // Handle timer for interview questions
  useEffect(() => {
    if (interviewInProgress && !interviewPaused && !interviewCompleted) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [interviewInProgress, interviewPaused, interviewCompleted])

  // Reset timer when moving to a new question
  useEffect(() => {
    setRemainingTime(interviewSettings.timePerQuestion * 60)
  }, [currentQuestionIndex, interviewSettings.timePerQuestion])

  // Handle video stream
  useEffect(() => {
    let stream: MediaStream | null = null

    const setupVideo = async () => {
      if (isVideoEnabled && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioEnabled })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }

          // Set up recording if enabled
          if (interviewSettings.recordSession) {
            mediaRecorderRef.current = new MediaRecorder(stream)
            setRecordedChunks([])

            mediaRecorderRef.current.ondataavailable = (event) => {
              if (event.data.size > 0) {
                setRecordedChunks((prev) => [...prev, event.data])
              }
            }

            mediaRecorderRef.current.onstop = () => {
              const blob = new Blob(recordedChunks, { type: "video/webm" })
              const url = URL.createObjectURL(blob)
              setRecordingUrl(url)
            }

            mediaRecorderRef.current.start()
          }
        } catch (error) {
          console.error("Error accessing camera:", error)
          setIsVideoEnabled(false)
        }
      }
    }

    if (interviewInProgress) {
      setupVideo()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isVideoEnabled, isAudioEnabled, interviewInProgress, interviewSettings.recordSession, recordedChunks])

  // Auto-detect language when job description changes
  useEffect(() => {
    const detectJobDescriptionLanguage = async () => {
      if (jobDescription.trim().length > 20) {
        const detectedLanguage = await detectLanguage(jobDescription)
        setSelectedLanguage(detectedLanguage)
        setLanguageFilter(detectedLanguage)
      }
    }

    detectJobDescriptionLanguage()
  }, [jobDescription])

  const handleGenerateCustomQuestions = async () => {
    if (!jobDescription) return

    setIsLoading(true)
    try {
      const questions = await generateCustomQuestions(resumeData, jobDescription, 5, selectedLanguage)
      setCustomQuestions(questions)
    } catch (error) {
      console.error("Error generating custom questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleQuestionSelection = (question: InterviewQuestion) => {
    if (selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q.id !== question.id))
    } else {
      setSelectedQuestions([...selectedQuestions, question])
    }
  }

  const startInterview = () => {
    if (selectedQuestions.length === 0) return

    setInterviewInProgress(true)
    setInterviewCompleted(false)
    setCurrentQuestionIndex(0)
    setCurrentAnswer("")
    setAllFeedback({})
    setActiveTab("interview")
  }

  const pauseInterview = () => {
    setInterviewPaused(!interviewPaused)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (!interviewPaused && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
    } else if (interviewPaused && mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
    }
  }

  const nextQuestion = async () => {
    // Save feedback for current question if auto-feedback is enabled
    if (interviewSettings.autoFeedback && currentAnswer.trim()) {
      await getFeedback()
    }

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer("")
      setFeedbackVisible(false)
      setCurrentFeedback(null)
    } else {
      // End of interview
      setInterviewCompleted(true)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }

  const getFeedback = async () => {
    if (!currentAnswer.trim()) return

    setIsLoading(true)
    try {
      const currentQuestion = selectedQuestions[currentQuestionIndex]
      const language = currentQuestion.language || "en"

      const feedback = await analyzeAnswer(currentQuestion.question, currentAnswer, language)

      setCurrentFeedback(feedback)
      setFeedbackVisible(true)

      // Save feedback for summary
      setAllFeedback((prev) => ({
        ...prev,
        [currentQuestion.id]: feedback,
      }))
    } catch (error) {
      console.error("Error getting feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFollowUpQuestion = async () => {
    if (!currentAnswer.trim()) return

    setIsLoading(true)
    try {
      const currentQuestion = selectedQuestions[currentQuestionIndex]
      const language = currentQuestion.language || "en"

      const followUp = await generateFollowUpQuestion(currentQuestion.question, currentAnswer, language)

      // Add the follow-up as a new question
      const newQuestion: InterviewQuestion = {
        id: `followup-${Date.now()}`,
        question: followUp,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        language: language,
      }

      setSelectedQuestions([
        ...selectedQuestions.slice(0, currentQuestionIndex + 1),
        newQuestion,
        ...selectedQuestions.slice(currentQuestionIndex + 1),
      ])

      // Move to the follow-up question
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer("")
      setFeedbackVisible(false)
      setCurrentFeedback(null)
    } catch (error) {
      console.error("Error getting follow-up question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveInterviewResults = () => {
    onSaveFeedback({
      date: new Date().toISOString(),
      questions: selectedQuestions,
      feedback: allFeedback,
      recordingUrl: recordingUrl,
      overallScore: calculateOverallScore(),
    })
  }

  const calculateOverallScore = () => {
    const scores = Object.values(allFeedback).map((f) => f.score)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const renderQuestionList = (questions: InterviewQuestion[], selectable = true) => (
    <div className="space-y-2 mt-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className={`p-3 border rounded-md flex items-start gap-3 ${
            selectable && selectedQuestions.some((q) => q.id === question.id) ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => selectable && toggleQuestionSelection(question)}
        >
          {selectable && (
            <div className="mt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedQuestions.some((q) => q.id === question.id)
                    ? "bg-primary border-primary text-white"
                    : "border-muted-foreground"
                }`}
              >
                {selectedQuestions.some((q) => q.id === question.id) && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{question.question}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">
                {question.category}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {question.difficulty}
              </Badge>
              {question.language && (
                <Badge variant="outline" className="text-xs">
                  {question.language === "he" ? "עברית" : question.language === "en" ? "English" : question.language}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Render tone analysis visualization
  const renderToneAnalysis = (toneAnalysis: ToneAnalysis) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium flex items-center gap-1">
        <BarChart3 className="h-4 w-4" />
        Tone Analysis
      </h4>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Confidence</span>
            <span>{toneAnalysis.confidence}%</span>
          </div>
          <Progress value={toneAnalysis.confidence} className="h-2" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Clarity</span>
            <span>{toneAnalysis.clarity}%</span>
          </div>
          <Progress value={toneAnalysis.clarity} className="h-2" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Enthusiasm</span>
            <span>{toneAnalysis.enthusiasm}%</span>
          </div>
          <Progress value={toneAnalysis.enthusiasm} className="h-2" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Professionalism</span>
            <span>{toneAnalysis.professionalism}%</span>
          </div>
          <Progress value={toneAnalysis.professionalism} className="h-2" />
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{toneAnalysis.dominantTone}</Badge>
          <span className="text-xs text-muted-foreground">Dominant Tone</span>
        </div>
        <p className="text-sm">{toneAnalysis.toneInsights}</p>
      </div>
    </div>
  )

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AI Interview Simulator</h2>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Hugging Face
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger
              value="prepare"
              className="flex items-center gap-2"
              disabled={interviewInProgress && !interviewCompleted}
            >
              <Briefcase className="h-4 w-4" />
              <span>Prepare</span>
            </TabsTrigger>
            <TabsTrigger
              value="interview"
              className="flex items-center gap-2"
              disabled={!interviewInProgress && !interviewCompleted}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Interview</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!interviewCompleted}>
              <Lightbulb className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prepare">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Interview Settings</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Interview Language</Label>
                          <p className="text-sm text-muted-foreground">Select the language for your interview</p>
                        </div>
                        <Select
                          value={selectedLanguage}
                          onValueChange={(value) => {
                            setSelectedLanguage(value)
                            setLanguageFilter(value)
                          }}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="he">עברית</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="time-per-question">Time per question</Label>
                          <p className="text-sm text-muted-foreground">
                            {interviewSettings.timePerQuestion} minute
                            {interviewSettings.timePerQuestion !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Select
                          value={interviewSettings.timePerQuestion.toString()}
                          onValueChange={(value) =>
                            setInterviewSettings({
                              ...interviewSettings,
                              timePerQuestion: Number.parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 min</SelectItem>
                            <SelectItem value="2">2 min</SelectItem>
                            <SelectItem value="3">3 min</SelectItem>
                            <SelectItem value="5">5 min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Follow-up questions</Label>
                          <p className="text-sm text-muted-foreground">AI will ask relevant follow-up questions</p>
                        </div>
                        <Switch
                          checked={interviewSettings.followUpQuestions}
                          onCheckedChange={(checked) =>
                            setInterviewSettings({
                              ...interviewSettings,
                              followUpQuestions: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatic feedback</Label>
                          <p className="text-sm text-muted-foreground">Get AI feedback after each answer</p>
                        </div>
                        <Switch
                          checked={interviewSettings.autoFeedback}
                          onCheckedChange={(checked) =>
                            setInterviewSettings({
                              ...interviewSettings,
                              autoFeedback: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Tone analysis</Label>
                          <p className="text-sm text-muted-foreground">Analyze confidence, clarity, and tone</p>
                        </div>
                        <Switch
                          checked={interviewSettings.toneAnalysis}
                          onCheckedChange={(checked) =>
                            setInterviewSettings({
                              ...interviewSettings,
                              toneAnalysis: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Record session</Label>
                          <p className="text-sm text-muted-foreground">Save video/audio for later review</p>
                        </div>
                        <Switch
                          checked={interviewSettings.recordSession}
                          onCheckedChange={(checked) =>
                            setInterviewSettings({
                              ...interviewSettings,
                              recordSession: checked,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Generate Custom Questions</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="job-description">Job Description</Label>
                          <Textarea
                            id="job-description"
                            placeholder={
                              selectedLanguage === "he"
                                ? "הדבק את תיאור המשרה כאן כדי ליצור שאלות רלוונטיות..."
                                : "Paste the job description here to generate relevant questions..."
                            }
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={5}
                            className="mt-1.5"
                            dir={selectedLanguage === "he" ? "rtl" : "ltr"}
                          />
                        </div>
                        <Button
                          onClick={handleGenerateCustomQuestions}
                          disabled={!jobDescription || isLoading}
                          className="w-full"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {selectedLanguage === "he" ? "מייצר שאלות..." : "Generating..."}
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              {selectedLanguage === "he" ? "צור שאלות מותאמות אישית" : "Generate Custom Questions"}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {selectedLanguage === "he" ? "בחר שאלות לראיון" : "Select Interview Questions"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder={selectedLanguage === "he" ? "קטגוריה" : "Category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {selectedLanguage === "he" ? "כל הקטגוריות" : "All Categories"}
                        </SelectItem>
                        <SelectItem value="technical">{selectedLanguage === "he" ? "טכני" : "Technical"}</SelectItem>
                        <SelectItem value="behavioral">
                          {selectedLanguage === "he" ? "התנהגותי" : "Behavioral"}
                        </SelectItem>
                        <SelectItem value="experience">
                          {selectedLanguage === "he" ? "ניסיון" : "Experience"}
                        </SelectItem>
                        <SelectItem value="general">{selectedLanguage === "he" ? "כללי" : "General"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder={selectedLanguage === "he" ? "רמת קושי" : "Difficulty"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{selectedLanguage === "he" ? "כל הרמות" : "All Levels"}</SelectItem>
                        <SelectItem value="beginner">{selectedLanguage === "he" ? "מתחיל" : "Beginner"}</SelectItem>
                        <SelectItem value="intermediate">
                          {selectedLanguage === "he" ? "בינוני" : "Intermediate"}
                        </SelectItem>
                        <SelectItem value="advanced">{selectedLanguage === "he" ? "מתקדם" : "Advanced"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Accordion type="single" collapsible defaultValue="standard">
                  <AccordionItem value="standard">
                    <AccordionTrigger>
                      {selectedLanguage === "he" ? "שאלות סטנדרטיות" : "Standard Questions"} ({filteredQuestions.length}
                      )
                    </AccordionTrigger>
                    <AccordionContent>{renderQuestionList(filteredQuestions)}</AccordionContent>
                  </AccordionItem>

                  {customQuestions.length > 0 && (
                    <AccordionItem value="custom">
                      <AccordionTrigger>
                        {selectedLanguage === "he" ? "שאלות מותאמות אישית" : "Custom Questions"} (
                        {customQuestions.length})
                      </AccordionTrigger>
                      <AccordionContent>{renderQuestionList(customQuestions)}</AccordionContent>
                    </AccordionItem>
                  )}

                  {selectedQuestions.length > 0 && (
                    <AccordionItem value="selected">
                      <AccordionTrigger>
                        {selectedLanguage === "he" ? "שאלות שנבחרו" : "Selected Questions"} ({selectedQuestions.length})
                      </AccordionTrigger>
                      <AccordionContent>{renderQuestionList(selectedQuestions, false)}</AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                <div className="flex justify-end mt-6">
                  <Button onClick={startInterview} disabled={selectedQuestions.length === 0} className="gap-2">
                    <Play className="h-4 w-4" />
                    {selectedLanguage === "he"
                      ? `התחל ראיון (${selectedQuestions.length} שאלות)`
                      : `Start Interview (${selectedQuestions.length} questions)`}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interview">
            <div className="space-y-6">
              {!interviewCompleted ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle>
                                {selectedLanguage === "he"
                                  ? `שאלה ${currentQuestionIndex + 1} מתוך ${selectedQuestions.length}`
                                  : `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`}
                              </CardTitle>
                              <CardDescription>
                                {selectedQuestions[currentQuestionIndex]?.category},{" "}
                                {selectedQuestions[currentQuestionIndex]?.difficulty} level
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span
                                className={`${remainingTime < 30 ? "text-red-500 font-bold" : "text-muted-foreground"}`}
                              >
                                {formatTime(remainingTime)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p
                            className="text-lg font-medium"
                            dir={selectedQuestions[currentQuestionIndex]?.language === "he" ? "rtl" : "ltr"}
                          >
                            {selectedQuestions[currentQuestionIndex]?.question}
                          </p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setIsVideoEnabled(!isVideoEnabled)}>
                              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
                              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={pauseInterview}>
                              {interviewPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                              {interviewPaused
                                ? selectedLanguage === "he"
                                  ? "המשך"
                                  : "Resume"
                                : selectedLanguage === "he"
                                  ? "השהה"
                                  : "Pause"}
                            </Button>
                            <Button onClick={nextQuestion}>
                              <SkipForward className="h-4 w-4 mr-2" />
                              {selectedLanguage === "he" ? "שאלה הבאה" : "Next Question"}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>

                      {isVideoEnabled && (
                        <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted={!isAudioEnabled}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="answer">{selectedLanguage === "he" ? "התשובה שלך" : "Your Answer"}</Label>
                        <Textarea
                          id="answer"
                          placeholder={
                            selectedLanguage === "he" ? "הקלד את התשובה שלך כאן..." : "Type your answer here..."
                          }
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          rows={8}
                          className="mt-1.5"
                          disabled={interviewPaused}
                          dir={selectedQuestions[currentQuestionIndex]?.language === "he" ? "rtl" : "ltr"}
                        />
                      </div>

                      <div className="flex justify-between">
                        {interviewSettings.followUpQuestions && (
                          <Button
                            variant="outline"
                            onClick={getFollowUpQuestion}
                            disabled={!currentAnswer.trim() || isLoading || interviewPaused}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <MessageSquare className="h-4 w-4 mr-2" />
                            )}
                            {selectedLanguage === "he" ? "קבל שאלת המשך" : "Get Follow-up Question"}
                          </Button>
                        )}

                        <Button
                          onClick={getFeedback}
                          disabled={!currentAnswer.trim() || isLoading || interviewPaused || feedbackVisible}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Lightbulb className="h-4 w-4 mr-2" />
                          )}
                          {selectedLanguage === "he" ? "קבל משוב" : "Get Feedback"}
                        </Button>
                      </div>

                      {feedbackVisible && currentFeedback && (
                        <Card className="mt-4">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                {selectedLanguage === "he" ? "משוב על התשובה" : "Answer Feedback"}
                              </CardTitle>
                              <Badge
                                className={`
                                ${
                                  currentFeedback.score >= 8
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : currentFeedback.score >= 5
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }
                              `}
                              >
                                {selectedLanguage === "he"
                                  ? `ציון: ${currentFeedback.score}/10`
                                  : `Score: ${currentFeedback.score}/10`}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {selectedLanguage === "he" ? "חוזקות" : "Strengths"}
                              </h4>
                              <ul
                                className="mt-1 text-sm list-disc pl-5 space-y-1"
                                dir={selectedLanguage === "he" ? "rtl" : "ltr"}
                              >
                                {currentFeedback.strengths.map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium flex items-center gap-1 text-amber-600">
                                <XCircle className="h-4 w-4" />
                                {selectedLanguage === "he" ? "תחומים לשיפור" : "Areas for Improvement"}
                              </h4>
                              <ul
                                className="mt-1 text-sm list-disc pl-5 space-y-1"
                                dir={selectedLanguage === "he" ? "rtl" : "ltr"}
                              >
                                {currentFeedback.improvements.map((improvement, i) => (
                                  <li key={i}>{improvement}</li>
                                ))}
                              </ul>
                            </div>
                            <Separator />
                            <p className="text-sm" dir={selectedLanguage === "he" ? "rtl" : "ltr"}>
                              {currentFeedback.overallFeedback}
                            </p>

                            {interviewSettings.toneAnalysis && currentFeedback.toneAnalysis && (
                              <>
                                <Separator />
                                {renderToneAnalysis(currentFeedback.toneAnalysis)}
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <Progress value={((currentQuestionIndex + 1) / selectedQuestions.length) * 100} className="h-2" />
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedLanguage === "he" ? "הראיון הושלם!" : "Interview Completed!"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedLanguage === "he"
                      ? `השלמת את כל ${selectedQuestions.length} השאלות. צפה בתוצאות כדי לראות איך הצלחת.`
                      : `You've completed all ${selectedQuestions.length} questions. View your results to see how you did.`}
                  </p>
                  <Button onClick={() => setActiveTab("results")}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {selectedLanguage === "he" ? "צפה בתוצאות" : "View Results"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {selectedLanguage === "he" ? "תוצאות הראיון" : "Interview Results"}
                </h3>
                <Button onClick={saveInterviewResults}>
                  <Save className="h-4 w-4 mr-2" />
                  {selectedLanguage === "he" ? "שמור תוצאות" : "Save Results"}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{selectedLanguage === "he" ? "ביצועים כלליים" : "Overall Performance"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>
                        <circle
                          className={`
                            stroke-current
                            ${
                              calculateOverallScore() >= 8
                                ? "text-green-500"
                                : calculateOverallScore() >= 5
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }
                          `}
                          strokeWidth="10"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeDasharray={`${calculateOverallScore() * 25.12} 251.2`}
                          transform="rotate(-90 50 50)"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{calculateOverallScore()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {selectedLanguage === "he" ? "שאלות" : "Questions"}
                      </h4>
                      <p className="text-2xl font-bold">{selectedQuestions.length}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {selectedLanguage === "he" ? "חוזקות" : "Strengths"}
                      </h4>
                      <p className="text-2xl font-bold">
                        {Object.values(allFeedback).reduce((count, feedback) => count + feedback.strengths.length, 0)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {selectedLanguage === "he" ? "תחומים לשיפור" : "Areas to Improve"}
                      </h4>
                      <p className="text-2xl font-bold">
                        {Object.values(allFeedback).reduce(
                          (count, feedback) => count + feedback.improvements.length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  {selectedLanguage === "he" ? "משוב לפי שאלה" : "Question-by-Question Feedback"}
                </h3>
                <Accordion type="multiple" className="space-y-4">
                  {selectedQuestions.map((question, index) => (
                    <AccordionItem key={question.id} value={question.id} className="border rounded-lg">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="text-left" dir={question.language === "he" ? "rtl" : "ltr"}>
                            <span className="font-medium">
                              {selectedLanguage === "he" ? `שאלה ${index + 1}:` : `Question ${index + 1}:`}
                            </span>{" "}
                            {question.question.length > 60
                              ? `${question.question.substring(0, 60)}...`
                              : question.question}
                          </div>
                          {allFeedback[question.id] && (
                            <Badge
                              className={`
                              ${
                                allFeedback[question.id].score >= 8
                                  ? "bg-green-100 text-green-800"
                                  : allFeedback[question.id].score >= 5
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            `}
                            >
                              {allFeedback[question.id].score}/10
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {allFeedback[question.id] ? (
                          <div className="space-y-4" dir={question.language === "he" ? "rtl" : "ltr"}>
                            <div>
                              <h4 className="text-sm font-medium">
                                {selectedLanguage === "he" ? "חוזקות" : "Strengths"}
                              </h4>
                              <ul className="mt-1 text-sm list-disc pl-5 space-y-1">
                                {allFeedback[question.id].strengths.map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                {selectedLanguage === "he" ? "תחומים לשיפור" : "Areas for Improvement"}
                              </h4>
                              <ul className="mt-1 text-sm list-disc pl-5 space-y-1">
                                {allFeedback[question.id].improvements.map((improvement, i) => (
                                  <li key={i}>{improvement}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                {selectedLanguage === "he" ? "משוב כללי" : "Overall Feedback"}
                              </h4>
                              <p className="mt-1 text-sm">{allFeedback[question.id].overallFeedback}</p>
                            </div>

                            {interviewSettings.toneAnalysis && allFeedback[question.id].toneAnalysis && (
                              <div className="pt-2 border-t">
                                {renderToneAnalysis(allFeedback[question.id].toneAnalysis!)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">
                            {selectedLanguage === "he"
                              ? "אין משוב זמין לשאלה זו."
                              : "No feedback available for this question."}
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {recordingUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {selectedLanguage === "he" ? "הקלטת הראיון" : "Interview Recording"}
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <video src={recordingUrl} controls className="w-full rounded-lg" />
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("prepare")
                    setInterviewInProgress(false)
                    setInterviewCompleted(false)
                  }}
                >
                  {selectedLanguage === "he" ? "התחל ראיון חדש" : "Start New Interview"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      {selectedLanguage === "he" ? "שמור לפורטפוליו" : "Save to Portfolio"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedLanguage === "he" ? "שמור תוצאות ראיון" : "Save Interview Results"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedLanguage === "he"
                          ? "הוסף את תוצאות הראיון הזה לפורטפוליו שלך כדי להציג את כישורי הראיון שלך."
                          : "Add these interview results to your portfolio to showcase your interview skills."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="interview-title">{selectedLanguage === "he" ? "כותרת" : "Title"}</Label>
                        <Input
                          id="interview-title"
                          placeholder={
                            selectedLanguage === "he"
                              ? "לדוגמה, תרגול ראיון למפתח פרונטאנד"
                              : "e.g., Frontend Developer Interview Practice"
                          }
                          dir={selectedLanguage === "he" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interview-notes">{selectedLanguage === "he" ? "הערות" : "Notes"}</Label>
                        <Textarea
                          id="interview-notes"
                          placeholder={
                            selectedLanguage === "he"
                              ? "הוסף הערות כלשהן על תרגול הראיון הזה..."
                              : "Add any notes about this interview practice..."
                          }
                          dir={selectedLanguage === "he" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="public" />
                        <Label htmlFor="public">
                          {selectedLanguage === "he"
                            ? "הפוך את התוצאות לציבוריות בפורטפוליו"
                            : "Make results public in portfolio"}
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {selectedLanguage === "he" ? "שמור לפורטפוליו" : "Save to Portfolio"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
