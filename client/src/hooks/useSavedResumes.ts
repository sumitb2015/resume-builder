import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlan } from '../contexts/PlanContext';
import type { Resume, TemplateConfig } from '../shared/types';

export interface SavedResume {
  id: string;
  name: string;
  resumeData: Resume;
  templateId: string;
  savedAt: string; // ISO timestamp
}

function storageKey(uid: string) {
  return `bespokecv_resumes_${uid}`;
}

function loadFromStorage(uid: string): SavedResume[] {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    return JSON.parse(raw) as SavedResume[];
  } catch {
    return [];
  }
}

function saveToStorage(uid: string, list: SavedResume[]) {
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
}

export function useSavedResumes() {
  const { currentUser } = useAuth();
  const { maxResumes } = usePlan();
  const uid = currentUser?.uid ?? null;

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>(() =>
    uid ? loadFromStorage(uid) : []
  );

  // Reload when user changes
  useEffect(() => {
    setSavedResumes(uid ? loadFromStorage(uid) : []);
  }, [uid]);

  const canSaveMore = savedResumes.length < maxResumes;

  /**
   * Save or update a resume.
   * If `existingId` is provided, updates that entry.
   * Otherwise creates a new one (fails if at limit).
   * Returns the saved entry's id.
   */
  const saveResume = useCallback((
    name: string,
    resume: Resume,
    template: TemplateConfig,
    existingId?: string,
  ): string | null => {
    if (!uid) return null;

    const now = new Date().toISOString();
    let updated: SavedResume[];

    if (existingId) {
      // Update existing
      updated = savedResumes.map(r =>
        r.id === existingId
          ? { ...r, name, resumeData: resume, templateId: template.id, savedAt: now }
          : r
      );
    } else {
      // New save — check limit
      if (savedResumes.length >= maxResumes) return null;
      const newEntry: SavedResume = {
        id: crypto.randomUUID(),
        name,
        resumeData: resume,
        templateId: template.id,
        savedAt: now,
      };
      updated = [newEntry, ...savedResumes];
    }

    saveToStorage(uid, updated);
    setSavedResumes(updated);
    return existingId ?? (updated[0]?.id ?? null);
  }, [uid, savedResumes, maxResumes]);

  const deleteResume = useCallback((id: string) => {
    if (!uid) return;
    const updated = savedResumes.filter(r => r.id !== id);
    saveToStorage(uid, updated);
    setSavedResumes(updated);
  }, [uid, savedResumes]);

  const renameResume = useCallback((id: string, newName: string) => {
    if (!uid) return;
    const updated = savedResumes.map(r => r.id === id ? { ...r, name: newName } : r);
    saveToStorage(uid, updated);
    setSavedResumes(updated);
  }, [uid, savedResumes]);

  return {
    savedResumes,
    canSaveMore,
    maxResumes,
    saveResume,
    deleteResume,
    renameResume,
  };
}
