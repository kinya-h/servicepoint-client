import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/users/userSlice'
import { serviceSlice } from './features/local-services/serviceSlice'
import { bookingsSlice } from './features/bookings/bookingSlice'
import { providersSlice } from './features/provider/providerSlice'

export const store = configureStore({
  reducer: {
    users:userSlice.reducer,
    services: serviceSlice.reducer,
    bookings:bookingsSlice.reducer,
    providers: providersSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch