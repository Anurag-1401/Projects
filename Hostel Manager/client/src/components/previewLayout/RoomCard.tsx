import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Room } from "@/lib/types";

interface Props {
  room: Room;
  onClick: () => void;
  index: number;
}

function getStatus(room: Room) {
  if (room.occupied === 0) return { label: "Available", color: "bg-status-available", ring: "ring-status-available/30" };
  if (room.occupied < room.capacity) return { label: "Partial", color: "bg-status-partial", ring: "ring-status-partial/30" };
  return { label: "Full", color: "bg-status-full", ring: "ring-status-full/30" };
}

const RoomCard = ({ room, onClick, index }: Props) => {
  const status = getStatus(room)

  const studentNames =
    room.students?.map((s) => s.name).join(", ") || "No students"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02, duration: 0.3 }}
          onClick={onClick}
          className={`glass-card-hover p-4 text-left w-full ring-2 ${status.ring} cursor-pointer group`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-semibold text-foreground">{room.roomNo}</span>
            <span className={`w-3 h-3 rounded-full ${status.color}`} />
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: room.capacity }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-md transition-colors ${
                  i < room.occupied ? status.color + "/80" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {room.occupied}/{room.capacity} occupied
          </p>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="font-medium">{room.roomNo} — {status.label}</p>
        <p className="text-xs text-muted-foreground">{studentNames}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RoomCard;
