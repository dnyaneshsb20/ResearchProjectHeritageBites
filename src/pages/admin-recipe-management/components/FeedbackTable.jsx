import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient'; 
import toast from 'react-hot-toast';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('website_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        toast.error('Failed to fetch feedback.');
      } else {
        setFeedbacks(data);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, []);

  if (loading) return <div>Loading feedback...</div>;

  return (
    <table className="w-full text-left border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Overall Rating</th>
          <th className="border p-2">Overall Review</th>
          <th className="border p-2">Sentiment</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((f) => (
          <tr key={f.feedback_id} className="border">
            <td className="border p-2">{f.name}</td>
            <td className="border p-2">{f.email}</td>
            <td className="border p-2">{f.overall_rating}</td>
            <td className="border p-2">{f.overall_review}</td>
            <td className="border p-2">
              <span
                className={`px-2 py-1 rounded-full text-white ${
                  f.sentiment_label === 'positive'
                    ? 'bg-green-500'
                    : f.sentiment_label === 'neutral'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                {f.sentiment_label.toUpperCase()} ({(f.sentiment_score*100).toFixed(1)}%)
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackTable;
