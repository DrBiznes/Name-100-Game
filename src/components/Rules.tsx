import '../App.css';
import { Separator } from './ui/separator';

export function Rules() {
  return (
    <div className="text-lg pt-4 font-comic">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 font-['Chonburi']">
        <span className="material-icons text-header">gavel</span>
        Rules
      </h2>
      <div className="flex justify-center">
        <Separator className="my-2 w-2/3" />
      </div>
      <ul className="list-disc pl-6 text-foreground">
        <li className="mb-2">DONT USE GOOGLE</li>
        <li className="mb-2">CAN BE DEAD WOMEN</li>
        <li className="mb-2">THEY MUST HAVE A WIKIPEDIA PAGE</li>
        <li className="mb-2">No fictional characters must be a real ass women or a god</li>
        <li className="mb-2">Capitalization and accent marks don't matter</li>
        <li className="mb-2">Press ENTER or TAB to verify each name and automatically move the cursor to the next box</li>
      </ul>
    </div>
  );
} 