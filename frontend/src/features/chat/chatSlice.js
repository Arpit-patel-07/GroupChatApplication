import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch past messages for a group room
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/messages/${groupId}`);
      return res.data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load messages');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    // Live real-time incoming message from Socket.io
    receiveMessage: (state, action) => {
      // Avoid duplicate by checking message id
      const exists = state.messages.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { receiveMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
