import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Apartments from './pages/Apartments';
import ApartmentDetail from './pages/ApartmentDetail';
import BookingFlow from './pages/BookingFlow';
import Concierge from './pages/Concierge';
import CityGuide from './pages/CityGuide';
import GiftCards from './pages/GiftCards';
import GuestPortal from './pages/GuestPortal';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/Properties';
import AdminBookings from './pages/admin/Bookings';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminConcierge from './pages/admin/ConciergeSettings';
import AdminReviews from './pages/admin/Reviews';
import AdminGiftCards from './pages/admin/AdminGiftCards';
import AdminGuests from './pages/admin/AdminGuests';
import AdminJournal from './pages/admin/AdminJournal';
import AdminHomeImages from './pages/admin/AdminHomeImages';
import Journal from './pages/Journal';
import JournalArticlePage from './pages/JournalArticle';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bone">
        <div className="text-center">
          <p className="font-heading text-3xl font-light text-charcoal tracking-brand mb-4">MUSE</p>
          <div className="w-6 h-6 border border-clay border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/:slug" element={<ApartmentDetail />} />
        <Route path="/book/:slug" element={<BookingFlow />} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/city-guide" element={<CityGuide />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/my-stay" element={<GuestPortal />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalArticlePage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/concierge" element={<AdminConcierge />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/gift-cards" element={<AdminGiftCards />} />
        <Route path="/admin/guests" element={<AdminGuests />} />
        <Route path="/admin/journal" element={<AdminJournal />} />
        <Route path="/admin/home-images" element={<AdminHomeImages />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App