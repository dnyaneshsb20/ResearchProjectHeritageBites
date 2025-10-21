import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../supabaseClient';
import * as Dialog from "@radix-ui/react-dialog";
import { format, isAfter, isBefore } from 'date-fns';

const AnalyticsDashboard = () => {
  const COLORS = ['#D97706', '#059669', '#DC2626', '#F59E0B', '#10B981', '#EF4444'];

  const [analyticsData, setAnalyticsData] = useState({
    totalSubmissions: 0,
    pendingReviews: 0,
    approvedThisMonth: 0,
    activeContributors: 0,
    submissionTrends: [],
    statusDistribution: [],
    regionalDistribution: [],
    topContributors: [],
    recentActivity: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 1️⃣ Total submissions
        const { count: totalSubmissions } = await supabase
          .from('rec_contributions')
          .select('*', { count: 'exact', head: true });

        // 2️⃣ Pending reviews
        const { count: pendingReviews } = await supabase
          .from('rec_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // 3️⃣ Approved this month
        const { count: approvedThisMonth } = await supabase
          .from('rec_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        // 4️⃣ Active contributors
        const { data: contributorsData } = await supabase
          .from('rec_contributions')
          .select('created_by');
        const activeContributors = new Set(contributorsData.map(c => c.created_by)).size;

        // 5️⃣ Submission trends (last 6 months)
        const { data: trendsData } = await supabase
          .from('rec_contributions')
          .select('created_at')
          .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString());

        const submissionTrends = [];
        const monthMap = {};
        for (let i = 0; i < 6; i++) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthName = d.toLocaleString('default', { month: 'short' });
          monthMap[monthName] = 0;
        }
        trendsData?.forEach(r => {
          const monthName = new Date(r.created_at).toLocaleString('default', { month: 'short' });
          if (monthMap[monthName] !== undefined) monthMap[monthName]++;
        });
        for (let key of Object.keys(monthMap).reverse()) {
          submissionTrends.push({ month: key, submissions: monthMap[key] });
        }

        // 6️⃣ Status distribution
        const { data: statusData } = await supabase
          .from('rec_contributions')
          .select('status');
        const statusDistributionMap = {};
        statusData?.forEach(r => {
          statusDistributionMap[r.status] = (statusDistributionMap[r.status] || 0) + 1;
        });
        const statusDistribution = Object.keys(statusDistributionMap).map(key => ({
          name: key,
          value: statusDistributionMap[key],
        }));

        // 7️⃣ Regional distribution
        const { data: regionData } = await supabase
          .from('rec_contributions')
          .select('state_id');
        const { data: statesData } = await supabase.from('states').select('state_id, state_name');

        const regionMap = {};
        regionData?.forEach(r => {
          const state = statesData.find(s => s.state_id === r.state_id);
          const regionName = state?.state_name || 'Unknown';
          regionMap[regionName] = (regionMap[regionName] || 0) + 1;
        });
        const regionalDistribution = Object.keys(regionMap).map(key => ({
          region: key,
          count: regionMap[key],
        }));

        // 8️⃣ Top contributors
        const contributorsCountMap = {};
        contributorsData?.forEach(c => {
          contributorsCountMap[c.created_by] = (contributorsCountMap[c.created_by] || 0) + 1;
        });
        const topContributorsData = Object.entries(contributorsCountMap)
          .map(([user_id, submissions]) => ({ user_id, submissions }))
          .sort((a, b) => b.submissions - a.submissions)
          .slice(0, 5);

        const { data: usersData } = await supabase
          .from('users')
          .select('user_id, name');

        const topContributors = topContributorsData.map(c => {
          const user = usersData.find(u => u.user_id === c.user_id);
          return {
            id: c.user_id,
            name: user?.name || 'Anonymous',
            submissions: c.submissions,
            rating: Math.floor(Math.random() * 5) + 1, // placeholder if no rating yet
          };
        });

        // 9️⃣ Recent activity (last 10)
        const { data: recentData } = await supabase
          .from('rec_contributions')
          .select('name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        const recentActivity = recentData.map(r => ({
          type: r.status,
          description: `${r.name} was ${r.status}`,
          timestamp: new Date(r.created_at).toLocaleString(),
        }));

        setAnalyticsData({
          totalSubmissions,
          pendingReviews,
          approvedThisMonth,
          activeContributors,
          submissionTrends,
          statusDistribution,
          regionalDistribution,
          topContributors,
          recentActivity,
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
    const isPositive = change > 0;
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center mt-1">
              <Icon
                name={isPositive ? "TrendingUp" : "TrendingDown"}
                size={14}
                className={isPositive ? "text-success" : "text-destructive"}
              />
              <span className={`text-xs ml-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-lg bg-${color} bg-opacity-10 flex items-center justify-center`}>
            <Icon name={icon} size={24} className={`text-${color}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={analyticsData?.totalSubmissions}
          change={12}
          icon="FileText"
          color="primary"
          className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl"
        />
        <StatCard
          title="Pending Reviews"
          value={analyticsData?.pendingReviews}
          change={-8}
          icon="Clock"
          color="destructive"
          className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl"
        />
        <StatCard
          title="Approved This Month"
          value={analyticsData?.approvedThisMonth}
          change={25}
          icon="Check"
          color="success"
          className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl"
        />
        <StatCard
          title="Active Contributors"
          value={analyticsData?.activeContributors}
          change={15}
          icon="Users"
          color="secondary"
          className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Submission Trends</h3>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.submissionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Status Distribution */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Review Status</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>

          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={90} // slightly bigger radius for better readability
                  dataKey="value"
                >
                  {analyticsData?.statusDistribution?.map((entry) => {
                    let fillColor = '#8884d8'; // default
                    if (entry.name === 'approved') fillColor = '#22C55E'; // green / secondary
                    else if (entry.name === 'pending') fillColor = '#EF4444'; // red
                    else if (entry.name === 'changes requested') fillColor = '#F97316'; // orange / primary
                    return <Cell key={entry.name} fill={fillColor} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Distribution and Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Regional Distribution</h3>
            <Icon name="Map" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.regionalDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="region" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top Contributors</h3>
            <Icon name="Award" size={20} className="text-muted-foreground" />
          </div>

          {/* Contributors List */}
          <div className="space-y-4">
            {analyticsData?.topContributors
              ?.sort((a, b) => b.rating - a.rating) // Sort by rating descending
              .map((contributor, index) => {
                // Assign background colors for ranking numbers
                let bgColor = 'bg-muted text-muted-foreground';
                if (index === 0) bgColor = 'bg-yellow-400 text-white'; // Gold
                else if (index === 1) bgColor = 'bg-gray-400 text-white'; // Silver
                else if (index === 2) bgColor = 'bg-[#8B4513] text-white'; // Bronze

                return (
                  <div key={contributor?.id} className="flex items-center space-x-4 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                    {/* Ranking Number */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium ${bgColor}`}>
                      {index + 1}
                    </div>

                    {/* Contributor Info */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{contributor?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor?.submissions} submissions • {contributor?.rating}/5 rating
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-warning" />
                      <span className="text-sm font-medium text-foreground">{contributor?.rating}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>

          {/* Button + Icon */}
          <div className="flex items-center gap-2">
            <Dialog.Root>
              <Dialog.Trigger className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/80">
                View All Activities
              </Dialog.Trigger>

              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-card p-6 rounded-lg shadow-lg mt-8">

                {/* Close Button X */}
                <Dialog.Close className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={18} />
                </Dialog.Close>

                <h4 className="text-lg font-semibold mb-4">All Activities</h4>
                <div className="space-y-3">
                  {analyticsData?.recentActivity?.map((activity, index) => {
                    let bgColor = '';
                    let iconName = '';
                    switch (activity?.type) {
                      case 'approved':
                        bgColor = 'bg-success text-success-foreground';
                        iconName = 'Check';
                        break;
                      case 'rejected':
                        bgColor = 'bg-destructive text-destructive-foreground';
                        iconName = 'X';
                        break;
                      case 'pending':
                        bgColor = 'bg-warning text-warning-foreground';
                        iconName = 'Clock';
                        break;
                      default:
                        bgColor = 'bg-primary text-primary-foreground';
                        iconName = 'Edit';
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} flex-shrink-0`}>
                          <Icon name={iconName} size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground font-medium">{activity?.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity?.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Dialog.Content>
            </Dialog.Root>

            <Icon name="Activity" size={22} className="text-muted-foreground" />
          </div>
        </div>

        {/* Latest 6 Activities */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {analyticsData?.recentActivity?.slice(0, 6).map((activity, index) => {
            let bgColor = '';
            let iconName = '';
            switch (activity?.type) {
              case 'approved':
                bgColor = 'bg-success text-success-foreground';
                iconName = 'Check';
                break;
              case 'rejected':
                bgColor = 'bg-destructive text-destructive-foreground';
                iconName = 'X';
                break;
              case 'pending':
                bgColor = 'bg-warning text-warning-foreground';
                iconName = 'Clock';
                break;
              default:
                bgColor = 'bg-primary text-primary-foreground';
                iconName = 'Edit';
            }

            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} flex-shrink-0`}>
                  <Icon name={iconName} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{activity?.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity?.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
