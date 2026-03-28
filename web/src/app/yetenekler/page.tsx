"use client";
import { useState } from "react";
import { skills, skillCategories } from "@/lib/data";
import RunButton from "@/components/RunButton";
import { Search } from "lucide-react";
import { clsx } from "clsx";

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Yetenekler</h1>
        <p className="text-[var(--text-secondary)]">
          {skills.length} yetenek - Calistir butonuna tiklayarak yetenegi aktive edin. Cikti alt panelde goruntulenir.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Yetenek ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={clsx(
              "px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              !activeCategory
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]"
            )}
          >
            Tumu
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={clsx(
                "px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                activeCategory === cat.name
                  ? "text-white border-transparent"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]"
              )}
              style={activeCategory === cat.name ? { backgroundColor: cat.color } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {Object.entries(grouped).map(([category, categorySkills]) => {
        const catInfo = skillCategories.find((c) => c.name === category);
        return (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: catInfo?.color }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catInfo?.color }} />
              {category}
              <span className="text-xs text-[var(--text-muted)] font-normal">({categorySkills.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="card-hover bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <RunButton
                      command={`/sc agent ${skill.id}`}
                      label={skill.name}
                      variant="icon"
                      size="sm"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{skill.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] flex-1">{skill.description}</p>
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--text-muted)]">{skill.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)]">skills/{skill.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
