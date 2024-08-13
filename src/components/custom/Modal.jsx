import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Modal = ({ open, setOpen, title, description, children }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild> */}
        {/*   <Button variant="outline">{title}</Button> */}
        {/* </DialogTrigger> */}
        <DialogContent className="sm:max-w-[455px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* <DrawerTrigger asChild> */}
      {/*   <Button variant="outline">{title}</Button> */}
      {/* </DrawerTrigger> */}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription> {description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-6 mb-4">{children}</div>
        {/* <DrawerFooter className="pt-2"> */}
        {/*   <DrawerClose asChild> */}
        {/*     <Button variant="outline">Cancel</Button> */}
        {/*   </DrawerClose> */}
        {/* </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default Modal;
