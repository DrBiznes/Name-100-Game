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
import { toast } from "sonner";
import { submitScore } from "@/services/leaderboardService";

interface GameCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  elapsedTime: number;
  names: Array<{ index: number; name: string }>;
  gameMode: string;
  onSubmitScore?: (username: string) => Promise<void>;
}

export function GameCompletionDialog({
  isOpen,
  onClose,
  elapsedTime,
  names,
  gameMode,
  onSubmitScore,
}: GameCompletionDialogProps) {
  const [username, setUsername] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (username.length !== 3) return;
    
    setIsSubmitting(true);
    try {
      await submitScore({
        username: username.toUpperCase(),
        completion_time: elapsedTime,
        completed_names: names.map(n => n.name),
        game_mode: gameMode,
      });
      
      toast.success("Score submitted successfully!");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit score");
    } finally {
      setIsSubmitting(false);
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
            disabled={username.length !== 3 || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 