import { addItemByBarcode } from '@/services/apiItem';
import { useMutation } from '@tanstack/react-query';
import { BrowserMultiFormatReader } from '@zxing/browser'
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'react-toastify';

function BarcodeScan({ setForm }: {
    setForm: Dispatch<SetStateAction<{
        name: string;
        organizationId: string;
        costPrice: number;
        sellingPrice: number;
        quantify: number;
        inventoryCategory: string;
        importance: "A" | "B" | "C";
        importedOn: Date;
        expiresOn?: Date;
        weight?: number;
        colour?: string;
        reorderLevel?: number;
        batchNumber?: number;
        origin?: string;
    }>>
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [barcode, setBarcode] = useState("");
    const { mutate: addItemByBarcodeFn } = useMutation({
        mutationFn: addItemByBarcode,
        onSuccess: (data) => {
            toast.success("Item found successfully");
            setForm((prev: {
                name: string;
                organizationId: string;
                costPrice: number;
                sellingPrice: number;
                quantify: number;
                inventoryCategory: string;
                importance: "A" | "B" | "C";
                importedOn: Date;
                expiresOn?: Date;
                weight?: number;
                colour?: string;
                reorderLevel?: number;
                batchNumber?: number;
                origin?: string;
            }) => {
                return { ...prev, ...data }
            })
            console.log(data)
        },
        onError: () => {
            toast.success("Item not found")
        }
    });

    const debouncedBarcode = useMemo(() => {
        return debounce(addItemByBarcodeFn, 5000);
    }, [addItemByBarcodeFn]) as ((searchTerm: string) => void) & {
        cancel: () => void;
    };
    useEffect(() => {
        if (!barcode.length) {

            const codeReader = new BrowserMultiFormatReader();
            codeReader.decodeFromVideoDevice(undefined, videoRef.current as HTMLVideoElement, (result) => {
                if (result) {
                    setBarcode(result.getText());
                }
            })
        }
        else {
            debouncedBarcode(barcode)
        }
        return () => {
            debouncedBarcode.cancel()
        }
    }, [videoRef, debouncedBarcode, barcode])
    return (
        <div className='flex flex-col items-center gap-2'>
            <video ref={videoRef} className='w-[50%]' />
            <input type="text" name="barcode" id="barcode" value={barcode} placeholder='No barcode detected' onChange={(e) => setBarcode(e.target.value)} className='uppercase tracking-wide'/>
        </div>
    );
}

export default BarcodeScan
