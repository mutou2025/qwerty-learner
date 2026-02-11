import Loading from './components/Loading'
import './index.css'
import { AuthCallback, Login, Register } from './pages/Auth'
import { ErrorBook } from './pages/ErrorBook'
import MobilePage from './pages/Mobile'
import Profile from './pages/Profile'
import TypingPage from './pages/Typing'
import { isOpenDarkModeAtom } from '@/store'
import { Analytics } from '@vercel/analytics/react'
import 'animate.css'
import { useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import process from 'process'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import 'react-app-polyfill/stable'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const AnalysisPage = lazy(() => import('./pages/Analysis'))
const GalleryPage = lazy(() => import('./pages/Gallery-N'))
// const GalleryPage = lazy(() => import('./pages/Gallery'))
const DictationPage = lazy(() => import('./pages/Dictation'))
const SpeakingPage = lazy(() => import('./pages/Speaking'))
const MyDictionaryPage = lazy(() => import('./pages/MyDictionary'))
const ReviewPage = lazy(() => import('./pages/Review'))

if (process.env.NODE_ENV === 'production') {
  // for prod
  mixpanel.init('bdc492847e9340eeebd53cc35f321691')
} else {
  // for dev
  mixpanel.init('5474177127e4767124c123b2d7846e2a', { debug: true })
}

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom)
  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark')
  }, [darkMode])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  function debounce<T extends (...args: any[]) => void>(fn: T, wait = 150) {
    let t: any
    return (...args: Parameters<T>) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...args), wait)
    }
  }

  useEffect(() => {
    const onResize = debounce(() => {
      handleResize()
    }, 250)
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600
      console.log('窗口', window, window.innerWidth)
      // if (!isMobile) {
      //   window.location.href = '/'
      // }
      setIsMobile(isMobile)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
    // window.addEventListener('resize', handleResize)
    // return () => {
    //   window.removeEventListener('resize', handleResize)
    // }
  }, [])

  return (
    <React.StrictMode>
      <BrowserRouter basename={REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {isMobile ? (
              <Route path="/*" element={<Navigate to="/mobile" />} />
            ) : (
              <>
                <Route index element={<TypingPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/error-book" element={<ErrorBook />} />
                <Route path="/dictation" element={<DictationPage />} />
                <Route path="/speaking" element={<SpeakingPage />} />
                <Route path="/my-dictionary" element={<MyDictionaryPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/mobile" element={<MobilePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </React.StrictMode>
  )
}

const container = document.getElementById('root')

container && createRoot(container).render(<Root />)
