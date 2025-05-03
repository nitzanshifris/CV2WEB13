"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ParallaxSection, ParallaxLayer, RevealOnScroll, FloatingElement } from "@/components/parallax-effect"
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardFooter,
} from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"

const examples = [
  {
    id: 1,
    title: "Professional Template",
    description: "A clean, professional design suitable for corporate roles",
    image: "/placeholder.svg?key=83e6r",
    link: "/examples/professional",
    color: "blue",
  },
  {
    id: 2,
    title: "Creative Template",
    description: "A vibrant design for creative professionals",
    image: "/placeholder.svg?key=41cvp",
    link: "/examples/creative",
    color: "purple",
  },
  {
    id: 3,
    title: "Minimal Template",
    description: "A minimalist design focusing on content",
    image: "/minimal-website-template.png",
    link: "/examples/minimal",
    color: "default",
  },
]

export default function ExamplesPage() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)

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

  return (
    <div className="min-h-screen relative overflow-hidden" ref={parallaxRef}>
      {/* Parallax background elements */}
      <ParallaxLayer speed={0.1} className="z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent"></div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.2} className="z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl"></div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.15} className="z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </ParallaxLayer>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingElement
          className="absolute top-[15%] left-[10%] w-12 h-12 bg-primary/10 rounded-full blur-md"
          speed="slow"
        />
        <FloatingElement
          className="absolute top-[30%] right-[20%] w-16 h-16 bg-secondary/10 rounded-full blur-md"
          speed="normal"
          delay={200}
        />
        <FloatingElement
          className="absolute bottom-[20%] left-[30%] w-20 h-20 bg-accent/10 rounded-full blur-md"
          speed="fast"
          delay={100}
        />
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.015]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground)/10) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)/10) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <RevealOnScroll>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Example Templates</h1>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of professionally designed CV website templates
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <RevealOnScroll key={example.id} delay={index * 150}>
              <GlassCard
                className={`overflow-hidden transition-all duration-500 p-0 ${
                  activeCard === example.id ? "scale-[1.02]" : ""
                }`}
                color={example.color as any}
                depth={3}
                shimmer={activeCard === example.id}
                onMouseEnter={() => setActiveCard(example.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="aspect-video relative overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                    style={{
                      transform: activeCard === example.id ? "translateY(0)" : "translateY(100%)",
                      transition: "transform 0.5s ease-out",
                    }}
                  ></div>
                  <Image
                    src={example.image || "/placeholder.svg"}
                    alt={example.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      transform: `scale(${activeCard === example.id ? 1.05 : 1}) translateY(${
                        activeCard === example.id ? "-2%" : "0"
                      })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 z-20">
                    <p className="text-white text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {example.description}
                    </p>
                  </div>
                </div>
                <GlassCardHeader>
                  <GlassCardTitle>{example.title}</GlassCardTitle>
                  <GlassCardDescription>{example.description}</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardFooter className="p-4 pt-0">
                  <Link href={example.link} className="w-full">
                    <GlassButton className="w-full" color={example.color as any} depth={2}>
                      View Template
                    </GlassButton>
                  </Link>
                </GlassCardFooter>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>

        <ParallaxSection className="text-center mt-16" speed={0.2}>
          <RevealOnScroll>
            <p className="text-lg mb-6">Ready to create your own professional website?</p>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Link href="/upload">
              <GlassButton size="lg" color="blue" depth={3}>
                Upload Your CV
              </GlassButton>
            </Link>
          </RevealOnScroll>
        </ParallaxSection>
      </div>

      {/* Add a decorative element at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary/5 to-transparent"></div>
    </div>
  )
}
