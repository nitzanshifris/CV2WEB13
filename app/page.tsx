"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, FileUp, Sparkles, Users, Globe, Shield } from "lucide-react"
import {
  ParallaxSection,
  ParallaxLayer,
  RevealOnScroll,
  FloatingElement,
  ParallaxShapes,
} from "@/components/parallax-effect"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"

export default function HomePage() {
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

  // Add this right after the return statement in the HomePage component, after the opening div
  useEffect(() => {
    // Add the gradient heading style to the document
    const styleElement = document.createElement("style")
    styleElement.innerHTML = gradientHeadingStyle
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <div className="min-h-screen" ref={parallaxRef}>
      {/* Hero Section with Parallax */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Parallax background layers */}
        <ParallaxLayer speed={0.1} className="z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20"></div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.2} className="z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"></div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.3} className="z-0">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl"></div>
        </ParallaxLayer>

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <FloatingElement
            className="absolute top-[10%] left-[5%] w-16 h-16 bg-primary/10 rounded-full blur-lg"
            delay={100}
          />
          <FloatingElement
            className="absolute top-[20%] right-[15%] w-24 h-24 bg-secondary/15 rounded-full blur-lg"
            speed="slow"
            delay={300}
          />
          <FloatingElement
            className="absolute bottom-[30%] left-[20%] w-20 h-20 bg-accent/10 rounded-full blur-lg"
            speed="fast"
            delay={200}
          />
          <FloatingElement
            className="absolute bottom-[10%] right-[10%] w-12 h-12 bg-primary/20 rounded-full blur-lg"
            delay={400}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                Transform Your CV Into A Professional Website In Minutes
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <p className="text-xl text-muted-foreground mb-8">
                Upload your CV and get a personalized, responsive website that showcases your skills and experience.
                Stand out from the crowd and make a lasting impression.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/upload">
                  <GlassButton size="lg" className="gap-2" color="blue" depth={3}>
                    <FileUp className="h-5 w-5" />
                    Upload Your CV
                  </GlassButton>
                </Link>
                <Link href="/examples">
                  <GlassButton variant="outline" size="lg" className="gap-2" color="purple" depth={2}>
                    <Sparkles className="h-5 w-5" />
                    View Examples
                  </GlassButton>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <ParallaxSection className="py-20 bg-muted/50" speed={0.2}>
        <div className="container mx-auto px-4 relative z-10 overflow-visible">
          <RevealOnScroll threshold={0.1}>
            <h2 className="text-4xl font-bold text-center mb-16 relative z-20 py-2 gradient-heading">
              Why Choose Our CV Website Generator
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <GlassCard className="h-full relative z-10" color={getFeatureColor(index)} depth={2}>
                  <div className="mb-4 text-primary bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* How It Works Section with Parallax Timeline */}
      <section className="py-20 relative overflow-hidden">
        <ParallaxShapes />

        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          </RevealOnScroll>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <RevealOnScroll key={index} delay={index * 150}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && <div className="w-0.5 h-full bg-border mt-2"></div>}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      {step.image && (
                        <GlassCard className="p-0 overflow-hidden" color={getStepColor(index)} depth={2}>
                          <div className="aspect-ratio relative" style={{ "--aspect-ratio": "16/9" } as any}>
                            <Image
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              fill
                              className="object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Link
                                  href="/upload"
                                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                                >
                                  Upload Your CV Now
                                </Link>
                              </div>
                            )}
                          </div>
                        </GlassCard>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <ParallaxSection className="py-20 relative overflow-hidden" speed={0.3} direction="down">
        <ParallaxLayer speed={0.1} className="z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30"></div>
        </ParallaxLayer>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <GlassCard className="text-center" color="blue" depth={3} shimmer>
              <RevealOnScroll>
                <h2 className="text-3xl font-bold mb-6">Ready to Create Your Professional Website?</h2>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of professionals who have boosted their online presence with our CV website generator.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                <Link href="/register">
                  <GlassButton size="lg" className="gap-2" color="purple" depth={3}>
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </GlassButton>
                </Link>
              </RevealOnScroll>
            </GlassCard>
          </div>
        </div>
      </ParallaxSection>
    </div>
  )
}

// Helper function to get color based on index
function getFeatureColor(index: number) {
  const colors = ["blue", "purple", "default", "emerald", "amber", "rose"]
  return colors[index % colors.length] as any
}

function getStepColor(index: number) {
  const colors = ["blue", "purple", "emerald", "amber"]
  return colors[index % colors.length] as any
}

const features = [
  {
    title: "Professional Templates",
    description:
      "Choose from a variety of professionally designed templates that highlight your skills and experience.",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Easy Customization",
    description: "Personalize colors, fonts, and layouts to match your personal brand and stand out from the crowd.",
    icon: <FileUp className="h-6 w-6" />,
  },
  {
    title: "Mobile Responsive",
    description: "Your website will look great on all devices, ensuring a seamless experience for all visitors.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "SEO Optimized",
    description: "Get found by recruiters and potential clients with our built-in SEO optimization features.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Analytics Dashboard",
    description: "Track who's viewing your profile with detailed analytics and visitor insights.",
    icon: <ArrowRight className="h-6 w-6" />,
  },
  {
    title: "Secure Hosting",
    description: "Your website is hosted on secure, reliable servers with 99.9% uptime guarantee.",
    icon: <Shield className="h-6 w-6" />,
  },
]

const steps = [
  {
    title: "Upload Your CV",
    description:
      "Simply upload your existing CV in PDF, DOCX, or TXT format. Our system will automatically extract the key information.",
    image: "/placeholder.svg?key=xm7pa",
  },
  {
    title: "Choose Your Template",
    description:
      "Browse our collection of professional templates and select the one that best represents your personal brand.",
    image: "/placeholder.svg?key=fp1y8",
  },
  {
    title: "Customize Your Website",
    description:
      "Personalize your website by adjusting colors, fonts, and layout. Add or edit sections to highlight your strengths.",
    image: "/website-customization-interface.png",
  },
  {
    title: "Publish and Share",
    description:
      "With one click, publish your website and share it with potential employers or clients via a custom link.",
    image: "/placeholder.svg?key=obcvx",
  },
]

// Add this before the last closing brace of the HomePage component
const gradientHeadingStyle = `
  .gradient-heading {
    background: linear-gradient(to right, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    display: inline-block;
    position: relative;
  }
  
  .gradient-heading::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 25%;
    right: 25%;
    height: 3px;
    background: linear-gradient(to right, var(--primary), var(--secondary));
    border-radius: 3px;
  }
`
