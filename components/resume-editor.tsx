"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { Trash2, Plus, Save, X } from "lucide-react"
import type { ParsedResume } from "@/lib/resume-parser"

interface ResumeEditorProps {
  isOpen: boolean
  onClose: () => void
  resumeData: ParsedResume
  onSave: (updatedData: ParsedResume) => void
}

export function ResumeEditor({ isOpen, onClose, resumeData, onSave }: ResumeEditorProps) {
  const [editedData, setEditedData] = useState<ParsedResume>({ ...resumeData })
  const [activeTab, setActiveTab] = useState("personal")

  const handleSave = () => {
    onSave(editedData)
    onClose()
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      personalInfo: {
        ...editedData.personalInfo,
        [field]: value,
      },
    })
  }

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const updatedExperience = [...editedData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      experience: updatedExperience,
    })
  }

  const addExperience = () => {
    setEditedData({
      ...editedData,
      experience: [
        ...editedData.experience,
        {
          company: "New Company",
          position: "Position Title",
          startDate: new Date().toISOString().split("T")[0],
          description: "Job description",
          highlights: [],
        },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...editedData.experience]
    updatedExperience.splice(index, 1)
    setEditedData({
      ...editedData,
      experience: updatedExperience,
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...editedData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      education: updatedEducation,
    })
  }

  const addEducation = () => {
    setEditedData({
      ...editedData,
      education: [
        ...editedData.education,
        {
          institution: "New Institution",
          degree: "Degree",
          startDate: new Date().toISOString().split("T")[0],
          field: "Field of Study",
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...editedData.education]
    updatedEducation.splice(index, 1)
    setEditedData({
      ...editedData,
      education: updatedEducation,
    })
  }

  const updateSkill = (index: number, field: string, value: string | number) => {
    const updatedSkills = [...editedData.skills]
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: field === "level" ? Number(value) : value,
    }
    setEditedData({
      ...editedData,
      skills: updatedSkills,
    })
  }

  const addSkill = () => {
    setEditedData({
      ...editedData,
      skills: [...editedData.skills, { name: "New Skill", level: 3 }],
    })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...editedData.skills]
    updatedSkills.splice(index, 1)
    setEditedData({
      ...editedData,
      skills: updatedSkills,
    })
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    if (!editedData.languages) return

    const updatedLanguages = [...editedData.languages]
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      languages: updatedLanguages,
    })
  }

  const addLanguage = () => {
    setEditedData({
      ...editedData,
      languages: [...(editedData.languages || []), { language: "New Language", proficiency: "Beginner" }],
    })
  }

  const removeLanguage = (index: number) => {
    if (!editedData.languages) return

    const updatedLanguages = [...editedData.languages]
    updatedLanguages.splice(index, 1)
    setEditedData({
      ...editedData,
      languages: updatedLanguages,
    })
  }

  const updateProject = (index: number, field: string, value: string | string[]) => {
    if (!editedData.projects) return

    const updatedProjects = [...editedData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      projects: updatedProjects,
    })
  }

  const addProject = () => {
    setEditedData({
      ...editedData,
      projects: [
        ...(editedData.projects || []),
        {
          name: "New Project",
          description: "Project description",
          highlights: [],
        },
      ],
    })
  }

  const removeProject = (index: number) => {
    if (!editedData.projects) return

    const updatedProjects = [...editedData.projects]
    updatedProjects.splice(index, 1)
    setEditedData({
      ...editedData,
      projects: updatedProjects,
    })
  }

  const updateCertification = (index: number, field: string, value: string) => {
    if (!editedData.certifications) return

    const updatedCertifications = [...editedData.certifications]
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      certifications: updatedCertifications,
    })
  }

  const addCertification = () => {
    setEditedData({
      ...editedData,
      certifications: [
        ...(editedData.certifications || []),
        {
          name: "New Certification",
          issuer: "Issuing Organization",
          date: new Date().toISOString().split("T")[0],
        },
      ],
    })
  }

  const removeCertification = (index: number) => {
    if (!editedData.certifications) return

    const updatedCertifications = [...editedData.certifications]
    updatedCertifications.splice(index, 1)
    setEditedData({
      ...editedData,
      certifications: updatedCertifications,
    })
  }

  const updateHighlight = (
    section: "experience" | "projects",
    itemIndex: number,
    highlightIndex: number,
    value: string,
  ) => {
    if (section === "experience") {
      const updatedExperience = [...editedData.experience]
      if (!updatedExperience[itemIndex].highlights) {
        updatedExperience[itemIndex].highlights = []
      }
      updatedExperience[itemIndex].highlights![highlightIndex] = value
      setEditedData({
        ...editedData,
        experience: updatedExperience,
      })
    } else if (section === "projects" && editedData.projects) {
      const updatedProjects = [...editedData.projects]
      if (!updatedProjects[itemIndex].highlights) {
        updatedProjects[itemIndex].highlights = []
      }
      updatedProjects[itemIndex].highlights![highlightIndex] = value
      setEditedData({
        ...editedData,
        projects: updatedProjects,
      })
    }
  }

  const addHighlight = (section: "experience" | "projects", itemIndex: number) => {
    if (section === "experience") {
      const updatedExperience = [...editedData.experience]
      if (!updatedExperience[itemIndex].highlights) {
        updatedExperience[itemIndex].highlights = []
      }
      updatedExperience[itemIndex].highlights!.push("New highlight")
      setEditedData({
        ...editedData,
        experience: updatedExperience,
      })
    } else if (section === "projects" && editedData.projects) {
      const updatedProjects = [...editedData.projects]
      if (!updatedProjects[itemIndex].highlights) {
        updatedProjects[itemIndex].highlights = []
      }
      updatedProjects[itemIndex].highlights!.push("New highlight")
      setEditedData({
        ...editedData,
        projects: updatedProjects,
      })
    }
  }

  const removeHighlight = (section: "experience" | "projects", itemIndex: number, highlightIndex: number) => {
    if (section === "experience") {
      const updatedExperience = [...editedData.experience]
      if (updatedExperience[itemIndex].highlights) {
        updatedExperience[itemIndex].highlights!.splice(highlightIndex, 1)
        setEditedData({
          ...editedData,
          experience: updatedExperience,
        })
      }
    } else if (section === "projects" && editedData.projects) {
      const updatedProjects = [...editedData.projects]
      if (updatedProjects[itemIndex].highlights) {
        updatedProjects[itemIndex].highlights!.splice(highlightIndex, 1)
        setEditedData({
          ...editedData,
          projects: updatedProjects,
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Resume Information</DialogTitle>
          <DialogDescription>
            Make changes to your resume information. The preview will update in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(90vh - 220px)" }}>
              <TabsContent value="personal" className="mt-0">
                <GlassCard className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedData.personalInfo.name}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={editedData.personalInfo.title}
                        onChange={(e) => updatePersonalInfo("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedData.personalInfo.phone || ""}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editedData.personalInfo.location || ""}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedData.personalInfo.website || ""}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        rows={4}
                        value={editedData.personalInfo.summary || ""}
                        onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                      />
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="experience" className="mt-0 space-y-6">
                {editedData.experience.map((exp, index) => (
                  <GlassCard key={index} className="p-6 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`exp-company-${index}`}>Company</Label>
                        <Input
                          id={`exp-company-${index}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exp-position-${index}`}>Position</Label>
                        <Input
                          id={`exp-position-${index}`}
                          value={exp.position}
                          onChange={(e) => updateExperience(index, "position", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exp-startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`exp-startDate-${index}`}
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exp-endDate-${index}`}>End Date (or "Present")</Label>
                        <Input
                          id={`exp-endDate-${index}`}
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`exp-description-${index}`}>Description</Label>
                        <Textarea
                          id={`exp-description-${index}`}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="mb-2 block">Highlights/Achievements</Label>
                      {exp.highlights?.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center gap-2 mb-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight("experience", index, hIndex, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeHighlight("experience", index, hIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => addHighlight("experience", index)}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Highlight
                      </Button>
                    </div>
                  </GlassCard>
                ))}

                <div className="flex justify-center">
                  <GlassButton onClick={addExperience} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Experience
                  </GlassButton>
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0 space-y-6">
                {editedData.education.map((edu, index) => (
                  <GlassCard key={index} className="p-6 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                        <Input
                          id={`edu-institution-${index}`}
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                        <Input
                          id={`edu-degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                        <Input
                          id={`edu-field-${index}`}
                          value={edu.field || ""}
                          onChange={(e) => updateEducation(index, "field", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edu-startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`edu-startDate-${index}`}
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edu-endDate-${index}`}>End Date (or "Present")</Label>
                        <Input
                          id={`edu-endDate-${index}`}
                          value={edu.endDate || ""}
                          onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`edu-description-${index}`}>Description</Label>
                        <Textarea
                          id={`edu-description-${index}`}
                          value={edu.description || ""}
                          onChange={(e) => updateEducation(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </GlassCard>
                ))}

                <div className="flex justify-center">
                  <GlassButton onClick={addEducation} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Education
                  </GlassButton>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="space-y-4">
                    {editedData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor={`skill-name-${index}`} className="sr-only">
                            Skill Name
                          </Label>
                          <Input
                            id={`skill-name-${index}`}
                            value={skill.name}
                            onChange={(e) => updateSkill(index, "name", e.target.value)}
                            placeholder="Skill name"
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`skill-level-${index}`} className="sr-only">
                            Skill Level
                          </Label>
                          <select
                            id={`skill-level-${index}`}
                            value={skill.level || 3}
                            onChange={(e) => updateSkill(index, "level", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value={1}>1 - Basic</option>
                            <option value={2}>2 - Intermediate</option>
                            <option value={3}>3 - Proficient</option>
                            <option value={4}>4 - Advanced</option>
                            <option value={5}>5 - Expert</option>
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeSkill(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Languages</h3>
                  <div className="space-y-4">
                    {editedData.languages?.map((lang, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor={`lang-name-${index}`} className="sr-only">
                            Language
                          </Label>
                          <Input
                            id={`lang-name-${index}`}
                            value={lang.language}
                            onChange={(e) => updateLanguage(index, "language", e.target.value)}
                            placeholder="Language"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`lang-proficiency-${index}`} className="sr-only">
                            Proficiency
                          </Label>
                          <select
                            id={`lang-proficiency-${index}`}
                            value={lang.proficiency || "Beginner"}
                            onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Proficient">Proficient</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native">Native</option>
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeLanguage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={addLanguage}>
                    <Plus className="h-4 w-4 mr-2" /> Add Language
                  </Button>
                </GlassCard>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 space-y-6">
                {editedData.projects?.map((project, index) => (
                  <GlassCard key={index} className="p-6 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                        <Input
                          id={`project-name-${index}`}
                          value={project.name}
                          onChange={(e) => updateProject(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`project-description-${index}`}>Description</Label>
                        <Textarea
                          id={`project-description-${index}`}
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`project-url-${index}`}>URL</Label>
                        <Input
                          id={`project-url-${index}`}
                          value={project.url || ""}
                          onChange={(e) => updateProject(index, "url", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="mb-2 block">Highlights</Label>
                      {project.highlights?.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center gap-2 mb-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight("projects", index, hIndex, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeHighlight("projects", index, hIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => addHighlight("projects", index)}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Highlight
                      </Button>
                    </div>
                  </GlassCard>
                ))}

                <div className="flex justify-center">
                  <GlassButton onClick={addProject} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Project
                  </GlassButton>
                </div>
              </TabsContent>

              <TabsContent value="certifications" className="mt-0 space-y-6">
                {editedData.certifications?.map((cert, index) => (
                  <GlassCard key={index} className="p-6 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
                        <Input
                          id={`cert-name-${index}`}
                          value={cert.name}
                          onChange={(e) => updateCertification(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                        <Input
                          id={`cert-issuer-${index}`}
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`cert-date-${index}`}>Date</Label>
                        <Input
                          id={`cert-date-${index}`}
                          value={cert.date || ""}
                          onChange={(e) => updateCertification(index, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`cert-url-${index}`}>URL</Label>
                        <Input
                          id={`cert-url-${index}`}
                          value={cert.url || ""}
                          onChange={(e) => updateCertification(index, "url", e.target.value)}
                        />
                      </div>
                    </div>
                  </GlassCard>
                ))}

                <div className="flex justify-center">
                  <GlassButton onClick={addCertification} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Certification
                  </GlassButton>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <GlassButton onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </GlassButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
