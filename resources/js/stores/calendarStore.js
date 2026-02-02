import { create } from 'zustand';

export const useCalendarStore = create((set) => ({
    kind: '', // '' | 'room' | 'asset'
    roomId: '',
    assetId: '',

    setKind: (kind) =>
        set((state) => ({
            kind,
            // clear the other filter when switching kind
            roomId: kind === 'room' ? state.roomId : '',
            assetId: kind === 'asset' ? state.assetId : '',
        })),

    setRoomId: (roomId) => set(() => ({ roomId })),
    setAssetId: (assetId) => set(() => ({ assetId })),

    getLoanableId: (state) => {
        if (state.kind === 'room') return state.roomId;
        if (state.kind === 'asset') return state.assetId;
        return '';
    },
}));
