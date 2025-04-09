import { useSidebar } from "@/components/ui/sidebar";
import { MenuSquareIcon } from "lucide-react";


const SidebarButtonTrigger = () => {
  const {open, setOpen} = useSidebar()
  return (
    <button onClick={() => setOpen(!open)}>
      <MenuSquareIcon />
    </button>
  )
  
}

export default SidebarButtonTrigger;
