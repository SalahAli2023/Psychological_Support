import { defineStore } from 'pinia';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
      id: string;
      clientName: string;
      therapist: string;
      startsAt: string; // ISO date
      status: AppointmentStatus;
}

interface State {
      items: Appointment[];
      loading: boolean;
}

export const useAppointmentStore = defineStore('appointments', {
      state: (): State => ({
            items: [
                  { id: 'a1', clientName: 'Aisha', therapist: 'Dr. Omar', startsAt: new Date().toISOString(), status: 'scheduled' },
                  { id: 'a2', clientName: 'Khaled', therapist: 'Dr. Lina', startsAt: new Date(Date.now() + 86400000).toISOString(), status: 'scheduled' },
                  { id: 'a3', clientName: 'Sara', therapist: 'Dr. Omar', startsAt: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'completed' },
            ],
            loading: false,
      }),
      actions: {
            async fetchAll() {
                  this.loading = true;
                  await new Promise(r => setTimeout(r, 400));
                  this.loading = false;
            },
      },
      getters: {
            upcomingCount: (state) => state.items.filter(i => i.status === 'scheduled').length,
      },
});
