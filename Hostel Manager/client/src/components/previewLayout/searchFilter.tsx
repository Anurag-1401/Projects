import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

const SearchFilter = ({ search, onSearchChange, statusFilter, onStatusFilterChange }: Props) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search room number…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 glass-card border-border/50"
      />
    </div>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-[160px] glass-card border-border/50">
        <SelectValue placeholder="All Rooms" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Rooms</SelectItem>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="partial">Partially Filled</SelectItem>
        <SelectItem value="full">Full</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default SearchFilter;
