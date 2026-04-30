import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";
import { Room } from "@/lib/types";

interface Props {
  rooms: Room[];
}

const RoomGrid = ({ rooms }: Props) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  if (rooms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-12 text-center"
      >
        <p className="text-muted-foreground text-lg">No rooms match your filters</p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={rooms.map((r) => r.roomNo).join(",")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
        >
          {rooms.map((room, i) => (
            <RoomCard key={room.roomNo} room={room} index={i} onClick={() => setSelectedRoom(room)} />
          ))}
        </motion.div>
      </AnimatePresence>
      <RoomModal room={selectedRoom} open={!!selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
};

export default RoomGrid;
