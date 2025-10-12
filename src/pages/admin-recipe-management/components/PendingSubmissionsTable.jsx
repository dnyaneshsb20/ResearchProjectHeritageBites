import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PendingSubmissionsTable = ({ 
  submissions, 
  selectedSubmissions, 
  onSelectionChange, 
  onPreviewRecipe, 
  onApprove, 
  onReject, 
  onRequestModification 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending Review' },
      'under-review': { color: 'bg-primary text-primary-foreground', label: 'Under Review' },
      'needs-modification': { color: 'bg-accent text-accent-foreground', label: 'Needs Changes' },
      approved: { color: 'bg-success text-success-foreground', label: 'Approved' },
      rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
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
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Submitted</span>
                  {getSortIcon('submissionDate')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('contributorName')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Contributor</span>
                  {getSortIcon('contributorName')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Recipe</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('region')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Region</span>
                  {getSortIcon('region')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedSubmissions?.map((submission) => (
              <tr key={submission?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedSubmissions?.includes(submission?.id)}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        onSelectionChange([...selectedSubmissions, submission?.id]);
                      } else {
                        onSelectionChange(selectedSubmissions?.filter(id => id !== submission?.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatDate(submission?.submissionDate)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{submission?.contributorName}</p>
                      <p className="text-xs text-muted-foreground">Rating: {submission?.contributorRating}/5</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={submission?.image}
                        alt={submission?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{submission?.title}</p>
                      <p className="text-xs text-muted-foreground">{submission?.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {submission?.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(submission?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewRecipe(submission)}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove(submission?.id)}
                      className="text-success hover:text-success"
                    >
                      <Icon name="Check" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject(submission?.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRequestModification(submission?.id)}
                      className="text-warning hover:text-warning"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
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
                  {getStatusBadge(submission?.status)}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>By {submission?.contributorName}</span>
                  <span>{formatDate(submission?.submissionDate)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewRecipe(submission)}
                    className="flex-1"
                  >
                    <Icon name="Eye" size={14} />
                    <span className="ml-1">Preview</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApprove(submission?.id)}
                    className="text-success"
                  >
                    <Icon name="Check" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReject(submission?.id)}
                    className="text-destructive"
                  >
                    <Icon name="X" size={16} />
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