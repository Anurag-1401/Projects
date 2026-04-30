export interface Room {
  id: number
  roomNo: string
  capacity: number
  occupied: number
  status: "available" | "partial" | "full"
  createdAt: string
  updatedAt: string

  students?: {
    name: string
    email: string
    year:number
    branch:string
  }[]
  
}

export interface Student {
  name: string
  email: string
  year: number
  branch: string
}

export interface RoomUI extends Room {
  wing: string
  students: Student[]
}

export function mapRoomToUI(room: Room): RoomUI {
  return {
    ...room,
    wing: room.roomNo.charAt(room.roomNo.length - 3),
    students: [] // later from assignment API
  }
}