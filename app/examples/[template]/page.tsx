"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ParallaxImage } from "@/components/parallax-image"
import { RevealOnScroll, FloatingElement } from "@/components/parallax-effect"
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"

const templates = {
  professional: {
    title: "Professional Template",
    description:
      "A clean, professional design suitable for corporate roles. This template emphasizes clarity, structure, and readability - perfect for traditional industries.",
    features: [
      "Clean and minimal design",
      "Structured layout for easy scanning",
      "Professional color scheme",
      "Emphasis on work experience and skills",
      "Printer-friendly format",
    ],
    image: "/placeholder.svg?key=83e6r",
    color: "blue",
  },
  creative: {
    title: "Creative Template",
    description:
      "A vibrant design for creative professionals. This template showcases your personality and creative work with bold colors and dynamic layouts.",
    features: [
      "Bold and colorful design",
      "Custom sections for portfolio pieces",
      "Unique typography",
      "Interactive elements",
      "Visual skill representation",
    ],
    image: "/placeholder.svg?key=41cvp",
    color: "purple",
  },
  minimal: {
    title: "Minimal Template",
    description:
      "A minimalist design focusing on content. This template uses whitespace effectively to create a modern, sophisticated look that lets your achievements stand out.",
    features: [
      "Minimalist aesthetic",
      "Generous whitespace",
      "Typography-focused design",
      "Subtle animations",
      "Content-first approach",
    ],
    image: "/minimal-website-template.png",
    color: "default",
  },
}

export default function TemplatePage({ params }: { params: { template: string } }) {
  const template = templates[params.template as keyof typeof templates]
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY
        document.documentElement.style.setProperty("--scroll", `${scrollY}px`)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Template not found</h1>
        <Link href="/examples">
          <GlassButton variant="outline" className="gap-2" color="default">
            <ArrowLeft className="h-4 w-4" />
            Back to Examples
          </GlassButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" ref={parallaxRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingElement
          className="absolute top-[10%] right-[10%] w-32 h-32 bg-primary/5 rounded-full blur-xl"
          speed="slow"
        />
        <FloatingElement
          className="absolute bottom-[20%] left-[5%] w-40 h-40 bg-secondary/5 rounded-full blur-xl"
          speed="normal"
          delay={200}
        />
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-6">
          <Link href="/examples">
            <GlassButton variant="outline" className="gap-2" color="default">
              <ArrowLeft className="h-4 w-4" />
              Back to Examples
            </GlassButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <RevealOnScroll>
              <h1 className="text-3xl font-bold mb-4">{template.title}</h1>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="text-lg text-muted-foreground mb-8">{template.description}</p>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2 mb-8">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="flex gap-4">
                <GlassButton size="lg" color={template.color as any} depth={3}>
                  Use This Template
                </GlassButton>
                <GlassButton variant="outline" size="lg" color={template.color as any}>
                  Preview
                </GlassButton>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={150}>
            <GlassCard className="p-0 overflow-hidden" color={template.color as any} depth={3} shimmer>
              <ParallaxImage
                src={template.image}
                alt={template.title}
                width={800}
                height={600}
                className="w-full aspect-[4/3]"
                intensity={0.05}
              />
            </GlassCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={400}>
          <GlassCard className="mt-16" color={template.color as any} depth={2}>
            <GlassCardHeader>
              <GlassCardTitle>Ready to create your own professional website?</GlassCardTitle>
              <GlassCardDescription>
                Use this template to create your own CV website in minutes. Just upload your CV and we'll do the rest.
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="mb-6">
                Our intelligent system will analyze your CV, extract key information, and generate a personalized
                website that showcases your skills and experience in the most effective way.
              </p>
            </GlassCardContent>
            <GlassCardFooter>
              <Link href="/upload">
                <GlassButton color={template.color as any} depth={2}>
                  Get Started with This Template
                </GlassButton>
              </Link>
            </GlassCardFooter>
          </GlassCard>
        </RevealOnScroll>
      </div>
    </div>
  )
}
