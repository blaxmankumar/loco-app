export const DISTRICTS = [
  'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
  'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
  'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli',
  'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja',
];

export const ROLES = [
  'Loco Pilot',
  'Assistant Loco Pilot',
  'Train Manager',
  'Station Controller',
  'Crew Coordinator',
  'Other',
];

export const DIVISIONS = ['Bilaspur', 'Raipur', 'Nagpur'];

export const DIVISION_LOBBIES = {
  Bilaspur: [
    'Bilaspur (BSP)',
    'Kharsia (KHS)',
    'Akaltara (AKT)',
    'Raigarh (RIG)',
    'Korba (KRBA)',
    'Brajrajnagar (BRJN)',
    'Pendra Road (PND)',
    'Uslapur (USL)',
    'Shahdol (SDL)',
    'Bijuri (BJRI)',
    'Surajpur Road (SJQ)',
    'Champa (CPH)',
    'Anuppur (APR)',
  ],
  Raipur: [
    'Raipur (R)',
    'Durg (DURG)',
    'Bhilai (BIA)',
    'Bhatapara (BYT)',
    'Dalli Rajhara (DRZ)',
    'Tilda-Neora (TLD)',
  ],
  Nagpur: [
    'Nagpur / Itwari (NITR)',
    'Ajni (AJNI)',
    'Gondia (G)',
    'Dongargarh (DGG)',
    'Rajnandgaon (RJN)',
    'Balaghat (BTC)',
    'Tumsar Road Jn (TMR)',
    'Kachhewani (KWN)',
  ],
};

export const ALL_LOBBIES = [
  ...DIVISION_LOBBIES.Bilaspur,
  ...DIVISION_LOBBIES.Raipur,
  ...DIVISION_LOBBIES.Nagpur,
];

export const INITIAL_PENDING_APPROVALS = [
  {
    id: 'apr-1',
    name: 'Rakesh Kumar',
    role: 'Loco Pilot',
    division: 'Bilaspur',
    lobby: 'Bilaspur (BSP)',
    district: 'Bilaspur',
    station: 'BSP',
    phone: '9826104512',
    employeeId: 'LP-20419',
    avatarVariant: 'officer-male-1',
    requestedAt: 'Today, 09:42',
  },
  {
    id: 'apr-2',
    name: 'Priya Sharma',
    role: 'Station Controller',
    division: 'Raipur',
    lobby: 'Raipur (R)',
    district: 'Raipur',
    station: 'R',
    phone: '9826218944',
    employeeId: 'SC-11820',
    avatarVariant: 'officer-female-1',
    requestedAt: 'Today, 09:15',
  },
  {
    id: 'apr-3',
    name: 'Mohit Verma',
    role: 'Train Manager',
    division: 'Raipur',
    lobby: 'Durg (DURG)',
    district: 'Durg',
    station: 'DURG',
    phone: '9425290811',
    employeeId: 'TM-30942',
    avatarVariant: 'officer-male-2',
    requestedAt: 'Today, 08:30',
  },
  {
    id: 'apr-4',
    name: 'Anita Desai',
    role: 'Crew Coordinator',
    division: 'Bilaspur',
    lobby: 'Korba (KRBA)',
    district: 'Korba',
    station: 'KRBA',
    phone: '9893122340',
    employeeId: 'CC-40218',
    avatarVariant: 'officer-female-2',
    requestedAt: 'Yesterday, 19:10',
  },
  {
    id: 'apr-5',
    name: 'Sandeep Tiwari',
    role: 'Assistant Loco Pilot',
    division: 'Bilaspur',
    lobby: 'Bilaspur (BSP)',
    district: 'Bilaspur',
    station: 'BSP',
    phone: '9425533190',
    employeeId: 'ALP-55102',
    avatarVariant: 'officer-male-3',
    requestedAt: 'Yesterday, 16:45',
  },
  {
    id: 'apr-6',
    name: 'Neha Sahu',
    role: 'Station Controller',
    division: 'Bilaspur',
    lobby: 'Raigarh (RIG)',
    district: 'Raigarh',
    station: 'RIG',
    phone: '9827144921',
    employeeId: 'SC-12084',
    avatarVariant: 'officer-female-1',
    requestedAt: '03 Feb, 15:20',
  },
  {
    id: 'apr-7',
    name: 'Vikram Rathore',
    role: 'Loco Pilot',
    division: 'Nagpur',
    lobby: 'Rajnandgaon (RJN)',
    district: 'Rajnandgaon',
    station: 'RJN',
    phone: '9406187234',
    employeeId: 'LP-20988',
    avatarVariant: 'officer-male-1',
    requestedAt: '03 Feb, 11:05',
  },
];

const LOBBY_OFFICIAL_PHONES = {
  BSP: '9752441439',
  KHS: '8114386860',
  AKT: '7777825757',
  RIG: '9752441699',
  KRBA: '9752090664',
  BRJN: '9777575940',
  PND: '9752441209',
  USL: '9752441709',
  SDL: '9752442477',
  BJRI: '9752441898',
  SJQ: '9752442715',
  CPH: '9752441359',
  APR: '9752444246',
  R: '9752440099',
  DURG: '8827395307',
  BIA: '9752445000',
  BYT: '8085955708',
  DRZ: '9752877380',
  TLD: '9752877383',
  NITR: '9561005386',
  AJNI: '8600027482',
  G: '8600006806',
  DGG: '9752485444',
  RJN: '9752877890',
  BTC: '8600027482',
  TMR: '8600006806',
  KWN: '9561005386',
};

const STAFF_NAME_POOL = {
  'Loco Pilot': [
    'Rajeshwar Patel', 'Dinesh Chandra', 'Suresh Mahanta', 'Vinay Kumar Netam',
    'Rameshwar Sahu', 'Anil Kumar Pandey', 'Kamlesh Banjare', 'Mahendra Singh Thakur',
    'Santosh Kumar Verma', 'Prashant Deshpande', 'Nitin Gajbhiye', 'Hemant Kumar Sahu',
    'Bhupendra Tiwari', 'Rajkumar Dewangan', 'Ashok Kumar Yadav', 'Yogeshwar Verma',
    'Devendra Singh', 'Lalit Kumar Nayak', 'Pramod Kumar Patel', 'Satish Chandra Rao',
    'Mukesh Kumar Sharma', 'Gajendra Kurrey', 'Naresh Kumar Sinha', 'Ravi Shankar Dubey',
    'Jitendra Kumar Sahu', 'Shailendra Verma', 'Kishore Kumar Patel',
  ],
  'Assistant Loco Pilot': [
    'Rohan Kashyap', 'Manoj Dewangan', 'Amit Kumar Sahu', 'Deepak Meshram',
    'Sandeep Tiwari', 'Abhishek Sahu', 'Rahul Kaushik', 'Pankaj Kumar Singh',
    'Vikram Rathore', 'Nikhil Chandrakar', 'Tushar Deshmukh', 'Harshvardhan Patel',
    'Gaurav Kumar Verma', 'Praveen Kumar Yadav', 'Shubham Agrawal', 'Anurag Mishra',
    'Vishweshwar Kumar', 'Lokeshwar Sahu', 'Ranjeet Kumar', 'Avinash Tirkey',
    'Mayank Sharma', 'Kunal Bisen', 'Rohit Chauhan', 'Saurabh Pandey',
    'Mohan Lal Sahu', 'Vivek Kumar Patel', 'Akash Kumar Verma',
  ],
  'Train Manager': [
    'Prakash Narayan', 'Harishankar Yadav', 'Pankaj Deshmukh', 'Ritesh Gedam',
    'Mohit Verma', 'K. Sai Kumar', 'S. K. Yadav', 'Manish Kumar',
    'Lala Ram Sahu', 'Bhanu Prakash', 'C. L. Dewangan', 'Sanjeev Mishra',
    'Awadh Kumar', 'Dev Narayan', 'R. B. Ray', 'U. K. Yadav',
    'Sanyasi Rao', 'B. K. Yadav', 'Atul Kr Parate', 'H. K. Lasher',
    'C. S. Kurrey', 'S. K. Gupta', 'M. Saleem Khan', 'Nagendra Kumar',
    'P. K. Nangal', 'R. K. Mishra', 'S. O. Dubey',
  ],
  'Station Controller': [
    'Vivek Kumar Sahu', 'Sunita Deshmukh', 'Meenakshi Nair', 'Priya Sharma',
    'Neha Sahu', 'Seema Tolwani', 'Kavita Verma', 'Anita Desai',
    'Ashish Mishra', 'Bhaskar Das', 'Jitendra Naidu', 'A. K. Verma',
    'V. K. Sharma', 'Vinod Sharma', 'Amit Kaushik', 'Shashi Choudhary',
    'C. K. Dubey', 'Manoj Kumar Sharma', 'P. R. Pandit', 'P. R. Chakraborty',
    'H. S. S. Sharma', 'A. T. Mukherjee', 'B. Ravikant', 'S. Bhattacharya',
    'Rodrigz James', 'Santosh Kumar', 'Alok Kumar Tiwari',
  ],
};

function buildFullSecrContacts() {
  const list = [];
  const coreRoles = ['Loco Pilot', 'Assistant Loco Pilot', 'Train Manager', 'Station Controller'];
  let idx = 0;
  DIVISIONS.forEach((division) => {
    (DIVISION_LOBBIES[division] || []).forEach((lobbyLabel) => {
      const m = lobbyLabel.match(/\(([^)]+)\)/);
      const code = m ? m[1] : 'BSP';
      const basePhone = LOBBY_OFFICIAL_PHONES[code] || '9752441439';
      coreRoles.forEach((role, rIdx) => {
        const names = STAFF_NAME_POOL[role];
        const name = names[idx % names.length];
        const prefix = role === 'Loco Pilot' ? 'LP' : role === 'Assistant Loco Pilot' ? 'ALP' : role === 'Train Manager' ? 'TM' : 'SC';
        const female = ['Sunita', 'Meenakshi', 'Priya', 'Neha', 'Seema', 'Kavita', 'Anita', 'Shashi'].some((f) =>
          name.startsWith(f)
        );
        list.push({
          id: `cnt-${division.toLowerCase()}-${code.toLowerCase()}-${rIdx + 1}`,
          name,
          role,
          station: code,
          lobby: lobbyLabel,
          district: division,
          division,
          phone: basePhone,
          employeeId: `${prefix}-${10100 + idx * 17 + rIdx}`,
          status: rIdx % 3 === 2 ? 'Available' : 'On Duty',
          shift: rIdx % 2 === 0 ? '08:00 – 16:00' : '16:00 – 00:00',
          photo: null,
          avatarVariant: female
            ? rIdx % 2 === 0
              ? 'officer-female-1'
              : 'officer-female-2'
            : ['officer-male-1', 'officer-male-2', 'officer-male-3'][(idx + rIdx) % 3],
        });
      });
      idx += 1;
    });
  });
  return list;
}

export const INITIAL_CONTACTS = buildFullSecrContacts();

export const INITIAL_NOTICES = [
  {
    id: 'not-1',
    title: 'Revised Duty Roster – Feb 2025',
    body: 'Updated shift plan and station-wise deployment across Bilaspur, Raipur, and Durg lobbies. All Loco Pilots and Train Managers must acknowledge roster timings before 06:00 hrs.',
    category: 'HRMS',
    priority: true,
    date: '04 Feb 2025',
    timeLabel: 'Today, 09:30',
    author: 'Station Control (SCL)',
    attachmentName: 'Revised_Duty_Roster_Feb2025.pdf',
  },
  {
    id: 'not-2',
    title: 'Holiday Roster – Feb 2025',
    body: 'Approved gazetted & restricted holiday crew allocation schedule for February 2025. Standby crew availability updated on HRMS portal.',
    category: 'HRMS',
    priority: false,
    date: '04 Feb 2025',
    timeLabel: 'Today, 07:40',
    author: 'P. Singh (HRMS)',
    attachmentName: 'Holiday_Roster_Feb_2025.docx',
  },
  {
    id: 'not-3',
    title: 'Safety Drill – Zone 3',
    body: 'Mandatory emergency brake & signal failure simulation drill at Zone 3 yard tracks. Participation required for on-duty crew and station controllers.',
    category: 'Safety',
    priority: false,
    date: '03 Feb 2025',
    timeLabel: 'Yesterday, 18:20',
    author: 'Chief Safety Officer',
    attachmentName: 'Safety_Drill_Zone3_Brief.pdf',
  },
  {
    id: 'not-4',
    title: 'Updated Cleaning Protocols',
    body: 'Revised coach sanitization and loco cab hygiene inspection checklist effective immediately at all major terminal lobbies.',
    category: 'Operations',
    priority: false,
    date: '30 Jan 2025',
    timeLabel: '03 Feb, 11:15',
    author: 'Operations Desk',
    attachmentName: 'Cleaning_Protocols_v2.pdf',
  },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    fileName: 'Operations Circular 04.pdf',
    description: 'Signal Passing & Monsoon Speed Advisory',
    category: 'Circulars',
    type: 'PDF',
    size: '2.4 MB',
    uploader: 'S. Mehta',
    uploaderFull: 'Station Control (SCL)',
    status: 'Shared',
    date: 'Today, 08:10',
    previewType: 'pdf',
    summary: 'Official circular detailing revised speed limits on Route B-12 during track maintenance windows and mandatory cab-to-control radio check-ins.',
  },
  {
    id: 'doc-2',
    fileName: 'Platform Update.jpg',
    description: 'Platform 3 Signal Indicator Upgrade',
    category: 'Photos',
    type: 'IMG',
    size: '1.1 MB',
    uploader: 'R. Gupta',
    uploaderFull: 'R. Gupta (Engineering)',
    status: 'Viewed',
    date: 'Today, 07:45',
    previewType: 'image',
    summary: 'Site photo verifying new LED starter signal commissioning at Platform 3, Bilaspur Junction.',
  },
  {
    id: 'doc-3',
    fileName: 'Holiday Roster – Feb 2025.docx',
    description: 'Division-wide Holiday Duty Roster',
    category: 'Duty Orders',
    type: 'DOC',
    size: '640 KB',
    uploader: 'P. Singh',
    uploaderFull: 'P. Singh (HRMS)',
    status: 'Shared',
    date: 'Yesterday, 17:35',
    previewType: 'doc',
    summary: 'Complete shift rotation table for Loco Pilots, ALPs, and Train Managers for February 2025.',
  },
  {
    id: 'doc-4',
    fileName: 'Safety Guidelines v3.pdf',
    description: 'Updated Safety & Fire Protocol Handbook',
    category: 'Safety',
    type: 'PDF',
    size: '3.8 MB',
    uploader: 'K. Rao',
    uploaderFull: 'Admin',
    status: 'Shared',
    date: '03 Feb, 14:20',
    previewType: 'pdf',
    summary: 'Comprehensive v3 safety manual covering emergency braking, fog safety devices (FSD), and RPF escalation procedures.',
  },
  {
    id: 'doc-5',
    fileName: 'Safety Drill – Zone 3.jpg',
    description: 'Zone 3 Yard Inspection & Drill Visual',
    category: 'Photos',
    type: 'IMG',
    size: '1.1 MB',
    uploader: 'M. Verma',
    uploaderFull: 'Safety Wing',
    status: 'Shared',
    date: '03 Feb, 10:15',
    previewType: 'image',
    summary: 'Photographic log from Zone 3 mock emergency drill conducted with Loco Crew and RPF.',
  },
  {
    id: 'doc-6',
    fileName: 'HRMS Leave Application Form.pdf',
    description: 'Standard Crew Leave & Rest Claim Form',
    category: 'Forms',
    type: 'PDF',
    size: '420 KB',
    uploader: 'HRMS Desk',
    uploaderFull: 'HRMS Portal Admin',
    status: 'Shared',
    date: '02 Feb, 16:00',
    previewType: 'pdf',
    summary: 'Fillable HRMS leave, outstation rest allowance, and medical fitness submission template.',
  },
];

export const INITIAL_ALERTS = [
  {
    id: 'alt-1',
    title: 'Security Notice',
    message: 'Heightened vigilance at major stations. Report unattended baggage to RPF 182 immediately.',
    severity: 'critical',
    time: 'Today, 10:05',
  },
  {
    id: 'alt-2',
    title: 'Operational Alert',
    message: 'Track maintenance on Route B-12 (11:00 – 15:00). Caution order 30 km/h enforced.',
    severity: 'warning',
    time: 'Today, 08:40',
  },
];

export const INITIAL_INCIDENTS = [
  {
    id: 'inc-1',
    title: 'Signal flicker near KM 412/8',
    station: 'BSP – Bilaspur',
    reportedBy: 'Rajeshwar Patel (LP)',
    severity: 'High',
    status: 'Under Review',
    time: 'Today, 09:12',
    notes: 'Intermittent yellow aspect observed on down main line. S&T team dispatched.',
  },
  {
    id: 'inc-2',
    title: 'Cattle run-over caution near outer',
    station: 'DURG – Durg',
    reportedBy: 'Amit Kumar Sahu (ALP)',
    severity: 'Medium',
    status: 'Resolved',
    time: 'Yesterday, 21:40',
    notes: 'Line cleared within 12 minutes; track inspected and safe for normal speed.',
  },
  {
    id: 'inc-3',
    title: 'Cab radio static in Yard 3',
    station: 'KRBA – Korba',
    reportedBy: 'Prakash Narayan (TM)',
    severity: 'Low',
    status: 'Resolved',
    time: '03 Feb, 14:05',
    notes: 'Walkie-talkie handset replaced at crew lobby.',
  },
];

export const HELPLINES = [
  { id: 'hl-1', name: 'Railway Helpline (RailMadad)', number: '139', desc: '24×7 Integrated Railway Enquiry, Safety & Assistance', primary: true, color: 'navy' },
  { id: 'hl-2', name: 'Railway Security (RPF)', number: '182', desc: '24×7 RPF Security Emergency & Onboard Support', primary: true, color: 'navy' },
  { id: 'hl-3', name: 'Emergency Response (ERSS)', number: '112', desc: 'Chhattisgarh All-in-One Emergency Response', primary: true, color: 'gold' },
  { id: 'hl-4', name: 'Railway Accident Helpline', number: '1072', desc: 'Official Indian Railways Accident & Relief Control', primary: false, color: 'red' },
  { id: 'hl-5', name: 'SECR Bilaspur Control (BSP)', number: '07752-247202', desc: 'Bilaspur Division HQ Control & Crew Emergency Desk', primary: false, color: 'navy' },
  { id: 'hl-6', name: 'SECR Raipur Control (R)', number: '0771-2252200', desc: 'Raipur Division Railway Control & Station Enquiry', primary: false, color: 'navy' },
  { id: 'hl-7', name: 'SECR Nagpur Control (NGP)', number: '0712-2564141', desc: 'Nagpur Division Railway Control Desk', primary: false, color: 'navy' },
  { id: 'hl-8', name: 'Railway Vigilance Helpline', number: '155210', desc: 'Indian Railways Vigilance & Integrity Desk', primary: false, color: 'gold' },
  { id: 'hl-9', name: 'Ambulance (Sanjeevani 108)', number: '108', desc: 'Chhattisgarh 24×7 Medical & Accident Relief', primary: false, color: 'red' },
  { id: 'hl-10', name: 'Police Control Room', number: '100', desc: 'Chhattisgarh Police Emergency Dispatch', primary: false, color: 'navy' },
  { id: 'hl-11', name: 'Fire Brigade', number: '101', desc: '24×7 Fire & Rescue Emergency Services', primary: false, color: 'red' },
];

export const ANALYTICS_DATASETS = {
  'By Division': [
    { label: 'NR', full: 'Northern Division', value: 1248 },
    { label: 'CR', full: 'Central Division', value: 1076 },
    { label: 'WR', full: 'Western Division', value: 982 },
    { label: 'SR', full: 'Southern Division', value: 1021 },
    { label: 'ER', full: 'Eastern Division', value: 815 },
  ],
  'By Role': [
    { label: 'LP', full: 'Loco Pilots', value: 1410 },
    { label: 'ALP', full: 'Asst. Loco Pilots', value: 1320 },
    { label: 'TM', full: 'Train Managers', value: 1125 },
    { label: 'SC', full: 'Station Controllers', value: 890 },
    { label: 'CC', full: 'Crew Coordinators', value: 645 },
  ],
  'By Shift': [
    { label: 'Morn', full: '06:00 – 14:00', value: 1380 },
    { label: 'Aftn', full: '14:00 – 22:00', value: 1295 },
    { label: 'Night', full: '22:00 – 06:00', value: 1140 },
    { label: 'Stby', full: 'Standby Crew', value: 785 },
    { label: 'Rest', full: 'Mandatory Rest', value: 910 },
  ],
};

export const SHIFT_ROSTER = [
  { day: 'Tue, 04 Feb', shift: '08:00 – 16:00', duty: 'Station Control (SCL)', train: '12859 Gitanjali Exp', status: 'On Duty' },
  { day: 'Wed, 05 Feb', shift: '08:00 – 16:00', duty: 'Bilaspur – Raipur Run', train: '12834 Howrah–ADI Exp', status: 'Scheduled' },
  { day: 'Thu, 06 Feb', shift: '16:00 – 00:00', duty: 'Durg Crew Lobby', train: '15160 Sarnath Exp', status: 'Scheduled' },
  { day: 'Fri, 07 Feb', shift: 'Rest Day', duty: 'HQ Mandatory Rest', train: '—', status: 'Rest' },
];
