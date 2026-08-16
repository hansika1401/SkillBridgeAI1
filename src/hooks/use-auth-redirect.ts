"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase"

export function useAuthRedirect(redirectPath = "/dashboard") {
  const { user, isUserLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isUserLoading) return
    if (!user || user.isAnonymous) return
    const current = window.location.pathname
    if (current !== redirectPath) router.replace(redirectPath)
  }, [user, isUserLoading, router, redirectPath])
}
