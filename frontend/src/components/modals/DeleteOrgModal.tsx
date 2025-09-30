import { useState } from 'react';
import Modal from '@/components/Modal';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Close } from '@/assets/icons/Close';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrg } from '@/services/apiOrganization';

/**
 * @component a modal for profilepage which prompts user to delete organization when clicked to do so
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @returns gives a components as a delete account modal to put somewhere
 */
function DeleteOrgModal({
    open,
    setOpen,
    orgId,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orgId: string | undefined;
}) {
    const [text, setText] = useState<string>('');
    const queryClient = useQueryClient();
    const { mutate: deleteOrgFn, isPending: isDeleting } = useMutation({
        mutationFn: deleteOrg,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            toast.success('Organization deleted successfully');
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    /**
     * @brief async function to handle the user request to delete account
     */
    async function handleDeleteAccount() {
        if (text.trim() == 'delete my organization' && orgId) {
            deleteOrgFn(orgId);
            setOpen(false);
        } else {
            toast.error('Enter the text first', { className: 'toast' });
        }
    }

    return (
        <Modal openModal={open}>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Delete My Organization</CardTitle>
                    <Button onClick={() => setOpen(false)}>
                        <Close />
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <Label
                        title="delete my account"
                        htmlFor="deleteme"
                        className="grid"
                    >
                        <span>
                            Enter "
                            <span className="text-red-500">
                                delete my organization
                            </span>
                            " in the input below to delete account
                        </span>
                        <Input
                            placeholder="Enter Your Email"
                            type="email"
                            value={text}
                            name="email"
                            required
                            className="text-sm md:text-md"
                            onChange={(e) => setText(e.target.value.trim())}
                        />
                    </Label>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || text.trim() !== 'delete my organization'}
                        variant={'destructive'}
                    >
                        Delete My Organization
                    </Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}

export default DeleteOrgModal;
