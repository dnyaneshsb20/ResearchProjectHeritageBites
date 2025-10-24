import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const FeedbackSentimentChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#22c55e', '#facc15', '#ef4444']; // positive, neutral, negative

  useEffect(() => {
    const fetchData = async () => {
      const { data: feedbacks, error } = await supabase.from('website_feedback').select('sentiment_label');
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

  if (loading) return <div>Loading sentiment chart...</div>;
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackSentimentChart;
