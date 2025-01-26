// app/reset-password/[token]/page.tsx

import SetNewPassword from './SetNewPassword';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    return <SetNewPassword token={params.token} />;
}