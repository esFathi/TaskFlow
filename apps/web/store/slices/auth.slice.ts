import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { registerUser, loginUser, getCurrentUser } from "@/lib/api/auth.api";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    data: {
      fullName: string;
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await registerUser(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",

  async (
    data: {
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await loginUser(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Login Invalid email or password.",
      );
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/me",

  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to load user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },

    clearUser(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.accessToken;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.accessToken;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload;
      })

      .addCase(getMe.rejected, (state) => {
        state.loading = false;

        state.user = null;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;

export function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
