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
    const colorClasses = {
      primary: 'from-blue-500 to-blue-600',
      destructive: 'from-red-500 to-red-600',
      success: 'from-green-500 to-green-600',
      warning: 'from-amber-500 to-amber-600'
    };

    return (
      <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg`}>
            <Icon name={icon} size={20} className="text-white" />
          </div>
          <div className="flex flex-col items-end">
            {change && (
              <>
                <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'} mb-1 shadow-sm`}></div>
                <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change)}% {isPositive ? '↑' : '↓'}
                </span>
              </>
            )}
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className={`w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 mt-3 rounded-full`}></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-card">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={analyticsData?.totalSubmissions}
          // change={12}
          icon="FileText"
          color="primary"
        />
        <StatCard
          title="Pending Reviews"
          value={analyticsData?.pendingReviews}
          // change={-8}
          icon="Clock"
          color="destructive"
        />
        <StatCard
          title="Approved This Month"
          value={analyticsData?.approvedThisMonth}
          // change={25}
          icon="CheckCircle"
          color="success"
        />
        <StatCard
          title="Active Contributors"
          value={analyticsData?.activeContributors}
          // change={15}
          icon="Users"
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Submission Trends</h3>
              <p className="text-sm text-muted-foreground mt-1">Last 6 months performance</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Icon name="TrendingUp" size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.submissionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#f59e0b' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Status Distribution */}
        <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Review Status</h3>
              <p className="text-sm text-muted-foreground mt-1">Current distribution</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Icon name="PieChart" size={20} className="text-green-600" />
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                >
                  {analyticsData?.statusDistribution?.map((entry, index) => {
                    const colors = {
                      'approved': '#22c55e',
                      'pending': '#EF4444',
                      'changes requested': '#F59E0B',
                      'rejected': '#6B7280'
                    };
                    return <Cell key={entry.name} fill={colors[entry.name] || '#8884d8'} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Distribution and Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Regional Distribution</h3>
              <p className="text-sm text-muted-foreground mt-1">Contributions by region</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Icon name="Map" size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="h-[470px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.regionalDistribution} barSize={75}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.3} />
                <XAxis
                  dataKey="region"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={60}
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y + 15} // adjust vertical spacing
                      textAnchor="middle" // centers under bar
                      fill="#64748b"
                      fontSize={12}
                      fontWeight="500"
                    >
                      {payload.value}
                    </text>
                  )}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                >
                  {analyticsData?.regionalDistribution?.map((entry, index) => {
                    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316', '#eab308'];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.8';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Top Contributors</h3>
              <p className="text-sm text-muted-foreground mt-1">Most active community members</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Icon name="Award" size={20} className="text-amber-600" />
            </div>
          </div>

          <div className="space-y-4">
            {analyticsData?.topContributors
              ?.sort((a, b) => b.rating - a.rating)
              .map((contributor, index) => {
                const rankColors = [
                  'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg',
                  'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md',
                  'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-sm',
                  'bg-muted/50 text-muted-foreground',
                  'bg-muted/30 text-muted-foreground'
                ];

                return (
                  <div key={contributor?.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl hover:bg-background/80 transition-all duration-200 group border border-border/30">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rankColors[index]}`}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {contributor?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {contributor?.submissions} submissions
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                      <Icon name="Star" size={14} className="text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">{contributor?.rating}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Latest platform updates</p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog.Root>
              <Dialog.Trigger className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                View All
              </Dialog.Trigger>

              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              <Dialog.Content className="fixed top-24 left-1/2 -translate-x-1/2 max-h-[85vh] w-[90vw] max-w-3xl overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-foreground">All Activities</h4>
                  <Dialog.Close className="p-2 hover:bg-primary hover:text-white rounded-lg transition-colors">
                    <Icon name="X" size={20} />
                  </Dialog.Close>
                </div>

                <div className="space-y-3">
                  {analyticsData?.recentActivity?.map((activity, index) => {
                    const activityConfig = {
                      'approved': {
                        bg: 'bg-green-500/20 border-green-500/30',
                        icon: 'CheckCircle',
                        iconColor: 'text-green-600'
                      },
                      'rejected': {
                        bg: 'bg-red-500/20 border-red-500/30',
                        icon: 'XCircle',
                        iconColor: 'text-red-600'
                      },
                      'pending': {
                        bg: 'bg-amber-500/20 border-amber-500/30',
                        icon: 'Clock',
                        iconColor: 'text-amber-600'
                      },
                      'changes requested': {
                        bg: 'bg-blue-500/20 border-blue-500/30',
                        icon: 'Edit',
                        iconColor: 'text-blue-600'
                      }
                    };

                    const config = activityConfig[activity?.type] || activityConfig.pending;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} hover:shadow-sm transition-all duration-200`}
                      >
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <Icon name={config.icon} size={18} className={config.iconColor} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity?.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Dialog.Content>
            </Dialog.Root>

            <div className="p-3 bg-primary/10 rounded-xl">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {analyticsData?.recentActivity?.slice(0, 6).map((activity, index) => {
            const activityConfig = {
              'approved': {
                bg: 'bg-green-500/20 border-green-500/30',
                icon: 'CheckCircle',
                iconColor: 'text-green-600'
              },
              'rejected': {
                bg: 'bg-red-500/20 border-red-500/30',
                icon: 'XCircle',
                iconColor: 'text-red-600'
              },
              'pending': {
                bg: 'bg-amber-500/20 border-amber-500/30',
                icon: 'Clock',
                iconColor: 'text-amber-600'
              },
              'changes requested': {
                bg: 'bg-blue-500/20 border-blue-500/30',
                icon: 'Edit',
                iconColor: 'text-blue-600'
              }
            };

            const config = activityConfig[activity?.type] || activityConfig.pending;

            return (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} hover:shadow-sm transition-all duration-200`}
              >
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon name={config.icon} size={18} className={config.iconColor} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
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