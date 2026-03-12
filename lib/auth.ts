import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-very-important-do-not-use'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminUsername || !adminPassword) return null

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          return {
            id: 'admin',
            name: adminUsername,
            email: `${adminUsername}@admin.local`,
          }
        }
        return null
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl

      // Always allow access to the login page
      if (pathname === '/admin/login') return true

      // Protect all other admin routes
      if (pathname.startsWith('/admin')) {
        if (!auth) return false

        // Credentials user (email ends with @admin.local) — always allow
        if (auth.user?.email?.endsWith('@admin.local')) return true

        // OAuth users — check email whitelist if configured
        const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(',')
          .map(email => email.trim())
          .filter(Boolean) || []

        if (authorizedEmails.length > 0 && !authorizedEmails.includes(auth.user?.email || '')) {
          return false
        }
      }
      return true
    },
  },
})
