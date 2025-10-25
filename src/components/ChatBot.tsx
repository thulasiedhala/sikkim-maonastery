import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses = {
  greeting: [
    "🙏 Namaste! I'm your AI Cultural Guide. How can I help you learn about Sikkim's monasteries today?",
    "Welcome, friend! I'm here to share the wisdom and traditions of our sacred monasteries. What would you like to know?"
  ],
  monasteries: [
    "Our monasteries are living centers of Buddhist learning. Rumtek is the largest, while Enchey has a rich 200-year history. Which monastery interests you most?",
    "Each monastery has its unique character. Tashiding sits on a heart-shaped hill between holy rivers. Would you like to know about their festivals or daily routines?"
  ],
  festivals: [
    "Our festivals are deeply spiritual celebrations! Losar (Tibetan New Year) is our most important festival. Saga Dawa honors Buddha's life events. Which festival would you like to learn about?",
    "Festival times are magical here. During Pang Lhabsol, we celebrate Mount Kanchenjunga's guardian deity - unique to Sikkim! The masked dances are spectacular."
  ],
  etiquette: [
    "Respectful behavior is essential in our sacred spaces. Dress modestly, remove shoes before entering temples, maintain silence in prayer halls, and always walk clockwise around stupas. Any specific questions about monastery etiquette?",
    "Photography inside temples is usually not allowed, and flash is strictly prohibited. Ask permission before photographing monks. Most importantly, approach with a respectful heart. 🙏"
  ],
  meditation: [
    "Buddhist meditation focuses on mindfulness and compassion. Start with breathing meditation - sit comfortably, focus on your breath, when mind wanders, gently return to breath. Even 10 minutes daily helps!",
    "Our monks practice various forms: breathing meditation, loving-kindness, and analytical meditation. Many monasteries offer guided sessions for visitors. Would you like to know about meditation retreats?"
  ],
  food: [
    "Monastery food is simple and mindful. We often serve thukpa (noodle soup), momos (dumplings), and butter tea. Meals are eaten in silence with gratitude. Many monasteries welcome visitors to share meals.",
    "Traditional Sikkimese cuisine includes yak cheese, cardamom tea, and fermented vegetables. Food is blessed before eating, and sharing meals builds community bonds."
  ],
  donation: [
    "Donations support monastery maintenance, monk's education, and community services. You can offer money, supplies, or volunteer time. Even lighting a butter lamp is a meaningful offering. How would you like to contribute?",
    "Traditional offerings include white scarves (khatas), flowers, incense, and food. The intention behind the offering matters more than the amount. Monetary donations help with daily operations."
  ],
  default: [
    "That's a wonderful question! While I don't have specific information about that, I recommend speaking with the monks directly - they love sharing their wisdom with sincere seekers.",
    "I encourage you to experience this firsthand during your visit. The monks and local guides can provide much deeper insights than I can share through text.",
    "What a thoughtful question! Each monastery has its own traditions. I suggest visiting to learn more, or asking specific questions about festivals, meditation, or etiquette that I can help with."
  ]
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🙏 Namaste! I'm your AI Cultural Guide for Sikkim's monasteries. I can help with questions about traditions, festivals, etiquette, meditation, and local customs. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('english');

  const getResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('namaste')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    
    if (lowerInput.includes('monastery') || lowerInput.includes('monasteries') || lowerInput.includes('rumtek') || lowerInput.includes('enchey') || lowerInput.includes('tashiding')) {
      return botResponses.monasteries[Math.floor(Math.random() * botResponses.monasteries.length)];
    }
    
    if (lowerInput.includes('festival') || lowerInput.includes('losar') || lowerInput.includes('saga dawa') || lowerInput.includes('pang lhabsol')) {
      return botResponses.festivals[Math.floor(Math.random() * botResponses.festivals.length)];
    }
    
    if (lowerInput.includes('etiquette') || lowerInput.includes('behavior') || lowerInput.includes('dress') || lowerInput.includes('photo')) {
      return botResponses.etiquette[Math.floor(Math.random() * botResponses.etiquette.length)];
    }
    
    if (lowerInput.includes('meditation') || lowerInput.includes('meditate') || lowerInput.includes('practice')) {
      return botResponses.meditation[Math.floor(Math.random() * botResponses.meditation.length)];
    }
    
    if (lowerInput.includes('food') || lowerInput.includes('meal') || lowerInput.includes('tea') || lowerInput.includes('eat')) {
      return botResponses.food[Math.floor(Math.random() * botResponses.food.length)];
    }
    
    if (lowerInput.includes('donation') || lowerInput.includes('donate') || lowerInput.includes('offering') || lowerInput.includes('contribute')) {
      return botResponses.donation[Math.floor(Math.random() * botResponses.donation.length)];
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const quickQuestions = [
    "What should I wear to a monastery?",
    "How do I meditate properly?",
    "When is the next festival?",
    "Can I take photos inside?",
    "What food is served?"
  ];

  return (
    <>
      {/* Chat Bot Toggle Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-red-600"
          size="lg"
        >
          <span className="text-lg sm:text-xl">
            {isOpen ? '✕' : '🧘‍♂️'}
          </span>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 right-4 left-4 sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 h-[450px] sm:h-[500px] z-40"
          >
            <Card className="h-full flex flex-col shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg">AI Cultural Guide</CardTitle>
                    <p className="text-xs sm:text-sm opacity-90">Ask a Monk • Cultural Assistant</p>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                      {language === 'english' ? 'EN' : 'HI'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
                      className="text-white hover:bg-white/20 p-1 sm:p-2"
                    >
                      <span className="text-sm">🌐</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-lg text-sm ${
                        message.isBot 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {message.isBot && (
                          <div className="flex items-center gap-1 sm:gap-2 mb-1">
                            <span className="text-xs">🧘‍♂️ Cultural Guide</span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="p-3 sm:p-4 bg-gray-50 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                    <div className="space-y-1">
                      {quickQuestions.slice(0, 3).map((question, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full text-left justify-start text-xs h-auto py-1.5 px-2"
                          onClick={() => {
                            setInputText(question);
                            sendMessage();
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder={language === 'english' ? "Ask about monasteries, festivals..." : "मठ, त्योहार के बारे में पूछें..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 text-sm h-9 sm:h-10"
                    />
                    <Button onClick={sendMessage} size="sm" disabled={!inputText.trim()} className="px-3">
                      <span className="text-sm">➤</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'english' 
                      ? "Supports English, Hindi, Nepali, Tibetan" 
                      : "अंग्रेजी, हिंदी, नेपाली, तिब्बती समर्थित"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}