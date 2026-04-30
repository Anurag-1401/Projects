import { motion } from "framer-motion";

interface Props {
  wings: string[];
  activeWing: string;
  onWingChange: (wing: string) => void;
}

const WingTabs = ({ wings, activeWing, onWingChange }: Props) => (
  <div className="flex gap-2 p-1 glass-card w-fit">
    {wings.map((wing) => (
      <button
        key={wing}
        onClick={() => onWingChange(wing)}
        className="relative px-6 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200"
      >
        {activeWing === wing && (
          <motion.div
            layoutId="activeWing"
            className="absolute inset-0 gradient-primary rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className={`relative z-10 ${activeWing === wing ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {wing === "ALL" ? "All" : `Wing ${wing}`}
        </span>
      </button>
    ))}
  </div>
);

export default WingTabs;
