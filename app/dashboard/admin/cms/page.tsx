"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, FileText, HelpCircle, BookOpen, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "pages", label: "Pages", icon: FileText },
  { key: "faq",   label: "FAQ",   icon: HelpCircle },
  { key: "blog",  label: "Blog",  icon: BookOpen },
];

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("pages");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null); // null = closed, {} = new, {id,...} = edit
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cms?type=${activeTab}`);
      if (res.ok) setItems(await res.json());
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const openNew = () => {
    const defaults: any = { pages: { title: "", slug: "", content: "" }, faq: { question: "", answer: "", order: 0 }, blog: { title: "", slug: "", excerpt: "", content: "", published: false } };
    setForm(defaults[activeTab] || {});
    setEditing({});
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditing(item);
  };

  const closeEdit = () => { setEditing(null); setForm({}); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = editing?.id;
      const url = `/api/admin/cms/${activeTab === "pages" ? "pages" : activeTab === "faq" ? "faq" : "blog"}`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: editing.id, ...form } : form),
      });
      if (res.ok) { toast.success("Saved!"); closeEdit(); fetchData(); }
      else toast.error("Failed to save");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const typeMap: any = { pages: "pages", faq: "faq", blog: "blog" };
      const res = await fetch(`/api/admin/cms/${typeMap[activeTab]}/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchData(); }
      else toast.error("Failed to delete");
    } catch { toast.error("Failed to delete"); }
  };

  const activeConfig = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage pages, FAQs, and blog posts</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          New {activeConfig.label.slice(0, -1)}
        </button>
      </div>

      {/* Tab Pills */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-xl transition-colors",
              activeTab === key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <activeConfig.icon className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="font-medium">No {activeConfig.label.toLowerCase()} yet</p>
          <button onClick={openNew} className="mt-4 text-sm text-primary hover:underline">
            Create the first one
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/5 bg-card px-5 py-4 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg transition-all">
              <div className="flex-1 min-w-0">
                {activeTab === "pages" && (
                  <>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">/{item.slug} · Updated {new Date(item.updatedAt).toLocaleDateString()}</p>
                  </>
                )}
                {activeTab === "faq" && (
                  <>
                    <p className="font-medium">{item.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.answer}</p>
                  </>
                )}
                {activeTab === "blog" && (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.title}</p>
                      <Badge className={item.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">/{item.slug} · {new Date(item.createdAt).toLocaleDateString()}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-0 shrink-0">
                {activeTab === "blog" && (
                  <a href={`/blog/${item.slug}`} target="_blank" className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Eye className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => openEdit(item)}
                  className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Panel — slide-in overlay */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeEdit} />
          <div className="relative ml-auto flex h-full w-full max-w-xl flex-col bg-background border-l border-white/5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="font-semibold">{editing?.id ? "Edit" : "New"} {activeConfig.label.slice(0, -1)}</h2>
              <button onClick={closeEdit} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {activeTab === "pages" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</label>
                    <Input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug</label>
                    <Input value={form.slug || ""} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="about, privacy, terms" className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content (HTML)</label>
                    <Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={12} className="border-white/10 bg-white/5 font-mono text-sm resize-none" />
                  </div>
                </>
              )}
              {activeTab === "faq" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Question</label>
                    <Input value={form.question || ""} onChange={e => setForm({ ...form, question: e.target.value })} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Answer</label>
                    <Textarea value={form.answer || ""} onChange={e => setForm({ ...form, answer: e.target.value })} rows={5} className="border-white/10 bg-white/5 resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Display Order</label>
                    <Input type="number" value={form.order ?? 0} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="border-white/10 bg-white/5 w-24" />
                  </div>
                </>
              )}
              {activeTab === "blog" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</label>
                    <Input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug</label>
                    <Input value={form.slug || ""} onChange={e => setForm({ ...form, slug: e.target.value })} className="border-white/10 bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Excerpt</label>
                    <Textarea value={form.excerpt || ""} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="border-white/10 bg-white/5 resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content</label>
                    <Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} className="border-white/10 bg-white/5 resize-none" />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, published: !form.published })}
                      className={cn("h-6 w-11 rounded-full border-2 border-transparent transition-colors cursor-pointer", form.published ? "bg-primary" : "bg-muted")}
                    >
                      <div className={cn("h-5 w-5 rounded-full bg-background shadow-lg transition-transform", form.published ? "translate-x-5" : "translate-x-0")} />
                    </div>
                    <span className="text-sm font-medium">Published</span>
                  </label>
                </>
              )}
            </div>
            <div className="border-t border-white/5 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeEdit} className="h-9 px-4 rounded-xl border border-white/10 text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
