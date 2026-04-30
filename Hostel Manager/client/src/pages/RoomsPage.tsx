import { useState, useMemo, useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { Building2, LayoutGrid, Flower2 } from "lucide-react"

import WingTabs from "@/components/previewLayout/wingsTab";
import RoomGrid from "@/components/previewLayout/RoomGrid";
import SearchFilter from "@/components/previewLayout/searchFilter";
import StatusLegend from "@/components/previewLayout/statusLegend";
import ArchitecturalView from "@/components/previewLayout/ArchitecturalView";

import { useData } from "@/hooks/DataContext";
import { generateRooms } from "@/hooks/generateRooms";

export default function RoomsPage() {
  const { hostelId, wing } = useParams()
  const { hostels,Rooms ,RoomsAssigned} = useData()

  const admin = localStorage.getItem("adminCreds")

  const hostel = hostels.find(h => h.id === Number(hostelId))

  const [activeWing, setActiveWing] = useState<string>(wing || 'ALL')
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"architectural" | "grid">("architectural")


  const mergedRooms = useMemo(() => {
  if (!Rooms?.length) return []

  return Rooms.map((room) => {
    const assign = RoomsAssigned.find(
      (a) =>
        a.roomNo?.trim().toUpperCase() ===
        room.roomNo?.trim().toUpperCase()
    )

    let students = []

    // ✅ CASE 1: already structured students (BEST CASE)
    if (assign?.students?.length) {
      students = assign.students
    }

    // ✅ CASE 2: string → parse
    else if (assign?.allocatedTo) {
      try {
        const parsed = JSON.parse(assign.allocatedTo)

        students = parsed.map((name: string) => ({
          name,
          email: "N/A",
          year: 1,
          branch: "N/A"
        }))
      } catch (e) {
        console.error("PARSE ERROR:", assign.allocatedTo)
        students = []
      }
    }

    return {
      ...room,
      students,
      occupied: students.length,
      status:
        students.length === 0
          ? "available"
          : students.length < room.capacity
          ? "partial"
          : "full"
    }
  })
}, [Rooms, RoomsAssigned])


  useEffect(() => {
    if (wing) setActiveWing(wing)
  }, [wing])
  
 const filteredRooms = useMemo(() => {
  if (!Rooms || !hostel) return []

  return mergedRooms.filter((r) => {
    // only this hostel
    // if (r.hostelId !== hostel.id) return false

    // wing filter
    if (activeWing !== "ALL" && getWing(r.roomNo) !== activeWing)
      return false

    return true
  })
}, [Rooms, hostel, activeWing,mergedRooms])

 function getWing(roomNo: string) {
  return roomNo.charAt(roomNo.length - 3)
}

  if (!hostel) return <div>Hostel not found</div>

   const allWings = [
  "ALL",
  ...Array.from(
    { length: hostel.total_wings_per_hostel },
    (_, i) => String.fromCharCode(65 + i)
  )
]

  if(!admin) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            {hostel.name} - {activeWing === "ALL" ? "All Wings" : `Wing ${activeWing}`}
          </h1>

          <div className="flex gap-2">
            <button onClick={() => setViewMode("architectural")}>
              <Flower2 />
            </button>
            <button onClick={() => setViewMode("grid")}>
              <LayoutGrid />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between">
          {viewMode === "grid" && (
            <WingTabs
              wings={allWings}
              activeWing={activeWing}
              onWingChange={setActiveWing}
            />
          )}

          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        <StatusLegend />

        {/* Views */}
        {viewMode === "architectural" ? (

  <ArchitecturalView
    rooms={filteredRooms}
    wings={
      activeWing === "ALL"
        ? allWings.filter(w => w !== "ALL")   // ALL → all wings
        : [activeWing]                        // SINGLE → only one wing
    }
    search={search}
    statusFilter={statusFilter}
  />

) : (

  <RoomGrid rooms={filteredRooms} />

)}
      </div>
    </div>
  )
}