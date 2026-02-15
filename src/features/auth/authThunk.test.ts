import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login } from "./authSlice";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("auth thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const createTestStore = () =>
    configureStore({
      reducer: { auth: authReducer },
    });

  it("should login successfully", async () => {
    (axios.post as Mock).mockResolvedValue({
      data: { token: "jwt-token" },
    });

    const store = createTestStore();

    await store.dispatch(
      login({ username: "test", password: "1234" })
    );

    const state = store.getState().auth;

    expect(state.token).toBe("jwt-token");
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(localStorage.getItem("token")).toBe("jwt-token");
  });

  it("should handle login error with message", async () => {
    (axios.post as Mock).mockRejectedValue({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    const store = createTestStore();

    await store.dispatch(
      login({ username: "test", password: "wrong" })
    );

    const state = store.getState().auth;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid credentials");
  });

  it("should handle login error without message (fallback)", async () => {
    (axios.post as Mock).mockRejectedValue({});

    const store = createTestStore();

    await store.dispatch(
      login({ username: "test", password: "wrong" })
    );

    const state = store.getState().auth;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Login failed");
  });
  it("should fallback to default error message when payload is undefined", async () => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  // dispatch rejected manually without payload
  store.dispatch({
    type: login.rejected.type,
    payload: undefined,
  });

  const state = store.getState().auth;

  expect(state.error).toBe("Something went wrong");
});

});
