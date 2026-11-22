# LOCO — Railway Staff Communication & Operations (Client Demo)

Interactive localhost demo featuring:
1. **LOCO Admin Control Center** (`?mode=admin`) — Desktop web portal with KPI overview, live Pending Approvals workflow, Division/Role/Shift Crew Analytics, Recent Notices, Document Activity table, Alerts, Quick Actions, and full Crew Directory (28 Chhattisgarh districts) with **Contact Photo Upload**.
2. **LOCO Android Crew App** (`?mode=mobile`) — Mobile-first PWA & interactive Android preview featuring Crew Dashboard, Operational Alerts, Today's Duty card, Emergency Helplines (`139`, `182`, `112`), Notices & Document Hub (HRMS Vault), and Crew Directory with **Contact Photo Upload**, one-tap Call, and WhatsApp.
3. **Live Sync Split Mode** (`?mode=split`) — Side-by-side Admin Portal + Android Crew App where every approval, notice, document upload, incident alert, or contact photo syncs immediately.

## Run Locally
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Direct Demo Links
- Admin Portal: `http://localhost:5173/?mode=admin`
- Android Crew App: `http://localhost:5173/?mode=mobile`
- Live Sync Split View: `http://localhost:5173/?mode=split`

## Share With a Client Outside Your PC
While `npm run dev` is running on port `5173`, run either:
- **Cloudflare Quick Tunnel (no account needed):** `npx cloudflared tunnel --url http://localhost:5173`
- **Same Wi-Fi / Mobile Testing:** Open the `Network: http://<your-local-ip>:5173/?mode=mobile` URL printed by Vite on any Android phone, then tap **Chrome Menu → Add to Home screen** to install LOCO as a standalone Android app.
