import { Prisma } from "@prisma/client"
import * as DropdownMenu  from "@radix-ui/react-dropdown-menu"
import { MoreVertical } from "lucide-react"
import toast from "react-hot-toast"

type PaymentWithPlan = Prisma.PaymentGetPayload<{
  include: { plan: true }
}>

interface DropdownPaymentProps {
  payment: PaymentWithPlan;
  onViewDetails: (payment: PaymentWithPlan) => void;
}

const DropdownPayment = ({ payment, onViewDetails }: DropdownPaymentProps) => {

    const handleCopyReceiptId = () => {
        navigator.clipboard.writeText(payment.receiptId);
        toast.success("Receipt ID copied to clipboard!");
    }

    const items = [
        {
            label: "View Payment Details",
            action: () => onViewDetails(payment)
        },
        {
            label: "Copy Receipt ID",
            action: handleCopyReceiptId
        },
    ]

  return (
    <>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
            <button
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 transition-colors focus:outline-none cursor-pointer inline-block"
            >
                <MoreVertical className="h-4.5 w-4.5" />
            </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
            <DropdownMenu.Content
                align="end"
                sideOffset={5}
                className="z-50 w-44 rounded-xl border border-slate-800 bg-[#0e1320] p-1.5 shadow-2xl text-left focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
                {
                    items.map((item, index) => {
                        return (
                            <DropdownMenu.Item
                                key={index}
                                onClick={item.action}
                                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:bg-slate-900 focus:text-slate-100"
                            >
                                {item.label}
                            </DropdownMenu.Item>
                        )
                    })
                }
            </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    </>
  )
}

export default DropdownPayment
