import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSiteContent } from '../context/SiteContentContext'

export default function MusicPlayer() {
  const { t } = useTranslation()
  const { settings } = useSiteContent()
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [settings.music_url])

  if (!settings.music_enabled || !settings.music_url) return null

  const toggle = async () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    try {
      await audioRef.current.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} src={settings.music_url} loop preload="metadata" />
      <button type="button" onClick={toggle} aria-label={playing ? t('music.pause') : t('music.play')}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '♪'}</span>
        <b>{playing ? t('music.pause') : t('music.play')}</b>
      </button>
    </div>
  )
}
