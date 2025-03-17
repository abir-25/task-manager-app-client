import { ArrowLeft } from "lucide-react";

type Props = {
  onGoback: () => void;
}

export const GoBackBtn = ({ onGoback }: Props) => {
  return (
    <div className="relative group w-max cursor-pointer" onClick={onGoback}>
      <div className='w-full text-white flex gap-2 items-center text-sm font-medium'>
        <ArrowLeft size={18} />
        Go back
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
    </div>
  )
}