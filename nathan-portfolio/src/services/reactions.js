import { db } from '../lib/supabase';

export async function fetchReactions(targetId, targetType) {
  const { data } = await db
    .from('reactions')
    .select('reaction, user_id')
    .eq('target_id', targetId)
    .eq('target_type', targetType);
  return data || [];
}

export async function toggleReaction(targetId, targetType, userId, reaction) {
  const { data: rows } = await db
    .from('reactions')
    .select('id, reaction')
    .eq('target_id', targetId)
    .eq('user_id', userId)
    .limit(1);

  const existing = rows?.[0] ?? null;

  if (existing) {
    if (existing.reaction === reaction) {
      await db.from('reactions').delete().eq('id', existing.id);
    } else {
      await db.from('reactions').update({ reaction }).eq('id', existing.id);
    }
  } else {
    const { error } = await db.from('reactions').insert({
      target_id: targetId, target_type: targetType, user_id: userId, reaction,
    });
    if (error?.code === '23505') {
      await db.from('reactions').update({ reaction })
        .eq('target_id', targetId)
        .eq('user_id', userId);
    }
  }
}
