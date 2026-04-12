import * as XLSX from "xlsx";

import axios from 'axios'
import { toast } from '@/hooks/use-toast';
import { useData } from "@/hooks/DataContext";

export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  refetchAll: ReturnType<typeof useData>["refetchAll"]
) => {
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (evt) => {
    const data = new Uint8Array(evt.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log("Parsed Excel:", jsonData);

    try {
      const admin = JSON.parse(localStorage.getItem("adminCreds"));

      const response = await axios.post(`${baseURL}/student/bulk-upload`, {
        students: jsonData,
        admin_email: admin.Email
      });

      if (response.status === 200) {
        toast({ title: "Students Imported Successfully" });

        refetchAll.students(); // ✅ works now
      }

    } catch (err) {
      console.error(err);
      toast({
        title: "Import Failed",
        variant: "destructive"
      });
    }
  };

  reader.readAsArrayBuffer(file);
};