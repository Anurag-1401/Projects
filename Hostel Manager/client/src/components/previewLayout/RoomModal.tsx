import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, GraduationCap, Building2 } from "lucide-react";
import { Room } from "@/lib/types";

interface Props {
  room: Room | null;
  open: boolean;
  onClose: () => void;
}

const RoomModal = ({ room, open, onClose }: Props) => {
  if (!room) return null;

  const available = room.capacity - room.occupied;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-3">
            <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            Room {room.roomNo}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Capacity</p>
            <p className="text-lg font-bold font-display text-foreground">{room.capacity}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Occupied</p>
            <p className="text-lg font-bold font-display text-foreground">{room.occupied}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-bold font-display text-status-available">{available}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium text-sm text-foreground">Students</h4>
          </div>

          {room.students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No students assigned</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {room.students.map((s, i) => (
                <div key={i} className="glass-card p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Mail className="w-3 h-3" /> {s.email}
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" /> Y{s.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{s.branch}</Badge>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;
