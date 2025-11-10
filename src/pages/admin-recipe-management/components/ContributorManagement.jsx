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

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    setLoading(true);

    // Fetch all contributions with user details
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

    // Aggregate contributions per contributor
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
          rating: Math.floor(Math.random() * 5) + 1, // Random rating placeholder (replace with real rating if available)
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
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
            size={16}
            className={star <= rating ? "text-amber-500 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-sm font-medium text-gray-700 ml-2">{rating}.0</span>
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

  const handleViewContributor = (id) => {
    setSelectedContributorId(id);
    setIsModalOpen(true);
  };

  // Helper functions for avatar initials & color
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
    return `hsl(${hue}, 70%, 60%)`; // pastel color tone
  };

  const handleExportContributorsData = () => {
    const doc = new jsPDF({ orientation: "landscape" }); // better for wide tables

    // Header
    doc.setFontSize(18);
    doc.text("Heritage Bites — Contributors Report", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 22);

    // Table headers
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

    // Table data
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

    // Table design
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
        fillColor: [45, 106, 79], // Heritage Bites green tone
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

    // Footer
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

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contributor Management</h2>
          <p className="text-gray-600 mt-2">Manage and monitor recipe contributors</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={handleExportContributorsData}
            className="hover:bg-[#22c55e] hover:text-white"
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-blue-600 mb-2">{contributors.length}</div>
          <div className="text-sm font-medium text-gray-700">Total Contributors</div>
        </div>
        <div className="bg-background rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{contributors.filter(c => c.status === 'active').length}</div>
          <div className="text-sm font-medium text-gray-700">Active</div>
        </div>
        <div className="bg-background rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-amber-600 mb-2">{contributors.filter(c => c.status === 'verified').length}</div>
          <div className="text-sm font-medium text-gray-700">Verified</div>
        </div>
        <div className="bg-background rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {(contributors.reduce((sum, c) => sum + c.rating, 0) / contributors.length)?.toFixed(1)}
          </div>
          <div className="text-sm font-medium text-gray-700">Avg Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search contributors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 w-full"
          />
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContributors.map((contributor) => (
          <div
            key={contributor.id}
            className="bg-background rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-md"
                  style={{ backgroundColor: getColorFromName(contributor.name) }}
                >
                  {getInitials(contributor.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {contributor.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <Icon name="MapPin" size={14} className="text-gray-400" />
                    <span>{contributor.location || "Location not set"}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(contributor.status)}
            </div>

            {/* Main Card Content (flex-1 makes this area expand to push button down) */}
            <div className="flex-1 flex flex-col">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {contributor.totalSubmissions}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Total</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">
                    {contributor.approvedSubmissions}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">Approved</div>
                </div>
              </div>

              {/* Rating and Last Activity */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quality Rating</span>
                  {renderStars(contributor.rating)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Activity</span>
                  <span className="text-gray-900 font-medium">
                    {contributor.lastSubmission
                      ? new Date(contributor.lastSubmission).toLocaleDateString("en-IN")
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Specialties</span>
                  <span className="text-xs text-gray-500">
                    {contributor.specialties.length} areas
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contributor.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                    >
                      {specialty}
                    </span>
                  ))}
                  {contributor.specialties.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{contributor.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button — always stays at the bottom */}
            <Button
              variant="default"
              onClick={() => handleViewContributor(contributor.id)}
              className="w-full mt-auto"
            >
              <Icon name="Eye" size={16} />
              <span className="ml-2">View Full Profile</span>
            </Button>
          </div>
        ))}

        <ContributorProfileModal
          contributorId={selectedContributorId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {/* Empty State */}
      {filteredContributors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No contributors found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || filterRating
              ? "Try adjusting your search or filter criteria to find contributors."
              : "There are no contributors in the system yet."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ContributorManagement;