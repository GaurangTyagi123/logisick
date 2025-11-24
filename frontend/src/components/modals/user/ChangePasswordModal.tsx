import Modal from '@/components/Modal';
import Button from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Close } from '@/assets/icons/Close';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed } from '@/assets/icons/Authenticatepage';
import useUpdatePassword from '@/hooks/user/useUpdatePassword';

interface ChangePasswordProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @component a modal for profilepage which prompts user for change of password when clicks to change password
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @returns gives a components as a change password modal to put somewhere
 */
function ChangePasswordModal({ open, setOpen }: ChangePasswordProps) {
    const { updatePasswordFn: changePassword, isPending: isChangingPassword } =
        useUpdatePassword();
    // const { changePassword, isChangingPassword } = useAuthStore();
    const [form, setForm] = useState<{
        prevPassword: string;
        password: string;
        confirmPassword: string;
    }>({
        prevPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [valid, setValid] = useState<{
        prevPassword: boolean;
        password: boolean;
        confirmPassword: boolean;
    }>({
        prevPassword: true,
        password: true,
        confirmPassword: true,
    });
    const [visi, setVisi] = useState<boolean>(false);

    /**
     * @brief function to validate password field
     * @param password string value to check for constrains of password
     */
    const validatePrevPassword = (prevPassword: string) => {
        if (prevPassword.trim().length >= 8)
            setValid({ ...valid, prevPassword: true });
        else setValid({ ...valid, prevPassword: false });
    };

    /**
     * @brief function to validate password field
     * @param prevPassword string value to check for constrains of password
     */
    const validatePassword = (password: string) => {
        if (password.trim().length >= 8) setValid({ ...valid, password: true });
        else setValid({ ...valid, password: false });
    };

    /**
     * @brief function to validate confirm password field
     * @param password string value to check for constrains of confirm password
     */
    const validateConfirmPassword = (confirmPassword: string) => {
        if (confirmPassword.trim() === form.password.trim())
            setValid({ ...valid, confirmPassword: true });
        else setValid({ ...valid, confirmPassword: false });
    };

    /**
     * @brief function to handle the submittion of change password form
     */
    function handleSubmit() {
        if (
            form.prevPassword.trim() != '' &&
            form.password.trim() != '' &&
            form.password.length >= 8 &&
            form.confirmPassword === form.password
        ) {
            changePassword(form);
        } else {
            toast.error('All fields are required', { className: 'toast' });
            setForm({ confirmPassword: '', password: '', prevPassword: '' });
        }
    }

    return (
        <Modal openModal={open}>
            <Card className="max-w-screen">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Change Password</CardTitle>
                    <Button onClick={() => setOpen(false)} variant={"secondary"}>
                        <Close />
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-2">
                    {/* previous password */}
                    <Label
                        title="Previous Password field is required"
                        htmlFor="prevpassword"
                        className="grid"
                    >
                        Previous Password *
                        <div className="flex items-center justify-between w-full gap-1">
                            <Input
                                placeholder="Enter Your Previous Password"
                                type={visi ? 'text' : 'password'}
                                value={form.prevPassword}
                                name="prevpassword"
                                required
                                className="text-sm md:text-md"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        prevPassword: e.target.value.trim(),
                                    });
                                    if (e.target.value.trim() != '') {
                                        validatePrevPassword(
                                            e.target.value.trim()
                                        );
                                    } else {
                                        setValid({
                                            ...valid,
                                            prevPassword: true,
                                        });
                                    }
                                }}
                            />
                            <Button
                                onClick={() => setVisi(!visi)}
                                type="button"
                                variant="ghost"
                            >
                                {visi ? <Eye /> : <EyeClosed />}
                            </Button>
                        </div>
                        {!valid.prevPassword && (
                            <span className="text-xs text-red-500">
                                *Previous Password must be atleast 8 character
                            </span>
                        )}
                    </Label>
                    {/* new password */}
                    <Label
                        title="New Password field is required"
                        htmlFor="newpassword"
                        className="grid"
                    >
                        New Password *
                        <div className="flex items-center justify-between w-full gap-1">
                            <Input
                                placeholder="Enter Your New Password"
                                type={visi ? 'text' : 'password'}
                                value={form.password}
                                name="newpassword"
                                required
                                className="text-sm md:text-md"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        password: e.target.value.trim(),
                                    });
                                    if (e.target.value.trim() != '') {
                                        validatePassword(e.target.value.trim());
                                    } else {
                                        setValid({ ...valid, password: true });
                                    }
                                }}
                            />
                            <Button
                                onClick={() => setVisi(!visi)}
                                type="button"
                                variant="ghost"
                            >
                                {visi ? <Eye /> : <EyeClosed />}
                            </Button>
                        </div>
                        {!valid.password && (
                            <span className="text-xs text-red-500">
                                *Password must be atleast 8 character
                            </span>
                        )}
                    </Label>
                    {/* confirm passwrord */}
                    <Label
                        title="Confirm Password field is required"
                        htmlFor="confirmPassword"
                        className="grid"
                    >
                        Confirm Password *
                        <div className="flex items-center justify-between w-full gap-1">
                            <Input
                                placeholder="Re-enter Your Password"
                                type={visi ? 'text' : 'password'}
                                value={form.confirmPassword}
                                name="confirmPassword"
                                required
                                className="text-sm md:text-md"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        confirmPassword: e.target.value.trim(),
                                    });
                                    if (e.target.value.trim() != '') {
                                        validateConfirmPassword(
                                            e.target.value.trim()
                                        );
                                    } else {
                                        setValid({
                                            ...valid,
                                            confirmPassword: true,
                                        });
                                    }
                                }}
                            />
                            <Button
                                onClick={() => setVisi(!visi)}
                                type="button"
                                variant="ghost"
                            >
                                {visi ? <Eye /> : <EyeClosed />}
                            </Button>
                        </div>
                        {!valid.confirmPassword && (
                            <span className="text-xs text-red-500">
                                *Password must same as above
                            </span>
                        )}
                    </Label>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isChangingPassword}
                    >
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}

export default ChangePasswordModal;
