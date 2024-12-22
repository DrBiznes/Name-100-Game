import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { formatTime } from "@/lib/utils";

interface GameCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  elapsedTime: number;
  names: Array<{ index: number; name: string }>;
  onSubmitScore?: (username: string) => void;
}

export function GameCompletionDialog({
  isOpen,
  onClose,
  elapsedTime,
  names,
  onSubmitScore,
}: GameCompletionDialogProps) {
  const [username, setUsername] = React.useState("");

  const handleSubmit = () => {
    if (username.length === 3 && onSubmitScore) {
      onSubmitScore(username);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-xl">🎉 Congratulations!</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You completed the game in {formatTime(elapsedTime)}!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-sm text-muted-foreground">
              Enter a 3-letter username to submit your score to the leaderboard:
            </p>
            <InputOTP
              maxLength={3}
              value={username}
              onChange={setUsername}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground">
              Your score will only be visible on the leaderboard after submission.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={username.length !== 3}
          >
            Submit Score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 