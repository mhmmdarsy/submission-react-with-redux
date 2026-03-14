"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/states/hooks";
import { registerThunk } from "@/src/states/thunks/authThunks";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await dispatch(registerThunk({ name, email, password }));

    if (registerThunk.rejected.match(result)) {
      setError((result.payload as string) || "Registration failed");
      return;
    }

    router.push("/login");
  };

  return (
    <section className="panel auth-panel">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit} className="stack-form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="solid-btn wide-btn">
          Sign Up
        </button>
      </form>
    </section>
  );
}
