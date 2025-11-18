// services/admin-provider-registration-service.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../lib/axios-instance';


// Get all registrations
export const fetchAllRegistrations = createAsyncThunk(
    'adminProviderRegistrations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/provider-registration/all');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch all registrations');
        }
    }
);

// Get pending registrations
export const fetchPendingRegistrations = createAsyncThunk(
    'adminProviderRegistrations/fetchPending',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/provider-registration/pending');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending registrations');
        }
    }
);

// Get approved registrations
export const fetchApprovedRegistrations = createAsyncThunk(
    'adminProviderRegistrations/fetchApproved',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/provider-registration/approved');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch approved registrations');
        }
    }
);

// Get rejected registrations
export const fetchRejectedRegistrations = createAsyncThunk(
    'adminProviderRegistrations/fetchRejected',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/provider-registration/rejected');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch rejected registrations');
        }
    }
);

// Approve registration
export const approveRegistration = createAsyncThunk(
    'adminProviderRegistrations/approve',
    async ({ registrationId, adminId }: { registrationId: number; adminId: number }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/api/provider-registration/approve/${registrationId}?adminId=${adminId}`,
                {}
            );
            return { registrationId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to approve registration');
        }
    }
);

// Reject registration
export const rejectRegistration = createAsyncThunk(
    'adminProviderRegistrations/reject',
    async ({ registrationId, adminId, reason }: { registrationId: number; adminId: number; reason: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/api/provider-registration/reject/${registrationId}?adminId=${adminId}`,
                { reason }
            );
            return { registrationId, reason, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to reject registration');
        }
    }
);

// Main fetch function that handles filtering
export const fetchProviderRegistrations = createAsyncThunk(
    'adminProviderRegistrations/fetchByFilter',
    async (filter: string = 'all', { rejectWithValue }) => {
        try {
            let endpoint = '/api/provider-registration/all';

            switch (filter) {
                case 'pending':
                    endpoint = '/api/provider-registration/pending';
                    break;
                case 'approved':
                    endpoint = '/api/provider-registration/approved';
                    break;
                case 'rejected':
                    endpoint = '/api/provider-registration/rejected';
                    break;
                default:
                    endpoint = '/api/provider-registration/all';
            }

            const response = await axiosInstance.get(endpoint);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch registrations');
        }
    }
);


export const downloadProviderDocument = createAsyncThunk(
    'adminProviderRegistrations/downloadDocument',
    async ({ documentUrl, fileName }: { documentUrl: string; fileName: string }, { rejectWithValue }) => {
        try {
            // Make request with blob response type
            const response = await axiosInstance.get(documentUrl, {
                responseType: 'blob',
            });

            // Create blob and trigger download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { fileName, success: true };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to download document');
        }
    }
);