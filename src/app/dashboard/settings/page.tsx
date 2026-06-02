"use client";

import { useState } from "react";
import { User, Bell, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Settings</h1>
      <p className="mb-7 text-ink-3">Manage your profile and preferences.</p>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex gap-1.5 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-[14px] font-semibold transition", tab === t.id ? "bg-navy text-white [&_svg]:text-gold" : "text-ink-2 hover:bg-surface")}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          {tab === "profile" && (
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-navy to-royal font-display text-xl font-bold text-gold">A</div>
                <button className="btn btn-outline btn-sm">Change photo</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="field-label">Full name</label><input className="field-input" defaultValue="Abdikarim Mataan" /></div>
                <div><label className="field-label">Email</label><input className="field-input" defaultValue="abdikarim@example.com" /></div>
                <div><label className="field-label">Country</label><input className="field-input" defaultValue="Ireland" /></div>
                <div><label className="field-label">Phone</label><input className="field-input" defaultValue="+353 ..." /></div>
              </div>
              <div className="mt-4"><label className="field-label">Bio</label><textarea rows={3} className="field-input resize-none" defaultValue="Data analytics learner and lifelong student." /></div>
              <button className="btn btn-navy mt-5">Save changes</button>
            </div>
          )}
          {tab === "account" && (
            <div className="max-w-md">
              <div className="mb-4"><label className="field-label">Current password</label><input type="password" className="field-input" placeholder="••••••••" /></div>
              <div className="mb-4"><label className="field-label">New password</label><input type="password" className="field-input" placeholder="••••••••" /></div>
              <div className="mb-4"><label className="field-label">Confirm new password</label><input type="password" className="field-input" placeholder="••••••••" /></div>
              <button className="btn btn-navy">Update password</button>
            </div>
          )}
          {tab === "notifications" && (
            <div className="flex flex-col gap-3">
              {["New course announcements", "Scholarship deadline reminders", "Lesson comment replies", "Promotions & offers"].map((n, i) => (
                <label key={n} className="flex items-center justify-between rounded-xl border border-line px-4 py-3.5">
                  <span className="text-[14.5px] text-ink-2">{n}</span>
                  <input type="checkbox" defaultChecked={i < 3} className="h-5 w-9 accent-royal" />
                </label>
              ))}
            </div>
          )}
          {tab === "preferences" && (
            <div className="max-w-md">
              <div className="mb-4"><label className="field-label">Interface language</label><select className="field-input"><option>Somali</option><option>English</option></select></div>
              <div className="mb-4"><label className="field-label">Subtitles</label><select className="field-input"><option>Somali</option><option>English</option><option>Off</option></select></div>
              <p className="text-[13px] text-ink-3">Theme (Light / Dark / System) is set from the toggle in the top navigation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
