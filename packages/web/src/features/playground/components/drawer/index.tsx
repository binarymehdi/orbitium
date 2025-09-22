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
export default function DrawerDirections() {
  return (
    <div className="flex flex-wrap gap-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Bottom Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides up from the bottom.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                The default drawer direction. Perfect for mobile interfaces.
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
      {/* Top drawer */}
      <Drawer direction="top">
        <DrawerTrigger asChild>
          <Button variant="outline">Top</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Top Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides down from the top.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Useful for notifications or secondary actions.
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
      {/* Left drawer */}
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">Left</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="h-full w-full">
            <DrawerHeader>
              <DrawerTitle>Left Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides in from the left.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Great for navigation menus or sidebars.
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
      {/* Right drawer */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">Right</Button>
        </DrawerTrigger>
        <DrawerContent>
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