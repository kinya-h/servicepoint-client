import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/users/userSlice'
import { serviceSlice } from './features/local-services/serviceSlice'
import { bookingsSlice } from './features/bookings/bookingSlice'
import { providersSlice } from './features/provider/providerSlice'
import feedbackSllice from './features/feedback/feedbackSllice'
import { providerAuthSlice } from './features/provider/providerAuthSlice '
import { adminProviderRegistrationSlice } from './features/admin/adminProviderRegistrationSlice'

export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
    services: serviceSlice.reducer,
    bookings: bookingsSlice.reducer,
    providers: providersSlice.reducer,
    feedback: feedbackSllice,
    providerAuth: providerAuthSlice.reducer,
    adminProviderRegistrations: adminProviderRegistrationSlice.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch