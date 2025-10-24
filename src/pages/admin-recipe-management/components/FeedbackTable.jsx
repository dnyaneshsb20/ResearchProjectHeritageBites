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
  if (feedbacks.length === 0) return <div>No feedback found.</div>;

  // Get all keys dynamically from first feedback entry
  const columns = Object.keys(feedbacks[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border p-2">
                {col.replace(/_/g, ' ').toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={f.feedback_id} className="border">
              {columns.map((col) => {
                let value = f[col];
                
                // Special formatting for sentiment
                if (col === 'sentiment_label') {
                  return (
                    <td key={col} className="border p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          value === 'positive'
                            ? 'bg-green-500'
                            : value === 'neutral'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {value?.toUpperCase()} ({(f.sentiment_score * 100).toFixed(1)}%)
                      </span>
                    </td>
                  );
                }

                // Format time spent nicely
                if (col === 'time_spent' && value != null) {
                  const mins = Math.floor(value / 60);
                  const secs = value % 60;
                  value = `${mins}m ${secs}s`;
                }

                // Format timestamp
                if (col === 'created_at' && value) {
                  value = new Date(value).toLocaleString();
                }

                return <td key={col} className="border p-2">{value ?? '-'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
