'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { Github, Chrome, User, Lock, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.')
      } else {
        window.location.href = '/admin/dashboard'
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = () => {
    signIn('github', { redirectTo: '/admin/dashboard' })
  }

  const handleGoogleSignIn = () => {
    signIn('google', { redirectTo: '/admin/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold mx-auto">
            CP
          </div>
          <CardTitle className="text-2xl">Đăng Nhập Quản Trị</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản hoặc OAuth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <Button
            onClick={handleGitHubSignIn}
            variant="outline"
            className="w-full gap-2"
          >
            <Github className="w-4 h-4" />
            Đăng Nhập Với GitHub
          </Button>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full gap-2"
          >
            <Chrome className="w-4 h-4" />
            Đăng Nhập Với Google
          </Button>

          {/* Back to home */}
          <div className="text-center text-sm pt-1">
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Trang Chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
