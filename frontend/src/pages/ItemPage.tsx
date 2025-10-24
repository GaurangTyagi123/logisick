import ThemeToggle from "@/components/ThemeToggle"
import Button from "@/components/ui/button"
import { Large } from "@/components/ui/Typography"
import { Link, useParams } from "react-router-dom"
import logo from '@/assets/appicon.png';
import { Hourglass } from "@/assets/icons/Hourglass";
import { Origin } from "@/assets/icons/Origin";
import { Category } from "@/assets/icons/Category";
import { Package } from "@/assets/icons/Package";
import { useEffect, useState } from "react";
import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

function ItemPage() {
  const { SKU } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  useEffect(() => {
    const fetchItem = async (SKU: string) => {
      try {
        const res = await axinstance.get(`/v1/item/${SKU}`);
        if (res.status === 200) {
          const data = res.data.data.item;
          setItem(data);
        }
      }
      catch (err) {
        handleError(err)
      }
    }
    fetchItem(SKU as string)
  }, [SKU])
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-end gap-2 w-full h-10 px-2 mt-2">
        {/* Logo */}
        <Button
          asChild
          variant={'ghost'}
          title="Go to homepage"
          className="h-full p-0.5 w-36 aspect-square mr-auto flex items-center"
        >
          <Link to={{ pathname: '/' }}>
            <img
              src={logo}
              alt="applogo"
              className="h-full bg-ls-bg-900 p-0.5 rounded-md"
            />
            <Large>LogiSick</Large>
          </Link>
        </Button>
        {/* Theme toggle */}
        <ThemeToggle />
      </div>
      <div className=" dark:bg-ls-bg-dark-800 bg-ls-bg-300 h-120 w-120 rounded-2xl flex flex-col items-center gap-3 shadow-2xl shadow-ls-bg-700 dark:shadow-none  outline-2 jet-brains uppercase tracking-widest">
        <h1 className="jet-brains text-3xl mt-3">{SKU?.substring(25) || 'SKU'}</h1>

        <div className="p-3 flex flex-col h-full w-full self-baseline justify-evenly">
          <div className="px-5 py-3 flex  justify-between w-full border-y-2 border-ls-bg-700 dark:border-ls-bg-dark-500 rounded-1xl">
            <div className="flex space-x-2">
              <Package />
              <span>Item Name &rarr;</span>
            </div>
            <span>{item?.name}</span>
          </div>
          <div className="px-5 py-3 flex  justify-between w-full border-y-2 border-ls-bg-700 dark:border-ls-bg-dark-500 rounded-1xl">
            <div className="flex space-x-2">
              <Category />
              <span>Category &rarr;</span>
            </div>
            <span>Perishable</span>
          </div>
          <div className="px-5 py-3 flex  justify-between w-full border-y-2 border-ls-bg-700 dark:border-ls-bg-dark-500 rounded-1xl">
            <div className="flex space-x-2">
              <Origin />
              <span>Origin &rarr;</span>
            </div>
            <span>{item?.origin}</span>
          </div>
          <div className="px-5 py-3 flex  justify-between w-full border-y-2 border-ls-bg-700 dark:border-ls-bg-dark-500 rounded-1xl">
            <div className="flex space-x-2">
              <Hourglass />
              <span>Expiry Date &rarr;</span>
            </div>
            <span>{item?.expiresOn ? new Date(item.expiresOn).toLocaleDateString() : new Date().toLocaleString()}</span>
          </div>
        </div>

        <Button variant={"link"} className="mb-5" >
          <Link to={"/"} replace={true} className="outline p-3 rounded-xl dark:bg-ls-ter-800 bg-ls-ter-700 text-white king-julian">View More</Link>
        </Button>
      <img src={item?.infoQR} alt="qr code" className="aspect-square h-32 w-32 self-start absolute right-10"/>
      </div>
    </div>
  )
}

export default ItemPage
