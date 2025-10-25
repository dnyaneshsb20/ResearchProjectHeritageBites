import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const FeedbackRatingsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data, error } = await supabase.from('website_feedback').select('*');
      if (error) {
        toast.error('Failed to fetch feedback data');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setChartData([]);
        setLoading(false);
        return;
      }

      // Calculate average ratings
      const fields = [
        'e_market_rating',
        'recipe_rating',
        'chatbot_rating',
        'contribution_rating',
        'overall_rating',
      ];
      const averages = fields.map((field) => {
        const valid = data.filter((d) => d[field] != null);
        const avg = valid.reduce((sum, d) => sum + d[field], 0) / (valid.length || 1);
        return { name: field.replace('_', ' ').toUpperCase(), Average: parseFloat(avg.toFixed(2)) };
      });

      setChartData(averages);
      setLoading(false);
    };

    fetchRatings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Loading chart...
      </div>
    );

  if (!chartData.length)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        No feedback available for chart
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Feedback Ratings Overview
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            {/* Remove XAxis labels */}
            <XAxis dataKey="name" tick={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#374151' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #d1d5db' }}
              itemStyle={{ color: '#111827' }}
            />
            <Bar
              dataKey="Average"
              radius={[6, 6, 0, 0]}
              barSize={40}
              fill="#4ade80"
            // Assign colors per bar
            >
              {chartData.map((entry, index) => {
                const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316', '#eab308']; // red, blue, green, orange, yellow
                return <Cell key={`cell-${index}`} fill={colors[index]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackRatingsChart;
