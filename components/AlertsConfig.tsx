
import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';

interface AlertConfig {
  id: string;
  keyword: string;
  threshold: number;
  notificationEmail: string;
}

interface ValidationErrors {
  keyword?: string;
  notificationEmail?: string;
}

export const AlertsConfig: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [threshold, setThreshold] = useState<number>(70);
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Effect to clear success message after a delay
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!keyword.trim()) {
      newErrors.keyword = "Keyword is required.";
    }
    if (!notificationEmail.trim()) {
      newErrors.notificationEmail = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(notificationEmail)) {
      newErrors.notificationEmail = "Email format is invalid.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowSuccessMessage(false); // Ensure success message is hidden if validation fails
      return;
    }
    
    const newAlert: AlertConfig = {
      id: Date.now().toString(),
      keyword,
      threshold,
      notificationEmail,
    };
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    console.log("Alert config saved (mock):", newAlert);

    // Reset form fields
    setKeyword('');
    setThreshold(70);
    setNotificationEmail('');
    setErrors({}); // Clear errors on successful submission
    
    setShowSuccessMessage(true);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <Card title="Configure & Manage Sentiment Alerts (Mock UI)">
      <p className="text-sm text-gray-600 mb-4">
        Set up notifications for significant changes in sentiment. (This is a UI demonstration only; no actual alerts will be sent. Configurations are lost on page refresh.)
      </p>
      {showSuccessMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded transition-opacity duration-300">
          Alert configuration saved successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="alertKeyword" className="block text-sm font-medium text-gray-700">
            Keyword/Hashtag to Monitor
          </label>
          <input
            type="text"
            id="alertKeyword"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (errors.keyword) setErrors(prev => ({...prev, keyword: undefined}));
            }}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100 ${errors.keyword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="#MyBrand or @MyCompany"
            aria-describedby="keyword-error"
          />
          {errors.keyword && <p id="keyword-error" className="text-xs text-red-500 mt-1">{errors.keyword}</p>}
        </div>
        <div>
          <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-700">
            Negative Sentiment Threshold (%)
          </label>
          <input
            type="number"
            id="alertThreshold"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            min="0"
            max="100"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100"
          />
        </div>
        <div>
          <label htmlFor="notificationEmail" className="block text-sm font-medium text-gray-700">
            Notification Email
          </label>
          <input
            type="email"
            id="notificationEmail"
            value={notificationEmail}
            onChange={(e) => {
              setNotificationEmail(e.target.value);
              if (errors.notificationEmail) setErrors(prev => ({...prev, notificationEmail: undefined}));
            }}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-hnai-teal focus:border-hnai-teal bg-gradient-to-b from-gray-50 to-gray-100 ${errors.notificationEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your-email@example.com"
            aria-describedby="email-error"
          />
            {errors.notificationEmail && <p id="email-error" className="text-xs text-red-500 mt-1">{errors.notificationEmail}</p>}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-hnai-teal text-white font-medium rounded-md hover:bg-opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hnai-teal"
          >
            Save Alert Configuration
          </button>
        </div>
      </form>

      {alerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-hnai-dark-text mb-3">Saved Alert Configurations:</h3>
          <ul className="space-y-3">
            {alerts.map(alert => (
              <li key={alert.id} className="p-3 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-medium text-hnai-teal">{alert.keyword}</p>
                  <p className="text-xs text-gray-600">Threshold: {alert.threshold}% | Email: {alert.notificationEmail}</p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                  aria-label={`Delete alert for ${alert.keyword}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
