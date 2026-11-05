import { motion } from "framer-motion";

export default function SummaryCard({ title, count, icon: Icon, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5"
    >
      {/* Decorative Circle */}
      <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/5" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-base-content/50">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
            {count ?? 0}
          </p>

          {description && (
            <p className="mt-1 text-[11px] text-base-content/40">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={17} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
