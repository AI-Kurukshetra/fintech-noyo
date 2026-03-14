import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD,
  SEED_ADMIN_FULL_NAME,
} = process.env;

if (
  !NEXT_PUBLIC_SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  !SEED_ADMIN_EMAIL ||
  !SEED_ADMIN_PASSWORD
) {
  throw new Error("Missing required Supabase or seed admin environment variables.");
}

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function findUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
}

async function ensureAdminUser() {
  let user = await findUserByEmail(SEED_ADMIN_EMAIL);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: SEED_ADMIN_FULL_NAME ?? "Noyo Admin",
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: SEED_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: SEED_ADMIN_FULL_NAME ?? "Noyo Admin",
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: SEED_ADMIN_EMAIL,
      full_name: SEED_ADMIN_FULL_NAME ?? "Noyo Admin",
    },
    {
      onConflict: "id",
    },
  );

  if (profileError && !profileError.message.includes("Could not find the table")) {
    throw profileError;
  }

  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("id");

  if (organizationError && !organizationError.message.includes("Could not find the table")) {
    throw organizationError;
  }

  if (organizations?.length) {
    const rows = organizations.map((organization) => ({
      organization_id: organization.id,
      user_id: user.id,
      role: "owner",
    }));

    const { error: membershipError } = await supabase
      .from("organization_members")
      .upsert(rows, {
        onConflict: "organization_id,user_id",
      });

    if (
      membershipError &&
      !membershipError.message.includes("Could not find the table")
    ) {
      throw membershipError;
    }
  }

  return user;
}

const user = await ensureAdminUser();

console.log(
  JSON.stringify(
    {
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      userId: user.id,
      role: "owner",
    },
    null,
    2,
  ),
);
