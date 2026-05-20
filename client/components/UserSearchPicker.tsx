"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "../lib/api";
import { searchUsers } from "../lib/api";

type UserSearchPickerProps = {
  label: string;
  placeholder: string;
  selectedUser: AuthUser | null;
  onSelect: (user: AuthUser | null) => void;
  helperText?: string;
};

export default function UserSearchPicker({
  label,
  placeholder,
  selectedUser,
  onSelect,
  helperText,
}: UserSearchPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setSearchError(null);
      setLoading(false);
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setSearchError(null);

      void searchUsers(trimmedQuery)
        .then((response) => {
          if (!isActive) {
            return;
          }

          setResults(response.items ?? []);
        })
        .catch((error) => {
          if (!isActive) {
            return;
          }

          setResults([]);
          setSearchError(error instanceof Error ? error.message : "Failed to search users");
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const getDisplayName = (user: AuthUser) => user.fullName ?? user.name ?? user.username ?? user.email ?? "User";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
          {helperText && <p className="mt-1 text-sm text-slate-600">{helperText}</p>}
        </div>
        {selectedUser && (
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setQuery("");
              setResults([]);
            }}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Clear
          </button>
        )}
      </div>

      {selectedUser ? (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          <p className="font-semibold">{getDisplayName(selectedUser)}</p>
          <p className="text-xs text-cyan-800">{selectedUser.username ?? selectedUser.email ?? selectedUser.id}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {loading && <p className="text-sm text-slate-500">Searching...</p>}
          {searchError && <p className="text-sm text-red-600">{searchError}</p>}

          {results.length > 0 ? (
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-slate-100 p-2">
              {results.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onSelect(user)}
                  className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{getDisplayName(user)}</p>
                    <p className="text-xs text-slate-500">
                      {user.username ?? user.email ?? "No username"}
                      {user.role ? ` • ${user.role}` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-cyan-700">Select</span>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            <p className="text-sm text-slate-500">No users found.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
