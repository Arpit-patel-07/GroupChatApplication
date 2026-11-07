import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// 1. Fetch all groups for the logged-in user
export const fetchMyGroups = createAsyncThunk(
  'groups/fetchMyGroups',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/groups/my-groups');
      return res.data.groups;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

// 2. Create a new group
export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (name, { rejectWithValue }) => {
    try {
      const res = await api.post('/groups/create', { name });
      return res.data.group;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create group');
    }
  }
);

// 3. Join an existing group by invite code
export const joinGroupByCode = createAsyncThunk(
  'groups/joinGroupByCode',
  async (invite_code, { rejectWithValue }) => {
    try {
      const res = await api.post('/groups/join', { invite_code });
      return res.data.group;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to join group');
    }
  }
);

// 4. Fetch group details & member list
export const fetchGroupDetails = createAsyncThunk(
  'groups/fetchGroupDetails',
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/groups/${groupId}/details`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load group details');
    }
  }
);

// 5. Leave a group
export const leaveGroup = createAsyncThunk(
  'groups/leaveGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      await api.post(`/groups/${groupId}/leave`);
      return groupId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to leave group');
    }
  }
);

// 6. Delete a group (admin/creator only)
export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      await api.delete(`/groups/${groupId}`);
      return groupId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete group');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    activeGroup: null,
    members: [],
    loading: false,
    error: null
  },
  reducers: {
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
    },
    clearActiveGroup: (state) => {
      state.activeGroup = null;
      state.members = [];
    },
    clearGroupError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchMyGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Group
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
      })
      // Join Group
      .addCase(joinGroupByCode.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
      })
      // Fetch Details
      .addCase(fetchGroupDetails.fulfilled, (state, action) => {
        state.activeGroup = action.payload.group;
        state.members = action.payload.members;
      })
      // Leave Group
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g.id !== Number(action.payload));
        if (state.activeGroup?.id === Number(action.payload)) {
          state.activeGroup = null;
          state.members = [];
        }
      })
      // Delete Group
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g.id !== Number(action.payload));
        if (state.activeGroup?.id === Number(action.payload)) {
          state.activeGroup = null;
          state.members = [];
        }
      });
  }
});

export const { setActiveGroup, clearActiveGroup, clearGroupError } = groupSlice.actions;
export default groupSlice.reducer;
