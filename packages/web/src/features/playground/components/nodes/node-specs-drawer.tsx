import { Button } from "@/shared/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer"
export default function NodeSpecsDrawer() {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Right drawer */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <button className="nodrag cursor-pointer" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings2-icon lucide-settings-2">
                <path d="M14 17H5" /><path d="M19 7h-9" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            </button>
        </DrawerTrigger>
        <DrawerContent className="w-1/2 h-full">
          <div className="h-full w-full">
            <DrawerHeader>
              <DrawerTitle>Right Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides in from the right.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Perfect for shopping carts or settings panels.
              </p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}