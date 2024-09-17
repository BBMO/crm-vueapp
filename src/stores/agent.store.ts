import { defineStore } from 'pinia';

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agentId: '' as string,
  }),
  actions: {
    setAgentId(id: string) {
      this.agentId = id;
    },
  },
  getters: {
    getAgentId(): string {
      return this.agentId;
    }
  },
});
