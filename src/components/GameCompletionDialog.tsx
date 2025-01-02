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
import { useNavigate } from 'react-router-dom';

interface GameCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  elapsedTime: number;
  onSubmitScore: (username: string, token: string) => Promise<number>;
}

export function GameCompletionDialog({
  isOpen,
  onClose,
  elapsedTime,
  onSubmitScore,
}: GameCompletionDialogProps) {
  const [username, setUsername] = React.useState("");
  const [token, setToken] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (username.length !== 3 || !token || isSubmitting) {
      return;
    }
    
    const allowedChars = /^[a-zA-Z!$?&()#@+=\/]+$/;
    if (!username.match(allowedChars)) {
      toast.error("Username can only contain letters and special characters: !$?&()#@+=/");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const scoreId = await onSubmitScore(username, token);
      navigate(`/scores/${scoreId}`);
    } catch (error) {
      // Error handling is done in the mutation
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible bg-background border-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-['Chonburi'] text-header">🎉 Congratulations!</DialogTitle>
          <DialogDescription className="text-base pt-2 font-['Alegreya'] text-foreground">
            You completed the game in {formatTime(elapsedTime)}!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-sm text-muted-foreground font-['Alegreya']">
              Enter a 3-letter username to submit your score to the leaderboard:
            </p>
            <p className="text-xs text-muted-foreground text-center font-['Alegreya']">
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
            <p className="text-xs text-muted-foreground font-['Alegreya']">
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
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="font-['Alegreya']"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={username.length !== 3 || !token || isSubmitting}
            className="font-['Alegreya']"
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 