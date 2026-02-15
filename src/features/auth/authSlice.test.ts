import authReducer, { login, logout } from "./authSlice";
import { describe, it, expect, beforeEach } from "vitest";

describe("authSlice reducer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    token: null,
    loading: false,
    error: null,
  };

  it("should return initial state", () => {
    expect(authReducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle login pending", () => {
    const action = { type: login.pending.type };
    const state = authReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle login fulfilled", () => {
    const action = {
      type: login.fulfilled.type,
      payload: "fake-jwt-token",
    };

    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.token).toBe("fake-jwt-token");
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
  });

  it("should handle login rejected", () => {
    const action = {
      type: login.rejected.type,
      payload: "Invalid credentials",
    };

    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid credentials");
  });

  it("should handle logout", () => {
    const loggedInState = {
      token: "fake-jwt",
      loading: false,
      error: null,
    };

    localStorage.setItem("token", "fake-jwt");

    const state = authReducer(loggedInState, logout());

    expect(state.token).toBe(null);
    expect(localStorage.getItem("token")).toBe(null);
  });

  
});
