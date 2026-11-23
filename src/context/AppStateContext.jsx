import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  auth,
  db,
  isAdminEmail,
  isFirebaseConfigured,
  normalizeIdentifierToEmail,
  storage,
} from '../firebase';
import {
  INITIAL_ALERTS,
  INITIAL_CONTACTS,
  INITIAL_DOCUMENTS,
  INITIAL_INCIDENTS,
  INITIAL_NOTICES,
  INITIAL_PENDING_APPROVALS,
} from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

const STORAGE_KEY = 'loco_rail_demo_state_v9';

const defaultState = {
  lang: 'en',
  themeTemplate: 'executive',
  driverGpsEnabled: true,
  realCoords: null,
  totalUsers: 5842,
  pendingApprovalsCountBase: 17,
  pendingApprovals: INITIAL_PENDING_APPROVALS,
  contacts: INITIAL_CONTACTS,
  notices: INITIAL_NOTICES,
  documents: INITIAL_DOCUMENTS,
  alerts: INITIAL_ALERTS,
  incidents: INITIAL_INCIDENTS,
  recentActivity: [
    {
      id: 'act-1',
      icon: 'upload',
      title: 'Operations Circular 04.pdf',
      detail: 'uploaded by Station Control (SCL)',
      time: 'Today, 08:10',
    },
    {
      id: 'act-2',
      icon: 'share',
      title: 'Safety Guidelines 2025',
      detail: 'shared by Admin',
      time: 'Yesterday, 17:35',
    },
  ],
};

const AppStateContext = createContext(null);

function friendlyAuthError(err) {
  const code = err?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'मोबाइल नंबर / ईमेल या पासवर्ड गलत है। नए यूज़र पहले Register करें।';
  }
  if (code.includes('email-already-in-use')) {
    return 'यह मोबाइल नंबर पहले से रजिस्टर्ड है — कृपया Sign In टैब से लॉगिन करें।';
  }
  if (code.includes('weak-password')) {
    return 'पासवर्ड कम से कम 6 अक्षरों का रखें।';
  }
  if (code.includes('network-request-failed')) {
    return 'इंटरनेट कनेक्शन चेक करें और दोबारा प्रयास करें।';
  }
  return err?.message || 'Authentication error occurred.';
}

function playNotificationBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // ignore audio autoplay restrictions
  }
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return defaultState;
  });

  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState('');
  const [liveCrewLocations, setLiveCrewLocations] = useState([]);
  const [gpsLastSyncAt, setGpsLastSyncAt] = useState(null);

  const seenPendingIdsRef = useRef(null);
  const lastGpsPushRef = useRef(0);

  // Auto-upgrade local demo data if outdated
  useEffect(() => {
    setState((prev) => {
      let next = prev;
      if (!prev.contacts || prev.contacts.length < INITIAL_CONTACTS.length) {
        next = { ...next, contacts: INITIAL_CONTACTS };
      }
      if (!prev.documents || !prev.documents.some((d) => d.id === 'doc-drive-secr')) {
        const existingIds = new Set((prev.documents || []).map((d) => d.id));
        const missingOfficial = INITIAL_DOCUMENTS.filter((d) => !existingIds.has(d.id));
        next = { ...next, documents: [...missingOfficial, ...(prev.documents || [])] };
      }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const notify = (message, tone = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // ================= LIVE FIREBASE AUTH + USER PROFILE LISTENER =================
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setAuthLoading(false);
      return;
    }

    let unsubProfile = null;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (!fbUser) {
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      const email = fbUser.email || '';
      const adminFlag = isAdminEmail(email);
      const userRef = doc(db, 'users', fbUser.uid);

      unsubProfile = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setCurrentUser({
              uid: fbUser.uid,
              email,
              ...data,
              isAdmin: Boolean(data.isAdmin || adminFlag),
              approved: Boolean(data.approved || data.isAdmin || adminFlag),
            });
          } else {
            const fallback = {
              uid: fbUser.uid,
              email,
              name: adminFlag ? 'LOCO Admin' : email.split('@')[0],
              phone: email.endsWith('@loco.secr.in') ? email.split('@')[0] : '',
              employeeId: adminFlag ? 'ADMIN-HQ' : 'CRW-PENDING',
              role: adminFlag ? 'Admin' : 'Loco Pilot',
              division: 'Bilaspur',
              lobby: 'Bilaspur (BSP)',
              station: 'BSP',
              isAdmin: adminFlag,
              approved: adminFlag,
              canDownload: adminFlag,
            };
            setCurrentUser(fallback);
          }
          setAuthLoading(false);
        },
        () => {
          setCurrentUser({
            uid: fbUser.uid,
            email,
            name: adminFlag ? 'LOCO Admin' : email.split('@')[0],
            isAdmin: adminFlag,
            approved: adminFlag,
            canDownload: adminFlag,
          });
          setAuthLoading(false);
        }
      );
    });

    return () => {
      if (unsubProfile) unsubProfile();
      unsubAuth();
    };
  }, []);

  // ================= REAL-TIME LIVE GPS BROADCASTER (FIRESTORE live_locations/{uid}) =================
  const pushGpsToCloud = async (coords, enabled = true) => {
    if (!isFirebaseConfigured || !db || !currentUser?.uid) return;
    try {
      const payload = {
        uid: currentUser.uid,
        name: currentUser.name || 'LOCO Crew',
        employeeId: currentUser.employeeId || 'CRW',
        phone: currentUser.phone || '',
        role: currentUser.role || 'Loco Pilot',
        division: currentUser.division || 'Bilaspur',
        lobby: currentUser.lobby || 'Bilaspur (BSP)',
        station: currentUser.station || 'BSP',
        isAdmin: Boolean(currentUser.isAdmin),
        gpsEnabled: Boolean(enabled),
        updatedAtMs: Date.now(),
        updatedAt: serverTimestamp(),
      };
      if (coords) {
        payload.lat = Number(coords.latitude ?? coords.lat);
        payload.lng = Number(coords.longitude ?? coords.lng);
        payload.accuracy = coords.accuracy ? Math.round(coords.accuracy) : null;
        payload.speedKmh =
          typeof coords.speed === 'number' && coords.speed >= 0
            ? Math.round(coords.speed * 3.6)
            : 0;
        payload.heading = typeof coords.heading === 'number' ? Math.round(coords.heading) : null;
      }
      await setDoc(doc(db, 'live_locations', currentUser.uid), payload, { merge: true });
      setGpsLastSyncAt(Date.now());
    } catch {
      // ignore if rules not published yet
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !currentUser?.uid) return;
    if (!currentUser.approved && !currentUser.isAdmin) return;

    if (!state.driverGpsEnabled) {
      pushGpsToCloud(null, false);
      return;
    }

    if (!navigator.geolocation) return;

    const handlePosition = (pos) => {
      const { latitude, longitude, accuracy, speed, heading } = pos.coords;
      setState((prev) => ({
        ...prev,
        realCoords: { lat: latitude, lng: longitude, accuracy: Math.round(accuracy || 0) },
      }));
      const now = Date.now();
      if (now - lastGpsPushRef.current >= 8000) {
        lastGpsPushRef.current = now;
        pushGpsToCloud({ latitude, longitude, accuracy, speed, heading }, true);
      }
    };

    // Immediate first fix + continuous watchPosition stream
    navigator.geolocation.getCurrentPosition(handlePosition, () => {}, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 10000,
    });

    const watchId = navigator.geolocation.watchPosition(handlePosition, () => {}, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 8000,
    });

    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, [currentUser?.uid, currentUser?.approved, currentUser?.isAdmin, state.driverGpsEnabled]);

  // ================= LIVE FIRESTORE DATA LISTENERS (WHEN APPROVED/ADMIN) =================
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !currentUser) return;
    if (!currentUser.approved && !currentUser.isAdmin) return;

    const unsubs = [];

    // 1. Live Notices
    try {
      const qNotices = query(collection(db, 'notices'), orderBy('createdAtMs', 'desc'));
      unsubs.push(
        onSnapshot(qNotices, (snap) => {
          const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const remoteIds = new Set(remote.map((r) => r.id));
          setState((prev) => ({
            ...prev,
            notices: [...remote, ...INITIAL_NOTICES.filter((n) => !remoteIds.has(n.id))],
          }));
        })
      );
    } catch {
      // ignore
    }

    // 2. Live Documents
    try {
      const qDocs = query(collection(db, 'documents'), orderBy('createdAtMs', 'desc'));
      unsubs.push(
        onSnapshot(qDocs, (snap) => {
          const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const remoteIds = new Set(remote.map((r) => r.id));
          setState((prev) => ({
            ...prev,
            documents: [...remote, ...INITIAL_DOCUMENTS.filter((d) => !remoteIds.has(d.id))],
          }));
        })
      );
    } catch {
      // ignore
    }

    // 3. Live Custom Crew Contacts / Photo Overrides
    try {
      const qContacts = query(collection(db, 'contacts'), orderBy('createdAtMs', 'desc'));
      unsubs.push(
        onSnapshot(qContacts, (snap) => {
          const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const byId = new Map(remote.map((r) => [r.id, r]));
          const mergedBase = INITIAL_CONTACTS.map((c) => (byId.has(c.id) ? { ...c, ...byId.get(c.id) } : c));
          const baseIds = new Set(INITIAL_CONTACTS.map((c) => c.id));
          const extras = remote.filter((r) => !baseIds.has(r.id));
          setState((prev) => ({ ...prev, contacts: [...extras, ...mergedBase] }));
        })
      );
    } catch {
      // ignore
    }

    // 4. Live Incidents
    try {
      const qInc = query(collection(db, 'incidents'), orderBy('createdAtMs', 'desc'));
      unsubs.push(
        onSnapshot(qInc, (snap) => {
          const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setState((prev) => ({ ...prev, incidents: [...remote, ...INITIAL_INCIDENTS] }));
        })
      );
    } catch {
      // ignore
    }

    // 5. Real-Time Live Crew GPS Locations (from all signed-in crew phones!)
    try {
      unsubs.push(
        onSnapshot(collection(db, 'live_locations'), (snap) => {
          const list = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((loc) => typeof loc.lat === 'number' && typeof loc.lng === 'number')
            .sort((a, b) => {
              if (Boolean(b.gpsEnabled) !== Boolean(a.gpsEnabled)) return b.gpsEnabled ? 1 : -1;
              return (b.updatedAtMs || 0) - (a.updatedAtMs || 0);
            });
          setLiveCrewLocations(list);
        })
      );
    } catch {
      // ignore
    }

    // 6. Admin-only: Real-time Pending Staff Approvals + Instant Notification Alerts!
    if (currentUser.isAdmin) {
      try {
        unsubs.push(
          onSnapshot(collection(db, 'users'), (snap) => {
            const allUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const pending = allUsers
              .filter((u) => !u.isAdmin && !u.approved && !u.rejected)
              .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

            // Fire live notification + chime when a NEW registration arrives!
            const currentIds = new Set(pending.map((u) => u.id));
            if (seenPendingIdsRef.current !== null) {
              const newlyArrived = pending.filter((u) => !seenPendingIdsRef.current.has(u.id));
              if (newlyArrived.length > 0) {
                playNotificationBeep();
                newlyArrived.forEach((u) => {
                  notify(
                    `🔔 New Staff Approval Request: ${u.name} (${u.employeeId || u.phone}) — Tap Approvals!`,
                    'warning'
                  );
                });
              }
            }
            seenPendingIdsRef.current = currentIds;

            // Surface every pending approval right at the top of Alerts / Notification Bell!
            const approvalAlerts = pending.map((u) => ({
              id: `apr-alert-${u.id}`,
              userId: u.id,
              isApprovalRequest: true,
              title: `Approval Request: ${u.name}`,
              message: `${u.role || 'Crew'} · ${u.employeeId || u.phone} · ${u.lobby || u.division} waiting for Admin approval.`,
              severity: 'critical',
              time: u.requestedAt || 'Just now',
            }));

            setState((prev) => ({
              ...prev,
              pendingApprovals: pending,
              pendingApprovalsCountBase: 0,
              alerts: [...approvalAlerts, ...INITIAL_ALERTS],
            }));
          })
        );
      } catch {
        // ignore
      }
    }

    return () => unsubs.forEach((fn) => fn && fn());
  }, [currentUser?.uid, currentUser?.approved, currentUser?.isAdmin]);

  // ================= FIREBASE AUTH ACTIONS =================
  const firebaseLogin = async (identifier, password) => {
    if (!auth) throw new Error('Firebase is not configured yet.');
    setAuthError('');
    try {
      const email = normalizeIdentifierToEmail(identifier);
      await signInWithEmailAndPassword(auth, email, password);
      notify('Signed in successfully to LOCO Secure Portal');
    } catch (err) {
      const msg = friendlyAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const firebaseRegister = async ({
    identifier,
    password,
    name,
    employeeId,
    role,
    division,
    lobby,
    station,
    verifiedInBspList,
  }) => {
    if (!auth || !db) throw new Error('Firebase is not configured yet.');
    setAuthError('');
    try {
      const email = normalizeIdentifierToEmail(identifier);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const adminFlag = isAdminEmail(email);
      const digits = String(identifier).replace(/\D/g, '');
      const profile = {
        uid: cred.user.uid,
        email,
        phone: digits.length >= 10 ? digits.slice(-10) : identifier,
        name: name || 'LOCO Staff',
        employeeId: employeeId || 'CRW-NEW',
        role: adminFlag ? 'Admin' : role || 'Loco Pilot',
        division: division || 'Bilaspur',
        lobby: lobby || 'Bilaspur (BSP)',
        station: station || 'BSP',
        district: division || 'Bilaspur',
        verifiedInBspList: Boolean(verifiedInBspList),
        isAdmin: adminFlag,
        approved: adminFlag,
        canDownload: adminFlag,
        rejected: false,
        avatarVariant: 'officer-male-1',
        requestedAt: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAtMs: Date.now(),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      notify(
        adminFlag
          ? 'Admin account created & active!'
          : 'Registration sent to Admin Control Center for approval',
        'info'
      );
    } catch (err) {
      const msg = friendlyAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const firebaseLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setCurrentUser(null);
    notify('Signed out safely', 'info');
  };

  // ================= ADMIN & CREW ACTIONS =================
  const approveUser = async (id) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await updateDoc(doc(db, 'users', id), {
          approved: true,
          canDownload: true,
          rejected: false,
          approvedAt: serverTimestamp(),
        });
        notify('User approved live — their LOCO app is now unlocked!');
        return;
      } catch (err) {
        notify(`Approval failed: ${err.message}`, 'warning');
        return;
      }
    }

    setState((prev) => {
      const target = prev.pendingApprovals.find((u) => u.id === id);
      if (!target) return prev;
      const newContact = {
        id: `cnt-${Date.now()}`,
        name: target.name,
        role: target.role,
        station: target.station,
        lobby: target.lobby || `${target.division || 'Bilaspur'} (${target.station || 'BSP'})`,
        district: target.district,
        division: target.division || 'Bilaspur',
        phone: target.phone,
        employeeId: target.employeeId,
        status: 'On Duty',
        shift: '08:00 – 16:00',
        photo: target.photo || null,
        avatarVariant: target.avatarVariant || 'officer-male-1',
      };
      return {
        ...prev,
        totalUsers: prev.totalUsers + 1,
        pendingApprovals: prev.pendingApprovals.filter((u) => u.id !== id),
        contacts: [newContact, ...prev.contacts],
        recentActivity: [
          {
            id: `act-${Date.now()}`,
            icon: 'approve',
            title: target.name,
            detail: `approved (${target.role}) by Admin`,
            time: 'Just now',
          },
          ...prev.recentActivity,
        ].slice(0, 10),
      };
    });
    notify('User approved and synced to LOCO Crew Directory');
  };

  const rejectUser = async (id) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await updateDoc(doc(db, 'users', id), {
          approved: false,
          canDownload: false,
          rejected: true,
        });
        notify('Access request rejected & locked', 'info');
        return;
      } catch (err) {
        notify(`Reject failed: ${err.message}`, 'warning');
        return;
      }
    }

    setState((prev) => {
      const target = prev.pendingApprovals.find((u) => u.id === id);
      if (!target) return prev;
      return {
        ...prev,
        pendingApprovals: prev.pendingApprovals.filter((u) => u.id !== id),
        recentActivity: [
          {
            id: `act-${Date.now()}`,
            icon: 'reject',
            title: target.name,
            detail: 'access request rejected by Admin',
            time: 'Just now',
          },
          ...prev.recentActivity,
        ].slice(0, 10),
      };
    });
    notify('Access request rejected', 'info');
  };

  const addPendingRegistration = (user) => {
    setState((prev) => ({
      ...prev,
      pendingApprovals: [
        {
          id: `apr-${Date.now()}`,
          name: user.name,
          role: user.role || 'Loco Pilot',
          division: user.division || 'Bilaspur',
          lobby: user.lobby || `Bilaspur (${(user.station || 'BSP').toUpperCase()})`,
          district: user.district || 'Bilaspur',
          station: (user.station || 'BSP').toUpperCase(),
          phone: user.phone || '9826000000',
          employeeId: user.employeeId || `ID-${Math.floor(10000 + Math.random() * 90000)}`,
          photo: user.photo || null,
          avatarVariant: 'officer-male-2',
          requestedAt: 'Just now',
        },
        ...prev.pendingApprovals,
      ],
    }));
    notify(`Registration submitted for ${user.name} — waiting for Admin approval`, 'info');
  };

  const addContact = async (contact) => {
    const lobbyLabel = contact.lobby || 'Bilaspur (BSP)';
    const codeMatch = lobbyLabel.match(/\(([^)]+)\)/);
    const stationCode = (contact.station || (codeMatch ? codeMatch[1] : 'BSP')).trim().toUpperCase();
    const newContact = {
      id: `cnt-${Date.now()}`,
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      station: stationCode,
      lobby: lobbyLabel,
      district: contact.district || contact.division || 'Bilaspur',
      role: contact.role || 'Loco Pilot',
      division: contact.division || 'Bilaspur',
      employeeId: contact.employeeId || `CRW-${Math.floor(10000 + Math.random() * 89999)}`,
      status: contact.status || 'On Duty',
      shift: contact.shift || '08:00 – 16:00',
      photo: contact.photo || null,
      avatarVariant: contact.avatarVariant || 'officer-male-1',
      createdAtMs: Date.now(),
    };

    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await setDoc(doc(db, 'contacts', newContact.id), newContact);
        notify(`${newContact.name} synced live to all LOCO devices`);
        return;
      } catch (err) {
        notify(`Cloud save failed: ${err.message}`, 'warning');
      }
    }

    setState((prev) => ({
      ...prev,
      contacts: [newContact, ...prev.contacts],
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          icon: 'contact',
          title: newContact.name,
          detail: `added to Directory (${newContact.station})${newContact.photo ? ' with photo' : ''}`,
          time: 'Just now',
        },
        ...prev.recentActivity,
      ].slice(0, 10),
    }));
    notify(`${newContact.name} saved to LOCO Crew Directory`);
  };

  const updateContact = async (id, patch) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await setDoc(doc(db, 'contacts', id), { ...patch, id, createdAtMs: Date.now() }, { merge: true });
        notify('Contact synced live to all devices');
        return;
      } catch {
        // fall through
      }
    }
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    notify('Contact details updated');
  };

  const deleteContact = async (id) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
      } catch {
        // ignore
      }
    }
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
    notify('Contact removed from directory', 'info');
  };

  const addNotice = async (notice) => {
    const nowLabel = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const item = {
      id: `not-${Date.now()}`,
      title: notice.title.trim(),
      body: notice.body.trim(),
      category: notice.category || 'Operations',
      priority: Boolean(notice.priority),
      date: nowLabel,
      timeLabel: 'Just now',
      author: notice.author || currentUser?.name || 'Admin Control Center',
      attachmentName: notice.attachmentName || null,
      attachmentUrl: notice.attachmentUrl || null,
      createdAtMs: Date.now(),
    };

    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await addDoc(collection(db, 'notices'), item);
        notify(`Notice "${item.title}" broadcast LIVE to all approved crew phones!`);
        return;
      } catch (err) {
        notify(`Notice cloud publish failed: ${err.message}`, 'warning');
      }
    }

    setState((prev) => ({
      ...prev,
      notices: [item, ...prev.notices],
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          icon: 'notice',
          title: item.title,
          detail: `published by ${item.author}`,
          time: 'Just now',
        },
        ...prev.recentActivity,
      ].slice(0, 10),
    }));
    notify(`Notice "${item.title}" published live to all crew devices`);
  };

  const deleteNotice = async (id) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await deleteDoc(doc(db, 'notices', id));
      } catch {
        // ignore
      }
    }
    setState((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== id),
    }));
    notify('Notice removed', 'info');
  };

  const uploadDocument = async (docInput) => {
    const ext = (docInput.fileName || '').split('.').pop()?.toUpperCase() || 'PDF';
    const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(ext);
    const hasLink = Boolean(docInput.externalUrl?.trim());
    const type = hasLink && !docInput.rawFile ? 'DRV' : isImage ? 'IMG' : ext === 'DOCX' || ext === 'DOC' ? 'DOC' : 'PDF';

    let finalExternalUrl = docInput.externalUrl?.trim() || null;

    if (isFirebaseConfigured && storage && docInput.rawFile && currentUser?.isAdmin) {
      try {
        const safeName = `${Date.now()}_${docInput.rawFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const storageRef = ref(storage, `documents/${safeName}`);
        await uploadBytes(storageRef, docInput.rawFile);
        finalExternalUrl = await getDownloadURL(storageRef);
      } catch {
        // fallback if storage bucket not enabled
      }
    }

    const item = {
      id: `doc-${Date.now()}`,
      fileName: docInput.fileName || (hasLink ? 'Official Railway Circular Link' : 'Circular_Update.pdf'),
      description: docInput.description || docInput.fileName || 'Official Railway Document',
      category: docInput.category || (isImage ? 'Photos' : 'Circulars'),
      type,
      size: docInput.size || (hasLink ? 'Cloud Link' : '1.4 MB'),
      uploader: docInput.uploader || currentUser?.name || 'Admin',
      uploaderFull: docInput.uploaderFull || 'Admin Control Center',
      status: 'Shared',
      date: 'Just now',
      previewType: hasLink && !isImage ? 'drive' : isImage ? 'image' : type === 'DOC' ? 'doc' : 'pdf',
      dataUrl: finalExternalUrl ? null : docInput.dataUrl || null,
      externalUrl: finalExternalUrl,
      summary: docInput.description || 'Official document shared via LOCO Document Vault.',
      createdAtMs: Date.now(),
    };

    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await addDoc(collection(db, 'documents'), item);
        notify(`"${item.fileName}" synced LIVE to all approved crew devices!`);
        return;
      } catch (err) {
        notify(`Cloud upload failed: ${err.message}`, 'warning');
      }
    }

    setState((prev) => ({
      ...prev,
      documents: [item, ...prev.documents],
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          icon: 'upload',
          title: item.fileName,
          detail: `uploaded by ${item.uploaderFull}`,
          time: 'Just now',
        },
        ...prev.recentActivity,
      ].slice(0, 10),
    }));
    notify(`"${item.fileName}" uploaded to LOCO Document Vault`);
  };

  const deleteDocument = async (id) => {
    if (isFirebaseConfigured && db && currentUser?.isAdmin) {
      try {
        await deleteDoc(doc(db, 'documents', id));
      } catch {
        // ignore
      }
    }
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
    notify('Document deleted', 'info');
  };

  const reportIncident = async (incident) => {
    const item = {
      id: `inc-${Date.now()}`,
      title: incident.title.trim(),
      station: incident.station.trim() || 'BSP – Bilaspur',
      reportedBy: incident.reportedBy || currentUser?.name || 'On-Duty Crew',
      severity: incident.severity || 'High',
      status: 'Under Review',
      time: 'Just now',
      notes: incident.notes.trim(),
      photo: incident.photo || null,
      createdAtMs: Date.now(),
    };

    if (isFirebaseConfigured && db && currentUser) {
      try {
        await addDoc(collection(db, 'incidents'), item);
        notify('Incident logged LIVE to Admin Control Center!', 'warning');
        return;
      } catch {
        // fall through
      }
    }

    setState((prev) => ({
      ...prev,
      incidents: [item, ...prev.incidents],
      alerts: [
        {
          id: `alt-${Date.now()}`,
          title: `Incident: ${item.station}`,
          message: item.title,
          severity: item.severity === 'High' ? 'critical' : 'warning',
          time: 'Just now',
        },
        ...prev.alerts,
      ],
    }));
    notify('Incident logged and escalated to Admin Control Center', 'warning');
  };

  const exportReportCsv = () => {
    const headers = ['Crew ID', 'Name', 'Role', 'Designation', 'Station', 'Lobby', 'Division', 'Phone', 'Status'];
    const rows = state.contacts.map((c) => [
      c.employeeId || '',
      c.name,
      c.role,
      c.designation || c.role,
      c.station,
      c.lobby || '',
      c.division,
      c.phone,
      c.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LOCO_Operations_Crew_Report.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('LOCO Operations Report exported (CSV)');
  };

  const setLang = (nextLang) => {
    setState((prev) => ({ ...prev, lang: nextLang }));
    notify(nextLang === 'hi' ? 'भाषा हिंदी में बदल गई है' : 'Language switched to English', 'info');
  };

  const setThemeTemplate = (tpl) => {
    setState((prev) => ({ ...prev, themeTemplate: tpl }));
    const labels = {
      executive: 'LinkedIn Executive template active',
      classic: 'Classic Rail Command template active',
      dark: 'Royal Dark Control Room template active',
    };
    notify(labels[tpl] || 'Template updated', 'info');
  };

  const toggleLang = () => setLang(state.lang === 'hi' ? 'en' : 'hi');
  const t = (key) => TRANSLATIONS[state.lang || 'en']?.[key] || TRANSLATIONS.en[key] || key;

  const toggleDriverGps = () => {
    setState((prev) => {
      const next = !prev.driverGpsEnabled;
      notify(
        next
          ? 'Live Driver GPS ON — broadcasting your real location to Admin!'
          : 'Driver GPS paused (Off-Duty privacy mode)',
        'info'
      );
      if (!next) {
        pushGpsToCloud(null, false);
      }
      return { ...prev, driverGpsEnabled: next };
    });
  };

  const captureRealGps = () => {
    if (!navigator.geolocation) {
      notify('Device GPS unavailable — please enable Location on your phone', 'warning');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        setState((prev) => ({
          ...prev,
          driverGpsEnabled: true,
          realCoords: { lat: latitude, lng: longitude, accuracy: Math.round(accuracy || 0) },
        }));
        lastGpsPushRef.current = Date.now();
        await pushGpsToCloud({ latitude, longitude, accuracy, speed, heading }, true);
        notify(`Live GPS synced to Admin (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
      },
      () => {
        notify('Location permission denied — please allow Location access in phone settings', 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    notify('Demo data reset to defaults', 'info');
  };

  const pendingApprovalsTotal = state.pendingApprovalsCountBase + state.pendingApprovals.length;
  const activeNoticesTotal = 14 + state.notices.length;
  const sharedDocsTotal = 430 + state.documents.length;
  const incidentReportsTotal = 6 + state.incidents.length;

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        isFirebaseConfigured,
        currentUser,
        authLoading,
        authError,
        liveCrewLocations,
        gpsLastSyncAt,
        firebaseLogin,
        firebaseRegister,
        firebaseLogout,
        lang: state.lang || 'en',
        themeTemplate: state.themeTemplate || 'executive',
        setThemeTemplate,
        setLang,
        toggleLang,
        t,
        toggleDriverGps,
        captureRealGps,
        pendingApprovalsTotal,
        activeNoticesTotal,
        sharedDocsTotal,
        incidentReportsTotal,
        approveUser,
        rejectUser,
        addPendingRegistration,
        addContact,
        updateContact,
        deleteContact,
        addNotice,
        deleteNotice,
        uploadDocument,
        deleteDocument,
        reportIncident,
        exportReportCsv,
        resetDemo,
        notify,
        toasts,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
