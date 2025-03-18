import { create } from 'zustand';
import { createChatSlice } from './chatSlice';

export const useAppStore = create()((...a) => ({
    ...createChatSlice(...a),
}));