import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  Lock,
  Megaphone,
  Trash2,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import { DISTRICTS, DIVISIONS, ROLES } from '../data/initialData';
import { LocoLogo, OfficerAvatar, TrainPhotoGraphic } from './BrandAssets';

function ModalShell({ title, subtitle, icon: Icon, onClose, children, maxWidth = 'max-w-lg' }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091833]/60 backdrop-blur-sm p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#0E2347] to-[#17366B] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-[#D4A13B]/20 border border-[#F3D27A]/40 flex items-center justify-center text-[#F3D27A]">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-base leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-blue-200/85 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ContactModal({ initialContact = null, onSave, onClose }) {
  const [name, setName] = useState(initialContact?.name || '');
  const [phone, setPhone] = useState(initialContact?.phone || '');
  const [station, setStation] = useState(initialContact?.station || 'BSP');
  const [district, setDistrict] = useState(initialContact?.district || 'Bilaspur');
  const [role, setRole] = useState(initialContact?.role || 'Loco Pilot');
  const [division, setDivision] = useState(initialContact?.division || 'Bilaspur Division (SECR)');
  const [photo, setPhoto] = useState(initialContact?.photo || null);
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef(null);

  const handlePhotoChange = (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Resize image lightly on canvas so localStorage stays snappy
      const img = new Image();
      img.onload = () => {
        const max = 320;
        let { width, height } = img;
        if (width > height && width > max) {
          height = Math.round((height * max) / width);
          width = max;
        } else if (height > max) {
          width = Math.round((width * max) / height);
          height = max;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPhoto(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSave({
      name,
      phone,
      station,
      district,
      role,
      division,
      photo,
    });
    onClose();
  };

  return (
    <ModalShell
      title={initialContact ? 'Edit Crew Contact & Photo' : 'Add Crew Contact'}
      subtitle="Attach staff profile photo, station lobby, district & helpline details"
      icon={UserPlus}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo Upload Area */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F5F8FC] border border-dashed border-[#1B3C73]/25">
          <div className="relative group">
            <OfficerAvatar
              photo={photo}
              name={name || 'Crew'}
              variant={initialContact?.avatarVariant || 'officer-male-1'}
              size={72}
              ring
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4A13B] text-[#0E2347] shadow-md flex items-center justify-center hover:bg-[#c5922d] transition"
              title="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0E2347]">Contact Profile Photo</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Attach a photo (JPG/PNG) so staff can recognize crew members instantly.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E2347] text-white text-xs font-semibold hover:bg-[#17366B] transition"
              >
                <Upload className="w-3.5 h-3.5" />
                {photo ? 'Change Photo' : 'Attach Photo'}
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
            {photoError && <p className="text-xs text-red-600 mt-1">{photoError}</p>}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajeshwar Patel"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50 focus:border-[#0E2347]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50 focus:border-[#0E2347]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Station / Lobby Code</label>
            <input
              value={station}
              onChange={(e) => setStation(e.target.value.toUpperCase())}
              placeholder="e.g. BSP, R, DURG"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50 focus:border-[#0E2347]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">District (Chhattisgarh)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#D4A13B] to-[#E5B84B] text-[#0E2347] shadow-sm hover:brightness-95 transition"
          >
            {initialContact ? 'Update Contact' : 'Save Contact'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function NoticeModal({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Operations');
  const [priority, setPriority] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, body, category, priority, attachmentName: attachmentName || null });
    onClose();
  };

  return (
    <ModalShell
      title="Publish Official Notice"
      subtitle="Broadcasts live to Admin Control Center & all LOCO Crew mobile devices"
      icon={Megaphone}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Notice Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fog Safety Speed Restriction – Sec B"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
            >
              <option>HRMS</option>
              <option>Safety</option>
              <option>Operations</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#FDF6E4]/60 cursor-pointer">
              <input
                type="checkbox"
                checked={priority}
                onChange={(e) => setPriority(e.target.checked)}
                className="accent-[#0E2347] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#0E2347]">Mark Priority Banner</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Details / Instructions</label>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter complete circular instructions for crew..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Attach PDF / Photo (optional)</label>
          <input
            type="file"
            accept=".pdf,image/*,.doc,.docx"
            onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')}
            className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0E2347] file:text-white hover:file:bg-[#17366B]"
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0E2347] text-white hover:bg-[#17366B]">
            Publish Notice
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function UploadDocModal({ onSave, onClose }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Circulars');
  const [fileMeta, setFileMeta] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeLabel = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(12, Math.round(file.size / 1024))} KB`;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFileMeta({ fileName: file.name, size: sizeLabel, dataUrl: reader.result });
      reader.readAsDataURL(file);
    } else {
      setFileMeta({ fileName: file.name, size: sizeLabel, dataUrl: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      fileName: fileMeta?.fileName || `LOCO_Circular_${Math.floor(10 + Math.random() * 89)}.pdf`,
      size: fileMeta?.size || '1.6 MB',
      dataUrl: fileMeta?.dataUrl || null,
      description: description || 'Official Railway Operations Circular',
      category,
    });
    onClose();
  };

  return (
    <ModalShell
      title="Upload Circular / HRMS Document"
      subtitle="Share PDF circulars, duty orders, forms or site photos securely"
      icon={Upload}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select File (PDF, Image, DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleFile}
            className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D4A13B] file:text-[#0E2347] hover:file:brightness-95"
          />
          {fileMeta && (
            <p className="text-xs text-emerald-700 font-medium mt-1.5">
              Ready: {fileMeta.fileName} ({fileMeta.size})
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Vault Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
          >
            <option>Circulars</option>
            <option>Safety</option>
            <option>Duty Orders</option>
            <option>Forms</option>
            <option>Photos</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Incident report at BSP or Updated roster PDF"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#D4A13B] to-[#E5B84B] text-[#0E2347]">
            Upload & Share
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function IncidentModal({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [station, setStation] = useState('BSP – Bilaspur');
  const [severity, setSeverity] = useState('High');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, station, severity, notes });
    onClose();
  };

  return (
    <ModalShell
      title="Report Operational Incident"
      subtitle="Instant alert sent to Station Control & LOCO Admin Control Center"
      icon={AlertTriangle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Incident Summary *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Signal aspect fluctuation near Outer"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Station / Section</label>
            <input
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Details</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe location, KM post, train number, or assistance needed..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700">
            Submit Alert
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function DocumentPreviewModal({ doc, notice, onClose }) {
  const item = doc || notice;
  if (!item) return null;
  const isNotice = Boolean(notice);

  const handleDownload = () => {
    const content = isNotice
      ? `LOCO OFFICIAL NOTICE\nTitle: ${notice.title}\nCategory: ${notice.category}\nDate: ${notice.date}\nAuthor: ${notice.author}\n\n${notice.body}`
      : `LOCO DOCUMENT VAULT\nFile: ${doc.fileName}\nCategory: ${doc.category}\nUploaded By: ${doc.uploaderFull}\nDate: ${doc.date}\n\n${doc.summary}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isNotice ? `${notice.title.replace(/\s+/g, '_')}.txt` : `${doc.fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ModalShell
      title={isNotice ? notice.title : doc.fileName}
      subtitle={isNotice ? `${notice.category} Notice • ${notice.author} • ${notice.date}` : `${doc.category} • ${doc.size} • Uploaded by ${doc.uploaderFull}`}
      icon={isNotice ? Megaphone : doc.previewType === 'image' ? ImageIcon : FileText}
      onClose={onClose}
    >
      <div className="space-y-4">
        {!isNotice && doc.previewType === 'image' && (
          <div className="rounded-xl overflow-hidden border border-slate-200 h-52 bg-slate-100">
            {doc.dataUrl ? (
              <img src={doc.dataUrl} alt={doc.fileName} className="w-full h-full object-cover" />
            ) : (
              <TrainPhotoGraphic title={doc.fileName} />
            )}
          </div>
        )}
        <div className="rounded-xl bg-[#F5F8FC] border border-slate-200/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0E2347] uppercase tracking-wide">
              {isNotice ? 'Official Circular Brief' : 'Protected HRMS Attachment'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {isNotice ? notice.body : doc.summary}
          </p>
          {isNotice && notice.attachmentName && (
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0E2347]">
              <FileText className="w-4 h-4 text-red-500" />
              <span>{notice.attachmentName}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-[#0E2347] text-white hover:bg-[#17366B]"
          >
            <Download className="w-4 h-4" />
            Download Copy
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function AuthDemoModal({ onRegister, onEnterDemo, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [userId, setUserId] = useState('LP20419');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Loco Pilot');
  const [station, setStation] = useState('BSP');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!fullName.trim()) return;
      onRegister({ name: fullName, role, station, employeeId: userId || 'LP-NEW' });
      setWaitingApproval(true);
    } else {
      onEnterDemo();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091833]/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#132C58] to-[#0B1C3A] text-white p-7 shadow-2xl border border-[#F3D27A]/25 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <LocoLogo size={76} />
          <h2 className="mt-3 text-2xl font-extrabold tracking-[0.2em] text-[#F3D27A]">LOCO</h2>
          <p className="text-xs text-blue-200/80 mt-1">Railway Staff Communication & Operations</p>
        </div>

        {waitingApproval ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D4A13B]/20 border border-[#F3D27A]/40 flex items-center justify-center text-[#F3D27A]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold">Waiting for Admin Approval</h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Your registration (<span className="text-[#F3D27A] font-semibold">{fullName}</span>) has been added live to the Admin Control Center&apos;s Pending Approvals queue!
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] font-bold text-sm"
            >
              Open Admin Center to Approve Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name (e.g. Suresh Verma)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#0E2347] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-white text-[#0E2347] text-xs font-semibold"
                  >
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    value={station}
                    onChange={(e) => setStation(e.target.value.toUpperCase())}
                    placeholder="Station (BSP)"
                    className="px-3 py-2.5 rounded-xl bg-white text-[#0E2347] text-xs font-semibold uppercase"
                  />
                </div>
              </>
            )}
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Employee / User ID"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#0E2347] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#0E2347] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] font-extrabold text-sm shadow-lg hover:brightness-105 transition mt-2"
            >
              {isRegister ? 'Create Account (Requires Approval)' : 'Sign In to LOCO Portal'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister((v) => !v)}
              className="w-full text-center text-xs text-blue-200/80 hover:text-[#F3D27A] pt-1"
            >
              {isRegister ? 'Already have an account? Sign In' : 'New railway staff? Register for approval'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
