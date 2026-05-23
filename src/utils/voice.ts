/** Brauzer ovozli yordamchi (Alice / navigator uslubida) */

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

function pickAssistantVoice(): SpeechSynthesisVoice | undefined {
  const voices = loadVoices()
  const preferred = [
    /google.*russian/i,
    /microsoft.*russian/i,
    /milena/i,
    /yandex/i,
    /ru-ru/i,
    /russian/i,
  ]
  for (const pattern of preferred) {
    const v = voices.find((voice) => pattern.test(voice.name) || pattern.test(voice.lang))
    if (v) return v
  }
  return voices.find((v) => v.lang.startsWith('ru')) ?? voices[0]
}

export function speakNavigation(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.92
  utterance.pitch = 1.08
  utterance.volume = 1

  const voice = pickAssistantVoice()
  if (voice) utterance.voice = voice

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

/** Qisqa "ding" — tanlash tasdig‘i */
export function playSelectChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
    void ctx.close()
  } catch {
    /* audio blocked */
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => loadVoices()
  loadVoices()
}
