import { supabase } from '@/lib/supabase';

function isMissingUpdatedAtColumn(error) {
  return error?.code === 'PGRST204' && error?.message?.includes('updated_at');
}

function isMissingProfilesTable(error) {
  return error?.code === 'PGRST205' || error?.message?.includes("table 'public.profiles'");
}

function isProfilesRlsError(error) {
  return error?.code === '42501' || error?.message?.toLowerCase().includes('row-level security');
}

async function upsertProfile(payload) {
  return supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();
}

export async function upsertProfileFromUser(user) {
  if (!user?.id) return null;

  const basePayload = {
    id: user.id,
    email: user.email || null,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    phone: user.user_metadata?.phone || null,
  };

  let { data, error } = await upsertProfile({
    ...basePayload,
    updated_at: new Date().toISOString(),
  });

  if (error && isMissingUpdatedAtColumn(error)) {
    ({ data, error } = await upsertProfile(basePayload));
  }

  if (error) {
    if (isMissingProfilesTable(error) || isProfilesRlsError(error)) {
      return null;
    }

    console.error('[ProfileService] Lỗi upsert profile:', error);
    throw error;
  }

  return data;
}
