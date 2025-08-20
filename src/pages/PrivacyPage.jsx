import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe, Bell, Trash2, FileText } from 'lucide-react';
import BackButton from '../components/ui/BackButton';

const PrivacyPage = () => {
  const sections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            At Nawartu, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-collection',
      title: 'Information We Collect',
      icon: <Database className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Personal Information:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Account Details:</strong> Name, email, phone number, profile information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Verification:</strong> ID documents, passport information for KYC compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Payment:</strong> Payment method details (processed securely via Stripe)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Communication:</strong> Messages between hosts and guests</span>
            </li>
          </ul>
          
          <h4 className="font-semibold text-gray-900 mb-3 mt-6">Usage Information:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Platform Activity:</strong> Search history, booking preferences, property views</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Device Information:</strong> IP address, browser type, device identifiers</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-use',
      title: 'How We Use Your Information',
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Primary Uses:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Service Provision:</strong> Process bookings, facilitate payments, enable communication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Verification:</strong> Verify user identity and property ownership</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Support:</strong> Provide customer service and resolve issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Improvement:</strong> Enhance platform functionality and user experience</span>
            </li>
          </ul>
          
          <h4 className="font-semibold text-gray-900 mb-3 mt-6">Legal Compliance:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Regulatory:</strong> Comply with Syrian laws and regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Security:</strong> Prevent fraud and ensure platform safety</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing',
      icon: <Globe className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3">We Do NOT Sell Your Data</h4>
            <p className="text-amber-700 text-sm">
              Nawartu does not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-3">Limited Sharing:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Hosts & Guests:</strong> Essential information shared for booking coordination</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Payment Processors:</strong> Stripe for secure payment processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Legal Requirements:</strong> When required by law or to protect rights</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Security Measures:</h4>
            <ul className="space-y-1 text-green-700 text-sm">
              <li>• End-to-end encryption for sensitive data</li>
              <li>• Secure HTTPS connections</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited employee access to user data</li>
              <li>• Compliance with industry security standards</li>
            </ul>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your personal information from unauthorized access, 
            alteration, disclosure, or destruction.
          </p>
        </div>
      )
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <Database className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Retention Periods:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Account Data:</strong> Retained while your account is active</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Booking Records:</strong> Kept for 7 years for legal compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Verification Documents:</strong> Stored securely for KYC compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Communication:</strong> Retained for 2 years for support purposes</span>
            </li>
          </ul>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              <strong>Note:</strong> Some data may be retained longer if required by law or for legitimate business purposes.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Choices',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Your Rights:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Access:</strong> Request a copy of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Correction:</strong> Update or correct inaccurate information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Deletion:</strong> Request account and data deletion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Portability:</strong> Export your data in a readable format</span>
            </li>
          </ul>
          
          <h4 className="font-semibold text-gray-900 mb-3 mt-6">Communication Preferences:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Email Notifications:</strong> Control booking and promotional emails</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>SMS Alerts:</strong> Manage text message notifications</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience on our platform.
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-3">Cookie Types:</h4>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Essential:</strong> Required for platform functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Performance:</strong> Help us understand how you use our platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Functional:</strong> Remember your preferences and settings</span>
            </li>
          </ul>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: <Bell className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <a href="mailto:support@nawartu.com" className="text-green-600 hover:text-green-700">
                support@nawartu.com
              </a>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
              <a href="tel:+963969864741" className="text-green-600 hover:text-green-700">
                +963 969 864 741
              </a>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Response Time:</strong> We aim to respond to privacy-related inquiries within 48 hours.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">How we protect and handle your data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Commitment to Privacy</h3>
            <p className="text-blue-700">
              We are committed to transparency and protecting your personal information in compliance with Syrian laws and international best practices.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {index + 1}. {section.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Related Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Information</h3>
          <p className="text-gray-600 mb-6">
            Learn more about our platform policies and practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/terms" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Terms & Policies
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
