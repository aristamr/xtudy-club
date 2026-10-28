import { supabase } from "./supabaseClient";

// Supabase emite al momento un token de corta vida para cada petición; si el reloj de su base de datos va unos segundos
// atrás, responde «JWT issued at future» (PGRST303) aunque nada esté mal de nuestro lado. Se reintenta UNA vez tras una
// pausa breve (sin bucles); si vuelve a fallar, se trata como cualquier otro error.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export async function sb(run) {
  const first = await run();
  if (first?.error?.code !== "PGRST303") return first;
  await wait(1500);
  return run();
}

// Este archivo hace que window.storage funcione fuera de Claude,
// usando Supabase para datos "compartidos" y localStorage para datos
// "personales" (igual que en el entorno original). No hace falta tocar
// el resto de la app: la interfaz es idéntica.

async function get(key, shared) {
  try {
    if (!shared) {
      const value = localStorage.getItem(key);
      return value === null ? null : { key, value, shared: false };
    }
    const { data, error } = await sb(() => supabase.from("kv_store").select("value").eq("key", key).maybeSingle());
    if (error || !data) return null;
    return { key, value: data.value, shared: true };
  } catch (e) {
    console.error("storage.get error", e);
    return null;
  }
}

async function set(key, value, shared) {
  try {
    if (!shared) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
    const { error } = await sb(() => supabase.from("kv_store").upsert({ key, value }));
    if (error) {
      console.error("storage.set error", error);
      return null;
    }
    return { key, value, shared: true };
  } catch (e) {
    console.error("storage.set error", e);
    return null;
  }
}

// Igual que set(), pero solo INSERTA (nunca revisa si la llave ya existe).
// Se usa para datos que siempre son nuevos (como los canjes de QR), porque
// revisar si ya existe requeriría permiso de lectura que, por seguridad,
// no le damos a cualquier visitante.
async function insertOnly(key, value, shared) {
  try {
    if (!shared) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
    const { error } = await sb(() => supabase.from("kv_store").insert({ key, value }));
    if (error) {
      console.error("storage.insertOnly error", error);
      return null;
    }
    return { key, value, shared: true };
  } catch (e) {
    console.error("storage.insertOnly error", e);
    return null;
  }
}

async function del(key, shared) {
  try {
    if (!shared) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    }
    const { error } = await sb(() => supabase.from("kv_store").delete().eq("key", key));
    if (error) return null;
    return { key, deleted: true, shared: true };
  } catch (e) {
    console.error("storage.delete error", e);
    return null;
  }
}

async function list(prefix, shared) {
  try {
    if (!shared) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!prefix || (k && k.startsWith(prefix))) keys.push(k);
      }
      return { keys, prefix, shared: false };
    }
    const { data, error } = await sb(() => { let q = supabase.from("kv_store").select("key"); if (prefix) q = q.like("key", `${prefix}%`); return q; });
    if (error) return { keys: [], prefix, shared: true };
    return { keys: (data || []).map((row) => row.key), prefix, shared: true };
  } catch (e) {
    console.error("storage.list error", e);
    return { keys: [], prefix, shared };
  }
}

// Igual que set(), pero para cuando SABEMOS que la llave ya existe (por
// ejemplo, actualizar el nivel de una cuenta). Usa un UPDATE simple en vez de
// upsert, así tampoco necesita permiso de lectura para revisar si ya existe.
async function updateOnly(key, value, shared) {
  try {
    if (!shared) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
    const { error } = await sb(() => supabase.from("kv_store").update({ value }).eq("key", key));
    if (error) {
      console.error("storage.updateOnly error", error);
      return null;
    }
    return { key, value, shared: true };
  } catch (e) {
    console.error("storage.updateOnly error", e);
    return null;
  }
}

if (typeof window !== "undefined") {
  window.storage = { get, set, delete: del, list, insertOnly, updateOnly };
}
