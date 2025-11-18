import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  X,
  Download,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Loader2,
  MapPinOff,
} from "lucide-react";
import { format } from "date-fns";
import type { ProviderRegistration } from "../../features/admin/adminProviderRegistrationSlice";

interface RegistrationDetailModalProps {
  registration: ProviderRegistration | null;
  onClose: () => void;
  onApprove: (registrationId: number) => void;
  onReject: (registrationId: number, reason: string) => void;
  onDownloadDocument: (documentUrl: string, fileName: string) => void;
  actionLoading: {
    approve: number | null;
    reject: number | null;
  };
  adminId?: number;
}

const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  registration,
  onClose,
  onApprove,
  onReject,
  onDownloadDocument,
  actionLoading,
  adminId,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!registration) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(registration.registrationId, rejectionReason);
      setRejectionReason("");
    }
  };

  const getDocumentTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      certificate: "Professional Certificate",
      id_proof: "ID Proof",
      license: "Business License",
      other: "Other Document",
    };
    return types[type] || type.replace("_", " ").toUpperCase();
  };

  return (
    <Dialog open={!!registration} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              Registration Details
              {getStatusBadge(registration.status)}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Complete information for {registration.firstName}{" "}
            {registration.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-sm">
                      {registration.firstName} {registration.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm">{registration.email}</p>
                  </div>
                </div>
                {registration.phoneNumber ? (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm">{registration.phoneNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm">Not provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Timeline
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                {registration.location ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Service Location</p>
                      <p className="text-sm">{registration.location}</p>
                      {registration.latitude && registration.longitude && (
                        <p className="text-xs text-muted-foreground">
                          Coordinates: {registration.latitude.toFixed(6)},{" "}
                          {registration.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPinOff className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Service Location</p>
                      <p className="text-sm">Not specified</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm">
                      {format(new Date(registration.submittedAt), "PPpp")}
                    </p>
                  </div>
                </div>
                {registration.reviewedAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Reviewed</p>
                      <p className="text-sm">
                        {format(new Date(registration.reviewedAt), "PPpp")}
                      </p>
                    </div>
                  </div>
                )}
                {registration.reviewedBy && (
                  <div className="text-sm">
                    <p className="font-medium">Reviewed By Admin ID</p>
                    <p>{registration.reviewedBy}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents ({registration.documents.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {registration.documents.map((doc) => (
                <div
                  key={doc.documentId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {doc.fileName}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {getDocumentTypeDisplay(doc.documentType)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>
                        Uploaded: {format(new Date(doc.uploadedAt), "PP")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onDownloadDocument(doc.fileUrl, doc.fileName)
                    }
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
              {registration.documents.length === 0 && (
                <div className="text-center p-8 border rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {registration.rejectionReason && (
            <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
              <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejection Reason
              </h4>
              <p className="text-sm">{registration.rejectionReason}</p>
            </div>
          )}

          {/* Action Buttons for Pending Registrations */}
          {registration.status === "PENDING" && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <div className="flex-1 space-y-3">
                <div>
                  <label
                    htmlFor="rejectionReason"
                    className="text-sm font-medium mb-2 block"
                  >
                    Rejection Reason (Required for rejection)
                  </label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Please provide a clear reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={
                    !rejectionReason.trim() ||
                    actionLoading.reject === registration.registrationId
                  }
                  className="w-full sm:w-auto"
                >
                  {actionLoading.reject === registration.registrationId ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject Registration
                </Button>
              </div>
              <div className="flex flex-col sm:items-end gap-3">
                <div className="text-sm text-muted-foreground text-center sm:text-right">
                  Approve this provider registration
                </div>
                <Button
                  onClick={() => onApprove(registration.registrationId)}
                  disabled={
                    actionLoading.approve === registration.registrationId
                  }
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {actionLoading.approve === registration.registrationId ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve Registration
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDetailModal;
