import { supabase } from '@/lib/supabase';

const LOCAL_SETTINGS_PREFIX = 'techelite:site-setting:';
const SETTINGS_EVENT = 'techelite:site-setting-updated';

function isMissingSiteSettingsSchema(error) {
  return error?.code === 'PGRST205' || error?.message?.includes('public.site_settings');
}

function getLocalStorageKey(key) {
  return `${LOCAL_SETTINGS_PREFIX}${key}`;
}

function readLocalSetting(key) {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(getLocalStorageKey(key));
  } catch {
    return null;
  }
}

function writeLocalSetting(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getLocalStorageKey(key), typeof value === 'string' ? value : JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { key, value } }));
  } catch {
    // Ignore localStorage failures.
  }
}

export function subscribeToSettingUpdates(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (event) => {
    callback(event.detail?.key, event.detail?.value);
  };

  const handleStorage = (event) => {
    if (!event.key?.startsWith(LOCAL_SETTINGS_PREFIX)) return;
    callback(event.key.replace(LOCAL_SETTINGS_PREFIX, ''), event.newValue);
  };

  window.addEventListener(SETTINGS_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}

export async function getSiteSetting(key) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, updated_at')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    if (isMissingSiteSettingsSchema(error)) {
      return readLocalSetting(key);
    }

    console.error(`[SettingsService] Lỗi lấy cấu hình ${key}:`, error);
    throw error;
  }

  const value = data?.value ?? null;
  if (value !== null) {
    writeLocalSetting(key, value);
  }
  return value;
}

export async function upsertSiteSetting(key, value) {
  const payload = {
    key,
    value,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'key' })
    .select('key, value, updated_at')
    .single();

  if (error) {
    if (isMissingSiteSettingsSchema(error)) {
      writeLocalSetting(key, value);
      return { key, value, updated_at: payload.updated_at, skipped: true, source: 'local' };
    }

    console.error(`[SettingsService] Lỗi lưu cấu hình ${key}:`, error);
    throw error;
  }

  writeLocalSetting(key, data?.value ?? value);
  return data;
}

export async function getFlashSaleEndAt() {
  const value = await getSiteSetting('flash_sale_end_at');
  return typeof value === 'string' ? value : null;
}
