export function groupAttendanceByHostel(attendance, hostels) {
  const result = {}

  attendance.forEach((att) => {
    const hostelName = getHostelFromRoom(att.roomNo, hostels)

    if (!result[hostelName]) {
      result[hostelName] = []
    }

    result[hostelName].push(att)
  })

  return result
}

export function groupStudentsByWing(students) {
  const result = {}

  students.forEach((student) => {
    const wing = getWingFromRoom(student.roomNo)

    if (!result[wing]) {
      result[wing] = []
    }

    result[wing].push(student)
  })

  return result
}

export function groupRoomsByHostel(rooms, hostels) {
  const result = {}

  rooms.forEach((room) => {
    const hostel = getHostelFromRoom(room.roomNo, hostels)

    if (!result[hostel]) result[hostel] = []

    result[hostel].push(room)
  })

  return result
}

export function groupStudentsByHostel(students, hostels) {
  const result = {}

  students.forEach((student) => {
    const hostelName = getHostelFromRoom(student.roomNo, hostels)

    if (!result[hostelName]) {
      result[hostelName] = []
    }

    result[hostelName].push(student)
  })

  return result
}

export function getWingFromRoom(roomNo: string) {
  if (!roomNo) return "Unknown"
  return roomNo.split("-")[0]
}

export function getFloorFromRoom(roomNo: string) {
  if (!roomNo) return "Unknown"
  return roomNo.split("-")[1]
}

export function getRoomNumber(roomNo: string) {
  if (!roomNo) return "Unknown"
  return roomNo.split("-")[2]
}

export function getHostelFromRoom(roomNo: string, hostels) {
  if (!roomNo) return "Unknown"

  const wing = getWingFromRoom(roomNo)

  const hostel = hostels.find(h =>
    wing.startsWith(h.name[0])
  )

  return hostel ? hostel.name : "Unknown"
}