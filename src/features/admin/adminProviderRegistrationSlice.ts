// store/slices/adminProviderRegistrationSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    fetchProviderRegistrations,
    approveRegistration,
    rejectRegistration,
} from '../../services/admin-provider-registration-service';

export interface ProviderDocument {
    documentId: number;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: string;
}

export interface ProviderRegistration {
    registrationId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    documents: ProviderDocument[];
    rejectionReason?: string;
    otpCode: string;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: number;
}

interface AdminProviderRegistrationState {
    registrations: ProviderRegistration[];
    selectedRegistration: ProviderRegistration | null;
    loading: boolean;
    error: string | null;
    filter: 'all' | 'pending' | 'approved' | 'rejected';
    searchTerm: string;
    actionLoading: {
        approve: number | null;
        reject: number | null;
    };
}

const initialState: AdminProviderRegistrationState = {
    registrations: [],
    selectedRegistration: null,
    loading: false,
    error: null,
    filter: 'pending',
    searchTerm: '',
    actionLoading: {
        approve: null,
        reject: null,
    },
};

export const adminProviderRegistrationSlice = createSlice({
    name: 'adminProviderRegistrations',
    initialState,
    reducers: {
        setSelectedRegistration: (state, action: PayloadAction<ProviderRegistration | null>) => {
            state.selectedRegistration = action.payload;
        },
        setFilter: (state, action: PayloadAction<'all' | 'pending' | 'approved' | 'rejected'>) => {
            state.filter = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearActionLoading: (state) => {
            state.actionLoading = { approve: null, reject: null };
        },
        clearAll: (state) => {
            state.registrations = [];
            state.selectedRegistration = null;
            state.loading = false;
            state.error = null;
            state.filter = 'pending';
            state.searchTerm = '';
            state.actionLoading = { approve: null, reject: null };
        },
        removeRegistration: (state, action: PayloadAction<number>) => {
            state.registrations = state.registrations.filter(
                reg => reg.registrationId !== action.payload
            );
            if (state.selectedRegistration?.registrationId === action.payload) {
                state.selectedRegistration = null;
            }
        },
        updateRegistration: (state, action: PayloadAction<Partial<ProviderRegistration> & { registrationId: number }>) => {
            const { registrationId, ...updates } = action.payload;
            const index = state.registrations.findIndex(reg => reg.registrationId === registrationId);
            if (index !== -1) {
                state.registrations[index] = { ...state.registrations[index], ...updates };
            }
            if (state.selectedRegistration?.registrationId === registrationId) {
                state.selectedRegistration = { ...state.selectedRegistration, ...updates };
            }
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch registrations
            .addCase(fetchProviderRegistrations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviderRegistrations.fulfilled, (state, action) => {
                state.loading = false;
                state.registrations = action.payload;
            })
            .addCase(fetchProviderRegistrations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Approve registration
            .addCase(approveRegistration.pending, (state, action) => {
                state.actionLoading.approve = action.meta.arg.registrationId;
                state.error = null;
            })
            .addCase(approveRegistration.fulfilled, (state, action) => {
                const { registrationId } = action.payload;
                state.actionLoading.approve = null;

                const index = state.registrations.findIndex(reg => reg.registrationId === registrationId);
                if (index !== -1) {
                    state.registrations[index].status = 'APPROVED';
                    state.registrations[index].reviewedAt = new Date().toISOString();
                }
                if (state.selectedRegistration?.registrationId === registrationId) {
                    if (state.selectedRegistration) {
                        state.selectedRegistration.status = 'APPROVED';
                        state.selectedRegistration.reviewedAt = new Date().toISOString();
                    }
                }
            })
            .addCase(approveRegistration.rejected, (state, action) => {
                state.actionLoading.approve = null;
                state.error = action.payload as string;
            })
            // Reject registration
            .addCase(rejectRegistration.pending, (state, action) => {
                state.actionLoading.reject = action.meta.arg.registrationId;
                state.error = null;
            })
            .addCase(rejectRegistration.fulfilled, (state, action) => {
                const { registrationId, reason } = action.payload;
                state.actionLoading.reject = null;

                const index = state.registrations.findIndex(reg => reg.registrationId === registrationId);
                if (index !== -1) {
                    state.registrations[index].status = 'REJECTED';
                    state.registrations[index].rejectionReason = reason;
                    state.registrations[index].reviewedAt = new Date().toISOString();
                }
                if (state.selectedRegistration?.registrationId === registrationId) {
                    if (state.selectedRegistration) {
                        state.selectedRegistration.status = 'REJECTED';
                        state.selectedRegistration.rejectionReason = reason;
                        state.selectedRegistration.reviewedAt = new Date().toISOString();
                    }
                }
            })
            .addCase(rejectRegistration.rejected, (state, action) => {
                state.actionLoading.reject = null;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSelectedRegistration,
    setFilter,
    setSearchTerm,
    clearError,
    clearActionLoading,
    clearAll,
    removeRegistration,
    updateRegistration,
    resetState,
} = adminProviderRegistrationSlice.actions;
