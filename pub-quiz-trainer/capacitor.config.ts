import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.quiziq.app',
  appName: 'QuizIQ',
  webDir: 'out',
  server: {
    // Phase 1: load live Vercel app for testing.
    // Phase 2 (before store submission): remove this and use static export.
    url: 'https://pub-quiz-trainer-silk.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#030712',
  },
}

export default config
