import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Improved configuration with proper error handling
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // For demo purposes
          if (credentials.email === "user@example.com" && credentials.password === "password123") {
            return {
              id: "1",
              name: "Demo User",
              email: "user@example.com",
            }
          }

          // Attempt to sign in with Supabase
          // This is commented out to avoid dependency on Supabase being properly configured
          // Uncomment when Supabase is properly set up
          /*
          const data = await signIn(credentials.email, credentials.password)
          if (data.session) {
            return {
              id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email,
              email: data.user.email,
            }
          }
          */

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
