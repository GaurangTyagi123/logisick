// import useAuthStore from '@/stores/useAuthStore';
import useModeStore from '@/stores/useModeStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import { H2 } from '@/components/ui/Typography';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Eye, EyeClosed } from '@/assets/icons/authenticatepage';
import useResetPassword from '@/hooks/useResetPassword';

function ResetPassword() {
    const resetToken = useParams().resetToken as string;
    const { resetPasswordFn: resetPassword, isPending: isResettingPassword } =
        useResetPassword();
    const [form, setForm] = useState({
        prevPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [valid, setValid] = useState<{
        password: boolean;
        confirmPassword: boolean;
    }>({
        password: true,
        confirmPassword: true,
    });
    const [visi, setVisi] = useState<boolean>(false);
    const navigate = useNavigate();
    const isDark = useModeStore().getTheme() === 'dark';

    const validatePassword = (password: string) => {
        if (password.trim().length >= 8) setValid({ ...valid, password: true });
        else setValid({ ...valid, password: false });
    };

    const validateConfirmPassword = (password: string) => {
        if (
            password.trim().length >= 8 &&
            password.trim() === form.password.trim()
        )
            setValid({ ...valid, confirmPassword: true });
        else setValid({ ...valid, confirmPassword: false });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (
            form.prevPassword.trim().length == 0 ||
            form.password.trim().length === 0 ||
            form.confirmPassword.trim().length === 0 ||
            form.password !== form.confirmPassword ||
            !resetToken
        ) {
            toast.error('All fields are required', { className: 'toast' });
        } else {
            resetPassword({ resetToken, form});
        }
    };

    useEffect(() => {
        console.log('checkig reset token');

        if (!resetToken.trim()) {
            console.log('noreset token');
            navigate('/');
        }
    }, [resetToken, navigate]);
    return (
        <div
            className={clsx(
                'w-full px-4 flex flex-col h-auto min-h-screen',
                isDark ? 'bg-zinc-900' : ''
            )}
        >
            <Navbar
                hide={{
                    userButton: true,
                    options: true,
                    loginRegisterButton: true,
                }}
            />

            <div className="grid p-4 place-items-center">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 max-w-2xl gap-4 p-4 border min-w-lg rounded-2xl shadow-2xl"
                    style={{ maxWidth: 'calc(100% - 2rem)' }}
                >
                    <H2 className="mb-2 text-center">Reset Password</H2>
                    <Label
                        title="Current Password field is required"
                        htmlFor="prevpassword"
                        className="grid"
                    >
                        Current Password *
                        <div className="flex items-center justify-between w-full gap-1">
                            <Input
                                placeholder="Enter Your Current Password"
                                type={visi ? 'text' : 'password'}
                                value={form.prevPassword}
                                name="prevpassword"
                                required
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        prevPassword: e.target.value.trim(),
                                    });
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
                    </Label>
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
                    <Label
                        title="Confirm password field is required"
                        htmlFor="confpassword"
                        className="grid"
                    >
                        Confirm New Password *
                        <div className="flex items-center justify-between w-full gap-1">
                            <Input
                                placeholder="Re-enter Your Password"
                                type={visi ? 'text' : 'password'}
                                value={form.confirmPassword}
                                name="confpassword"
                                required
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
                                *Password must be same as above
                            </span>
                        )}
                    </Label>
                    <Button type="submit" disabled={isResettingPassword}>
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
