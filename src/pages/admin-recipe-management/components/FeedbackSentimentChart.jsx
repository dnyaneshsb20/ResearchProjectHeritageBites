import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const FeedbackSentimentChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colors: green = positive, yellow = neutral, red = negative
  const COLORS = ['#22c55e', '#facc15', '#ef4444'];

  useEffect(() => {
    const fetchData = async () => {
      const { data: feedbacks, error } = await supabase
        .from('website_feedback')
        .select('sentiment_label');

      if (error) {
        toast.error('Failed to fetch sentiment data.');
        setLoading(false);
        return;
      }

      const counts = { positive: 0, neutral: 0, negative: 0 };
      feedbacks.forEach(f => {
        if (f.sentiment_label) counts[f.sentiment_label] += 1;
      });

      setData([
        { name: 'Positive', value: counts.positive },
        { name: 'Neutral', value: counts.neutral },
        { name: 'Negative', value: counts.negative },
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Loading sentiment chart...
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Feedback Sentiment Overview
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                color: '#111827',
              }}
            />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackSentimentChart;
