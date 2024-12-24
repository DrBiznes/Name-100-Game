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
import { Turnstile } from '@marsidev/react-turnstile'

interface GameCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  elapsedTime: number;
  onSubmitScore: (username: string, token: string) => Promise<void>;
}

export function GameCompletionDialog({
  isOpen,
  onClose,
  elapsedTime,
  onSubmitScore,
}: GameCompletionDialogProps) {
  const [username, setUsername] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (username.length !== 3 || !token) {
      toast.error("Please complete the verification");
      return;
    }
    
    const allowedChars = /^[a-zA-Z!$?&()#@+=\/]+$/;
    if (!username.match(allowedChars)) {
      toast.error("Username can only contain letters and special characters: !$?&()#@+=/");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmitScore(username, token);
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
            <p className="text-xs text-muted-foreground text-center">
              Use letters and special characters (!$?&()#@+=/)
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
          
          <div className="flex justify-center">
            <Turnstile
              siteKey="0x4AAAAAAA3Gr1pLBEs2-ACh"
              onSuccess={setToken}
              onError={() => {
                toast.error("Verification failed - please try again");
                setToken(null);
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={username.length !== 3 || !token || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 