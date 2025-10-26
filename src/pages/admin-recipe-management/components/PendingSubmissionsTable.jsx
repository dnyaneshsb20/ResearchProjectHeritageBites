import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { supabase } from '../../../supabaseClient';

const PendingSubmissionsTable = ({
  selectedSubmissions,
  onSelectionChange,
  onPreviewRecipe
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Fetch recipes with contributor name, state, and review_reason
  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from('rec_contributions')
      .select(`
        indg_recipe_id,
        name,
        description,
        image_url,
        state_id,
        meal_type,
        status,
        review_reason,
        created_at,
        created_by (
          name
        ),
        state_id (
          state_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      const mappedData = data
        .map((item) => ({
          id: item.indg_recipe_id,
          title: item.name,
          description: item.description,
          image: item.image_url,
          region: item.state_id?.state_name || 'Unknown',
          category: item.meal_type,
          status: item.status,
          reviewReason: item.review_reason,
          submissionDate: item.created_at,
          contributorName: item.created_by?.name || 'Unknown',
          contributorRating: 0
        }))
        .filter((item) => item.status !== 'approved');
      setSubmissions(mappedData);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubmissions = [...submissions]?.sort((a, b) => {
    if (sortConfig?.key === 'submissionDate') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.submissionDate) - new Date(b.submissionDate)
        : new Date(b.submissionDate) - new Date(a.submissionDate);
    }

    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';

    if (sortConfig?.direction === 'asc') {
      return aValue?.localeCompare(bValue);
    }
    return bValue?.localeCompare(aValue);
  });

  const getStatusBadge = (status, reviewReason) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending Review' },
      changes_requested: { color: 'bg-warning text-warning-foreground', label: 'Changes Requested' },
      approved: { color: 'bg-success text-success-foreground', label: 'Approved' },
      rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <div className="flex flex-col items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
          {config?.label}
        </span>
        {status === 'changes_requested' && reviewReason && (
          <p className="text-xs text-warning-foreground mt-1 max-w-xs text-center">
            {reviewReason}
          </p>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc'
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(sortedSubmissions?.map(s => s?.id));
    } else {
      onSelectionChange([]);
    }
  };

  // Helper: initials + color generator
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
    return `hsl(${hue}, 70%, 60%)`; // nice pastel range
  };

  const isAllSelected = selectedSubmissions?.length === sortedSubmissions?.length && sortedSubmissions?.length > 0;
  const isIndeterminate = selectedSubmissions?.length > 0 && selectedSubmissions?.length < sortedSubmissions?.length;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pending Submissions</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedSubmissions?.length} of {sortedSubmissions?.length} selected
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-fixed text-center align-middle">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-1/12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="w-1/6 px-14 py-3 text-center align-middle">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Submitted</span>
                  {getSortIcon('submissionDate')}
                </button>
              </th>
              <th className="w-1/6 px-12 py-3 text-center align-middle">
                <button
                  onClick={() => handleSort('contributorName')}
                  className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Contributor</span>
                  {getSortIcon('contributorName')}
                </button>
              </th>
              <th className="w-1/6 px-16 py-3 text-center align-middle">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Recipe</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="w-1/6 px-16 py-3 text-center align-middle">
                <button
                  onClick={() => handleSort('region')}
                  className="flex items-center justify-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Region</span>
                  {getSortIcon('region')}
                </button>
              </th>
              <th className="w-1/6 px-4 py-3 text-center align-middle">Status</th>
              <th className="w-1/6 px-4 py-3 text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedSubmissions?.map((submission) => (
              <tr key={submission?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedSubmissions?.includes(submission?.id)}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        onSelectionChange([...selectedSubmissions, submission?.id]);
                      } else {
                        onSelectionChange(selectedSubmissions?.filter(id => id !== submission?.id));
                      }
                    }}
                    className="mx-auto"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col items-center">
                    {formatDate(submission?.submissionDate)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: getColorFromName(submission?.contributorName) }}
                    >
                      {getInitials(submission?.contributorName)}
                    </div>
                    <p className="text-sm font-medium">{submission?.contributorName}</p>
                    <p className="text-xs text-muted-foreground">Rating: {submission?.contributorRating}/5</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={submission?.image}
                        alt={submission?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">{submission?.title}</p>
                    <p className="text-xs text-muted-foreground">{submission?.category}</p>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{submission?.region}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(submission?.status, submission?.reviewReason)}
                </td>
                <td className="px-4 py-4">
                  <Button
                    variant="ghost2"
                    size="sm"
                    onClick={() => onPreviewRecipe(submission)}
                    className="flex items-center justify-center space-x-1 px-2 py-1 mx-auto"
                  >
                    <Icon name="Eye" size={16} />
                    <span>View Recipe</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedSubmissions?.map((submission) => (
          <div key={submission?.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedSubmissions?.includes(submission?.id)}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    onSelectionChange([...selectedSubmissions, submission?.id]);
                  } else {
                    onSelectionChange(selectedSubmissions?.filter(id => id !== submission?.id));
                  }
                }}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={submission?.image}
                      alt={submission?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{submission?.title}</h4>
                    <p className="text-xs text-muted-foreground">{submission?.category} • {submission?.region}</p>
                  </div>
                  {getStatusBadge(submission?.status, submission?.reviewReason)}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>By {submission?.contributorName}</span>
                  <span>{formatDate(submission?.submissionDate)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost2"
                    size="sm"
                    onClick={() => onPreviewRecipe(submission)}
                    className="w-full flex items-center justify-center space-x-1 px-2 py-1"
                  >
                    <Icon name="Eye" size={14} />
                    <span>View Recipe</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedSubmissions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No submissions found</h3>
          <p className="text-muted-foreground">There are no pending recipe submissions to review.</p>
        </div>
      )}
    </div>
  );
};

export default PendingSubmissionsTable;
