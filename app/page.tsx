import Link from "next/link"
import Image from "next/image"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicTemplates } from "@/lib/supabase"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SplitText } from "@/components/split-text"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { MouseFollower } from "@/components/mouse-follower"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch public templates
  const publicTemplates = await getPublicTemplates()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        {/* רקע דינמי עם צורות */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax-shape shape-circle bg-primary/5 w-64 h-64 -top-20 -left-20 absolute"></div>
          <div className="parallax-shape shape-circle bg-secondary/5 w-96 h-96 -bottom-40 -right-40 absolute"></div>
          <div className="parallax-shape shape-square bg-accent/5 w-48 h-48 top-1/4 right-10 absolute rotate-12"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <ScrollReveal>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6">
                <SplitText type="words" animation="slide" staggerDelay={0.1}>
                  Create Your Professional CV Website Easily
                </SplitText>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                The perfect tool to create an impressive CV website that highlights your skills and experience. Start
                for free today.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link href="/register">
                  <GlassButton size="lg" className="text-lg" color="blue" depth={3}>
                    Get Started
                  </GlassButton>
                </Link>
                <Link href="/examples">
                  <GlassButton size="lg" variant="outline" className="text-lg">
                    View Examples
                  </GlassButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 gradient-text">
              Key Benefits
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={100} direction="left" distance={50}>
              <GlassCard className="h-full" color="blue" depth={2}>
                <CardHeader>
                  <CardTitle>Professional Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Choose from a variety of well-designed templates tailored to different industries.</p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up" distance={50}>
              <GlassCard className="h-full" color="purple" depth={2}>
                <CardHeader>
                  <CardTitle>Easy Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Customize the design, colors, and content to create a website that reflects your professional
                    identity.
                  </p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="right" distance={50}>
              <GlassCard className="h-full" color="emerald" depth={2}>
                <CardHeader>
                  <CardTitle>SEO Optimized</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Your website will be optimized for search engines to increase the chances of employers finding you.
                  </p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-16 md:py-24 bg-muted relative">
        {/* רקע דינמי */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax-shape shape-circle bg-primary/5 w-80 h-80 top-20 right-20 absolute"></div>
          <div className="parallax-shape shape-square bg-secondary/5 w-60 h-60 bottom-20 left-20 absolute rotate-45"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Popular Templates
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publicTemplates && publicTemplates.length > 0 ? (
              publicTemplates.map((template, index) => (
                <ScrollReveal key={template.id} delay={100 * (index + 1)} direction="up" distance={30}>
                  <GlassCard className="overflow-hidden card-hover" color={index % 2 === 0 ? "blue" : "purple"}>
                    <div className="aspect-video relative">
                      <Image
                        src={
                          template.preview_image ||
                          `/abstract-geometric-shapes.png?height=200&width=400&query=${template.title || "/placeholder.svg"} CV template`
                        }
                        alt={template.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>Template type: {template.template_type}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/examples/${template.template_type}`} className="w-full">
                        <GlassButton variant="outline" className="w-full">
                          View Example
                        </GlassButton>
                      </Link>
                    </CardFooter>
                  </GlassCard>
                </ScrollReveal>
              ))
            ) : (
              <>
                <ScrollReveal delay={100} direction="up" distance={30}>
                  <GlassCard className="overflow-hidden card-hover" color="blue">
                    <div className="aspect-video relative">
                      <Image
                        src="/placeholder.svg?key=2u9lt"
                        alt="Professional Template"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Professional Template</CardTitle>
                      <CardDescription>Perfect for corporate and business roles</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href="/examples/professional" className="w-full">
                        <GlassButton variant="outline" className="w-full">
                          View Example
                        </GlassButton>
                      </Link>
                    </CardFooter>
                  </GlassCard>
                </ScrollReveal>

                <ScrollReveal delay={200} direction="up" distance={30}>
                  <GlassCard className="overflow-hidden card-hover" color="purple">
                    <div className="aspect-video relative">
                      <Image
                        src="/placeholder.svg?key=j4328"
                        alt="Creative Template"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Creative Template</CardTitle>
                      <CardDescription>Ideal for designers and creative professionals</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href="/examples/creative" className="w-full">
                        <GlassButton variant="outline" className="w-full">
                          View Example
                        </GlassButton>
                      </Link>
                    </CardFooter>
                  </GlassCard>
                </ScrollReveal>

                <ScrollReveal delay={300} direction="up" distance={30}>
                  <GlassCard className="overflow-hidden card-hover" color="emerald">
                    <div className="aspect-video relative">
                      <Image
                        src="/placeholder.svg?key=v1sbv"
                        alt="Minimal Template"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Minimal Template</CardTitle>
                      <CardDescription>Clean and simple, suitable for any field</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href="/examples/minimal" className="w-full">
                        <GlassButton variant="outline" className="w-full">
                          View Example
                        </GlassButton>
                      </Link>
                    </CardFooter>
                  </GlassCard>
                </ScrollReveal>
              </>
            )}
          </div>

          <div className="flex justify-center mt-12">
            <ScrollReveal delay={400}>
              <Link href="/examples">
                <GlassButton size="lg" color="blue" depth={3}>
                  View All Templates
                </GlassButton>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 gradient-text">
              What People Say
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={100} direction="left" distance={30}>
              <GlassCard className="h-full" shimmer>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold">DL</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Dana Levy</CardTitle>
                      <CardDescription>UX/UI Designer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "This tool helped me create an impressive CV website that showcased my work. I've received many more
                    inquiries from employers since launching it."
                  </p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up" distance={30}>
              <GlassCard className="h-full" shimmer>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold">JC</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">John Cohen</CardTitle>
                      <CardDescription>Software Developer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "The interface is simple and user-friendly, and the end result looks highly professional. I was able
                    to find a new job within two weeks of launching my site."
                  </p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="right" distance={30}>
              <GlassCard className="h-full" shimmer>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold">MA</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Michelle Adams</CardTitle>
                      <CardDescription>HR Manager</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    "As a recruiter, I appreciate candidates who invest in creating a professional online presence. The
                    websites created with this tool stand out and impress."
                  </p>
                </CardContent>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* אפקט רקע */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax-shape shape-circle bg-white/5 w-96 h-96 -top-48 -right-48 absolute"></div>
          <div className="parallax-shape shape-circle bg-white/5 w-80 h-80 -bottom-40 -left-40 absolute"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Your Next Career Move?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="max-w-[700px] md:text-xl">
                Create an impressive CV website that will help you stand out in the competitive job market.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Link href="/register">
                <GlassButton size="lg" variant="secondary" className="text-lg mt-6">
                  Create Free Account
                </GlassButton>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* עוקב עכבר */}
      <MouseFollower />
    </div>
  )
}
