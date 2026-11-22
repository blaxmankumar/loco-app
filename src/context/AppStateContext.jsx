import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ALERTS,
  INITIAL_CONTACTS,
  INITIAL_DOCUMENTS,
  INITIAL_INCIDENTS,
  INITIAL_NOTICES,
  INITIAL_PENDING_APPROVALS,
} from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

const STORAGE_KEY = 'loco_rail_demo_state_v4';

const defaultState = {
  lang: 'en',
  themeTemplate: 'executive',
  driverGpsEnabled: true,
  realCoords: null,
  totalUsers: 5842,
  pendingApprovalsCountBase: 17, // + 7 visible = 24 matching dashboard KPI
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors if very large photo uploaded
    }
  }, [state]);

  const notify = (message, tone = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const approveUser = (id) => {
    setState((prev) => {
      const target = prev.pendingApprovals.find((u) => u.id === id);
      if (!target) return prev;
      const newContact = {
        id: `cnt-${Date.now()}`,
        name: target.name,
        role: target.role,
        station: target.station,
        district: target.district,
        division: target.division,
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

  const rejectUser = (id) => {
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
          division: user.division || 'Bilaspur Division (SECR)',
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

  const addContact = (contact) => {
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
    };
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

  const updateContact = (id, patch) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    notify('Contact details updated');
  };

  const deleteContact = (id) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
    notify('Contact removed from directory', 'info');
  };

  const addNotice = (notice) => {
    const item = {
      id: `not-${Date.now()}`,
      title: notice.title.trim(),
      body: notice.body.trim(),
      category: notice.category || 'Operations',
      priority: Boolean(notice.priority),
      date: '04 Feb 2025',
      timeLabel: 'Just now',
      author: notice.author || 'Admin Control Center',
      attachmentName: notice.attachmentName || null,
      attachmentUrl: notice.attachmentUrl || null,
    };
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

  const deleteNotice = (id) => {
    setState((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== id),
    }));
    notify('Notice removed', 'info');
  };

  const uploadDocument = (doc) => {
    const ext = (doc.fileName || '').split('.').pop()?.toUpperCase() || 'PDF';
    const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(ext);
    const type = isImage ? 'IMG' : ext === 'DOCX' || ext === 'DOC' ? 'DOC' : 'PDF';
    const item = {
      id: `doc-${Date.now()}`,
      fileName: doc.fileName || 'Circular_Update.pdf',
      description: doc.description || doc.fileName,
      category: doc.category || (isImage ? 'Photos' : 'Circulars'),
      type,
      size: doc.size || '1.4 MB',
      uploader: doc.uploader || 'Admin',
      uploaderFull: doc.uploaderFull || 'Admin Control Center',
      status: 'Shared',
      date: 'Just now',
      previewType: isImage ? 'image' : type === 'DOC' ? 'doc' : 'pdf',
      dataUrl: doc.dataUrl || null,
      summary: doc.description || 'Official document shared via LOCO Document Vault.',
    };
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

  const deleteDocument = (id) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
    notify('Document deleted', 'info');
  };

  const reportIncident = (incident) => {
    const item = {
      id: `inc-${Date.now()}`,
      title: incident.title.trim(),
      station: incident.station.trim() || 'BSP – Bilaspur',
      reportedBy: incident.reportedBy || 'On-Duty Crew',
      severity: incident.severity || 'High',
      status: 'Under Review',
      time: 'Just now',
      notes: incident.notes.trim(),
      photo: incident.photo || null,
    };
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
    const headers = ['Name', 'Role', 'Station', 'District', 'Division', 'Phone', 'Status'];
    const rows = state.contacts.map((c) => [
      c.name,
      c.role,
      c.station,
      c.district,
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
          ? 'Live Driver GPS enabled — broadcasting to Admin Control Center'
          : 'Driver GPS paused (Off-Duty privacy mode)',
        'info'
      );
      return { ...prev, driverGpsEnabled: next };
    });
  };

  const captureRealGps = () => {
    if (!navigator.geolocation) {
      notify('Browser geolocation unavailable — using corridor GPS simulation', 'info');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState((prev) => ({
          ...prev,
          driverGpsEnabled: true,
          realCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }));
        notify(`Live device GPS synced (${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`);
      },
      () => {
        notify('Location permission denied — continuing with SECR corridor GPS feed', 'info');
      },
      { timeout: 6000 }
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
