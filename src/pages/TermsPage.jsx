import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale, UserCheck, CreditCard, Clock, AlertTriangle, Database, Ban, Gavel } from 'lucide-react';
import BackButton from '../components/ui/BackButton';

const TermsPage = () => {
  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Nawartu is a digital platform connecting:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Hosts:</strong> Individuals or businesses offering short-term stays.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span><strong>Guests:</strong> Travelers or locals seeking accommodations.</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We do not own or manage listed properties; we provide secure booking, payment, and communication services.
          </p>
        </div>
      )
    },
    {
      id: 'eligibility',
      title: 'Eligibility & Verification',
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Users must be 18+.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>KYC verification required for full access to hosting or booking.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'fees',
      title: 'Service Fees & Payments',
      icon: <CreditCard className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Guests pay a service fee of <strong>8%</strong> per booking.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>All transactions are processed via licensed, secure payment providers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Messaging between guest and host is enabled only after booking confirmation.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'cancellation',
      title: 'Cancellation & Refund Policy',
      icon: <Clock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3">Refund Schedule:</h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-amber-700">14+ days before check-in:</span>
                <span className="font-semibold text-green-600">Full refund</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-amber-700">5–13 days:</span>
                <span className="font-semibold text-green-600">50% refund</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-amber-700">48 hours–4 days:</span>
                <span className="font-semibold text-green-600">25% refund</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-amber-700">&lt;48 hours or no-show:</span>
                <span className="font-semibold text-red-600">No refund</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700"><strong>Important Notes:</strong></p>
            <ul className="space-y-1 mt-2 ml-4">
              <li className="text-gray-600">• Service fee is non-refundable.</li>
              <li className="text-gray-600">• Refunds processed within 5–10 business days.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'host-responsibilities',
      title: 'Host Responsibilities',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Provide accurate and updated property details.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Maintain cleanliness, safety, and legal compliance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Respond promptly to inquiries and booking confirmations.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'guest-responsibilities',
      title: 'Guest Responsibilities',
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Follow house rules and respect the property and neighbors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Avoid damage, illegal activities, or unauthorized use.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Liability & Insurance',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 leading-relaxed">
              <strong>Important:</strong> Nawartu is not liable for accidents, damages, or disputes during stays.
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We recommend both hosts and guests have personal or property insurance.
          </p>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Data & Privacy',
      icon: <Database className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>User data is stored and processed securely and in compliance with Syrian laws.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">•</span>
              <span>Users may request account deletion at any time; essential data may be retained for legal purposes.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'suspension',
      title: 'Account Suspension or Termination',
      icon: <Ban className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Accounts may be suspended or removed for:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-semibold">•</span>
              <span>Breaching policies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-semibold">•</span>
              <span>Fraudulent or harmful activities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-semibold">•</span>
              <span>Legal or regulatory requests</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <Gavel className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 leading-relaxed">
              These terms are governed by the laws of the <strong>Syrian Arab Republic</strong>.
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
              <h1 className="text-2xl font-bold text-gray-900">Terms & Policies</h1>
              <p className="text-gray-600">Nawartu Platform Terms of Service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Nawartu Terms & Policies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Welcome to Nawartu. These terms govern your use of our platform connecting hosts and guests for authentic Syrian accommodations.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-2">Last Updated</h3>
            <p className="text-green-700">December 2024</p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-green-600">
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

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About These Terms?</h3>
          <p className="text-gray-600 mb-6">
            If you have any questions about our terms and policies, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Contact Support
            </Link>
            <a 
              href="tel:+963969864741" 
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Call Us: +963 969 864 741
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
