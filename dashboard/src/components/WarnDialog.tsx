import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ColorText from "./ColorText";

interface WarnDialogProps {
  onAccept?: any;
  openElement?: React.ReactNode;
  msg?: string;
  open?: boolean;
  setOpen?: any;
}

const WarnDialog: React.FC<WarnDialogProps> = ({
  onAccept = () => {},
  openElement = <Button size="sm">Alert</Button>,
  open = false,
  setOpen = () => {},
  msg = "Are you sure, you want to proceed ?",
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{openElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <ColorText variant="red" className="!text-lg ">
              Warning
            </ColorText>
          </DialogTitle>
          <DialogDescription>
            May be this step can not be undone.
          </DialogDescription>
        </DialogHeader>
        <ColorText className="!text-md">{msg}</ColorText>
        <DialogFooter>
          <div className="flex justify-end">
            <Button
              onClick={onAccept}
              size="sm"
              type="button"
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarnDialog;
