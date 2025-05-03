import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">About CV Website Generator</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="lead">
            CV Website Generator is a powerful tool designed to transform your traditional CV into a modern,
            professional website in minutes.
          </p>

          <h2>Our Mission</h2>
          <p>
            In today's competitive job market, standing out is more important than ever. Our mission is to help
            professionals showcase their skills and experience in an engaging, accessible format that makes a lasting
            impression on potential employers.
          </p>

          <h2>How It Works</h2>
          <p>
            Our platform uses advanced AI technology to analyze your CV, extract key information, and generate a
            professionally designed website that highlights your career achievements. The process is simple:
          </p>

          <ol>
            <li>Upload your existing CV in PDF, DOCX, or TXT format</li>
            <li>Our AI processes and structures your information</li>
            <li>Choose from a variety of professional templates</li>
            <li>Customize colors, fonts, and layout to match your personal brand</li>
            <li>Publish your new CV website with a custom domain</li>
          </ol>

          <h2>Why Choose Us</h2>
          <p>
            Unlike traditional CV builders or website creators, our platform is specifically designed for professional
            profiles. We understand what employers are looking for and how to present your information in the most
            effective way.
          </p>

          <ul>
            <li>Mobile-responsive designs that look great on any device</li>
            <li>SEO optimization to help employers find you online</li>
            <li>Analytics to track who's viewing your profile</li>
            <li>Easy updates - change your information anytime</li>
            <li>Professional templates designed by UI/UX experts</li>
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/upload">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
