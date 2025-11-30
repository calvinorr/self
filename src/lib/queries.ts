/**
 * Centralized query helpers for entries
 *
 * These helpers encapsulate the dev mode bypass logic in one place,
 * preventing the pattern from being duplicated across routes.
 */

import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { isDevMode } from "./env";

/**
 * Get all entries for a user (or all entries in dev mode)
 */
export function getEntriesForUser(userId: string) {
  if (isDevMode()) {
    return db.select().from(entries).orderBy(desc(entries.createdAt));
  }
  return db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.createdAt));
}

/**
 * Get a single entry by ID (with optional user ownership check)
 */
export function getEntryById(entryId: number, userId: string) {
  if (isDevMode()) {
    return db.select().from(entries).where(eq(entries.id, entryId));
  }
  return db
    .select()
    .from(entries)
    .where(and(eq(entries.id, entryId), eq(entries.userId, userId)));
}

/**
 * Update an entry by ID (with optional user ownership check)
 */
export function updateEntryById(
  entryId: number,
  userId: string,
  data: {
    title?: string;
    content?: string;
    mood?: string | null;
    aiInsight?: string | null;
  }
) {
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  if (isDevMode()) {
    return db
      .update(entries)
      .set(updateData)
      .where(eq(entries.id, entryId))
      .returning();
  }
  return db
    .update(entries)
    .set(updateData)
    .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
    .returning();
}

/**
 * Delete an entry by ID (with optional user ownership check)
 */
export function deleteEntryById(entryId: number, userId: string) {
  if (isDevMode()) {
    return db.delete(entries).where(eq(entries.id, entryId)).returning();
  }
  return db
    .delete(entries)
    .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
    .returning();
}
