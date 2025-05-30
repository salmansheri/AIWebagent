import { createFileRoute } from '@tanstack/react-router'
import  { useEffect, useRef,useState,   } from 'react';
import { Mic, X } from 'lucide-react';
import { AnimatePresence, motion,  } from 'motion/react'; 
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: App,
}); 


// Extend the Window interface to include SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Add this above your component to define SpeechRecognition type
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

function App() {
  const [isOpen, setIsOpen ] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>(''); 
  const [response, setResponse] = useState<string>(''); 
  const [isRecording, setIsRecording] = useState<boolean>(false); 
  const [language, setLanguage] = useState<string>("en-US"); 
  
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null); 

  console.log("Language: ", language);
  
  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const apiResponse = await fetch("http://localhost:5071/api/AIWebAgent/ask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message})
        
      }); 

      return apiResponse.json(); 
    },
    onSuccess: (data: { message: string }) => {
      setResponse(data.message || "Response recieved"); 
    },
    onError: (error: unknown) => {
      console.error("Error fetching response: ", error); 
    }
  }); 

  useEffect(() =>{
    
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
    console.error('SpeechRecognition is not supported in this browser.');
    alert('Speech recognition is not supported in this browser.');
    return;
  }
    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = language;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: Event) => {
        const resultEvent = event as any;
        const speech = resultEvent.results[0][0].transcript;
        setTranscript(speech);
        mutation.mutate(speech);
      };

      recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event);
        setIsRecording(false); 
      };

      recognition.onend = () => {
        setIsRecording(false); 
      }

      recognitionRef.current = recognition;
    }
  
  }, [mutation, language]); 

  const toggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop(); 
      setIsRecording(false); 
    } else {
      try {
          recognitionRef.current?.start();  
      setIsRecording(true); 

      }catch(error) {
        console.error("Error starting speech recognition: ", error); 
        setIsRecording(false); 
        

      }
      

       

     
    }
  }

  console.log("response: ", response.length); 
  console.log("transcript: ", transcript); 
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="open-button"
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            transition={{duration: 0.3}}
            className="p-4 border flex item-center justify-center text-4xl bg-amber-600 text-white rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
          >
             💬

          </motion.button>
        )}
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 50}}
            transition={{ duration: 0.3 }}
            className="bg-gray-300 shadow-xl rounded-xl w-80 p-4 border border-gray-300"
          >
            <div className="flex justify-between items-center mb-2"
            >
              <h2 className="text-lg text-gray-900 font-bold">
                AI Web Agent

              </h2>
              <button
              onClick={() => setIsOpen(false)}
              
              >
                <X className="size-5 text-gray-800" />

              </button>

            </div>
            <div className="min-h-[80px] p-2 bg-gray-100 rounded- text-sm  text-gray-800" >
              {transcript ? <motion.p
                key={transcript}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
              >
                {transcript}
                

              </motion.p>: (
                "Hey, Chat with me!"
              )}

            </div>
            {mutation.isPending ? (
              <div className="min-h-[80px] mt-2 p-2 bg-gray-100 rounded text-sm text-gray-800">
                <motion.p
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.4}}
                >
                  Thinking...
                </motion.p>
              </div>
            ) : (
               <div className="min-h-[80px] mt-2 p-2 bg-amber-50 rounded text-sm text-amber-900">
              <AnimatePresence mode="wait">
                {response.trim() !== '' && (
                  <motion.p
                    key={response}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.4}}

                  >

                    {response}

                  </motion.p>
                )}

              </AnimatePresence>

            </div>
            )}
           
            <div className='flex w-full items-center mt-2 gap-2'>
              <input className="w-full text-amber-900 p-2 rounded-xl focus:ring-1 ring-amber-900 focus:outline-none " placeholder="chat" />
              <button
                className={`p-2 rounded-full ${isRecording ? "bg-red-500": "bg-gray-500"} text-white`}
                onClick={toggleMic}
              >
                <Mic className="w-5 h-5" />

              </button>

              </div>
              <div>
                <select
                  className="mt-2 p-2 rounded-xl w-full text-amber-900 focus:ring-1 ring-amber-900 focus:outline-none"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en-US">English (US)</option>
                  <option value="ar-SA">Arabic (SA)</option>
                
                </select>
              </div>


          </motion.div>
        )}
      </AnimatePresence>

    </div>
  
  )
}
