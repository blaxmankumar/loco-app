import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Columns2,
  Languages,
  Lock,
  Monitor,
  Palette,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import AdminPortal from './components/AdminPortal';
import ExecutiveAdminView from './components/ExecutiveAdminView';
import MobileCrewApp from './components/MobileCrewApp';
import { LocoLogo } from './components/BrandAssets';
import {
  AuthDemoModal,
  ContactModal,
  DocumentPreviewModal,
  IncidentModal,
  NoticeModal,
  UploadDocModal,
} from './components/Modals';

function AppWorkspace() {
  const {
    addContact,
    updateContact,
    addNotice,
    uploadDocument,
    reportIncident,
    addPendingRegistration,
    toasts,
    notify,
    lang,
    setLang,
    themeTemplate,
    setThemeTemplate,
    t,
  } = useAppState();

  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode');
    if (m === 'mobile' || m === 'admin' || m === 'split') return m;
    return window.innerWidth < 768 ? 'mobile' : 'admin';
  });

  const [mobileScreenTab, setMobileScreenTab] = useState('dashboard');
  const [contactModalData, setContactModalData] = useState({ open: false, contact: null });
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [previewState, setPreviewState] = useState({ doc: null, notice: null });
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    const url = new URL(window.location.href);
    url.searchParams.set('mode', nextMode);
    window.history.replaceState({}, '', url);
  };

  const handleSaveContact = (data) => {
    if (contactModalData.contact) {
      updateContact(contactModalData.contact.id, data);
    } else {
      addContact(data);
    }
  };

  // Native full-screen Android app mode on mobile phones
  if (isSmallScreen && mode === 'mobile') {
    return (
      <>
        <MobileCrewApp
          framed={false}
          initialTab={mobileScreenTab}
          onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
          onOpenUploadModal={() => setUploadModalOpen(true)}
          onOpenIncidentModal={() => setIncidentModalOpen(true)}
          onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
          onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
        <ModalsLayer
          contactModalData={contactModalData}
          setContactModalData={setContactModalData}
          handleSaveContact={handleSaveContact}
          noticeModalOpen={noticeModalOpen}
          setNoticeModalOpen={setNoticeModalOpen}
          addNotice={addNotice}
          uploadModalOpen={uploadModalOpen}
          setUploadModalOpen={setUploadModalOpen}
          uploadDocument={uploadDocument}
          incidentModalOpen={incidentModalOpen}
          setIncidentModalOpen={setIncidentModalOpen}
          reportIncident={reportIncident}
          previewState={previewState}
          setPreviewState={setPreviewState}
          authModalOpen={authModalOpen}
          setAuthModalOpen={setAuthModalOpen}
          addPendingRegistration={addPendingRegistration}
          notify={notify}
          toasts={toasts}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF2F9]">
      {/* CLIENT DEMO MODE SWITCHER BAR */}
      <div className="h-[52px] bg-[#0A1933] text-white px-4 flex items-center justify-between gap-3 border-b border-[#D4A13B]/30 sticky top-0 z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <LocoLogo size={28} />
          <div className="flex items-center gap-2 truncate">
            <span className="font-extrabold tracking-wider text-sm text-[#F3D27A]">LOCO</span>
            <span className="hidden lg:inline text-xs text-blue-200/75">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Mode Pills */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl gap-1">
          <button
            onClick={() => switchMode('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              mode === 'admin'
                ? 'bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] shadow'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{t('adminPortal')}</span>
          </button>
          <button
            onClick={() => switchMode('mobile')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              mode === 'mobile'
                ? 'bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] shadow'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('androidApp')}</span>
          </button>
          <button
            onClick={() => switchMode('split')}
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              mode === 'split'
                ? 'bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] shadow'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{t('splitSync')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Template Switcher: Executive (LinkedIn) | Classic | Dark */}
          <div className="hidden md:flex items-center bg-white/10 p-0.5 rounded-lg border border-white/15" title="Switch Portal Template">
            <Palette className="w-3.5 h-3.5 text-[#F3D27A] mx-1.5" />
            {[
              { id: 'executive', label: 'Executive' },
              { id: 'classic', label: 'Classic' },
              { id: 'dark', label: 'Dark' },
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setThemeTemplate(tpl.id)}
                className={`px-2 py-1 rounded-md text-[10.5px] font-extrabold transition ${
                  themeTemplate === tpl.id ? 'bg-[#F3D27A] text-[#0E2347]' : 'text-blue-100 hover:text-white'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* English / Hindi Instant Switcher */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/15">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition ${
                lang === 'en' ? 'bg-[#F3D27A] text-[#0E2347]' : 'text-blue-100 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition flex items-center gap-1 ${
                lang === 'hi' ? 'bg-[#F3D27A] text-[#0E2347]' : 'text-blue-100 hover:text-white'
              }`}
            >
              <Languages className="w-3 h-3" /> हिंदी
            </button>
          </div>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-blue-100 transition"
          >
            <Lock className="w-3.5 h-3.5 text-[#F3D27A]" />
            {t('loginFlow')}
          </button>
        </div>
      </div>

      {/* VIEWPORT */}
      {mode === 'admin' &&
        (themeTemplate === 'classic' ? (
          <AdminPortal
            onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
            onOpenNoticeModal={() => setNoticeModalOpen(true)}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onOpenIncidentModal={() => setIncidentModalOpen(true)}
            onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
            onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : (
          <ExecutiveAdminView
            dark={themeTemplate === 'dark'}
            onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
            onOpenNoticeModal={() => setNoticeModalOpen(true)}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onOpenIncidentModal={() => setIncidentModalOpen(true)}
            onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
            onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ))}

      {mode === 'mobile' && (
        <div className="flex-1 bg-gradient-to-br from-[#F4F7FC] via-[#E9F0FA] to-[#DCE8F8] py-8 px-6 flex items-center justify-center">
          <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Showcase Left Column matching Photos 2 & 3 */}
            <div className="max-w-md space-y-5">
              <div className="flex items-center gap-3.5">
                <LocoLogo size={60} />
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0E2347] leading-none">LOCO</h1>
                  <p className="text-sm text-slate-600 mt-1">Railway Staff Communication &amp; Operations</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-[#0E2347] leading-tight">
                  LOCO –{' '}
                  <span className="text-[#C8922A]">Android Crew App &amp; Document Hub</span>
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Next-generation internal mobile app for railway staff to access crew contacts with photos, live notices, HRMS documents, shift rosters, and one-tap emergency helplines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Crew Directory + Photos',
                    desc: 'Attach staff photos, filter 28 CG districts, one-tap Call & WhatsApp.',
                    tabTarget: 'directory',
                  },
                  {
                    title: 'Live Circulars & Notices',
                    desc: 'Priority duty roster banners & real-time safety notices.',
                    tabTarget: 'notices',
                  },
                  {
                    title: 'HRMS Document Vault',
                    desc: 'Upload, categorize & preview PDFs, orders and photos securely.',
                    tabTarget: 'documents',
                  },
                  {
                    title: 'Emergency Ready',
                    desc: 'One-tap railway helplines (139, 182, 112) & incident alerts.',
                    tabTarget: 'dashboard',
                  },
                ].map((f) => (
                  <button
                    key={f.title}
                    onClick={() => setMobileScreenTab(f.tabTarget)}
                    className="bg-white/90 hover:bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card text-left transition hover:border-[#D4A13B]"
                  >
                    <p className="font-extrabold text-xs text-[#0E2347]">{f.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{f.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-[#D4A13B]" />
                <span>Interactive demo — click anywhere inside the phone or add a contact photo!</span>
              </div>
            </div>

            {/* Interactive Android Phone Frame */}
            <MobileCrewApp
              key={mobileScreenTab}
              framed
              initialTab={mobileScreenTab}
              onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenIncidentModal={() => setIncidentModalOpen(true)}
              onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
              onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          </div>
        </div>
      )}

      {mode === 'split' && (
        <div className="flex-1 flex items-start">
          <div className="flex-1 min-w-0">
            <AdminPortal
              onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
              onOpenNoticeModal={() => setNoticeModalOpen(true)}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenIncidentModal={() => setIncidentModalOpen(true)}
              onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
              onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          </div>
          <div className="w-[418px] shrink-0 bg-[#E8EFF9] border-l border-slate-200 min-h-[calc(100vh-52px)] p-5 flex flex-col items-center sticky top-[52px]">
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2347] text-[#F3D27A] text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Synced Android Crew App
              </span>
            </div>
            <MobileCrewApp
              framed
              initialTab="dashboard"
              onOpenContactModal={(contact) => setContactModalData({ open: true, contact })}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenIncidentModal={() => setIncidentModalOpen(true)}
              onPreviewDoc={(doc) => setPreviewState({ doc, notice: null })}
              onPreviewNotice={(notice) => setPreviewState({ doc: null, notice })}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          </div>
        </div>
      )}

      <ModalsLayer
        contactModalData={contactModalData}
        setContactModalData={setContactModalData}
        handleSaveContact={handleSaveContact}
        noticeModalOpen={noticeModalOpen}
        setNoticeModalOpen={setNoticeModalOpen}
        addNotice={addNotice}
        uploadModalOpen={uploadModalOpen}
        setUploadModalOpen={setUploadModalOpen}
        uploadDocument={uploadDocument}
        incidentModalOpen={incidentModalOpen}
        setIncidentModalOpen={setIncidentModalOpen}
        reportIncident={reportIncident}
        previewState={previewState}
        setPreviewState={setPreviewState}
        authModalOpen={authModalOpen}
        setAuthModalOpen={setAuthModalOpen}
        addPendingRegistration={addPendingRegistration}
        notify={notify}
        toasts={toasts}
      />
    </div>
  );
}

function ModalsLayer({
  contactModalData,
  setContactModalData,
  handleSaveContact,
  noticeModalOpen,
  setNoticeModalOpen,
  addNotice,
  uploadModalOpen,
  setUploadModalOpen,
  uploadDocument,
  incidentModalOpen,
  setIncidentModalOpen,
  reportIncident,
  previewState,
  setPreviewState,
  authModalOpen,
  setAuthModalOpen,
  addPendingRegistration,
  notify,
  toasts,
}) {
  return (
    <>
      {contactModalData.open && (
        <ContactModal
          initialContact={contactModalData.contact}
          onSave={handleSaveContact}
          onClose={() => setContactModalData({ open: false, contact: null })}
        />
      )}
      {noticeModalOpen && (
        <NoticeModal onSave={addNotice} onClose={() => setNoticeModalOpen(false)} />
      )}
      {uploadModalOpen && (
        <UploadDocModal onSave={uploadDocument} onClose={() => setUploadModalOpen(false)} />
      )}
      {incidentModalOpen && (
        <IncidentModal onSave={reportIncident} onClose={() => setIncidentModalOpen(false)} />
      )}
      {(previewState.doc || previewState.notice) && (
        <DocumentPreviewModal
          doc={previewState.doc}
          notice={previewState.notice}
          onClose={() => setPreviewState({ doc: null, notice: null })}
        />
      )}
      {authModalOpen && (
        <AuthDemoModal
          onRegister={addPendingRegistration}
          onEnterDemo={() => notify('Signed in as Approved LOCO Staff')}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-[#0E2347] text-white px-4 py-3 rounded-xl shadow-xl border border-[#F3D27A]/40 text-xs font-semibold flex items-center gap-2.5 animate-fade-up"
          >
            <CheckCircle2 className="w-4 h-4 text-[#F3D27A] shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppWorkspace />
    </AppStateProvider>
  );
}
