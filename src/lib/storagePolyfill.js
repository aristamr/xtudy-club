import { supabase } from "./supabaseClient";

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
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", key)
      .maybeSingle();
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
    const { error } = await supabase.from("kv_store").upsert({ key, value });
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

async function del(key, shared) {
  try {
    if (!shared) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    }
    const { error } = await supabase.from("kv_store").delete().eq("key", key);
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
    let query = supabase.from("kv_store").select("key");
    if (prefix) query = query.like("key", `${prefix}%`);
    const { data, error } = await query;
    if (error) return { keys: [], prefix, shared: true };
    return { keys: (data || []).map((row) => row.key), prefix, shared: true };
  } catch (e) {
    console.error("storage.list error", e);
    return { keys: [], prefix, shared };
  }
}

if (typeof window !== "undefined") {
  window.storage = { get, set, delete: del, list };
}
