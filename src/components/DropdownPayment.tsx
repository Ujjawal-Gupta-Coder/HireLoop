import { Prisma } from "@prisma/client"
import * as DropdownMenu  from "@radix-ui/react-dropdown-menu"
import { MoreVertical } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

type PaymentWithPlan = Prisma.PaymentGetPayload<{
  include: { plan: true }
}>

const DropdownPayment = ({payment}:{payment: PaymentWithPlan}) => {

    const handleItemClick = () => {
        toast("you click on dropdown action")
    }

    const items = [
        {
            label: "View Receipt",
            action: handleItemClick
        },
        {
            label: "View Payment Details",
            action: handleItemClick
        },
        {
            label: "Copy Receipt ID",
            action: handleItemClick
        },

    ]
  return (
    <>
        <Toaster />
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
                        return <DropdownMenu.Item
                            key={index}
                            className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:bg-slate-900 focus:text-slate-100"
                            >
                            <button onClick={item.action} className="cursor-pointer"> {item.label} </button>
                        </DropdownMenu.Item>
                    })
                }
            </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    </>
  )
}

export default DropdownPayment
