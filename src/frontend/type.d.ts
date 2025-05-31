interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
  }
}
