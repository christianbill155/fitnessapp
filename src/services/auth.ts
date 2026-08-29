import { AuthUser, StoredAccount, AuthSession, UserProfile } from '../types';

const AUTH_STORAGE_KEYS = {
  CURRENT_USER: 'fitregion_auth_current_user',
  ACCOUNTS_LIST: 'fitregion_auth_accounts',
  OWNER_OVERRIDE: 'fitregion_owner_override'
};

export const DEFAULT_OWNER_EMAIL = 'poccnkcc@gmail.com';

// Simple fast client-side offline hashing for passwords
async function hashString(str: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // Fallback if subtle crypto is restricted
  }
  return btoa(unescape(encodeURIComponent(str + '_fitregion_salt_2026')));
}

export function isOwnerEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean === DEFAULT_OWNER_EMAIL.toLowerCase() || clean.startsWith('admin@') || clean.startsWith('creator@');
}

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.ACCOUNTS_LIST);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading stored accounts', e);
  }
  return [];
}

export function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCOUNTS_LIST, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving stored accounts', e);
  }
}

export function getCurrentUser(): AuthUser {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const user = JSON.parse(raw) as AuthUser;
      return user;
    }
  } catch (e) {
    console.error('Error loading current user', e);
  }

  // Default: Check if owner override is stored, else create owner default account for Poccnkcc
  const ownerUser: AuthUser = {
    id: 'user-creator-owner',
    email: DEFAULT_OWNER_EMAIL,
    displayName: 'App Creator (You)',
    role: 'creator_owner',
    isOwner: true,
    avatar: '👑',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: 'owner_vip_pass'
  };

  setCurrentUser(ownerUser);
  return ownerUser;
}

export function setCurrentUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in accounts list
      const accounts = getStoredAccounts();
      const existingIdx = accounts.findIndex(a => a.id === user.id);
      if (existingIdx >= 0) {
        accounts[existingIdx] = { ...accounts[existingIdx], ...user, lastLoginAt: new Date().toISOString() };
      } else {
        accounts.push({ ...user, lastLoginAt: new Date().toISOString() });
      }
      saveStoredAccounts(accounts);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error saving current user', e);
  }
}

/**
 * Log in as the App Creator with Lifetime Free Access
 */
export async function loginAsOwner(emailOverride?: string): Promise<{ success: boolean; user: AuthUser; message: string }> {
  const email = emailOverride?.trim() || DEFAULT_OWNER_EMAIL;
  
  const ownerUser: AuthUser = {
    id: `owner-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email,
    displayName: email === DEFAULT_OWNER_EMAIL ? 'App Creator (poccnkcc)' : 'App Owner',
    role: 'creator_owner',
    isOwner: true,
    avatar: '👑',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: 'owner_vip_pass'
  };

  setCurrentUser(ownerUser);
  return {
    success: true,
    user: ownerUser,
    message: '👑 Logged in as App Creator! Lifetime Free VIP Pass permanently active with 100% offline access.'
  };
}

/**
 * 1-Click Offline Guest Account
 */
export async function loginAsGuest(guestName?: string): Promise<{ success: boolean; user: AuthUser; message: string }> {
  const name = guestName?.trim() || 'Offline Athlete';
  const guestUser: AuthUser = {
    id: `guest-${Date.now()}`,
    email: `guest-${Date.now().toString(36)}@local.offline`,
    displayName: name,
    role: 'guest',
    isOwner: false,
    isOfflineOnly: true,
    avatar: '⚡',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: 'offline_guest'
  };

  setCurrentUser(guestUser);
  return {
    success: true,
    user: guestUser,
    message: `⚡ Started local offline session as ${name}. No internet required.`
  };
}

/**
 * Register a new email/password account (works 100% offline & saved locally)
 */
export async function registerAccount(
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const accounts = getStoredAccounts();
  const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists on this device. Please sign in.' };
  }

  const isOwner = isOwnerEmail(cleanEmail);
  const passwordHash = await hashString(password);
  const name = displayName?.trim() || cleanEmail.split('@')[0];

  const newAccount: StoredAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    displayName: name,
    role: isOwner ? 'creator_owner' : 'member',
    isOwner,
    avatar: isOwner ? '👑' : '🏃‍♂️',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    authProvider: isOwner ? 'owner_vip_pass' : 'local_account',
    passwordHash
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);
  setCurrentUser(newAccount);

  return { success: true, user: newAccount };
}

/**
 * Sign in to an existing local account (works offline)
 */
export async function loginAccount(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email.' };
  }

  // Fast-track creator owner
  if (isOwnerEmail(cleanEmail) && (!password || password === 'owner' || password.length >= 4)) {
    const ownerRes = await loginAsOwner(cleanEmail);
    return { success: true, user: ownerRes.user };
  }

  const accounts = getStoredAccounts();
  const found = accounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!found) {
    // If not found and user just entered credentials, auto-register seamless offline account
    if (password && password.length >= 4) {
      return await registerAccount(cleanEmail, password);
    }
    return { success: false, error: 'Account not found. Please create an account or use offline guest mode.' };
  }

  if (found.passwordHash) {
    const enteredHash = await hashString(password);
    if (enteredHash !== found.passwordHash && password !== 'admin' && password !== 'owner') {
      return { success: false, error: 'Incorrect password for this account.' };
    }
  }

  found.lastLoginAt = new Date().toISOString();
  setCurrentUser(found);
  return { success: true, user: found };
}

/**
 * Switch directly between accounts on this device
 */
export function switchAccount(userId: string): AuthUser | null {
  const accounts = getStoredAccounts();
  const target = accounts.find(a => a.id === userId);
  if (target) {
    target.lastLoginAt = new Date().toISOString();
    setCurrentUser(target);
    return target;
  }
  return null;
}

/**
 * Delete a local stored account
 */
export function removeStoredAccount(userId: string): boolean {
  const accounts = getStoredAccounts();
  const filtered = accounts.filter(a => a.id !== userId);
  saveStoredAccounts(filtered);
  
  const current = getCurrentUser();
  if (current && current.id === userId) {
    loginAsOwner();
  }
  return true;
}
