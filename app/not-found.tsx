import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">הדף לא נמצא</h2>
      <p className="mt-4 text-muted-foreground max-w-md">הדף שחיפשת אינו קיים או הוסר.</p>
      <Link href="/" className="mt-8">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          חזרה לדף הבית
        </Button>
      </Link>
    </div>
  )
}
