import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const FeedbackRatingsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data, error } = await supabase.from('website_feedback').select('*');
      if (error) {
        toast.error("Failed to fetch feedback data");
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setChartData([]);
        setLoading(false);
        return;
      }

      // Calculate average ratings
      const fields = ['e_market_rating', 'recipe_rating', 'chatbot_rating', 'contribution_rating', 'overall_rating'];
      const averages = fields.map((field) => {
        const valid = data.filter(d => d[field] != null);
        const avg = valid.reduce((sum, d) => sum + d[field], 0) / (valid.length || 1);
        return { name: field.replace('_', ' ').toUpperCase(), Average: parseFloat(avg.toFixed(2)) };
      });

      setChartData(averages);
      setLoading(false);
    };

    fetchRatings();
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!chartData.length) return <div>No feedback available for chart</div>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar dataKey="Average" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackRatingsChart;
