import { defineStore } from 'pinia';

export type UserRole = 'Admin' | 'Therapist' | 'Client';

export interface User {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      joinedAt: string;
}

interface State {
      items: User[];
}

export const useUserStore = defineStore('users', {
      state: (): State => ({
            items: [
                  { id: 'u1', name: 'Aisha', email: 'aisha@example.com', role: 'Client', joinedAt: '2025-10-10' },
                  { id: 'u2', name: 'Omar', email: 'omar@example.com', role: 'Therapist', joinedAt: '2025-10-11' },
                  { id: 'u3', name: 'Lina', email: 'lina@example.com', role: 'Admin', joinedAt: '2025-10-12' },
                  { id: 'u4', name: 'Khaled', email: 'khaled@example.com', role: 'Client', joinedAt: '2025-10-13' },
            ],
      }),
      getters: {
            totalClients: (state) => state.items.filter(u => u.role === 'Client').length,
            newUsers: (state) => state.items.filter(u => new Date(u.joinedAt) >= new Date(Date.now() - 7 * 86400000)).length,
      },
});
