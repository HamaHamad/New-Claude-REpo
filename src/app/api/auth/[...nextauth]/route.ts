import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth handler — rate limiting is enforced inside authorize() in lib/auth.ts
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
