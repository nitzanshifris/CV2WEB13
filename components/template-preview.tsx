"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { ResumeEditor } from "@/components/resume-editor"
import type { ParsedResume } from "@/lib/resume-parser"
import { Calendar, Mail, Phone, MapPin, Globe, Download, Edit, Eye } from "lucide-react"

interface TemplatePreviewProps {
  resumeData: ParsedResume
  templateId: string
  onEdit: () => void
  onDataChange?: (updatedData: ParsedResume) => void
}

export function TemplatePreview({ resumeData, templateId, onEdit, onDataChange }: TemplatePreviewProps) {
  const [activeSection, setActiveSection] = useState("about")
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [currentData, setCurrentData] = useState<ParsedResume>(resumeData)

  // Update currentData when resumeData changes from parent
  useEffect(() => {
    setCurrentData(resumeData)
  }, [resumeData])

  // Simulate loading different sections for a more responsive feel
  const [loadedSections, setLoadedSections] = useState<string[]>(["about"])

  // הוספת אנימציות לתצוגת התבנית

  // הוספת אנימציות לטעינת סקציות
  useEffect(() => {
    const sections = ["experience", "education", "skills", "projects"]
    let index = 0

    const interval = setInterval(() => {
      if (index < sections.length) {
        setLoadedSections((prev) => [...prev, sections[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleDataChange = (updatedData: ParsedResume) => {
    setCurrentData(updatedData)
    if (onDataChange) {
      onDataChange(updatedData)
    }
  }

  // Render different templates based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case "professional":
        return renderProfessionalTemplate()
      case "creative":
        return renderCreativeTemplate()
      case "minimal":
      default:
        return renderMinimalTemplate()
    }
  }

  const renderMinimalTemplate = () => {
    return (
      <div className="bg-background min-h-[600px] w-full overflow-y-auto rounded-md shadow-sm border">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          {/* הוספת מחלקות אנימציה לאלמנטים */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{currentData.personalInfo.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{currentData.personalInfo.title}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {currentData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{currentData.personalInfo.email}</span>
                </div>
              )}
              {currentData.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{currentData.personalInfo.phone}</span>
                </div>
              )}
              {currentData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentData.personalInfo.location}</span>
                </div>
              )}
              {currentData.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{currentData.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {currentData.personalInfo.summary && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">About</h2>
              <p className="text-muted-foreground">{currentData.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {/* הוספת אנימציות לסקציות שנטענות */}
          {loadedSections.includes("experience") && currentData.experience.length > 0 && (
            <div className="mb-10 animate-slide-in-up delay-1">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Experience</h2>
              <div className="space-y-6">
                {currentData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exp.position}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {exp.startDate} - {exp.endDate || "Present"}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{exp.description}</p>
                    {exp.highlights && (
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {loadedSections.includes("education") && currentData.education.length > 0 && (
            <div className="mb-10 animate-slide-in-up delay-2">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Education</h2>
              <div className="space-y-6">
                {currentData.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {edu.degree}
                          {edu.field ? `, ${edu.field}` : ""}
                        </h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {edu.startDate} - {edu.endDate || "Present"}
                      </div>
                    </div>
                    {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {loadedSections.includes("skills") && currentData.skills.length > 0 && (
            <div className="mb-10 animate-slide-in-up delay-3">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Skills</h2>
              <div className="grid grid-cols-2 gap-4">
                {currentData.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      {skill.level && <span className="text-xs">{skill.level}/5</span>}
                    </div>
                    {skill.level && <Progress value={skill.level * 20} className="h-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {loadedSections.includes("projects") && currentData.projects && currentData.projects.length > 0 && (
            <div className="mb-10 animate-slide-in-up delay-4">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Projects</h2>
              <div className="space-y-6">
                {currentData.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm mt-1">{project.description}</p>
                    {project.url && (
                      <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                        {project.url}
                      </a>
                    )}
                    {project.highlights && (
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {project.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {loadedSections.includes("skills") && currentData.languages && currentData.languages.length > 0 && (
            <div className="mb-10 animate-slide-in-up delay-5">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Languages</h2>
              <div className="flex flex-wrap gap-4">
                {currentData.languages.map((lang, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {lang.language} {lang.proficiency && `- ${lang.proficiency}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {loadedSections.includes("skills") && currentData.certifications && currentData.certifications.length > 0 && (
            <div className="animate-slide-in-up delay-6">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Certifications</h2>
              <div className="space-y-4">
                {currentData.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} {cert.date && `- ${cert.date}`}
                    </p>
                    {cert.url && (
                      <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                        {cert.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderProfessionalTemplate = () => {
    return (
      <div className="bg-background min-h-[600px] w-full overflow-y-auto rounded-md shadow-sm border">
        <div className="grid grid-cols-3 min-h-[600px]">
          {/* Sidebar */}
          <div className="col-span-1 bg-primary/10 p-6 flex flex-col">
            <div className="mb-6 flex flex-col items-center text-center">
              {currentData.personalInfo.profileImage && (
                <div className="mb-4 rounded-full overflow-hidden h-32 w-32 border-4 border-background">
                  <Image
                    src={currentData.personalInfo.profileImage || "/placeholder.svg"}
                    alt={currentData.personalInfo.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              )}
              <h1 className="text-xl font-bold">{currentData.personalInfo.name}</h1>
              <p className="text-muted-foreground">{currentData.personalInfo.title}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <div className="space-y-2 text-sm">
                {currentData.personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{currentData.personalInfo.email}</span>
                  </div>
                )}
                {currentData.personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{currentData.personalInfo.phone}</span>
                  </div>
                )}
                {currentData.personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentData.personalInfo.location}</span>
                  </div>
                )}
                {currentData.personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{currentData.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {loadedSections.includes("skills") && currentData.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="space-y-2">
                  {currentData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        {skill.level && <span>{skill.level}/5</span>}
                      </div>
                      {skill.level && <Progress value={skill.level * 20} className="h-1" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loadedSections.includes("skills") && currentData.languages && currentData.languages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Languages</h2>
                <div className="space-y-1">
                  {currentData.languages.map((lang, index) => (
                    <div key={index} className="text-sm">
                      {lang.language}{" "}
                      {lang.proficiency && <span className="text-muted-foreground">({lang.proficiency})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-2 p-8">
            {/* Summary */}
            {currentData.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-primary">Profile</h2>
                <p>{currentData.personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {loadedSections.includes("experience") && currentData.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-primary">Experience</h2>
                <div className="space-y-6">
                  {currentData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{exp.description}</p>
                      {exp.highlights && (
                        <ul className="mt-2 list-disc list-inside text-sm">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {loadedSections.includes("education") && currentData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-primary">Education</h2>
                <div className="space-y-6">
                  {currentData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {edu.degree}
                            {edu.field ? `, ${edu.field}` : ""}
                          </h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </div>
                      </div>
                      {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {loadedSections.includes("projects") && currentData.projects && currentData.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-primary">Projects</h2>
                <div className="space-y-6">
                  {currentData.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm mt-1">{project.description}</p>
                      {project.url && (
                        <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                          {project.url}
                        </a>
                      )}
                      {project.highlights && (
                        <ul className="mt-2 list-disc list-inside text-sm">
                          {project.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {loadedSections.includes("skills") &&
              currentData.certifications &&
              currentData.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3 text-primary">Certifications</h2>
                  <div className="space-y-4">
                    {currentData.certifications.map((cert, index) => (
                      <div key={index}>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} {cert.date && `- ${cert.date}`}
                        </p>
                        {cert.url && (
                          <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                            {cert.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }

  const renderCreativeTemplate = () => {
    return (
      <div className="bg-background min-h-[600px] w-full overflow-y-auto rounded-md shadow-sm border">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary/80 to-secondary/80 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {currentData.personalInfo.profileImage && (
              <div className="rounded-full overflow-hidden h-32 w-32 border-4 border-white/30">
                <Image
                  src={currentData.personalInfo.profileImage || "/placeholder.svg"}
                  alt={currentData.personalInfo.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{currentData.personalInfo.name}</h1>
              <p className="text-xl opacity-90 mb-4">{currentData.personalInfo.title}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                {currentData.personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{currentData.personalInfo.email}</span>
                  </div>
                )}
                {currentData.personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{currentData.personalInfo.phone}</span>
                  </div>
                )}
                {currentData.personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentData.personalInfo.location}</span>
                  </div>
                )}
                {currentData.personalInfo.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{currentData.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-8 max-w-4xl mx-auto">
          {/* Tabs for different sections */}
          <Tabs defaultValue="about" value={activeSection} onValueChange={setActiveSection} className="mb-8">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              {currentData.personalInfo.summary && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4 text-primary">About Me</h2>
                  <p className="text-lg">{currentData.personalInfo.summary}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">Work Experience</h2>
              {loadedSections.includes("experience") && currentData.experience.length > 0 ? (
                <div className="space-y-8">
                  {currentData.experience.map((exp, index) => (
                    // שיפור כרטיסי GlassCard בתבנית Creative
                    <GlassCard key={index} className="relative overflow-hidden" color="blue" depth={2}>
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <div className="pl-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h3 className="text-xl font-bold">{exp.position}</h3>
                            <p className="text-lg text-muted-foreground">{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="text-sm">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </Badge>
                        </div>
                        <p className="mt-3">{exp.description}</p>
                        {exp.highlights && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Key Achievements:</h4>
                            <ul className="space-y-1">
                              {exp.highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p>Loading experience information...</p>
              )}
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">Education</h2>
              {loadedSections.includes("education") && currentData.education.length > 0 ? (
                <div className="space-y-6">
                  {currentData.education.map((edu, index) => (
                    <GlassCard key={index} color="purple" depth={2}>
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="text-xl font-bold">
                            {edu.degree}
                            {edu.field ? `, ${edu.field}` : ""}
                          </h3>
                          <p className="text-lg text-muted-foreground">{edu.institution}</p>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </Badge>
                      </div>
                      {edu.description && <p className="mt-3">{edu.description}</p>}
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p>Loading education information...</p>
              )}
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">Skills & Expertise</h2>
              {loadedSections.includes("skills") ? (
                <div className="space-y-8">
                  {currentData.skills.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentData.skills.map((skill, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{skill.name}</span>
                              {skill.level && (
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-3 h-3 rounded-full mx-0.5 ${
                                        i < skill.level! ? "bg-primary" : "bg-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            {skill.level && <Progress value={skill.level * 20} className="h-2 rounded-full" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentData.languages && currentData.languages.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Languages</h3>
                      <div className="flex flex-wrap gap-3">
                        {currentData.languages.map((lang, index) => (
                          <Badge key={index} className="px-4 py-2 text-base">
                            {lang.language} {lang.proficiency && `- ${lang.proficiency}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentData.certifications && currentData.certifications.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentData.certifications.map((cert, index) => (
                          <GlassCard key={index} className="p-4" color="emerald" depth={1}>
                            <h4 className="font-bold">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {cert.issuer} {cert.date && `- ${cert.date}`}
                            </p>
                            {cert.url && (
                              <a href="#" className="text-primary text-sm hover:underline mt-1 inline-block">
                                View Certificate
                              </a>
                            )}
                          </GlassCard>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading skills information...</p>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-primary">Projects</h2>
              {loadedSections.includes("projects") && currentData.projects && currentData.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentData.projects.map((project, index) => (
                    <GlassCard key={index} color="amber" depth={2}>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <p className="mt-2">{project.description}</p>
                      {project.url && (
                        <a href="#" className="text-primary hover:underline mt-2 inline-block">
                          {project.url}
                        </a>
                      )}
                      {project.highlights && (
                        <div className="mt-3">
                          <h4 className="font-semibold mb-1">Highlights:</h4>
                          <ul className="space-y-1">
                            {project.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p>Loading project information...</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Preview</h2>
        <div className="flex gap-2">
          <GlassButton variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </GlassButton>
          <GlassButton size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download
          </GlassButton>
          <GlassButton variant="outline" size="sm" className="gap-1">
            <Eye className="h-4 w-4" />
            Full Preview
          </GlassButton>
        </div>
      </div>
      {renderTemplate()}
      {/* Resume Editor Modal */}
      <ResumeEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        resumeData={currentData}
        onSave={handleDataChange}
      />
    </div>
  )
}
