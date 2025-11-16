import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../supabaseClient';
import ContributorProfileModal from './ContributorProfileModal';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Users, Search, Filter, Eye, Download, MapPin, Star, Calendar } from 'lucide-react';

// Helper functions for initials and color (same as UserManagement)
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[1][0]}`
    : `${names[0][0]}`;
};

const getColorFromName = (name) => {
  if (!name) return "#6b7280";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

const ContributorManagement = ({ onUpdateContributor, onViewContributor }) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('submissions');
  const [filterRating, setFilterRating] = useState('');
  const [selectedContributorId, setSelectedContributorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortOptions = [
    { value: 'submissions', label: 'Most Submissions' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name A-Z' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' }
  ];

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('rec_contributions')
      .select(`
        created_by (
          user_id,
          name,
          email,
          location
        ),
        status,
        meal_type,
        created_at
      `);

    if (error) {
      console.error('Error fetching contributions:', error);
      setLoading(false);
      return;
    }

    const contributorMap = data?.reduce((acc, contribution) => {
      const user = contribution.created_by;
      if (!user) return acc;

      const userId = user.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          name: user.name,
          email: user.email,
          location: user.location,
          totalSubmissions: 0,
          approvedSubmissions: 0,
          lastSubmission: null,
          specialties: [],
          rating: Math.floor(Math.random() * 5) + 1,
          status: 'active',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        };
      }

      acc[userId].totalSubmissions += 1;
      if (contribution.status === 'approved') acc[userId].approvedSubmissions += 1;
      if (!acc[userId].lastSubmission || new Date(contribution.created_at) > new Date(acc[userId].lastSubmission)) {
        acc[userId].lastSubmission = contribution.created_at;
      }
      if (contribution.meal_type && !acc[userId].specialties.includes(contribution.meal_type)) {
        acc[userId].specialties.push(contribution.meal_type);
      }

      return acc;
    }, {});

    setContributors(Object.values(contributorMap));
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Suspended' },
      verified: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Verified' }
    };
    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "text-amber-500 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating}.0</span>
      </div>
    );
  };

  // Filter & Sort contributors
  const filteredContributors = useMemo(() => {
    return contributors
      .filter(c => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRating = !filterRating || c.rating >= parseInt(filterRating);
        return matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'submissions': return b.totalSubmissions - a.totalSubmissions;
          case 'rating': return b.rating - a.rating;
          case 'recent': return new Date(b.lastSubmission) - new Date(a.lastSubmission);
          case 'name': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
  }, [contributors, searchQuery, sortBy, filterRating]);

  const handleViewContributor = (id) => {
    setSelectedContributorId(id);
    setIsModalOpen(true);
  };

  const handleExportContributorsData = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.text("Heritage Bites — Contributors Report", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 22);

    const headers = [[
      "Sr. No",
      "Name of Contributor",
      "Location",
      "Total Submitted",
      "Total Approved",
      "Rating",
      "Last Submission Date",
      "Specialities"
    ]];

    const data = contributors.map((c, index) => [
      index + 1,
      c.name,
      c.location || "—",
      c.totalSubmissions,
      c.approvedSubmissions,
      `${c.rating} ★`,
      c.lastSubmission
        ? new Date(c.lastSubmission).toLocaleDateString("en-IN")
        : "—",
      c.specialties?.join(", ") || "—"
    ]);

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [45, 106, 79],
        textColor: [255, 255, 255],
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Heritage Bites Contributors Report | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    doc.save("HeritageBites_Contributors_Report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading contributors database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Contributor Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor recipe contributors ({contributors.length} total)
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search contributors..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary w-full max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                variant="default"
                onClick={handleExportContributorsData}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{contributors.length}</div>
            <div className="text-sm font-medium text-muted-foreground">Total Contributors</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {contributors.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Active</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {contributors.filter(c => c.status === 'verified').length}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Verified</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(contributors.reduce((sum, c) => sum + c.rating, 0) / contributors.length)?.toFixed(1)}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Avg Rating</div>
          </div>
        </div>

        {/* Contributors Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Contributor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContributors.map((contributor) => (
                  <tr key={contributor.id} className="hover:bg-muted/30 transition-colors duration-150">
                    {/* Contributor Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                          style={{ backgroundColor: getColorFromName(contributor.name) }}
                        >
                          {getInitials(contributor.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-semibold text-foreground truncate">
                            {contributor.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {contributor.email}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{contributor.location || 'No location'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(contributor.status)}
                    </td>

                    {/* Submissions */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {contributor.totalSubmissions}
                            </p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-green-600">
                              {contributor.approvedSubmissions}
                            </p>
                            <p className="text-xs text-muted-foreground">Approved</p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      {renderStars(contributor.rating)}
                    </td>

                    {/* Last Activity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {contributor.lastSubmission 
                            ? new Date(contributor.lastSubmission).toLocaleDateString('en-IN')
                            : 'Never'
                          }
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewContributor(contributor.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredContributors.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery || filterRating ? "No contributors found" : "No contributors yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || filterRating
                  ? "Try adjusting your search or filter criteria"
                  : "Contributors will appear here once they submit recipes on the platform"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contributor Profile Modal */}
      <ContributorProfileModal
        contributorId={selectedContributorId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContributorManagement;