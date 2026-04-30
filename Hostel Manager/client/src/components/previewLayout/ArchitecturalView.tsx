import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import RoomModal from "./RoomModal";
import { Room } from "@/lib/types";

interface Props {
  rooms: Room [];
  wings: string[];
  search: string;
  statusFilter: string;
}

function getStatus(room:Room) {
  if (room.occupied === 0) return { label: "Available", color: "bg-status-available", ring: "ring-status-available/40", glow: "shadow-[0_0_12px_hsl(var(--status-available)/0.3)]" };
  if (room.occupied < room.capacity) return { label: "Partial", color: "bg-status-partial", ring: "ring-status-partial/40", glow: "shadow-[0_0_12px_hsl(var(--status-partial)/0.3)]" };
  return { label: "Full", color: "bg-status-full", ring: "ring-status-full/40", glow: "shadow-[0_0_12px_hsl(var(--status-full)/0.3)]" };
}

function matchesFilter(room:Room, search: string, statusFilter: string) {
  if (search && !room.roomNo.toLowerCase().includes(search.toLowerCase())) return false;
  if (statusFilter === "available" && room.occupied >= room.capacity) return false;
  if (statusFilter === "partial" && (room.occupied === 0 || room.occupied === room.capacity)) return false;
  if (statusFilter === "full" && room.occupied < room.capacity) return false;
  return true;
}

const WING_ANGLES: Record<number, number[]> = {
  4: [-135, -45, 45, 135],
  5: [-144, -72, 0, 72, 144],
  6: [-150, -90, -30, 30, 90, 150],
};

  const ArchitecturalView = ({ rooms, wings, search, statusFilter }: Props) => {

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredWing, setHoveredWing] = useState<string | null>(null);

function getWingFromRoom(roomNo: string) {
  return roomNo.charAt(roomNo.length - 3)
}

function getFloor(roomNo: string) {
  return roomNo.charAt(roomNo.length - 4)
}

function getRoomIndex(roomNo: string) {
  return parseInt(roomNo.slice(-2))
}

  const wingRooms = useMemo<Record<string, Room[]>>(() => {
  const map: Record<string, Room[]> = {}

  wings.forEach((w) => {
    if (w === "ALL") return   // ✅ skip ALL

    map[w] = rooms
      .filter((r) => getWingFromRoom(r.roomNo) === w)
      .sort((a, b) => {
  return parseInt(a.roomNo.slice(-2)) - parseInt(b.roomNo.slice(-2));
})
  })

  return map
}, [rooms, wings])

const validWings = wings.filter(w => w !== "ALL")

const angles =
  WING_ANGLES[validWings.length] ||
  validWings.map((_, i) => (360 / validWings.length) * i - 90)

  return (
    <>
      <div className="relative w-full mx-auto" style={{ maxWidth: 800, aspectRatio: "1 / 1" }}>
        {/* Central hub */}
        <motion.div
          className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full gradient-primary flex items-center justify-center z-20"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 40px hsl(230 72% 56% / 0.3)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
        >
          <div className="text-center text-primary-foreground">
            <p className="font-display font-bold text-lg md:text-xl">Hostel</p>
            <p className="text-xs opacity-80">{rooms.length} rooms</p>
          </div>
        </motion.div>

        {/* Concentric guide rings */}
        {[30, 42].map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-border/20"
            style={{
              width: `${r * 2}%`,
              height: `${r * 2}%`,
              left: `${50 - r}%`,
              top: `${50 - r}%`,
            }}
          />
        ))}

        {/* Wings */}
        {validWings.map((wing, wi) => {
          const angleDeg = angles[wi];
          const angleRad = (angleDeg * Math.PI) / 180;
          const wingData = wingRooms[wing] || [];
          const isHighlighted = hoveredWing === null || hoveredWing === wing;

          // Group rooms by floor
          const floors: Record<string, Room[]> = {}

wingData.forEach((r) => {
  const floor = r.roomNo.charAt(r.roomNo.length - 4) // ✅ correct floor

  if (!floors[floor]) {
    floors[floor] = []
  }

  floors[floor].push(r)
})

// ✅ FIX ORDER (VERY IMPORTANT)
const floorOrder = ["G", "F", "S", "T"]

const floorKeys = floorOrder.filter(f => floors[f])

floorKeys.forEach((floor) => {
  floors[floor].sort(
    (a, b) => parseInt(a.roomNo.slice(-2)) - parseInt(b.roomNo.slice(-2))
  )
})

          // Wing label position
          const labelX = 50 + Math.cos(angleRad) * 47;
          const labelY = 50 + Math.sin(angleRad) * 47;

          return (
            <div
              key={wing}
              onMouseEnter={() => setHoveredWing(wing)}
              onMouseLeave={() => setHoveredWing(null)}
            >
              {/* Wing label */}
              <motion.div
                className="absolute z-10 font-display font-bold text-sm md:text-base whitespace-nowrap"
                style={{
                  left: `${labelX}%`,
                  top: `${labelY}%`,
                  transform: "translate(-50%, -50%)",
                  color: isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  transition: "color 0.3s",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: wi * 0.1 }}
              >
                Wing {wing}
              </motion.div>

              {/* Connector line (SVG overlay) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: isHighlighted ? 0.4 : 0.15, transition: "opacity 0.3s" }}
              >
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${50 + Math.cos(angleRad) * 44}%`}
                  y2={`${50 + Math.sin(angleRad) * 44}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Rooms along the petal */}
              {floorKeys.map((floorNum, fi) => {
                const floorRooms = floors[floorNum];
                const baseDistance = 18 + fi * 10;

                return floorRooms.map((room, ri) => {
                  const isMatch = matchesFilter(room, search, statusFilter);
                  const status = getStatus(room);

// 🔥 base direction (wing direction)
const baseX = Math.cos(angleRad)
const baseY = Math.sin(angleRad)

// 🔥 perpendicular direction (for parallel lines)
const sideX = Math.cos(angleRad + Math.PI / 2)
const sideY = Math.sin(angleRad + Math.PI / 2)

// spacing
const roomSpacing = 3.5
const floorSpacing = 8

// ✅ IMPORTANT: keep distance from center SAME
const startDistance = 28

// ✅ rooms go SIDEWAYS (straight line)
const roomOffset = (ri - (floorRooms.length - 1) / 2) * roomSpacing

// ✅ floors go ALONG dotted line
const floorOffset = fi * floorSpacing - 8

const cx =
  50 +
  baseX * (startDistance + floorOffset) +   // move along wing
  sideX * roomOffset                        // spread rooms straight

const cy =
  50 +
  baseY * (startDistance + floorOffset) +
  sideY * roomOffset

                  return (
                    <Tooltip key={room.roomNo}>
                      <TooltipTrigger asChild>
                        <motion.button
                          className={`absolute z-10 w-6 h-6 md:w-7 md:h-7 rounded-lg ring-2 ${status.ring} ${status.glow} cursor-pointer transition-all duration-300 flex items-center justify-center text-[8px] md:text-[10px] font-semibold font-display ${
                            isMatch && isHighlighted
                              ? `${status.color} text-primary-foreground`
                              : "bg-muted/40 text-muted-foreground/40"
                          }`}
                          style={{
                            left: `${cx}%`,
                            top: `${cy}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: isMatch && isHighlighted ? 1 : 0.7 }}
                          whileHover={{ scale: 1.3, zIndex: 30 }}
                          transition={{ delay: wi * 0.05 + fi * 0.03 + ri * 0.02, duration: 0.3 }}
                          onClick={() => isMatch && setSelectedRoom(room)}
                        >
                          {room.roomNo.slice(-2)}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="font-medium">{room.roomNo} — {status.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {room.occupied}/{room.capacity} occupied
                        </p>
                        {room.students?.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {room.students.map((s) => s.name).join(", ")}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                });
              })}
            </div>
          );
        })}
      </div>

      <RoomModal room={selectedRoom} open={!!selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
};

export default ArchitecturalView;
