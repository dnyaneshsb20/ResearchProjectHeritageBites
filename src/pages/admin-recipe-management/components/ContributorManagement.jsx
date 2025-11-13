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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
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

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return "#999";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
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
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contributors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contributor Management</h2>
          <p className="text-muted-foreground">Manage and monitor recipe contributors</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            iconName="Download" 
            iconPosition="left" 
            onClick={handleExportContributorsData}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{contributors.length}</p>
          <p className="text-sm text-muted-foreground">Total Contributors</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{contributors.filter(c => c.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{contributors.filter(c => c.status === 'verified').length}</p>
          <p className="text-sm text-muted-foreground">Verified</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {(contributors.reduce((sum, c) => sum + c.rating, 0) / contributors.length)?.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">Avg Rating</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search contributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>

          <Select options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Sort by" />
          <Select options={ratingOptions} value={filterRating} onChange={setFilterRating} placeholder="Filter by rating" />
        </div>
      </div>

      {/* Contributors Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contributor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Specialties
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContributors.map((contributor) => (
                <tr key={contributor.id} className="hover:bg-muted/30 transition-colors">
                  {/* Contributor Info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: getColorFromName(contributor.name) }}
                      >
                        {getInitials(contributor.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {contributor.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {contributor.email}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                          <Icon name="MapPin" size={12} />
                          <span>{contributor.location || 'No location'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    {getStatusBadge(contributor.status)}
                  </td>

                  {/* Submissions */}
                  <td className="px-4 py-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        {contributor.totalSubmissions}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </td>

                  {/* Approved */}
                  <td className="px-4 py-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">
                        {contributor.approvedSubmissions}
                      </p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4">
                    {renderStars(contributor.rating)}
                  </td>

                  {/* Last Activity */}
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {contributor.lastSubmission ? (
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(contributor.lastSubmission).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-xs">
                          {new Date(contributor.lastSubmission).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </td>

                  {/* Specialties */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {contributor.specialties.slice(0, 2).map((specialty, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border border-border"
                        >
                          {specialty}
                        </span>
                      ))}
                      {contributor.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border border-border">
                          +{contributor.specialties.length - 2}
                        </span>
                      )}
                      {contributor.specialties.length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost2"
                      size="sm"
                      onClick={() => handleViewContributor(contributor.id)}
                      className="whitespace-nowrap"
                    >
                      <Icon name="Eye" size={14} />
                      <span className="ml-1">View</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredContributors.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No contributors found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterRating 
                ? "Try adjusting your search or filter criteria."
                : "There are no contributors in the system yet."
              }
            </p>
          </div>
        )}
      </div>

      <ContributorProfileModal
        contributorId={selectedContributorId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContributorManagement;