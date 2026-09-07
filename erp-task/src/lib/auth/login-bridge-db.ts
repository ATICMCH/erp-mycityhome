import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
import { verifyPassword } from "./password";

const EXTERNAL_DEPARTMENT_NAME = "Externos (MyCityHome)";

type BridgeRow = {
  id: number;
  username: string;
  nombre_completo: string;
  password_hash: string;
  rol: string;
  estado: number;
  erp_task_user_id: string | null;
};

/**
 * Keeps tbl_nuevo_login_erp (the future single login, on the mycityhome
 * Postgres side, outside this app's own schema) in sync with this app's own
 * User. Unlike the tbl_usuario side, this app already hashes with Argon2id,
 * so there is no plaintext-only window to wait for -- every successful login
 * just upserts the current record. Safe to re-run: keyed on erp_task_user_id.
 *
 * Best-effort: a failure here must never block signing in to this app.
 */
export async function syncLoginBridge(user: User): Promise<void> {
  try {
    await prisma.$executeRaw`
      INSERT INTO public.tbl_nuevo_login_erp
        (username, nombre_completo, password_hash, rol, estado, erp_task_user_id, ultimo_login)
      VALUES (
        ${user.username},
        ${user.displayName},
        ${user.passwordHash},
        ${user.role},
        ${user.active ? 1 : 0},
        ${user.id},
        now()
      )
      ON CONFLICT (erp_task_user_id) DO UPDATE SET
        username = EXCLUDED.username,
        nombre_completo = EXCLUDED.nombre_completo,
        password_hash = EXCLUDED.password_hash,
        rol = EXCLUDED.rol,
        estado = EXCLUDED.estado,
        ultimo_login = now(),
        actualizado_en = now()
    `;
  } catch (err) {
    console.error("[login-bridge] no se pudo sincronizar tbl_nuevo_login_erp:", err);
  }
}

/**
 * The other direction: someone whose account only exists on the mycityhome
 * side (tbl_usuario, migrated into tbl_nuevo_login_erp on their last login
 * there) signing in here for the first time. Called only when the username
 * isn't found in this app's own User table -- that lookup stays the fast,
 * common path.
 *
 * On success, provisions a real User here (once) so everything downstream
 * (attendance, sessions, the rest of the app) has an ordinary local account
 * to work with, and links it back onto the bridge row so future logins on
 * either side resolve to the same person instead of drifting apart.
 *
 * Department is a placeholder ("Externos (MyCityHome)") -- there's no
 * reliable way to know which real department a bridged account belongs to,
 * and getting it wrong silently would be worse than an obvious placeholder
 * HR can fix from HR -> People.
 */
export async function tryBridgeLogin(
  username: string,
  plainPassword: string,
): Promise<User | null> {
  const rows = await prisma.$queryRaw<BridgeRow[]>`
    SELECT id, username, nombre_completo, password_hash, rol, estado, erp_task_user_id
    FROM public.tbl_nuevo_login_erp
    WHERE lower(username) = lower(${username}) AND estado >= 1 AND password_hash IS NOT NULL
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;

  const ok = await verifyPassword(row.password_hash, plainPassword);
  if (!ok) return null;

  if (row.erp_task_user_id) {
    const existing = await prisma.user.findUnique({ where: { id: row.erp_task_user_id } });
    if (existing) return existing;
  }

  const department = await prisma.department.upsert({
    where: { name: EXTERNAL_DEPARTMENT_NAME },
    update: {},
    create: { name: EXTERNAL_DEPARTMENT_NAME },
  });

  const user = await prisma.user.upsert({
    where: { username: row.username.toLowerCase() },
    update: {},
    create: {
      username: row.username.toLowerCase(),
      displayName: row.nombre_completo || row.username,
      passwordHash: row.password_hash,
      role: "WORKER",
      departmentId: department.id,
    },
  });

  await prisma.$executeRaw`
    UPDATE public.tbl_nuevo_login_erp
    SET erp_task_user_id = ${user.id}, ultimo_login = now(), actualizado_en = now()
    WHERE id = ${row.id}
  `;

  return user;
}
