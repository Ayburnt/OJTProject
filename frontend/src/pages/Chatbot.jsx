import React, { useState, useEffect, useRef } from 'react';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { MdOutlineClose } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";

// The Chatbot is a self-contained component that can be imported
// into any page to provide a floating chat button and modal.
const Chatbot = () => {
  // State to manage the visibility of the chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  // State to hold the chat messages
  const [messages, setMessages] = useState([]);
  // State to hold the user's current input
  const [inputMessage, setInputMessage] = useState('');
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);

  // A list of pre-defined questions and answers for the chatbot
  const faqs = [
    { 
      question: 'How to manage event?', 
      answer: 'You can manage your events by navigating to the Event Overview page. From there, you can edit, view attendees, and get reports for each of your events.'
    },
    {
      question: 'How to create a new event?',
      answer: 'To create a new event, click on the "Create New Event" button on your dashboard or the Event Overview page. Fill in the required details and save the event.'
    }
  ];

  // Function to toggle the chat modal
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      // Add the user's message to the messages array
      const newMessages = [...messages, { sender: 'user', text: inputMessage }];
      setMessages(newMessages);
      setInputMessage('');
    }
  };

  // Function to handle a click on a pre-defined FAQ
  const handleFAQClick = (faq) => {
    // Add both the user's question and the bot's answer to the messages array
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: faq.question },
      { sender: 'bot', text: faq.answer }
    ]);
  };

  // Effect to scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full p-3 z-50 bg-teal-500 shadow-lg hover:bg-teal-600 transition-colors"
      >
        <TbMessageChatbotFilled className="text-white text-4xl transform -scale-x-100" />
      </button>

      {/* Chat Modal - Conditionally rendered */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[400px] bg-white rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out transform">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-teal-500 text-white rounded-t-xl">
            <h4 className="text-lg font-semibold">Chat with an AI Assistant</h4>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <MdOutlineClose className="text-2xl" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            {messages.length === 0 ? (
              <>
                <p className="text-gray-500 text-center mb-4">Start a conversation to get help with your events!</p>
                <div className="flex flex-col gap-2">
                  {faqs.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => handleFAQClick(faq)}
                      className="p-2 bg-gray-100 text-left rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'}`}
                >
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button 
              type="submit" 
              className="bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition-colors"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
