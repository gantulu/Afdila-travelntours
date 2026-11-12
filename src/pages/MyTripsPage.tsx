import React, { type FormEvent } from 'react';
import { Briefcase } from 'lucide-react';
import { Badge, AlertBanner, EmptyState } from './ui/FeedbackComponents';
import { formatIDR } from '../utils/currency';
import { formatDateReadable } from '../utils/date';
import type { Booking } from '../types/booking.types';
import type { StandaloneView } from '../types/navigation.types';

type TripSubTab = 'upcoming' | 'completed' | 'cancelled';

interface MyTripsPageProps {
  bookings: Booking[];
  verifiedBookingRefs: string[];
  tripSubTab: TripSubTab;
  setTripSubTab: (tab: TripSubTab) => void;
  setStandalone: (view: StandaloneView) => void;
  lookupRef: string;
  setLookupRef: (value: string) => void;
  lookupContact: string;
  setLookupContact: (value: string) => void;
  lookupError: string;
  onLookupBooking: (event: FormEvent<HTMLFormElement>) => void;
  setActiveTab: (tab: 'home' | 'explore' | 'wishlist' | 'bookings' | 'profile') => void;
}

export function MyTripsPage({ bookings, verifiedBookingRefs, tripSubTab, setTripSubTab, setStandalone, lookupRef, setLookupRef, lookupContact, setLookupContact, lookupError, onLookupBooking, setActiveTab }: MyTripsPageProps) {
    const unlockedBookings = bookings.filter((b) => verifiedBookingRefs.includes(b.bookingReference));
    const filteredTrips = unlockedBookings.filter((b) => b.tripCategory === tripSubTab);

    return (
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">My Trips</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your reservations or retrieve any guest booking with your Booking Reference.
          </p>
        </div>

        {/* Trip Category Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-200/70">
          {(
            [
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ] as const
          ).map((tab) => {
            const count = unlockedBookings.filter((b) => b.tripCategory === tab.id).length;
            const active = tripSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTripSubTab(tab.id)}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition ${
                  active ? 'bg-white text-[#0B2545] shadow-2xs' : 'text-slate-600'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Verified Trips List */}
        {filteredTrips.length > 0 ? (
          <div className="space-y-3">
            {filteredTrips.map((b) => (
              <div
                key={b.bookingReference}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0B2545]">{b.bookingReference}</span>
                  <Badge
                    variant={
                      b.tripCategory === 'cancelled'
                        ? 'error'
                        : b.tripCategory === 'completed'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {b.bookingStatus}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <img
                    src={b.packageImage}
                    alt={b.packageName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 leading-snug">{b.packageName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{b.destination}</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Payment: <strong>{b.paymentStatus}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Departure</div>
                    <div className="font-bold text-slate-800">{formatDateReadable(b.departureDate)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Total Amount</div>
                    <div className="font-bold text-[#0B2545]">{formatIDR(b.totalAmount)}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStandalone({ type: 'bookingDetail', bookingReference: b.bookingReference })}
                  className="w-full py-2.5 rounded-xl bg-[#E7F3F8] text-[#136F99] text-xs font-bold"
                >
                  View Booking Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="w-6 h-6" />}
            title={`No ${tripSubTab.charAt(0).toUpperCase() + tripSubTab.slice(1)} Trips`}
            description={
              tripSubTab === 'upcoming'
                ? 'Book a tour package or retrieve an existing reservation below using your Booking Reference.'
                : `You have no ${tripSubTab} reservations to display.`
            }
            actionLabel={tripSubTab === 'upcoming' ? 'Explore Packages' : undefined}
            onAction={tripSubTab === 'upcoming' ? () => setActiveTab('explore') : undefined}
          />
        )}

        {/* Guest Booking Lookup Form */}
        <form
          onSubmit={onLookupBooking}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">Retrieve Guest Booking</h3>
            <p className="text-[11px] text-slate-500">
              Enter your Booking Reference and Email or Phone number used during checkout.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Booking Reference</label>
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
              placeholder="e.g., ASR-2611-XXXXXX"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-900 focus:outline-none focus:border-[#136F99]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone Number</label>
            <input
              type="text"
              value={lookupContact}
              onChange={(e) => setLookupContact(e.target.value)}
              placeholder="Enter email or phone used at checkout"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#136F99]"
            />
          </div>

          {lookupError && <AlertBanner type="error">{lookupError}</AlertBanner>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold shadow-xs hover:bg-[#06172D] active:scale-[0.99] transition"
          >
            Find & Unlock Booking
          </button>
        </form>
      </div>
    );
  }