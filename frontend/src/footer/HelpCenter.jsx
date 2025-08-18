import React, { useState } from 'react';
import FooterNav from "../components/FooterNav";

const SariSariHelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn how to create your account and get started',
      articleCount: 6,
      articles: [
        { 
          id: 1, 
          title: 'How to create a Sari-sari account?',
          content: `Creating your Sari-sari account is simple and quick:

1. Visit www.sari-sari.com and click "Sign Up"
2. Choose to register with your email or Facebook account
3. Fill in your personal information (name, email, phone number)
4. Verify your email address by clicking the link sent to your inbox
5. Complete your profile by adding additional details

Once your account is verified, you can start browsing and purchasing tickets for events!`
        },
        { 
          id: 2, 
          title: 'How to verify my email address?',
          content: `Email verification is required to secure your account:

1. After registration, check your email inbox for a verification message from Sari-sari
2. Click on the "Verify Email" button in the email
3. You'll be redirected to our website with a confirmation message
4. If you don't see the email, check your spam/junk folder
5. You can request a new verification email from your account settings

Your email must be verified before you can purchase tickets.`
        }
      ]
    },
    {
      id: 2,
      title: 'Buying Tickets',
      icon: '🎫',
      description: 'Everything about purchasing tickets',
      articleCount: 8,
      articles: [
        { 
          id: 3, 
          title: 'How to buy tickets on Sari-sari?',
          content: `Follow these steps to purchase your tickets:

1. Sign up or sign in to your Sari-sari account with either Facebook or email registration. Click on the poster or the 'Get Tickets' button of the event you would like to attend.

2. On the event page, select your ticket quantity and click on the 'Buy Tickets' button.

3. On the check-out page, select your preferred payment method (card or cash) and fill in the required information. Choose the answer to protect your ticket.

4. Review all the prices. Then, click on the checkbox next to "I agree to Ticketmelon's Terms of Service and Event Organizer's Agreement", and click the 'Pay Now' button.

If you wish to pay using cash, please print the payment slip to the selected payment channel as their system may not support scanning directly from the mobile phone screen.`
        },
        { 
          id: 4, 
          title: 'What payment methods are accepted?',
          content: `We accept various payment methods for your convenience:

Credit/Debit Cards:
• Visa
• Mastercard
• American Express

Digital Wallets:
• GCash
• PayMaya
• GrabPay

Bank Transfer:
• BPI
• BDO
• Metrobank

Cash Payment:
• 7-Eleven stores
• SM Business Centers
• Cebuana Lhuillier

All transactions are secured with SSL encryption to protect your payment information.`
        }
      ]
    },
    {
      id: 3,
      title: 'Managing Tickets',
      icon: '📱',
      description: 'View, transfer, and manage your purchased tickets',
      articleCount: 5,
      articles: [
        { 
          id: 5, 
          title: 'Where can I view my tickets?',
          content: `There are 3 ways to access your ticket, through your email, and Ticketmelon app. We highly suggest that you use your current email address that you have access to because all of the information, including your tickets, will be sent to that email.

Option 1: On Sari-sari website
1. Go to www.sari-sari.com and login to your Sari-sari account. Then, in the drop-down below your profile picture on the top right corner, click on 'My Tickets'.
2. In the 'Tickets' page, click on the poster of the event or 'View Ticket' to view your tickets.
3. This is an example of what your ticket looks like.

Option 2: Check the confirmation email in your Mailbox
Click the "Go to your Tickets" button to access your ticket! Tickets are also attached to your order confirmation email as a PDF file after you've successfully completed the transaction.`
        },
        { 
          id: 6, 
          title: 'How to use E-Ticket?',
          content: `Option 1: Show your ticket (QR code) from your mobile phone for a paperless ticket experience.
Show your QR code through the Sari-sari application by:
• Sign in → Select 'Tickets' → Tap on the event poster

Or find your ticket confirmation email from Sari-sari and open the attached PDF file.

Show your QR code to the registration staff to scan and follow further instructions to enter the event. This may include waiting a wristband or presenting a valid ID card.

Option 2: Print your ticket(s) from your email.
• Find your ticket confirmation email from Ticketmelon
• Open the attached PDF file
• Print your ticket(s)

Option 3: Print your ticket(s) from www.Sari-sari.com
• Go to www.Sari-sari.com and Sign in to your account
• Click on 'My Tickets' on the top right corner dropdown menu
• Click on 'Print Tickets' and print! Make sure you are connected to a printer`
        }
      ]
    },
    {
      id: 4,
      title: 'Account & Profile',
      icon: '👤',
      description: 'Manage your account settings and profile information',
      articleCount: 7,
      articles: [
        { 
          id: 7, 
          title: 'How to update my profile information?',
          content: `Keep your profile information up to date:

1. Log in to your Sari-sari account
2. Click on your profile picture in the top right corner
3. Select 'Profile Settings' from the dropdown menu
4. Update your information:
   • Name
   • Email address
   • Phone number
   • Profile picture
   • Address
5. Click 'Save Changes' to confirm your updates

Note: Some changes may require email verification before they take effect.`
        },
        { 
          id: 8, 
          title: 'How to change my password?',
          content: `To change your password for security:

1. Log in to your account
2. Go to Profile Settings
3. Click on 'Security' tab
4. Click 'Change Password'
5. Enter your current password
6. Enter your new password (must be at least 8 characters)
7. Confirm your new password
8. Click 'Update Password'

For security reasons, you'll be logged out of all devices and need to sign in again with your new password.`
        }
      ]
    },
    {
      id: 5,
      title: 'Refunds & Cancellations',
      icon: '💰',
      description: 'Information about refunds and cancellation policies',
      articleCount: 4,
      articles: [
        { 
          id: 9, 
          title: 'What is the refund policy?',
          content: `Our refund policy varies by event and organizer:

Standard Policy:
• Refunds are available up to 48 hours before the event
• A processing fee may apply (typically 10% of ticket price)
• Refunds are processed within 5-7 business days

Event Cancellation:
• Full refunds are provided if the event is cancelled by the organizer
• Refunds are automatically processed within 7-14 business days

Refund Protection:
• Optional insurance available during checkout
• Covers cancellations for various reasons
• Additional fee applies (usually 5-10% of ticket price)

To request a refund, contact our support team with your order number.`
        }
      ]
    },
    {
      id: 6,
      title: 'Technical Issues',
      icon: '⚙️',
      description: 'Troubleshooting and technical support',
      articleCount: 6,
      articles: [
        { 
          id: 10, 
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

Our technical team is available 24/7 to assist with any issues.`
        }
      ]
    }
  ];

  const popularArticles = [
    'How to buy tickets on Sari-sari?',
    'Where can I view my tickets?',
    'How to enter the event using E-Ticket?',
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
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600 mb-4">Was this article helpful?</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Yes, helpful
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  No, not helpful
                </button>
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
          <p className="text-xl text-gray-600 mb-8">Search our knowledge base or browse categories below</p>
          
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
        {/* Popular Articles */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Articles</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-gray-800 group-hover:text-teal-600 transition-colors">{article}</span>
                  <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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
                <div className="text-sm text-gray-600">Available 24/7</div>
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
                <div className="text-sm text-gray-600">Response in 2-4 hours</div>
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
                <div className="text-sm text-gray-600">Mon-Fri 9AM-6PM</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SariSariHelpCenter;