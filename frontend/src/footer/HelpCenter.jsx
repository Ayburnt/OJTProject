import React, { useState } from 'react';
import FooterNav from "../components/FooterNav";

const SariSariHelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Getting Started as an Organizer',
      icon: '🚀',
      description: 'Learn how to create your organizer account and get started',
      articleCount: 2,
      articles: [
        { 
          id: 1, 
          title: 'How to create a Sari-sari organizer account?',
          content: `Creating your Sari-sari account is simple and quick:

1. Visit event.sari-sari.com and click "Sign Up"
2. Register with your email 
3. Verify your email address by the otp that sent to your email
4. Fill in all the required details
5. Agree to the terms and conditions
6. Click "Continue" 

Once your account is verified, you can start browsing and purchasing tickets for events!`
        },
        { 
          id: 2, 
          title: 'How to verify my email address?',
        }
      ]
    },
    {
      id: 2,
      title: 'Buying Tickets',
      icon: '🎫',
      description: 'Everything about purchasing tickets',
      articleCount: 1,
      articles: [
        { 
          id: 3, 
          title: 'How to buy tickets on Sari-sari?',
          content: `Follow these steps to purchase your tickets:

        1. Click on the poster, and then press the 'Register' button for the event you would like to attend.
        2. On the checkout page, fill out the form, select the ticket quantity, and click the 'Check Out' button to complete your registration.`
        },
        
      ]
    },
    {
      id: 3,
      title: 'Managing Tickets',
      icon: '📱',
      description: 'View, transfer, and manage your purchased tickets',
      articleCount:2,
      articles: [
        { 
          id: 4, 
          title: 'Where can I view my tickets?',
          content: `There are two ways to access your ticket: through your email or via the Event Sari-Sari website.
We highly recommend using an active email address that you can access, as all event details—including your tickets—will be sent there.

Option 1: Through the Event Sari-Sari Website
1. Go to event.sari-sari.com, then navigate to "Find My Ticket" and enter your Ticket Code to retrieve your ticket.
2.You may also use the saved URL to view your ticket.

Option 2: Through Your Confirmation Email
Your tickets are also included in the order confirmation email sent to your mailbox after you successfully complete the transaction.`
        },
        { 
          id: 5, 
          title: 'How to use E-Ticket?',
          content: `Option 1: Show your ticket QR code from your mobile phone to the Organizer.
Show your QR code through the Event Sari-sari web application by:
• go to find my ticket → input "Ticket Code" → Tap on the ticket
• or go to the save url to view ticket information.

Show your QR code to the registration staff to scan and follow further instructions to enter the event.

Option 2: Show your Qr code through email.
• Go to your email → Open the ticket confirmation email from Event Sari-sari → Tap 'View Ticket'.

Show your QR code to the registration staff to scan and follow further instructions to enter the event.

Option 3: Print your ticket(s) from the Event Sari-sari web application or from the confirmation email.

You can print your ticket by following these steps in the Event Sari-sari web application:

• Enter the ticket code to find your ticket.
• Click 'Next' to view the ticket details. Make sure your device is connected to a printer before printing your ticket.

Or, you can print your ticket from the confirmation email by:
• Open the ticket confirmation email from Event Sari-sari.
• View your ticket details.
• Make sure your device is connected to a printer before printing your ticket.

Present the printed ticket to the registration staff for scanning and follow further instructions to enter the event.`
        }
      ]
    },
    {
      id: 4,
      title: 'Refunds & Cancellations',
      icon: '💰',
      description: 'Information about refunds and cancellation policies',
      articleCount: 1,
      articles: [
        { 
          id: 6, 
          title: 'What is the refund policy?',
          content: ``
        }
      ]
    },
    {
      id: 5,
      title: 'Technical Issues',
      icon: '⚙️',
      description: 'Troubleshooting and technical support',
      articleCount: 1,
      articles: [
        { 
          id:7, 
          title: 'Website is not loading properly',
          content: `If you're experiencing issues with our website:

1. Check your internet connection
2. Clear your browser cache and cookies
3. Try using a different browser (Chrome, Firefox, Safari)
4. Disable browser extensions temporarily
5. Try accessing the site in incognito/private mode
6. Check if the issue persists on mobile

If problems continue:
• Try accessing from a different device 
• Contact our technical support team
• Check our status page for known issues

Our technical team will be glad to assist you promptly during business hours.`
        }
      ]
    }
  ];



  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

  );
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  const handleBackToCategory = () => {
    setSelectedArticle(null);
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 font-outfit text-sm text-gray-600 mb-4">
              <button
                onClick={handleBackToCategories}
                className="hover:text-gray-900 transition-colors"
              >
                Help Center
              </button>
              <div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <button
                onClick={handleBackToCategory}
                className="hover:text-gray-900 transition-colors"
              >
                {selectedCategory.title}
              </button>
              <div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <span className="text-gray-900">{selectedArticle.title}</span>
            </div>
            <button
              onClick={handleBackToCategory}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors mb-4"
            >
              <div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Back to {selectedCategory.title}
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{selectedArticle.title}</h1>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <div className="whitespace-pre-line text-gray-800">
                {selectedArticle.content}
              </div>
            </div>
         
          </article>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <button
                onClick={handleBackToCategories}
                className="hover:text-gray-900 transition-colors"
              >
                Help Center
              </button>
              <div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <span className="text-gray-900">{selectedCategory.title}</span>
            </div>
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
            >
              <div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              Back to Help Center
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl">{selectedCategory.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedCategory.title}</h1>
              <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {selectedCategory.articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-teal-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
        <FooterNav />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold font-outfit text-secondary mb-4">How can we help you?</h1>

          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">


        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse by Category'}
          </h2>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse our categories</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">{category.articleCount} articles</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-teal-600 group-hover:text-teal-700 transition-colors">
                    <span className="text-sm font-medium">View articles</span>
                    <div className="ml-1 group-hover:translate-x-1 transition-transform">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all group">
              <div className="text-teal-600 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Live Chat</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all group">
              <div className="text-teal-600 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Email Support</div>

              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all group">
              <div className="text-teal-600 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Phone Support</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SariSariHelpCenter;