export function generateRooms(hostel, wing: string) {
  if (!hostel) return []

  const floorsMap = ["G", "F", "S", "T"] // standard labels

  const totalFloors = hostel.total_floors_per_wing
  const totalRooms = hostel.total_rooms_per_floor_per_wing

  const rooms = []

  // ✅ Only use required number of floors
  const floors = floorsMap.slice(0, totalFloors)

  floors.forEach((floor) => {
    for (let i = 1; i <= totalRooms; i++) {
      const roomNo = `SH${floor}${wing}${String(i).padStart(2, "0")}`

      const occupied = Math.floor(Math.random() * 4)

      rooms.push({
        id: `${hostel.id}-${wing}-${floor}-${i}`, // ✅ unique per hostel
        roomNo,
        capacity: 3,
        occupied,
        status:
          occupied === 0
            ? "available"
            : occupied < 3
            ? "partial"
            : "full",
        students: generateStudents(occupied)
      })
    }
  })

  return rooms
}

function generateStudents(count) {
  const names = [
    "Rahul Sharma", "Priya Patel", "Amit Kumar",
    "Sneha Gupta", "Rohan Joshi"
  ]

  return Array.from({ length: count }, (_, i) => ({
    name: names[i % names.length],
    email: `student${i}@hostel.com`,
    year: Math.floor(Math.random() * 4) + 1,
    branch: "CSE"
  }))
}