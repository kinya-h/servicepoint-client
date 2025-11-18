// components/admin/ProviderRegistrationsAdmin.tsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  setFilter,
  setSearchTerm,
  setSelectedRegistration,
} from "../../features/admin/adminProviderRegistrationSlice";
import {
  fetchProviderRegistrations,
  approveRegistration,
  rejectRegistration,
  downloadProviderDocument,
} from "../../services/admin-provider-registration-service";

import { Bounce, ToastContainer, toast } from "react-toastify";

import { format } from "date-fns";
import { useAppDispatch } from "../../hooks/hooks";
import RegistrationDetailModal from "../../components/common/RegistrationDetailModal";
import type { RootState } from "../../store";

const ProviderRegistrationsAdmin: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    registrations,
    loading,
    error,
    filter,
    searchTerm,
    selectedRegistration,
    actionLoading,
  } = useSelector((state: RootState) => state.adminProviderRegistrations);

  const { loginResponse } = useSelector((state: RootState) => state.users);

  // Fetch registrations when component mounts or filter changes
  useEffect(() => {
    dispatch(fetchProviderRegistrations(filter || "all"));
  }, [dispatch, filter]);

  const filteredRegistrations = useMemo(() => {
    // Ensure registrations is always an array
    let filtered = Array.isArray(registrations) ? registrations : [];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.firstName?.toLowerCase().includes(term) ||
          reg.lastName?.toLowerCase().includes(term) ||
          reg.email?.toLowerCase().includes(term) ||
          reg.location?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [registrations, searchTerm]);

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants]}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const handleApprove = async (registrationId: number) => {
    if (!loginResponse) {
      toast.error("Admin ID not found. Please login again.");
      return;
    }

    try {
      await dispatch(
        approveRegistration({
          registrationId,
          adminId: loginResponse.user.id,
        })
      ).unwrap();

      toast.success("Provider registration approved successfully.");
      // Refresh the current filter view
      dispatch(fetchProviderRegistrations(filter));
    } catch (error: any) {
      toast.error(error || "Failed to approve registration.");
    }
  };

  const handleReject = async (registrationId: number, reason: string) => {
    if (!loginResponse?.user?.id) {
      toast.error("Admin ID not found. Please login again.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      await dispatch(
        rejectRegistration({
          registrationId,
          adminId: loginResponse?.user?.id,
          reason,
        })
      ).unwrap();

      toast.success("Provider registration rejected.");
      // Refresh the current filter view
      dispatch(fetchProviderRegistrations(filter));
    } catch (error: any) {
      toast.error(error || "Failed to reject registration.");
    }
  };

  const handleViewDetails = (registration: any) => {
    dispatch(setSelectedRegistration(registration));
  };

  const handleDownloadDocument = (documentUrl: string, fileName: string) => {
    dispatch(downloadProviderDocument({ documentUrl, fileName }))
      .unwrap()
      .then(() => {
        toast.success(`Downloaded ${fileName}`);
      })
      .catch((error) => {
        toast.error(error || "Could not download the document.");
      });
  };

  const handleRefresh = () => {
    dispatch(fetchProviderRegistrations(filter));
  };

  const handleFilterChange = (
    newFilter: "all" | "pending" | "approved" | "rejected"
  ) => {
    dispatch(setFilter(newFilter));
    // The useEffect will automatically trigger the fetch
  };

  const stats = useMemo(() => {
    const regs = Array.isArray(registrations) ? registrations : [];
    return {
      total: regs.length,
      pending: regs.filter((r) => r.status === "PENDING").length,
      approved: regs.filter((r) => r.status === "APPROVED").length,
      rejected: regs.filter((r) => r.status === "REJECTED").length,
    };
  }, [registrations]);

  if (
    loading &&
    (!registrations ||
      (Array.isArray(registrations) && registrations.length === 0))
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading {filter} registrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            Provider Registrations
          </h1>
          <p className="text-muted-foreground">
            Review and manage provider registration requests
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">Total ({filter})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setSearchTerm(e.target.value))
                  }
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <div className="grid gap-4">
        {filteredRegistrations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground font-medium">
                  No {filter} registrations found
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : `No ${filter} provider registrations available.`}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card
              key={registration.registrationId}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-lg">
                          {registration.firstName} {registration.lastName}
                        </span>
                      </div>
                      {getStatusBadge(registration.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{registration.email}</span>
                      </div>
                      {registration.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{registration.phoneNumber}</span>
                        </div>
                      )}
                      {registration.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{registration.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Submitted:{" "}
                          {format(
                            new Date(registration.submittedAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>
                          {registration.documents?.length || 0} document(s)
                        </span>
                      </div>
                    </div>

                    {registration.rejectionReason && (
                      <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        <strong>Rejection Reason:</strong>{" "}
                        {registration.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(registration)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>

                    {registration.status === "PENDING" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleApprove(registration.registrationId)
                          }
                          disabled={
                            actionLoading.approve ===
                            registration.registrationId
                          }
                          className="flex items-center gap-2"
                        >
                          {actionLoading.approve ===
                          registration.registrationId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const reason = prompt(
                              "Please enter rejection reason:"
                            );
                            if (reason) {
                              handleReject(registration.registrationId, reason);
                            }
                          }}
                          disabled={
                            actionLoading.reject === registration.registrationId
                          }
                          className="flex items-center gap-2"
                        >
                          {actionLoading.reject ===
                          registration.registrationId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <RegistrationDetailModal
        registration={selectedRegistration}
        onClose={() => dispatch(setSelectedRegistration(null))}
        onApprove={handleApprove}
        onReject={handleReject}
        onDownloadDocument={handleDownloadDocument}
        actionLoading={actionLoading}
        adminId={loginResponse?.user?.id}
      />
    </div>
  );
};

export default ProviderRegistrationsAdmin;
