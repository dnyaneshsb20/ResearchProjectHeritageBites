import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsDashboard = ({ analyticsData }) => {
  const COLORS = ['#D97706', '#059669', '#DC2626', '#F59E0B', '#10B981', '#EF4444'];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={analyticsData?.totalSubmissions}
          change={12}
          icon="FileText"
          color="primary"
        />
        <StatCard
          title="Pending Reviews"
          value={analyticsData?.pendingReviews}
          change={-8}
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Approved This Month"
          value={analyticsData?.approvedThisMonth}
          change={25}
          icon="Check"
          color="success"
        />
        <StatCard
          title="Active Contributors"
          value={analyticsData?.activeContributors}
          change={15}
          icon="Users"
          color="secondary"
        />
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Submission Trends</h3>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.submissionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
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
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Review Status</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData?.statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
                <XAxis 
                  dataKey="region" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-secondary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top Contributors</h3>
            <Icon name="Award" size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {analyticsData?.topContributors?.map((contributor, index) => (
              <div key={contributor?.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-warning text-warning-foreground' :
                    index === 1 ? 'bg-muted text-muted-foreground' :
                    index === 2 ? 'bg-accent text-accent-foreground': 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{contributor?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contributor?.submissions} submissions • {contributor?.rating}/5 rating
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">{contributor?.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {analyticsData?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 bg-muted/30 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity?.type === 'approved' ? 'bg-success text-success-foreground' :
                activity?.type === 'rejected' ? 'bg-destructive text-destructive-foreground' :
                activity?.type === 'submitted' ? 'bg-primary text-primary-foreground' :
                'bg-warning text-warning-foreground'
              }`}>
                <Icon 
                  name={
                    activity?.type === 'approved' ? 'Check' :
                    activity?.type === 'rejected' ? 'X' :
                    activity?.type === 'submitted'? 'Plus' : 'Edit'
                  } 
                  size={16} 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;