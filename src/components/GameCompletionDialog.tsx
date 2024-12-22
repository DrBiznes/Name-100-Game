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
import ConfettiExplosion from 'react-confetti-explosion';

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
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const confettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 250,
    width: 1600,
  };

  const handleSubmit = () => {
    if (username.length === 3 && onSubmitScore) {
      onSubmitScore(username);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ConfettiExplosion {...confettiProps} />
            </div>
          </div>
        )}
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