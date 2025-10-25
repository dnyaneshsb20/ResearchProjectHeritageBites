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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Loading feedback...
      </div>
    );
  if (feedbacks.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        No feedback found.
      </div>
    );

  const columns = Object.keys(feedbacks[0]);

  return (
    <div className="overflow-x-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Feedback Table
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feedbacks.map((f, idx) => (
            <tr
              key={f.feedback_id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} // first row white, second grey
            >
              {columns.map((col) => {
                let value = f[col];

                if (col === 'sentiment_label') {
                  return (
                    <td key={col} className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
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

                if (col === 'time_spent' && value != null) {
                  const mins = Math.floor(value / 60);
                  const secs = value % 60;
                  value = `${mins}m ${secs}s`;
                }

                if (col === 'created_at' && value) {
                  value = new Date(value).toLocaleString();
                }

                return (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {value ?? '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
