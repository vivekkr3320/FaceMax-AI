import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-supabase.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key-12345";

export const isMockMode = supabaseUrl.includes("mock-supabase") || supabaseAnonKey === "mock-anon-key-12345" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Instantiate real Supabase client
const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// In-Memory Database Simulator for Mock Mode
const MOCK_STORAGE = {
  get: (key: string) => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return (global as any)[`mock_${key}`] || null;
  },
  set: (key: string, val: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(val));
    } else {
      (global as any)[`mock_${key}`] = val;
    }
  }
};

// Initialize Mock Data
if (typeof window !== "undefined" && !MOCK_STORAGE.get("users")) {
  MOCK_STORAGE.set("users", []);
  MOCK_STORAGE.set("reports", []);
  MOCK_STORAGE.set("face_scores", []);
  MOCK_STORAGE.set("recommendations", []);
  MOCK_STORAGE.set("payments", []);
}

// Custom Mock Auth Client
const mockAuth = {
  signUp: async ({ email, password, options }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = MOCK_STORAGE.get("users") || [];
    if (users.find((u: any) => u.email === email)) {
      return { data: { user: null }, error: { message: "User already exists" } };
    }

    const newUser = {
      id: `user_${Math.random().toString(36).substring(2, 11)}`,
      email,
      name: options?.data?.name || email.split("@")[0],
      plan: "FREE",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    MOCK_STORAGE.set("users", users);
    MOCK_STORAGE.set("current_session", { user: newUser });

    return { data: { user: newUser }, error: null };
  },

  signInWithPassword: async ({ email, password }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = MOCK_STORAGE.get("users") || [];
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return { data: { user: null }, error: { message: "Invalid credentials" } };
    }

    MOCK_STORAGE.set("current_session", { user });
    return { data: { user }, error: null };
  },

  signOut: async () => {
    MOCK_STORAGE.set("current_session", null);
    return { error: null };
  },

  getUser: async () => {
    const session = MOCK_STORAGE.get("current_session");
    if (!session) return { data: { user: null }, error: null };
    const users = MOCK_STORAGE.get("users") || [];
    const user = users.find((u: any) => u.id === session.user.id);
    return { data: { user: user || session.user }, error: null };
  }
};

// Custom Mock Database Client
const mockFrom = (table: string) => {
  return {
    select: (columns: string = "*") => {
      const data = MOCK_STORAGE.get(table) || [];
      
      return {
        eq: (col: string, val: any) => {
          const filtered = data.filter((item: any) => item[col] === val);
          return {
            order: (orderCol: string, { ascending = true } = {}) => {
              const sorted = [...filtered].sort((a, b) => {
                const valA = a[orderCol];
                const valB = b[orderCol];
                if (valA < valB) return ascending ? -1 : 1;
                if (valA > valB) return ascending ? 1 : -1;
                return 0;
              });
              return { data: sorted, error: null };
            },
            single: () => {
              return { data: filtered[0] || null, error: filtered[0] ? null : { message: "No row found" } };
            },
            data: filtered,
            error: null
          };
        },
        order: (orderCol: string, { ascending = true } = {}) => {
          const sorted = [...data].sort((a, b) => {
            const valA = a[orderCol];
            const valB = b[orderCol];
            if (valA < valB) return ascending ? -1 : 1;
            if (valA > valB) return ascending ? 1 : -1;
            return 0;
          });
          return { data: sorted, error: null };
        },
        data,
        error: null
      };
    },

    insert: (rows: any) => {
      const data = MOCK_STORAGE.get(table) || [];
      const isArray = Array.isArray(rows);
      const toInsert = isArray 
        ? rows.map((r: any) => ({ id: `row_${Math.random().toString(36).substring(2, 11)}`, created_at: new Date().toISOString(), ...r }))
        : { id: `row_${Math.random().toString(36).substring(2, 11)}`, created_at: new Date().toISOString(), ...rows };

      if (isArray) {
        data.push(...toInsert);
      } else {
        data.push(toInsert);
      }

      MOCK_STORAGE.set(table, data);
      return { data: toInsert, error: null };
    },

    update: (values: any) => {
      return {
        eq: (col: string, val: any) => {
          const data = MOCK_STORAGE.get(table) || [];
          let updated = false;
          const mapped = data.map((item: any) => {
            if (item[col] === val) {
              updated = true;
              return { ...item, ...values, updated_at: new Date().toISOString() };
            }
            return item;
          });

          if (updated) {
            MOCK_STORAGE.set(table, mapped);
          }
          return { data: values, error: null };
        }
      };
    }
  };
};

// Export Unified Supabase client
export const supabase = isMockMode 
  ? {
      auth: mockAuth,
      from: mockFrom,
    } as any
  : realSupabase;
